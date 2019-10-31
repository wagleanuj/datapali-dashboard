import React, { Component } from 'react';
import { ThemeKey } from '.';

export interface ThemeContextType {
  currentTheme: ThemeKey;
  toggleTheme: (theme: ThemeKey) => void;
}

const initialValue: ThemeContextType = {
  currentTheme: 'Eva Light',
  toggleTheme: (theme: ThemeKey) => {},
};

export const ThemeContext: React.Context<ThemeContextType> = React.createContext(initialValue);

class ThemeContextProvider_ extends Component<>{

} (props: ThemeContextType)=>{
  
}