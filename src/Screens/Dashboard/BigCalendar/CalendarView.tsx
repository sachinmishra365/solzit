import React from 'react';
import { Calendar } from 'react-native-big-calendar';
import moment from 'moment';
import { Colors } from '../../../constants/Colors';
import { useSelector } from 'react-redux';
import { isDarkTheme } from '../../../AppStore/Reducers/appState';

const CalendarView = ({ worklogData, selectedStatus, navigation }: any) => {
  const isDark = useSelector(isDarkTheme);

  const labelColorMap: { [key: string]: string } = {
    New: '#307CE8',
    'Submitted for approval': '#FFA500',
    Approved: '#2E8B57',
    Rejected: '#af292e',
    Cancel: '#696969',
  };

const allEvents = Array.isArray(worklogData?.data)
  ? worklogData.data.flatMap((item: any) => {
      const date = moment(item.tSdate);
      if (!Array.isArray(item.workLogList)) return [];

      // Group logs by label for the current date
      const labelGroups: { [label: string]: number } = {};

      item.workLogList.forEach((log: any) => {
        const label = log?.workLogStatus?.label;
        const hours = parseFloat(log?.tShours || 0);

        if (hours > 0 && label) {
          labelGroups[label] = (labelGroups[label] || 0) + hours;
        }
      });

      // Map each label group to one calendar event
      return Object.entries(labelGroups).map(([label, totalHours], idx) => {
        const start = date.clone().set({ hour: 8 + idx, minute: 30 });
        const end = start.clone().add(totalHours, 'hours');

        return {
          title: `${Number.isInteger(totalHours)
            ? totalHours
            : totalHours.toFixed(1)} hr${totalHours > 1 ? 's' : ''}`,
          start: start.toDate(),
          end: end.toDate(),
          color: labelColorMap[label] || Colors.secondary,
          label,
        };
      });
    })
  : [];


  const initialMonth =
    selectedStatus === 'LastMonth'
      ? moment().subtract(1, 'month').startOf('month')
      : moment().startOf('month');

  return (
    <Calendar
      events={allEvents}
      height={600}
      mode="month"
      swipeEnabled={false}
      date={initialMonth.toDate()}
      eventCellStyle={event => ({
        backgroundColor: labelColorMap[(event as any).label] || Colors.secondary,
        borderRadius: 5,
        padding: 4,
        elevation: 2,
        alignItems:'center',
      })}
      onPressEvent={eventItem => {
        const selectedDate = moment(eventItem?.start).format('YYYY-MM-DD');
        if (navigation?.navigate) {
          navigation.navigate('ToDosOnWorkLogDate', { selectedDate });
        } else {
          console.warn('Navigation object not passed!');
        }
      }}
    />
  );
};

export default CalendarView;
