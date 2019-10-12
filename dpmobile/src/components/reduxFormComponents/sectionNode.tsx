import { getReadablePath } from "dpform";
import { Accordion } from 'native-base';
import React from "react";
import { FlatList, View } from "react-native";
import { Text, ThemedComponentProps, withStyles } from 'react-native-ui-kitten';
import { connect } from "react-redux";
import { getChildrenOfSectionFromId, getDupeTimesForSectionNode, getSectionNameFromId } from "../../redux/selectors/nodeSelector";
import { ConnectedFormNode } from "./formNode";
type SectionNodeProps = {
    sectionId: string;
    duplicateTimes: number;
    displayTitle: string;
    childNodes: string[];
    locationName: string;
    path: number[];
    formId: string;
    rootId: string;
} & ThemedComponentProps;
class SectionNode extends React.Component<SectionNodeProps, {}>{

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
    // renderAccordionHeader = (item) => {
    //     const { themedStyle } = this.props;
    //     return <View style={themedStyle.accordionHeaderContainer}>
    //         <Button
    //             textStyle={themedStyle.headerText}
    //             disabled appearance='ghost'
    //         >
    //             {`Add Record ${item + 1}`}
    //         </Button>
    //     </View>
    // }

    decisiveRender() {
        if (this.props.duplicateTimes !== -1) {
            let data = Array.from(new Array(2).keys()).map(item => ({ title: `Add Record ${item + 1}`, content: item }));
            return (
                <Accordion
                    expandedIconStyle={{ backgroundColor: 'black' }}
                    // renderHeader={this.renderAccordionHeader}
                    dataArray={data}
                    renderContent={item => this.renderFlatList(item.content)}
                />
            );

        } else {
            return this.renderFlatList(0);
        }
    }

    render() {
        return (
            <View style={this.props.themedStyle.container}>
                <Text>
                    {`${getReadablePath(this.props.path)} : ${this.props.displayTitle}`}
                </Text>
                {this.decisiveRender()}
            </View>
        )
    }
}

const SectionNodeStyled = withStyles(SectionNode, theme => ({
    container: {
        paddingLeft: 16,
        paddingRight: 16
    },
    accordionHeaderContainer: {
        paddingTop: 4,
        paddingBottom: 4,
        borderTop: 1,
    },
    headerText: {
        color: 'red'
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
