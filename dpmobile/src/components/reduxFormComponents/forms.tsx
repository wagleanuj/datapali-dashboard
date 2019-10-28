import React, { Dispatch } from "react"
import { ListRenderItemInfo, RefreshControl, View, TouchableOpacity } from "react-native"
import { FAB, TouchableRipple, Avatar, Appbar, Button as PaperButton } from "react-native-paper"
import ProgressBar from 'react-native-progress/Bar'
import { SwipeListView } from "react-native-swipe-list-view"
import { Button, Icon, Text, ThemedComponentProps, ThemeType, TopNavigation, withStyles, ButtonGroup } from "react-native-ui-kitten"
import { NavigationScreenProps } from "react-navigation"
import { Header } from "react-navigation-stack"
import { connect } from "react-redux"
import { Action } from "redux"
import { handleAddNewForm, handleDeleteForms } from "../../redux/actions/action"
import { DAppState, AvailableFormsState, FilledFormsState } from "../../redux/actions/types"
import { getRootFormById } from "../../redux/selectors/questionSelector"
import { textStyle } from "../../themes/style"
import _ from "lodash"
import { getValidQuestionsNumber, getResponderName, getFilledFormsTransformedData } from "../../redux/selectors/nodeSelector"
import { AppbarStyled } from "../Appbar.component"
import Modal from "react-native-modal";
import ScrollableTabView from "react-native-scrollable-tab-view"
import { Helper } from "../../redux/helper"
import { FlatList } from "react-native-gesture-handler"

type FormItemType = {
    formId: string,
    startedDate: string,
    rootId: string,
    count: any,
}
enum ViewModes {
    IN_PROGRESS = 'inprogress',
    COMPLETED = "completed",
    SUBMITTED = "submitted"

}
type ComponentProps = {
    filledFormsData: FormItemType[];
    availableForms: AvailableFormsState
    userId: string;
    handleAddNewForm: (root: string, userId: string) => void;
    handleDeleteForms: (formId: string[]) => void;

}
type FilledFormProps = FilledFormsState & ThemedComponentProps & NavigationScreenProps & ComponentProps
type FilledFormState = {
    fabVisible: boolean;
    selectedItems: { [key: string]: string[] };
    deleteModalVisible: boolean;
    toDelete: string[];
    currentView: ViewModes;
}
const routeName = "Forms";
export class FilledFormsComponent extends React.Component<FilledFormProps, FilledFormState>{
    private offset: number = 0;
    static navigationOptions = ({ navigation }) => {
        const selectedItems = navigation.getParam("selectedItems");
        const onDeleteHandler = navigation.getParam("onDeletePressed");
        const onCloseHandler = navigation.getParam("onClosePressed");
        const currentView = navigation.getParam("currentView");
        const currentSelection = selectedItems && selectedItems[currentView];
        return {
            header: () => {

                return currentSelection && currentSelection.length > 0 ?
                    <AppbarStyled>
                        <Appbar.Action icon="close" onPress={onCloseHandler} />
                        <Appbar.Content title={currentSelection.length + " Selected"} />
                        <Appbar.Action icon="delete" onPress={() => onDeleteHandler()} />
                    </AppbarStyled>
                    :
                    <TopNavigation
                        style={{ height: Header.HEIGHT }}
                        alignment='center'
                        title={"Datapali"}
                        subtitle={routeName}
                        subtitleStyle={textStyle.caption1}
                    />

            },
        }


    }
    state = {
        fabVisible: true,
        selectedItems: {},
        deleteModalVisible: false,
        toDelete: [],
        currentView: ViewModes.IN_PROGRESS
    }

    loadSurveyForm(id: string) {
        this.props.navigation.navigate("SurveyForm", {
            ffId: id,

        })
    }
    toggleItemSelection(id: string) {
        this.setState(prevState => {
            const cloned = _.clone(prevState.selectedItems);
            if (!cloned[this.state.currentView]) cloned[this.state.currentView] = [];
            let foundIndex = cloned[this.state.currentView].findIndex(item => item === id);
            if (foundIndex > -1) {
                cloned[this.state.currentView].splice(foundIndex, 1);
            }
            else {
                cloned[this.state.currentView].push(id);
            }
            return {
                selectedItems: cloned
            }
        }, () => {
            this.props.navigation.setParams({
                selectedItems: this.state.selectedItems,
                onDeletePressed: this.openDeleteModal.bind(this),
                onClosePressed: this.deselectAll.bind(this),
                currentView: this.state.currentView,
            })
        });
    }

