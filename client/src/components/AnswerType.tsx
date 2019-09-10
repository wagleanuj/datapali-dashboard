import React from "react";
import { customStyles } from "./DPFormItem";
import Select from "react-select";
import { Row, Col } from "reactstrap";
import _ from "lodash";
import { ANSWER_TYPES, IValueType } from "dpform";

type QAAnswerTypeOption = { label: string, value: ANSWER_TYPES };


const ValueSelectOptions: QAAnswerTypeOption[] = [
    { value: ANSWER_TYPES.BOOLEAN, label: "YES/NO" },
    { value: ANSWER_TYPES.STRING, label: "Text" },
    { value: ANSWER_TYPES.TIME, label: "Time" },
    { value: ANSWER_TYPES.DATE, label: "Date" },
    { value: ANSWER_TYPES.NUMBER, label: "Number" },
    { value: ANSWER_TYPES.RANGE, label: "Range" },
    { value: ANSWER_TYPES.SELECT, label: "Multiple Choice" }
]

const OptionsForSelect: QAAnswerTypeOption[] = ValueSelectOptions.filter((item) => item.value && item.value !== ANSWER_TYPES.SELECT);
let includedInRange = [ANSWER_TYPES.TIME, ANSWER_TYPES.NUMBER, ANSWER_TYPES.DATE, ANSWER_TYPES.TIME];
const OptionsForRange: QAAnswerTypeOption[] = ValueSelectOptions.filter(item => includedInRange.includes(item.value))


interface AnswerTypeInputProps {
    answerType: IValueType,
    onChange: (val: IValueType) => void,
}

interface AnswerTypeInputState {
    answerType: IValueType,
}

export class AnswerTypeInput extends React.Component<AnswerTypeInputProps, AnswerTypeInputState>{
    static defaultProps = {
        answerType: { name: undefined, ofType: undefined }
    }
    constructor(props: AnswerTypeInputProps) {
        super(props);
        this.state = {
            answerType: this.props.answerType
        }
    }
    /**
     * 
     * @param data 
     */
    handleAnswerTypeChange(data: any): void {
        this.setState((prevState) => {
            let newAnswerType = _.clone(prevState.answerType);
            newAnswerType.name = data.value as ANSWER_TYPES;
            newAnswerType.ofType = undefined;
            return {
                answerType: newAnswerType
            }

        }, () => {
            if (this.props.onChange) this.props.onChange(this.state.answerType)
        })

    }

    /**
     * second select is for selecting types select and range
     * @param data 
     */
    handleSecondSelectChange(data: any): void {
        this.setState((prevState) => {
            let newAnswerType = _.clone(prevState.answerType);
            newAnswerType.ofType = { name: data.value as ANSWER_TYPES, ofType: undefined };
            if (newAnswerType.ofType.ofType) newAnswerType.ofType.ofType = undefined;
            return {
                answerType: newAnswerType
            }

        }, () => {
            if (this.props.onChange) this.props.onChange(this.state.answerType)
        })
    }

    /**
     * third select pops up only for range, to select the value types of range
     * @param data 
     */

    handleThirdSelectChange(data: any): void {
        this.setState((prevState) => {
            let newAnswerType = _.clone(prevState.answerType);
            if (newAnswerType.ofType) {
                newAnswerType.ofType.ofType = data.value;
            }
            return {
                answerType: newAnswerType
            }

        }, () => {
            if (this.props.onChange) this.props.onChange(this.state.answerType)
        })

    }

    render() {
        let shouldDisplaySecondSelect = this.state.answerType.name === ANSWER_TYPES.SELECT || this.state.answerType.name === ANSWER_TYPES.RANGE;
        let shouldDisplayThirdSelect = this.state.answerType.ofType && this.state.answerType.ofType.name === ANSWER_TYPES.RANGE;

        let optionsForSecondSelect = this.state.answerType.name === ANSWER_TYPES.SELECT ? OptionsForSelect : this.state.answerType.name === ANSWER_TYPES.RANGE ? OptionsForRange : []
        let OptionsForThirdSelect = this.state.answerType.ofType && this.state.answerType.ofType.name === ANSWER_TYPES.RANGE ? OptionsForRange : []
        return (
            <Row>
                <Col>
                    <label>Value Type</label>
                    <Select onChange={this.handleAnswerTypeChange.bind(this)} styles={customStyles}
                        options={ValueSelectOptions}
                        value={ValueSelectOptions.find((item: QAAnswerTypeOption) => item.value === this.state.answerType.name)}
                    />
                </Col>
                {shouldDisplaySecondSelect && <Col>
                    <label>of type</label>
                    <Select onChange={this.handleSecondSelectChange.bind(this)} styles={customStyles}
                        options={optionsForSecondSelect}
                        value={optionsForSecondSelect.find(item => this.state.answerType.ofType && item.value === this.state.answerType.ofType.name)}
                    />

                </Col>}
                {shouldDisplayThirdSelect && <Col>
                    <label>of type</label>
                    <Select onChange={this.handleThirdSelectChange.bind(this)} styles={customStyles}
                        options={OptionsForThirdSelect}
                        value={OptionsForThirdSelect.find(item => this.state.answerType.ofType && this.state.answerType.ofType.ofType && item.value === this.state.answerType.ofType.ofType.name)}
                    />

                </Col>
                }
            </Row>

        )
    }

}


