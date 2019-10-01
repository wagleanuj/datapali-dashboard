import { AnswerOptions, ANSWER_TYPES, DuplicateTimesType, getReadablePath, IValueType, QACondition, QAQuestion, QuestionSection } from "dpform";
import _ from "lodash";
import React from "react";
import { DatePickerAndroid, TouchableOpacity, View } from "react-native";
import { List } from "react-native-paper";
import { Input, Layout, Text, ThemedComponentProps, withStyles } from "react-native-ui-kitten";
import { AnswerSection } from "../answer.store";
import { AnswerStore } from "../answermachine";
import { AutoComplete } from "./autocompleteInput";
import { AutoCompleteItem } from "./forms";
import { SelInput } from "./selectInput";

type SectionComponentProps = {
    section: QuestionSection,
    iteration: number,//main
    answerSection: AnswerSection,
    handleAnswerSectionChange: () => void,
    path: number[]
    evaluateCondition: (condition: QACondition) => boolean,
    answerStore: AnswerStore,
    setAnswer: (path: number[], value: string) => void,
    getAutoCompleteDataForPath: (path: number[], iteration: number) => AutoCompleteItem[]
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
    renderDuplicatingSection(section: QuestionSection, path: number[], _path: number[]) {
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
                <View style={this.props.themedStyle.accordionContainer} key={section.id + i}>
                    <List.Accordion style={this.props.themedStyle.accordion} title={getReadablePath(path.concat(i))}>
                        <View style={this.props.themedStyle.duplicatingSectionContainer}>
                            {this.getSectionPage(section, path, i, _path.concat(i), true)}
                        </View>
                    </List.Accordion>
                </View>
            )
        }
        return <Layout style={this.props.themedStyle.duplicatedRootSection} key={section.id + "root-duplicated"}>
            <Text style={this.props.themedStyle.duplicatedSectionTitle}>{`${getReadablePath(path)} : ${section.name}`}</Text>
            {children}
        </Layout>
    }

    handleValueChange(qid: string, iteration: number, index: number, value: string) {
        console.log(qid);
        this.props.answerSection.setAnswerFor([iteration, index], value);
        this.props.handleAnswerSectionChange();
    }


    getSectionPage(section: QuestionSection, path: number[], iteration: number, _path: number[], duplicated: boolean = false) {
        let answerPath = _path.slice(0);
        let comp = null;
        if (section.duplicatingSettings.isEnabled && !duplicated) {
            comp = this.renderDuplicatingSection(section, path, answerPath);
        } else {
            comp = section.content.map((item, index) => {
                let isValid = this.props.evaluateCondition(item.appearingCondition);
                let newPath = path.slice(0);
                if (!_.isNil(iteration)) newPath = newPath.concat(iteration);

                if (item instanceof QAQuestion) {

                    return isValid ? <Question key={item.id}
                        autoCompleteData={this.props.getAutoCompleteDataForPath(path.concat(0, index), iteration)}
                        path={newPath.concat(index)}
                        question={item}
                        parentPath={path}
                        iteration={iteration}
                        index={index}
                        evaluateCondition={this.props.evaluateCondition}
                        answerStore={this.props.answerStore}
                        defaultValue={this.props.answerStore.getAnswerFor(answerPath.concat(index))}
                    // onValueChange={e => this.handleValueChange(item.id, e)}
                    /> : null;
                }
                else if (item instanceof QuestionSection) {
                    return this.getSectionPage(item, path.concat(index), iteration, answerPath.concat(index));
                }
            });
        }
        return <View key={section.id}>
            {comp}
        </View >
    }

    renderDupe(section: QuestionSection) {
        if (section.duplicatingSettings.isEnabled) {
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
    getValueFor(iteration: number, index: number) {
        return  this.props.answerSection.getAnswerFor([iteration, index]);
        
    }

    renderSection(section: QuestionSection, iteration: number = 0) {
        return section.content.map((item, index) => {
            if (item instanceof QuestionSection) {
                return <SurveySection
                    key={item.id}
                    answerSection={AnswerSection.getItem(this.props.answerSection, iteration, index)}
                    path={this.props.path.concat(index)}
                    section={item}
                    answerStore={this.props.answerStore}
                    setAnswer={this.props.setAnswer}
                    iteration={iteration}
                    handleAnswerSectionChange={this.props.handleAnswerSectionChange}
                />;

            } else if (item instanceof QAQuestion) {
                return <Question
                    key={item.id}
                    // autoCompleteData={this.props.getAutoCompleteDataForPath(this.props.path.concat(0, index), iteration)}
                    path={this.props.path.concat(index)}
                    question={item}
                    parentPath={this.props.path}
                    iteration={iteration}
                    index={index}
                    evaluateCondition={this.props.evaluateCondition}
                    answerStore={this.props.answerStore}
                    defaultValue={this.getValueFor(iteration, index)}
                    onValueChange={e => this.handleValueChange(item.id, iteration, index, e)}
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
        // const comp = this.getSectionPage(this.props.section, this.props.path, undefined, [0, 0], false);

        return <Layout style={this.props.themedStyle.container}>
            {comp}
        </Layout>
    }
}
export const SurveySection = (withStyles(SectionComponent, (theme) => ({
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

type QuestionComponentProps = {
    question: QAQuestion;
    path: number[];
    defaultValue: string;
    onValueChange: (newValue: string) => void;
    answerStore: AnswerStore
    evaluateCondition: (condition: QACondition) => boolean,
    autoCompleteData: AutoCompleteItem[],
    iteration: number;
    parentPath: number[];
    index: number;
} & ThemedComponentProps;
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
                    comp = <AutoComplete
                        defaultValue={defaultValue}
                        data={this.props.autoCompleteData}
                        onChange={this.props.onValueChange}
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
        const path = this.props.path.slice(0);
        const index = this.props.path.pop();
        if (!_.isNil(this.props.iteration)) path.concat(this.props.iteration);
        path.concat(index);
        const questionText = <Text style={this.props.themedStyle.questionTitle}>
            {`${getReadablePath(path)} : ${currentQuestion.questionContent.content} ${currentQuestion.isRequired ? '*' : ''}`}
        </Text>;
        const valueInput = this.getValueInput(currentQuestion.answerType,
            currentQuestion.options, currentQuestion);
        return (
            <View key={currentQuestion.id} style={this.props.themedStyle.container}>
                <View style={this.props.themedStyle.questionContainer}>
                    {questionText}
                    {valueInput}
                </View>
            </View>
        );
    }

}
export const Question = (withStyles(QuestionComponent, theme => ({
    container: {
        paddingBottom: 20,
        paddingLeft: 5,
        paddingRight: 5,
        marginBottom: 5,
        marginTop: 5,
    },
    questionContainer: {
        paddingLeft: 5,
        paddingRight: 5,
    },
    questionTitle: {
        fontSize: 15,
        paddingBottom: 20,
    }
})));