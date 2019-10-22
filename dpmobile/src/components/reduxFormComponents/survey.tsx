import React from "react";
import { View } from "react-native";
import { ThemedComponentProps, ThemeType, TopNavigation, TopNavigationAction, withStyles } from "react-native-ui-kitten";
import { NavigationScreenProps } from "react-navigation";
import { Header } from "react-navigation-stack";
import { connect } from 'react-redux';
import { Action, Dispatch } from "redux";
import { ArrowIosBackFill, SaveIcon } from "../../assets/icons";
import { KEY_NAVIGATION_BACK } from "../../navigation/constants";
import { AppState, SurveyState, FilledForm } from "../../redux/actions/types";
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
const routeName = "Sruvey Form";
export class Survey_ extends React.Component<SurveyProps>{
    static navigationOptions = (props) => {

        const renderLeftIcon = () => {
            return <TopNavigationAction onPress={() => {
                const save = props.navigation.getParam("onSaveClick");
                if (save) save().then(res => {
                    props.navigation.goBack(KEY_NAVIGATION_BACK)

                })
                else props.navigation.goBack(KEY_NAVIGATION_BACK)

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
        const { form } = this.props;

        return (
            <View style={this.props.themedStyle.container}>
                <ConnectedWizard
                    formId={form.id}
                    rootId={form.formId}

                />
            </View>
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
const mapStateToProps = (state: AppState, props: SurveyProps) => {
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