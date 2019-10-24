import { getReadablePath } from "dpform";
import { Accordion } from 'native-base';
import React from "react";
import { View } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import { Pagination } from "react-native-snap-carousel";
import Swiper from "react-native-swiper";
import { Text, ThemedComponentProps, withStyles } from 'react-native-ui-kitten';
import { connect } from "react-redux";
import { WizardContext } from "../../context/wizard";
import { DAppState } from "../../redux/actions/types";
import { getChildrenOfSectionFromId, getDupeTimesForSectionNode, getNodeTypeFromId, getSectionNameFromId } from "../../redux/selectors/nodeSelector";
import { ScrollableAvoidKeyboard } from "../scrollableAvoidKeyboard";
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
    swiperRef: T;

    renderChildNode(item, iteration:number, hideIteration: boolean) {
        const { rootId, formId, locationName, path } = this.props;
        const newPath = hideIteration? path.concat(item.index):  path.concat(iteration, item.index);
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

    renderFlatList(iteration: number = 0, hideIteration: boolean = true) {
        return (
            <ScrollableAvoidKeyboard
                key={'avoid-view' + this.props.locationName}

            >
                <FlatList
                    keyboardShouldPersistTaps="always"
                    key={'list' + this.props.locationName}
                    automaticallyAdjustContentInsets
                    scrollEnabled
                    listKey={'lk' + this.props.locationName}
                    data={this.props.childNodes}
                    keyExtractor={item => 'listitem' + item}
                    renderItem={item => this.renderChildNode(item, iteration, hideIteration)}
                />
            </ScrollableAvoidKeyboard>

        );

    }

    onPageChange = (index: number) => {
        this.context.updatePagerModeIndex(this.props.sectionId, index);
    }

    get SwiperView() {
        return (
            <>
                <Swiper
                    scrollEnabled
                    key={'swiper-' + this.props.locationName}
                    autoplay={false}
                    loadMinimal
                    loadMinimalSize={2}
                    loop={false}
                    bounces
                    showsPagination={false}
                    automaticallyAdjustContentInsets
                    index={this.context.pagerModeIndices[this.props.sectionId]}
                    onIndexChanged={this.onPageChange}
                >
                    {this.props.childNodes.map((child, index) => {
                        return (
                            <View key={'swiper-child' + child} style={{ flexGrow: 1 }}>
                                {this.renderChildNode({ item: child, index: index }, 0,true)}
                            </View>
                        )
                    })}
                </Swiper>
                <Pagination
                    activeDotIndex={this.context.pagerModeIndices[this.props.sectionId] || 0}
                    dotsLength={this.props.childNodes.length}
                />
            </>


        )
    }
    get AccordionView() {
        let data = Array.from(new Array(this.props.duplicateTimes).keys()).map(item => ({ title: `Record ${item + 1}`, id: item }));
        return (
            <Accordion
                style={{ marginBottom: 50 }}
                dataArray={data}
                renderContent={item => {
                    return this.renderFlatList(item.id, false)
                }}
            />

        );
    }

    decisiveRender() {
        if (this.props.duplicateTimes !== -1) {
            return this.AccordionView;

        } else if (this.props.pagerMode) {
            return this.SwiperView;
        }
        return this.renderFlatList(0, true); 
    }

    render() {
        return (
            <View key={'showcase' + this.props.locationName} style={this.props.themedStyle.container} >

                <View style={this.props.themedStyle.headingContainer}>
                    <Text style={this.props.themedStyle.headingText}>
                        {`${getReadablePath(this.props.path)} : ${this.props.displayTitle}`}
                    </Text>
                </View>
                <View style={{ flexGrow: 1 }}>
                    {this.decisiveRender()}

                </View>

            </View>

        )
    }
}

const SectionNodeStyled = withStyles(SectionNode, theme => ({
    container: {
        flex: 1,
        backgroundColor: theme['background-basic-color-1'],
        paddingTop: 16,
        paddingLeft: 4,
        paddingRight: 4
    },
    headingContainer: {
        display: 'flex',
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
const mapStateToFormNodeProps = (state: DAppState, props) => {
    return {
        type: getNodeTypeFromId(state, props)
    }
}

export const ConnectedFormNode = connect(mapStateToFormNodeProps, {})(FormNode);
