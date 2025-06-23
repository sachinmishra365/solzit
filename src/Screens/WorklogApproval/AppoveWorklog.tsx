import { FlatList, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { isDarkTheme, setEmployeeList, setFilterEmployeeList } from '../../AppStore/Reducers/appState';
import { Colors } from '../../constants/Colors';
import CustomHeader from '../../Components/CustomHeader';
import { useGetProjectManagerWorkLogApprovalListMutation } from '../../Services/workloglevel';
import AppoveWorklogFilter from './AppoveWorklogFilter';
import WorklogCard from '../../Components/WorklogCard';
import moment from 'moment';
import ShimmerPlaceHolder from '../Placeholder/ShimmerPlaceHolder';
import EmptyData from '../../Components/EmptyData';

const AppoveWorklog = ({ navigation }: any) => {
    const isDark = useSelector(isDarkTheme);
    const dispatch = useDispatch()
    const Assesstoken = useSelector((state: any) => state?.appState?.authToken);
    const accessToken = Assesstoken?.authToken?.accessToken;
    const employees = useSelector((state: any) => state?.appState?.EmployeeList);
    const FilterEmployeeList = useSelector((state: any) => state?.appState?.FilterEmployeeList);

    const [WorkLogApprovalList, result] = useGetProjectManagerWorkLogApprovalListMutation()

    const [filterVisible, setFilterVisible] = useState(false);

    useEffect(() => {
        handleWorkLogApprovalList();
    }, [FilterEmployeeList])

    const flatWorklogData = employees.flatMap((emp: any) => {
        return emp.employeeAttendanceLists.map((att: any, index: number) => ({
            id: `${emp.employee.id}`,
            name: att.employee?.name || 'N/A',
            totalWorklogHours: `${att.totalWorklogHours || '0'}`,
            dates: moment(att.dates).format('DD, MMM YYYY'),
            inTime: att.inTime ? moment(att.inTime).format('hh:mm A') : 'N/A',
            outTime: att.outTime ? moment(att.outTime).format('hh:mm A') : 'N/A',
            hoursPunchInOutTime: att.hoursPunchInOutTime || 'N/A',
        }));
    });


    const handleWorkLogApprovalList = async () => {
        const data = {
            projectManagerId: Assesstoken?.userProfile?.linkedUser?.id,
            startDate: FilterEmployeeList?.startDate ? FilterEmployeeList?.startDate : moment('2025-04-01').format('YYYY-MM-DDTHH:mm:ss.SSS') + 'Z',
            endDate: FilterEmployeeList?.endDate ? FilterEmployeeList?.endDate
                : moment('2025-04-16').format('YYYY-MM-DDTHH:mm:ss.SSS') + 'Z',
            statusType: FilterEmployeeList?.statusType || 'all',
        }
        try {
            const response = await WorkLogApprovalList({ accessToken, data })

            dispatch(setEmployeeList(response?.data?.data || []));
        } catch (error) {
            console.error("Error fetching work log approval list:", error);
        }
    }

    const renderItem = ({ item }: any) => {

        return (
            <WorklogCard
                projectName={item.name}
                serialNo={`Worklog Hours : ${item.totalWorklogHours}`}
                title={item.dates}
                startDate={item.inTime}
                endDate={item.outTime}
                status={`Punch In/Out : ${item.hoursPunchInOutTime}`}
                iconName="checkbox-outline"
                showleftIcon={false}
                iconColor={Colors.primary}
                rightIconName="eye"
                rightIconColor={Colors.primary}
                showRightIcon={false}
                rightIconColor2={Colors.green}
                showRightIcon2={false}
                rightIconName2="plus-circle-outline"
                rightIconPress2={() => { }}
                cardPress={() => navigation.navigate('SelectedEmployee', { id: item?.id, dates: item.dates })} />
        );
    }

    return (
        <View style={styles(isDark).container}>
            <CustomHeader
                showBackIcon={true}
                title="Appove Worklog"
                onPress={() => { navigation.goBack(), dispatch(setFilterEmployeeList([])) }}
                showFilterIcon
                filterOnPress={() => setFilterVisible(true)}
            />
            {result?.isLoading ?
                <ShimmerPlaceHolder />
                : (<FlatList
                    data={FilterEmployeeList?.employeeId ? flatWorklogData.filter((item: any) => item.id === FilterEmployeeList.employeeId) : flatWorklogData}
                    keyExtractor={(item) => item?.id}
                    renderItem={renderItem}
                    ListFooterComponent={<View style={{ height: 100 }} />}
                    showsVerticalScrollIndicator={false}
                    ListEmptyComponent={() =>
                        <View style={{ marginVertical: '80%' }}>
                            <EmptyData />
                        </View>
                    }

                />)}

            <AppoveWorklogFilter
                visible={filterVisible}
                setVisible={setFilterVisible}
            />
        </View>
    )
}

export default AppoveWorklog

const styles = (isDark: any,) =>
    StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: isDark ? Colors.black : Colors.white,
        }
    })