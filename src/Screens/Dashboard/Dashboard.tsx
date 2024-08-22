import React, {useState, useEffect} from 'react';
import {Alert, StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import {
  Agenda,
  DateData,
  AgendaEntry,
  AgendaSchedule,
  Calendar,
} from 'react-native-calendars';
import moment from 'moment';
import testIDs from '../../../testIDs';
import Fabbutton from './FabButton/Fabbutton';
import {Colors} from '../../constants/Colors';
import {
  useEmployeeAppliedLeavesQuery,
  useProcessedLeavesQuery,
} from '../../Services/services';
import {useDispatch, useSelector} from 'react-redux';
import {applied, processedLeaves} from '../../AppStore/Reducers/appState';
import { useNavigation } from '@react-navigation/native';

import { Dimensions } from 'react-native';

const { height } = Dimensions.get('window');

const Dashboard = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation()
  const [items, setItems] = useState<AgendaSchedule>({});
  const [currentDate, setCurrentDate] = useState('');
  const EmployeeId = useSelector((state: any) => state?.appState?.authToken);
  const proceed = useSelector((state: any) => state?.appState?.processed);
  const Requestdata = useSelector(
    (state: any) => state?.appState?.appliedLeave,
  );

  const leaveDetails = proceed?.map((item:any) => ({
    formattedStartDate: moment(item?.leaveStartDate).format('YYYY-MM-DD'),
    formattedEndDate: moment(item?.leaveEndDate).format('YYYY-MM-DD'),
    label: item?.Status?.Label,
    leaveApplicationId: item?.leaveApplicationId, 
  }));

  leaveDetails?.forEach((item:any) => {
    const date = item.formattedStartDate;
    if (items[date]) {
      items[date]?.forEach(event => {
        event.name = item.label;
        event.leaveApplicationId = item.leaveApplicationId;
      });
    }
  });


  const RequestleaveDetails = Requestdata?.map(item => ({
    formattedStartDate: moment(item?.leaveStartDate).format('YYYY-MM-DD'),
    label: item?.Status?.Label,
  }));  


  RequestleaveDetails?.forEach(requestitem => {
    const date = requestitem.formattedStartDate;
    if (items[date]) {
      items[date]?.forEach(event => {
        event.name = requestitem.label;
      });
    }
  });

  const AppliedLeave = useEmployeeAppliedLeavesQuery({
    id: EmployeeId?.data?.Data?.ID,
  });

  const ProcessedLeaves = useProcessedLeavesQuery({
    Id: EmployeeId?.data?.Data?.ID,
  });

  const leaveApplicationIds = proceed?.map((item:any) => item.leaveApplicationId);
  
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

          // Generate only one card per day
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

    return (
      <TouchableOpacity
        testID={testIDs.agenda.ITEM}
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
          //   navigation.navigate('Aboutleavedetails', { leaveApplicationId: reservation.leaveApplicationId});
          // }
        }}
        // onPress={() =>{reservation.name !=='No Event' ?  navigation.navigate('Aboutleavedetails',{leaveApplicationIds : null })}}
        >
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

  const renderDay = (day: {
    getDay: () =>
      | string
      | number
      | boolean
      | React.ReactElement<any, string | React.JSXElementConstructor<any>>
      | Iterable<React.ReactNode>
      | React.ReactPortal
      | null
      | undefined;
  }) => {
    if (day) {
      return <Text style={styles.customDay}>{day.getDay()}</Text>;
    }
    return <View style={styles.dayItem} />;
  };

  const timeToString = (time: number) => {
    const date = new Date(time);
    return date.toISOString().split('T')[0];
  };

  return (
    <View style={{flex: 1, backgroundColor: Colors.gray}}>
      <Agenda
        testID={testIDs.agenda.CONTAINER}
        items={items}
        loadItemsForMonth={loadItems}
        selected={currentDate}
        renderItem={renderItem}
        renderEmptyDate={renderEmptyDate}
        rowHasChanged={rowHasChanged}
        pastScrollRange={6}
        futureScrollRange={12}
        hideKnob={false}
        showClosingKnob={true}
        pagingEnabled={true}
        refreshing={false}
        theme={{
          calendarBackground: Colors.gray, //agenda background
          agendaKnobColor: Colors.primary, // knob color
          backgroundColor: Colors.black, // background color below agenda
          agendaDayTextColor: Colors.white, // day name
          agendaDayNumColor: Colors.white, // day number
          agendaTodayColor: Colors.primary, // today in list
          monthTextColor: Colors.white, // name in calendar
          textDefaultColor: 'red',
          todayBackgroundColor: Colors.white,
          textSectionTitleColor: Colors.white,
          selectedDayBackgroundColor: Colors.primary, // calendar sel date
          dayTextColor: Colors.white, // calendar day
          dotColor: 'white', // dots
          textDisabledColor: 'red',
        }}
        // Agenda container style
        sectionStyle={{
          backgroundColor: Colors.black,
        }}
        style={{
          height: height * 0.6, 
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
    // backgroundColor:item.name,
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
