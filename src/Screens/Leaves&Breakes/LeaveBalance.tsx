import {
  FlatList,
  PanResponder,
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
  useProcessedLeavesQuery,
} from '../../Services/services';
import {useSelector} from 'react-redux';
import moment from 'moment';
import CustomHeader from '../../Components/CustomHeader';
import Placeholder from '../Placeholder/Placeholder';
import {isDarkTheme} from '../../AppStore/Reducers/appState';
import ShimmerPlaceHolder from '../Placeholder/ShimmerPlaceHolder';

const LeaveBalance = ({navigation}: any) => {
  const [items, setItems] = useState(null);
  const isDark = useSelector(isDarkTheme);

  const [filteredItems, setFilteredItems] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState('All');
  const EmployeeId = useSelector((state: any) => state?.appState?.authToken);
  // const statuses = ['All', 'Cancelled', 'Declined', 'Approved'];
  const statuses = ['Approved', 'Declined', 'Cancelled', 'All'];

  const {data, isLoading, refetch} = useProcessedLeavesQuery({
    Id: EmployeeId?.userProfile?.userId || null,
  });

  useEffect(() => {
    if (data && data !== undefined) {
      setItems(data.Data);
      setFilteredItems(data.Data);
    }
  }, [data]);
  // useEffect(() => {
  //   if (data && data !== undefined) {
  //     setItems(data.Data);
  //     const approvedLeaves = data?.Data?.filter(
  //       (item: any) => item.Status.Label === 'Approved',
  //     );
  //     setFilteredItems(approvedLeaves);
  //   }
  // }, [data]);

  const filterByStatus = (status: string) => {
    setSelectedStatus(status);
    if (status === 'All') {
      setFilteredItems(items);
    } else {
      const filteredData = items?.filter(
        (item: any) => item.Status.Label === status,
      );
      setFilteredItems(filteredData);
    }
  };

  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
      refetch();
    }, 2000);
  }, []);

  const renderItem = ({item}: any) => (
    // console.log(item),
    <Card
      style={{
        backgroundColor: isDark ? Colors.black : Colors.background,
        marginVertical: 10,
        // paddingHorizontal: 16,
        borderColor: Colors.background,
        borderWidth: 0.5,
        marginHorizontal: 5,
      }}>
      <Card.Content>
        <View
          style={{
            justifyContent: 'space-between',
            flexDirection: 'row',
          }}>
          <Text
            style={{
              color: isDark ? Colors.white : Colors.black,
              fontSize: 14,
              fontFamily: 'Lato-Bold',
            }}>
            {item.totalDaysofLeave !== 0.5
              ? `Full Day Leave (${item.totalDaysofLeave})`
              : `Half Day Leave (${item.totalDaysofLeave})`}
          </Text>

          <View style={{}}>
            <Text
              style={{
                color:
                  item.Status.Label === 'Applied'
                    ? Colors.primary
                    : item.Status.Label === 'Cancelled'
                    ? '#8b4315'
                    : item.Status.Label === 'Declined'
                    ? Colors.error
                    : item.Status.Label === 'Approved'
                    ? 'green'
                    : Colors.gray,
                fontSize: 16,
                fontFamily: 'Lato-Bold',
              }}>
              {item.Status.Label}
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
              fontFamily: 'Lato-Bold',
            }}>
            Absent Day: {item.totalAbsentDays}
          </Text>
        </View>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
          }}>
          <Text
            style={{
              color:
                item.leaveType.Label === 'Earn Leave'
                  ? isDark
                    ? Colors.white
                    : Colors.black
                  : isDark
                  ? Colors.white
                  : Colors.black,
              fontSize: 14,
              fontFamily: 'Lato-Bold',
            }}>
            {item.leaveType.Label}
          </Text>
          <Text
            style={{
              color: isDark ? Colors.white : Colors.black,
              fontSize: 14,
              fontFamily: 'Lato-Bold',
            }}>
            Approved by: {item?.approver?.Name ? item?.approver?.Name : 'N/A'}
          </Text>
        </View>
      </Card.Content>
    </Card>
  );

  const panResponder = PanResponder.create({
    onMoveShouldSetPanResponder: (evt, gestureState) => {
      return Math.abs(gestureState.dx) > 20;
    },
    onPanResponderRelease: (evt, gestureState) => {
      if (gestureState.dx > 0) {
        // Swiped right
        const currentIndex = statuses.indexOf(selectedStatus);
        if (currentIndex > 0) {
          filterByStatus(statuses[currentIndex - 1]);
        }
      } else if (gestureState.dx < 0) {
        // Swiped left
        const currentIndex = statuses.indexOf(selectedStatus);
        if (currentIndex < statuses.length - 1) {
          filterByStatus(statuses[currentIndex + 1]);
        }
      }
    },
  });

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: isDark ? Colors.black : Colors.white,
      }}
      {...panResponder.panHandlers}>
      <CustomHeader
        showBackIcon={true}
        title="Processed Leaves"
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

      {/* Filter Buttons */}

      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-around',
          marginVertical: 10,
        }}>
        {statuses.map(status => (
          <TouchableOpacity
            key={status}
            style={{
              backgroundColor:
                selectedStatus === status
                  ? Colors.primary
                  : isDark
                  ? Colors.gray
                  : Colors.white,
              paddingHorizontal: 10,
              paddingVertical: 5,
              borderRadius: 20,
            }}
            onPress={() => filterByStatus(status)}>
            <Text
              style={{
                color: isDark
                  ? Colors.white
                  : selectedStatus === status
                  ? Colors.white
                  : Colors.black,
                fontFamily: 'Lato-Bold',
              }}>
              {status}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

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
      ) : filteredItems && filteredItems?.length !== 0 ? (
        <FlatList
          style={{marginHorizontal: 16}}
          data={filteredItems}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => onRefresh()}
            />
          }
          renderItem={item => renderItem(item)}
          keyExtractor={(item, index) => index.toString()}
          ListFooterComponent={<View style={{height: 100}} />}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={{flex: 1, justifyContent: 'center'}}>
          <Text
            style={{
              color: isDark ? Colors.white : Colors.black,
              alignSelf: 'center',
              fontFamily: 'Lato-Bold',
            }}>
            No Records
          </Text>
        </View>
      )}
    </View>
  );
};

export default LeaveBalance;

const styles = (isDark: any) => StyleSheet.create({});
