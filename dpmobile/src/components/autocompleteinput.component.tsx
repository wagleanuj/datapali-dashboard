import { Platform } from "@unimodules/core";
import React from "react";
import { KeyboardType, View } from "react-native";
import { FlatList, TouchableOpacity } from "react-native-gesture-handler";
import { Input, Layout, Text, ListItem, ThemedComponentProps, withStyles, List, Icon, Button } from "react-native-ui-kitten";
import * as Animatable from 'react-native-animatable';
import { TouchableRipple } from "react-native-paper";
import _ from "lodash";
import { KeyboardAwareFlatList } from "react-native-keyboard-aware-scroll-view";

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
       const debounced =  _.debounce(() => this.setState({
            hideResults: true,
        }), 300);
        debounced();
        if (this.props.onBlur) this.props.onBlur(e);
    }
    private handleChange() {
        if (this.props.onChange) this.props.onChange(this.state.value);
    }

    private onResultSelect({ item }) {
        console.log("selected");
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
        return (
            <ListItem
                onPress={this.onResultSelect.bind(this, item)}

                style={this.props.themedStyle.itemStyle}
                title={item.item.text}
                icon={style => <Icon  {...style} width={20} height={20} name="clock" />}
                accessory={style => <Button icon={style => <Icon {...style} name="diagonal-arrow-left-down" />} appearance="ghost"></Button>}
            />
        );


    }
    private renderSeparator() {
        return (
            <View style={this.props.themedStyle.separator}>
            </View>
        )
    }
    private get Suggestions() {
        return this.findItem(this.props.value);
    }


    public render(): React.ReactNode {
        const suggestions = this.Suggestions;
        return (
            <View style={this.props.themedStyle.container}>
                <Input
                    onChangeText={this.props.onChange}
                    textContentType={this.props.textContentType}
                    value={this.props.value}
                    ref={r => this.input = r}
                    onFocus={this.onFocus.bind(this)}
                    keyboardType={this.props.keyboardType}
                    onBlur={this.onBlur.bind(this)}
                />
                {this.Suggestions.length > 0 &&
                    !this.state.hideResults && <View style={{ flex: 1 }}>

                        <KeyboardAwareFlatList
                            scrollEnabled
                            keyboardShouldPersistTaps='always'
                            style={{ flex: 1 }}
                            contentContainerStyle={this.props.themedStyle.listContentContainer}
                            data={suggestions}
                            ItemSeparatorComponent={this.renderSeparator.bind(this)}
                            keyExtractor={item => item.text}
                            renderItem={this.renderAutoCompleteItem.bind(this)}
                        />
                    </View>

                }

            </View>
        );
    }
}

export const AutoComplete = withStyles(AutoCompleteInputComponent, theme => ({
    container: {
        flex: 1,
        flexDirection: 'column',
        paddingTop: 4,
        paddingBottom: 4,
    },
    listContentContainer: {
        flexGrow: 1,
        // maxHeight: 124,
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
        flex: 1,

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





