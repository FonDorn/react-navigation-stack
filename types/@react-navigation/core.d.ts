declare module '@react-navigation/core' {
  import * as React from 'react';

  export const StackActions: {
    completeTransition(): { type: string };
  };

  export const NavigationActions: {
    back(action: { key: string; immediate?: boolean });
  };

  export const NavigationProvider: React.ComponentType<{
    value: object;
  }>;

  export const SceneView: React.ComponentType<{
    screenProps: unknown;
    navigation: object;
    component: React.ComponentType<any>;
  }>;
}
