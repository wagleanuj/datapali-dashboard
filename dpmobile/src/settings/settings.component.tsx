import React from 'react';
import { TouchableOpacity, TouchableOpacityProps, View } from 'react-native';
import { IconButton, Button } from 'react-native-paper';
import { Spinner, Text, ThemedComponentProps, ThemeType, Toggle, withStyles } from 'react-native-ui-kitten';
import { textStyle } from '../themes/style';


interface ComponentProps {
  darkModeEnabled: boolean;
  pagerModeEnabled: boolean;
  onTogglePagerMode: () => void;
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



  private onToggleDarkMode = (value: boolean) => {
    this.props.onToggleDarkMode(value);
  };

  private onTogglePagerMode = () => {
    this.props.onTogglePagerMode();
  }

  public render(): React.ReactNode {
    const { themedStyle, darkModeEnabled, pagerModeEnabled } = this.props;

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
        >
          <Text
            style={themedStyle.sectionText}
            category='s2'>
            Dark Mode
          </Text>
          <Toggle
            checked={darkModeEnabled}
            onChange={this.onToggleDarkMode}
          />
        </Section>

        <Section
          style={[themedStyle.section, themedStyle.soundEnabledSection]}
        >
          <Text
            style={themedStyle.sectionText}
            category='s2'>
            Pager Mode
          </Text>
          <Toggle
            checked={pagerModeEnabled}
            onChange={this.onTogglePagerMode}
          />
        </Section>

        <Section
          style={[themedStyle.section, themedStyle.notificationSection]}
        >
          <Button
            mode='contained'
            onPress={this.onLogoutPress}
            icon={"power"}
          >
            Logout
          </Button>
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
    paddingHorizontal: 16,
    paddingVertical: 16,
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
    borderBottomColor: theme['border-basic-color-1'],
  },
  sectionText: textStyle.subtitle,
}));

