import { DAppState } from "../redux/actions/types"
import { ApplicationProviderProps, ApplicationProvider } from "react-native-ui-kitten"
import { themes } from "../themes"
import { connect } from "react-redux"

const mapStateToProps = (state: DAppState, props: ApplicationProviderProps) => {
    const defaultTheme = "Eva Dark";
    return {
        theme: themes[state.settings.theme|| defaultTheme]
    }
}
export const ConnectedApplicationProvider = connect(mapStateToProps, {})(ApplicationProvider);

