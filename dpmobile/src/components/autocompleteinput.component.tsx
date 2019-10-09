import React from "react";
import { KeyboardType, View, TextInputProps } from "react-native";
import Autocomplete from "react-native-autocomplete-input";
import { TouchableOpacity } from "react-native-gesture-handler";
import { Input, Text, ThemedComponentProps, withStyles } from "react-native-ui-kitten";
type TextContentType = | "none"
    | "URL"
    | "addressCity"
    | "addressCityAndState"
    | "addressState"
    | "countryName"
    | "creditCardNumber"
    | "emailAddress"
    | "familyName"
    | "fullStreetAddress"
    | "givenName"
    | "jobTitle"
    | "location"
    | "middleName"
    | "name"
    | "namePrefix"
    | "nameSuffix"
    | "nickname"
    | "organizationName"
    | "postalCode"
    | "streetAddressLine1"
    | "streetAddressLine2"
    | "sublocality"
    | "telephoneNumber"
    | "username"
    | "password"
    | "newPassword"
    | "oneTimeCode";
type AutoCompleteProps = {
    onChange: (text: string) => void,
    data: { text: string }[],
    value: string,
    textContentType?: TextContentType,
    keyboardType?: KeyboardType,
    onBlur: (value: string) => void,
    error: string,
} & ThemedComponentProps & TextInputProps
type AutoCompleteState = {
    menuVisible: boolean,
    selectedIndex: number,
    hideResults: boolean,
    value: string,
}

export class AutoCompleteInputComponent extends React.Component<AutoCompleteProps, AutoCompleteState>{
    public state: AutoCompleteState = {
        menuVisible: false,
        selectedIndex: null,
        hideResults: true,
        value: this.props.value || ""
    };


    private data = [
        { text: "Test String 1" },
        { text: "Test String 1" },
        { text: "Test String 1" },
        { text: "Test String 1" },
        { text: "Test String 1" },

    ];
    input: any;
    private onFocus(e) {
        this.setState({
            hideResults: false,
        });
        this.props.onFocus(e)
    }
    private onBlur(e) {
        this.setState({
            hideResults: true,
        })
        if (this.props.onBlur) this.props.onBlur(e);
    }
    private handleChange() {
        if (this.props.onChange) this.props.onChange(this.state.value);
    }

    private onResultSelect(item) {
        if (this.props.onChange) this.props.onChange(item.text);
        this.setState({
            hideResults: true,
            value: item.text,
        }, this.handleChange.bind(this));
        this.input.focus();

    }
    findItem(query: string) {
        if (query === '' || !query) {
            return [];
        }

        let { data } = this.props;
        if (!data) data = this.data;
        const regex = new RegExp(`${query.trim()}`, 'i');
        return data.filter(film => film.text.search(regex) >= 0);
    }

    onValueChange(text: string) {
        this.setState({
            value: text
        }, this.handleChange.bind(this))
    }



    public render(): React.ReactNode {
        let foundResult = this.findItem(this.state.value);
        return (
            <View style={this.props.themedStyle.container}>
                <Autocomplete
                    hideResults={this.state.hideResults}
                    inputContainerStyle={this.props.themedStyle.inputContainerStyle}
                    data={foundResult}
                    keyExtractor={(item, index) => "item-" + index}
                    renderTextInput={() => <View><Input onChangeText={text => this.onValueChange(text)}
                        textContentType={this.props.textContentType}
                        value={this.state.value}
                        ref={r => this.input = r}
                        onFocus={this.onFocus.bind(this)}
                        keyboardType={this.props.keyboardType}
                        onBlur={this.onBlur.bind(this)}
                    />
                        <Text style={this.props.themedStyle.errorText}>{this.props.error}</Text>
                    </View>
                    }
                    listStyle={this.props.themedStyle.listStyle}
                    containerStyle={this.props.themedStyle.autocompleteContainer}

                    renderItem={({ item, i }) => (
                        <TouchableOpacity
                            style={this.props.themedStyle.itemStyle}
                            key={i}
                            onPress={this.onResultSelect.bind(this, item)}>
                            <Text
                                style={this.props.themedStyle.itemText}
                                key={'text' + item.text}
                            >
                                {item.text}
                            </Text>
                        </TouchableOpacity>
                    )}
                />
            </View>
        );
    }
}

export const AutoComplete = withStyles(AutoCompleteInputComponent, theme => ({
    container: {
        flex: 1,
        paddingTop: 25,
        paddingBottom: 25,
    },
    autocompleteContainer: {
        flex: 1,
        left: 0,
        position: 'absolute',
        right: 0,
        top: 0,
        zIndex: 1,

    },
    inputContainerStyle: {
        borderWidth: 0,
        borderColor: "transparent",

    },
    listStyle: {
        backgroundColor: theme["color-primary-100"]
    },
    itemText: {
        fontSize: 15,
        margin: 2,
        color: "black"
    },
    itemStyle: {
        flex: 0,
        justifyContent: "center",
        flexDirection: "column",
        height: 40,
    },
    errorText: {
        color: 'red'
    }

}));





