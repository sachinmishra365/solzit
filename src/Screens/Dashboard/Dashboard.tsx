import React, {useState, useEffect} from 'react';
import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import {
  Agenda,
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
} from '../../Services/services';
import {useDispatch, useSelector} from 'react-redux';
import {applied, processedLeaves} from '../../AppStore/Reducers/appState';
import {useNavigation} from '@react-navigation/native';
import {Dimensions} from 'react-native';

const {height} = Dimensions.get('window');

const Dashboard = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const [items, setItems] = useState<AgendaSchedule>({});
  const [currentDate, setCurrentDate] = useState('');
  const EmployeeId = useSelector((state: any) => state?.appState?.authToken);

  const ProcessedLeaves = useProcessedLeavesQuery({
    Id: EmployeeId?.data?.Data?.ID,
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

  const AppliedLeave = useEmployeeAppliedLeavesQuery({
    ids: EmployeeId?.data?.Data?.ID,
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

  const loadItems = (day: DateData) => {
    const newItems = {...items};
    setTimeout(() => {
      for (let i = -15; i < 85; i++) {
        const time = day.timestamp + i * 24 * 60 * 60 * 1000;
        const strTime = timeToString(time);
        if (!newItems[strTime]) {
          newItems[strTime] = [];
          newItems[strTime].push({
            name: 'No Event',
            height: 0,
            day: strTime,
          });
        }
      }
      const updatedItems: AgendaSchedule = {};
      Object.keys(newItems).forEach(key => {
        updatedItems[key] = newItems[key];
      });
      setItems(updatedItems);
    }, 1000);
  };

  const renderItem = (reservation: AgendaEntry, isFirst: boolean) => {
    const fontSize = isFirst ? 16 : 14;
    const color = isFirst ? 'white' : '#fff';
    const isCurrentDate = reservation.day === currentDate;

    return (
      <TouchableOpacity
        style={[
          styles.item,
          {
            height: reservation.height,
            backgroundColor:
              reservation.name === 'Applied'
                ? Colors.primary
                : reservation.name === 'Cancelled'
                ? '#8b4315'
                : reservation.name === 'Declined'
                ? Colors.error
                : reservation.name === 'Approved'
                ? 'green'
                : Colors.gray,
          },
        ]}
        onPress={() => {
          // if (reservation.name !== 'No Event') {
          //   navigation.navigate('Aboutleavedetails', {
          //     leaveApplicationId: reservation.leaveApplicationId,
          //   });
          // }
        }}>
        <Text style={{fontSize, color}}>{reservation.name}</Text>
      </TouchableOpacity>
    );
  };

  const renderEmptyDate = () => {
    return (
      <View style={styles.emptyDate}>
        <Text>This is empty date!</Text>
      </View>
    );
  };

  const rowHasChanged = (r1: AgendaEntry, r2: AgendaEntry) => {
    return r1.name !== r2.name;
  };

  const renderDay = (day: any) => {
    if (day) {
      return <Text style={styles.customDay}>{day.getDay()}</Text>;
    }
    return <View style={styles.dayItem} />;
  };

  const timeToString = (time: number) => {
    const date = new Date(time);
    return date.toISOString().split('T')[0];
  };

  const handleDayPress = (day: DateData) => {
    setCurrentDate(day.dateString);
  };

  return (
    <View style={{flex: 1, backgroundColor: Colors.gray}}>
      {/* <Calendar
        onDayPress={handleDayPress}
        markedDates={{
          [currentDate]: { selected: true, marked: true, selectedColor: Colors.primary },
        }}
        enableSwipeMonths
        disabledByDefault
        theme={{
          calendarBackground: Colors.black,
          textSectionTitleColor: Colors.white,
          selectedDayBackgroundColor: Colors.primary,
          dayTextColor: Colors.white,
          todayTextColor: Colors.primary,
        }}
      /> */}
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
          calendarBackground: Colors.black,
          textSectionTitleColor: Colors.white, // Color of the month/year title (e.g., August 2024)
          selectedDayBackgroundColor: Colors.primary, // Background color of the selected day
          dayTextColor: Colors.white, // Color of the day numbers
          todayTextColor: Colors.primary, // Color for today's date
          arrowColor: Colors.primary, // Color of the navigation arrows
          monthTextColor: Colors.white, // Color of the month title
          textDisabledColor: Colors.error, // Color of the disabled days (days not in the markedDates list)
        }}
        markingType={'simple'} // This marking type works with the markedDates prop
        disableAllTouchEventsForDisabledDays={true} // Disable touch events on disabled days
      />

      {/* <View style={{borderWidth:1,backgroundColor:Colors.white,height:1}}/> */}

      <Agenda
        items={items}
        loadItemsForMonth={loadItems}
        selected={currentDate}
        renderItem={renderItem}
        renderEmptyDate={renderEmptyDate}
        rowHasChanged={rowHasChanged}
        pastScrollRange={6}
        futureScrollRange={12}
        hideKnob={true} // Hide the agenda knob
        showClosingKnob={false}
        refreshing={false}
        theme={{
          calendarBackground: Colors.gray,
          backgroundColor: Colors.black,
          agendaDayTextColor: Colors.white,
          agendaDayNumColor: Colors.white,
          agendaTodayColor: Colors.primary,
          monthTextColor: Colors.white,
          todayBackgroundColor: Colors.white,
          textSectionTitleColor: Colors.white,
          selectedDayBackgroundColor: Colors.primary,
          dayTextColor: Colors.white,
          dotColor: 'white',
          textDisabledColor: 'red',
        }}
        sectionStyle={{
          backgroundColor: Colors.black,
          height: 0, // Set the header height to 0
        }}
        style={{
          height: height * 0.59,
        }}
        knobContainerStyle={{
          backgroundColor: Colors.white,
        }}
        agendaStyle={{
          backgroundColor: Colors.white,
        }}
      />

      <Fabbutton />
    </View>
  );
};

const styles = StyleSheet.create({
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
  },
  dayItem: {
    marginLeft: 34,
  },
});

export default Dashboard;
