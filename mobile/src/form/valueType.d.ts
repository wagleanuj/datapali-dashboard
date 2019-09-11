import { ANSWER_TYPES } from './answerTypes';
export interface IValueType {
    name: ANSWER_TYPES;
    ofType?: IValueType;
}
export declare function ofTypeToJSON(t?: IValueType): any;
export declare function answerTypeToJSON(t: IValueType): {
    [key: string]: any;
};
export declare function ofTypeFromJSON(a: any): IValueType | undefined;
export declare function answerTypeFromJSON(a: any): IValueType;
