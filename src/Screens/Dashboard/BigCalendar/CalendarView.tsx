import React from 'react';
import { Calendar } from 'react-native-big-calendar';
import moment from 'moment';
import { Colors } from '../../../constants/Colors';

const CalendarView = ({ isloggeddata, isApproveddata, selectedStatus, navigation }: any) => {
    const loggedEvents = isloggeddata?.data?.map((item: any) => {
        const start = moment(item.tSdate).set({ hour: 8, minute: 0 });
        const end = moment(start).add(item.tShours || 1, 'hours');
        return {
            title: item?.tShours ? `LH : ${item?.tShours}` : 'LH',
            start: start.toDate(),
            end: end.toDate(),
            color: Colors.secondary,
        };
    }) || [];

    const approvedEvents = isApproveddata?.data?.map((item: any) => {
        const start = moment(item.tSdate).set({ hour: 8, minute: 0 });
        const end = moment(start).add(item.tShours || 1, 'hours');
        return {
            title: item?.tShours ? `AH : ${item?.tShours}` : 'AH',
            start: start.toDate(),
            end: end.toDate(),
        };
    }) || [];

    const allEvents = [...loggedEvents, ...approvedEvents];
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
            eventCellStyle={(event) => ({
                backgroundColor: event.color === Colors.secondary ? Colors.secondary : Colors.darkgreen,
                borderRadius: 6,
                padding: 4,
            })}
            onPressEvent={(eventItem) => {
                const selectedDate = moment(eventItem?.start).format('YYYY-MM-DD');
                console.log('navigation:', navigation); // Debugging
                console.log('selectedDate:', selectedDate);

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
