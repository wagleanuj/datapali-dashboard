import produce from "immer";
import React, { ReactNode } from "react";
import { View } from "react-native";
import { connect } from "react-redux";
import { InjectedFormProps, reduxForm } from "redux-form";
import { WizardContext } from "../../context/wizard";
import { AppState } from "../../redux/actions/types";
import { getFilledFormById } from "../../redux/selectors/filledFormSelectors";
import { ConnectedToolbar } from "../toolbar";
import { ConnectedFormNode } from "./sectionNode";

type WizardProviderProps = {
    children: ReactNode,
    childNodes: string[]
}
type WizardProviderState = {
    pagerModeIndices: { [key: string]: number },
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


    updatePagerModeIndex = (childId: string, newIndex: number) => {
        this.setState(prevState => {
            return produce(prevState, draft => {
                draft.pagerModeIndices[childId] = newIndex;
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
            locationName={childNodes[currentRootChildIndex]}
            path={[0, currentRootChildIndex]}
            formId={this.props.formId}
            rootId={this.props.rootId}
            id={childNodes[currentRootChildIndex]}
        />
    }
    render() {
        const { childNodes, formId, rootId } = this.props;
        console.log(childNodes, formId, rootId);
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
                                pagerMode
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


const mapStateToProps = (state: AppState, props) => {
    const filledForm = getFilledFormById(state, props);
    const roots = state.rootForms.byId[filledForm.formId];
    const selected = (roots[filledForm.formId]);
    return {
        currentRootChildIndex: filledForm.currentIndex,
        form: props.formId,
        childNodes: selected.childNodes,
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
    }
}

export const ConnectedWizard = connect(mapStateToProps, mapDispatchToProps)(WizardPageInjected); 
