import React from "react";
import { FlatList } from "react-native-gesture-handler";
import { Layout, ThemedComponentProps, withStyles } from "react-native-ui-kitten";
import { NavigationScreenProps, ScrollView } from "react-navigation";
import { connect } from "react-redux";
import { Action, Dispatch } from "redux";
import { AppState } from "../redux/actions/types";
import { IAnswer, IAnswerSection } from "../redux/helper";
import { getCurrentFilledFormContent, getPageContent } from "../redux/selectors/filledFormSelectors";
import { FormItem } from "./surveyformitem";
import { List } from "react-native-paper";
import { getReadablePath, getRandomId } from "dpform";
import { View } from "react-native";
import { Answer } from "../answer.store";
import NestedListView, { NestedRow } from 'react-native-nested-listview'

type PageProps = {
    content: IAnswer | IAnswerSection;
    formId: string;
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
                        } else if (item.questionId) {
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
            formId={this.props.formId}
            rootId={this.props.rootId}
            questionId={item.item.title}
        />
    }

    render() {
        const data = this.makeData(this.props.content, []);
        return (
            <Layout style={this.props.themedStyle.container} >
                <FlatList
                    keyExtractor={item => {
                        return 'li' + item.title + item.path
                    }}
                    data={data}
                    renderItem={this.renderItem.bind(this)}
                />
                {/* <SectionItem
                    content={this.props.content}
                    formId={this.props.formId}
                    rootId={this.props.rootId}
                /> */}

                {/* <NestedListView
                    data={this.props.content}
                    renderNode={(node, level)=>{
                        console.log(node, level);
                        return <></>
                    }}
                > */}

                {/* </NestedListView> */}

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
        content: getPageContent(state, props)
    }
}
const mapDispatchToProps = (dispatch: Dispatch<Action<any>>) => ({
    // saveAnswer: 
});

export const Page = connect(mapStateToProps, mapDispatchToProps)(PageStyled);

interface SectionItemProps {
    content: IAnswerSection;
    formId: string;
    rootId: string;

}

export class SectionItem extends React.Component<SectionItemProps, {}>{
    renderSectionPage(content: Array<IAnswer | IAnswerSection>) {
        return content.map(item => {
            if (item.hasOwnProperty('content')) {
                return <SectionItem
                    content={item}
                    formId={this.props.formId}
                    rootId={this.props.rootId}
                />
            } else {
                return <FormItem
                    path={item.path}
                    questionId={item.questionId}
                    formId={this.props.formId}
                    rootId={this.props.rootId}
                />
            }
        })
    }

    renderDuplicatedPage(content: Array<Array<IAnswer | IAnswerSection>>) {
        if (content.length > 1) {
            let children = []
            content.forEach((c, i) => {
                children.push(
                    <View key={getRandomId('uh')} >
                           <View >
                                {this.renderSectionPage(c)}
                            </View>
                    </View>
                )
            });
            return children;
        }
        if (content.length === 1) {
            return this.renderSectionPage(content[0]);
        }
        return <></>
    }
    render() {
        return <ScrollView>
            {this.renderDuplicatedPage(this.props.content.content)}
        </ScrollView>


    }
}
export class NormalSectionItem extends React.Component<SectionItemProps, {}>{
    render() {
        return <></>
    }
}