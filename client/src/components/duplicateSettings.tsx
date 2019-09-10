import React from "react";
import { ButtonGroup, Button, Switch, Classes, Divider } from "@blueprintjs/core";
import { QAQuestion } from "../form/question";
import Select from "react-select";
import { customStyles } from "./DPFormItem";
import _ from "lodash";
import classNames from "classnames";
import { IDupeSettings, DuplicateTimesType } from "../form/duplicateSettings";

interface DuplicateSettingsProps extends IDupeSettings {
    definedQuestions: { [key: string]: QAQuestion }
    handleSave: (dupe: IDupeSettings) => void,
    handleCancel: () => void

}
interface DuplicateSettingsState extends IDupeSettings {

}

export class DuplicateSettings extends React.Component<DuplicateSettingsProps, DuplicateSettingsState>{
    constructor(props: DuplicateSettingsProps) {
        super(props);
        this.state = {
            isEnabled: this.props.isEnabled,
            condition: this.props.condition,
            duplicateTimes: this.props.duplicateTimes
        }
    }

    private handleQuestionRefChange(newValue: any) {
        this.setState({
            duplicateTimes: { value: newValue.value, type: "questionRef" }
        })
    }
    private handleNumberTimesChange(newValue: string) {
        this.setState({
            duplicateTimes: { value: newValue, type: "number" }
        })
    }
    private handleTypeChange(newType: any) {
        this.setState((prevState: DuplicateSettingsState) => {
            return {
                duplicateTimes: { value: "", type: newType.value }
            }
        })
    }
    private handleEnabledChange() {
        this.setState((prevState: DuplicateSettingsState) => {
            return {
                isEnabled: !prevState.isEnabled
            }
        })
    }
    private generateValueComponent(type?: string) {
        if (type === "questionRef") {
            let options = Object.values(this.props.definedQuestions).map(item => ({ value: item.id, label: item.questionContent.content }));
            let selected = this.state.duplicateTimes.type === "questionRef" ? options.find(item => item.value === this.state.duplicateTimes.value) : undefined;
            return <Select styles={customStyles} options={options} defaultValue={selected} onChange={this.handleQuestionRefChange} />
        }
        return <input defaultValue={this.state.duplicateTimes.type === "number" ? this.state.duplicateTimes.value : ""} type="number" className="form-control" onChange={e => this.handleNumberTimesChange(e.target.value)} />
    }
    private handleSave() {
        let isInvalid = _.values(this.state).every(_.isEmpty);
        if (!isInvalid) {
            this.props.handleSave({ isEnabled: this.state.isEnabled, condition: this.state.condition, duplicateTimes: this.state.duplicateTimes })
        }
    }

    render() {
        let typeOptions = [{ value: "number", label: "Number" }, { value: "questionRef" as DuplicateTimesType, label: "AnswerValue" as DuplicateTimesType }];
        let defaultValue = typeOptions.find(item => item.value === this.state.duplicateTimes.type);

        return (

            <ButtonGroup className={classNames(Classes.ELEVATION_2, Classes.DARK)} vertical fill>
                <Switch onChange={this.handleEnabledChange.bind(this)} defaultChecked={this.props.isEnabled}>Enabled</Switch>
                <Divider />
                <Select menuContainerStyle={{ zIndex: 99999 }} styles={customStyles} onChange={(e: any) => this.handleTypeChange(e)} options={typeOptions} defaultValue={defaultValue}></Select>
                {this.generateValueComponent(this.state.duplicateTimes.type)}
                <Divider />
                <ButtonGroup fill>
                    <Button onClick={this.handleSave.bind(this)}>
                        Save
                    </Button>
                    <Button onClick={this.props.handleCancel}>
                        Cancel
                    </Button>
                </ButtonGroup>
            </ButtonGroup>


        )
    }
}