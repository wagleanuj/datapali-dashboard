import { DuplicateTimesType, QACondition, QuestionSection } from "dpform";
import React from "react";
import { SectionList } from "react-native";
import { ThemedComponentProps } from 'react-native-ui-kitten';
import { AnswerSection } from "../answer.store";
import { Question } from "./question.component";

type QSectionProps = {
    section: QuestionSection,
    answerSection: AnswerSection,
    setAnswer: (path: number[], value: string) => void,
    evaluateCondition: (condition: QACondition) => boolean,
    _path: number[];
    shouldNotDuplicate?: boolean
} & ThemedComponentProps
type QSectionState = {

}


export class QSection extends React.Component<QSectionProps, QSectionState> {
    constructor(props: QSectionProps) {
        super(props);
        this.state = {

        }
    }
    renderDuplicatingSectionItem({ item, section, index }) {
        const iteration = section.iteration;
        return <QSection
            shouldNotDuplicate
            _path={this.props._path}
            evaluateCondition={this.props.evaluateCondition}
            section={item}
            setAnswer={this.props.setAnswer}
            answerSection={this.props.answerSection}
        />
    }
    makeDataMain(section: QuestionSection, shouldDuplicate: boolean = true) {
        let data = [];
        if (section.duplicatingSettings.isEnabled && shouldDuplicate) {
            data = this.makeDupeData(section);
        } else {
            data = this.makeSectionData(section)
        }
        return data;
    }
    handleValueChange(path: number[], value: string) {
        this.props.setAnswer(path, value);
    }

    renderSectionContent(data) {
        let { item, index, section } = data;
        let iteration = section.iteration;
        if (item instanceof QuestionSection) {
            return <QSection
                _path={this.props._path.concat(iteration, index)}
                evaluateCondition={this.props.evaluateCondition}
                section={item}
                setAnswer={this.props.setAnswer}
                answerSection={this.props.answerSection} />
        } else {
            return <Question
                defaultValue={this.getValueFor(this.props._path.concat(iteration, index))}
                evaluateCondition={this.props.evaluateCondition}
                answerSection={this.props.answerSection}
                path={this.props._path.concat(iteration, index)}
                question={item}
                onValueChange={e => this.handleValueChange(this.props._path.concat(iteration, index), e)}
            />
        }

    }
    getValueFor(path: number[]) {
        return this.props.answerSection.getAnswerFor(path);
    }


    makeSectionData(section: QuestionSection, iteration: number = 0) {
        return [{
            title: section.name,
            data: section.content,
            iteration: iteration,
            renderItem: this.renderSectionContent.bind(this)
        }]
    }


    makeDupeData(section: QuestionSection) {
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
            times = 2;
            let children = []
            for (let i = 0; i < times; i++) {
                children.push({
                    key: section.id + i,
                    data: [section],
                    iteration: i,
                    renderItem: this.renderDuplicatingSectionItem.bind(this)
                });
            }
            return children;
        }
    }



    render() {
        return (
            <SectionList
                sections={this.makeDataMain(this.props.section, !!!this.props.shouldNotDuplicate)}
                keyExtractor={(item) => {
                    return item.id;
                }}
            />

        )
    }
}