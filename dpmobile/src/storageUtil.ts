import { AsyncStorage } from "react-native";
import { FilledForm } from "./components/forms";
export class StorageUtil {

    static increamentFillCount() {
        return StorageUtil.getItem('fillcount').then(result => {
            let count = parseInt(result);
            return StorageUtil.storeItem('fillcount', (count + 1).toString())
        })
    }
   

    static getUserId() {
        return StorageUtil.getItem('userId');
    }

    static getUserName() {
        return StorageUtil.multiGet(['firstName','lastName']);
    }

    static setUserName(firstname: string, lastName: string) {
        return StorageUtil.multiSet({firstName: firstname, lastName: lastName});
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
        multisetData[filledForm.id] = filledForm;
        return StorageUtil.multiSet(multisetData);
    }

    static getFilledForm(id: string) {
        return StorageUtil.getItem(id);
    }

    static getItem(key: string) {
        return AsyncStorage.getItem(key).then(result => {
            return JSON.parse(result);
        }).catch(err => {
            return undefined;
        })
    }

    static multiGet(keys: string[]) {
        return AsyncStorage.multiGet(keys).then(result => {
            return result.map(item => ({ [item[0]]: JSON.parse(item[1]) }));
        }).catch(err => {
            return undefined;
        })
    }

    static multiSet(obj: { [key: string]: object|string }) {
        let arr = [];
        Object.keys(obj).forEach(item => {
            arr.push([item, JSON.stringify(obj[item])]);
        })
        return AsyncStorage.multiSet(arr).then(res => true).catch(err => false);
    }
    
    static storeItem(key: string, value: string) {
        return AsyncStorage.setItem(key, value).then(result => {
            return true;
        }).catch(err => {
            return false;
        })
    }
}
