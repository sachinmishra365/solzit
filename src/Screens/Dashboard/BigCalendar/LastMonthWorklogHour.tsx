import React from 'react'
import { Calendar } from 'react-native-big-calendar'
import CustomHeader from '../../../Components/CustomHeader';
import moment from 'moment';
import { useApprovedWorkLogLast30DaysQuery, useGetWorkLogThisMonthAndLastMonthQuery } from '../../../Services/workloglevel';
import { useSelector } from 'react-redux';
import { Colors } from '../../../constants/Colors';
import Placeholder from '../../Placeholder/Placeholder';


const LastMonthWorklogHour = ({ navigation }: any) => {
    const Assesstoken = useSelector((state: any) => state?.appState?.authToken);
    const accessToken = Assesstoken?.authToken?.accessToken;
    const { data: isloggeddata, isLoading: islogged } = useGetWorkLogThisMonthAndLastMonthQuery({ accessToken, month: 'lastmonth' })
    const { data: isApproveddata, isLoading: isApproved } = useApprovedWorkLogLast30DaysQuery({ accessToken, month: 'lastmonth' })

    const loggedEvents = isloggeddata?.data?.map((item: any) => {

        const start = moment(item.tSdate).set({ hour: 9, minute: 0 });
        const end = moment(start).add(item.tShours || 1, 'hours');

        return {
            title: item?.tShours ? `LH : ${item?.tShours}` : 'LH',
            start: start.toDate(),
            end: end.toDate(),
            color: Colors?.secondary,
        };
    }) || [];

    const approvedEvents = isApproveddata?.data?.map((item: any) => {
        const start = moment(item.tSdate).set({ hour: 13, minute: 0 });
        const end = moment(start).add(item.tShours || 1, 'hours');

        return {
            title: item?.tShours ? `AH : ${item?.tShours}` : 'AH',
            start: start.toDate(),
            end: end.toDate(),
        };
    }) || [];

    const allEvents = [...loggedEvents, ...approvedEvents];

    return (
        <>
            {(islogged) ?
                <Placeholder />
                :
                <Calendar
                    events={allEvents}
                    height={600}
                    mode="month"
                    eventCellStyle={(event) => {
                        console.log(event);

                        return {
                            backgroundColor: (event.color === "#307CE8") ? Colors?.secondary : Colors.darkgreen,
                            borderRadius: 6,
                            padding: 4,
                        };
                    }}
                />}
        </>
    )
}

export default LastMonthWorklogHour