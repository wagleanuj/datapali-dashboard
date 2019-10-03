import { AnswerOptions, ANSWER_TYPES, getReadablePath, IValueType, QACondition, QAQuestion } from "dpform";
import _ from "lodash";
import React from "react";
import { DatePickerAndroid, View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { Input, Text, ThemedComponentProps, withStyles } from "react-native-ui-kitten";
import { AutoComplete } from "./autocompleteinput.component";
import { AutoCompleteItem } from "./forms.component";
import { SelInput } from "./selectinput.component";
import { AnswerSection } from "../answer.store";

type QuestionComponentProps = {
    question: QAQuestion;
    path: number[];
    defaultValue: string;
    onValueChange: (newValue: string) => void;
    evaluateCondition: (condition: QACondition) => boolean,
    autoCompleteData: AutoCompleteItem[],
    iteration: number;
    answerSection: AnswerSection
} & ThemedComponentProps;

export class QuestionComponent extends React.Component<QuestionComponentProps, {}>{
    constructor(props: QuestionComponentProps) {
        super(props);
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
                        answerSection={this.props.answerSection}
                        question={question}
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
export const Question = React.memo(withStyles(QuestionComponent, theme => ({
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