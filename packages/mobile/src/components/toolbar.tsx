import { getReadablePath } from "@datapali/dpform";
import React from "react";
import { Picker, View } from "react-native";
import { Appbar, Button } from "react-native-paper";
import { ThemedComponentProps, withStyles } from "react-native-ui-kitten";
import { connect } from "react-redux";
import { initialize } from "redux-form";
import { APP_CONFIG } from "../config";
import { WizardContext } from "../context/wizard";
import { DAppState } from "../redux/actions/types";
import { getFilledFormById } from "../redux/selectors/filledFormSelectors";

type ToolbarProps = {
    formId: string;
    rootId: string;
    sectionPickerData: { id: string, label: string }[];
    sectionPickerSelected: string;
    jumpToSection: (value: string) => void;
    onBackButtonPress: () => void;
    onNextButtonPress: () => void;
    backButtonDisabled: boolean;
    nextButtonDisabled: boolean;
    initializeTemplateAnswers:(formId:string, values: any)=>void;

} & ThemedComponentProps;

class ToolbarComponent extends React.Component<ToolbarProps, {}>{
    constructor(props: ToolbarProps) {
        super(props);

    }

    static contextType = WizardContext;
    initializeTemplate(){
        this.props.initializeTemplateAnswers(this.props.formId, APP_CONFIG.templateAnswers)
    }
    render() {
        return (
            <Appbar style={this.props.themedStyle.toolbarGroup}>
                <Button
                    color={'#3366FF'}
                    disabled={this.props.backButtonDisabled}
                    style={this.props.themedStyle.toolbarButton}
                    onPress={this.props.onBackButtonPress} >Prev</Button>
                <Appbar.Action icon="format-color-fill" onPress={this.initializeTemplate.bind(this)}></Appbar.Action>
                <View style={this.props.themedStyle.selectContainer}>
                    <Picker
                        selectedValue={this.props.sectionPickerData[this.context.currentRootChildIndex].id}
                        style={this.props.themedStyle.select}

                        onValueChange={this.props.jumpToSection}>
                        {this.props.sectionPickerData.map((data, index) => {
                            return <Picker.Item
                                value={data.id}
                                key={data.id}
                                label={`${getReadablePath([0, index])}: ${data.label}`}
                            />
                        })}


                    </Picker>
                </View>

                <Button
                    color={'#3366FF'}
                    disabled={this.props.nextButtonDisabled}
                    style={this.props.themedStyle.toolbarButton}
                    onPress={this.props.onNextButtonPress}
                >Next</Button>
            </Appbar>
          
        )
    }
}

export const Toolbar = withStyles(ToolbarComponent, theme => ({
    toolbarGroup: {
        left: 0,
        right: 0,
        bottom: 0,
        flex: 0,
        flexDirection: 'row',
        alignItems: "center",
        justifyContent: 'space-between',
        height: 48,
        backgroundColor: theme['background-basic-color-2'],
        // borderWidth: 1,

    },
    toolbarButton: {
        borderWidth: 0,
        tint: theme['color-primary-default']
        // height: 48,
    },
    selectContainer: {
        flex: 0,
        flexDirection: "row",
        width: 150,
        backgroundColor: theme['color-primary-100'],
        borderRadius: 2,
        borderWidth: 1,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.30,
        shadowRadius: 4.65,

        height: 48
    },
    select: {
        width: 150,
        height: 48
    },
}))
const mapStateToProps = (state: DAppState, props) => {
    const filledForm = getFilledFormById(state, props);

    const roots = state.rootForms.byId[filledForm.formId];
    const selected = (roots[filledForm.formId]);
    const children = selected.childNodes;
    const data = children.map(it => ({ label: roots[it] && roots[it].name ? roots[it].name : 'no name', id: it }));
    return {
        sectionPickerData: data,
    }
}
const mapDispatchToProps = (dispatch) => {
    return {
        initializeTemplateAnswers:(formId:string, values: any)=> dispatch(initialize(formId, values))
    }
}

export const ConnectedToolbar = connect(mapStateToProps, mapDispatchToProps)(Toolbar);