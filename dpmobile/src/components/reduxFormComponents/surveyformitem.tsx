import { ANSWER_TYPES, getReadablePath, IValueType } from "dpform";
import _ from "lodash";
import React from "react";
import { DatePickerAndroid, ScrollView, View } from "react-native";
import { Button, Icon, Text, ThemedComponentProps, withStyles } from "react-native-ui-kitten";
import { connect } from "react-redux";
import { Action, Dispatch } from "redux";
import { DAppState } from "../../redux/actions/types";
import { Helper } from "../../redux/helper";
import { getNodeOfRootForm } from "../../redux/selectors/nodeSelector";
import { getAutoCompleteDataForQuestion, getTransformedValidOptions } from "../../redux/selectors/questionSelector";
import { AutoComplete } from "../autocompleteinput.component";
import { RadioInput } from "./radioInput.component";

export interface AutoCompleteItem {
    text: string;
    strength: number;
}
type FormItemProps = {
    questionId: string;
    valueLocationName: string;
    formId: string;
    rootId: string;
    path: number[];
    value: string;
    options?: { id: string, text: string }[];
    dependencies: any,
    type: IValueType;
    error: string;
    title: string;
    name: string;
    onChange: (value: string) => void;
    onBlur: (value: string) => void;
    isRequired: boolean;
    autoCompleteData?: AutoCompleteItem[]
    autoFillValue?: string;
    onSubmit: ()=>void;
} & ThemedComponentProps;

//replacement for question component
class FormItem_ extends React.Component<FormItemProps, {}> {
    constructor(props: FormItemProps) {
        super(props);
    }

    render() {
        const { themedStyle,
            path,
            title,
            options,
            isRequired,
            autoCompleteData,
            autoFillValue,
            error,
            onBlur,
            onChange,
            value,
            type,
        } = this.props;
        return (
            <View key={'input-field-container' + this.props.questionId}

                style={themedStyle.container} >
                <Text style={themedStyle.questionTitle}>
                    {`${path ? getReadablePath(path.slice(0)) : ''} : ${title} ${isRequired ? '*' : ''}`}
                </Text>
                <ScrollView>

                    <FormInput
                        key={'input-field' + this.props.questionId}
                        isDependent={this.props.isDependent}
                        dependencies={this.props.dependencies}
                        autoCompleteData={autoCompleteData}
                        autoFillValue={autoFillValue}
                        error={error}
                        onBlur={onBlur}
                        onValueChange={onChange}
                        options={options}
                        value={value}
                        type={type}
                        questionId={this.props.questionId}
                        onSubmit={this.props.onSubmit}
                    />
                </ScrollView>


            </View>
        )
    }

}

export const FormItemStyled = withStyles(FormItem_, theme => ({
    container: {
        paddingBottom: 20,
        paddingLeft: 5,
        paddingRight: 5,
        marginBottom: 5,
        marginTop: 5,
    },
    questionContainer: {
        paddingLeft: 5,
        paddingRight: 5,
    },
    questionTitle: {
        fontSize: 15,
        fontWeight: 'bold',
        paddingBottom: 20,
    },
    inputScrollView: {
        height: 400
    }
}))
const mapStateToProps = (state: DAppState, props: FormItemProps) => {
    const all = getNodeOfRootForm(state, props);
    const type = all.answerType;
    const title = all.questionContent.content;
    const deps = Helper.collectDependencies(all);
    return {
        isRequired: all.isRequired,
        autoCompleteData: getAutoCompleteDataForQuestion(state, props),
        isDependent: deps.all.length > 0,
        dependencies: deps,
        title: title,
        type: type,
        options: type.name === ANSWER_TYPES.SELECT ? getTransformedValidOptions(state, props) : [],

    }
}

const mapDispatchToProps = (dispatch: Dispatch<Action<any>>) => {
    return {
    }
};

export const ConnectedFormItem = connect(mapStateToProps, mapDispatchToProps)(FormItemStyled)

interface FormInputProps {
    questionId: string;
    dependencies: any,
    isDependent: boolean;
    valueLocationName: string;
    type: IValueType;
    value: string;
    options?: { text: string, id: string }[]
    autoCompleteData: AutoCompleteItem[];
    onValueChange: (value: string) => void;
    autoFillValue?: string;
    error: string;
    onBlur: (value: string) => void;
    onSubmit: ()=>void;

}
class FormInput extends React.Component<FormInputProps, {}> {
    openDatePicker = async (defaultDate: Date, onDateChange?: (date: Date) => void) => {
        try {
            const { action, year, month, day } = await DatePickerAndroid.open({
                date: defaultDate || new Date(),
            });
            if (action !== DatePickerAndroid.dismissedAction) {
                // Selected year, month (0-11), day
                if (onDateChange) onDateChange(new Date(year, month, day));
            }
        } catch ({ code, message }) {
            console.warn('Cannot open date picker', message);
        }
    }
    componentDidUpdate() {

    }

