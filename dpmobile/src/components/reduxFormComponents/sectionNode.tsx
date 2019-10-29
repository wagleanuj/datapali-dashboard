import { getReadablePath } from "dpform";
import _ from "lodash";
import React from "react";
import { View } from "react-native";
import Dots from 'react-native-dots-pagination';
import { FlatList } from "react-native-gesture-handler";
import ScrollableTabView, { ScrollableTabBar } from "react-native-scrollable-tab-view";
import Swiper from "react-native-swiper";
import { Text, ThemedComponentProps, withStyles } from 'react-native-ui-kitten';
import { connect } from "react-redux";
import { WizardContext } from "../../context/wizard";
import { DAppState } from "../../redux/actions/types";
import { getChildrenOfSectionFromId, getDupeTimesForSectionNode, getNodeTypeFromId, getSectionNameFromId, getValidQuestionsNumber } from "../../redux/selectors/nodeSelector";
import { ScrollableAvoidKeyboard } from "../scrollableAvoidKeyboard";
import { ConnectedQuestionNode } from "./questionNode";
import { Avatar } from "react-native-paper";


type CurrentEdit = {
    iteration: number;
    item: string;
}
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
    isAlone: boolean;
} & ThemedComponentProps;
class SectionNode extends React.Component<SectionNodeProps, { current: CurrentEdit }>{
    state = {
        current: {
            iteration: 0,
            item: ""
        },
    }
    static contextType = WizardContext;
    swiper: Swiper;
    childrenRefs: any[] = [];
    flatlist: FlatList<string>;

    setRefs(locationName: string, ref: any) {
        this.context.setRefs(ref, locationName);
    }



    renderChildNode(item, iteration: number, hideIteration: boolean) {
        const { rootId, formId, locationName, path } = this.props;
        const newPath = hideIteration ? path.concat(item.index) : path.concat(iteration, item.index);
        const newLocation = locationName.concat(`[${iteration}].${item.item}`);
        return <ConnectedFormNode
            setInputRef={(r) => this.setRefs(newLocation, r)}
            key={'formnode' + newLocation}
            id={item.item}
            locationName={newLocation}
            path={newPath}
            formId={formId}
            rootId={rootId}
            onSubmit={() => this.onSubmit(item.index, iteration)}
        />

    }
    onSubmit = (currIndex: number, iteration: number = 0) => {
        if (this.swiper && this.props.childNodes[currIndex + 1]) this.swiper.scrollBy(1);
        if (this.flatlist && this.props.childNodes[currIndex + 1]) {
            const location = _.toPath(this.props.locationName).concat(iteration.toString(), this.props.childNodes[currIndex + 1]);
            this.moveFocusTo(location);
        }
    }

