import { getReadablePath } from "dpform";
import { Accordion } from 'native-base';
import React from "react";
import { FlatList, View } from "react-native";
import { Text, ThemedComponentProps, ViewPager, withStyles } from 'react-native-ui-kitten';
import { connect } from "react-redux";
import { getChildrenOfSectionFromId, getDupeTimesForSectionNode, getSectionNameFromId, getNodeTypeFromId } from "../../redux/selectors/nodeSelector";
import { ConnectedQuestionNode } from "./questionNode";
import { AppState } from "../../redux/actions/types";
type SectionNodeProps = {
    sectionId: string;
    duplicateTimes: number;
    displayTitle: string;
    childNodes: string[];
    locationName: string;
    path: number[];
    formId: string;
    rootId: string;
    pagerMode: boolean;
} & ThemedComponentProps;
class SectionNode extends React.Component<SectionNodeProps, { selectedPage: number }>{
    state = {
        selectedPage: 0,
    }
    renderChildNode(item, iteration) {
        const { rootId, formId, locationName, path } = this.props;
        const newPath = path.concat(iteration, item.index);
        const newLocation = locationName.concat(`[${iteration}].${item.item}`);
        return <ConnectedFormNode
            id={item.item}
            locationName={newLocation}
            path={newPath}
            formId={formId}
            rootId={rootId}
        />
    }

    renderFlatList(iteration: number = 0) {
        return (
            <FlatList
                initialNumToRender={10}
                initialScrollIndex={0}
                data={this.props.childNodes}
                keyExtractor={item => item}
                renderItem={item => this.renderChildNode(item, iteration)}
            />
        );

    }
    shouldLoadComponent = (index: Number) => {
        return index === this.state.selectedPage;
    }
    onPageChange = (index: number) => {
        this.setState({
            selectedPage: index
        })
    }

    decisiveRender() {
        if (this.props.duplicateTimes !== -1) {
            let data = Array.from(new Array(this.props.duplicateTimes).keys()).map(item => ({ title: `Add Record ${item + 1}`, content: item }));
            return (
                <Accordion
                    expandedIconStyle={{ backgroundColor: 'black' }}
                    dataArray={data}
                    renderContent={item => this.renderFlatList(item.content)}
                />
            );

        } else {
            if (this.props.pagerMode) {
                return (
                    <ViewPager
                        selectedIndex={this.state.selectedPage}
                        shouldLoadComponent={this.shouldLoadComponent}
                        onSelect={this.onPageChange}
                    >
                        {this.props.childNodes.map((child, index) => {
                            return (
                                <View key={child + index}>
                                    {this.renderChildNode({ item: child, index: index }, 0)}
                                </View>
                            )
                        })}
                    </ViewPager>
                )
            }
            return this.renderFlatList(0);
        }
    }

    render() {
        return (
            <View style={this.props.themedStyle.container}>
                <View style={this.props.themedStyle.headingContainer}>
                    <Text style={this.props.themedStyle.headingText}>
                        {`${getReadablePath(this.props.path)} : ${this.props.displayTitle}`}
                    </Text>
                </View>

                {this.decisiveRender()}
            </View>
        )
    }
}

const SectionNodeStyled = withStyles(SectionNode, theme => ({
    container: {
        paddingTop: 16,
        paddingLeft: 4,
        paddingRight: 4
    },
    headingContainer: {
        flex: 0,
        flexDirection: 'row',
        justifyContent: 'center'
    },
    headingText: {
        fontSize: 14,
        fontWeight: 'bold',
    },
    accordionHeaderContainer: {
        paddingTop: 4,
        paddingBottom: 4,
        borderTop: 1,
    },
    headerText: {
        color: 'red',
        textAlign: 'center'
    }
}));

const mapStateToProps = (state, props) => {
    const dupe = getDupeTimesForSectionNode(state, props);
    return {
        duplicateTimes: dupe,
        displayTitle: getSectionNameFromId(state, props, props.sectionId),
        childNodes: getChildrenOfSectionFromId(state, props, props.sectionId),
    }
}
const mapDispatchToProps = (dispatch) => {
    return {

    }
}

export const ConnectedSectionNode = connect(mapStateToProps, mapDispatchToProps)(SectionNodeStyled);



type FormNodeProps = {
    pagerMode: boolean;
    id: string;
    formId: string;
    rootId: string;
    locationName: string;
    path: number[];
    type: string;
}
class FormNode extends React.Component<FormNodeProps, {}>{
    render() {
        const { props } = this;
        return (
            props.type === 'question' ?
                <ConnectedQuestionNode {...props} questionId={props.id} />
                : <ConnectedSectionNode  {...props} sectionId={props.id} />
        )

    }
}
const mapStateToFormNodeProps = (state: AppState, props) => {
    return {
        type: getNodeTypeFromId(state, props)
    }
}

export const ConnectedFormNode = connect(mapStateToFormNodeProps, {})(FormNode);
