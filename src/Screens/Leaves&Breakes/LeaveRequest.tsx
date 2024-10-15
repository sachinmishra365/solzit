import {
  Alert,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {Card} from 'react-native-paper';
import {SCREEN_WIDTH} from '../../constants/Screen';
import {Colors} from '../../constants/Colors';
import {
  useEmployeeAppliedLeavesQuery,
  useEmployeeCancelLeavesMutation,
} from '../../Services/services';
import {useSelector} from 'react-redux';
import moment from 'moment';
import CustomHeader from '../../Components/CustomHeader';
import Placeholder from '../Placeholder/Placeholder';
import Toast from 'react-native-toast-message';
import {isDarkTheme} from '../../AppStore/Reducers/appState';
import ShimmerPlaceHolder from '../Placeholder/ShimmerPlaceHolder';

const LeaveRequest = ({navigation}: any) => {
  const [items, setItems] = useState<any>([]);
  const isDark = useSelector(isDarkTheme);

  const EmployeeId = useSelector((state: any) => state?.appState?.authToken);

  const {data, isLoading, isSuccess, refetch} = useEmployeeAppliedLeavesQuery({
    ids: EmployeeId?.userProfile?.userId || null,
  });

  useEffect(() => {
    if (data && data !== undefined && data.Data !== null) {
      const sortedData: any = [...data?.Data].sort((a, b) =>
        moment(a.leaveStartDate).isBefore(moment(b?.leaveStartDate)) ? -1 : 1,
      );
      setItems(sortedData);
    }
  }, [data]);

  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
      refetch();
    }, 1000);
  }, [refetch]);

  const renderItem = ({item}: any) => (
    <Card
      style={{
        backgroundColor: isDark ? Colors.black : Colors.background,
        marginVertical: 10,
        borderColor: Colors.background,
        borderWidth: 0.5,
        marginHorizontal: 5,
      }}>
      <Card.Content>
        <View style={{justifyContent: 'space-between', flexDirection: 'row'}}>
          <Text
            style={{
              color: isDark ? Colors.white : Colors.black,
              fontSize: 14,
              fontFamily: 'Lato-Semibold',
            }}>
            {item.totalDaysofLeave !== 0.5
              ? `Full Day Leave (${item?.totalDaysofLeave})`
              : `Half Day Leave (${item?.totalDaysofLeave})`}
          </Text>

          <View style={{}}>
            <Text
              style={{
                color:
                  item?.Status?.Label === 'Applied'
                    ? Colors.primary
                    : item?.Status?.Label === 'Cancelled'
                    ? '#8b4315'
                    : item?.Status?.Label === 'Declined'
                    ? Colors.error
                    : item?.Status?.Label === 'Approved'
                    ? 'green'
                    : Colors.gray,
                fontSize: 16,
                fontFamily: 'Lato-Semibold',
              }}>
              {item?.Status?.Label}
            </Text>
          </View>
        </View>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
          }}>
          <Text
            style={{
              color: isDark ? Colors.white : Colors.black,
              fontSize: 18,
              fontFamily: 'Lato-Bold',
              marginBottom: 6,
            }}>
            {item?.leaveStartDate === item?.leaveEndDate
              ? moment(item?.leaveStartDate).format('ddd, DD MMM')
              : `${moment(item?.leaveStartDate).format(
                  'ddd, DD MMM',
                )} - ${moment(item?.leaveEndDate).format('ddd, DD MMM')}`}
          </Text>
          <Text
            style={{
              color: isDark ? Colors.white : Colors.black,
              fontSize: 14,
              fontFamily: 'Lato-Semibold',
            }}>
            Absent Day: {item.totalAbsentDays}
          </Text>
        </View>
        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
          <Text
            style={{
              color:
                item?.leaveType?.Label === 'Earn Leave'
                  ? isDark
                    ? Colors.white
                    : Colors.black
                  : isDark
                  ? Colors.white
                  : Colors.black,
              fontSize: 14,
              fontFamily: 'Lato-Semibold',
            }}>
            {item?.leaveType?.Label}
          </Text>
          <TouchableOpacity
            style={{
              width: SCREEN_WIDTH - 280,
              height: 'auto',
              backgroundColor: Colors.primary,
              justifyContent: 'center',
              alignSelf: 'center',
              borderRadius: 3,
              minHeight: 33,
            }}
            disabled={result.isLoading}
            onPress={() => {
              Alert.alert(
                'Cancel Leave',
                'Are you sure you want to cancel this leave?',
                [
                  {
                    text: 'No',
                    onPress: () => console.log('Cancel Pressed'),
                    style: 'cancel',
                  },
                  {
                    text: 'Yes',
                    onPress: () => {
                      handlecancel({item}), onRefresh();
                    },
                  },
                ],
                {cancelable: true},
              );
            }}>
            <Text
              style={{
                textAlign: 'center',
                fontFamily: 'Lato-Bold',
                color: Colors.white,
                flexWrap: 'wrap',
              }}>
              Cancel Leave
            </Text>
          </TouchableOpacity>
        </View>
      </Card.Content>
    </Card>
  );

  const [CanceleLeave, result] = useEmployeeCancelLeavesMutation();

  const handlecancel = async ({item}: any) => {
    const param = {
      employee: {
        email: item?.employee?.email,
        fullName: item?.employee?.fullName,
        firstName: item?.employee?.firstName,
        lastName: item?.employee?.lastName,
        passwordSalt: item?.employee?.passwordSalt,
        passwordHash: item?.employee?.passwordHash,
        oldpassword: item?.employee?.oldpassword,
        newpassword: item?.employee?.newpassword,
        password: item?.employee?.password,
        ID: item?.employee?.ID,
        Name: item?.employee?.Name,
      },
      leaveApplicationId: item?.leaveApplicationId,
      leaveType: {
        Value: item?.leaveType?.Value,
        Label: item?.leaveType?.Label,
      },
      typeofHalfDayLeave: item?.typeofHalfDayLeave,
      leaveStartDate: item?.leaveStartDate,
      leaveEndDate: item?.leaveEndDate,
      totalDaysofLeave: item?.totalDaysofLeave,
      totalAbsentDays: item?.totalAbsentDays,
      appliedOn: item?.appliedOn,
      actionedOn: item?.actionedOn,
      approver: item?.approver,
      Status: {
        Value: item?.Status?.Value,
        Label: item?.Status?.Label,
      },
      leaveDayType: {
        Value: item?.leaveDayType?.Value,
        Label: item?.leaveDayType?.Label,
      },
      resultdate: item?.resultdate,
      leaveCancellationMessage: item?.leaveCancellationMessage,
      Month: item?.Month,
      EarnedLeave: item?.EarnedLeave,
      MedicalLeave: item?.MedicalLeave,
      OptionalLeaveBalance: item?.OptionalLeaveBalance,
      TotalPayDays: item?.TotalPayDays,
      DeficientHours: item?.DeficientHours,
      Year: item?.Year,
      MonthlySalarySlipId: item?.MonthlySalarySlipId,
      IsSettled: item?.IsSettled,
      ProcessedStatus: item?.ProcessedStatus,
      OptionalLeaveRemaining: item?.OptionalLeaveRemaining,
      otherleavesremaining: item?.otherleavesremaining,
      otherleavesbalance: item?.otherleavesbalance,
      otherleavesavailed: item?.otherleavesavailed,
      optionalleavesavailed: item?.optionalleavesavailed,
      medicalleaveremaining: item?.medicalleaveremaining,
      medicalleaveavailed: item?.medicalleaveavailed,
      earnleaveremaining: item?.earnleaveremaining,
      earnleaveavailed: item?.earnleaveavailed,
      NoOfLate: item?.NoOfLate,
      LopLates: item?.LopLates,
      TotalLowHrsLess8: item?.TotalLowHrsLess8,
      LopLowHrsLess8: item?.LopLowHrsLess8,
      TotalLowHrs3_5: item?.TotalLowHrs3_5,
      LopLowHrs3_5: item?.LopLowHrs3_5,
      TotalLowHrsLess3: item?.TotalLowHrsLess3,
      LopLowHrsLess3: item?.LopLowHrsLess3,
      TotalLossOfPay: item?.TotalLossOfPay,
      Date: item?.Date,
      totalDays: item?.totalDays,
      totallopleave: item?.totallopleave,
      months: item?.months,
      ID: item?.ID,
      Name: item?.Name,
    };
    try {
      const response = await CanceleLeave(param);
      Toast.show({
        type: 'success',
        text1: 'Leave Status',
        text2: 'Leave cancelled Successfully', //response.data.Message
        topOffset: 80,
        visibilityTime: 5000,
      });
    } catch (error) {}
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: isDark ? Colors.black : Colors.white,
      }}>
      <CustomHeader
        showBackIcon={true}
        title="My Leave Requests"
        onPress={() => {
          navigation.goBack();
        }}
      />
      <View
        style={{
          borderWidth: 1,
          height: 1,
          backgroundColor: isDark ? Colors.white : 'transparent',
          borderColor: isDark ? Colors.black : 'transparent',
        }}
      />
      {isLoading ? (
        <ShimmerPlaceHolder />
      ) : data?.Data === null ? (
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
          style={{marginHorizontal: 16}}
          data={items}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => onRefresh()}
            />
          }
          renderItem={item => renderItem(item)}
          keyExtractor={(item, index) => index.toString()}
          ListFooterComponent={<View style={{height: 100}} />}
          ListEmptyComponent={
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
                }}>
                No Records
              </Text>
            </View>
          }
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
};

export default LeaveRequest;

const styles = (isDark: any) => StyleSheet.create({});
