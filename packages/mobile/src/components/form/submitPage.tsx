import ApolloClient from 'apollo-boost';
import gql from 'graphql-tag';
import { toPath } from 'lodash';
import React from 'react';
import { FlatList, ToastAndroid, View } from 'react-native';
import { Appbar, Avatar, Button } from 'react-native-paper';
import { Icon, ListItem, Text, ThemedComponentProps, TopNavigation, TopNavigationAction, withStyles } from 'react-native-ui-kitten';
import { NavigationScreenProps } from "react-navigation";
import { Header } from 'react-navigation-stack';
import { connect } from 'react-redux';
import { Action, Dispatch } from 'redux';
import { APP_CONFIG } from '../../config';
import { KEY_NAVIGATION_BACK } from '../../navigation/constants';
import { handleMarkFormAsSubmitted } from '../../redux/actions/action';
import { DAppState } from '../../redux/actions/types';
import { Helper } from '../../redux/helper';
import { getUserToken } from '../../redux/selectors/authSelector';
import { getFilledFormById } from '../../redux/selectors/filledFormSelectors';
import { getValidQuestionsNumber } from '../../redux/selectors/nodeSelector';
import { getFilledFormValues, getRootFormById } from '../../redux/selectors/questionSelector';
import { textStyle } from '../../themes/style';
import { AppbarStyled } from '../Appbar.component';
const SUBMIT = gql`
mutation SaveForm($filledForm: FilledFormInput!){
    saveFilledForm(filledForm: $filledForm){
        completedDate
    }
}
`
type SubmitPageComponentProps = {
    formId: string;
    rootId: string;
    counts: any;
    startedDate: number;
    values: any;
    authToken: string;
    markFormAsSubmitted: (formIds:string[])=>void;

} & ThemedComponentProps & NavigationScreenProps;
class SubmitPageComponent extends React.Component<SubmitPageComponentProps, {}>{
    static navigationOptions = (props) => {
        const goBack = () => props.navigation.goBack(KEY_NAVIGATION_BACK);
        return {
            header: props =>
                <AppbarStyled>
                    <Appbar.BackAction  onPress={goBack}></Appbar.BackAction>
                    <Appbar.Content
                        subtitle={"Submit Form"}
                        title={"Datapali"}
                        titleStyle={{ textAlign: "center", fontSize: 16 }}
                        subtitleStyle={{ textAlign: "center", }}
                    />
                </AppbarStyled>
        }
    }
    get Progress() {
        return Helper.getProgress(this.props.counts);
    }

    get UnfilledItems() {
        const unfilled = [];
        Object.values(this.props.counts).forEach((item: any) => {
            unfilled.push(...item.unfilled);
        })
        return unfilled;
    }

    get ValidationSuccessResult() {
        return <View style={this.props.themedStyle.successResult}>
            <Avatar.Icon icon="check" size={100} />

            <Text category="s1"> Successfully validated.</Text>

        </View>
    }
    getNumericPathAndQuestionTitle(stringPath: string, rootForm: any) {
        const lPath = toPath(stringPath);
        const root = rootForm[this.props.rootId];
        let currentParent = root;
        let numberPath = "";
        lPath.forEach(p => {
            if (typeof (p) === "string" && !isNaN(Number(p))) {
                const dupe = this.props.counts[currentParent.id].dupe;
                if ((numberPath !== "" && dupe !== -1)) numberPath += "."
                if (dupe !== -1) numberPath += (Number(p) + 1);
            } else {
                const ind: number = currentParent.childNodes.findIndex(item => item === p);
                if (ind > -1) {
                    if (numberPath !== "") numberPath += "."
                    numberPath += (ind + 1).toString();
                    currentParent = rootForm[p];
                }
            }
        });
        return {
            path: numberPath,
            text: currentParent.questionContent.content
        };
    }
    renderItem(item) {
        return (
            <ListItem
                title={item.item.path}
                description={item.item.text}
            />
        )
    }
    get UnfilledList() {
        return (
            <FlatList
                contentContainerStyle={this.props.themedStyle.unfilledItems}
                data={this.UnfilledItems.map(item => this.getNumericPathAndQuestionTitle(item, this.props.root))}
                renderItem={this.renderItem.bind(this)}
                keyExtractor={item => item.path}
            />
        )
    }

