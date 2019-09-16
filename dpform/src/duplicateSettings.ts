import { QACondition } from './condition';

export type DuplicateTimesType = 'questionRef' | 'number';

export interface IDupeSettings {
    isEnabled: boolean;
    condition?: QACondition;
    duplicateTimes: { value: string, type: DuplicateTimesType };
}
export function dupeSettingsToJSON(a: IDupeSettings) {
    return ({
        isEnabled: a.isEnabled,
        condition: QACondition.toJSON(a.condition),
        duplicateTimes: { value: a.duplicateTimes.value, type: a.duplicateTimes.type },
    });
}
export function dupeSettingsFromJSON(a: any) {
    const r: IDupeSettings = {
        isEnabled: a.isEnabled,
        duplicateTimes: {
            value: a.duplicateTimes.value,
            type: a.duplicateTimes.type as DuplicateTimesType,
        },
        condition: QACondition.fromJSON(a.condition),
    };
    return r;
}
