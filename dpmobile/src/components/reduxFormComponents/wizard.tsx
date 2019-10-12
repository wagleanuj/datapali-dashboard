import React, { ReactNode } from "react";
import { connect } from "react-redux";
import { InjectedFormProps, reduxForm } from "redux-form";
import { getFilledFormById } from "../../redux/selectors/questionSelector";
import { ConnectedFormNode } from "./formNode";

export const WizardContext = React.createContext({
    currentIndex: 0,
    childNodes: [],
    jumpToStep: () => { },
    nextStep: () => { },
    prevStep: () => { }
});

type WizardProviderProps = {
    children: ReactNode,
    childNodes: string[]
}
export class WizardProvider extends React.Component<WizardProviderProps, {}>{
    state = {
        currentIndex: 0
    }
    nextStep = () => {

    }
    prevStep = () => {

    }
    jumpToStep = () => {

    }

    render() {
        const { jumpToStep, prevStep, nextStep } = this;
        const { currentIndex } = this.state;
        const { children, childNodes } = this.props;
        return (
            <WizardContext.Provider
                value={{
                    childNodes: childNodes,
                    currentIndex,
                    jumpToStep,
                    nextStep,
                    prevStep

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
    currentIndex: number;
} & InjectedFormProps;
export class WizardPage extends React.Component<NewWizardProps, {}>{
    render() {
        const { childNodes, currentIndex } = this.props;
        return (
            <ConnectedFormNode
                locationName={childNodes[currentIndex]}
                path={[0, currentIndex]}
                formId={this.props.formId}
                rootId={this.props.rootId}
                id={childNodes[currentIndex]}
            />
        )
    }
};

const WizardPageInjected = (reduxForm({
    destroyOnUnmount: false,
})(WizardPage))


const mapStateToProps = (state, props) => {
    const filledForm = getFilledFormById(state, props);
    const roots = state.rootForms[filledForm.formId];
    const selected = (roots[filledForm.formId]);
    return {
        currentIndex: filledForm.currentIndex,
        form: props.formId,
        childNodes: selected.childNodes,
    }
};

const mapDispatchToProps = (dispatch) => {
    return {

    }
}

export const ConnectedWizard = connect(mapStateToProps, mapDispatchToProps)(WizardPageInjected); 
