import { ANSWER_TYPES, getReadablePath, IValueType } from "dpform";
import _ from "lodash";
import React from "react";
import { DatePickerAndroid, View } from "react-native";
import { Button, Icon, Text, ThemedComponentProps, withStyles } from "react-native-ui-kitten";
import { connect } from "react-redux";
import { Action, Dispatch } from "redux";
import { AutoComplete } from "../components/autocompleteinput.component";
import { AutoCompleteItem } from "../components/forms.component";
import { RadioInput } from "../components/selectinput.component";
import { handleUpdateAnswer } from "../redux/actions/action";
import { AppState } from "../redux/actions/types";
import { getNodeOfRootForm } from "../redux/selectors/nodeSelector";
import { getQuestionTitle, getTransformedValidOptions } from "../redux/selectors/questionSelector";
import { Helper } from "../redux/helper";

type FormItemProps = {
    questionId: string;
    formId: string;
    rootId: string;
    path: number[];
    value: string;
    options?: { id: string, text: string }[];
    type: IValueType;
    error: string;
    title: string;
    name: string;
    onChange: (value: string) => void;
    onBlur: (value: string) => void;
    isRequired: boolean;
    autoCompleteData?: AutoCompleteItem[]
    autoFillValue?: string;
    updateAnswer: (formId: string, path: number[], questionId: string, value: string) => void;
} & ThemedComponentProps;

//replacement for question component
class FormItem_ extends React.Component<FormItemProps, {}> {
    constructor(props: FormItemProps) {
        super(props);
    }
    updateAnswer(value: string) {
        this.props.updateAnswer(this.props.formId, this.props.path, this.props.questionId, value);
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
            <View style={themedStyle.container} key={'main-view' + this.props.questionId}>
                <View>
                    <Text>
                        {`${path ? getReadablePath(path.slice(0)) : ''} : ${title} ${isRequired ? '*' : ''}`}
                    </Text>
                    <FormInput
                        autoCompleteData={autoCompleteData}
                        autoFillValue={autoFillValue}
                        error={error}
                        onBlur={onBlur}
                        onValueChange={onChange}
                        options={options}
                        value={value}
                        type={type}
                    />
                </View>
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
        paddingBottom: 20,
    }
}))

interface FormInputProps {
    questionId: string;
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

}
class FormInput extends React.Component<FormInputProps, {}> {
    shouldComponentUpdate() {
       if(!this.props.isDependent) {
           return true;
       }
       return false;
    }
    render() {
        const { props } = this;
        const defaultValue = props.value || props.autoFillValue;
        const openDatePicker = async (defaultDate: Date, onDateChange?: (date: Date) => void) => {
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

        switch (props.type.name) {
            case ANSWER_TYPES.NUMBER:
                return <AutoComplete
                    keyboardType={'numeric'}
                    textContentType={'telephoneNumber'}
                    value={defaultValue}
                    data={props.autoCompleteData}
                    onChange={props.onValueChange}
                    onBlur={props.onBlur}
                    error={props.error}
                />
            case ANSWER_TYPES.STRING:
                return <AutoComplete
                    textContentType={'name'}
                    value={defaultValue}
                    data={props.autoCompleteData}
                    onChange={props.onValueChange}
                    error={props.error}
                    onBlur={props.onBlur}
                />;
            case ANSWER_TYPES.GEOLOCATION:
                let defaultLocation = (locationJSON: any) => {
                    return `Latitude: ${locationJSON.coords.latitude}\nLongitude: ${locationJSON.coords.longitude}`;
                }
                let dl = defaultValue ? defaultLocation(JSON.parse(defaultValue)) : "";
                return <Button
                    appearance='outline'
                    icon={(style) => (<Icon {...style} name="calendar" />)}

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
                return <Button
                    appearance='outline'
                    icon={(style) => (<Icon {...style} name="calendar" />)}
                    onPress={() => openDatePicker(date, (date: Date) => {
                        let stringified = date.toDateString();
                        props.onValueChange(stringified);
                    })}
                >{date.toDateString()}</Button>
            case ANSWER_TYPES.SELECT:
                return <SelectInput
                    options={props.options}
                    onChange={props.onValueChange}
                    selectedId={defaultValue}
                />
        }
    }
}
type SelectInputProps = {
    options: { text: string, id: string }[];
    selectedId: string;
    onChange: (id: string) => void;
}
type SelectInputState = {
}
export class SelectInput extends React.Component<SelectInputProps, SelectInputState>{
    constructor(props: SelectInputProps) {
        super(props);
    }
    onChange(val: { text: string, id: string }) {
        this.props.onChange(val.id);
    }
    render() {
        return <View>
            <RadioInput
                defaultSelected={this.props.options.findIndex(i => i.id === this.props.selectedId)}
                options={this.props.options}
                onSelectionChange={this.onChange.bind(this)}
            />
        </View>
    }
}

const mapStateToProps = (state: AppState, props: FormItemProps) => {
    const all = getNodeOfRootForm(state, props);
    const type = all.answerType;
    const title = all.questionContent.content;
    const deps = Helper.collectDependencies(all);
    return {
        isDependent: deps.all.length>0,
        title:title,
        type: type,
        options: type.name === ANSWER_TYPES.SELECT ? getTransformedValidOptions(state, props) : [],

    }
}

const mapDispatchToProps = (dispatch: Dispatch<Action<any>>) => {
    return {
        updateAnswer: (formId: string, path: number[], questionId: string, value: string) => dispatch(handleUpdateAnswer(formId, path, questionId, value))
    }
};

export const FormItem = connect(mapStateToProps, mapDispatchToProps)(FormItemStyled)