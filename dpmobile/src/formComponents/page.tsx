import React from "react";
import { ThemedComponentProps, Layout } from "react-native-ui-kitten";
import { NavigationScreenProps } from "react-navigation";
import { Action, Dispatch } from "redux";
import { AppState } from "../redux/actions/types";
import { IAnswer, IAnswerSection } from "../redux/helper";
import { RootSection, ANSWER_TYPES } from "dpform";
import { getCurrentFilledFormContent } from "../redux/selectors/filledFormSelectors";
import { connect } from "react-redux";
import { Item } from "react-native-paper/typings/components/Drawer";
import { FlatList } from "react-native-gesture-handler";
import { FormItem } from "./surveyformitem";
import { Showcase } from "../components/showcase.component";
import { ShowcaseItem } from "../components/showcaseitem.component";

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
        } else {
            //simply add the question
            data.push({
                title: content.questionId,
                path: content.path
            })
        }
        return data;
    }
    renderItem(item) {
        return <FormItem
            path={item.item.path}
            formId ={this.props.filledFormId}
            rootId ={this.props.rootId}
            questionId={item.item.title}
            type={{ name: ANSWER_TYPES.STRING }}
        />
    }

    render() {
        return (
            <Layout>
                    <FlatList
                        keyExtractor={item => item.title}
                        data={this.makeData(this.props.content, [])}
                        renderItem={this.renderItem.bind(this)}
                    />
            </Layout>

        )
    }
}
const mapStateToProps = (state: AppState, props: PageProps) => {
    return {
        content: getCurrentFilledFormContent(state, props, props.filledFormId)
    }
}
const mapDispatchToProps = (dispatch: Dispatch<Action<any>>) => ({
    // saveAnswer: 
});

export const Page = connect(mapStateToProps, mapDispatchToProps)(Page_);
