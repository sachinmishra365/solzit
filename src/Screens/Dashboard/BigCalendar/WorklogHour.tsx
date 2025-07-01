import React, { useState } from 'react';
import { PanResponder, StyleSheet, Text, View } from 'react-native';
import { SegmentedButtons } from 'react-native-paper';
import { useSelector } from 'react-redux';
import { isDarkTheme } from '../../../AppStore/Reducers/appState';
import CustomHeader from '../../../Components/CustomHeader';
import { Colors } from '../../../constants/Colors';
import { useApprovedWorkLogLast30DaysQuery, useGetWorkLogThisMonthAndLastMonthQuery, } from '../../../Services/workloglevel';
import Placeholder from '../../Placeholder/Placeholder';
import CalendarView from './CalendarView'; // Extract Calendar UI logic here for reuse

const WorklogHour = ({ navigation }: any) => {
    const isDark = useSelector(isDarkTheme);
    const [selectedStatus, setSelectedStatus] = useState('CurrentMonth');

    const statuses = ['CurrentMonth', 'LastMonth'];
    const monthMap: Record<string, 'thismonth' | 'lastmonth'> = {
        CurrentMonth: 'thismonth',
        LastMonth: 'lastmonth',
    };

    const Assesstoken = useSelector((state: any) => state?.appState?.authToken);
    const accessToken = Assesstoken?.authToken?.accessToken;

    const currentMonthParam = monthMap[selectedStatus];

    const { data: isloggeddata, isLoading: islogged } = useGetWorkLogThisMonthAndLastMonthQuery({
        accessToken,
        month: currentMonthParam,
    });

    const { data: isApproveddata, isLoading: isApproved } = useApprovedWorkLogLast30DaysQuery({
        accessToken,
        month: currentMonthParam,
    });

    const panResponder = PanResponder.create({
        onMoveShouldSetPanResponder: (evt, gestureState) => Math.abs(gestureState.dx) > 20,
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
            {...panResponder.panHandlers}
        >
            <CustomHeader
                showBackIcon
                title="Worklog Hour"
                onPress={() => navigation.goBack()}
                ShowWorkStatusInstruction={true}
            />

            <SegmentedButtons
                value={selectedStatus}
                onValueChange={setSelectedStatus}
                buttons={statuses.map((status) => ({
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
                style={{ marginVertical: 10, marginHorizontal: 16 }}
                theme={{ colors: { primary: Colors.primary } }}
            />

            <Text
                style={{
                    textAlign: 'center',
                    marginBottom: 10,
                    fontFamily: 'Lato-Regular',
                    color: isDark ? Colors.white : Colors.black,
                    fontSize: 14,
                }}
            >
                {selectedStatus === 'CurrentMonth'
                    ? 'Displaying worklog hours for the current month.'
                    : 'Displaying worklog hours for the last month.'}
            </Text>

            {(islogged || isApproved) ? (
                <Placeholder />
            ) : (
                <CalendarView
                    isloggeddata={isloggeddata}
                    isApproveddata={isApproveddata}
                    selectedStatus={selectedStatus}
                    navigation={navigation}
                />
            )}
        </View>
    );
};

export default WorklogHour;

const styles = StyleSheet.create({});
