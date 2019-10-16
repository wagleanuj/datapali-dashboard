import { getReadablePath } from "dpform";
import React from "react";
import { Picker, View } from "react-native";
import { Button, Icon, Layout, ThemedComponentProps, withStyles } from "react-native-ui-kitten";
import { connect } from "react-redux";
import { WizardContext } from "../context/wizard";
import { AppState } from "../redux/actions/types";
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

} & ThemedComponentProps;

class ToolbarComponent extends React.Component<ToolbarProps, {}>{
    constructor(props: ToolbarProps) {
        super(props);

    }
    renderBackButton(style) {
        return <Icon {...style} name="arrow-back"></Icon>
    }
    renderNextButton(style) {
        return <Icon  {...style} name="arrow-forward"></Icon>

    }
    static contextType = WizardContext;
    render() {
        return (
            <Layout style={this.props.themedStyle.toolbarGroup}>
                <Button
                    disabled={this.props.backButtonDisabled}
                    style={this.props.themedStyle.toolbarButton}
                    appearance="ghost"
                    icon={this.renderBackButton.bind(this)}
                    onPress={this.props.onBackButtonPress} />
                <View style={this.props.themedStyle.selectContainer}>
                    <Picker
                        selectedValue={this.props.sectionPickerData[this.context.currentRootChildIndex].id}
                        style={this.props.themedStyle.select}

                        onValueChange={this.props.jumpToSection}>
                        {this.props.sectionPickerData.map((data, index) => {
                            return <Picker.Item
                              s  value={data.id}
                                key={data.id}
                                label={`${getReadablePath([0, index])}: ${data.label}`}
                            />
                        })}


                    </Picker>
                </View>
                <Button
                    disabled={this.props.nextButtonDisabled}
                    style={this.props.themedStyle.toolbarButton}
                    appearance="ghost"
                    icon={this.renderNextButton.bind(this)}
                    onPress={this.props.onNextButtonPress}
                />
            </Layout>
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
        // backgroundColor: theme['color-primary-100'],
        borderWidth: 1,

    },
    toolbarButton: {
        borderWidth: 0,
        // backgroundColor: theme['color-primary-100'],
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

        elevation: 8,
        height: 48
    },
    select: {
        width: 150,
        height: 48
    },
}))
const mapStateToProps = (state: AppState, props) => {
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

    }
}

export const ConnectedToolbar = connect(mapStateToProps, mapDispatchToProps)(Toolbar);