import { AnswerOptions } from './AnswerOptions';
import { IValueType } from './valueType';
export interface IConstant {
    name: string;
    id: string;
    type?: IValueType;
    value: AnswerOptions | string;
}
