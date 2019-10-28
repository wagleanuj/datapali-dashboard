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
import { getFIlledFormsTransformedData } from "../../redux/selectors/filledFormSelectors"
import { getRootFormById } from "../../redux/selectors/questionSelector"
import { textStyle } from "../../themes/style"
import _ from "lodash"
import { getValidQuestionsNumber, getResponderName } from "../../redux/selectors/nodeSelector"
import { AppbarStyled } from "../Appbar.component"
import Modal from "react-native-modal";

type FormItemType = {
    formId: string,
    startedDate: string,
    rootId: string,
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
    selectedItems: string[];
    deleteModalVisible: boolean;
    toDelete: string[];
}
const routeName = "Forms";
export class FilledFormsComponent extends React.Component<FilledFormProps, FilledFormState>{
    private offset: number = 0;
    static navigationOptions = ({ navigation }) => {
        const selectedItems = navigation.getParam("selectedItems");
        const onDeleteHandler = navigation.getParam("onDeletePressed");
        const onCloseHandler = navigation.getParam("onClosePressed");
        return {
            header: () => {

                return selectedItems && selectedItems.length > 0 ? <AppbarStyled>
                    <Appbar.Action icon="close" onPress={onCloseHandler} />
                    <Appbar.Content title={selectedItems.length + " Selected"} />
                    <Appbar.Action icon="delete" onPress={()=>onDeleteHandler(selectedItems)} />
                </AppbarStyled> :
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
        selectedItems: [],
        deleteModalVisible: false,
        toDelete: []
    }

    loadSurveyForm(id: string) {
        this.props.navigation.navigate("SurveyForm", {
            ffId: id,

        })
    }
    toggleItemSelection(id: string) {
        this.setState(prevState => {
            let cloned = prevState.selectedItems.slice();
            let foundIndex = cloned.findIndex(item => item === id);
            if (foundIndex > -1) {
                cloned.splice(foundIndex, 1);
            }
            else {
                cloned.push(id);
            }
            return {
                selectedItems: cloned
            }
        }, () => {
            this.props.navigation.setParams({
                selectedItems: this.state.selectedItems,
                onDeletePressed: this.openDeleteModal.bind(this),
                onClosePressed: this.deselectAll.bind(this)
            })
        });
    }

    deselectAll() {
        this.setState({
            selectedItems: []
        }, () => {
            this.props.navigation.setParams({
                selectedItems: this.state.selectedItems,

            })
        })

    }
    renderItem = (item: ListRenderItemInfo<FormItemType>) => {

        return <TouchableRipple key={'li-' + item.item.formId}
            onPress={() => this.loadSurveyForm(item.item.formId)}
            onLongPress={() => { }}
        >
            <FormListItem
                selected={this.state.selectedItems.includes(item.item.formId)}
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
            toDelete: ids,
        })
    }

    confirmDeletion(){
        this.handleDeleteForms(this.state.toDelete);
        this.setState({
            selectedItems: [],
            toDelete:[],
            deleteModalVisible: false,
        },()=>{
            this.props.navigation.setParams({
                selectedItems: []
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

    render() {
        const { themedStyle } = this.props;
        return (


            <>
                <Modal coverScreen={false} isVisible={this.state.deleteModalVisible}>
                    <View style={themedStyle.deleteModal}>
                        <Text category="s1">Are you sure you want to delete the selected forms?</Text>
                        <View style={themedStyle.deleteModalControls}>
                            <PaperButton icon="close" onPress={this.dismissDeleteModal.bind(this)} >No</PaperButton>
                            <PaperButton icon="check" onPress={this.confirmDeletion.bind(this)} style={themedStyle.deleteModalCancelButton}>Yes</PaperButton>

                        </View>
                    </View>
                </Modal>
                <View style={this.props.themedStyle.container}>

                    <View style={themedStyle.swipeListWrapper}>
                        <SwipeListView
                            closeOnRowBeginSwipe
                            closeOnRowOpen
                            closeOnScroll
                            useFlatList
                            onScrollBeginDrag={this.onScrollBegin.bind(this)}
                            onMomentumScrollEnd={this.onScrollEnd.bind(this)}
                            refreshControl={<RefreshControl
                                refreshing={false}
                                onRefresh={this.refreshLoadedForms.bind(this)}
                            />}
                            contentContainerStyle={themedStyle.swipeListContainer}
                            keyExtractor={item => item.formId}
                            data={this.props.filledFormsData}
                            renderItem={this.renderItem}
                            renderHiddenItem={(data, rowMap) => (
                                <View key={"hid" + data.item.formId}
                                    style={this.props.themedStyle.rowBack}>
                                    <Button
                                        size="giant"
                                        appearance={'ghost'}
                                        onPress={this.handleSend.bind(this, data.item.formId)}
                                        icon={(style) => (<Icon {...style} name="paper-plane" />)} />
                                    <Button
                                        size="giant"
                                        appearance={'ghost'}
                                        onPress={() => this.openDeleteModal([data.item.formId])}
                                        icon={(style) => (<Icon {...style} name="trash-2" />)} />
                                </View>
                            )}
                            stopLeftSwipe={75 * 1.15}
                            stopRightSwipe={-75 * 1.15}
                            leftOpenValue={75}
                            rightOpenValue={-75}
                        >
                        </SwipeListView>
                    </View>


                    <FAB
                        visible={this.state.fabVisible}
                        label={'Fill Form'}
                        onPress={this.handleAddNewForm.bind(this, undefined)}
                        style={this.props.themedStyle.fab}
                        icon="add" />


                </View>
            </>
        )
    }
}
export const FilledFormStyled = withStyles(FilledFormsComponent, (theme: ThemeType) => ({
    container: {
        flex: 1,
        backgroundColor: theme['background-basic-color-2'],
        alignItems: 'center'
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
    }

}));


const mapStateToProps = (state: DAppState, props: FilledFormProps) => {
    return {
        availableForms: state.rootForms.byId,
        filledFormsData: getFIlledFormsTransformedData(state, props),
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
        let filled = 0;
        let required = 0;
        Object.keys(counts).forEach((key) => {
            const c = counts[key];
            filled += c.filled;
            required += c.required;
        })
        return filled / required;
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
        return !this.props.selected ? <Avatar.Text style={{ color: 'white', backgroundColor: this.getColorForName(this.props.responderName) }}
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