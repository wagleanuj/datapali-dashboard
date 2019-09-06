import { QAQuestion } from "../form/question";

import { QAType } from "../form/answer";
import { IValueType, ANSWER_TYPES } from "../components/AnswerType";
import { AnswerOptions, IOption } from "../components/AnswerOptions";
import { getRandomId } from "../utils/getRandomId";
import { RootSection } from "../components/section";

const selectString: IValueType = { name: ANSWER_TYPES.SELECT, ofType: { name: ANSWER_TYPES.STRING } }
const selectBoolean: IValueType = { name: ANSWER_TYPES.SELECT, ofType: { name: ANSWER_TYPES.BOOLEAN } }
const selectNumber: IValueType = { name: ANSWER_TYPES.SELECT, ofType: { name: ANSWER_TYPES.NUMBER } }
const makeStringOption = (value: string): IOption => {
    return { id: getRandomId("opt-"), type: { name: ANSWER_TYPES.STRING }, value: value }
}
const catOptions = new AnswerOptions();
const tvOptions = new AnswerOptions();

for (let i = 0; i < 5; i++) catOptions.addOption(makeStringOption("cat" + i));
for (let i = 0; i < 5; i++) tvOptions.addOption(makeStringOption("tv" + i));

export const testQuestion = new QAQuestion().setAnswerType(selectString).setQuestionContent({ type: QAType.String, content: "what is your cat's name?" }).setReferenceId("question-1");
testQuestion.setOptions(catOptions);
export const testQuestion2 = new QAQuestion().setAnswerType(selectString).setQuestionContent({ type: QAType.String, content: "what is your favorite tv?" }).setReferenceId("question-2");
testQuestion2.setOptions(tvOptions);

export const testQuestion3 = new QAQuestion().setAnswerType(selectBoolean).setQuestionContent({ type: QAType.String, content: "Do you like having tea?" }).setReferenceId("question-3");
export const testQuestion4 = new QAQuestion().setAnswerType(selectNumber).setQuestionContent({ type: QAType.String, content: "How many times have you had death?" }).setReferenceId("question-4");
export const testQuestion5 = new QAQuestion().setAnswerType(selectString).setQuestionContent({ type: QAType.String, content: "Who taught you how to die?" }).setReferenceId("question-5");




