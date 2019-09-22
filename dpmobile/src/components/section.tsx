import { QuestionSection, QACondition, DuplicateTimesType, getReadablePath, QAQuestion, IValueType, AnswerOptions, ANSWER_TYPES } from "dpform";

import { ThemedStyleType } from "@eva-design/dss";

import React from "react";

import { View, DatePickerAndroid, TouchableOpacity } from "react-native";

import { Layout, withStyles, Input, Text } from "react-native-ui-kitten";

import _ from "lodash";

import { AnswerStore } from "../answermachine";
import { List } from "react-native-paper";
import { SelInput } from "./selectInput";

type SectionComponentProps = {
    section: QuestionSection,
    path: number[]
    evaluateCondition: (condition: QACondition) => boolean,
    answerStore: AnswerStore,
    setAnswer: (path: number[], iteration: number, value: string) => void,
} & ThemedStyleType;

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
    renderDuplicatingSection(section: QuestionSection, path: number[]) {
        console.log("rendering duplicated");
        let repeatType: DuplicateTimesType = section.duplicatingSettings.duplicateTimes.type;
        let times = 0;
        if (repeatType === "number") {
            times = parseInt(section.duplicatingSettings.duplicateTimes.value);
        } else {
            let ans = this.props.answerStore.getById(section.duplicatingSettings.duplicateTimes.value);
            if (ans) {
                times = parseInt(ans);
            }
        }
        let children = []
        for (let i = 0; i < times; i++) {
            children.push(
                <View style={{ paddingTop: 5, paddingBottom: 5, paddingLeft: 5, paddingRight: 5 }} key={section.id + i}>
                    <List.Accordion style={this.props.themedStyle.accordion} title={getReadablePath(path.concat(i))}>
                        <View style={{ paddingLeft: 5, paddingRight: 5, paddingBottom: 20 }}>
                            {this.getSectionPage(section, path, i)}
                        </View>
                    </List.Accordion>
                </View>
            )
        }
        return <Layout style={{ marginTop: 20, marginBottom: 20 }} key={section.id + "root-duplicated"}>
            <Text style={{ padding: 5 }}>{`${getReadablePath(path)} : ${section.name}`}</Text>
            {children}
        </Layout>
    }

    handleValueChange(path: number[], iteration: number, value: string) {
        if (this.props.setAnswer) this.props.setAnswer(path, iteration, value);
    }

    getSectionPage(section: QuestionSection, path: number[], iteration: number) {
        console.log("Rendering section");
        let comp = section.content.map((item, index) => {
            let isValid = this.props.evaluateCondition(item.appearingCondition);
            let newPath = path.slice(0);
            if (!_.isNil(iteration)) newPath = newPath.concat(iteration);

            if (item instanceof QAQuestion) {

                return isValid ? <QuestionComponent key={item.id}
                    path={newPath.concat(index)}
                    question={item}
                    evaluateCondition={this.props.evaluateCondition}
                    answerStore={this.props.answerStore}
                    defaultValue={this.props.answerStore.getAnswerFor(path.concat(index), iteration)}
                    onValueChange={e => this.handleValueChange(path.concat(index), iteration, e)}
                /> : null;
            }
            else if (item instanceof QuestionSection) {

                return isValid ? <SurveySection
                    key={item.id}
                    section={item}
                    setAnswer={this.props.setAnswer}
                    answerStore={this.props.answerStore}
                    path={path}
                    evaluateCondition={this.props.evaluateCondition}
                /> : null;


            }
        });
        return <View key={section.id}>
            {comp}
        </View >
    }

    render() {
        let comp = null;
        if (this.props.section.duplicatingSettings.isEnabled) comp = this.renderDuplicatingSection(this.props.section, this.props.path);
        else { comp = this.getSectionPage(this.props.section, this.props.path, 0) }
        return <Layout>
            {comp}
        </Layout>
    }
}
export const SurveySection = withStyles(SectionComponent, (theme) => ({
    accordion: {
        backgroundColor: theme['color-primary-300']
    }
}));