    deselectAll() {
        this.setState(prevState => {
            const sel = _.clone(prevState.selectedItems);
            sel[this.state.currentView] = [];
            return {
                selectedItems: sel
            }
        }, () => {
            this.props.navigation.setParams({
                selectedItems: this.state.selectedItems,
                currentView: this.state.currentView,
            })
        })

    }
    renderItem = (item: ListRenderItemInfo<FormItemType>, viewName: ViewModes) => {
        const selected = this.state.selectedItems[viewName] && this.state.selectedItems[viewName].includes(item.item.formId);
        return <TouchableRipple key={'li-' + item.item.formId}
            onPress={() => this.loadSurveyForm(item.item.formId)}
            onLongPress={() => { }}
        >
            <FormListItem
                selected={selected}
                key={'fli-' + item.item.formId}
                formId={item.item.formId}
                rootId={item.item.rootId}
                createdDate={new Date(item.item.startedDate).toLocaleDateString()}
                onAvatarPress={this.toggleItemSelection.bind(this, item.item.formId)}
            />

        </TouchableRipple>

    }
    handleSend() {

    }
    refreshLoadedForms() {

    }
    handleAddNewForm() {
        const firstForm = Object.keys(this.props.availableForms)[0];
        this.props.handleAddNewForm(firstForm, this.props.userId)
    }

    handleDeleteForms(ids: string[]) {
        this.props.handleDeleteForms(ids);
    }

    openDeleteModal(ids: string[]) {
        this.setState({
            deleteModalVisible: true,
        })
    }

    confirmDeletion() {
        this.handleDeleteForms(this.state.selectedItems[this.state.currentView]);
        this.setState(prevState => {
            const sel = _.clone(prevState.selectedItems);
            sel[prevState.currentView] = [];
            return {
                selectedItems: sel,
                toDelete: [],
                deleteModalVisible: false,
            }

        }, () => {
            this.props.navigation.setParams({
                selectedItems: this.state.selectedItems
            })
        });
    }
    onScroll(event) {
        const currentOffset = event.nativeEvent.contentOffset.y;
        const direction = currentOffset > this.offset ? 'down' : 'up';
        this.offset = currentOffset;

        if (direction === 'down' && this.state.fabVisible) {
            this.setState({
                fabVisible: false,
            })
        } else if (direction === 'up' && !this.state.fabVisible) {
            this.setState({
                fabVisible: true
            })
        }
    }
    onScrollBegin(event) {
        if (this.state.fabVisible) {
            this.setState({
                fabVisible: false
            })
        }
    }

    onScrollEnd(event) {
        if (!this.state.fabVisible) {
            this.setState({
                fabVisible: true,
            })
        }
    }
    dismissDeleteModal() {
        this.setState(
            {
                deleteModalVisible: false,
            }
        )
    }
    getFilteredData(viewName: ViewModes) {
        switch (viewName) {
            case ViewModes.IN_PROGRESS:
                return this.props.filledFormsData.filter(item => Helper.getProgress(item.count) !== 1);
            case ViewModes.COMPLETED:
                return this.props.filledFormsData.filter(item => Helper.getProgress(item.count) === 1);
            case ViewModes.SUBMITTED:
                return this.props.filledFormsData.filter(item => item.submitted);


        }
    }

    getView(viewName: ViewModes) {
        const { themedStyle } = this.props;
        const data = this.getFilteredData(viewName);
        return (
            <>
                <View style={themedStyle.swipeListWrapper}>
                    <FlatList
                        onScrollBeginDrag={this.onScrollBegin.bind(this)}
                        onMomentumScrollEnd={this.onScrollEnd.bind(this)}
                        refreshControl={<RefreshControl
                            refreshing={false}
                            onRefresh={this.refreshLoadedForms.bind(this)}
                        />}
                        contentContainerStyle={themedStyle.swipeListContainer}
                        keyExtractor={item => item.formId}
                        data={data}
                        renderItem={(item) => this.renderItem(item, viewName)}
                    >
                    </FlatList>
                </View>
                {viewName === "inprogress" && <FAB
                    visible={this.state.fabVisible}
                    label={'Fill Form'}
                    onPress={this.handleAddNewForm.bind(this, undefined)}
                    style={this.props.themedStyle.fab}
                    icon="add" />}
            </>
        )
    }
    onTabChange(index: number){
        const values = Object.keys(ViewModes);
        const newView = ViewModes[values[index]];
        this.setState({
            currentView: newView
        }, ()=>{
            this.props.navigation.setParams({
                currentView: newView,
            })
        })
    }

