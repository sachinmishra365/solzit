import {Animated,Image,SafeAreaView,StyleSheet,Text,Pressable,View,TouchableOpacity,useColorScheme,PanResponder,} from 'react-native';
import {Icon, IconButton} from 'react-native-paper';
import {useDispatch, useSelector} from 'react-redux';
import {Colors} from '../constants/Colors';
import Dashboard from '../Screens/Dashboard/Dashboard';
import {auth, isDarkTheme, theme} from '../AppStore/Reducers/appState';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useEffect, useRef, useState} from 'react';
import {SCREEN_WIDTH} from '../constants/Screen';
import React from 'react';

const DrawerNavigator = ({navigation}: any) => {
  const dispatch = useDispatch();
  const isDark = useSelector(isDarkTheme);
  const colorScheme = useColorScheme();
  const [isSwitchOn, setIsSwitchOn] = useState(isDark);
  const userData = useSelector((state: any) => state?.appState?.authToken);
  const [showMenu, setShowMenu] = useState(false);
  const offsetValue = useRef(new Animated.Value(0)).current;
  const scaleValue = useRef(new Animated.Value(1)).current;
  const closeButtonOffset = useRef(new Animated.Value(0)).current;
  
  const [Loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTheme = async () => {
      const storedTheme = await AsyncStorage.getItem('theme');
      if (storedTheme) {
        const themeValue = storedTheme === 'dark';
        setIsSwitchOn(themeValue);
        dispatch(theme(storedTheme));
      } else {
        const initialTheme = colorScheme === 'dark' ? 'dark' : 'light';
        setIsSwitchOn(initialTheme === 'dark');
        dispatch(theme(initialTheme));
      }
      setLoading(false);
    };
    loadTheme();
  }, [dispatch, colorScheme]);


  const toggleMenu = () => {
    const newShowMenu = !showMenu;
    Animated.timing(scaleValue, {
      toValue: newShowMenu ? 0.9 : 1,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setShowMenu(newShowMenu);
    });

    Animated.timing(offsetValue, {
      toValue: newShowMenu ? 230 : 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setShowMenu(newShowMenu);
    });
  };

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: () => true,
    onPanResponderMove: (evt, gestureState) => {
      if (gestureState.dx > 0 && gestureState.x0 < SCREEN_WIDTH * 0.1) {
        setShowMenu(true);
        Animated.timing(scaleValue, {
          toValue: 0.9,
          duration: 300,
          useNativeDriver: true,
        }).start();
        Animated.timing(offsetValue, {
          toValue: 230,
          duration: 300,
          useNativeDriver: true,
        }).start();
      } else if (gestureState.dx < 0) {
        setShowMenu(false);
        Animated.timing(scaleValue, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }).start();
        Animated.timing(offsetValue, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }).start();
      }
    },
  });
  
  if (Loading) {
    return null;
  }

  return (
    <SafeAreaView style={styles(isDark).container}>
      <View style={styles(isDark).drawerContainer}>
        <Image
          source={require('../Assets/Images/Logo/solzitLogo.png')}
          style={styles(isDark).logo}
        />
        <View style={{width: '55%'}}>
          <Text style={styles(isDark).UserName}>
            {userData?.userProfile?.fullName
              ? userData?.userProfile?.fullName
              : 'Guest'}
          </Text>
        </View>

        <View style={styles(isDark).drawerBtnContainer}>
          <Pressable
            onPressIn={() => {
              navigation.navigate('Profile');
            }}
            onPress={() => {
              toggleMenu();
            }}
            style={styles(isDark).drawerBtn}>
            <Icon
              source="account"
              color={isDark ? Colors.white : Colors.primary}
              size={20}
            />
            <Text style={styles(isDark).drawerBtnTxt}>Profile</Text>
          </Pressable>
          <Pressable
            onPressIn={() => {
              navigation.navigate('SoluzioneDirectory');
            }}
            onPress={() => {
              toggleMenu();
            }}
            style={styles(isDark).drawerBtn}>
            <Icon
              source="book-open-page-variant"
              color={isDark ? Colors.white : Colors.primary}
              size={20}
            />
            <Text style={styles(isDark).drawerBtnTxt}>Soluzione Directory</Text>
          </Pressable>

          <Pressable
            onPressIn={() => {
              navigation.navigate('ApplyLeave');
            }}
            onPress={() => {
              toggleMenu();
            }}
            style={[styles(isDark).drawerBtn, ]}>
            <Icon
              source="calendar-clock"
              color={isDark ? Colors.white : Colors.primary}
              size={20}
            />
            <Text style={styles(isDark).drawerBtnTxt}>Apply Leave</Text>
          </Pressable>

          <Pressable
            onPressIn={() => {
              navigation.navigate('LeaveRequest');
            }}
            onPress={() => {
              toggleMenu();
            }}
            style={[styles(isDark).drawerBtn, ]}>
            <Icon
              source="airplane"
              color={isDark ? Colors.white : Colors.primary}
              size={20}
            />
            <Text style={styles(isDark).drawerBtnTxt}>My Leave Requests</Text>
          </Pressable>

          <Pressable
            onPressIn={() => {
              navigation.navigate('LeaveBalance');
            }}
            onPress={() => {
              toggleMenu();
            }}
            style={styles(isDark).drawerBtn}>
            <Icon
              source="card-account-details"
              color={isDark ? Colors.white : Colors.primary}
              size={20}
            />
            <Text style={styles(isDark).drawerBtnTxt}>Processed Leaves</Text>
          </Pressable>

          <Pressable
            onPressIn={() => {
              navigation.navigate('Attandance');
            }}
            onPress={() => {
              toggleMenu();
            }}
            style={[styles(isDark).drawerBtn, ]}>
            <Icon
              source="account"
              color={isDark ? Colors.white : Colors.primary}
              size={20}
            />
            <Text style={styles(isDark).drawerBtnTxt}>Attendance</Text>
          </Pressable>

          <Pressable
            onPressIn={() => {
              navigation.navigate('OpenPositions');
            }}
            onPress={() => {
              toggleMenu();
            }}
            style={[styles(isDark).drawerBtn, ]}>
            <Icon
              source="account-group-outline"
              color={isDark ? Colors.white : Colors.primary}
              size={20}
            />
            <Text style={styles(isDark).drawerBtnTxt}>Open Positions</Text>
          </Pressable>

          <Pressable
            onPressIn={() => {
              navigation.navigate('MyReferences');
            }}
            onPress={() => {
              toggleMenu();
            }}
            style={[styles(isDark).drawerBtn, ]}>
            <Icon
              source="account-group"
              color={isDark ? Colors.white : Colors.primary}
              size={20}
            />
            <Text style={styles(isDark).drawerBtnTxt}>My References</Text>
          </Pressable>
          
          <Pressable
            onPressIn={() => {
              navigation.navigate('Feedback');
            }}
            onPress={() => {
              toggleMenu();
            }}
            style={[styles(isDark).drawerBtn, ]}>
            <Icon
              source="chat-processing"
              color={isDark ? Colors.white : Colors.primary}
              size={20}
            />
            <Text style={styles(isDark).drawerBtnTxt}>Feedback</Text>
          </Pressable>

          <TouchableOpacity
            onPress={() => {
              dispatch(auth(undefined));
            }}
            style={[styles(isDark).drawerBtn]}>
            <Icon
              source="logout"
              color={isDark ? Colors.white : Colors.primary}
              size={20}
            />
            <Text style={styles(isDark).drawerBtnTxt}>Logout</Text>
          </TouchableOpacity>

         
        </View>
      </View>

      <Animated.View
        //  {...panResponder.panHandlers}
        style={[
          styles(isDark).screenHeaderContainer,
          {
            transform: [{scale: scaleValue}, {translateX: offsetValue}],
          },
        ]}>
        <Animated.View
          style={{
            transform: [
              {
                translateY: closeButtonOffset,
              },
            ],
          }}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <View style={styles(isDark).screenHeader}>
              {/* <Pressable onPress={toggleMenu}> */}
                {showMenu ? (
                  <IconButton
                    icon="close"
                    iconColor={isDark ? Colors.white : Colors.black}
                    size={25}
                    onPress={toggleMenu}
                    accessibilityLabel='close'
                  />
                ) : (
                  <IconButton
                    icon="menu"
                    iconColor={isDark ? Colors.white : Colors.black}
                    size={25}
                    onPress={toggleMenu}
                    accessibilityLabel='menu'
                  />
                )}
              {/* </Pressable> */}
              <Text style={styles(isDark).headerTxt}>Soluzione</Text>
            </View>
            {/* <View style={{position: 'absolute', right: 10}}>
              <Image
                source={require('../Assets/Images/Logo/solzitLogo.png')}
                style={{width: 30, height: 30, borderRadius: 10}}
              />
            </View> */}
          </View>
        </Animated.View>
        <Dashboard />
      </Animated.View>
    </SafeAreaView>
  );
};

