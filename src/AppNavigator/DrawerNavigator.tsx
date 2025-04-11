import { Animated, Image, SafeAreaView, StyleSheet, Text, Pressable, View, TouchableOpacity, useColorScheme, PanResponder, ScrollView, } from 'react-native';
import { Icon, IconButton, List } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { Colors } from '../constants/Colors';
import Dashboard from '../Screens/Dashboard/Dashboard';
import { auth, isDarkTheme, theme } from '../AppStore/Reducers/appState';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useRef, useState } from 'react';
import { SCREEN_WIDTH } from '../constants/Screen';
import React from 'react';

const DrawerNavigator = ({ navigation }: any) => {
  const dispatch = useDispatch();
  const isDark = useSelector(isDarkTheme);
  const colorScheme = useColorScheme();
  const [isSwitchOn, setIsSwitchOn] = useState(isDark);
  const userData = useSelector((state: any) => state?.appState?.authToken);
  const [showMenu, setShowMenu] = useState(false);
  const offsetValue = useRef(new Animated.Value(0)).current;
  const scaleValue = useRef(new Animated.Value(1)).current;
  const closeButtonOffset = useRef(new Animated.Value(0)).current;
  const [expanded, setExpanded] = React.useState(true);

  const handlePress = () => setExpanded(!expanded);
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
      toValue: newShowMenu ? 280 : 0,
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
        <View style={{ width: '55%' }}>
          <Text style={styles(isDark).UserName}>
            {userData?.userProfile?.fullName
              ? userData?.userProfile?.fullName
              : 'Guest'}
          </Text>
        </View>

        <ScrollView style={styles(isDark).drawerBtnContainer} showsVerticalScrollIndicator={false}>
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
              size={23}
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
              size={23}
            />
            <Text style={styles(isDark).drawerBtnTxt}>Soluzione Directory</Text>
          </Pressable>

          <List.Section style={{ marginLeft: -5, marginTop: -10 }}>
            <List.Accordion
              style={{ backgroundColor: isDark ? Colors.black : Colors.white }}
              title="My Work"
              titleStyle={{ color: isDark ? Colors.white : Colors.black, fontFamily: 'Lato-Semibold' }}
              left={props => <List.Icon {...props} icon="folder" color={isDark ? Colors.white : Colors.primary} />}
              right={props => (<List.Icon{...props} icon="chevron-down" color={isDark ? Colors.white : Colors.black} />)}>

              <Pressable
                onPressIn={() => { navigation.navigate('Worklog') }}
                onPress={() => { toggleMenu() }}>
                <List.Item
                  title="My To-Dos" left={props => <List.Icon {...props} icon="plus-box-multiple" color={isDark ? Colors.white : Colors.primary} />}
                  titleStyle={{ color: isDark ? Colors.white : Colors.black, fontFamily: 'Lato-Semibold' }}
                  style={{ marginLeft: -20, marginTop: -10 }} />
              </Pressable>

              <Pressable
                onPressIn={() => { navigation.navigate('PlanMyDay') }}
                onPress={() => { toggleMenu() }}>
                <List.Item
                  title="Plan My Day"
                  left={props => <List.Icon {...props} icon="note" color={isDark ? Colors.white : Colors.primary} />}
                  titleStyle={{ color: isDark ? Colors.white : Colors.black, fontFamily: 'Lato-Semibold' }}
                  style={{ marginLeft: -20, marginTop: -10 }} />
              </Pressable>

              <Pressable
                onPressIn={() => { navigation.navigate('MyPlans') }}
                onPress={() => { toggleMenu() }}>
                <List.Item
                  title="My Plans"
                  left={props => <List.Icon {...props} icon="note" color={isDark ? Colors.white : Colors.primary} />}
                  titleStyle={{ color: isDark ? Colors.white : Colors.black, fontFamily: 'Lato-Semibold' }}
                  style={{ marginLeft: -20, marginTop: -10 }} />
              </Pressable>

              <Pressable
                onPressIn={() => { navigation.navigate('ProjectAllocation') }}
                onPress={() => { toggleMenu() }}>
                <List.Item title="My Projects"
                  left={props => <List.Icon {...props} icon="folder-open" color={isDark ? Colors.white : Colors.primary} />}
                  titleStyle={{ color: isDark ? Colors.white : Colors.black, fontFamily: 'Lato-Semibold' }}
                  style={{ marginLeft: -20, marginTop: -10 }} />
              </Pressable>

            </List.Accordion>
          </List.Section>

          <List.Section style={{ marginLeft: -5, marginTop: -20 }}>
            <List.Accordion
              style={{ backgroundColor: isDark ? Colors.black : Colors.white }}
              title="Leaves & Breaks"
              titleStyle={{ color: isDark ? Colors.white : Colors.black, fontFamily: 'Lato-Semibold' }}
              left={props => <List.Icon {...props} icon="airplane" color={isDark ? Colors.white : Colors.primary} />}
              right={props => (<List.Icon{...props} icon="chevron-down" color={isDark ? Colors.white : Colors.black} />)}>


              <Pressable
                onPressIn={() => { navigation.navigate('ApplyLeave') }}
                onPress={() => { toggleMenu() }}>
                <List.Item
                  title="Apply Leave" left={props => <List.Icon {...props} icon="calendar" color={isDark ? Colors.white : Colors.primary} />}
                  titleStyle={{ color: isDark ? Colors.white : Colors.black, fontFamily: 'Lato-Semibold' }}
                  style={{ marginLeft: -20, marginTop: -10 }} />
              </Pressable>

              <Pressable
                onPressIn={() => { navigation.navigate('LeaveRequest') }}
                onPress={() => { toggleMenu() }}>
                <List.Item
                  title="Leave Requests" left={props => <List.Icon {...props} icon="account-box" color={isDark ? Colors.white : Colors.primary} />}
                  titleStyle={{ color: isDark ? Colors.white : Colors.black, fontFamily: 'Lato-Semibold' }}
                  style={{ marginLeft: -20, marginTop: -10 }} />
              </Pressable>

              <Pressable
                onPressIn={() => { navigation.navigate('LeaveBalance') }}
                onPress={() => { toggleMenu() }}>
                <List.Item
                  title="Leave Balance"
                  left={props => <List.Icon {...props} icon="chart-bar" color={isDark ? Colors.white : Colors.primary} />}
                  titleStyle={{ color: isDark ? Colors.white : Colors.black, fontFamily: 'Lato-Semibold' }}
                  style={{ marginLeft: -20, marginTop: -10 }} />
              </Pressable>

              <Pressable
                onPressIn={() => { navigation.navigate('LateArrivalTime') }}
                onPress={() => { toggleMenu() }}>
                <List.Item
                  title="Late Arrival Time"
                  left={props => <List.Icon {...props} icon="clock" color={isDark ? Colors.white : Colors.primary} />}
                  titleStyle={{ color: isDark ? Colors.white : Colors.black, fontFamily: 'Lato-Semibold' }}
                  style={{ marginLeft: -20, marginTop: -10 }} />
              </Pressable>

              {/* <Pressable
                onPressIn={() => { navigation.navigate('ProjectAllocation') }}
                onPress={() => { toggleMenu() }}>
                <List.Item title="Breakes"
                  left={props => <List.Icon {...props} icon="silverware-fork-knife" color={isDark ? Colors.white : Colors.primary} />}
                  titleStyle={{ color: isDark ? Colors.white : Colors.black, fontFamily: 'Lato-Semibold' }} 
                  style={{ marginLeft: -20 ,marginTop:-10}}/>
              </Pressable> */}

            </List.Accordion>

          </List.Section>

          <List.Section style={{ marginLeft: -5, marginTop: -20 }}>
            <List.Accordion
              style={{ backgroundColor: isDark ? Colors.black : Colors.white }}
              title="Hiring Recuirtment"
              titleStyle={{ color: isDark ? Colors.white : Colors.black, fontFamily: 'Lato-Semibold' }}
              left={props => <List.Icon {...props} icon="account-group" color={isDark ? Colors.white : Colors.primary} />}
              right={props => (<List.Icon{...props} icon="chevron-down" color={isDark ? Colors.white : Colors.black}/>)}>


              <Pressable
                onPressIn={() => { navigation.navigate('OpenPositions') }}
                onPress={() => { toggleMenu() }}>
                <List.Item
                  title="Apply Leave" left={props => <List.Icon {...props} icon="account-group" color={isDark ? Colors.white : Colors.primary} />}
                  titleStyle={{ color: isDark ? Colors.white : Colors.black, fontFamily: 'Lato-Semibold' }}
                  style={{ marginLeft: -20, marginTop: -10 }} />
              </Pressable>

              <Pressable
                onPressIn={() => { navigation.navigate('MyReferences') }}
                onPress={() => { toggleMenu() }}>
                <List.Item
                  title="Leave Requests" left={props => <List.Icon {...props} icon="account-group" color={isDark ? Colors.white : Colors.primary} />}
                  titleStyle={{ color: isDark ? Colors.white : Colors.black, fontFamily: 'Lato-Semibold' }}
                  style={{ marginLeft: -20, marginTop: -10 }} />
              </Pressable>

            </List.Accordion>

          </List.Section>

          <Pressable
            onPressIn={() => {
              navigation.navigate('WorkFromHome');
            }}
            onPress={() => {
              toggleMenu();
            }}
            style={styles(isDark).drawerBtn}>
            <Icon
              source="monitor"
              color={isDark ? Colors.white : Colors.primary}
              size={23}
            />
            <Text style={styles(isDark).drawerBtnTxt}>Work From Home</Text>
          </Pressable>

          <Pressable
            onPressIn={() => {
              navigation.navigate('Attandance');
            }}
            onPress={() => {
              toggleMenu();
            }}
            style={[styles(isDark).drawerBtn,]}>
            <Icon
              source="account"
              color={isDark ? Colors.white : Colors.primary}
              size={23}
            />
            <Text style={styles(isDark).drawerBtnTxt}>Attendance</Text>
          </Pressable>

          <Pressable
            onPressIn={() => {
              navigation.navigate('Feedback');
            }}
            onPress={() => {
              toggleMenu();
            }}
            style={[styles(isDark).drawerBtn,]}>
            <Icon
              source="chat-processing"
              color={isDark ? Colors.white : Colors.primary}
              size={23}
            />
            <Text style={styles(isDark).drawerBtnTxt}>Feedback</Text>
          </Pressable>
        </ScrollView>
      </View>

      <Animated.View
        //  {...panResponder.panHandlers}
        style={[
          styles(isDark).screenHeaderContainer,
          {
            transform: [{ scale: scaleValue }, { translateX: offsetValue }],
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
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
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
    drawerContainer: { justifyContent: 'flex-start', padding: 15 },
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
    drawerBtnContainer: { flexGrow: 1, marginVertical: 50,},
    drawerBtn: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: 'transparent',
      paddingLeft: 13,
      borderRadius: 8,
      minHeight: 45,
    },
    drawerBtnTxt: {
      marginLeft: 15,
      color: isDark ? Colors.white : Colors.black,
      flexWrap: 'wrap',
      // flex: 1,
      width: 'auto',
      fontFamily: 'Lato-Semibold',
      fontSize: 16,

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