    get ValidationFailedResult() {
        return <View style={this.props.themedStyle.failedResult}>
            <Text status='danger' category="s1">
                Validation Failed!
             Please review the following in order to proceed.</Text>
            {this.UnfilledList}
        </View>
    }

    get SubmitControls() {
        const { themedStyle } = this.props;
        return (
            <View style={themedStyle.controlsContainer}>
                <Button color={'#3366FF'}
                    mode='outlined' disabled={this.Progress !== 1} onPress={this.onSubmitLaterClick.bind(this)}>Submit Later</Button>
                <Button color={'#3366FF'}
                    mode='outlined' disabled={this.Progress !== 1} onPress={this.onSubmitNowClick.bind(this)}>Submit Now</Button>
            </View>
        )
    }

    get ValidationResults() {
        if (this.Progress === 1) {
            return this.ValidationSuccessResult;
        }
        return this.ValidationFailedResult;
    }

    async onSubmitNowClick() {

        const cl = new ApolloClient({
            uri: APP_CONFIG.serverURL,
            request: operation => {
                operation.setContext({
                    headers: {
                        authorization: this.props.authToken,
                    },
                });
            },
        });
        const { data, errors, loading } = await cl.mutate({
            mutation: SUBMIT,
            variables: {
                filledForm: {
                    id: this.props.formId,
                    formId: this.props.rootId,
                    completedDate: new Date().getTime().toString(),
                    startedDate: this.props.startedDate.toString(),
                    answerStore: JSON.stringify(this.props.values),
                }
            }
        });
        if (errors) ToastAndroid.show("Could not submit the form", 200);
        ToastAndroid.show("Successfully submitted!", 200);
        this.props.handleMarkAsSubmitted([this.props.formId]);
        this.props.navigation.navigate("FormView");
    }

    onSubmitLaterClick() {
        this.props.navigation.navigate("FormView");
    }
    render() {
        const { themedStyle } = this.props;
        return <View style={themedStyle.container}>
            {this.ValidationResults}
            {this.SubmitControls}
        </View>
    }
}
const SubmitPageStyled = withStyles(SubmitPageComponent, theme => ({
    container: {
        flex: 1,
        backgroundColor: theme['background-basic-color-1'],
    },
    controlsContainer: {
        flex: 0,
        flexDirection: 'row',
        justifyContent: 'center'
    },
    failedResult: {
        flex: 1,
        alignSelf: "center",
        paddingLeft: 16,
        paddingRight: 16
    },
    unfilledItems: {
        flexGrow: 1
    },
    successResult: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
    }
}));

const mapStateToProps = (state: DAppState, props: SubmitPageComponentProps) => {
    const rootId = props.navigation.getParam("rootId");
    const formId = props.navigation.getParam("formId");
    const form = getFilledFormById(state, { rootId, formId });
    return {
        counts: getValidQuestionsNumber(state, { rootId, formId }),
        root: getRootFormById(state, { rootId, formId }),
        values: getFilledFormValues(state, { rootId, formId }),
        startedDate: form.startedDate,
        rootId: rootId,
        formId: formId,
        authToken: getUserToken(state, props),
    }
}
const mapDispatchToProps = (dispatch: Dispatch<Action>) => {
    return {
        handleMarkAsSubmitted: (formIds: string[]) => dispatch(handleMarkFormAsSubmitted(formIds))
    }
}
export const ConnectedSubmitPage = connect(mapStateToProps, mapDispatchToProps)(SubmitPageStyled)


type SubmitPageContainerProps = {

} & NavigationScreenProps;
const routeName = "Submit Form";
export class SubmitPageContainer extends React.Component<SubmitPageContainerProps, {}>{
    static navigationOptions = ({ navigation }) => {
        const renderLeftIcon = () => {
            return <TopNavigationAction onPress={() => {
                navigation.goBack(KEY_NAVIGATION_BACK)
            }} icon={(style) => <Icon {...style} name="arrow-back" />} />
        }
        return {
            header: () => {

                return (
                    <TopNavigation
                        style={{ height: Header.HEIGHT }}
                        alignment='center'
                        title={"Datapali"}
                        subtitle={routeName}
                        subtitleStyle={textStyle.caption1}
                        leftControl={renderLeftIcon()}
                    />
                );

            },
        }
    }
    render() {
        const { navigation } = this.props;
        const formId = navigation.getParam('formId');
        const rootId = navigation.getParam('rootId');
        return (
            <ConnectedSubmitPage formId={formId} rootId={rootId} />
        )
    }
}