import React, {useRef, useState} from 'react';
import {PanResponder, StyleSheet, Text, View} from 'react-native';
import {IconButton, Menu, Provider, SegmentedButtons} from 'react-native-paper';
import {useSelector} from 'react-redux';
import {isDarkTheme} from '../../../AppStore/Reducers/appState';
import CustomHeader from '../../../Components/CustomHeader';
import {Colors} from '../../../constants/Colors';
import {useGetWorkLogThisMonthAndLastMonthQuery} from '../../../Services/workloglevel';
import Placeholder from '../../Placeholder/Placeholder';
import CalendarView from './CalendarView';

const labelColorMap: {[key: string]: string} = {
  New: '#307CE8',
  'Submitted for approval': '#FFA500',
  Approved: '#2E8B57',
  Rejected: '#af292e',
  Cancel: '#696969',
};

const WorklogHour = ({navigation}: any) => {
  const isDark = useSelector(isDarkTheme);
  const [selectedStatus, setSelectedStatus] = useState('CurrentMonth');
  const [menuVisible, setMenuVisible] = useState(false);

  const openMenu = () => setMenuVisible(true);
  const closeMenu = () => setMenuVisible(false);
  const eyeIconRef = useRef(null);
  const statuses = ['CurrentMonth', 'LastMonth'];

  const Assesstoken = useSelector((state: any) => state?.appState?.authToken);
  const accessToken = Assesstoken?.authToken?.accessToken;

  const {data: thisData, isLoading: isLoadingThis} =
    useGetWorkLogThisMonthAndLastMonthQuery({
      accessToken,
      month: 'thismonth',
    });

  const {data: lastData, isLoading: isLoadingLast} =
    useGetWorkLogThisMonthAndLastMonthQuery({
      accessToken,
      month: 'lastmonth',
    });


  const panResponder = PanResponder.create({
    onMoveShouldSetPanResponder: (evt, gestureState) =>
      Math.abs(gestureState.dx) > 20,
    onPanResponderRelease: (evt, gestureState) => {
      const currentIndex = statuses.indexOf(selectedStatus);
      if (gestureState.dx > 0 && currentIndex > 0) {
        setSelectedStatus(statuses[currentIndex - 1]);
      } else if (gestureState.dx < 0 && currentIndex < statuses.length - 1) {
        setSelectedStatus(statuses[currentIndex + 1]);
      }
    },
  });

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: isDark ? Colors.black : Colors.white,
      }}
      {...panResponder.panHandlers}>
      
       <CustomHeader
          showBackIcon
          title="Worklog Hour"
          onPress={() => navigation.goBack()}
        />


        <View style={{ position: 'absolute', top: 7, right: 1, zIndex: 999 }}>
          <Menu
            visible={menuVisible}
            onDismiss={closeMenu}
            anchor={
              <IconButton
                icon="dots-vertical"
                ref={eyeIconRef}
                size={24}
                iconColor={Colors.white}
                onPress={openMenu}
              />
            }
            contentStyle={{
              backgroundColor: isDark ? Colors.black : Colors.white,
            }}
          >
            {Object.entries(labelColorMap).map(([label, color]) => (
              <View
                key={label}
                style={{ flexDirection: 'row', alignItems: 'center', padding: 8 }}
              >
                <View
                  style={{
                    width: 10,
                    height: 10,
                    borderRadius: 5,
                    backgroundColor: color,
                    marginRight: 8,
                  }}
                />
                <Text
                  style={{
                    color: isDark ? Colors.white : Colors.black,
                    fontSize: 14,
                    fontFamily: 'Lato-Regular',
                  }}
                >
                  {label}
                </Text>
              </View>
            ))}
          </Menu>
        </View>
    
      <SegmentedButtons
        value={selectedStatus}
        onValueChange={setSelectedStatus}
        buttons={statuses.map(status => ({
          value: status,
          label: status,
          style: {
            backgroundColor:
              selectedStatus === status
                ? Colors.secondary
                : isDark
                ? Colors.gray
                : Colors.white,
          },
          labelStyle: {
            color:
              selectedStatus === status
                ? Colors.white
                : isDark
                ? Colors.white
                : Colors.black,
            fontFamily: 'Lato-Semibold',
            fontSize: 13,
          },
        }))}
        style={{marginVertical: 5, marginHorizontal: 16}}
        theme={{colors: {primary: Colors.primary}}}
      />

      <Text
        style={{
          textAlign: 'center',
          marginBottom: 10,
          fontFamily: 'Lato-Regular',
          color: isDark ? Colors.white : Colors.black,
          fontSize: 14,
        }}>
        {selectedStatus === 'CurrentMonth'
          ? 'Displaying worklog hours for the current month.'
          : 'Displaying worklog hours for the last month.'}
      </Text>

      {isLoadingThis || isLoadingLast ? (
        <Placeholder />
      ) : (
        <CalendarView
          worklogData={selectedStatus === 'CurrentMonth' ? thisData : lastData}
          selectedStatus={selectedStatus}
          navigation={navigation}
        />
      )}
    </View>
  );
};

export default WorklogHour;

const styles = StyleSheet.create({});
