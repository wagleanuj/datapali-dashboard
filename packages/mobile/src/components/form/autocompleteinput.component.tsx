import _ from "lodash";
import React from "react";
import { KeyboardType, View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { KeyboardAwareFlatList } from "react-native-keyboard-aware-scroll-view";
import { Button, Icon, Input, ListItem, Text, ThemedComponentProps, withStyles } from "react-native-ui-kitten";

type AutoCompleteProps = {
    onChange: (text: string) => void,
    data: { text: string }[],
    value: string,
    keyboardType?: KeyboardType,
    onBlur: (value: string) => void,
    error: string;
    onSubmit: () => void;
    setInputRef: (r) => void;
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
        const debounced = _.debounce(() => this.setState({
            hideResults: true,
        }), 300);
        debounced();
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
        }, () => {
            this.handleChange();
            this.input.focus();
        });


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
            <TouchableOpacity
                style={this.props.themedStyle.itemStyle}

                onPress={this.onResultSelect.bind(this, item)}
            >
                <ListItem
                    title={item.item.text}
                    icon={style => <Icon  {...style} width={20} height={20} name="clock" />}
                    accessory={style => <Button icon={style => <Icon {...style} name="diagonal-arrow-left-down" />} appearance="ghost"></Button>}
                />
            </TouchableOpacity>

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
    setInputRef=(r)=> {
        this.input = r;
        if (this.props.setInputRef) this.props.setInputRef(r);
    }

    public render(): React.ReactNode {
        const suggestions = this.Suggestions;
        const { themedStyle } = this.props;
        return (
            <View style={themedStyle.container}>
                <Input
                    ref={this.setInputRef}
                    onChangeText={this.props.onChange}
                    value={this.props.value}
                    onFocus={this.onFocus.bind(this)}
                    keyboardType={this.props.keyboardType}
                    onBlur={this.onBlur.bind(this)}
                    onSubmitEditing={this.props.onSubmit}
                />
                {!!this.props.error && <Text style={themedStyle.errorText}>{this.props.error}</Text>}
                {this.Suggestions.length > 0 &&
                    !this.state.hideResults &&

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
        minHeight: 40,
        // maxHeight: 126,
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
        flexGrow: 1,

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