const styles = (isDark: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: isDark ? Colors.black : Colors.white,
      alignItems: 'flex-start',
      justifyContent: 'flex-start',
    },
    drawerContainer: {justifyContent: 'flex-start', padding: 15},
    logo: {
      width: 90,
      height: 90,
      borderRadius: 10,
      marginTop: 8,
    },
    UserName: {
      fontSize: 18,
      color: isDark ? Colors.white : Colors.black,
      marginTop: 16,
      fontFamily: 'Lato-Bold',
    },
    drawerBtnContainer: {flexGrow: 1, marginVertical: 60},
    drawerBtn: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: 'transparent',
      paddingLeft: 13,
      borderRadius: 8,
      minHeight: 36,
    },
    drawerBtnTxt: {
      marginLeft: 15,
      color: isDark ? Colors.white : Colors.black,
      flexWrap: 'wrap',
      flex: 1,
      width: 'auto',
      fontFamily: 'Lato-Semibold',
    },
    screenHeaderContainer: {
      flexGrow: 1,
      backgroundColor: isDark ? Colors.black : Colors.white,
      position: 'absolute',
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
    },
    screenHeader: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    headerIcons: {
      width: 20,
      height: 20,
      tintColor: isDark ? Colors.white : Colors.black,
      marginHorizontal: 16,
    },
    headerTxt: {
      fontSize: 18,
      color: isDark ? Colors.white : Colors.black,
      fontFamily: 'Lato-Semibold',
    },
  });

export default DrawerNavigator;
