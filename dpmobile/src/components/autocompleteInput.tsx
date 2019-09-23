import { Input, OverflowMenu, Button, OverflowMenuItemType, State, StyleType, Popover, Text, withStyles, StyledComponentProps } from "react-native-ui-kitten";
import React, { Component } from "react";
import { ImageProps, Image, ViewPropTypes, View, FlatList } from "react-native";
import { ScrollView, TouchableOpacity, TextInput } from "react-native-gesture-handler";
import Autocomplete from "react-native-autocomplete-input";

type AutoCompleteProps = {

}
type AutoCompleteState = {
    menuVisible: boolean,
    selectedIndex: number,

}

export class AutoCompleteInputComponent extends React.Component<AutoCompleteProps, AutoCompleteState>{
    public state: AutoCompleteState = {
        menuVisible: false,
        selectedIndex: null,
    };

    private Icon = (style: StyleType): React.ReactElement<ImageProps> => (
        <Image
            style={style}
            source={{ uri: 'https://akveo.github.io/eva-icons/fill/png/128/star.png' }}
        />
    );

    private data: OverflowMenuItemType[] = [
        { title: 'Menu Item 1', icon: this.Icon },
        { title: 'Menu Item 2', icon: this.Icon },
        { title: 'Menu Item 3', icon: this.Icon },
        { title: 'Menu Item 4', icon: this.Icon },
        { title: 'Menu Item 5', icon: this.Icon },
        { title: 'Menu Item 6', icon: this.Icon },


    ];



    private onItemSelect = (selectedIndex: number): void => {
        this.setState({ selectedIndex });
    };



    public render(): React.ReactNode {
        return (
            <Autocomplete
                inputContainerStyle={this.props.themedStyle.inputContainerStyle}
                data={this.data}
                keyExtractor={item => item.title}
                renderTextInput={() => <Input />}
                listStyle={this.props.themedStyle.listStyle}
                containerStyle={this.props.themedStyle.autocompleteContainer}
                // defaultValue={}
                // onChangeText={text => this.setState({ query: text })}
                renderItem={({ item, i }) => (
                    <TouchableOpacity key={i} onPress={() => { }}>
                        <Text style={this.props.themedStyle.itemText} key={'text' + item.title}>{item.title}</Text>
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
}));





