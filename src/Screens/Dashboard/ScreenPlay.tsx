import React, { useRef, useEffect, useState } from 'react';
import { Animated, View, StyleSheet, Dimensions, Text } from 'react-native';
import { Colors } from '../../constants/Colors';
import { useSelector } from 'react-redux';
import { isDarkTheme } from '../../AppStore/Reducers/appState';
import moment from 'moment';

const { width: screenWidth } = Dimensions.get('window');

const ScreenPlay = ({ name }: any) => {
  const isDark = useSelector(isDarkTheme);

  const scrollX = useRef(new Animated.Value(0)).current;
  const [textWidth, setTextWidth] = useState(0);
  const [ready, setReady] = useState(false);
  const [greeting, setGreeting] = useState('');

  const updateGreeting = () => {
    const hour = moment().hour();
    if (hour >= 5 && hour < 12) setGreeting('Good Morning');
    else if (hour >= 12 && hour < 17) setGreeting('Good Afternoon');
    else if (hour >= 17 && hour < 21) setGreeting('Good Evening');
    else setGreeting('Good Night');
  };

  useEffect(() => {
    updateGreeting(); // initial
    const interval = setInterval(updateGreeting, 60000);
    return () => clearInterval(interval);
  }, []);

  // useEffect(() => {
  //   if (textWidth === 0) return;

  //   const distance = textWidth + screenWidth;
  //   scrollX.setValue(0);

  //   Animated.loop(
  //     Animated.timing(scrollX, {
  //       toValue: -distance,
  //       duration: 11000,
  //       useNativeDriver: true,
  //     })
  //   ).start();

  //   setReady(true);
  // }, [textWidth]);

  const fullMessage = `${'Hi'}, ${name}! Welcome to Soluzione Ess App`;

  return (
    <View style={styles(isDark).header}>
      {/* <Animated.View
        style={{
          flexDirection: 'row',
          transform: [{ translateX: scrollX }],
        }}
      >
        <Animated.Text
          onLayout={e => setTextWidth(e.nativeEvent.layout.width)}
          style={styles(isDark).message}
        >
          {fullMessage}
        </Animated.Text>
        {ready && (
          <Animated.Text style={styles(isDark).message}>
            {fullMessage}
          </Animated.Text>
        )}
      </Animated.View> */}
      <Text style={styles(isDark).message}>{fullMessage}</Text>
    </View>
  );
};

const styles = (isDark: any) => StyleSheet.create({
  header: {
    top: 0,
    width: '100%',
    height: 30,
    backgroundColor: isDark ? Colors.black : Colors.primary,
    overflow: 'hidden',
    justifyContent: 'center',
  },
  message: {
    fontSize: 13,
    color: Colors.white,
    fontFamily: 'Lato-Bold',
    paddingHorizontal: 8,
    textAlign: 'center',
  },
});

export default ScreenPlay;