    render() {
        const { themedStyle } = this.props;
        return (
            <>
                <Modal coverScreen={false} isVisible={this.state.deleteModalVisible}>
                    <View style={themedStyle.deleteModal}>
                        <Text category="s1">Are you sure you want to delete the selected forms?</Text>
                        <View style={themedStyle.deleteModalControls}>
                            <PaperButton
                                color={'#3366FF'}
                                icon="close"
                                onPress={this.dismissDeleteModal.bind(this)} >
                                No
                                    </PaperButton>
                            <PaperButton
                                color={'#3366FF'}
                                icon="check"
                                onPress={this.confirmDeletion.bind(this)}
                                style={themedStyle.deleteModalCancelButton}>
                                Yes
                                    </PaperButton>

                        </View>
                    </View>
                </Modal>
                <View style={this.props.themedStyle.container}>

                    <ScrollableTabView
                        style={{ borderWidth: 0, borderColor: '#00000000' }}

                        tabBarTextStyle={themedStyle.tabBarTextStyle}
                        tabBarActiveTextColor={this.props.theme['color-primary-default']}
                        tabBarUnderlineStyle={themedStyle.tabBarUnderlineStyle}
                        locked
                        onChangeTab={({i})=>this.onTabChange(i)}
                    >
                        <View tabStyle={themedStyle.tab} style={{ flex: 1, alignItems: 'center', borderWidth: 0 }} tabLabel="In Progress">
                            {this.getView('inprogress')}
                        </View>
                        <View style={this.props.themedStyle.container} tabLabel="Completed">
                            {this.getView('completed')}
                        </View>
                        <View style={this.props.themedStyle.container} tabLabel="Submitted">
                            {this.getView('submitted')}
                        </View>

                    </ScrollableTabView>
                </View>

            </>
        )
    }
}
export const FilledFormStyled = withStyles(FilledFormsComponent, (theme: ThemeType) => ({
    container: {
        flex: 1,
        backgroundColor: theme['background-basic-color-1'],
        // alignItems: 'center'
    },
    swipeListWrapper: {
        width: '100%',
        flex: 1,
    },
    swipeListContainer: {
        flexGrow: 1,
        paddingBottom: 60
    },

    item: {
        paddingHorizontal: 16,
        paddingVertical: 16,
        flexDirection: 'column',
        alignItems: 'flex-start',
    },
    fab: {
        position: 'absolute',
        // margin: 16,
        // right: "50%",
        bottom: 0,
        marginBottom: 4,
        backgroundColor: theme['color-primary-active'],
    },
    rowBack: {
        paddingHorizontal: 16,
        paddingVertical: 16,
        alignItems: 'center',
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingLeft: 15,
    },
    deleteModal: {
        padding: 16,
        flex: 0,
        flexDirection: "column",
        height: 150,
        backgroundColor: theme['background-basic-color-1'],
        borderRadius: 6
    },
    deleteModalControls: {
        marginTop: 20,
        display: 'flex',
        flexDirection: "row",
        justifyContent: "flex-end"
    },
    deleteModalCancelButton: {
        marginLeft: 10,
    },
    tabBarTextStyle: {
        color: theme['text-basic-color']
    },
    tabBarUnderlineStyle: {
        backgroundColor: theme['color-primary-default']
    },
    tab: {
        backgroundColor: theme['background-basic-color-1'],
    }
}));


const mapStateToProps = (state: DAppState, props: FilledFormProps) => {
    return {
        availableForms: state.rootForms.byId,
        filledFormsData: getFilledFormsTransformedData(state, props),
        userId: state.user.id
    }
}
const mapDispatchToProps = (dispatch: Dispatch<Action<any>>) => ({
    // handleRefresh: () => dispatch(handleNext()),
    handleAddNewForm: (rootId: string, userId: string) => dispatch(handleAddNewForm(rootId, userId)),
    handleDeleteForms: (formIds: string[]) => dispatch(handleDeleteForms(formIds))
});
export const FilledFormsList = connect(mapStateToProps, mapDispatchToProps)(FilledFormStyled);

