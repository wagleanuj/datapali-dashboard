import { RootSection } from "dpform"
import React, { Dispatch } from "react"
import { ListRenderItemInfo, RefreshControl, View } from "react-native"
import { FAB } from "react-native-paper"
import { SwipeListView } from "react-native-swipe-list-view"
import { Button, Icon, ListItem, Text, ThemedComponentProps, ThemeType, TopNavigation, withStyles } from "react-native-ui-kitten"
import { NavigationScreenProps } from "react-navigation"
import { Header } from "react-navigation-stack"
import { connect } from "react-redux"
import { Action } from "redux"
import { handleAddNewForm, handleJump, handleNext } from "../redux/actions/action"
import { AppState, AvailableFormsState, FilledFormsState } from "../redux/actions/types"
import { getAvailableForms } from "../redux/selectors/availableFormSelector"
import { getFilledFormsState } from "../redux/selectors/filledFormSelectors"
import { textStyle } from "../themes/style"
type FormItemType = {
    title: string,
    startedDate: string,
}
type ComponentProps = {
    filledForms: FilledFormsState;
    availableForms: AvailableFormsState
    userId: string;
    handleAddNewForm: (root: RootSection, userId: string) => void;

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
    constructor(props: FilledFormProps) {
        super(props);
    }
    loadSurveyForm(id: string) {
        this.props.navigation.navigate("SurveyForm", {
            id: id,
            // root: root,
            // filledForm: filledform,
            // user: this.state.user,
            // getAutoCompleteDataForPath: this.getAutoCompleteDataForPath(filledform),
        })
    }
    renderItem = (item: ListRenderItemInfo<FormItemType>) => {
        return <ListItem
            style={this.props.themedStyle.item}
            onPress={this.loadSurveyForm.bind(this, item.item.title)}
        >
            <View key={"li-content" + item.item.title} style={{ flex: 1, flexDirection: 'row', justifyContent: "flex-start" }}>
                <View style={{ flex: 1, flexDirection: "column" }}>
                    <Text style={{ flex: 1 }} numberOfLines={1}>{item.item.title}</Text>
                    <Text numberOfLines={1}>{new Date(item.item.startedDate).toLocaleDateString()}</Text>
                </View>
            </View>

        </ListItem>

    }
    handleSend() {

    }
    refreshLoadedForms() {

    }
    handleAddNewForm() {
        const firstForm = this.props.availableForms[Object.keys(this.props.availableForms)[0]]
        this.props.handleAddNewForm(firstForm, this.props.userId)
    }
    handleDeleteForm(id: string) {

    }
    makeData(filledForms: FilledFormsState) {
        return Object.keys(filledForms).map(item => {
            return {
                title: filledForms[item].id,
                startedDate: filledForms[item].startedDate
            }
        })
    }

    render() {
        return (
            <View style={this.props.themedStyle.container}>

                <SwipeListView
                    refreshControl={<RefreshControl
                        refreshing={false}
                        onRefresh={this.refreshLoadedForms.bind(this)}
                    />}
                    keyExtractor={item => item.title}
                    data={this.makeData(this.props.filledForms)}
                    renderItem={this.renderItem}
                    renderHiddenItem={(data, rowMap) => (
                        <View key={"hid" + data.item.title} style={this.props.themedStyle.rowBack}>
                            <Button
                                size="giant"
                                appearance={'ghost'}
                                onPress={this.handleSend.bind(this, data.item.title)}
                                icon={(style) => (<Icon {...style} name="paper-plane" />)} />
                            <Button
                                size="giant"
                                appearance={'ghost'}
                                onPress={this.handleDeleteForm.bind(this, data.item.title)}
                                icon={(style) => (<Icon {...style} name="trash-2" />)} />
                        </View>
                    )}
                    leftOpenValue={75}
                    rightOpenValue={-75}
                >
                </SwipeListView>

                <FAB
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
    },
    item: {
        marginVertical: 8,
        marginHorizontal: 8,
        paddingHorizontal: 16,
        paddingVertical: 16,
        borderRadius: 8,
        flexDirection: 'column',
        alignItems: 'flex-start',
    },
    fab: {
        position: 'absolute',
        margin: 16,
        right: 0,
        bottom: 0,
        backgroundColor: theme['color-primary-active']
    },
    rowBack: {
        marginVertical: 8,
        marginHorizontal: 8,
        paddingHorizontal: 16,
        paddingVertical: 16,
        borderRadius: 8,
        alignItems: 'center',
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingLeft: 15,
    }
}));


const mapStateToProps = (state: AppState, props:FilledFormProps) => {
    const formId = props.navigation.getParam("id");
    return {
        filledForms: getFilledFormsState(state, props),
        availableForms : getAvailableForms(state, props),
        userId: state.user.id
    }
}
const mapDispatchToProps = (dispatch: Dispatch<Action<any>>) => ({
    handleRefresh: () => dispatch(handleNext()),
    handleAddNewForm: (root: RootSection, userId: string) => dispatch(handleAddNewForm(root, userId)),
    handleDeleteForm: (i: number) => dispatch(handleJump(i))
});
export const FilledFormsList = connect(mapStateToProps, mapDispatchToProps)(FilledFormStyled);