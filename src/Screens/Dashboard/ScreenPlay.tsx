import React, { useRef, useEffect, useState } from 'react';
import { Animated, View, StyleSheet, Dimensions } from 'react-native';
import { Colors } from '../../constants/Colors';

const { width: screenWidth } = Dimensions.get('window');

const ScreenPlay = ({ name }: any) => {
  const scrollX = useRef(new Animated.Value(0)).current;
  const [textWidth, setTextWidth] = useState(0);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (textWidth === 0) return;

    const distance = textWidth + screenWidth;
    scrollX.setValue(0);

    Animated.loop(
      Animated.timing(scrollX, {
        toValue: -distance,
        duration: 11000,
        useNativeDriver: true,
      })
    ).start();

    setReady(true);
  }, [textWidth]);

  const fullMessage = `${name}! Welcome to Soluzione Ess App.`;

  return (
    <View style={styles.header}>
      <Animated.View
        style={{
          flexDirection: 'row',
          transform: [{ translateX: scrollX }],
        }}
      >
        <Animated.Text
          onLayout={e => setTextWidth(e.nativeEvent.layout.width)}
          style={styles.message}
        >
          {fullMessage}
        </Animated.Text>
        {ready && (
          <Animated.Text style={styles.message}>
            {fullMessage}
          </Animated.Text>
        )}
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    top: 0,
    width: '100%',
    height: 30,
    backgroundColor: Colors.primary,
    overflow: 'hidden',
    justifyContent: 'center',
  },
  message: {
    fontSize: 14,
    color: Colors.white,
    fontFamily: 'Lato-Bold',
    paddingHorizontal: 5,
    paddingLeft:25
  },
});

export default ScreenPlay;
