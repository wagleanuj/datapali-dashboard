import { QACondition } from "./condition";

export type DuplicateTimesType = "questionRef" | "number";

export interface IDupeSettings {
    isEnabled: boolean,
    condition?: QACondition,
    duplicateTimes: { value: string, type: DuplicateTimesType },
}
