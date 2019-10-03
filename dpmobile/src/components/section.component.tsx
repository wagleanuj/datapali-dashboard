import { DuplicateTimesType, getReadablePath, QACondition, QAQuestion, QuestionSection } from "dpform";
import React from "react";
import { View } from "react-native";
import { List } from "react-native-paper";
import { Layout, Text, ThemedComponentProps, withStyles } from "react-native-ui-kitten";
import { AnswerSection } from "../answer.store";
import { AutoCompleteItem } from "./forms.component";
import { Question } from "./question.component";

type SectionComponentProps = {
    section: QuestionSection,
    iteration: number,//main
    answerSection: AnswerSection,
    handleAnswerSectionChange: () => void,
    path: number[]
    evaluateCondition: (condition: QACondition) => boolean,
    setAnswer: (path: number[], value: string) => void,
    getAutoCompleteDataForPath: (questionId: string) => AutoCompleteItem[]
    _path: number[]
} & ThemedComponentProps;

type SectionComponentState = {
    answers: { [key: string]: any }[]
}
class SectionComponent extends React.Component<SectionComponentProps, SectionComponentState>{
    constructor(props: SectionComponentProps) {
        super(props);
        this.state = {
            answers: []
        }
    }

    handleValueChange(path: number[], value: string) {
        this.props.answerSection.setAnswerFor(path, value);
        this.props.handleAnswerSectionChange();
    }

    renderDupe(section: QuestionSection) {
        if (section.duplicatingSettings.isEnabled) {
            let repeatType: DuplicateTimesType = section.duplicatingSettings.duplicateTimes.type;
            let times = 0;
            if (repeatType === "number") {
                times = parseInt(section.duplicatingSettings.duplicateTimes.value);
            } else {
                let ans = this.props.answerSection.getById(section.duplicatingSettings.duplicateTimes.value);
                if (ans) {
                    times = parseInt(ans);
                }
            }
            let children = []
            for (let i = 0; i < times; i++) {
                children.push(
                    <View style={this.props.themedStyle.accordionContainer} key={section.id + i}>
                        <List.Accordion style={this.props.themedStyle.accordion} title={getReadablePath(this.props.path.concat(i))}>
                            <View style={this.props.themedStyle.duplicatingSectionContainer}>
                                {this.renderSection(this.props.section, i)}
                            </View>
                        </List.Accordion>
                    </View>
                )
            }
            return <Layout style={this.props.themedStyle.duplicatedRootSection} key={section.id + "root-duplicated"}>
                <Text style={this.props.themedStyle.duplicatedSectionTitle}>{`${getReadablePath(this.props.path)} : ${section.name}`}</Text>
                {children}
            </Layout>
        }

    }
    getValueFor(path: number[]) {
        return this.props.answerSection.getAnswerFor(path);
    }

    renderSection(section: QuestionSection, iteration: number = 0) {
        return section.content.map((item, index) => {
            if (item instanceof QuestionSection) {
                return <SurveySection
                    _path={this.props._path.concat(iteration, index)}
                    key={item.id}
                    answerSection={this.props.answerSection}
                    path={this.props.path.concat(index)}
                    section={item}
                    setAnswer={this.props.setAnswer}
                    iteration={iteration}
                    evaluateCondition={this.props.evaluateCondition}
                    getAutoCompleteDataForPath={this.props.getAutoCompleteDataForPath}
                    handleAnswerSectionChange={this.props.handleAnswerSectionChange}
                />;

            } else if (item instanceof QAQuestion) {
                return <Question
                    key={item.id}
                    path={this.props.path.concat(index)}
                    question={item}
                    iteration={iteration}
                    evaluateCondition={this.props.evaluateCondition}
                    answerSection={this.props.answerSection}
                    autoCompleteData={this.props.getAutoCompleteDataForPath(item.id)}
                    defaultValue={this.getValueFor(this.props._path.concat(iteration, index))}
                    onValueChange={e => this.handleValueChange(this.props._path.concat(iteration, index), e)}
                />

            }
        })

    }

    render() {
        let comp = null;
        if (this.props.section.duplicatingSettings.isEnabled) {
            comp = this.renderDupe(this.props.section);
        } else {
            comp = this.renderSection(this.props.section, this.props.iteration)
        }
        return <Layout style={this.props.themedStyle.container}>
            {comp}
        </Layout>
    }
}
export const SurveySection = React.memo(withStyles(SectionComponent, (theme) => ({
    container: {
        marginTop: 0,
        paddingLeft: 8,
        paddingRight: 8,
    },
    accordion: {
        backgroundColor: theme['color-primary-300']
    },
    accordionContainer: {
        paddingTop: 5,
        paddingBottom: 5,
        paddingLeft: 5,
        paddingRight: 5,
    },
    duplicatingSectionContainer: {
        paddingLeft: 5,
        paddingRight: 5,
        paddingBottom: 20
    },
    duplicatedRootSection: {
        marginTop: 20,
        marginBottom: 20,
    },
    duplicatedSectionTitle: {
        padding: 5,
    }
})));

