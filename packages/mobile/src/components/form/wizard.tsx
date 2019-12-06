import produce from "immer";
import _ from "lodash";
import React, { ReactNode } from "react";
import { View } from "react-native";
import { connect } from "react-redux";
import { InjectedFormProps, reduxForm } from "redux-form";
import { WizardContext } from "../../context/wizard";
import { DAppState } from "../../redux/actions/types";
import { getFilledFormById } from "../../redux/selectors/filledFormSelectors";
import { getValidQuestionsNumber } from "../../redux/selectors/nodeSelector";
import { getPagerModeStatus } from "../../redux/selectors/settingsSelector";
import { ConnectedToolbar } from "../toolbar";
import { ConnectedFormNode } from "./sectionNode";

type WizardProviderProps = {
    children: ReactNode,
    childNodes: string[]
}
type WizardProviderState = {
    pagerModeIndices: { [key: string]: number[] },
    currentRootChildIndex: number,
}
export class WizardProvider extends React.Component<WizardProviderProps, WizardProviderState>{
    constructor(props: WizardProviderProps) {
        super(props);
        this.state = {
            currentRootChildIndex: 0,
            pagerModeIndices: {},
        }
    }
    itemRefs: any;
    currentlyEditing: any;

    updatePagerModeIndex = (childId: string, newIndex: number, iteration: number = 0) => {
        this.setState(prevState => {
            return produce(prevState, draft => {
                if (!draft.pagerModeIndices[childId]) draft.pagerModeIndices[childId] = [];
                draft.pagerModeIndices[childId][iteration] = newIndex;
            });
        })
    }

    nextStep() {
        if (this.state.currentRootChildIndex >= this.props.childNodes.length - 1) return;
        this.setState(prevState => {
            return {
                currentRootChildIndex: prevState.currentRootChildIndex + 1,
            }
        })
    }

    prevStep() {
        if (this.state.currentRootChildIndex <= 0) return;
        this.setState(prevState => {
            return {
                currentRootChildIndex: prevState.currentRootChildIndex - 1,
            }
        })
    }

    jumpToStep(i: number) {
        this.setState({
            currentRootChildIndex: i
        })
    }

    setRefs(ref, valueLocation) {
        if (!this.itemRefs) this.itemRefs = {};
        _.set(this.itemRefs, valueLocation, ref);
    }
    getRef(valueLocation) {
        return _.get(this.itemRefs, valueLocation);
    }

    handleSubmitOrSwipe(nextLocation: any) {
        if (this.currentlyEditing) {
            const currentRef = this.getRef(this.currentlyEditing);
            if (currentRef) currentRef.blur();
        }
        const nextRef = this.getRef(nextLocation);
        if (nextRef && nextRef.focus) {
            nextRef.focus();
            this.currentlyEditing = nextLocation;
        } else {
            this.currentlyEditing = undefined;
        }

    }


    render() {
        const { currentRootChildIndex, pagerModeIndices } = this.state;
        const { children, childNodes } = this.props;
        return (
            <WizardContext.Provider
                value={{
                    childNodes: childNodes,
                    pagerModeIndices: pagerModeIndices,
                    currentRootChildIndex: currentRootChildIndex,
                    handleJump: this.jumpToStep.bind(this),
                    handleNext: this.nextStep.bind(this),
                    handlePrev: this.prevStep.bind(this),
                    updatePagerModeIndex: this.updatePagerModeIndex,
                    itemRefs: this.itemRefs,
                    setRefs: this.setRefs.bind(this),
                    getRef: this.getRef.bind(this),
                    handleSubmitOrSwipe: this.handleSubmitOrSwipe.bind(this),
                }}>
                {children}
            </WizardContext.Provider>
        );
    }
}
type NewWizardProps = {
    formId: string;
    rootId: string;
    childNodes: string[];
    currentRootChildIndex: number;
    pagerModeEnabled: boolean;
    itemRefs: any;

} & InjectedFormProps;

type NewWizardState = {
    pagerModeIndices: { [key: string]: number }
}
export class WizardPage extends React.Component<NewWizardProps, NewWizardState>{
    static contextType = WizardContext;
    sectionPages = new Map();
    handlePrev() {
        this.context.handleNext();
    }
    handleNext() {
        this.context.handlePrev();
    }
    handleJump() {
        this.context.handleJump();
    }
    getPage(currentRootChildIndex: number) {
        const { childNodes } = this.props;

        return <ConnectedFormNode
            key={'cnode' + childNodes[currentRootChildIndex]}
            pagerMode
            isAlone
            locationName={childNodes[currentRootChildIndex]}
            path={[0, currentRootChildIndex]}
            formId={this.props.formId}
            rootId={this.props.rootId}
            id={childNodes[currentRootChildIndex]}
        />
    }

    render() {
        const { childNodes, formId, rootId } = this.props;
        return (
            <WizardProvider
                childNodes={childNodes}
            >
                <WizardContext.Consumer>
                    {value => {
                        const { currentRootChildIndex } = value;
                        return <View style={{ flex: 1 }}>
                            <ConnectedToolbar
                                formId={formId}
                                rootId={rootId}
                                nextButtonDisabled={value.currentRootChildIndex >= value.childNodes.length - 1}
                                backButtonDisabled={value.currentRootChildIndex <= 0}
                                onBackButtonPress={value.handlePrev}
                                onNextButtonPress={value.handleNext}
                            />

                            <ConnectedFormNode
                                isAlone
                                pagerMode={this.props.pagerModeEnabled}
                                locationName={childNodes[currentRootChildIndex]}
                                path={[0, currentRootChildIndex]}
                                formId={this.props.formId}
                                rootId={this.props.rootId}
                                id={childNodes[currentRootChildIndex]}
                            />


                        </View>
                    }}

                </WizardContext.Consumer>

            </WizardProvider>


        )
    }
};

const WizardPageInjected = (reduxForm({
    destroyOnUnmount: false,
})(WizardPage))


const mapStateToProps = (state: DAppState, props) => {
    const filledForm = getFilledFormById(state, props);
    const roots = state.rootForms.byId[filledForm.formId];
    const selected = (roots[filledForm.formId]);
    return {
        counts: getValidQuestionsNumber(state, props),
        currentRootChildIndex: filledForm.currentIndex,
        form: props.formId,
        childNodes: selected.childNodes,
        pagerModeEnabled: getPagerModeStatus(state, props)
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
    }
}

export const ConnectedWizard = connect(mapStateToProps, mapDispatchToProps)(WizardPageInjected); 
