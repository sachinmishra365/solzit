import React, {useState, useEffect} from 'react';
import {StyleSheet, Text, View, TouchableOpacity, FlatList} from 'react-native';
import {
  DateData,
  AgendaEntry,
  AgendaSchedule,
  Calendar,
} from 'react-native-calendars';
import moment from 'moment';
import Fabbutton from './FabButton/Fabbutton';
import {Colors} from '../../constants/Colors';
import {
  useEmployeeAppliedLeavesQuery,
  useProcessedLeavesQuery,
  useSoluzioneHolidaysQuery,
} from '../../Services/services';
import {useDispatch, useSelector} from 'react-redux';
import {
  applied,
  isDarkTheme,
  processedLeaves,
} from '../../AppStore/Reducers/appState';
import {Dimensions} from 'react-native';
import Placeholder from '../Placeholder/Placeholder';

const {height} = Dimensions.get('window');

const Dashboard = () => {
  const dispatch = useDispatch();
  const isDark = useSelector(isDarkTheme);

  const [items, setItems] = useState<AgendaSchedule>({});
  const [currentDate, setCurrentDate] = useState('');
  const [HolyDays, setHolyDays] = useState<any>([]);

  const EmployeeId = useSelector((state: any) => state?.appState?.authToken);

  const {data, error, isLoading} = useSoluzioneHolidaysQuery([]);

  const handleholiday = async () => {
    try {
      const response = await data;
      if (response && response?.Data && response?.ResponseCode === 100) {
        setHolyDays(response?.Data);
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    handleholiday();
  }, [data]);

  const AppliedLeave = useEmployeeAppliedLeavesQuery({
    ids: EmployeeId?.userProfile?.userId || null,
  });

  const RequestleaveDetails = AppliedLeave?.data?.Data?.map((item: any) => ({
    formattedStartDate: moment(item?.leaveStartDate).format('YYYY-MM-DD'),
    formattedEndDate: moment(item?.leaveEndDate).format('YYYY-MM-DD'),
    label: item?.Status?.Label,
  }));

  RequestleaveDetails?.forEach((requestitem: any) => {
    const startDate = moment(requestitem.formattedStartDate);
    const endDate = moment(requestitem.formattedEndDate);
    let currentDate = startDate.clone();
    while (currentDate.isSameOrBefore(endDate)) {
      const date = currentDate.format('YYYY-MM-DD');
      if (items[date]) {
        items[date]?.forEach(event => {
          event.name = requestitem.label;
          event.day = requestitem.formattedEndDate;
        });
      }
      currentDate.add(1, 'day');
    }
  });

  const ProcessedLeaves = useProcessedLeavesQuery({
    Id: EmployeeId?.userProfile?.userId || null,
  });

  const leaveDetails = ProcessedLeaves?.data?.Data?.map((item: any) => ({
    formattedStartDate: moment(item?.leaveStartDate).format('YYYY-MM-DD'),
    formattedEndDate: moment(item?.leaveEndDate).format('YYYY-MM-DD'),
    label: item?.Status?.Label,
    leaveApplicationId: item?.leaveApplicationId,
  }));

  leaveDetails?.forEach((requestitem: any) => {
    const startDate = moment(requestitem.formattedStartDate);
    const endDate = moment(requestitem.formattedEndDate);
    let currentDate = startDate.clone();
    while (currentDate.isSameOrBefore(endDate)) {
      const date = currentDate.format('YYYY-MM-DD');
      if (items[date]) {
        items[date]?.forEach(event => {
          event.name = requestitem.label;
          event.day = requestitem.formattedEndDate;
        });
      }
      currentDate.add(1, 'day');
    }
  });

  useEffect(() => {
    if (AppliedLeave?.data?.Data !== undefined) {
      dispatch(applied(AppliedLeave?.data?.Data));
    }
  }, [AppliedLeave]);

  useEffect(() => {
    if (ProcessedLeaves?.data?.Data !== undefined) {
      dispatch(processedLeaves(ProcessedLeaves?.data?.Data));
    }
  }, [ProcessedLeaves]);

  useEffect(() => {
    const date = moment().format('YYYY-MM-DD');
    setCurrentDate(date);
  }, []);

  const handleDayPress = (day: DateData) => {
    setCurrentDate(day.dateString);
  };

  const renderHolidays = ({item}: any) => {
    return (
      <View style={styles(isDark).holidayItem}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            elevation: 15,
            shadowColor: isDark ? Colors.white : Colors.black,
          }}>
          <View>
            <Text
              style={{
                color: isDark ? Colors.white : Colors.black,
                fontSize: 20,
                fontFamily: 'Lato-Regular',
              }}>
              {moment(item.date).format(' D ')} {/* Format the date */}
            </Text>
            <Text
              style={{
                color: isDark ? Colors.white : Colors.black,
                fontSize: 18,
                fontFamily: 'Lato-Regular',
              }}>
              {moment(item.date).format(' MMM ')} {/* Format the date */}
            </Text>
          </View>
          <View
            style={{
              backgroundColor: isDark ? Colors.gray : Colors.background,
              padding: 10,
              height: 70,
              borderRadius: 10,
              width: '80%',
            }}>
            <Text
              style={{
                color: isDark ? Colors.white : Colors.black,
                fontFamily: 'Lato-Semibold',
              }}>
              {item.holidayName}
            </Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: isDark ? Colors.black : Colors.white,
      }}>
      <Calendar
        onDayPress={handleDayPress}
        markedDates={{
          [currentDate]: {
            selected: true,
            marked: true,
            selectedColor: Colors.primary,
          },
        }}
        theme={{
          calendarBackground: 'transparent',
          textSectionTitleColor: Colors.dark_gray,
          selectedDayBackgroundColor: Colors.primary,
          dayTextColor: Colors.dark_gray,
          todayTextColor: Colors.primary,
          arrowColor: Colors.primary,
          monthTextColor: Colors.dark_gray,
          textDisabledColor: Colors.error,
        }}
        markingType={'simple'}
        enableSwipeMonths
        disableAllTouchEventsForDisabledDays={false}
      />
      {isLoading ? (
        <Placeholder />
      ) : (
        <FlatList
          data={HolyDays}
          renderItem={renderHolidays}
          keyExtractor={(item, index) => item?.id?.toString() + index}
          style={{margin: 5}}
          showsVerticalScrollIndicator={false}
        />
      )}
      <Fabbutton />
    </View>
  );
};

const styles = (isDark: any) =>
  StyleSheet.create({
    item: {
      flex: 1,
      borderRadius: 5,
      padding: 10,
      marginRight: 10,
      marginTop: 17,
    },
    emptyDate: {
      height: 15,
      flex: 1,
      paddingTop: 30,
    },
    customDay: {
      margin: 10,
      fontSize: 24,
      color: 'green',
      fontFamily: 'Lato-Semibold',
    },
    dayItem: {
      marginLeft: 34,
    },
    holidayItem: {
      padding: 10,
      elevation: 15,
      shadowColor: isDark ? Colors.white : Colors.black,
    },
  });

export default Dashboard;
