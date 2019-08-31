import { QAQuestion } from "../form/question";

import { AnswerType, QAType } from "../form/answer";

export const testQuestion = new QAQuestion().setAnswerType(AnswerType.Select).setQuestionContent({ type: QAType.String, content: "what is your cat's name?" }).setReferenceId("question-1");
for (let i = 0; i < 5; i++) { testQuestion.addOption({ value: `cat${i}` }) }
export const testQuestion2 = new QAQuestion().setAnswerType(AnswerType.Select).setQuestionContent({ type: QAType.String, content: "what is your favorite tv?" }).setReferenceId("question-2");
for (let i = 0; i < 5; i++) { testQuestion2.addOption({ value: `tv${i}` }) }

export const testQuestion3 = new QAQuestion().setAnswerType(AnswerType.Boolean).setQuestionContent({ type: QAType.String, content: "Do you like having sex?" }).setReferenceId("question-3");
export const testQuestion4 = new QAQuestion().setAnswerType(AnswerType.Number).setQuestionContent({ type: QAType.String, content: "How many times have you had HIV AIDS?" }).setReferenceId("question-4");
export const testQuestion5 = new QAQuestion().setAnswerType(AnswerType.String).setQuestionContent({ type: QAType.String, content: "Who taught you how to have sex?" }).setReferenceId("question-5");
