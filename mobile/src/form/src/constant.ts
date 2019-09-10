
import { AnswerOptions, IValueType } from '..';

export interface IConstant {
    name: string;
    id: string;
    type?: IValueType;
    value: AnswerOptions | string;
}
