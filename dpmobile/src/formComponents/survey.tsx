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
import { makeData, SecForm, SectionPaged } from "../components/reduxFormComponents/formPage";
import { Toolbar } from "../components/toolbar";
import { KEY_NAVIGATION_BACK } from "../navigation/constants";
import { handleNext, handlePrev } from "../redux/actions/action";
import { AppState, SurveyState } from "../redux/actions/types";
import { getFilledFormById } from "../redux/selectors/filledFormSelectors";
import { getRootFormById } from "../redux/selectors/questionSelector";
import { textStyle } from "../themes/style";
type ComponentProps = {
    handlePrev: (formId: string) => void;
    handleNext: (formId: string) => void;
    handleJump: (formId: string, index: number) => void;
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
    handleNext() {
        this.props.handleNext(this.props.form.id)
    }
    handlePrev() {
        this.props.handlePrev(this.props.form.id)
    }

    render() {
        const { form, root } = this.props;
        const data = (makeData(this.props.navigation.getParam('root').content[1], [0,0]));
        return (
            <View style={this.props.themedStyle.container}>
                <Toolbar
                    backButtonDisabled={this.props.currentIndex === 0}
                    nextButtonDisabled={false}
                    onBackButtonPress={this.handlePrev.bind(this)}
                    onNextButtonPress={this.handleNext.bind(this)}
                    jumpToSection={this.props.handleJump}
                    selectedSectionPath={[]}
                    sectionOptions={[]}
                />


                {/* <Page key='1123213123'
                    formId={form.id}
                    rootId={form.formId}
                /> */}
                {/* <ViewPager> */}
                {/* <SecForm sectionId={form.answerSection.content[0][0].id}  formId={form.id} rootId={form.formId} /> */}
                {/* <SecForm sectionId={form.answerSection.content[0][1].id} formId={form.id} rootId={form.formId} /> */}

                <SectionPaged
                    sectionId={form.answerSection.content[0][0].id}
                    formId={form.id}
                    rootId={form.formId}
                    data={data}
                />
                {/* </ViewPager> */}

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
        root: getRootFormById(state, props),

    }
}

const mapDispatchToProps = (dispatch: Dispatch<Action<any>>) => ({
    handleNext: (formId: string) => dispatch(handleNext(formId)),
    handlePrev: (formId: string) => dispatch(handlePrev(formId)),
    // handleJump: (i: number) => dispatch(handleJump(i))
});
export const Survey = connect(
    mapStateToProps,
    mapDispatchToProps
)(SurveyForm_)