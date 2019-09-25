import { Theme } from "react-navigation";
import { ThemedComponentProps, ListItemProps, ThemeProvider, List, withStyles, ThemeType } from "react-native-ui-kitten";
import React from "react";
import { ListRenderItemInfo } from "react-native";
import { ThemeCard } from "./themeCard.component";


interface ComponentProps {
  data: Theme[];
  currentTheme: string;
  onToggleTheme: (name: string) => void;
}

type ThemesProps = ThemedComponentProps & ComponentProps;

class ThemesComponent extends React.Component<ThemesProps> {



  private onItemPress = (index: number) => {
    const { [index]: theme } = this.props.data;

    this.props.onToggleTheme(theme.name);
  };

  private renderItem = (info: ListRenderItemInfo<Theme>): React.ReactElement<ListItemProps> => {
    const isDisabled: boolean = this.props.currentTheme === info.item.name;

    return (
      <ThemeProvider theme={info.item.theme}>
        <ThemeCard
          style={this.props.themedStyle.item}
          title={info.item.name}
          disabled={isDisabled}
          onPress={() => {
            this.onItemPress(info.index);
          }}
        />
      </ThemeProvider>
    );
  };

  public render(): React.ReactNode {
    const { themedStyle, data } = this.props;

    return (
      <List
        style={themedStyle.container}
        contentContainerStyle={themedStyle.contentContainer}
        data={data}
        renderItem={this.renderItem}
      />
    );
  }
}

export const Themes = withStyles(ThemesComponent, (theme: ThemeType) => ({
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    backgroundColor: theme['background-basic-color-2'],
  },
  item: {
    marginVertical: 8,
  },
}));
