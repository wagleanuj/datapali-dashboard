import React from "react";
import { FlatList } from "react-native-gesture-handler";
import { ListItem, Radio } from "react-native-ui-kitten";


type RadioInputProps = {
    listKey?: string;
    defaultSelected: number;
    options: { text: string, id: string }[];
    onSelectionChange: (value: { text: string, id: string }) => void;
}

export class RadioInput extends React.Component<RadioInputProps, {}>{
    constructor(props: RadioInputProps) {
        super(props);
        
    }


    onSelectionChange(index: number) {
        if (this.props.defaultSelected === index) return;
        if(this.props.onSelectionChange) this.props.onSelectionChange(this.props.options[index])
       
    }
    renderAccessory = (style, index) => {
        return (
            <Radio
                style={style}
                checked={this.props.defaultSelected === index}
                onChange={() => this.onSelectionChange(index)}
            />
        )
    }
    renderListItem = (item) => {
        return <ListItem
            title={item.item.text || ""}
            description={''}
            onPress={() => this.onSelectionChange(item.index)}
            accessory={style => this.renderAccessory(style, item.index)}
        />
    }
    render() {
        return (
            <FlatList
                scrollEnabled
                key={'radiolist-' + this.props.listKey}
                listKey={'radiolist-' + this.props.listKey}
                style={{flex:1}}
                contentContainerStyle={{flexGrow:1}}
                keyExtractor={item => item.id}
                data={this.props.options}
                renderItem={this.renderListItem}
            />
        )

    }
}

