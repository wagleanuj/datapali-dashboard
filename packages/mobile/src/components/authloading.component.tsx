import React from "react";
import { View } from "react-native";
import { ThemedComponentProps, withStyles } from "react-native-ui-kitten";
import { NavigationScreenProps } from "react-navigation";
import { connect } from "react-redux";
import { getUserToken } from "../redux/selectors/authSelector";
type Props = NavigationScreenProps & ThemedComponentProps & {
    authToken: string;
};
type State = {}
export class AuthLoadingScreen extends React.Component<Props, State> {
    componentDidMount() {
        this._bootstrapAsync();
    }

    // Fetch the token from storage then navigate to our appropriate place
    _bootstrapAsync = async () => {

        // This will switch to the App screen or Auth screen and this loading
        // screen will be unmounted and thrown away.
        this.props.navigation.navigate(this.props.authToken ? 'Home' : 'Login');
    };

    // Render any loading content that you like here
    render() {
        return (
            <View style={this.props.themedStyle.container}>

            </View>
        );
    }
}
export const AuthLoadingStyled = withStyles(AuthLoadingScreen, theme => ({
    container: {
        flex: 1,
        justifyContent: "center",
        backgroundColor: theme['background-basic-color-2']
    }
}));

const mapStateToProps = (state, props) => {
    return {
        authToken: getUserToken(state, props),
    }
}
export const ConnectedAuthLoading = connect(mapStateToProps, {})(AuthLoadingStyled);