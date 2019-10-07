import { ANSWER_TYPES, getReadablePath, IValueType } from "dpform";
import React from "react";
import { DatePickerAndroid, View } from "react-native";
import { Button, Icon, Text, ThemedComponentProps } from "react-native-ui-kitten";
import { AutoComplete } from "../components/autocompleteinput.component";
import { AutoCompleteItem } from "../components/forms.component";
import { RadioInput } from "../components/selectinput.component";

type FormItemProps = {
    path: number[];
    value: string;
    options?: { id: string, text: string }[];
    type: IValueType;
    error: string;
    title: string;
    onChange: (value: string) => void;
    onBlur: (value: string) => void;
    isRequired: boolean;
    autoCompleteData?: AutoCompleteItem[]
    autoFillValue?: string;
} & ThemedComponentProps;

//replacement for question component
export class FormItem extends React.Component<FormItemProps, {}> {
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
            <View style={themedStyle.container}>
                <View>
                    <Text>
                        {`${getReadablePath(path)} : ${title} ${isRequired ? '*' : ''}`}
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

interface FormInputProps {
    type: IValueType;
    value: string;
    options?: { text: string, id: string }[]
    autoCompleteData: AutoCompleteItem[];
    onValueChange: (value: string) => void;
    autoFillValue?: string;
    error: string;
    onBlur: (value: string) => void;

}
function FormInput(props: FormInputProps) {
    const defaultValue = this.props.value || this.props.autoFillValue;
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
                defaultValue={defaultValue}
                data={props.autoCompleteData}
                onChange={props.onValueChange}
                onBlur={props.onBlur}
                error={props.error}
            />
        case ANSWER_TYPES.STRING:
            return <AutoComplete
                textContentType={'name'}
                defaultValue={defaultValue}
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
            let date = defaultValue ? new Date(defaultValue) : new Date();
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