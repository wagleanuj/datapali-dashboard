import { ANSWER_TYPES } from "../index";

export interface IValueType {
    name: ANSWER_TYPES,
    ofType?: IValueType,
}

