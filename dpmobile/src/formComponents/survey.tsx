import { RootSection } from "dpform";
import React from "react";
import { View } from "react-native";
import { ThemedComponentProps, ThemeType, TopNavigation, TopNavigationAction, withStyles } from "react-native-ui-kitten";
import { NavigationScreenProps } from "react-navigation";
import { Header } from "react-navigation-stack";
import { connect } from 'react-redux';
import { Action, Dispatch } from "redux";
import { ArrowIosBackFill, SaveIcon } from "../assets/icons";
import { FilledForm } from "../components/forms.component";
import { Toolbar } from "../components/toolbar";
import { KEY_NAVIGATION_BACK } from "../navigation/constants";
import { handleJump, handleNext, handlePrev } from "../redux/actions/action";
import { AppState, SurveyState } from "../redux/actions/types";
import { getFilledFormById } from "../redux/selectors/filledFormSelectors";
import { textStyle } from "../themes/style";
import { Page } from "./page";
type ComponentProps = {
    handlePrev: () => void;
    handleNext: () => void;
    handleJump: (index: number) => void;
    form: FilledForm;
    root: RootSection;
}
type SurveyProps = SurveyState & NavigationScreenProps & ThemedComponentProps & ComponentProps;
const routeName = "Sruvey Form";
export class Survey_ extends React.Component<SurveyProps>{
    static navigationOptions = (props) => {

        const renderLeftIcon = () => {
            return <TopNavigationAction onPress={() => {
                const save = props.navigation.getParam("onSaveClick");
                save().then(res => {
                    props.navigation.goBack(KEY_NAVIGATION_BACK)

                })
            }} icon={ArrowIosBackFill} />
        }
        const renderRightControls = () => {
            const save = props.navigation.getParam("onSaveClick");
            const saveComponent = <TopNavigationAction onPress={save} icon={SaveIcon} />


            return [saveComponent];
        }
        return {
            header: props => <TopNavigation
                style={{ height: Header.HEIGHT }}
                alignment='center'
                title={"Datapali"}
                subtitle={routeName}
                subtitleStyle={textStyle.caption1}
                leftControl={renderLeftIcon()}
                rightControls={renderRightControls()}
            />
        }
    }

    render() {
        const { form, root } = this.props;
        return (
            <View style={this.props.themedStyle.container}>
                <Toolbar
                    backButtonDisabled={this.props.currentIndex === 0}
                    nextButtonDisabled={false}
                    onBackButtonPress={this.props.handlePrev}
                    onNextButtonPress={this.props.handleNext}
                    jumpToSection={this.props.handleJump}
                    selectedSectionPath={[]}
                    sectionOptions={[]}
                />
                <Page
                    filledFormId={form.id}
                    rootId={form.formId}
                />
            </View>
        )
    }
}
const SurveyForm_ = withStyles(Survey_, (theme: ThemeType) => ({
    container: {
        flex: 1,
        paddingHorizontal: 16,
        paddingVertical: 16,
        backgroundColor: theme['background-basic-color-2'],
    },
    showcaseContainer: {
        marginTop: 5,
    },

    accordion: {
        backgroundColor: theme['color-primary-300']
    },


}));
const mapStateToProps = (state: AppState, props: SurveyProps) => {
    const filledFormId = props.navigation.getParam('ffId');
    let selected = getFilledFormById(state, props, filledFormId);
    return {
        form: selected,
        // root: getRootFormById(state, rootId),

    }
}

const mapDispatchToProps = (dispatch: Dispatch<Action<any>>) => ({
    handleNext: () => dispatch(handleNext()),
    handlePrev: () => dispatch(handlePrev()),
    handleJump: (i: number) => dispatch(handleJump(i))
});
export const Survey = connect(
    mapStateToProps,
    mapDispatchToProps
)(SurveyForm_)