import React, { useState } from "react";
import { ANSWER_TYPES, QAValueType } from "./AnswerType";
import { DatePicker, TimePicker, TimePrecision, DateRangePicker, DateInput } from "@blueprintjs/datetime"
import { ButtonGroup, Divider } from "@blueprintjs/core";
import Select from "react-select"
import { customStyles } from "./DPFormItem";

interface RangeValue {
    min: string
    max: string
}


interface RangeInputProps {
    type: QAValueType,
    value: RangeValue,
    onChange: (newRange: RangeValue) => void
}

interface RangeInputState {

}
export class RangeInput extends React.Component<RangeInputProps, RangeInputState>{
    constructor(props: RangeInputProps) {
        super(props);
        this.state = {

        }
    }
    handleInputChange(data: RangeValue) {
        switch (this.props.type && this.props.type.name) {
            //necessary transforms to be done here
            case ANSWER_TYPES.TIME:
                if (this.props.onChange) this.props.onChange(data);
                break;
            case ANSWER_TYPES.DATE:
                if (this.props.onChange) this.props.onChange(data);
                break;
            case ANSWER_TYPES.NUMBER:
                if (this.props.onChange) this.props.onChange(data);
                break;
            default:
                if (this.props.onChange) this.props.onChange(data);

                break;

        }
    }
    render() {
        let comp = null;
        let type = this.props.type ? this.props.type.name : undefined;
        switch (type) {
            case ANSWER_TYPES.TIME:
                comp = <TimeRange range={this.props.value} onChange={this.handleInputChange} />
                break;
            case ANSWER_TYPES.DATE:
                let dateMin = this.props.value.min ? new Date(this.props.value.min) : undefined;
                let dateMax = this.props.value.max ? new Date(this.props.value.max) : undefined;
                comp = <DateRangePicker shortcuts={false} defaultValue={[dateMin, dateMax]} onChange={(selectedDates) => this.handleInputChange({ min: selectedDates[0] ? selectedDates[0].toString() : "", max: selectedDates[1] ? selectedDates[1].toString() : "" })} />
                break;
            case ANSWER_TYPES.NUMBER:
                comp = <NumberRange range={this.props.value} onChange={d => console.log(d)} />
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
    const [minValue, setMin] = useState(props && props.range.min || "");
    const [maxValue, setMax] = useState(props && props.range.max || "");
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
    const [minValue, setMin] = useState(props && props.range.min || "");
    const [maxValue, setMax] = useState(props && props.range.max || "");
    return (
        <ButtonGroup>
            <TimePicker className="form-control" precision={TimePrecision.MINUTE} useAmPm={true} defaultValue={new Date(minValue)} onChange={newTime => {
                setMin(newTime.toLocaleDateString());
                if (props.onChange) props.onChange({ min: minValue, max: maxValue })
            }}></TimePicker>
            <Divider />

            <TimePicker className="form-control" precision={TimePrecision.MINUTE} useAmPm={true} defaultValue={new Date(maxValue)} onChange={newTime => {
                setMax(newTime.toLocaleDateString());
                props.onChange({ min: minValue, max: maxValue })
            }}></TimePicker>
        </ButtonGroup>
    )
}

interface ValInputProps {
    type: QAValueType,
    defaultValue?: any,
    onChange: (newValue: any) => void
}
interface ValInputState {

}
export class ValInput extends React.Component<ValInputProps, ValInputState> {
    static defaultProps: ValInputProps = {
        defaultValue: "",
        onChange: (e) => { console.log(e) },
        type: { name: ANSWER_TYPES.STRING }
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
                comp = <input className="form-control" type="number" onChange={e => {
                    if (this.props.onChange) this.props.onChange(e.target.value)
                }}
                />
                break;
            case ANSWER_TYPES.SELECT:
                //TODO::
                break;
            case ANSWER_TYPES.BOOLEAN:
                let opt = [{ value: "true", label: "YES" }, { value: "false", label: "No" }];
                let def = opt.find(item => item.value === this.props.defaultValue);
                comp = <Select styles={customStyles} defaultValue={def} options={opt} onChange={(newVal: any) => {
                    if (this.props.onChange) this.props.onChange({ value: newVal })
                }} />
                break;
            case ANSWER_TYPES.DATE:
                let defaultDate = this.props.defaultValue ? new Date(this.props.defaultValue) : undefined;
                comp = <DateInput  formatDate={date => date.toLocaleDateString()}
                    parseDate={str => new Date(str)}
                    closeOnSelection={true} defaultValue={defaultDate} onChange={e => {
                        if (this.props.onChange) this.props.onChange({ value: e.toLocaleDateString() })
                    }
                    } />
                break;
            case ANSWER_TYPES.RANGE:
                if (this.props.type.ofType) {
                    comp = <RangeInput
                        value={{ min: this.props.defaultValue.min, max: this.props.defaultValue.max }}
                        type={this.props.type.ofType}
                        onChange={e => {
                            if (this.props.onChange) this.props.onChange({ value: e })
                        }}
                    />
                }
                break;
            case ANSWER_TYPES.STRING:
                comp = <input className="form-control" type="text" onChange={e => {
                    if (this.props.onChange) this.props.onChange({ value: e.target.value })
                }} />
                break;
            case ANSWER_TYPES.TIME:
                let defaulttime = this.props.defaultValue ? new Date(this.props.defaultValue) : undefined;
                comp = <TimePicker  precision={TimePrecision.MINUTE} useAmPm={true} defaultValue={defaulttime} onChange={newTime => {
                    if (this.props.onChange) this.props.onChange({ value: newTime.toString() })
                }}></TimePicker>

        }
        return (
            comp
        )
    }
}
interface SelInputProps {

}
interface SelInputState {

}
// export class SelInput extends React.Component<SelInputProps, SelInputState>{
//     constructor(props: SelInputProps) {
//         super(props);
//         this.state = {}
//     }
//     render() {
//         let comp = [];
//     }
// }