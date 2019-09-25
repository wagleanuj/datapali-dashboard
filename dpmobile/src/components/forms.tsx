import { getRandomId, RootSection } from 'dpform';
import React from 'react';
import { ListRenderItemInfo, RefreshControl, View } from 'react-native';
import { FAB } from 'react-native-paper';
import { SwipeListView } from "react-native-swipe-list-view";
import { Button, Icon, ListItem, Text, ThemedComponentProps, ThemeType, TopNavigation, withStyles } from 'react-native-ui-kitten';
import { NavigationScreenProps } from 'react-navigation';
import { Header } from 'react-navigation-stack';
import { AnswerStore } from '../answermachine';
import { PaperPlaneIconFill } from '../assets/icons';
import { StorageUtil } from '../storageUtil';
import { textStyle } from '../themes/style';

type FormsProps = {

} & ThemedComponentProps & NavigationScreenProps;

type FormsState = {
    data: any[],
    availableForms: string[],
    filledForms: { [key: string]: FilledForm },
    loadedRootForms: { [key: string]: RootSection },
    mainForm: RootSection,
    user: User,
    refreshing: boolean,
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
            refreshing: true,
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
            data: data,
            refreshing: false,

        })
    }

    async refreshLoadedForms() {
        this.setState({
            refreshing: true
        });
        let availableForms = await StorageUtil.getAvailableFormIds();
        await this.loadRootFormFromStorage(availableForms);
        this.setState({
            refreshing: false,
        })
    }

    getAutoCompleteDataForPath(filledForm: FilledForm): (path: number[], iteration: number) => AutoCompleteItem[] {
        let formID = filledForm.formId;
        let filledFormID = filledForm.id;
        return function (path: number[], iteration: number) {
            let answers: { [key: string]: AutoCompleteItem } = {};
            Object.keys(this.state.filledForms).forEach(key => {
                let form = this.state.filledForms[key];
                if (formID === form.formId && form.id !== filledFormID) {
                    let answerStore = form.answerStore;
                    let answer = answerStore.getAnswerFor(path, iteration);
                    if (answer) {
                        if (!answers[answer]) answers[answer] = { text: answer, strength: 1 }
                        else {
                            answers[answer].strength++;
                        }
                    }
                }

            });
            let answerValues = Object.values(answers);
            answerValues.sort((a, b) => b.strength - a.strength);
            return answerValues;
        }.bind(this)

    }

    async handleAddNewForm(formId?: string) {
        if (!formId) formId = this.state.user.availableForms[0];
        let rootForm = this.state.loadedRootForms[formId];
        if (!rootForm) {
            let load = await StorageUtil.getForm(formId).catch(err => {
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
    async loadRootFormFromStorage(formId: string[]) {
        let forms = await StorageUtil.getForms(formId);
        if (!forms) return;
        this.setState((prevState: FormsState) => {
            let loadedRootForms = prevState.loadedRootForms;

            Object.keys(forms).forEach(item => {
                loadedRootForms[item] = forms[item];
            })

            return {
                loadedRootForms: loadedRootForms
            }
        });
        return forms;
    }

    async loadSurveyForm(filledFormId: string) {
        let filledform = this.state.filledForms[filledFormId];
        let roots = await this.loadRootFormFromStorage([filledform.formId]);
        let root = roots[filledform.formId];
        if (!filledform.answerStore.root) filledform.answerStore.setRoot(root);
        this.props.navigation.navigate("SurveyForm", {
            root: root,
            filledForm: filledform,
            user: this.state.user,
            getAutoCompleteDataForPath: this.getAutoCompleteDataForPath(filledform),
        })
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
    handleSend(id: string) {

    }

    render() {
        return (
            <View style={this.props.themedStyle.container}>

                <SwipeListView
                    refreshControl={<RefreshControl
                        refreshing={this.state.refreshing}
                        onRefresh={this.refreshLoadedForms.bind(this)}
                    />}
                    keyExtractor={item => item.title}
                    data={this.makeData(this.state.filledForms)}
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
export type AutoCompleteItem = {
    text: string,
    strength: number,
}