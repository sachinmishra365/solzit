import React, {useRef, useState} from 'react';
import {
  Animated,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  Pressable,
  View,
} from 'react-native';
import {Icon} from 'react-native-paper';
import {useDispatch, useSelector} from 'react-redux';
import {Colors} from '../constants/Colors';
import Dashboard from '../Screens/Dashboard/Dashboard';
import {auth} from '../AppStore/Reducers/appState';

const DrawerNavigator = ({navigation}: any) => {
  const dispatch = useDispatch();
  const userData = useSelector((state: any) => state?.appState?.authToken);
  const [showMenu, setShowMenu] = useState(false);

  const offsetValue = useRef(new Animated.Value(0)).current;
  const scaleValue = useRef(new Animated.Value(1)).current;
  const closeButtonOffset = useRef(new Animated.Value(0)).current;

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

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.drawerContainer}>
        <Image
          source={require('../Assets/Images/Logo/solzitLogo.png')}
          style={styles.logo}
        />

        <Text style={styles.driverName}>
          {userData?.data?.Data?.fullName ? userData?.data?.Data?.fullName : 'Guest'}
        </Text>

        <View style={styles.drawerBtnContainer}>
          <Pressable
            onPressIn={() => {
              navigation.navigate('Profile');
            }}
            onPress={() => {
              toggleMenu();
            }}
            style={styles.drawerBtn}>
            <Icon
              source="account"
              color={Colors.white}
              size={20}
            />
            <Text style={styles.drawerBtnTxt}>Profile</Text>
          </Pressable>

          <Pressable
            onPressIn={() => {
              navigation.navigate('ApplyLeave');
            }}
            onPress={() => {
              toggleMenu();
            }}
            style={[styles.drawerBtn, {marginTop: 16}]}>
            <Icon
              source="calendar-clock"
              color={Colors.white}
              size={20}
            />
            <Text style={styles.drawerBtnTxt}>Apply Leave</Text>
          </Pressable>

          <Pressable
            onPressIn={() => {
              navigation.navigate('LeaveRequest');
            }}
            onPress={() => {
              toggleMenu();
            }}
            style={[styles.drawerBtn, {marginVertical: 16}]}>
            <Icon source="airplane" color={Colors.white} size={20} />
            <Text style={styles.drawerBtnTxt}>My Leave Requests</Text>
          </Pressable>

          <Pressable
            onPressIn={() => {
              navigation.navigate('LeaveBalance');
            }}
            onPress={() => {
              toggleMenu();
            }}
            style={styles.drawerBtn}>
            <Icon
              source="card-account-details"
              color={Colors.white}
              size={20}
            />
            <Text style={styles.drawerBtnTxt}>Processed Leave</Text>
          </Pressable>

          <Pressable
            onPress={() => {
              dispatch(auth(null));
            }}
            style={[styles.drawerBtn, {marginVertical: 16}]}>
            <Icon source="logout" color={Colors.white} size={20} />
            <Text style={styles.drawerBtnTxt}>LogOut</Text>
          </Pressable>
        </View>
      </View>

      <Animated.View
        // {...panResponder.panHandlers}
        style={[
          styles.screenHeaderContainer,
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
          <View style={styles.screenHeader}>
            <Pressable onPress={toggleMenu}>
              <Image
                source={
                  showMenu
                    ? require('../Assets/Images/close.png')
                    : require('../Assets/Images/menu.png')
                }
                style={styles.headerIcons}
              />
            </Pressable>
            <Text style={styles.headerTxt}>Soluzione</Text>
          </View>
        </Animated.View>
        <Dashboard />
      </Animated.View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.black,
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },
  drawerContainer: {justifyContent: 'flex-start', padding: 15},
  logo: {
    width: 60,
    height: 60,
    borderRadius: 10,
    marginTop: 8,
  },
  driverName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.white,
    marginTop: 16,
  },
  drawerBtnContainer: {flexGrow: 1, marginVertical: 60},
  drawerBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'transparent',
    paddingLeft: 13,
    paddingRight: 35,
    borderRadius: 8,
  },
  drawerBtnTxt: {
    // fontSize: 14,
    // fontFamily: 'Poppins-Regular',
    paddingLeft: 15,
    color: Colors.white,
  },
  screenHeaderContainer: {
    flexGrow: 1,
    backgroundColor: Colors.black,
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
  screenHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  headerIcons: {
    width: 20,
    height: 20,
    tintColor: Colors.white,
    marginHorizontal: 16,
  },
  headerTxt: {
    fontFamily: 'Poppins-Medium',
    fontSize: 18,
    color: Colors.white,
  },
});

export default DrawerNavigator;
