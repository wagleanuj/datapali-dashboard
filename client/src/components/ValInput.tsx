import React, { useState } from "react";
import { TimePicker, TimePrecision, DateRangePicker, DateInput } from "@blueprintjs/datetime"
import { ButtonGroup, Divider } from "@blueprintjs/core";
import Select from "react-select"
import { customStyles } from "./DPFormItem";
import { AnswerOptions } from "../form/AnswerOptions";
import { IValueType, ANSWER_TYPES } from "../form";

interface RangeValue {
    min: string | undefined
    max: string | undefined
}


interface RangeInputProps {
    type: IValueType,
    value: string,
    onChange: (newRange: string) => void
}

interface RangeInputState {

}
export class RangeInput extends React.Component<RangeInputProps, RangeInputState>{
    constructor(props: RangeInputProps) {
        super(props);
        this.state = {

        }
    }
    parseRangeValue(range: string): RangeValue {
        let d = range.split("-")
        return { min: d[0], max: d[1] }
    }

    handleInputChange(data: RangeValue) {
        let transformed = data.min + "-" + data.max;
        switch (this.props.type && this.props.type.name) {
            //necessary transforms to be done here
            case ANSWER_TYPES.TIME:
                if (this.props.onChange) this.props.onChange(transformed);
                break;
            case ANSWER_TYPES.DATE:
                if (this.props.onChange) this.props.onChange(transformed);
                break;
            case ANSWER_TYPES.NUMBER:
                if (this.props.onChange) this.props.onChange(transformed);
                break;
            default:
                if (this.props.onChange) this.props.onChange(transformed);

                break;

        }
    }
    render() {
        let comp = null;
        let type = this.props.type ? this.props.type.name : undefined;
        let parsed = this.parseRangeValue(this.props.value);
        switch (type) {
            case ANSWER_TYPES.TIME:
                comp = <TimeRange range={parsed} onChange={this.handleInputChange} />
                break;
            case ANSWER_TYPES.DATE:
                let dateMin = parsed.min ? new Date(parsed.min) : undefined;
                let dateMax = parsed.max ? new Date(parsed.max) : undefined;
                comp = <DateRangePicker shortcuts={false} defaultValue={[dateMin, dateMax]} onChange={(selectedDates) => this.handleInputChange({ min: selectedDates[0] ? selectedDates[0].toString() : "", max: selectedDates[1] ? selectedDates[1].toString() : "" })} />
                break;
            case ANSWER_TYPES.NUMBER:
                comp = <NumberRange range={parsed} onChange={d => this.handleInputChange} />
                break;
        }
        return comp;
    }
}



interface NumberRangeProps {
    range: RangeValue,
    onChange: (range: RangeValue) => void,
}
const defaultNumberRangeProps: NumberRangeProps = {
    range: { min: "", max: "" },
    onChange: () => { }
}

const NumberRange = (props: NumberRangeProps = defaultNumberRangeProps) => {
    const [minValue, setMin] = useState(props ? props.range.min : "");
    const [maxValue, setMax] = useState(props ? props.range.max : "");
    return (
        <ButtonGroup>
            <input className="form-control" defaultValue={props && props.range.min && props.range.min.toString()}
                onChange={e => {
                    setMin(e.target.value);
                    if (props && props.onChange) props.onChange({ min: minValue, max: maxValue })
                }} placeholder="Minimum" id="numberRange-min" type="number"></input>
            <Divider></Divider>
            <input className="form-control" defaultValue={props && props.range.max && props.range.max.toString()} onChange={e => {
                setMax(e.target.value);
                if (props && props.onChange) props.onChange({ min: minValue, max: maxValue })
            }} placeholder="Maximum" id="numberRange-max" type="number"></input>
        </ButtonGroup>
    )
}

interface TimeRangeProps {
    range: RangeValue,
    onChange: (range: RangeValue) => void
}
const defaultTimeRangeProps = {
    range: {
        min: "Sat Aug 31 2019 13:35:27 GMT-0230 (Newfoundland Daylight Time",
        max: "Sat Aug 31 2019 13:35:27 GMT-0230 (Newfoundland Daylight Time"
    },
    onChange: () => { }
}
const TimeRange = (props: TimeRangeProps = defaultTimeRangeProps) => {
    const [minValue, setMin] = useState(props ? props.range.min : undefined);
    const [maxValue, setMax] = useState(props ? props.range.max : undefined);
    console.log(maxValue);
    console.log(minValue);
    return (
        <ButtonGroup className="bp3-dark">
            <TimePicker precision={TimePrecision.MINUTE} useAmPm={true} defaultValue={minValue ? new Date(minValue) : undefined} onChange={newTime => {
                setMin(newTime.toLocaleDateString());
                if (props.onChange) props.onChange({ min: minValue, max: maxValue })
            }}></TimePicker>
            <Divider />

            <TimePicker precision={TimePrecision.MINUTE} useAmPm={true} defaultValue={maxValue ? new Date(maxValue) : undefined} onChange={newTime => {
                setMax(newTime.toLocaleDateString());
                props.onChange({ min: minValue, max: maxValue })
            }}></TimePicker>
        </ButtonGroup>
    )
}

