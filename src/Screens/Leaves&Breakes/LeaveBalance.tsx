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

const LeaveBalance = ({navigation}: any) => {
  const [items, setItems] = useState(null);
  const [filteredItems, setFilteredItems] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState('All');
  const EmployeeId = useSelector((state: any) => state?.appState?.authToken);
  const statuses = ['All', 'Cancelled', 'Declined', 'Approved'];


  const {data, isLoading, refetch} = useProcessedLeavesQuery({
    Id: EmployeeId?.data?.Data?.ID,
  });

  useEffect(() => {
    if (data && data !== undefined) {
      setItems(data.Data);
      setFilteredItems(data.Data); // Initialize filtered items
    }
  }, [items]);

  const filterByStatus = (status: string) => {
    setSelectedStatus(status);
    if (status === 'All') {
      setFilteredItems(items);
    } else {
      const filteredData = items.filter(
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
        backgroundColor: Colors.black,
        marginVertical: 10,
        // paddingHorizontal: 16,
        borderColor: Colors.white,
        borderWidth: 0.5,
      }}>
      <Card.Content>
        <View
          style={{
            justifyContent: 'space-between',
            flexDirection: 'row',
          }}>
          <Text style={{color: Colors.white, fontSize: 14, fontWeight: '600'}}>
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
                fontWeight: 'bold',
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
              color: Colors.white,
              fontSize: 18,
              fontWeight: '600',
              marginBottom: 6,
            }}>
            {item?.leaveStartDate === item?.leaveEndDate
              ? moment(item?.leaveStartDate).format('ddd, DD MMM')
              : `${moment(item?.leaveStartDate).format(
                  'ddd, DD MMM',
                )} - ${moment(item?.leaveEndDate).format('ddd, DD MMM')}`}
          </Text>
          <Text style={{color: Colors.white, fontSize: 14, fontWeight: '600'}}>
            Absent Day: {item.totalAbsentDays}
          </Text>
        </View>
        <View style={{flexDirection: 'row', justifyContent: 'space-between',flexWrap: 'wrap',}}>
          <Text
            style={{
              color:
                item.leaveType.Label === 'Earn Leave' ? 'white' : Colors.white,
              fontSize: 14,
              fontWeight: '600',
            }}>
            {item.leaveType.Label}
          </Text>
          <Text style={{color: Colors.white, fontSize: 14, fontWeight: '600'}}>
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
    <View style={{flex: 1, backgroundColor: Colors.black}} {...panResponder.panHandlers}>
      <CustomHeader
        showBackIcon={true}
        title="Processed Leaves"
        onPress={() => {
          navigation.goBack();
        }}
      />
      <View
        style={{borderWidth: 1, backgroundColor: Colors.white, height: 1}}
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
                selectedStatus === status ? Colors.primary : Colors.gray,
              paddingHorizontal: 10,
              paddingVertical: 5,
              borderRadius: 20,
            }}
            onPress={() => filterByStatus(status)}>
            <Text style={{color: Colors.white, fontWeight: '600'}}>
              {status}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      
      <View
        style={{borderWidth: 1, backgroundColor: Colors.white, height: 1}}
      />
      {isLoading ? (
        <Placeholder />
      ) : 
      filteredItems && filteredItems?.length !== 0 ? (
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
        />
      ) : (
        <View style={{flex: 1, justifyContent: 'center'}}>
          <Text style={{color: Colors.white, alignSelf: 'center'}}>
            No Records
          </Text>
        </View>
      )}
    </View>
  );
};

export default LeaveBalance;

const styles = StyleSheet.create({});
