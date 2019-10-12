import { AnswerOptions, ANSWER_TYPES, ILiteral, IValueType, QAComparisonOperator, QACondition, QAFollowingOperator, QAQuestion } from "dpform";
import React from "react";
import { View } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import { ListItem, Radio, Text } from "react-native-ui-kitten";
import { AnswerSection } from "../answer.store";


interface SelInputProps {
    options: AnswerOptions;
    answerType: IValueType;
    onSelectionChange: (optId: string) => void;
    value?: string;
    answerSection: AnswerSection;
    question: QAQuestion;
    error: string;

}
export class SelInput extends React.Component<SelInputProps, any> {
    private allOptions: { text: string, id: string }[]
    constructor(props) {
        super(props);
        this.state = {
            value: this.props.value
        };
    }

    transformValueToType(type: IValueType, value: string) {
        switch (type.name) {
            case ANSWER_TYPES.BOOLEAN:
                return Boolean(value);
            case ANSWER_TYPES.DATE:
                return new Date(value);
            case ANSWER_TYPES.NUMBER:
                return parseFloat(value);
            case ANSWER_TYPES.STRING:
                return value;
            case ANSWER_TYPES.TIME:
                return new Date(value);

        }
        return value;
    }
    evaluateCondition(condition: QACondition, question: QAQuestion) {
        let finalResult = true;
        let pendingOperator = null;
        condition.literals.forEach(literal => {
            const getValid = (item: ILiteral) => {
                let result = true;
                const answer = this.props.answerSection.getById(item.questionRef);
                let c2 = this.transformValueToType(question.answerType, item.comparisonValue.content);
                let c1 = this.transformValueToType(question.answerType, answer);

                if (question) {
                    switch (item.comparisonOperator) {
                        case QAComparisonOperator.Equal:
                            result = c1 === c2;
                            break;
                        case QAComparisonOperator.Greater_Than:
                            result = c1 > c2;
                            break;
                        case QAComparisonOperator.Greater_Than_Or_Equal:
                            result = c1 >= c2;
                            break;
                        case QAComparisonOperator.Less_Than:
                            result = c1 < c2;
                            break;
                        case QAComparisonOperator.Less_Than_Or_Equal:
                            result = c1 >= c2;
                            break;
                    }
                }
                return result;
            }
            let currentResult = getValid(literal);
            if (!pendingOperator) {
                finalResult = currentResult;
                pendingOperator = literal.followingOperator
            }
            else if (pendingOperator) {
                switch (pendingOperator) {
                    case QAFollowingOperator.AND:
                        finalResult = finalResult && currentResult;
                        break;
                    case QAFollowingOperator.OR:
                        finalResult = finalResult || currentResult;
                        break;
                }
            }

        });
        return finalResult;
    }
    filterByCondition() {
        const { groups, rootOptions } = this.props.options.SortedOptions;
        const g = groups.filter(item => this.evaluateCondition(item.appearingCondition, this.props.question));
        const options = rootOptions.filter(item => this.evaluateCondition(item.appearingCondition, this.props.question));
        return { groups: g, rootOptions: options };

    }
    getOptions() {
        const { groups, rootOptions } = this.filterByCondition();
        this.allOptions = [];
        groups.forEach(item => {
            return item.members.forEach(option => {
                this.allOptions.push({ id: option.id, text: option.value });
            })

        });
        rootOptions.forEach(option => {
            this.allOptions.push({ id: option.id, text: option.value });
        });

        return this.allOptions;
    }
    onSelectionChanged(value: { text: string, id: string }) {
        if (this.props.onSelectionChange) this.props.onSelectionChange(value.id);
    }
    getDefaultSelected() {
        return this.allOptions && this.allOptions.findIndex(item => item.id === this.props.value);
    }
    render() {
        const options = this.getOptions();
        return (<View>
            <RadioInput onSelectionChange={this.onSelectionChanged.bind(this)} defaultSelected={this.getDefaultSelected()} options={options} />
            <Text style={{ color: 'red' }}>{this.props.error}</Text>
        </View >
        );
    }

}
type RadioInputProps = {
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
            title={item.item.text}
            description={''}
            onPress={() => this.onSelectionChange(item.index)}
            accessory={style => this.renderAccessory(style, item.index)}
        />
    }
    render() {
        return (
            <FlatList
                keyExtractor={item => item.id}
                data={this.props.options}
                renderItem={this.renderListItem}
            />
        )

    }
}

