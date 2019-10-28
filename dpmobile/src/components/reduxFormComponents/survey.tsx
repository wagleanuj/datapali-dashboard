import React from "react";
import { Icon, ThemedComponentProps, ThemeType, TopNavigation, TopNavigationAction, withStyles } from "react-native-ui-kitten";
import { NavigationScreenProps } from "react-navigation";
import { Header } from "react-navigation-stack";
import { connect } from 'react-redux';
import { Action, Dispatch } from "redux";
import { KEY_NAVIGATION_BACK } from "../../navigation/constants";
import { DAppState, FilledForm, SurveyState } from "../../redux/actions/types";
import { getFilledFormById } from "../../redux/selectors/filledFormSelectors";
import { textStyle } from "../../themes/style";
import { ConnectedWizard } from "./wizard";
type ComponentProps = {
    handlePrev: (formId: string) => void;
    handleNext: (formId: string) => void;
    handleJump: (formId: string, index: number) => void;
    form: FilledForm;
}
type SurveyProps = SurveyState & NavigationScreenProps & ThemedComponentProps & ComponentProps;
const routeName = "Survey Form";
export class Survey_ extends React.Component<SurveyProps, { validationResultVisible: boolean }>{
    state = {
        validationResultVisible: false,
    }
    static navigationOptions = (props) => {

        const renderLeftIcon = () => {
            return <TopNavigationAction onPress={() => {
                props.navigation.goBack(KEY_NAVIGATION_BACK)
            }} icon={(style) => <Icon {...style} name="arrow-back" />} />
        }
        const renderRightControls = () => {
            return [
                <TopNavigationAction
                    onPress={props.navigation.getParam("submitHandler")}
                    icon={(style) => <Icon {...style} name="paper-plane" />}
                />
            ]
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
    componentDidMount() {
        this.props.navigation.setParams({
            submitHandler: this.onSubmitPress.bind(this)
        })
    }
    onSubmitPress() {
        this.props.navigation.navigate("SubmitView", {
            formId: this.props.form.id,
            rootId: this.props.form.formId,
        })
    }

    handleNext() {
        this.props.handleNext(this.props.form.id)
    }
    handlePrev() {
        this.props.handlePrev(this.props.form.id)
    }

    render() {
        const { form } = this.props;
        return (
            <>

                <ConnectedWizard
                    formId={form.id}
                    rootId={form.formId}
                />


            </>

        )
    }
}
const SurveyForm_ = withStyles(Survey_, (theme: ThemeType) => ({
    container: {
        flex: 1,
        flexDirection: 'column',
        paddingHorizontal: 16,
        backgroundColor: theme['background-basic-color-2'],
    },
    showcaseContainer: {
        marginTop: 5,
    },

    accordion: {
        backgroundColor: theme['color-primary-300']
    },


}));
const mapStateToProps = (state: DAppState, props: SurveyProps) => {
    const filledFormId = props.navigation.getParam('ffId');
    let selected = getFilledFormById(state, props, filledFormId);
    return {
        form: selected,

    }
}

const mapDispatchToProps = (dispatch: Dispatch<Action<any>>) => ({

});
export const Survey = connect(
    mapStateToProps,
    mapDispatchToProps
)(SurveyForm_)