interface ValInputProps {
    type: IValueType,
    defaultValue?: any,
    options?: AnswerOptions | undefined,
    onChange: (newValue: any) => void
}
interface ValInputState {

}
export class ValInput extends React.Component<ValInputProps, ValInputState> {
    static get defaultProps(): ValInputProps {
        return {
            defaultValue: "",
            onChange: (e) => { console.log(e) },
            type: { name: ANSWER_TYPES.STRING }
        }
    }
    constructor(props: ValInputProps) {
        super(props);
        this.state = {

        }
    }
    render() {
        let comp = null;
        switch (this.props.type.name) {
            case ANSWER_TYPES.NUMBER:
                comp = <input
                    defaultValue={this.props.defaultValue}
                    className="form-control"
                    type="number"
                    onChange={e => {
                        if (this.props.onChange) this.props.onChange({ value: e.target.value })
                    }}
                />
                break;
            case ANSWER_TYPES.SELECT:
                comp = <SelInput
                    type={this.props.type.ofType}
                    defaultValue={this.props.defaultValue}
                    options={this.props.options}
                    onChange={(newVal: any) => {
                        if (this.props.onChange) this.props.onChange(newVal)
                    }} />

                //TODO::
                break;
            case ANSWER_TYPES.BOOLEAN:
                let opt = [{ value: "true", label: "YES" }, { value: "false", label: "No" }];
                let def = opt.find(item => item.value === this.props.defaultValue);
                comp = <Select
                    styles={customStyles}
                    defaultValue={def}
                    options={opt}
                    onChange={(newVal: any) => {
                        if (this.props.onChange) this.props.onChange({ value: newVal.value })
                    }} />
                break;
            case ANSWER_TYPES.DATE:
                let defaultDate = this.props.defaultValue ? new Date(this.props.defaultValue) : undefined;
                comp = <DateInput
                    formatDate={date => date.toLocaleDateString()}
                    parseDate={str => new Date(str)}
                    closeOnSelection={true}
                    defaultValue={defaultDate}
                    onChange={e => {
                        if (this.props.onChange) this.props.onChange({ value: e.toLocaleDateString() })
                    }
                    } />
                break;
            case ANSWER_TYPES.RANGE:
                if (this.props.type.ofType) {
                    comp = <RangeInput
                        value={this.props.defaultValue}
                        type={this.props.type.ofType}
                        onChange={e => {
                            if (this.props.onChange) this.props.onChange({ value: e })
                        }}
                    />
                }
                break;
            case ANSWER_TYPES.STRING:
                comp = <input
                    className="form-control"
                    type="text"
                    defaultValue={this.props.defaultValue}
                    onChange={e => {
                        if (this.props.onChange) this.props.onChange({ value: e.target.value })
                    }} />
                break;
            case ANSWER_TYPES.TIME:
                let defaulttime = this.props.defaultValue ? new Date(this.props.defaultValue) : undefined;
                comp = <TimePicker precision={TimePrecision.MINUTE} useAmPm={true} defaultValue={defaulttime} onChange={newTime => {
                    if (this.props.onChange) this.props.onChange({ value: newTime.toString() })
                }}></TimePicker>

        }
        return (
            comp
        )
    }
}
interface SelInputProps {
    options?: AnswerOptions,
    type?: IValueType,
    defaultValue?: string,
    onChange: (data: any) => void
}
interface SelInputState {

}
export class SelInput extends React.Component<SelInputProps, SelInputState>{
    constructor(props: SelInputProps) {
        super(props);
        this.state = {}
    }
    handleChange(d: any) {
        console.log(d);
        if (this.props.onChange) this.props.onChange(d);
    }
    render() {
        let allOptions: any = [];
        if (this.props.options) {
            let { rootOptions, groups } = this.props.options.SortedOptions;
            let groupOptions_: any = [];
            let rootOptions_: any = []
            if (groups && groups.length > 0) {
                groupOptions_ = groups.map(item => {
                    return ({
                        label: item.name,
                        options: item.members.map(i => ({ label: i.value, value: i.id }))
                    })
                })
            }
            rootOptions_ = rootOptions.map(i => ({ label: i.value, value: i.id }));
            allOptions = [...groupOptions_, ...rootOptions_];
        }
        let findOption = (options_: any, findValue: string | undefined): any => {
            let found = null;
            for (let i = 0; i < options_.length; i++) {
                let options = options_[i];
                if (options.options && options.options.length > 0) {
                    found = options.options.find((item: any) => item.value === findValue);
                    if (found) break;
                }
                else {
                    found = options && options.value === findValue ? options : undefined;
                    if (found) break;
                }
            }
            return found;

        }
        let defaultvalue = findOption(allOptions, this.props.defaultValue)
        return (<Select styles={customStyles} options={allOptions} onChange={this.handleChange.bind(this)} defaultValue={defaultvalue} />)
    }
}