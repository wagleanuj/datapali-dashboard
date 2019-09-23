import { Input, OverflowMenu, Button, OverflowMenuItemType, State, StyleType, Popover, Text, withStyles, StyledComponentProps } from "react-native-ui-kitten";
import React, { Component } from "react";
import { ImageProps, Image, ViewPropTypes, View, FlatList } from "react-native";
import { TouchableOpacity, TextInput } from "react-native-gesture-handler";
import Autocomplete from "react-native-autocomplete-input";

type AutoCompleteProps = {
    onChange: (text: string) => void,
    data: { text: string }[],
    defaultValue: string,
}
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
        value: this.props.defaultValue || ""
    };

    private Icon = (style: StyleType): React.ReactElement<ImageProps> => (
        <Image
            style={style}
            source={{ uri: 'https://akveo.github.io/eva-icons/fill/png/128/star.png' }}
        />
    );

    private data = [
        { text: "Test String 1" },
        { text: "Test String 1" },
        { text: "Test String 1" },
        { text: "Test String 1" },
        { text: "Test String 1" },

    ];
    input: any;
    private onFocus() {
        this.setState({
            hideResults: false,
        })
    }
    private onBlur() {
        this.setState({
            hideResults: true,
        })
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
        })
    }



    public render(): React.ReactNode {
        let foundResult = this.findItem(this.state.value);
        return (
            <Autocomplete
                hideResults={this.state.hideResults}
                inputContainerStyle={this.props.themedStyle.inputContainerStyle}
                data={foundResult}
                keyExtractor={(item, index) => "item-" + index}
                renderTextInput={() => <Input onChangeText={text => this.onValueChange(text)} value={this.state.value} ref={r => this.input = r} onFocus={this.onFocus.bind(this)} onBlur={this.onBlur.bind(this)} />}
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
        );
    }
}

export const AutoComplete = withStyles(AutoCompleteInputComponent, theme => ({
    autocompleteContainer: {
        flex: 1,
        left: 0,
        position: 'absolute',
        right: 0,
        top: 0,
        zIndex: 1
    },
    inputContainerStyle: {
        borderWidth: 0,
        borderColor: "transparent",

    },
    listStyle: {
        backgroundColor: theme["color-primary-300"]
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
        height: 30,
    },

}));





