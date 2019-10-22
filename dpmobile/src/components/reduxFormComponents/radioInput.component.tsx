import React from "react";
import { FlatList } from "react-native-gesture-handler";
import { ListItem, Radio } from "react-native-ui-kitten";


type RadioInputProps = {
    listKey?: string;
    defaultSelected: number;
    options: { text: string, id: string }[];
    onSelectionChange: (value: { text: string, id: string }) => void;
}
type RadioInputState = {
    selected: number,
}
export class RadioInput extends React.Component<RadioInputProps, RadioInputState>{
    constructor(props: RadioInputProps) {
        super(props);
        this.state = {
            selected: this.props.defaultSelected
        }
    }

    handleSelectionChange() {
        if (this.props.onSelectionChange) this.props.onSelectionChange(this.props.options[this.state.selected]);
    }
    onSelectionChange(index: number) {
        if (this.state.selected === index) return;
        this.setState({
            selected: index
        }, this.handleSelectionChange.bind(this))
    }
    renderAccessory = (style, index) => {
        return (
            <Radio
                style={style}
                checked={this.state.selected === index}
                onChange={() => this.onSelectionChange(index)}
            />
        )
    }
    renderListItem = (item) => {
        return <ListItem
            title={item.item.text||""}
            description={''}
            onPress={() => this.onSelectionChange(item.index)}
            accessory={style => this.renderAccessory(style, item.index)}
        />
    }
    render() {
        return (
            <FlatList
                key={'radiolist-' + this.props.listKey}
                listKey={'radiolist-' + this.props.listKey}
                contentContainerStyle={{flexGrow:1}}
                keyExtractor={item => item.id}
                data={this.props.options}
                renderItem={this.renderListItem}
            />
        )

    }
}

