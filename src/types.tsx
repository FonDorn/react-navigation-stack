import { Animated, StyleProp, TextStyle, ViewStyle } from 'react-native';
import { SafeAreaView } from '@react-navigation/native';

export type Route = {
  key: string;
  routeName: string;
};

export type Scene = {
  key: string;
  index: number;
  isStale: boolean;
  isActive: boolean;
  route: Route;
  descriptor: SceneDescriptor;
};

export type NavigationEventName =
  | 'willFocus'
  | 'didFocus'
  | 'willBlur'
  | 'didBlur';

export type NavigationState = {
  index: number;
  routes: Route[];
  isTransitioning?: boolean;
};

export type NavigationProp<RouteName = string, Params = object> = {
  navigate(routeName: RouteName): void;
  goBack(): void;
  goBack(key: string | null): void;
  addListener: (
    event: NavigationEventName,
    callback: () => void
  ) => { remove: () => void };
  isFocused(): boolean;
  state: NavigationState;
  setParams(params: Params): void;
  getParam(): Params;
  dispatch(action: { type: string }): void;
  dangerouslyGetParent(): NavigationProp | undefined;
};

export type NavigationStackOptions = {
  title?: string;
  header?: () => React.ReactNode | null;
  headerTitle?: string;
  headerTitleStyle?: StyleProp<TextStyle>;
  headerTitleContainerStyle?: StyleProp<ViewStyle>;
  headerTintColor?: string;
  headerTitleAllowFontScaling?: boolean;
  headerBackAllowFontScaling?: boolean;
  headerBackTitle?: string;
  headerBackTitleStyle?: StyleProp<TextStyle>;
  headerTruncatedBackTitle?: string;
  headerLeft?: React.ComponentType<HeaderBackbuttonProps>;
  headerLeftContainerStyle?: StyleProp<ViewStyle>;
  headerRight?: React.ComponentType<{}>;
  headerRightContainerStyle?: StyleProp<ViewStyle>;
  headerBackImage?: React.ComponentType<{
    tintColor: string;
    title?: string | null;
  }>;
  headerPressColorAndroid?: string;
  headerBackground?: string;
  headerTransparent?: boolean;
  headerStyle?: StyleProp<ViewStyle>;
  headerForceInset?: React.ComponentProps<typeof SafeAreaView>['forceInset'];
  gesturesEnabled?: boolean;
  gestureDirection?: 'inverted' | 'normal';
  gestureResponseDistance?: {
    vertical: number;
    horizontal: number;
  };
};

export type HeaderMode = 'float' | 'screen';

export type SceneDescriptor = {
  key: string;
  options: NavigationStackOptions;
  navigation: NavigationProp;
};

export type HeaderBackbuttonProps = {
  disabled?: boolean;
  onPress: () => void;
  pressColorAndroid?: string;
  tintColor: string;
  backImage?: NavigationStackOptions['headerBackImage'];
  title?: string | null;
  truncatedTitle?: string | null;
  backTitleVisible?: boolean;
  allowFontScaling?: boolean;
  titleStyle?: StyleProp<TextStyle>;
  layoutPreset: LayoutPreset;
  width?: number;
  scene: Scene;
};

export type SceneInterpolatorProps = {
  mode?: HeaderMode;
  layout: TransitionerLayout;
  scene: Scene;
  scenes: Scene[];
  position: Animated.AnimatedInterpolation;
  navigation: NavigationProp;
  shadowEnabled?: boolean;
  cardOverlayEnabled?: boolean;
};

export type SceneInterpolator = (props: SceneInterpolatorProps) => any;

export type LayoutPreset = 'left' | 'center';

export type TransitionerLayout = {
  height: Animated.Value;
  width: Animated.Value;
  initHeight: number;
  initWidth: number;
  isMeasured: boolean;
};

export type TransitionProps = {
  layout: TransitionerLayout;
  navigation: NavigationProp;
  position: Animated.AnimatedInterpolation;
  scenes: Scene[];
  scene: Scene;
  options: {};
  index: number;
};

export type TransitionConfig = {
  transitionSpec: {
    timing: Function;
  };
  screenInterpolator: SceneInterpolator;
  containerStyle?: StyleProp<ViewStyle>;
};