    render() {
        const { props } = this;
        const defaultValue = props.value || props.autoFillValue;

        switch (props.type.name) {
            case ANSWER_TYPES.NUMBER:
                return <AutoComplete
                    keyboardType={'numeric'}
                    value={defaultValue}
                    data={props.autoCompleteData}
                    onChange={props.onValueChange}
                    onBlur={props.onBlur}
                    error={props.error}
                    onSubmit={props.onSubmit}
                />
            case ANSWER_TYPES.STRING:
                return <AutoComplete
                    value={defaultValue}
                    data={props.autoCompleteData}
                    onChange={props.onValueChange}
                    error={props.error}
                    onBlur={props.onBlur}
                    onSubmit={props.onSubmit}
                />


            case ANSWER_TYPES.GEOLOCATION:
                let defaultLocation = (locationJSON: any) => {
                    return `Latitude: ${locationJSON.coords.latitude}\nLongitude: ${locationJSON.coords.longitude}`;
                }
                let dl = defaultValue ? defaultLocation(JSON.parse(defaultValue)) : "";
                return <Button
                    appearance='outline'
                    icon={(style) => (<Icon {...style} name="navigation" />)}

                    onPress={() => {
                        navigator.geolocation.getCurrentPosition(
                            position => {
                                const location = JSON.stringify(position);
                                props.onValueChange(location);

                            },
                            error => { },
                            { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
                        );
                    }} >
                    {dl}
                </Button>
            case ANSWER_TYPES.DATE:
                let defDate = new Date(defaultValue);
                let date = defDate && !_.isNaN(defDate.getTime()) ? defDate : new Date();
                return <View>
                    <Button
                        appearance='outline'
                        icon={(style) => (<Icon {...style} name="calendar" />)}
                        onPress={() => this.openDatePicker(date, (date: Date) => {
                            let stringified = date.toDateString();
                            props.onValueChange(stringified);
                        })}
                    >{date.toDateString()}</Button>
                    <Text style={{ color: 'red' }}>{this.props.error}</Text>
                </View>

            case ANSWER_TYPES.SELECT:
                return <SelectInput
                    error={props.error}
                    listKey={this.props.questionId}
                    isDependent={props.isDependent}
                    dependencies={props.dependencies}
                    options={props.options}
                    onChange={props.onValueChange}
                    selectedId={defaultValue}
                />
        }
    }
}

type SelectInputProps = {
    listKey?: string;
    isDependent: boolean;
    dependencies: any;
    options: { text: string, id: string }[];
    selectedId: string;
    onChange: (id: string) => void;
    error: string;
}
type SelectInputState = {
}
export class SelectInput extends React.Component<SelectInputProps, SelectInputState>{
    lockIcon: Icon<{ ref: unknown; width: number; height: number; name: "lock"; animation: "shake"; }>;
    constructor(props: SelectInputProps) {
        super(props);
    }
    private onChange(val: { text: string, id: string }) {
        this.props.onChange(val.id);
    }
    private get isNonIdealState() {
        return this.props.options.length === 0 && this.props.isDependent;
    }

    private checkAndReset() {
        const index = this.props.options.findIndex(i => i.id === this.props.selectedId);
        if (index === -1 && !!this.props.selectedId) {
            this.props.onChange("");
        }
    }

    componentDidUpdate() {
        this.checkAndReset();
    }

    shouldComponentUpdate(nextProps: SelectInputProps) {
        if (nextProps.selectedId !== this.props.selectedId) return true;
        return this.props.isDependent;

    }

    render() {
        return <View>
            {!!this.props.error && <Text style={{ color: 'red' }}>{this.props.error}</Text>}
            {!this.isNonIdealState &&

                <RadioInput
                    listKey={this.props.listKey}
                    defaultSelected={this.props.options.findIndex(i => i.id === this.props.selectedId)}
                    options={this.props.options}
                    onSelectionChange={this.onChange.bind(this)}
                />

            }
            {
                this.isNonIdealState && <View style={{ flex: 1, flexDirection: 'column', alignItems: 'center' }}>
                    <Text category="s1" status='danger' >All options are locked!</Text>
                </View>
            }
        </View>
    }
}

