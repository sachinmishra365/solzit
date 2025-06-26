import { FlatList, StyleSheet, Text, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import { Button } from 'react-native-paper';
import { useIsFocused } from '@react-navigation/native';
import ToastMessage from '../../../Components/ToastMessage';
import { useGetProjectManagerWorkLogApprovalListMutation, useUpdateWorkLogStatusMutation } from '../../../Services/workloglevel';
import { isDarkTheme, setFilterPMList, setPMList } from '../../../AppStore/Reducers/appState';
import WorklogCard from '../../../Components/WorklogCard';
import { Colors } from '../../../constants/Colors';
import CustomHeader from '../../../Components/CustomHeader';
import Placeholder from '../../Placeholder/Placeholder';
import ShimmerPlaceHolder from '../../Placeholder/ShimmerPlaceHolder';
import EmptyData from '../../../Components/EmptyData';
import PMApproveWorklogFilter from './PMApproveWorklogFilter';

const PMWorklogs = ({ navigation }: any) => {
    const isFocuse = useIsFocused();
    const isDark = useSelector(isDarkTheme);
    const dispatch = useDispatch();
    const Assesstoken = useSelector((state: any) => state?.appState?.authToken);
    const accessToken = Assesstoken?.authToken?.accessToken;
    const employees = useSelector((state: any) => state?.appState?.PMList);
    const FilterEmployeeList = useSelector((state: any) => state?.appState?.FilterPMList);

    const [WorkLogApprovalList, result] = useGetProjectManagerWorkLogApprovalListMutation();
    const [worklogStatus, response] = useUpdateWorkLogStatusMutation();
    const [checkedItems, setCheckedItems] = useState<any>({});
    const [filterVisible, setFilterVisible] = useState(false);

    useEffect(() => {
        handleWorkLogApprovalList();
    }, [FilterEmployeeList, isFocuse]);

    const flatWorklogData = employees.flatMap((emp: any) => {
        return emp.employeeAttendanceLists.map((att: any, index: any) => ({
            id: `${emp.employee.id}`,
            name: emp.employee?.name || 'N/A',
            isApproveable: emp.isApproveable,
            totalWorklogHours: `${att.totalWorklogHours || '0'}`,
            dates: moment(att.dates).format('DD, MMM YYYY'),
            inTime: att.inTime ? moment(att.inTime).format('hh:mm A') : 'N/A',
            outTime: att.outTime ? moment(att.outTime).format('hh:mm A') : 'N/A',
            hoursPunchInOutTime: att.hoursPunchInOutTime || 'N/A',
            worklogdata: att.approvalWorkLogLists?.map((log: any) => ({
                isEditable: log.isEditable,
                workLogId: log.workLogId,
                workLogStatus: log.workLogStatus || {}
            })) || []
        }));
    });

    const toggleCheckbox = (worklogList: any) => {
        const updatedCheckedItems = { ...checkedItems };

        const editableLogs = worklogList.filter((log: any) => log.isEditable);
        const isAllSelected = editableLogs.every((log: any) => checkedItems[log.workLogId]);

        editableLogs.forEach((log: any) => {
            if (isAllSelected) {
                delete updatedCheckedItems[log.workLogId];
            } else {
                updatedCheckedItems[log.workLogId] = true;
            }
        });

        setCheckedItems(updatedCheckedItems);
    };

    const handleToggleSelectAll = () => {
        const allLogs = flatWorklogData.flatMap((item: any) => item.worklogdata);
        const editableLogs = allLogs.filter((log: any) => log.isEditable && log.workLogId);

        const allSelected = editableLogs.every((log: any) => checkedItems[log.workLogId]);

        if (allSelected) {
            setCheckedItems({});
        } else {
            const allSelectedMap: Record<string, boolean> = {};
            editableLogs.forEach((log: any) => {
                allSelectedMap[log.workLogId] = true;
            });
            setCheckedItems(allSelectedMap);
        }
    };


    const handleWorkLogApprovalList = async () => {
        const data = {
            projectManagerId: Assesstoken?.userProfile?.linkedUser?.id,
            startDate: FilterEmployeeList?.startDate || moment('2025-04-01').format(),
            endDate: FilterEmployeeList?.endDate || moment('2025-04-16').format(),
            statusType: FilterEmployeeList?.statusType || 'all'
        };

        try {
            const response = await WorkLogApprovalList({ accessToken, data });
            if (response?.data?.isSuccessful) {
                dispatch(setPMList(response?.data?.data || []));
            } else {
                ToastMessage({ type: "error", title: "Worklog Approval", subtitle: response?.data?.messageDetail?.message });
            }
        } catch (error) {
            console.error('Error fetching work log approval list:', error);
        }
    };

    const handleBulkStatusChange = async (statusCode: any) => {
        const selectedIds = Object.keys(checkedItems).filter((id) => checkedItems[id]);
        const data = selectedIds.map((workLogId) => ({
            id: workLogId,
            name: 'Worklog',
            workLogStatus: statusCode,
            approverId: Assesstoken?.userProfile?.linkedUser?.id
        }));

        try {
            const response = await worklogStatus({ data, accessToken }).unwrap();
            if (response.isSuccessful) {
                handleWorkLogApprovalList();
                ToastMessage({ type: "success", title: "Worlklog Approve Status", subtitle: response?.messageDetail?.message });
            }
        } catch (error) {
            console.error('Error in bulk status update:', error);
        }
    };

    const renderItem = ({ item }: any) => {
        const isAllSelected = item.worklogdata.filter((log: any) => log.isEditable).every((log: any) => checkedItems[log.workLogId]);

        return (
            <WorklogCard
                width="100%"
                projectName={item.name}
                iconName={isAllSelected ? 'checkbox-outline' : 'checkbox-blank-outline'}
                iconColor={Colors.primary}
                iconPress={() => toggleCheckbox(item.worklogdata)}
                showleftIcon={item.worklogdata.some((w: any) => w.isEditable)}
                iconName2={'exclamation'}
                iconColor2={Colors.error}
                iconPress2={() => { }}
                showleftIcon2={item?.isApproveable}
                serialNo={`Worklog Hours : ${item.totalWorklogHours}`}
                title={item.dates}
                startDate={item.inTime}
                endDate={item.outTime}
                status={`Punch In/Out : ${item.hoursPunchInOutTime}`}
                rightIconName="checkbox-marked-circle"
                rightIconColor={Colors.green}
                showRightIcon={(isAllSelected && item?.isApproveable) ? true : false}
                rightIconPress={() => handleBulkStatusChange(674180002)}
                cardPress={() => navigation.navigate('SelectedPM', { id: item?.id, dates: item.dates, isAllSelected })}
            />
        );
    };

    return (
        <View style={styles(isDark).container}>
            <CustomHeader
                showBackIcon={true}
                title="PM Worklog"
                onPress={() => {
                    navigation.goBack();
                    dispatch(setFilterPMList([])); 
                }}
                showFilterIcon={true}
                filterOnPress={() => setFilterVisible(true)}
                showRightIcon2={FilterEmployeeList?.employeeId ? true : false}
                rightIconPress2={handleToggleSelectAll}
                rightIconName2={
                    flatWorklogData.flatMap((item: any) => item.worklogdata)
                        .filter((log: any) => log.isEditable)
                        .every((log: any) => checkedItems[log.workLogId])
                        ? 'checkbox-multiple-marked'
                        : 'checkbox-multiple-blank-outline'
                }
            />
            {
                response?.isLoading ? <Placeholder /> :
                    <>
                        {!FilterEmployeeList?.employeeId &&
                            <View style={styles(isDark).formErrorBox}>
                                <Text style={styles(isDark).formErrorText}>Please select the PM first  to approve multiple worklogs</Text>
                            </View>
                        }
                        {FilterEmployeeList?.employeeId &&
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
                        }

                        {result?.isLoading ? (
                            <ShimmerPlaceHolder />
                        ) : (
                            <FlatList
                                data={FilterEmployeeList?.employeeId ? flatWorklogData.filter((item: any) => item.id === FilterEmployeeList.employeeId) : flatWorklogData}
                                keyExtractor={(item, index) => item?.id + index.toString()}
                                renderItem={renderItem}
                                ListFooterComponent={<View style={{ height: 100 }} />}
                                showsVerticalScrollIndicator={false}
                                ListEmptyComponent={() => (
                                    <View style={{ marginVertical: '100%' }}>
                                        <EmptyData />
                                    </View>
                                )}
                            />
                        )}

                        <PMApproveWorklogFilter
                            visible={filterVisible}
                            setVisible={setFilterVisible}
                        />
                    </>
            }
        </View>
    );
};

export default PMWorklogs;

const styles = (isDark: any) =>
    StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: isDark ? Colors.black : Colors.white
        },
        formErrorBox: {
            backgroundColor: Colors.error,
            padding: 10,
            marginBottom: 10,
        },
        formErrorText: {
            color: Colors.white,
            fontFamily: 'Lato-Bold',
            textAlign: 'center',
        },
    });
