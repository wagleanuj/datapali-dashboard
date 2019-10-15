import React from "react";
import { KeyboardType, View } from "react-native";
import Autocomplete from "react-native-autocomplete-input";
import { TouchableOpacity, FlatList } from "react-native-gesture-handler";
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
} & ThemedComponentProps;
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
        if (this.props.onFocus) this.props.onFocus(e)
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

    private onResultSelect({item}) {
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
        return data.filter(item => item.text.search(regex) >= 0 && item.text !== query);
    }

    onValueChange(text: string) {
        this.setState({
            value: text
        }, this.handleChange.bind(this))
    }

    private renderAutoCompleteItem(item) {
        return <TouchableOpacity
            style={this.props.themedStyle.itemStyle}
            key={item.index}
            onPress={this.onResultSelect.bind(this, item)}>
            <Text
                style={this.props.themedStyle.itemText}
                key={'text' + item.item.text}
            >
                {item.item.text}
            </Text>
        </TouchableOpacity>
    }

    public render(): React.ReactNode {
        let foundResult = this.findItem(this.props.value);
        return (
            <View style={this.props.themedStyle.container}>
                <View>
                    <Input
                        onChangeText={this.props.onChange}
                        textContentType={this.props.textContentType}
                        value={this.props.value}
                        ref={r => this.input = r}
                        onFocus={this.onFocus.bind(this)}
                        keyboardType={this.props.keyboardType}
                        onBlur={this.onBlur.bind(this)}
                    />
                </View>
                <View style={{ height: 50, maxHeight: 100 }}>

                    {<FlatList
                        scrollEnabled
                        style={this.props.themedStyle.autocompleteContainer}
                        data={foundResult}
                        keyExtractor={item => item.text}
                        renderItem={this.renderAutoCompleteItem.bind(this)}
                    />}
                </View>


            </View>
        );
    }
}

export const AutoComplete = withStyles(AutoCompleteInputComponent, theme => ({
    container: {
        flex: 0,
        flexDirection: 'column',
        paddingTop: 25,
        paddingBottom: 25,
    },
    autocompleteContainer: {
        backgroundColor: theme["color-primary-100"],
        flex: 0,
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
        backgroundColor: 'white',
        justifyContent: "center",
        flexDirection: "column",
        height: 40,
    },
    errorText: {
        color: 'red'
    }

}));





