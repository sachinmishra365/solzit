import {View, Text, StyleSheet, FlatList, RefreshControl, TouchableOpacity} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useSelector} from 'react-redux';
import {isDarkTheme} from '../../../../AppStore/Reducers/appState';
import {useDeleteMyDailyTaskReportMutation, useGetAppSettingsValueQuery, useGetDayTaskReportDetailsQuery,useUpdateMyDailyTaskReportMutation} from '../../../../Services/workloglevel';
import Toast from 'react-native-toast-message';
import CustomHeader from '../../../../Components/CustomHeader';
import ShimmerPlaceHolder from '../../../Placeholder/ShimmerPlaceHolder';
import {Colors} from '../../../../constants/Colors';
import {
  Button,
  Card,
  Checkbox,
  Icon,
  List,
  TextInput,
} from 'react-native-paper';
import dayjs from 'dayjs';

const ShowPlan = ({navigation}: any) => {
  const isDark = useSelector(isDarkTheme);
  const EmployeeId = useSelector((state: any) => state?.appState?.authToken);
  const connected = useSelector((state: any) => state?.appState?.connected);

  interface TaskItem {
      id: string;
      eodCommittedWorkStatus?: {label: string};
      name?: string;
      comment?: string;
      plannedEffortForDay?: number;
      toDoSubViewsDtos?: { implementationEffort?: number }[]; 
  }

  const [showPlanData, setShowPlanData] = useState<TaskItem[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [isCommitting, setIsCommitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const todayDate = dayjs().format('YYYY-MM-DD');
  
  const {data, isLoading, error, refetch} = useGetDayTaskReportDetailsQuery({
    accessToken: EmployeeId?.authToken?.accessToken,
    Date: todayDate,
  });
  const [createTaskReport] = useUpdateMyDailyTaskReportMutation();
  const [deleteTaskReport] = useDeleteMyDailyTaskReportMutation();
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});
  const [estimatedEfforts, setEstimatedEfforts] = useState<
    Record<string, string>
  >({});
  const [selectedWorkStatuses, setSelectedWorkStatuses] = useState<
    Record<string, string>
  >({});
  const [expandedStates, setExpandedStates] = useState<Record<string, boolean>>(
    {},
  );
  const { data: appSettingData } =  useGetAppSettingsValueQuery({
    accessToken: EmployeeId?.authToken?.accessToken,
    AppSettingName: 'MAX_ADD_DAY_REPORT_TIME',
  });
  
  
  const WORK_STATUS_OPTIONS = [
    {
      value: 674180000,
      label: 'Will continue',
    },
    {
      value: 674180001,
      label: 'Will be completed',
    },
  ];


  const toggleCheckbox = (id: any) => {
    setCheckedItems(prev => ({
      ...prev,
      [id]: !prev[id],
    }));
  };
  
  const handleShowPlan = async () => {
    if (!connected) {
      Toast.show({
        type: 'error',
        text1: 'Network Error',
        text2: 'Please check your internet connection',
        text2Style: {
          flexWrap: 'wrap',
          fontSize: 20,
          fontFamily: 'Lato-Regular',
        },
        topOffset: 80,
        visibilityTime: 5000,
      });
      return;
    }
    try {
      if (data?.data && data?.messageDetail?.message_code === 200) {
        setShowPlanData(data.data);
        const effortMap: Record<string, string> = {};
        data.data.forEach((item: any) => {
          effortMap[item.id] = item.plannedEffortForDay?.toString() || '';
        });
        setEstimatedEfforts(effortMap);

      }
    } catch (error) {}
  };

  useEffect(() => {
    const fetchData = async () => {
      await refetch();
      handleShowPlan();
    };
  
    fetchData();
  }, []);
  
  // useEffect(() => {
  //   if (appSettingData?.data) {
  //     const maxTime = appSettingData.data; 
  //     const currentTime = dayjs().format('HH:mm:ss');
  
  //     if (currentTime > maxTime) {
  //       Toast.show({
  //         type: 'info',
  //         text1: 'Cut-off Reached',
  //         text2: `You can't view today's report after ${maxTime}.`,
  //       });
  //     } else {
  //       handleShowPlan(); 
  //     }
  //   }
  // }, [appSettingData]);
  

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
      refetch();
    }, 1000);
  }, [refetch]);

  const handleTaskAction = async (actionType: 'commit' | 'delete') => {
    const selectedIds = Object.keys(checkedItems).filter(id => checkedItems[id]);
  
    if (selectedIds.length === 0) {
      return Toast.show({
        type: 'error',
        text1: 'No Selection',
        text2: 'Please select at least one item.',
      });
    }
  
    if (!connected) {
      return Toast.show({
        type: 'error',
        text1: 'Network Error',
        text2: 'Please check your internet connection.',
      });
    }
  
    if (actionType === 'commit') {
      const selectedPayloads = showPlanData
        .filter((item: any) => checkedItems[item.id])
        .map((item: any) => {
          const effort =
            parseFloat(estimatedEfforts[item.id]) ||
            item?.toDoSubViewsDtos?.implementationEffort ||
            0;
          const selectedStatus =
            selectedWorkStatuses[item.id] || item?.eodCommittedWorkStatus?.label;
  
          const statusObj = WORK_STATUS_OPTIONS.find(
            opt => opt.label === selectedStatus
          );
  
          if (!effort || effort < 0.25 || !statusObj) return null;
  
          return {
            id: item.id,
            toDoTitle: item?.toDoTitle,
            plannedEffortforDay: effort,
            eodCommittedWorkStatus: {
              value: statusObj.value,
              label: statusObj.label,
            },
            comment: '',
          };
        })
        .filter(Boolean);
  
        setIsCommitting(true);
      try {
        const res = await createTaskReport({
          accessToken: EmployeeId?.authToken?.accessToken,
          data: selectedPayloads,
        }).unwrap();
  
        if (res?.isSuccessful && res?.messageDetail?.message_code === 5016) {
          Toast.show({
            type: 'success',
            text1: 'Success',
            text2: res?.messageDetail?.message || 'Tasks committed successfully',
          });
          await refetch();
          handleShowPlan();
          navigation.goBack();
        } 
      } catch (error: any) {
        console.error('Commit error:', error);
        Toast.show({
          type: 'error',
          text1: 'Commit Failed',
          text2: error?.message || 'Something went wrong while committing tasks',
        });
      } finally {
        setIsCommitting(false);
      }
    }
  
    if (actionType === 'delete') {
      setIsDeleting(true);
      try {
        const payload = selectedIds.map(id => ({ dayReportId: id }));
  
        const res = await deleteTaskReport({
          accessToken: EmployeeId?.authToken?.accessToken,
          data: payload,
        }).unwrap();
  
        const isSuccess = res?.isSuccessful || res?.messageDetail?.message_code === 5039;
        
        if (!isSuccess) {
          throw new Error(res?.messageDetail?.message || 'Failed to delete items');
        }
       
        setShowPlanData(prev => prev.filter(item => !selectedIds.includes(item.id)));
        setCheckedItems(prev => {
          const updated = {...prev};
          selectedIds.forEach(id => delete updated[id]);
          return updated;
        });
        await refetch();
        handleShowPlan();
        Toast.show({
          type: 'success',
          text1: 'Deleted',
          text2: `${selectedIds.length} item(s) deleted successfully.`,
        });
      } catch (error: any) {
        console.error('Delete error:', error);
        Toast.show({
          type: 'error',
          text1: 'Delete Failed',
          text2: error?.message || 'Something went wrong while deleting.',
        });
      }  finally {
        setIsDeleting(false);
      }
    }
  };
  
  
  const renderItem = ({item}: any) => {
    return (
      <Card
        style={{
          backgroundColor: isDark ? Colors.black : Colors.background,
          marginVertical: 7,
          borderColor: Colors.background,
          borderWidth: 0.5,
          marginHorizontal: 16,
        }}>
        <Card.Content>
          <View style={styles(isDark).topRow}>
            <Checkbox
              status={checkedItems[item.id] ? 'checked' : 'unchecked'}
              onPress={() => toggleCheckbox(item.id)}
              color={isDark ? Colors.secondary : Colors.primary}
              uncheckedColor={isDark ? Colors.secondary : Colors.primary}
            />
            <Text style={[styles(isDark).label, {fontSize: 16, flexShrink: 1}]}>
              {item?.toDoProject?.name ?? 'No Project Name'}
            </Text>
          </View>

          <View style={styles(isDark).row}>
            <Text style={[styles(isDark).label, {flexShrink: 1}]}>
              {item?.toDoTicketNumber} :{' '}
              <Text style={styles(isDark).value}>{item?.toDoTitle}</Text>
            </Text>
          </View>

          <View style={styles(isDark).row}>
            <Text style={[styles(isDark).value, {fontSize: 16}]}>
              Estimated Effort : {item?.taskEstimatedEffort ?? 'N/A'}
            </Text>
            <Text style={[styles(isDark).label, {fontSize: 16}]}>
              {item?.currentWorkStatusOfTask?.label ?? 'No Status'}
            </Text>
          </View>

          <View style={{marginTop: 5}}>
            <TextInput
              label="Effort to be spent today"
              value={estimatedEfforts[item.id] || ''}
              mode="outlined"
              editable={true}
              outlineColor={Colors.medium_gray}
              theme={{
                colors: {
                  primary: Colors.primary,
                  background: isDark ? Colors.gray : Colors.white,
                },
              }}
              contentStyle={{
                color: isDark ? Colors.white : Colors.black,
                fontFamily: 'Lato-Regular',
                fontSize: 14,
              }}
              placeholder="Effort hrs Must be 0.25 or greater"
              placeholderTextColor={Colors.medium_gray}
              keyboardType="numeric"
              style={[styles(isDark).input]}
              onChangeText={text =>
                setEstimatedEfforts(prev => ({...prev, [item.id]: text}))
              }
            />
            {estimatedEfforts[item.id] &&
              parseFloat(estimatedEfforts[item.id]) < 0.25 &&
              !isNaN(parseFloat(estimatedEfforts[item.id])) && (
                <Text style={{color: 'red', marginTop: 4}}>
                  Must be 0.25 or greater
                </Text>
              )}
          </View>

          <View style={{marginTop: 10, marginBottom: 10}}>
            <List.Accordion
              title={
                selectedWorkStatuses[item.id] ||
                item?.eodCommittedWorkStatus?.label ||
                'Committed EOD Status'
              }
              style={{
                backgroundColor: isDark ? Colors.gray : Colors.background,
                borderWidth: 0.5,
                borderColor: Colors.medium_gray,
                borderRadius: 1,
                height: 57,
              }}
              titleStyle={{
                color: isDark ? Colors.white : Colors.black,
                fontFamily: 'Lato-Regular',
                fontSize: 14,
              }}
              right={props => (
                <List.Icon
                  {...props}
                  icon="chevron-down"
                  color={isDark ? Colors.white : Colors.black}
                />
              )}
              expanded={!!expandedStates[item.id]}
              onPress={() =>
                setExpandedStates(prev => ({
                  ...prev,
                  [item.id]: !prev[item.id],
                }))
              }>
              {WORK_STATUS_OPTIONS.map(option => (
                <List.Item
                  key={option.value}
                  title={option.label}
                  onPress={() => {
                    setSelectedWorkStatuses(prev => ({
                      ...prev,
                      [item.id]: option.label,
                    }));
                    setExpandedStates(prev => ({
                      ...prev,
                      [item.id]: false,
                    }));
                  }}
                  right={() =>
                    selectedWorkStatuses[item.id] === option.label ? (
                      <Icon source="check" size={20} color={Colors.primary} />
                    ) : null
                  }
                  style={{
                    backgroundColor: isDark ? Colors.gray : Colors.white,
                    height: 51,
                  }}
                  titleStyle={{
                    color: isDark ? Colors.white : Colors.black,
                    fontFamily: 'Lato-Regular',
                    fontSize: 14,
                  }}
                />
              ))}
            </List.Accordion>
          </View>
        </Card.Content>
      </Card>
    );
  };

  return (
    <View style={styles(isDark).maincontainer}>
      <CustomHeader
        showBackIcon={true}
        title="View Report"
        onPress={() => navigation.goBack()}
      />
      <View style={styles(isDark).divider} />

      <Button
        mode="contained"
        onPress={() => handleTaskAction('delete')}
        loading={isDeleting}
        disabled={isDeleting}
        style={styles(isDark).showPlanButton}
        icon="delete"
        labelStyle={{color: 'white', fontFamily: 'Lato-Bold'}}>
        Delete from plan
      </Button>

      {isLoading ? (
        <ShimmerPlaceHolder />
      ) : showPlanData?.length === 0 ? (
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Text
            style={{
              color: isDark ? Colors.white : Colors.black,
              alignSelf: 'center',
              fontFamily: 'Lato-Bold',
            }}>
            No Records
          </Text>
        </View>
      ) : (
        <FlatList
          showsVerticalScrollIndicator={false}
          data={showPlanData}
          renderItem={renderItem}
          keyExtractor={(item: any, index) => item?.id || index.toString()}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          ListFooterComponent={<View style={{height: 100}} />}
        />
      )}

      <Button
        mode="contained"
        onPress={() => handleTaskAction('commit')}
        loading={isCommitting}
        disabled={isCommitting}
        style={{
          marginHorizontal: 16,
          marginBottom: 20,
          paddingVertical: 2,
          backgroundColor: Colors.primary,
          borderRadius: 3,
        }}
        labelStyle={{color: 'white', fontFamily: 'Lato-Bold'}}>
        Commit
      </Button>
    </View>
  );
};

const styles = (isDark: boolean) =>
  StyleSheet.create({
    maincontainer: {
      flex: 1,
      backgroundColor: isDark ? Colors.black : Colors.white,
    },
    divider: {
      borderWidth: 1,
      height: 1,
      backgroundColor: isDark ? Colors.white : 'transparent',
      borderColor: isDark ? Colors.black : 'transparent',
    },
    topRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginLeft: -10,
    },
    row: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginVertical: 1,
      flexWrap: 'wrap',
    },
    label: {
      fontFamily: 'Lato-Bold',
      color: isDark ? Colors.white : Colors.black,
      marginBottom: 5,
      fontSize: 14,
    },
    value: {
      fontSize: 14,
      fontFamily: 'Lato-Regular',
      color: isDark ? Colors.white : Colors.black,
      flexWrap: 'wrap',
    },
    input: {
      marginTop: 5,
    },
    showPlanButton: {
      marginTop:5,
      backgroundColor: Colors.primary,
      paddingHorizontal:5,
      borderRadius:30,
      alignSelf: 'flex-end',
      marginHorizontal: 16,
    },
    showPlanText: {
      color: Colors.white,
      fontSize: 16,
      fontFamily: 'Lato-Bold',
    },
  });

export default ShowPlan;