type QuestionComponentProps = {
    question: QAQuestion;
    path: number[];
    defaultValue: string;
    onValueChange: (newValue: string) => void;
    answerStore: AnswerStore
    evaluateCondition: (condition: QACondition) => boolean
} & ThemedStyleType;
type QuestionComponentState = {

}
export class QuestionComponent extends React.Component<QuestionComponentProps, QuestionComponentState>{
    constructor(props: QuestionComponentProps) {
        super(props);
        this.state = {

        }
    }
    async openDatePicker(defaultDate: Date, onDateChange?: (date: Date) => void) {
        try {
            const { action, year, month, day } = await DatePickerAndroid.open({
                date: defaultDate || new Date(),
            });
            if (action !== DatePickerAndroid.dismissedAction) {
                // Selected year, month (0-11), day
                if (onDateChange) onDateChange(new Date(year, month, day));
            }
        } catch ({ code, message }) {
            console.warn('Cannot open date picker', message);
        }
    }

    evaluateAutofill(question: QAQuestion) {
        if (question.autoAnswer.isEnabled) {
            let toFillValue = undefined;
            let aa = question.autoAnswer.answeringConditions;
            for (let i = 0; i < aa.length; i++) {
                let item = aa[i];
                let isValid = this.props.evaluateCondition(item.condition);

                if (isValid === true) {
                    toFillValue = item.ifTrue;
                    break;
                } else {
                    toFillValue = item.ifFalse;
                }
            }
            return toFillValue;

        }
        return undefined;
    }

    getValueInput(type: IValueType, options: AnswerOptions, question: QAQuestion) {
        let comp = null;
        let autofillvalue = this.evaluateAutofill(question);
        let defaultValue = this.props.defaultValue || autofillvalue;
        if (type) {
            switch (type.name) {
                case ANSWER_TYPES.NUMBER:
                    comp = <Input
                        defaultValue={defaultValue}
                        onChangeText={this.props.onValueChange}
                        placeholder=''
                        keyboardType='number-pad'
                    />;
                    break;
                case ANSWER_TYPES.GEOLOCATION:
                    let defaultLocation = (locationJSON: object) => {
                        return `Latitude: ${locationJSON.coords.latitude}\nLongitude: ${locationJSON.coords.longitude}`;
                    }
                    let dl = defaultValue ? defaultLocation(JSON.parse(defaultValue)) : "";
                    comp = <TouchableOpacity onPress={() => {
                        navigator.geolocation.getCurrentPosition(
                            position => {
                                const location = JSON.stringify(position);
                                this.props.onValueChange(location);

                            },
                            error => { },
                            { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
                        );
                    }}>
                        <Input
                            multiline
                            defaultValue={dl}
                            status={"primary"}
                            disabled
                        />
                    </TouchableOpacity>;
                    break;
                case ANSWER_TYPES.STRING:
                    comp = <Input
                        defaultValue={defaultValue}
                        onChangeText={this.props.onValueChange} />;
                    break;
                case ANSWER_TYPES.DATE:
                    let date = defaultValue ? new Date(defaultValue) : new Date();
                    comp = <TouchableOpacity onPress={this.openDatePicker.bind(this, date, (date) => {
                        let stringified = date.toDateString();
                        this.props.onValueChange(stringified);
                    })}>
                        <Input
                            defaultValue={date.toDateString()}
                            status={"primary"}
                            disabled
                        />
                    </TouchableOpacity>;

                    break;
                case ANSWER_TYPES.SELECT:
                    comp = <SelInput
                        path={this.props.path}
                        question={question}
                        answerStore={this.props.answerStore}
                        value={defaultValue}
                        onSelectionChange={this.props.onValueChange}
                        answerType={type}
                        options={options} />;
                    break;
            }
        }
        return comp;
    }
    render() {
        let currentQuestion = this.props.question;
        const questionText = <Text style={{ fontSize: 15, paddingBottom: 20 }}>
            {`${getReadablePath(this.props.path)} : ${currentQuestion.questionContent.content}`}
        </Text>;
        const valueInput = this.getValueInput(currentQuestion.answerType,
            currentQuestion.options, currentQuestion);
        return (
            <Layout key={currentQuestion.id} style={{ paddingTop: 20, paddingBottom: 20, paddingLeft: 5, paddingRight: 5, marginBottom: 5, marginTop: 5 }}>
                <View style={{ paddingLeft: 5, paddingRight: 5 }}>
                    {questionText}
                    {valueInput}
                </View>
            </Layout>
        );
    }

}
