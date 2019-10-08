import React from "react";
import { FlatList } from "react-native-gesture-handler";
import { Layout, ThemedComponentProps, withStyles } from "react-native-ui-kitten";
import { NavigationScreenProps } from "react-navigation";
import { connect } from "react-redux";
import { Action, Dispatch } from "redux";
import { AppState } from "../redux/actions/types";
import { IAnswer, IAnswerSection } from "../redux/helper";
import { getCurrentFilledFormContent } from "../redux/selectors/filledFormSelectors";
import { FormItem } from "./surveyformitem";

type PageProps = {
    content: IAnswer | IAnswerSection;
    filledFormId: string;
    rootId: string;
} & ThemedComponentProps & NavigationScreenProps;

export class Page_ extends React.Component<PageProps, {}>{
    makeData(content: IAnswer | IAnswerSection, data: any[]) {
        if (!data) data = [];
        if (content.hasOwnProperty("content")) {
            if (content.content.length < 1) {
            } else {
                content.content.forEach(placeholder => {
                    placeholder.forEach(item => {
                        if (item.hasOwnProperty('content')) {
                            data.push(this.makeData(item, data));
                        } else {
                            data.push({
                                title: item.questionId,
                                path: item.path,
                            })
                        }
                    })

                })
            }
        } else if (content.questionId) {
            //simply add the question
            data.push({
                title: content.questionId,
                path: content.path
            })
        }
        return data;
    }
    renderItem(item) {
        if (!item || !item.item.path) return <></>
        return <FormItem
            path={item.item.path}
            formId={this.props.filledFormId}
            rootId={this.props.rootId}
            questionId={item.item.title}
        />
    }

    render() {
        return (
            <Layout style={this.props.themedStyle.container} >
                <FlatList
                    keyExtractor={item => {
                        return 'li' + item.title
                    }}
                    data={this.makeData(this.props.content, [])}
                    renderItem={this.renderItem.bind(this)}
                />
            </Layout>

        )
    }
}

const PageStyled = withStyles(Page_, theme => ({
    container: {
        marginTop: 16,
        paddingHorizontal: 16,
        paddingVertical: 16,
    },
}));

const mapStateToProps = (state: AppState, props: PageProps) => {
    return {
        content: getCurrentFilledFormContent(state, props, props.filledFormId)
    }
}
const mapDispatchToProps = (dispatch: Dispatch<Action<any>>) => ({
    // saveAnswer: 
});

export const Page = connect(mapStateToProps, mapDispatchToProps)(PageStyled);
