import React, {forwardRef, useImperativeHandle} from 'react';
import {
  View,
  Animated,
  StatusBar,
  StyleSheet,
  Dimensions,
  PanResponder,
} from 'react-native';
import {Colors} from '../../constants/Colors';
import {useSelector} from 'react-redux';
import {isDarkTheme} from '../../AppStore/Reducers/appState';

export interface IBottomSheetRef {
  expand: () => void;
  collapse: () => void;
}

export const BottomSheet = forwardRef<IBottomSheetRef, React.PropsWithChildren>(
  ({children}, ref) => {
    const [expanded, setExpanded] = React.useState(false);
    const {current: opacity} = React.useRef(new Animated.Value(0));
    const isDark = useSelector(isDarkTheme);

    const {current: translateY} = React.useRef(
      new Animated.Value(SCREEN_HEIGHT - BOTTOM_SHEET_HEIGHT.min),
    );
    const {current: panResponder} = React.useRef(
      PanResponder.create({
        onMoveShouldSetPanResponder: () => true,
        onPanResponderGrant: () => {
          translateY.extractOffset();
        },
        onPanResponderMove: Animated.event([null, {dy: translateY}], {
          useNativeDriver: false,
        }),
        onPanResponderRelease: (_event, _gesture) => {
          const dy = translateY._value as unknown as number;

          if (Math.abs(dy) < DRAG_THRESH) {
            Animated.spring(translateY, {
              toValue: 0,
              useNativeDriver: false,
            }).start();
            return;
          }
          if (dy > 0) {
            close();
          } else {
            open();
          }
        },
      }),
    );

    const close = () => {
      translateY.flattenOffset();
      const a1 = Animated.spring(translateY, {
        toValue: SCREEN_HEIGHT - BOTTOM_SHEET_HEIGHT.min,
        useNativeDriver: false,
      });
      const a2 = Animated.timing(opacity, {
        toValue: 0,
        duration: 100,
        useNativeDriver: false,
      });

      const animations = Animated.parallel([a1, a2]);
      animations.start(() => setExpanded(false));
    };

    const open = () => {
      translateY.flattenOffset();
      setExpanded(true);
      const a1 = Animated.spring(translateY, {
        toValue: SCREEN_HEIGHT - BOTTOM_SHEET_HEIGHT.max,
        useNativeDriver: false,
      });
      const a2 = Animated.timing(opacity, {
        toValue: 0.1,
        duration: 100,
        useNativeDriver: false,
      });

      const animations = Animated.parallel([a1, a2]);
      animations.start();
    };

    useImperativeHandle(ref, () => ({
      expand: open,
      collapse: close,
    }));

    return (
      <>
        {expanded && (
          <Animated.View style={[styles(isDark).overlay, {opacity}]} />
        )}
        <Animated.View
          style={[
            styles(isDark).bottomSheet,
            {
              transform: [{translateY}],
            },
          ]}>
          <View
            style={styles(isDark).handleWrapper}
            {...panResponder.panHandlers}>
            <View style={styles(isDark).handle} />
          </View>
          {children}
        </Animated.View>
      </>
    );
  },
);

const DRAG_THRESH = 100;

const {width: SCREEN_WIDTH, height: SCREEN_HEIGHT} = Dimensions.get('window');

const BOTTOM_SHEET_HEIGHT = {
  min: -30,
  max: SCREEN_HEIGHT * 0.9,
};

const styles = (isDark: boolean) =>
  StyleSheet.create({
    bottomSheet: {
      padding: 24,
      backgroundColor: isDark ? 'black' : 'white',
      borderTopLeftRadius: 24,
      borderTopRightRadius: 24,
      //#region positioning
      left: 0,
      position: 'absolute',
      //#endregion
      width: SCREEN_WIDTH,
      height: BOTTOM_SHEET_HEIGHT.max,
      // shadow
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 0,
      },
      shadowOpacity: 1,
      shadowRadius: 15.19,

      elevation: 20,
    },
    overlay: {
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      elevation: 10,
      position: 'absolute',
      backgroundColor: '#000000',
    },
    handle: {
      height: 8,
      width: 100,
      borderRadius: 4,
      alignSelf: 'center',
      backgroundColor: Colors.primary,
    },
    handleWrapper: {
      marginTop: -24,
      paddingVertical: 24,
    },
  });
