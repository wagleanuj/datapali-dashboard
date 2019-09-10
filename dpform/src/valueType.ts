import { ANSWER_TYPES } from './answerTypes';

export interface IValueType {
    name: ANSWER_TYPES;
    ofType?: IValueType;
}


export function ofTypeToJSON(t?: IValueType): any {
    if (!t) { return undefined; }
    return {
        name: t.name,
        ofType: ofTypeFromJSON(t.ofType),
    };
}
export function answerTypeToJSON(t: IValueType): { [key: string]: any } {
    return {
        name: t.name,
        ofType: ofTypeToJSON(t.ofType),
    };
}
export function ofTypeFromJSON(a: any) {
    if (!a) { return undefined; }
    const r: IValueType = {
        name: a.name,
        ofType: ofTypeFromJSON(a.ofType),
    };
    return r;
}

export function answerTypeFromJSON(a: any) {
    const r: IValueType = {
        name: a.name,
        ofType: ofTypeFromJSON(a.ofType),
    };
    return r;
}



