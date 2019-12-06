import { AnswerType, IAnswerOption } from "@datapali/dpform";
import React from "react";
import Select from 'react-select';
import { customStyles, ISelectOption } from "./DPFormItem";

interface ValueInputProps {
    onChange: Function,
    questionType: AnswerType|undefined,
    options?: ISelectOption[],
    value: IAnswerOption 
}

interface ValueInputState {

}

export class ValueInput extends React.Component<ValueInputProps, ValueInputState> {
    constructor(props: ValueInputProps) {
        super(props);
    }
    onDataChange(data: any) {
        if (this.props.onChange) {
            this.props.onChange(data);
        }
    }
    render() {
        let comp = null;
        let opt_ = [];
        switch (this.props.questionType) {
            case AnswerType.Boolean:
                opt_ = [{ value: true, label: "True" }, { value: false, label: "False" }];
                comp = <Select options={opt_} value={opt_.find(i => typeof this.props.value.value === "boolean" && i.value === this.props.value.value)} onChange={this.props.onChange.bind(this)} styles={customStyles} />;
                break;
            case AnswerType.Date:
                comp = <input onChange={e => this.onDataChange({ value: e.target.value })} className="form-control" type="date" defaultValue={this.props.value.value} />;
                break;
            case AnswerType.Number:
                comp = <input onChange={e => this.onDataChange({ value: e.target.value })} className="form-control" type="number" defaultValue={this.props.value.value} />;
                break;
            case AnswerType.Select:
                comp = <Select styles={customStyles} onChange={this.onDataChange.bind(this)} options={this.props.options} value={this.props.options && this.props.options.find((item: any) => item.value === this.props.value)} />;
                break;
            case AnswerType.String:
                comp = <input onChange={e => this.onDataChange({ value: e.target.value })} className="form-control" type="text" defaultValue={this.props.value.value} />;
                break;
            case AnswerType.Time:
                comp = <input onChange={e => this.onDataChange({ value: e.target.value })} className="form-control" type="time" defaultValue={this.props.value.value} />;
                break;
            default:
                comp = <input onChange={e => this.onDataChange({ value: e.target.value })} className="form-control" type="text" disabled />;
                break;
        }
        return comp;
    }
}