type FormListItemProps = {
    formId: string;
    rootId: string;
    formName: string;
    responderName: string;
    progress: number;
    createdDate: string;
    counts: any;
    onPress: () => void;
    onAvatarPress: () => void;
    selected?: boolean;
} & ThemedComponentProps;

class FormListItem_ extends React.Component<FormListItemProps, {}>{
    get Progress() {
        const { counts } = this.props;
        return Helper.getProgress(counts);
    }
    getInitials(responderName: string) {
        if (!responderName) return "";
        const splitted = responderName.split(" ");
        return splitted.map(item => item.substring(0, 1)).join("");
    }

    getColorForName(responderName: string): string {
        if (!responderName) return undefined;
        let hash = 0;
        if (responderName.length === 0) return "0";
        for (var i = 0; i < responderName.length; i++) {
            hash = responderName.charCodeAt(i) + ((hash << 5) - hash);
            hash = hash & hash;
        }
        let color = '#';
        for (let i = 0; i < 3; i++) {
            let value = (hash >> (i * 8)) & 255;
            color += ('00' + value.toString(16)).substr(-2);
        }
        return color;

    }
    get Avatar() {
        return !this.props.selected ? <Avatar.Text color='white' style={{ backgroundColor: this.getColorForName(this.props.responderName) }}
            size={50}
            label={this.getInitials(this.props.responderName)} /> :
            <Avatar.Icon icon="check" size={50} />
    }
    render() {
        const { formName, responderName, progress, createdDate, onAvatarPress, selected } = this.props;
        const { themedStyle } = this.props;
        const containerStyle = _.clone(themedStyle.container);
        if (this.props.selected) {
            containerStyle.backgroundColor = this.props.theme["color-primary-300"]
        }

        return (
            <View style={containerStyle}>
                <View>
                    <TouchableOpacity onPress={onAvatarPress}>
                        {this.Avatar}
                    </TouchableOpacity >

                </View>
                <View
                    style={themedStyle.detailsContainer}>
                    <View>
                        <View style={themedStyle.responder}>
                            <Text category={'label'} appearance={'hint'} style={themedStyle.headingTitle}>Responder</Text>
                            <Text category={'s1'} style={themedStyle.responderText}>{responderName || "Unnamed"}</Text>
                        </View>
                        <View style={themedStyle.validation}>

                        </View>
                    </View>
                    <View style={themedStyle.info}>
                        <View>
                            <Text category={'label'} appearance={'hint'} style={themedStyle.headingTitle}>Form</Text>
                            <Text category={'s1'}>{formName}</Text>
                        </View>
                        <View>
                            <Text category={'label'} appearance={'hint'} style={themedStyle.headingTitle}>Creation Date</Text>
                            <Text category={'s1'}>{createdDate}</Text>
                        </View>
                        <View >
                            <Text category={'label'} appearance={'hint'} style={themedStyle.headingTitle}>Progress</Text>
                            <View style={{ marginTop: 10 }}>
                                <ProgressBar width={60} progress={this.Progress} />
                            </View>
                        </View>
                    </View>

                </View>
            </View>

        )
    }
}
const FormListItemStyled = withStyles(FormListItem_, theme => ({
    container: {
        flex: 1,
        flexDirection: 'row',
        backgroundColor: theme['background-basic-color-1'],
        borderColor: theme['background-basic-color-2'],
        padding: 10,
        alignItems: "center",
    },
    detailsContainer: {
        paddingLeft: 8,
        flexDirection: "column",
        flex: 1,

    },
    lastItem: {
        marginBottom: 60,
    },
    validation: {

    },
    responder: {

    },
    headingTitle: {

    },
    responderText: {

    },
    info: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    formDetails: {

    },
    progressDetails: {

    },
    dateDetails: {

    }
}))
const mapStateToFormItemProps = (state, props) => {
    const rootForm = getRootFormById(state, props);
    const counts = getValidQuestionsNumber(state, props);
    return {
        counts: counts,
        formName: rootForm.name || "Main Form",
        responderName: getResponderName(state, props),
    }
}
const FormListItem = connect(mapStateToFormItemProps, {})(FormListItemStyled);