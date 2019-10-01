import { RootSection } from "dpform";
import _ from "lodash";
import { AsyncStorage } from "react-native";
import { AnswerSection } from "./answer.store";
import { FilledForm } from "./components/forms";
export class StorageUtil {

    static increamentFillCount() {
        return StorageUtil.getItem('fillcount').then(result => {
            let count = parseInt(result);
            return StorageUtil.storeItem('fillcount', (count + 1).toString())
        })
    }
    static getUserId() {
        return StorageUtil.getItem('userID');
    }
    static getUserInfo() {
        return StorageUtil.multiGet(['firstName', 'lastName', 'availableForms', 'filledForms', 'userID']);
    }

    static getUserName() {
        return StorageUtil.multiGet(['firstName', 'lastName']);
    }

    static getAvailableFormIds() {
        return StorageUtil.getItem("availableForms");
    }
    static setAvailableFormIds(formIds: string[]) {
        return StorageUtil.storeItem("availableForms", formIds)
    }

    static setUserName(firstname: string, lastName: string) {
        return StorageUtil.multiSet({ firstName: firstname, lastName: lastName });
    }

    static setAuthToken(token: string) {
        return StorageUtil.storeItem('authToken', token);
    }

    static getAuthToken() {
        return StorageUtil.getItem('authToken');
    }

    static getSurveyorCode() {
        return StorageUtil.getItem('surveyorCode');
    }

    static getFilledFormIds(): Promise<string[]> {
        return StorageUtil.getItem('filledForms');
    }

    static async saveFilledForm(filledForm: FilledForm) {
        let filledForms = await StorageUtil.getFilledFormIds();
        let multisetData: any = {
        }
        if (!filledForms.includes(filledForm.id)) {
            filledForms.push(filledForm.id);
            multisetData.filledForms = filledForms;

        }
        let ff: any = _.cloneDeep(filledForm);
        ff.answerStore = AnswerSection.toJSON(filledForm.answerStore);
        console.log(AnswerSection.fromJSON(ff.answerStore));
        multisetData[filledForm.id] = ff;
        return StorageUtil.multiSet(multisetData);
    }

    static getFilledForms(ids: string[], root?: RootSection) {
        return StorageUtil.multiGet(ids).then(async res => {
            Object.keys(res).forEach(k => {
                let item = res[k];

                item.answerStore = AnswerSection.fromJSON(item.answerStore);
            });
            return res;

        });
    }

    static async removeFilledForm(ids: string[]) {
        await AsyncStorage.multiRemove(ids);
        let filledForms = await StorageUtil.getFilledFormIds();
        ids.forEach(async id => {
            let index = filledForms.findIndex(item => item === id);
            filledForms.splice(index, 1);
        });
        await StorageUtil.setFilledFormIds(filledForms);

    }
    static setFilledFormIds(ids: string[]) {
        return StorageUtil.storeItem("filledForms", ids);
    }

    static getItem(key: string) {
        return AsyncStorage.getItem(key).then(result => {
            return JSON.parse(result);
        }).catch(err => {
            return err;
        })
    }

    static multiGet(keys: string[]) {
        return AsyncStorage.multiGet(keys).then(result => {
            let merged = {};
            result.forEach(item => {
                merged[item[0]] = JSON.parse(item[1])
            })
            return merged;
        }).catch(err => {
            return undefined;
        })
    }

    static multiSet(obj: { [key: string]: object | string }) {
        let arr = [];
        Object.keys(obj).forEach(item => {
            arr.push([item, JSON.stringify(obj[item])]);
        })
        return AsyncStorage.multiSet(arr).then(res => true).catch(err => false);
    }

    static storeItem(key: string, value: string | object) {
        return AsyncStorage.setItem(key, JSON.stringify(value)).then(result => {
            return true;
        }).catch(err => {
            return false;
        })
    }
    static getForm(id: string) {
        return StorageUtil.getItem(id).then(res => {
            if (res) {
                res.content = JSON.parse(res.content);
            }
            return RootSection.fromJSON(res);
        })
    }
    static getForms(ids: string[]) {
        let returnForms = {};
        return StorageUtil.multiGet(ids).then(res => {
            if (res) {
                Object.keys(res).forEach(item => {
                    let form = res[item];
                    form.content = JSON.parse(form.content);
                    returnForms[form.id] = RootSection.fromJSON(form);
                });
            }
            return returnForms;
        })
    }
}
