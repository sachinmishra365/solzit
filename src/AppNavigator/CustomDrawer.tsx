
import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Pressable, ScrollView } from 'react-native';
import { DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import { Colors } from '../constants/Colors';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { Icon, IconButton, List } from 'react-native-paper';
import { useSelector } from 'react-redux';
import { isDarkTheme } from '../AppStore/Reducers/appState';

type RootDrawerParamList = {
    Notifications: undefined;
    SoluzioneDirectory: undefined;
    Attandance: undefined;
    Worklog: undefined;
    PlanMyDay: undefined;
    MyPlans: undefined;
    ProjectAllocation: undefined;
    ApplyLeave: undefined;
    LeaveRequest: undefined;
    LeaveBalance: undefined;
    LateArrivalTime: undefined;
    Breakes: undefined;
    OpenPositions: undefined;
    MyReferences: undefined;
    WorkFromHome: undefined;
    Feedback: undefined;
    Profile: undefined;
   
};

export default function CustomDrawer(props: any) {
    const navigation = useNavigation<NavigationProp<RootDrawerParamList>>()
    const isDark = useSelector(isDarkTheme);

    const [expandedId, setExpandedId] = useState(null);
    const EmployeeId = useSelector((state: any) => state?.appState?.authToken);
    const userData = useSelector((state: any) => state?.appState?.authToken);

    const Profiledata = EmployeeId?.userProfile;
    const base64Image = `data:image/jpeg;base64,${Profiledata?.employeeImg}`;

    const [imageAsset, setImageAsset] = useState<any>(null);
    const handlePress = (id: any) => {
        setExpandedId(prev => (prev === id ? null : id));
    };

    return (
      <DrawerContentScrollView {...props} contentContainerStyle={{flex: 1}}>
        <TouchableOpacity
          style={styles(isDark).containerRow}
          activeOpacity={0.8}
          onPress={() => {
            navigation.navigate('Profile');
            props.navigation.closeDrawer();
          }}>
          <Image
            style={styles(isDark).logo}
            source={
              Profiledata?.employeeImg
                ? {
                    uri: imageAsset?.data
                      ? `data:image/jpeg;base64,${imageAsset?.data}`
                      : base64Image,
                  }
                : require('../Assets/Images/profile.png')
            }
          />

          <View style={styles(isDark).userCol}>
            <Text style={styles(isDark).UserName}>
              {userData?.userProfile?.fullName || 'Guest'}
            </Text>
            <Text style={styles(isDark).UserEmail}>
              {userData?.userProfile?.email || 'GuestEmail'}
            </Text>
          </View>

          <View style={{ marginTop:25,}}>
            <IconButton
            icon="chevron-right"
            size={30}
            iconColor={Colors.white}
            style={styles(isDark).editIcon}
          />
          </View>
        </TouchableOpacity>

        <ScrollView
          style={styles(isDark).drawerBtnContainer}
          showsVerticalScrollIndicator={false}>
          <Pressable
            android_ripple={{color: 'rgba(0,0,0,0.1)'}}
            onPressIn={() => {
              navigation.navigate('SoluzioneDirectory');
            }}
            onPress={() => props.navigation.closeDrawer()}
            style={styles(isDark).drawerBtn}>
            <Icon
              source="book-open-page-variant"
              color={isDark ? Colors.white : Colors.white}
              size={23}
            />
            <Text style={styles(isDark).drawerBtnTxt}>Soluzione Directory</Text>
          </Pressable>

          <Pressable
            android_ripple={{color: 'rgba(0,0,0,0.1)'}}
            onPressIn={() => {
              navigation.navigate('Attandance');
            }}
            onPress={() => props.navigation.closeDrawer()}
            style={[styles(isDark).drawerBtn]}>
            <Icon
              source="account"
              color={isDark ? Colors.white : Colors.white}
              size={23}
            />
            <Text style={styles(isDark).drawerBtnTxt}>Attendance</Text>
          </Pressable>

          <List.Accordion
            style={{
              backgroundColor: isDark ? Colors.black : Colors.primary,
              width: '102%',
              marginLeft: -5,
              borderWidth: 0,
              borderColor: isDark ? Colors.black : Colors.primary,
              
            }}
            title="My Work"
            titleStyle={{
              color: isDark ? Colors.white : Colors.white,
              fontFamily: 'Lato-Semibold',
            }}
            left={props => (
              <List.Icon {...props} icon="folder" color={Colors.white} />
            )}
            right={props => (
              <List.Icon
                {...props}
                icon={expandedId === 'work' ? 'chevron-down' : 'chevron-left'}
                color={isDark ? Colors.white : Colors.white}
              />
            )}
            expanded={expandedId === 'work'}
            onPress={() => handlePress('work')}
            rippleColor={'rgba(0,0,0,0.1)'}>
            <List.Item
              title="My To-Dos"
              left={props => (
                <List.Icon
                  {...props}
                  icon="plus-box-multiple"
                  color={isDark ? Colors.white : Colors.white}
                />
              )}
              titleStyle={{
                color: isDark ? Colors.white : Colors.white,
                fontFamily: 'Lato-Semibold',
              }}
              style={{
                marginLeft: 20,
                marginTop: -10,
                borderWidth: 0,
                borderColor: isDark ? Colors.black : Colors.primary,
              }}
              onPressIn={() => {
                navigation.navigate('Worklog');
              }}
              onPress={() => props.navigation.closeDrawer()}
            />

            <List.Item
              title="Plan My Day"
              left={props => (
                <List.Icon
                  {...props}
                  icon="note"
                  color={isDark ? Colors.white : Colors.white}
                />
              )}
              titleStyle={{
                color: isDark ? Colors.white : Colors.white,
                fontFamily: 'Lato-Semibold',
              }}
              style={{
                marginLeft: 20,
                marginTop: -10,
                borderWidth: 0,
                borderColor: isDark ? Colors.black : Colors.primary,
              }}
              onPressIn={() => {
                navigation.navigate('PlanMyDay');
              }}
              onPress={() => props.navigation.closeDrawer()}
            />

            <List.Item
              title="My Plans"
              left={props => (
                <List.Icon
                  {...props}
                  icon="note"
                  color={isDark ? Colors.white : Colors.white}
                />
              )}
              titleStyle={{
                color: isDark ? Colors.white : Colors.white,
                fontFamily: 'Lato-Semibold',
              }}
              style={{
                marginLeft: 20,
                marginTop: -10,
                borderWidth: 0,
                borderColor: isDark ? Colors.black : Colors.primary,
              }}
              onPressIn={() => {
                navigation.navigate('MyPlans');
              }}
              onPress={() => props.navigation.closeDrawer()}
            />

            <List.Item
              title="My Projects"
              left={props => (
                <List.Icon
                  {...props}
                  icon="folder-open"
                  color={isDark ? Colors.white : Colors.white}
                />
              )}
              titleStyle={{
                color: isDark ? Colors.white : Colors.white,
                fontFamily: 'Lato-Semibold',
              }}
              style={{
                marginLeft: 20,
                marginTop: -10,
                borderWidth: 0,
                borderColor: isDark ? Colors.black : Colors.primary,
              }}
              onPressIn={() => {
                navigation.navigate('ProjectAllocation');
              }}
              onPress={() => props.navigation.closeDrawer()}
            />
          </List.Accordion>

          <List.Accordion
            style={{
              backgroundColor: isDark ? Colors.black : Colors.primary,
              width: '102%',
              marginLeft: -5,
              borderWidth: 0,
              borderColor: isDark ? Colors.black : Colors.primary,
            }}
            title="Leaves & Breaks"
            titleNumberOfLines={2}
            titleStyle={{
              color: isDark ? Colors.white : Colors.white,
              fontFamily: 'Lato-Semibold',
            }}
            left={props => (
              <List.Icon
                {...props}
                icon="airplane"
                color={isDark ? Colors.white : Colors.white}
              />
            )}
            right={props => (
              <List.Icon
                {...props}
                icon={expandedId === 'leave' ? 'chevron-down' : 'chevron-left'}
                color={isDark ? Colors.white : Colors.white}
              />
            )}
            expanded={expandedId === 'leave'}
            onPress={() => handlePress('leave')}
            rippleColor={'rgba(0,0,0,0.1)'}>
            <List.Item
              title="Apply Leave"
              left={props => (
                <List.Icon
                  {...props}
                  icon="calendar"
                  color={isDark ? Colors.white : Colors.white}
                />
              )}
              titleStyle={{
                color: isDark ? Colors.white : Colors.white,
                fontFamily: 'Lato-Semibold',
              }}
              style={{
                marginLeft: 20,
                marginTop: -10,
                borderWidth: 0,
                borderColor: isDark ? Colors.black : Colors.primary,
              }}
              onPressIn={() => {
                navigation.navigate('ApplyLeave');
              }}
              onPress={() => props.navigation.closeDrawer()}
            />

            <List.Item
              title="Leave Requests"
              left={props => (
                <List.Icon
                  {...props}
                  icon="account-box"
                  color={isDark ? Colors.white : Colors.white}
                />
              )}
              titleStyle={{
                color: isDark ? Colors.white : Colors.white,
                fontFamily: 'Lato-Semibold',
              }}
              style={{
                marginLeft: 20,
                marginTop: -10,
                borderWidth: 0,
                borderColor: isDark ? Colors.black : Colors.primary,
              }}
              onPressIn={() => {
                navigation.navigate('LeaveRequest');
              }}
              onPress={() => props.navigation.closeDrawer()}
            />

            <List.Item
              title="Processed Leaves"
              left={props => (
                <List.Icon
                  {...props}
                  icon="chart-bar"
                  color={isDark ? Colors.white : Colors.white}
                />
              )}
              titleStyle={{
                color: isDark ? Colors.white : Colors.white,
                fontFamily: 'Lato-Semibold',
              }}
              style={{
                marginLeft: 20,
                marginTop: -10,
                borderWidth: 0,
                borderColor: isDark ? Colors.black : Colors.primary,
              }}
              onPressIn={() => {
                navigation.navigate('LeaveBalance');
              }}
              onPress={() => props.navigation.closeDrawer()}
            />

            <List.Item
              title="Late Arrival Time"
              left={props => (
                <List.Icon
                  {...props}
                  icon="clock"
                  color={isDark ? Colors.white : Colors.white}
                />
              )}
              titleStyle={{
                color: isDark ? Colors.white : Colors.white,
                fontFamily: 'Lato-Semibold',
              }}
              style={{
                marginLeft: 20,
                marginTop: -10,
                borderWidth: 0,
                borderColor: isDark ? Colors.black : Colors.primary,
              }}
              onPressIn={() => {
                navigation.navigate('LateArrivalTime');
              }}
              onPress={() => props.navigation.closeDrawer()}
            />

            <List.Item
              title="Breakes"
              left={props => (
                <List.Icon
                  {...props}
                  icon="silverware-fork-knife"
                  color={isDark ? Colors.white : Colors.white}
                />
              )}
              titleStyle={{
                color: isDark ? Colors.white : Colors.white,
                fontFamily: 'Lato-Semibold',
              }}
              style={{
                marginLeft: 20,
                marginTop: -10,
                borderWidth: 0,
                borderColor: isDark ? Colors.black : Colors.primary,
              }}
              onPressIn={() => {
                navigation.navigate('Breakes');
              }}
              onPress={() => props.navigation.closeDrawer()}
            />
          </List.Accordion>

          <List.Accordion
            style={{
              backgroundColor: isDark ? Colors.black : Colors.primary,
              width: '102%',
              marginLeft: -5,
              borderWidth: 0,
              borderColor: isDark ? Colors.black : Colors.primary,
            }}
            title="Hiring Recuirtment"
            titleNumberOfLines={2}
            titleStyle={{
              color: isDark ? Colors.white : Colors.white,
              fontFamily: 'Lato-Semibold',
            }}
            left={props => (
              <List.Icon
                {...props}
                icon="account-group"
                color={isDark ? Colors.white : Colors.white}
              />
            )}
            right={props => (
              <List.Icon
                {...props}
                icon={expandedId === 'hiring' ? 'chevron-down' : 'chevron-left'}
                color={isDark ? Colors.white : Colors.white}
              />
            )}
            expanded={expandedId === 'hiring'}
            onPress={() => handlePress('hiring')}
            rippleColor={'rgba(0,0,0,0.1)'}>
            <List.Item
              title="Open Positions"
              left={props => (
                <List.Icon
                  {...props}
                  icon="account-group"
                  color={isDark ? Colors.white : Colors.white}
                />
              )}
              titleStyle={{
                color: isDark ? Colors.white : Colors.white,
                fontFamily: 'Lato-Semibold',
              }}
              style={{
                marginLeft: 20,
                marginTop: -10,
                borderWidth: 0,
                borderColor: isDark ? Colors.black : Colors.primary,
              }}
              onPressIn={() => {
                navigation.navigate('OpenPositions');
              }}
              onPress={() => props.navigation.closeDrawer()}
            />

            <List.Item
              title="My References"
              left={props => (
                <List.Icon
                  {...props}
                  icon="account-group"
                  color={isDark ? Colors.white : Colors.white}
                />
              )}
              titleStyle={{
                color: isDark ? Colors.white : Colors.white,
                fontFamily: 'Lato-Semibold',
              }}
              style={{
                marginLeft: 20,
                marginTop: -10,
                borderWidth: 0,
                borderColor: isDark ? Colors.black : Colors.primary,
              }}
              onPressIn={() => {
                navigation.navigate('MyReferences');
              }}
            />
          </List.Accordion>

          {/* {Profiledata?.isManager &&
            <List.Accordion
              style={{
                backgroundColor: isDark ? Colors.black : Colors.white,
                width: '    102%',
                marginLeft: -5,
              }}
              title="Worklog Approval"
              titleNumberOfLines={2}
              titleStyle={{
                color: isDark ? Colors.white : Colors.black,
                fontFamily: 'Lato-Semibold',
              }}
              left={props => (
                <List.Icon
                  {...props}
                  icon="account-group"
                  color={isDark ? Colors.white : Colors.primary}
                />
              )}
              right={props => (
                <List.Icon
                  {...props}
                  icon={expandedId === 'Worklog Approval' ? 'chevron-down' : 'chevron-left'}
                  color={isDark ? Colors.white : Colors.black}
                />
              )}
              expanded={expandedId === 'Worklog Approval'}
              onPress={() => handlePress('Worklog Approval')}
              rippleColor={'rgba(0,0,0,0.1)'}>

              <List.Item
                title="EMP Worklog" left={props => <List.Icon {...props} icon="account-group" color={isDark ? Colors.white : Colors.primary} />}
                titleStyle={{ color: isDark ? Colors.white : Colors.black, fontFamily: 'Lato-Semibold' }}
                style={{ marginLeft: 20, marginTop: -10 }}
                onPressIn={() => { navigation.navigate('AppoveWorklog') }}
                onPress={() => { toggleMenu() }} />

              <List.Item
                title="PM Worklog" left={props => <List.Icon {...props} icon="account-group" color={isDark ? Colors.white : Colors.primary} />}
                titleStyle={{ color: isDark ? Colors.white : Colors.black, fontFamily: 'Lato-Semibold' }}
                style={{ marginLeft: 20, marginTop: -10 }}
                onPressIn={() => { navigation.navigate('PMWorklogs') }}
                onPress={() => { toggleMenu() }} />
            </List.Accordion>
          } */}
          <Pressable
            android_ripple={{color: 'rgba(0,0,0,0.1)'}}
            onPressIn={() => {
              navigation.navigate('WorkFromHome');
            }}
            onPress={() => props.navigation.closeDrawer()}
            style={[styles(isDark).drawerBtn]}>
            <Icon
              source="monitor"
              color={isDark ? Colors.white : Colors.white}
              size={23}
            />
            <Text style={styles(isDark).drawerBtnTxt}>Work From Home</Text>
          </Pressable>

          <Pressable
            android_ripple={{color: 'rgba(0,0,0,0.1)'}}
            onPressIn={() => {
              navigation.navigate('Feedback');
            }}
            onPress={() => props.navigation.closeDrawer()}
            style={[styles(isDark).drawerBtn]}>
            <Icon
              source="chat-processing"
              color={isDark ? Colors.white : Colors.white}
              size={23}
            />
            <Text style={styles(isDark).drawerBtnTxt}>Feedback</Text>
          </Pressable>

          {/* <Pressable
              android_ripple={{ color: 'rgba(0,0,0,0.1)' }}
              onPressIn={() => {
                navigation.navigate('AppoveWorklog');
              }}
              onPress={() => {
                toggleMenu();
              }}
              style={[styles(isDark).drawerBtn]}>
              <Icon
                source="chat-processing"
                color={isDark ? Colors.white : Colors.primary}
                size={23}
              />
              <Text style={styles(isDark).drawerBtnTxt}>EMP Worklog</Text>
            </Pressable> */}
        </ScrollView>
      </DrawerContentScrollView>
    );
}

const styles = (isDark: any) =>
    StyleSheet.create({
        container: {
            flex: 1,
            alignItems: 'flex-start',
            justifyContent: 'flex-start',
        },
        drawerContainer: { padding: 10 },
        
        drawerBtnContainer: { marginHorizontal: 16 },

        drawerBtn: {
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: 'transparent',
            paddingLeft: 13,
            borderRadius: 8,
            minHeight: 45,
            marginTop: 10,
        },
        drawerBtnTxt: {
            marginLeft: 15,
            color: isDark ? Colors.white : Colors.white,
            flexWrap: 'wrap',
            width: 'auto',
            fontFamily: 'Lato-Semibold',
            fontSize: 16,
        },
         containerRow: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: isDark ? Colors.black : Colors.primary,
      paddingHorizontal: 15,
      paddingVertical: 10,
    },
    logo: {
      width: 50,
      height: 50,
      borderRadius: 30,
      marginRight: 10,
    },
    userCol: {
      flex: 1,
      flexDirection: 'column',
      justifyContent: 'center',
      marginTop:5,
    },
    UserName: {
      fontFamily: 'Lato-Semibold',
      fontSize: 16,
      color: Colors.white,
    },
    UserEmail: {
      fontFamily: 'Lato-Regular',
      fontSize: 14,
      color: Colors.white,
    },
    editIcon: {
      marginLeft: 5,
    },
    });

