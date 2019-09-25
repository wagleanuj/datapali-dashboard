import React from "react";
import { ThemeKey, themes, ThemeContextType, ThemeContext,  } from "../../themes";
import { Themes } from "./themes.component";
import { Theme } from "./type";


export class ThemesContainer extends React.Component {

  private EXCLUDE_THEMES: ThemeKey[] = [
    'App Theme',
  ];

  private data: Theme[] = [];

  constructor(props) {
    super(props);
    this.data = Object.keys(themes)
                      .filter(this.shouldIncludeTheme)
                      .map(this.toThemeObject);
  }

  private shouldIncludeTheme = (themeKey: ThemeKey): boolean => {
    return !this.EXCLUDE_THEMES.includes(themeKey);
  };

  private toThemeObject = (theme: ThemeKey): Theme => {
    return { name: theme, theme: themes[theme] };
  };

  private renderContent = (context: ThemeContextType): React.ReactElement<any> => {
    return (
      <Themes
        data={this.data}
        currentTheme={context.currentTheme}
        onToggleTheme={context.toggleTheme}
      />
    );
  };

  public render(): React.ReactNode {
    return (
      <ThemeContext.Consumer>
        {this.renderContent}
      </ThemeContext.Consumer>
    );
  }
}
