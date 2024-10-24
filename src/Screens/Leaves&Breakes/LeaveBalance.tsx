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
import {Colors} from '../../constants/Colors';
import {useProcessedLeavesQuery} from '../../Services/services';
import {useSelector} from 'react-redux';
import moment from 'moment';
import CustomHeader from '../../Components/CustomHeader';
import {isDarkTheme} from '../../AppStore/Reducers/appState';
import ShimmerPlaceHolder from '../Placeholder/ShimmerPlaceHolder';

const LeaveBalance = ({navigation}: any) => {
  const [items, setItems] = useState([]);
  const isDark = useSelector(isDarkTheme);
  console.log(JSON.stringify(items));

  const [filteredItems, setFilteredItems] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState('Approved');
  const EmployeeId = useSelector((state: any) => state?.appState?.authToken);

  const statuses = ['Approved', 'Declined', 'Cancelled', 'All'];

  const {data, isLoading, isSuccess, refetch} = useProcessedLeavesQuery({
    data_ID: EmployeeId?.userProfile?.userId || null,
    accessToken: EmployeeId.authToken?.accessToken,
  });

  useEffect(() => {
    if (data && isSuccess) {
      setItems(data?.data);
    }
  }, [data, isSuccess]);
  
  useEffect(() => {
    if (selectedStatus === 'All') {
      setFilteredItems(items);
    } else {
      const filteredData = items?.filter(
        (item: any) => item?.status?.label === selectedStatus
      );
      setFilteredItems(filteredData);
    }
  }, [items, selectedStatus]);
  
  useEffect(() => {
    if (data && isSuccess) {
      setSelectedStatus('Approved'); 
    }
  }, [data, isSuccess]);
  
  const filterByStatus = (status: string) => {
    setSelectedStatus(status);
  };


  // useEffect(() => {
  //   if (data && isSuccess) {
  //     setItems(data?.data);
  //       const approvedLeaves = items?.filter(
  //         (item: any) => item?.status?.label === 'Approved',
  //       );
  //       console.log(approvedLeaves);
  //       setFilteredItems(approvedLeaves);
      
  //   }
  // }, [data]);

  // const filterByStatus = (status: string) => {
  //   setSelectedStatus(status);
  //   if (status === 'All') {
  //     setFilteredItems(items);
  //   } else {
  //     const filteredData = items?.filter(
  //       (item: any) => item.status.label === status,
  //     );
  //     setFilteredItems(filteredData);
  //   }
  // };

  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
      refetch();
    }, 2000);
  }, []);

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
                  item.status.label === 'Applied'
                    ? Colors.primary
                    : item.status.label === 'Cancelled'
                    ? '#b55d0b'
                    : item.status.label === 'Declined'
                    ? Colors.error
                    : item.status.label === 'Approved'
                    ? 'green'
                    : Colors.gray,
                fontSize: 16,
                fontFamily: 'Lato-Bold',
              }}>
              {item.status.label}
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
                item.leaveType.label === 'Earn Leave'
                  ? isDark
                    ? Colors.white
                    : Colors.black
                  : isDark
                  ? Colors.white
                  : Colors.black,
              fontSize: 14,
              fontFamily: 'Lato-Bold',
            }}>
            {item.leaveType.label}
          </Text>
          {item?.approver && (
            <View style={{flexDirection: 'row'}}>
              <Text
                style={{
                  color: isDark ? Colors.white : Colors.black,
                  fontSize: 14,
                  fontFamily: 'Lato-Bold',
                }}>
                Approved by :{' '}
              </Text>
              <Text
                style={{
                  color: isDark ? Colors.white : Colors.black,
                  fontSize: 14,
                  fontFamily: 'Lato-Bold',
                }}>
                {item?.approver ? item?.approver : 'N/A'}
              </Text>
            </View>
          )}
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
        const currentIndex = statuses.indexOf(selectedStatus);
        if (currentIndex > 0) {
          filterByStatus(statuses[currentIndex - 1]);
        }
      } else if (gestureState.dx < 0) {
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
