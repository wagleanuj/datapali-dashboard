import { ReactElement } from "react";
import ReactDOM from "react-dom";
import { IValueType, IOption, QACondition, IAutoAnswer, IAnswerCondition, IOptionGroup, IDupeSettings, DuplicateTimesType } from ".";


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


export function request(API_URL: string, queryName: string, requestBody: any, onErrorMessage: string, token: string) {
    let headers: any = { "Content-Type": "application/json" }
    if (token) headers["Authorization"] = token;
    return fetch(API_URL, {
        method: "POST",
        body: JSON.stringify(requestBody),
        headers: headers
    })
        .then(res => {
            if (res.status !== 200) {
                throw new Error(onErrorMessage || "Failed");
            }
            return res.json();
        })
        .then(resData => {
            if (resData.errors) {
                throw resData.errors[0]; //throw the first error only
            } else if (resData.data && resData.data[queryName]) {
                return resData.data[queryName];
            }
        })
        .catch(err => {
            throw err;
        });
}
export function getReadablePath(nu: number[]) {
    return nu.slice(1).map(item => item + 1).join(".");

}
export function getRandomId(startingText?: string) {
    if (!startingText)
        startingText = "";
    var S4 = function () {
        return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    };
    return startingText + (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
}
