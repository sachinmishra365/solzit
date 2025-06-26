import { FlatList, RefreshControl, StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import { useSelector } from 'react-redux';
import moment from 'moment';
import { Button } from 'react-native-paper';
import { isDarkTheme } from '../../../AppStore/Reducers/appState';
import { useUpdateWorkLogStatusMutation } from '../../../Services/workloglevel';
import ToastMessage from '../../../Components/ToastMessage';
import WorklogCard from '../../../Components/WorklogCard';
import { Colors } from '../../../constants/Colors';
import CustomHeader from '../../../Components/CustomHeader';
import RejectMessageDialog from '../RejectMessageDialog';
import Placeholder from '../../Placeholder/Placeholder';
import EmptyData from '../../../Components/EmptyData';

const SelectedPM = ({ navigation, route }: any) => {
    const isDark = useSelector(isDarkTheme);
    const routeParams = route?.params || {};
    const employees = useSelector((state: any) => state?.appState?.PMList);
    const Assesstoken = useSelector((state: any) => state?.appState?.authToken);
    const accessToken = Assesstoken?.authToken?.accessToken;
    const FilterEmployeeList = useSelector((state: any) => state?.appState?.FilterPMList);

    const extractedEmployeeId = routeParams.id?.split('_')[0];
    const formattedSelectedDate = routeParams.dates;

    const selectedDate = moment(formattedSelectedDate, 'DD, MMM YYYY').format('YYYY-MM-DD');
    const selectedEmployeeId = extractedEmployeeId;

    const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});
    const [dialogVisible, setDialogVisible] = useState(false);
    const [reason, setReason] = useState('');
    const [refreshing, setRefreshing] = useState(false);
    const [refreshFlag, setRefreshFlag] = useState(false);

    const [worklogStatus, result,] = useUpdateWorkLogStatusMutation()

    const attendanceItems = employees?.flatMap((emp: any) => {
        if (!emp) return null;
        return emp.employeeAttendanceLists?.map((att: any) => ({
            employeeId: emp.employee.id,
            employeeName: emp.employee.name,
            date: att.dates,
            approvalWorkLogLists: att.approvalWorkLogLists,
        }))
    }
    ) || [];


    const selectedLogs = React.useMemo(() => {
        return attendanceItems.find(
            (i: any) =>
                i.employeeId === selectedEmployeeId &&
                moment(i.date).format('YYYY-MM-DD') === selectedDate
        )?.approvalWorkLogLists || [];
    }, [employees, refreshFlag]);

    const toggleCheckbox = (id: any) => {
        setCheckedItems(prev => ({ ...prev, [id]: !prev[id] }));
    };

    const filteredSelectedLogs = selectedLogs.filter((item: any) => {
        if (FilterEmployeeList?.statusType === 'approved') {
            return item.workLogStatus?.label === 'Approved';
        } else if (FilterEmployeeList?.statusType === 'rejected') {
            return item.workLogStatus?.label === 'Rejected';
        } else {
            return true;
        }
    });

    const handleBulkStatusChange = async (statusCode: number) => {
        const selectedIds = Object.keys(checkedItems).filter(id => checkedItems[id]);

        const data = selectedIds.map(workLogId => ({
            id: workLogId,
            name: 'Worklog',
            workLogStatus: statusCode,
            approverId: Assesstoken?.userProfile?.linkedUser?.id,
            reasonForRejection: statusCode === 674180003 ? reason : '',
        }));

        try {
            const response = await worklogStatus({ data, accessToken }).unwrap();

            setDialogVisible(false);
            if (response.isSuccessful) {
                ToastMessage({ type: "success", title: "Worlklog Approve Status", subtitle: response?.messageDetail?.message });
                setCheckedItems({});
                setReason('');
                setRefreshFlag(prev => !prev);
                navigation.goBack();
            }
        } catch (error) {
            console.error('Error in bulk status update:', error);
        }
    };

    const handleToggleSelectAll = () => {
        if (Object.keys(checkedItems).length === selectedLogs.length) {
            setCheckedItems({});
        } else {
            const allSelected: Record<string, boolean> = {};
            selectedLogs.forEach((item: any) => { allSelected[item.workLogId] = true; });
            setCheckedItems(allSelected);
        }
    };




    const renderItem = ({ item }: any) => {
        if (!item) {
            return null;
        }

        return (

            <WorklogCard
                width="90%"
                projectName={item.project?.name || 'N/A'}
                iconName={checkedItems[item.workLogId] ? checkedItems[item.workLogId] ? "checkbox-outline" : 'checkbox-blank-outline' : route?.params?.isAllSelected ? "checkbox-outline" : 'checkbox-blank-outline'}
                iconColor={Colors.primary}
                iconPress={() => toggleCheckbox(item.workLogId)}
                showleftIcon={item.isEditable ? true : false}
                title={`${item.todoTitle}`}
                startDate={item?.todoTicketNumber || 'N/A'}
                endDate={item?.workLogCategory ? item?.workLogCategory?.label : null}
                serialNo={`${item.loggedHours}`}
                status={item.workLogStatus.label}
                rightIconName="checkbox-marked-circle"
                rightIconColor={Colors.green}
                showRightIcon={checkedItems[item.workLogId] ? true : false}
                rightIconPress={() => handleBulkStatusChange(674180002)}
                rightIconColor2={Colors.error}
                showRightIcon2={checkedItems[item.workLogId] ? true : false}
                rightIconName2={'close-circle'}
                rightIconPress2={() => setDialogVisible(true)}
            />
        )
    }
    return (
        <View style={styles(isDark).container}>
            <CustomHeader
                showBackIcon={true}
                title="PM Worklog"
                onPress={() => navigation.goBack()}
                rightIconPress={() => handleToggleSelectAll()}
                rightIconName={Object.keys(checkedItems).length === selectedLogs.length ? "checkbox-multiple-marked" : 'checkbox-multiple-blank-outline'}
                showRightIcon={true}
            />
            {
                Object.keys(checkedItems).length === selectedLogs.length && (
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginHorizontal: 16, marginVertical: 8 }}>
                        <Button
                            mode="contained"
                            onPress={() => handleBulkStatusChange(674180002)}
                            buttonColor={Colors.green}
                            style={{ width: '100%' }}
                        >
                            Approve All
                        </Button>

                    </View>
                )
            }
            <RejectMessageDialog
                visible={dialogVisible}
                title="Reject Worklog"
                message="Please enter a reason for rejection:"
                onCancel={() => { setDialogVisible(false); setReason(''); }}
                onConfirm={() => { handleBulkStatusChange(674180003); }}
                reason={reason}
                onChangeReason={(text: any) => setReason(text)}
            />
            {selectedDate && (
                result.isLoading ? (
                    <Placeholder />
                ) : (
                    <FlatList
                        data={filteredSelectedLogs}
                        keyExtractor={(item) => item.workLogId}
                        ListFooterComponent={<View style={{ height: 100 }} />}
                        showsVerticalScrollIndicator={false}
                        renderItem={renderItem}
                        ListEmptyComponent={() =>
                            <View style={{ marginVertical: '80%' }}>
                                <EmptyData />
                            </View>}

                    />)
            )}
        </View>
    )
}

export default SelectedPM

const styles = (isDark: any,) =>
    StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: isDark ? Colors.black : Colors.white,
        }
    })