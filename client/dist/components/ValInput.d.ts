import React from "react";
import { IValueType, AnswerOptions } from "dpform";
interface RangeValue {
    min: string | undefined;
    max: string | undefined;
}
interface RangeInputProps {
    type: IValueType;
    value: string;
    onChange: (newRange: string) => void;
}
interface RangeInputState {
}
export declare class RangeInput extends React.Component<RangeInputProps, RangeInputState> {
    constructor(props: RangeInputProps);
    parseRangeValue(range: string): RangeValue;
    handleInputChange(data: RangeValue): void;
    render(): any;
}
interface ValInputProps {
    type: IValueType;
    defaultValue?: any;
    options?: AnswerOptions | undefined;
    onChange: (newValue: any) => void;
}
interface ValInputState {
}
export declare class ValInput extends React.Component<ValInputProps, ValInputState> {
    static readonly defaultProps: ValInputProps;
    constructor(props: ValInputProps);
    render(): any;
}
interface SelInputProps {
    options?: AnswerOptions;
    type?: IValueType;
    defaultValue?: string;
    onChange: (data: any) => void;
}
interface SelInputState {
}
export declare class SelInput extends React.Component<SelInputProps, SelInputState> {
    constructor(props: SelInputProps);
    handleChange(d: any): void;
    render(): JSX.Element;
}
export {};
