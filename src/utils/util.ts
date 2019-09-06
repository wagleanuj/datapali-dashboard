import ReactDOM from "react-dom";
import { ReactElement } from "react";
import { IAnswerCondition, IAutoAnswer } from "../form/question";
import { QACondition } from "../form/condition";
import { IOption, IOptionGroup } from "../components/AnswerOptions";
import { IValueType } from "../components/AnswerType";
import { IDupeSettings, DuplicateTimesType } from "../components/duplicateSettings";

export function openModal(com: ReactElement) {
    let el = document.getElementById("dp-modal");
    if (!el) {
        el = document.createElement("div");
        el.setAttribute("id", "dp-modal")
        document.body.appendChild(el)
    }
    ReactDOM.render(com, el);

}

export function destroyModal() {
    let el = document.getElementById("dp-modal");
    if (el) ReactDOM.unmountComponentAtNode(el);
}
export function ofTypeToJSON(t?: IValueType): any {
    if (!t) return undefined;
    return {
        name: t.name,
        ofType: ofTypeFromJSON(t.ofType)
    }
}
export function answerTypeToJSON(t: IValueType): { [key: string]: any } {
    return {
        name: t.name,
        ofType: ofTypeToJSON(t.ofType)
    }
}
export function ofTypeFromJSON(a: any) {
    if (!a) return undefined;
    let r: IValueType = {
        name: a.name,
        ofType: ofTypeFromJSON(a.ofType)
    }
    return r;
}

export function answerTypeFromJSON(a: any) {
    let r: IValueType = {
        name: a.name,
        ofType: ofTypeFromJSON(a.ofType)
    }
    return r;
}


export function optionFromJSON(a: any) {
    let option: IOption = {
        groupName: a.groupName,
        appearingCondition: QACondition.fromJSON(a.appearingCondition),
        id: a.id,
        value: a.value,
        type: answerTypeFromJSON(a.type)
    }
    return option;
}

export function optionToJSON(a: IOption) {
    return ({
        appearingCondition: QACondition.toJSON(a.appearingCondition),
        type: a.type ? answerTypeToJSON(a.type) : undefined,
        id: a.id,
        value: a.value,
        groupName: a.groupName
    })
}



export function autoAnswerToJSON(a: IAutoAnswer) {
    if (!a) return undefined;
    return ({
        isEnabled: a.isEnabled,
        answeringConditions: a.answeringConditions.map(item => answerConditionToJSON(item))
    })
}

export function autoAnswerFromJSON(a: any) {
    let r: IAutoAnswer = {
        isEnabled: a.isEnabled,
        answeringConditions: a.answeringConditions.map((item: any) => answerConditionFromJSON(item))
    }
    return r;

}

export function answerConditionToJSON(a: IAnswerCondition) {
    return ({
        condition: QACondition.toJSON(a.condition),
        ifTrue: (a.ifTrue),
        ifFalse: (a.ifFalse)
    })
}
export function optionGroupToJSON(a: IOptionGroup) {
    return ({
        id: a.id,
        name: a.name,
        appearingCondition: QACondition.toJSON(a.appearingCondition),
        members: a.members.map(item => optionToJSON(item))
    })
}

// export function optionGroupFromJSON(a:any): IOptionGroup {
//     let r: IOptionGroup  = {

//     }
//     return r;
// }

export function answerConditionFromJSON(a: any): IAnswerCondition {
    let r: IAnswerCondition = {
        condition: QACondition.fromJSON(a.condition),
        ifFalse: a.ifFalse,
        ifTrue: a.ifTrue
    }
    return r;
}

export function dupeSettingsToJSON(a: IDupeSettings) {
    return ({
        isEnabled: a.isEnabled,
        condition: QACondition.toJSON(a.condition),
        duplicateTimes: { value: a.duplicateTimes.value, type: a.duplicateTimes.type }
    })
}
export function dupeSettingsFromJSON(a: any) {
    let r: IDupeSettings = {
        isEnabled: a.isEnabled,
        duplicateTimes: {
            value: a.duplicateTimes,
            type: a.duplicateTimes.type as DuplicateTimesType
        },
        condition: QACondition.fromJSON(a.condition)
    }
    return r;
}




