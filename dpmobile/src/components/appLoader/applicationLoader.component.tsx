import { EvaIconsPack } from '@ui-kitten/eva-icons';
import { AppLoading, SplashScreen } from 'expo';
import { Asset } from 'expo-asset';
import * as Font from 'expo-font';
import React from 'react';
import { ImageRequireSource } from 'react-native';
import { IconRegistry } from 'react-native-ui-kitten';
import { LoadingAnimationComponent } from './loadingAnimation.component';

export interface Assets {
  images: ImageRequireSource[];
  fonts: { [key: string]: number };
}

interface Props {
  assets: Assets;
  children: React.ReactNode;
}

interface State {
  loaded: boolean;
  store: any;
}

type LoadingElement = React.ReactElement<{}>;

/**
 * Loads child component after asynchronous tasks are done
 */
export class ApplicationLoader extends React.Component<Props, State> {

  constructor(props: Props) {
    super(props);
    SplashScreen.preventAutoHide();
  }

  public state: State = {
    loaded: false,
    store: {},
  };

  private onLoadSuccess = () => {
    this.setState({ loaded: true });
    SplashScreen.hide();
  };

  private onLoadError = (error: Error) => {
    console.warn(error);
  };

  private loadResources = (): Promise<void> => {
    return this.loadResourcesAsync(this.props.assets);
  };

  private loadFonts = (fonts: { [key: string]: number }): Promise<void> => {
    return Font.loadAsync(fonts);
  };

  private loadImages = (images: ImageRequireSource[]): Promise<void[]> => {
    const tasks: Promise<void>[] = images.map((image: ImageRequireSource): Promise<void> => {
      return Asset.fromModule(image).downloadAsync();
    });

    return Promise.all(tasks);
  };

  private async loadResourcesAsync(assets: Assets): Promise<void> {
    const { fonts, images } = assets;

    // @ts-ignore (expo type error)
    return Promise.all([
      this.loadFonts(fonts),
      this.loadImages(images),
      this.loadStore(),
    ]);
  }
  private async loadStore(): Promise<void> {

  }

  private renderLoading = (): LoadingElement => {
    return (
      <AppLoading
        startAsync={this.loadResources}
        onFinish={this.onLoadSuccess}
        onError={this.onLoadError}
        autoHideSplash={false}
      />
    );
  };
  public getChildren() {
    return (
      <>
        <IconRegistry icons={EvaIconsPack} />
        {this.props.children}

      </>
    )
  }

  public render(): React.ReactNode {
    return (
      <React.Fragment>
        {this.state.loaded ?

          this.getChildren() : this.renderLoading()}
        <LoadingAnimationComponent isLoaded={this.state.loaded} />
      </React.Fragment>
    );
  }
}
