import { dark, light } from '@eva-design/eva';
import { ThemeType } from 'react-native-ui-kitten';

interface ThemeRegistry {
  ['Eva Light']: ThemeType;
  ['Eva Dark']: ThemeType;
}

export type ThemeKey = keyof ThemeRegistry;

export const themes: ThemeRegistry = {
  'Eva Light': light,
  'Eva Dark': dark,
};



