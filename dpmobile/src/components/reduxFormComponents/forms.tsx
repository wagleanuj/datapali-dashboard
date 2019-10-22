import React, { Dispatch } from "react"
import { ListRenderItemInfo, RefreshControl, View } from "react-native"
import { FAB, TouchableRipple } from "react-native-paper"
import ProgressBar from 'react-native-progress/Bar'
import { SwipeListView } from "react-native-swipe-list-view"
import { Button, Icon, Text, ThemedComponentProps, ThemeType, TopNavigation, withStyles } from "react-native-ui-kitten"
import { NavigationScreenProps } from "react-navigation"
import { Header } from "react-navigation-stack"
import { connect } from "react-redux"
import { Action } from "redux"
import { handleAddNewForm, handleDeleteForm } from "../../redux/actions/action"
import { AppState, AvailableFormsState, FilledFormsState } from "../../redux/actions/types"
import { getFIlledFormsTransformedData } from "../../redux/selectors/filledFormSelectors"
import { getRootFormById } from "../../redux/selectors/questionSelector"
import { textStyle } from "../../themes/style"

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
    handleDeleteForm: (formId: string) => void;

}
type FilledFormProps = FilledFormsState & ThemedComponentProps & NavigationScreenProps & ComponentProps
const routeName = "Forms";
export class FilledFormsComponent extends React.Component<FilledFormProps, {}>{
    static navigationOptions = {
        header: (props) => {

            return <TopNavigation
                style={{ height: Header.HEIGHT }}
                alignment='center'
                title={"Datapali"}
                subtitle={routeName}
                subtitleStyle={textStyle.caption1}
            />
        },

    }

    loadSurveyForm(id: string) {
        this.props.navigation.navigate("SurveyForm", {
            ffId: id,

        })
    }
    renderItem = (item: ListRenderItemInfo<FormItemType>) => {

        return <TouchableRipple key={'li-' + item.item.formId}
            onPress={() => this.loadSurveyForm(item.item.formId)}
        >
            <FormListItem
                isLastItem={item.index === this.props.filledFormsData.length - 1}
                key={'fli-' + item.item.title}
                formId={item.item.title}
                rootId={item.item.rootId}
                createdDate={new Date(item.item.startedDate).toLocaleDateString()}

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

    handleDeleteForm(id: string) {
        this.props.handleDeleteForm(id);
    }

    render() {
        return (
            <View style={this.props.themedStyle.container}>
                <View style={{ flex: 1, width: '100%' }}>
                    <SwipeListView
                        style={{ flex: 1 }}
                        closeOnRowBeginSwipe
                        closeOnRowOpen
                        closeOnScroll
                        useFlatList
                        refreshControl={<RefreshControl
                            refreshing={false}
                            onRefresh={this.refreshLoadedForms.bind(this)}
                        />}
                        keyExtractor={item => item.formId}
                        data={this.props.filledFormsData}
                        renderItem={this.renderItem}
                        renderHiddenItem={(data, rowMap) => (
                            <View key={"hid" + data.item.formId}
                                style={Object.assign({},
                                    this.props.themedStyle.rowBack, data.index === this.props.filledFormsData.length - 1 ?
                                    this.props.themedStyle.lastItem : {})}>
                                <Button
                                    size="giant"
                                    appearance={'ghost'}
                                    onPress={this.handleSend.bind(this, data.item.formId)}
                                    icon={(style) => (<Icon {...style} name="paper-plane" />)} />
                                <Button
                                    size="giant"
                                    appearance={'ghost'}
                                    onPress={() => this.handleDeleteForm(data.item.formId)}
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
                    label={'Fill Form'}
                    onPress={this.handleAddNewForm.bind(this, undefined)}
                    style={this.props.themedStyle.fab}
                    icon="add" />

            </View>
        )
    }
}
export const FilledFormStyled = withStyles(FilledFormsComponent, (theme: ThemeType) => ({
    container: {
        flex: 1,
        backgroundColor: theme['background-basic-color-2'],
        alignItems: 'center'
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
    lastItem: {
        marginBottom: 60
    }
}));


const mapStateToProps = (state: AppState, props: FilledFormProps) => {
    return {
        availableForms: state.rootForms.byId,
        filledFormsData: getFIlledFormsTransformedData(state, props),
        userId: state.user.id
    }
}
const mapDispatchToProps = (dispatch: Dispatch<Action<any>>) => ({
    // handleRefresh: () => dispatch(handleNext()),
    handleAddNewForm: (rootId: string, userId: string) => dispatch(handleAddNewForm(rootId, userId)),
    handleDeleteForm: (formId: string) => dispatch(handleDeleteForm(formId))
});
export const FilledFormsList = connect(mapStateToProps, mapDispatchToProps)(FilledFormStyled);

type FormListItemProps = {
    formId: string;
    formName: string;
    responderName: string;
    progress: number;
    createdDate: string;
    onPress: () => void;
    isLastItem: boolean;
} & ThemedComponentProps;

class FormListItem_ extends React.Component<FormListItemProps, {}>{
    render() {
        const { formName, responderName, progress, createdDate, isLastItem } = this.props;
        const { themedStyle } = this.props;
        return (
            <View
                style={Object.assign({}, themedStyle.container, isLastItem ? themedStyle.lastItem : {})}>
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
                        <View style={{marginTop: 10}}>
                            <ProgressBar width={60} progress={0.5} />
                        </View>
                    </View>
                </View>

            </View>
        )
    }
}
const FormListItemStyled = withStyles(FormListItem_, theme => ({
    container: {
        padding: 10,
        flexDirection: "column",
        backgroundColor: theme['background-basic-color-1'],
        borderColor: theme['background-basic-color-2'],
        borderWidth: 1,
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
    return {
        formName: rootForm.name || "Main Form",
    }
}
const FormListItem = connect(mapStateToFormItemProps, {})(FormListItemStyled);