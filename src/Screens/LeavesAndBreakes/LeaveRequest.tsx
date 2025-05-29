import { Alert, FlatList, RefreshControl, StyleSheet, Text, TouchableOpacity, View, } from 'react-native';
import React, { useEffect, useState } from 'react';
import { Card } from 'react-native-paper';
import { Colors } from '../../constants/Colors';
import { useEmployeeAppliedLeavesQuery, useEmployeeCancelLeavesMutation, } from '../../Services/services';
import { useSelector } from 'react-redux';
import moment from 'moment';
import CustomHeader from '../../Components/CustomHeader';
import Toast from 'react-native-toast-message';
import { isDarkTheme } from '../../AppStore/Reducers/appState';
import ShimmerPlaceHolder from '../Placeholder/ShimmerPlaceHolder';

const LeaveRequest = ({ navigation }: any) => {
  const [items, setItems] = useState<any>([]);
  const isDark = useSelector(isDarkTheme);

  const Assesstoken = useSelector((state: any) => state?.appState?.authToken);
  const accessToken = Assesstoken?.authToken?.accessToken;
  const connected = useSelector((state: any) => state?.appState?.connected);

  const { data, isLoading, isSuccess, refetch } = useEmployeeAppliedLeavesQuery({ accessToken: accessToken, });

  useEffect(() => {
    if (data && isSuccess && data.data !== null) {
      const sortedData: any = [...data?.data].sort((a, b) =>
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

  const renderItem = ({ item }: any) => (
    <Card
      style={styles(isDark).cardContainer}>
      <Card.Content>
        <View style={{ justifyContent: 'space-between', flexDirection: 'row' }}>
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
                  item?.status?.label === 'Applied'
                    ? Colors.primary
                    : item?.status?.label === 'Cancelled'
                      ? '#8b4315'
                      : item?.status?.label === 'Declined'
                        ? Colors.error
                        : item?.status?.label === 'Approved'
                          ? 'green'
                          : Colors.gray,
                fontSize: 16,
                fontFamily: 'Lato-Semibold',
              }}>
              {item?.status?.label}
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
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <Text
            style={{
              color:
                item?.leaveType?.label === 'Earn Leave'
                  ? '#FF9800'
                  :
                  item?.leaveType?.label === 'Loss of Pay'
                    ? Colors.error : isDark
                      ? Colors.white
                      : Colors.black,
              fontSize: 14,
              fontFamily: 'Lato-Bold',
            }}>
            {item?.leaveType?.label}
          </Text>
          <TouchableOpacity
            style={styles(isDark).btnContainer}
            disabled={result.isLoading}
            onPress={() => {
              Alert.alert(
                'Cancel Leave',
                'Are you sure you want to cancel this leave?',
                [
                  {
                    text: 'No',
                    onPress: () => { },
                    style: 'cancel',
                  },
                  {
                    text: 'Yes',
                    onPress: () => {
                      handlecancel({ item }), onRefresh();
                    },
                  },
                ],
                { cancelable: true },
              );
            }}>
            <Text
              style={styles(isDark).btntxt}>
              Cancel Leave
            </Text>
          </TouchableOpacity>
        </View>
      </Card.Content>
    </Card>
  );

  const [CanceleLeave, result] = useEmployeeCancelLeavesMutation();

  const handlecancel = async ({ item }: any) => {
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

    const data = {
      leaveApplicationId: item?.leaveApplicationId,
      leaveCancellationMessage: '',
    };
    try {
      const response = await CanceleLeave({ data, accessToken });
      if (response?.data?.isSuccessful === true) {
        Toast.show({
          type: 'success',
          text1: 'Leave Status',
          text2: 'Leave cancelled Successfully',
          topOffset: 80,
          visibilityTime: 5000,
        });
      }
    } catch (error) { }
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
      {isLoading ? (
        <ShimmerPlaceHolder />
      ) : data?.data === null ? (
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
          style={{ marginHorizontal: 16 }}
          data={items}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => onRefresh()}
            />
          }
          renderItem={item => renderItem(item)}
          keyExtractor={(item, index) => index.toString()}
          ListFooterComponent={<View style={{ height: 100 }} />}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
};

export default LeaveRequest;


const styles = (isDark: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: isDark ? Colors.black : Colors.white,
  },
  cardContainer: {
    backgroundColor: isDark ? Colors.black : Colors.background,
    marginVertical: 7,
    borderColor: Colors.background,
    borderWidth: 0.5,
    marginHorizontal: 5,
  },
  btnContainer: {
    height: 'auto',
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignSelf: 'center',
    borderRadius: 3,
    minHeight: 25,
    alignItems: 'center',
    flexDirection: 'row',
  },
  btntxt: {
    textAlign: 'center',
    fontFamily: 'Lato-Bold',
    color: Colors.white,
    flexWrap: 'wrap',
    margin: 12,
  }
});
