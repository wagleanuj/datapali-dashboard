import React from 'react';
import { TouchableOpacity, TouchableOpacityProps, View } from 'react-native';
import { Button, Spinner, Text, ThemedComponentProps, ThemeType, Toggle, withStyles, Icon } from 'react-native-ui-kitten';
import { textStyle } from '../themes/style';


interface ComponentProps {
  darkModeEnabled: boolean;
  onDownloadFormsPress: () => void;
  onLogoutPress: () => void;
  onToggleDarkMode: (value: boolean) => void;
  isLoadingAvailableForms: boolean;
}

export type SettingsProps = ThemedComponentProps & ComponentProps;

class SettingsComponent extends React.Component<SettingsProps> {

  private onDownloadFormsPress = () => {
    this.props.onDownloadFormsPress();
  };

  private onLogoutPress = () => {
    this.props.onLogoutPress();
  };

  private onSoundEnabledPress = () => {
    const { darkModeEnabled } = this.props;
    this.onToggleDarkMode(!darkModeEnabled);
  };

  private onToggleDarkMode = (value: boolean) => {
    this.props.onToggleDarkMode(value);
  };

  public render(): React.ReactNode {
    const { themedStyle, darkModeEnabled: soundEnabled } = this.props;

    return (
      <View style={themedStyle.container}>
        <Section
          style={themedStyle.downloadFormsSection}
          onPress={this.onDownloadFormsPress}>
          <Text
            style={themedStyle.sectionText}
            category='s2'>
            Download Available Forms
          </Text>
          {this.props.isLoadingAvailableForms && <Spinner />}
        </Section>

        <Section
          style={[themedStyle.section, themedStyle.soundEnabledSection]}
          onPress={this.onSoundEnabledPress}>
          <Text
            style={themedStyle.sectionText}
            category='s2'>
            Dark Mode
          </Text>
          <Toggle
            checked={soundEnabled}
            onChange={this.onToggleDarkMode}
          />
        </Section>

        <Section
          style={[themedStyle.section, themedStyle.notificationSection]}
          onPress={this.onLogoutPress}>
          <Button icon={(style) => (<Icon {...style} name="log-out" />)}>Logout</Button>
        </Section>
      </View>
    );
  }
}

interface SectionProps extends TouchableOpacityProps {
  children?: React.ReactNode;
}

const Section = (props?: SectionProps): React.ReactElement<TouchableOpacityProps> => {
  return (
    <TouchableOpacity
      activeOpacity={0.65}
      {...props}
    />
  );
};

export const Settings = withStyles(SettingsComponent, (theme: ThemeType) => ({
  container: {
    flex: 1,
    backgroundColor: theme['background-basic-color-1'],
  },
  section: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: theme['border-basic-color-2'],
  },
  notificationSection: {
    paddingTop: 40,
  },
  soundEnabledSection: {
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    paddingTop: 40,
  },
  downloadFormsSection: {
    flex: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: theme['border-basic-color-2'],
  },
  sectionText: textStyle.subtitle,
}));
