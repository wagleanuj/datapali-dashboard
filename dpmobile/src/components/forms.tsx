import React from 'react';
import { ListRenderItemInfo, View, AsyncStorage } from 'react-native';
import { FAB } from 'react-native-paper';
import { List, ListItem, ThemedStyleType, ThemeType, withStyles, Layout, Menu, MenuItem, Button, Text, Icon, TopNavigation, TopNavigationAction } from 'react-native-ui-kitten';
import { AnswerStore } from '../answermachine';
import { StorageUtil } from '../storageUtil';
import { request, RootSection, getRandomId } from 'dpform';
import { Header } from 'react-navigation-stack';
import { textStyle } from '../themes/style';


type FormsProps = {

} & ThemedStyleType;

type FormsState = {
    data: any[],
    availableForms: string[],
    filledForms: { [key: string]: FilledForm },
    loadedRootForms: { [key: string]: RootSection },
    mainForm: RootSection,
    user: User,
}
type FormItemType = {
    title: string,
    startedDate: string,
}
const routeName = "Forms";
class FormsComponent extends React.Component<FormsProps, FormsState>{
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
    constructor(props: FormsProps) {
        super(props);
        this.state = {
            data: [

            ],
            availableForms: [],
            filledForms: {},
            mainForm: new RootSection(),
            loadedRootForms: {},
            user: null
        }
    }
    makeData(filledForms: { [key: string]: FilledForm }) {
        return Object.keys(filledForms).map(item => {
            return {
                title: filledForms[item].id,
                startedDate: filledForms[item].startedDate
            }
        })
    }
    async componentDidMount() {
        //load all the available forms
        let userInfo = await StorageUtil.getUserInfo();
        let user: User = {
            id: userInfo.userID,
            firstName: userInfo.firstName,
            lastName: userInfo.lastName,
            availableForms: userInfo.availableForms,
            filledForms: userInfo.filledForms,
        }
        let root = await StorageUtil.getForm(userInfo.availableForms[0]);
        // let root = RootSection.fromJSON(firstForm);
        let filledForms = await StorageUtil.getFilledForms(user.filledForms);
        let data = this.makeData(filledForms);

        this.setState({
            user: user,
            loadedRootForms: { [root.id]: root },
            filledForms: filledForms,
            data: data

        })
    }

    async handleAddNewForm(formId?: string) {
        if (!formId) formId = this.state.user.availableForms[0];
        let rootForm = this.state.loadedRootForms[formId];
        if (!rootForm) {
            let load = await StorageUtil.getForm(formId).catch(err => {
                console.log(err);
                return;
            });
            rootForm = RootSection.fromJSON(load);

        }
        let newFilledForm: FilledForm = {
            answerStore: new AnswerStore(rootForm).init(),
            completedDate: undefined,
            startedDate: new Date().getTime(),
            filledBy: this.state.user.id,
            formId: this.state.user.availableForms[0],
            id: getRandomId("filledform-")
        };
        await StorageUtil.saveFilledForm(newFilledForm);
        this.setState((prevState: FormsState) => {
            let filledForms = prevState.filledForms;
            filledForms[newFilledForm.id] = (newFilledForm)
            let loadedRootForms = prevState.loadedRootForms;
            if (!loadedRootForms[formId]) {
                loadedRootForms[formId] = rootForm;
            }
            return {
                filledForms: filledForms,
                loadedRootForms: loadedRootForms
            }


        }, this.loadSurveyForm.bind(this, (newFilledForm.id)));

    }
    async loadRootFormFromStorage(formId: string) {
        let form = await StorageUtil.getForm(formId);
        if (!form) return;
        this.setState((prevState: FormsState) => {
            let loadedRootForms = prevState.loadedRootForms;
            loadedRootForms[form.id] = form;

            return {
                loadedRootForms: loadedRootForms
            }
        });
        return form;
    }

    async loadSurveyForm(filledFormId: string) {
        let filledform = this.state.filledForms[filledFormId];
        let root = await this.loadRootFormFromStorage(filledform.formId);
        if (!filledform.answerStore.root) filledform.answerStore.setRoot(root);
        this.props.navigation.navigate("SurveyForm", {
            root: root,
            filledForm: filledform,
            user: this.state.user
        })
    }

    handleMenu(id: string) {
        console.log("long press");
    }
    async handleDeleteForm(id: string) {
        await StorageUtil.removeFilledForm([id]);

        this.setState((prevState: FormsState) => {
            let filledForms = prevState.filledForms;
            delete filledForms[id];
            return { filledForms: filledForms }
        })
    }

    renderItem = (item: ListRenderItemInfo<FormItemType>) => {
        return <ListItem
            style={this.props.themedStyle.item}
            title={item.item.title}
            description={item.item.startedDate}
            onPress={this.loadSurveyForm.bind(this, item.item.title)}
            onLongPress={this.handleMenu.bind(this, item.item.title)}
        >
            <View style={{ flex: 1, flexDirection: 'row', justifyContent: "flex-start" }}>
                <View style={{ flex: 1, flexDirection: "column" }}>
                    <Text style={{ flex: 1 }} numberOfLines={1}>{item.item.title}</Text>
                    <Text numberOfLines={1}>{new Date(item.item.startedDate).toLocaleDateString()}</Text>
                </View>
                <View style={{ alignSelf: "flex-end" }}>
                    <Button
                        onPress={this.handleDeleteForm.bind(this, item.item.title)}
                        status="danger"
                        style={{ width: 20, height: 20 }}
                        icon={() => <Icon name="close"></Icon>} />

                </View>

            </View>

        </ListItem>

    }

    render() {
        return (
            <Layout style={this.props.themedStyle.container}>

                <List
                    data={this.makeData(this.state.filledForms)}
                    renderItem={this.renderItem}
                />
                <FAB
                    onPress={this.handleAddNewForm.bind(this, undefined)}
                    style={this.props.themedStyle.fab}
                    icon="add" />

            </Layout>
        )
    }
}

export const FormList = withStyles(FormsComponent, (theme: ThemeType) => ({
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
    }
}));

export interface FilledForm {
    startedDate: number;
    completedDate: number;
    formId: string;
    filledBy: string;
    answerStore: AnswerStore;
    id: string;
}
export interface User {
    firstName: string;
    lastName: string;
    id: string;
    availableForms: string[],
    filledForms: string[]
}