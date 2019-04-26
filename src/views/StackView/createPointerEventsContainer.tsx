import * as React from 'react';
import { Animated, View } from 'react-native';
import { NavigationProp, Scene } from '../../types';

const MIN_POSITION_OFFSET = 0.01;

export type PointerEvents = 'box-only' | 'none' | 'auto';

export type InputProps = {
  scene: Scene;
  navigation: NavigationProp;
  realPosition: Animated.AnimatedInterpolation;
};

export type InjectedProps = {
  pointerEvents: PointerEvents;
  onComponentRef: (ref: View | null) => void;
};

/**
 * Create a higher-order component that automatically computes the
 * `pointerEvents` property for a component whenever navigation position
 * changes.
 */
export default function createPointerEventsContainer<
  Props extends InjectedProps & InputProps
>(
  Component: React.ComponentType<Props>
): React.ComponentType<Pick<Props, Exclude<keyof Props, keyof InjectedProps>>> {
  class Container extends React.Component<Props> {
    _pointerEvents = this._computePointerEvents();
    _component: View | null = null;
    _positionListener: AnimatedValueSubscription | undefined;

    componentWillUnmount() {
      this._positionListener && this._positionListener.remove();
    }

    _onComponentRef = (component: View | null) => {
      this._component = component;

      if (component && typeof component.setNativeProps !== 'function') {
        throw new Error('Component must implement method `setNativeProps`');
      }
    };

    _bindPosition() {
      this._positionListener && this._positionListener.remove();
      this._positionListener = new AnimatedValueSubscription(
        this.props.realPosition,
        this._onPositionChange
      );
    }

    _onPositionChange = (/* { value } */) => {
      // This should log each frame when releasing the gesture or when pressing
      // the back button! If not, something has gone wrong with the animated
      // value subscription
      // console.log(value);

      if (this._component) {
        const pointerEvents = this._computePointerEvents();
        if (this._pointerEvents !== pointerEvents) {
          this._pointerEvents = pointerEvents;
          this._component.setNativeProps({ pointerEvents });
        }
      }
    };

    _computePointerEvents() {
      const { navigation, realPosition, scene } = this.props;

      if (scene.isStale || navigation.state.index !== scene.index) {
        // The scene isn't focused.
        return scene.index > navigation.state.index ? 'box-only' : 'none';
      }

      // @ts-ignore
      const offset = realPosition.__getAnimatedValue() - navigation.state.index;
      if (Math.abs(offset) > MIN_POSITION_OFFSET) {
        // The positon is still away from scene's index.
        // Scene's children should not receive touches until the position
        // is close enough to scene's index.
        return 'box-only';
      }

      return 'auto';
    }

    render() {
      this._bindPosition();
      this._pointerEvents = this._computePointerEvents();

      return (
        <Component
          {...this.props}
          pointerEvents={this._pointerEvents}
          onComponentRef={this._onComponentRef}
        />
      );
    }
  }

  return Container as any;
}

class AnimatedValueSubscription {
  _value: Animated.Value;
  _token: string;

  constructor(value: Animated.Value, callback: Animated.ValueListenerCallback) {
    this._value = value;
    this._token = value.addListener(callback);
  }

  remove() {
    this._value.removeListener(this._token);
  }
}
