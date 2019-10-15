import { Platform } from "@unimodules/core";
import React from "react";
import { KeyboardType, View } from "react-native";
import { FlatList, TouchableOpacity } from "react-native-gesture-handler";
import { Input, Layout,Text, ListItem, ThemedComponentProps, withStyles } from "react-native-ui-kitten";
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
    selectedIndex: number,
    hideResults: boolean,
    value: string,
}

export class AutoCompleteInputComponent extends React.Component<AutoCompleteProps, AutoCompleteState>{
    public state: AutoCompleteState = {
        selectedIndex: null,
        hideResults: true,
        value: this.props.value || ""
    };


    private data = [
        { text: "Test String 1" },
        { text: "Test String 2" },
        { text: "Test String 3" },
        { text: "Test String 4" },
        { text: "Test String 5" },

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

    private onResultSelect({ item }) {
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
        // return this.data;
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
                <Text style={this.props.themedStyle.itemText}>{item.item.text}</Text>
        </TouchableOpacity>
    }
    private renderSeparator() {
        return (
            <View style={this.props.themedStyle.separator}>
            </View>
        )
    }

    public render(): React.ReactNode {
        let foundResult = this.findItem(this.props.value);
        return (
            <Layout style={this.props.themedStyle.container}>


                <Input
                    onChangeText={this.props.onChange}
                    textContentType={this.props.textContentType}
                    value={this.props.value}
                    ref={r => this.input = r}
                    onFocus={this.onFocus.bind(this)}
                    keyboardType={this.props.keyboardType}
                    onBlur={this.onBlur.bind(this)}
                />
                {foundResult.length > 0 && !this.state.hideResults && <FlatList
                    scrollEnabled
                    keyboardShouldPersistTaps='handled'
                    style={this.props.themedStyle.listStyle}
                    data={foundResult}
                    ItemSeparatorComponent={this.renderSeparator.bind(this)}
                    keyExtractor={item => item.text}
                    renderItem={this.renderAutoCompleteItem.bind(this)}
                />}





            </Layout>
        );
    }
}

export const AutoComplete = withStyles(AutoCompleteInputComponent, theme => ({
    container: {
        flex: 0,
        flexDirection: 'column',
        paddingTop: 4,
        position: 'relative',
        paddingBottom: 4,
    },
    autocompleteContainer: {
        overflow: 'scroll',
        backgroundColor: theme["color-primary-100"],
        left: 0,
        flex: 1,
        position: 'absolute',
        right: 0,
        top: -2,
        elevation: (Platform.OS === 'android') ? 50000 : 0,
        zIndex: 7999991,
        maxHeight: 400,
    },
    inputContainerStyle: {
        borderWidth: 0,
        borderColor: "transparent",

    },
    listStyle: {
        maxHeight: 124,
        backgroundColor: theme['color-primary-100'],
        borderColor: theme['color-primary-default'],
        borderWidth: 1,
        paddingBottom: 2,
        marginLeft: 2,
        marginRight: 2,

    },
    itemText: {
        fontSize: 15,
        margin: 2,
        color: theme['text-basic-color']
    },
    itemStyle: {
        flex: 0,
        justifyContent: "center",
        flexDirection: "column",
        height: 40,
        borderColor: theme['color-primary-default'],
        // borderWidth: 1,
    },
    errorText: {
        color: 'red'
    },
    separator: {
        height: 1,
        backgroundColor: 'gray',

    }

}));





