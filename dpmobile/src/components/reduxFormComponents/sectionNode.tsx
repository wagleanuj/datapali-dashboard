import { getReadablePath } from "dpform";
import { Accordion } from 'native-base';
import React from "react";
import { View } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import Swiper from "react-native-swiper";
import { Text, ThemedComponentProps, withStyles } from 'react-native-ui-kitten';
import { connect } from "react-redux";
import { WizardContext } from "../../context/wizard";
import { AppState } from "../../redux/actions/types";
import { getChildrenOfSectionFromId, getDupeTimesForSectionNode, getNodeTypeFromId, getSectionNameFromId } from "../../redux/selectors/nodeSelector";
import { ConnectedQuestionNode } from "./questionNode";
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
    static contextType = WizardContext;

    renderChildNode(item, iteration) {
        const { rootId, formId, locationName, path } = this.props;
        const newPath = path.concat(iteration, item.index);
        const newLocation = locationName.concat(`[${iteration}].${item.item}`);
        return <ConnectedFormNode
            key={'formnode' + newLocation}
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
                keyboardShouldPersistTaps="always"
                key={'list' + this.props.locationName}
                automaticallyAdjustContentInsets
                scrollEnabled
                // style={{flex: 1, height: 400}}
                listKey={'lk' + this.props.locationName}
                data={this.props.childNodes}
                keyExtractor={item => 'listitem' + item}
                renderItem={item => this.renderChildNode(item, iteration)}
            />
        );

    }

    onPageChange = (index: number) => {
        this.context.updatePagerModeIndex(this.props.sectionId, index);
    }

    get SwiperView() {
        return (
            <View style={{ flex: 5 }}>

                <Swiper
                    scrollEnabled
                    key={'swiper-' + this.props.locationName}
                    autoplay={false}
                    loadMinimal
                    loadMinimalSize={2}
                    loop={false}
                    bounces
                    height={500}
                    pagingEnabled
                    automaticallyAdjustContentInsets
                    index={this.context.pagerModeIndices[this.props.sectionId]}
                    onIndexChanged={this.onPageChange}
                >
                    {this.props.childNodes.map((child, index) => {
                        return (
                            <View key={'swiper-child' + child} style={{ flex: 1 }}>
                                {this.renderChildNode({ item: child, index: index }, 0)}

                            </View>
                        )
                    })}
                </Swiper>
            </View>


        )
    }
    get AccordionView() {
        let data = Array.from(new Array(this.props.duplicateTimes).keys()).map(item => ({ title: `Add Record ${item + 1}`, id: item }));
        return (
            <Accordion
                dataArray={data}
                renderContent={item => this.renderFlatList(item.id)}
            />
        );
    }

    decisiveRender() {
        if (this.props.duplicateTimes !== -1) {
            return this.AccordionView;

        } else if (this.props.pagerMode) {
            return this.SwiperView;
        }
        return this.renderFlatList(0);
    }

    render() {
        return (
            <View key={'showcase' + this.props.locationName} style={this.props.themedStyle.container} >

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
        flex: 1,
        backgroundColor: theme['background-basic-color-1'],
        paddingTop: 16,
        marginBottom: 32,
        paddingLeft: 4,
        paddingRight: 4
    },
    headingContainer: {
        flex: 1,
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