    renderFlatList(iteration: number = 0, hideIteration: boolean = true) {
        return (
            <ScrollableAvoidKeyboard
                extraScrollHeight={128}
                key={'avoid-view' + this.props.locationName}
            >
                <FlatList
                    ref={r => this.flatlist = r}
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
    moveFocusTo(location: any[]) {
        this.context.handleSubmitOrSwipe(location);
    }

    onPageChange = (index: number, iteration: number = 0) => {
        const nextLocation = _.toPath(this.props.locationName).concat(iteration.toString(), this.props.childNodes[index]);
        this.moveFocusTo(nextLocation);
        this.context.updatePagerModeIndex(this.props.sectionId, index, iteration);
    }

    get TabbedView() {
        let data = Array.from(new Array(this.props.duplicateTimes).keys()).map(item => ({ title: `Record ${item + 1}`, id: item }));
        const { pagerModeIndices } = this.context;
        return (
            <ScrollableTabView
                initialPage={0}
                locked
                tabBarUnderlineStyle={this.props.themedStyle.tabUnderlineStyle}
                tabBarTextStyle={this.props.themedStyle.tabBarTextStyle}
                renderTabBar={() => <ScrollableTabBar />}
            >
                {
                    data.map((item, i) => {
                        const index = pagerModeIndices[this.props.sectionId] ? pagerModeIndices[this.props.sectionId][i] : 0;

                        return (
                            <SwiperView
                                key={'record' + (i)}
                                tabLabel={'Record ' + (i + 1)}
                                setRef={r => this.swiper = r}
                                index={index}
                                childNodes={this.props.childNodes}
                                onIndexChange={(ind) => this.onPageChange(ind, i)}
                                renderItem={(child, index) => {
                                    return (
                                        <View key={'swiper-child' + child} style={{ flexGrow: 1 }}>
                                            {this.renderChildNode({ item: child, index: index }, i, false)}
                                        </View>
                                    )
                                }}
                            />
                        );



                    })
                }
            </ScrollableTabView>
        );
    }

    get SwiperView_() {
        const { pagerModeIndices } = this.context;
        const index = pagerModeIndices[this.props.sectionId] ? pagerModeIndices[this.props.sectionId][0] : 0;
        return <SwiperView
            setRef={r => this.swiper = r}
            childNodes={this.props.childNodes}
            onIndexChange={(i) => this.onPageChange(i, 0)}
            index={index}
            renderItem={(child, index) => {
                return (
                    <View key={'swiper-child' + child} style={{ flexGrow: 1 }}>
                        {this.renderChildNode({ item: child, index: index }, 0, true)}
                    </View>
                );
            }}
        />
    }

    get NotRequiredSectionPage() {
        return (
            <View style={this.props.themedStyle.notRequiredSectionPage}>
                <Avatar.Icon icon="lock-open" size={this.props.isAlone ? 100 : 50} />
                <Text status="success">Not Required to Fill.</Text>
            </View>
        )
    }

    decisiveRender() {
        if (this.props.duplicateTimes !== -1) {
            return this.props.duplicateTimes === 0 ? this.NotRequiredSectionPage : this.TabbedView;
        } else if (this.props.pagerMode) {
            return this.SwiperView_;
        }
        return this.renderFlatList(0, true);
    }

    render() {
        return (
            <View key={'showcase' + this.props.locationName} style={this.props.themedStyle.container} >

                {!this.props.isAlone && <View style={this.props.themedStyle.headingContainer}>
                    <Text style={this.props.themedStyle.headingText}>
                        {`${getReadablePath(this.props.path)} : ${this.props.displayTitle}`}
                    </Text>
                </View>}
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
    },
    tabBarTextStyle: {
        color: theme['text-basic-color']
    },
    tabStyle: {
        backgroundColor: 'red'
    },
    tab: {
        backgroundColor: theme['background-basic-color-1']
    },
    tabUnderlineStyle: {
        backgroundColor: theme['color-primary-default']

    },
    notRequiredSectionPage: {
        flex: 1,
        justifyContent: 'center',
        flexDirection: 'column',
        alignItems: 'center'
    }
}));

const mapStateToProps = (state, props) => {
    const dupe = getDupeTimesForSectionNode(state, props);
    const s = getValidQuestionsNumber(state, props);

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
    onSubmit: () => void;
    setInputRef: (r) => void;
    isAlone: boolean;
} & ThemedComponentProps;

class FormNode extends React.Component<FormNodeProps, {}>{
    get QuestionNode() {
        const { themedStyle, theme, ...restProps } = this.props;
        let q = <ConnectedQuestionNode  {...restProps} setInputRef={this.props.setInputRef} questionId={restProps.id} />
        if (restProps.isAlone) {
            return <View style={this.props.themedStyle.qContainer}>{q}</View>
        }
        return q;
    }
    render() {
        const { themedStyle, theme, ...restProps } = this.props;
        return (
            restProps.type === 'question' ? this.QuestionNode
                : <ConnectedSectionNode  {...restProps} setInputRef={this.props.setInputRef} sectionId={restProps.id} />
        )

    }
}
const mapStateToFormNodeProps = (state: DAppState, props) => {
    return {
        type: getNodeTypeFromId(state, props)
    }
}
const FormNodeStyled = withStyles(FormNode, theme => ({
    qContainer: {
        flex: 1,
        backgroundColor: theme['background-basic-color-1'],
        paddingTop: 16,
        paddingLeft: 4,
        paddingRight: 4

    }
}))

export const ConnectedFormNode = connect(mapStateToFormNodeProps, {})(FormNodeStyled);

type SwiperViewProps = {
    renderItem: (child: string, index: number) => {};
    childNodes: string[];
    onIndexChange?: (index: number) => void;
    index?: number;
    setRef: (r: Swiper) => void;
    height?: number;
    tabLabel?: string;
}
class SwiperView extends React.Component<SwiperViewProps, {
    selected: number;
}>

{
    state = {
        selected: this.props.index || 0
    }
    onIndexChanged = (newIndex: number) => {
        if (!!!this.props.onIndexChange) {
            this.setState({
                selected: newIndex
            })
        }
        else {
            this.props.onIndexChange(newIndex)
        }
    }
    render() {
        const dotIndex = !!this.props.onIndexChange ? (this.props.index || 0) : this.state.selected
        return (
            <>
                <Swiper
                    ref={this.props.setRef}
                    scrollEnabled
                    autoplay={false}
                    loadMinimal
                    loadMinimalSize={5}
                    height={this.props.height}
                    loop={false}
                    bounces
                    showsPagination={false}
                    index={_.isNil(this.props.index) ? this.props.index : this.state.selected}
                    onIndexChanged={this.onIndexChanged}
                >
                    {this.props.childNodes.map((child, index) => {
                        return (
                            this.props.renderItem(child, index)
                        )
                    })}
                </Swiper>
                <Dots
                    activeDotWidth={10}
                    passiveDotWidth={8}
                    active={dotIndex}
                    length={this.props.childNodes.length}
                />
            </>
        );
    }
}
