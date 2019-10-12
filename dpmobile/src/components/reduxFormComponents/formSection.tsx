import { FormSection } from "redux-form"
import { ReactNode } from "react"
import React from "react";
import { View } from "react-native";
import { Text } from 'react-native-ui-kitten';

type FormSectionProps = {
    name: string;
    children: ReactNode;
    displayTitle: string;
}

export class CustomFormSection extends React.Component<FormSectionProps, {}>{

    renderFields = () => {
        return <>{this.props.children}</>;
    }

    render() {
        return <View>
            <Text>{this.props.displayTitle}</Text>
            <FormSection
                name={this.props.name}
                component={this.renderFields}
            />
        </View>
    }
}
