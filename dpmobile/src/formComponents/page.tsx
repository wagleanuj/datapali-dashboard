import React from "react";
import { ThemedComponentProps } from "react-native-ui-kitten";
import { NavigationScreenProps } from "react-navigation";
import { Action, Dispatch } from "redux";
import { AppState } from "../redux/actions/types";
import { IAnswer, IAnswerSection } from "../redux/helper";
import { RootSection } from "dpform";

type PageProps = {
    content: IAnswer|IAnswerSection;
    root: RootSection
} & ThemedComponentProps & NavigationScreenProps;

export class Page extends React.Component<PageProps, {}>{
    render() {
        return (
            <></>
        )
    }
}
const mapStateToProps = (state: AppState, props: PageProps) => {
    return {
        content: state.filledForms
    }
}
const mapDispatchToProps = (dispatch: Dispatch<Action<any>>) => ({
    // saveAnswer: 
});
