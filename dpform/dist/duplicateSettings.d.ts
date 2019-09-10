import { QACondition } from './condition';
export declare type DuplicateTimesType = 'questionRef' | 'number';
export interface IDupeSettings {
    isEnabled: boolean;
    condition?: QACondition;
    duplicateTimes: {
        value: string;
        type: DuplicateTimesType;
    };
}
export declare function dupeSettingsToJSON(a: IDupeSettings): {
    isEnabled: boolean;
    condition: {
        [key: string]: any;
    } | undefined;
    duplicateTimes: {
        value: string;
        type: DuplicateTimesType;
    };
};
export declare function dupeSettingsFromJSON(a: any): IDupeSettings;
