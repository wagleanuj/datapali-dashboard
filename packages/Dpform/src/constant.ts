
import { IValueType, AnswerOptions } from "..";

export interface IConstant {
    name: string
    id: string
    type?: IValueType
    value: AnswerOptions | string
}