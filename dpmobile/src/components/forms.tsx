import React from 'react';
import { List, ListItem, Text, withStyles, ThemeType, ThemedStyleType } from 'react-native-ui-kitten';
import { ListRenderItemInfo } from 'react-native';
import { AnswerStore } from '../answermachine';
import { getRandomId } from 'dpform';


type FormsProps = {

} & ThemedStyleType;

type FormsState = {
    data: any[]
}
type FormItemType = {
    title: string,
    description: string,
}
class FormsComponent extends React.Component<FormsProps, FormsState>{
    constructor(props: FormsProps) {
        super(props);
        this.state = {
            data: []
        }
    }

    loadForms() {

    }

    renderItem = (item: ListRenderItemInfo<FormItemType>) => {
        return <ListItem
            style={this.props.themedStyle.item}
            title={item.item.title}
            description={item.item.description}
        >

        </ListItem>

    }

    render() {
        return (
            <List
                data={this.state.data}
                renderItem={this.renderItem}
            />
        )
    }
}

export const FormList = withStyles(FormsComponent, (theme: ThemeType) => ({
    item: {
        marginVertical: 8,
        marginHorizontal: 8,
        paddingHorizontal: 16,
        paddingVertical: 16,
        borderRadius: 8,
        flexDirection: 'column',
        alignItems: 'flex-start',
    }
}));

export interface FilledForm {
    startedDate: number;
    completedDate: number;
    formId: string;
    filledBy: string;
    surveyorId: string;
    answerStore: AnswerStore;
    id: string;
}