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
import {Card, SegmentedButtons} from 'react-native-paper';
import {Colors} from '../../constants/Colors';
import {useProcessedLeavesQuery} from '../../Services/services';
import {useSelector} from 'react-redux';
import moment from 'moment';
import CustomHeader from '../../Components/CustomHeader';
import {isDarkTheme} from '../../AppStore/Reducers/appState';
import ShimmerPlaceHolder from '../Placeholder/ShimmerPlaceHolder';
import EmptyData from '../../Components/EmptyData';

const LeaveBalance = ({navigation}: any) => {
  const [items, setItems] = useState<any>([]);
  const isDark = useSelector(isDarkTheme);

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
        (item: any) => item?.status?.label === selectedStatus,
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

  const [refreshing, setRefreshing] = useState(false);

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
        marginVertical: 5,
        borderColor: Colors.white,
        borderWidth: 0.5,
      }}>
      <Card.Content>
        <View
          style={{
            justifyContent: 'space-between',
            flexDirection: 'row',
             marginBottom: 3,
          }}>
          <Text
            style={{
              color: isDark ? Colors.white : Colors.black,
              fontSize: 14,
               fontFamily: 'Lato-Regular',
            }}>
            {item.totalDaysofLeave !== 0.5
              ? `Full Day Leave (${item?.totalDaysofLeave})`
              : `Half Day Leave (${item?.totalDaysofLeave})`}
          </Text>

          <View >
            <Text
              style={{
                color:
                  item?.status?.label === 'Applied'
                    ? Colors.primary
                    : item?.status?.label === 'Cancelled'
                    ? '#E0514D'
                    : item?.status?.label === 'Declined'
                    ? Colors.error
                    : item?.status?.label === 'Approved'
                    ? 'green'
                    : Colors.gray,
                fontSize: 14,
                fontFamily: 'Lato-Bold',
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
          marginBottom: 3,
          }}>
          <Text
            style={{
              color: isDark ? Colors.white : Colors.black,
              fontSize: 16,
              fontFamily: 'Lato-Semibold',
             
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
               fontFamily: 'Lato-Regular',
            }}>
            Absent Day{' : '} {item?.totalAbsentDays}
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
                item?.leaveType?.label === 'Earn Leave'
                  ? '#FF9800'
                  : item?.leaveType?.label === 'Loss of Pay'
                  ? Colors.error
                  : isDark
                  ? Colors.white
                  : Colors.black,
              fontSize: 14,
              fontFamily: 'Lato-Bold',
            }}>
            {item?.leaveType?.label}
          </Text>
          {item?.approver && (
            <View style={{flexDirection: 'row'}}>
              <Text
                style={{
                  color: isDark ? Colors.white : Colors.black,
                  fontSize: 14,
                  fontFamily: 'Lato-Semibold',
                }}>
                {item?.status?.value === 674180002
                  ? 'Declined By : '
                  : item?.status?.value === 674180000
                  ? 'Canceled By : '
                  : 'Approved by : '}
              </Text>
              <Text
                style={{
                  color: isDark ? Colors.white : Colors.black,
                  fontSize: 14,
                   fontFamily: 'Lato-Regular',
                }}>
                {item?.approver ? item?.approver : 'N/A'}
              </Text>
            </View>
          )}
        </View>
        {item?.declinedReason && (
          <>
            <View style={{marginVertical: 10}}>
              <Text
                style={{
                  color: isDark ? Colors.white : Colors.black,
                  fontSize: 14,
                  fontFamily: 'Lato-Bold',
                }}>
                Declined Reason :{' '}
              </Text>
              <Text
                style={{
                  color: isDark ? Colors.white : Colors.black,
                  fontSize: 14,
                  fontFamily: 'Lato-Regular',
                }}>
                {item?.declinedReason ? item?.declinedReason : 'N/A'}
              </Text>
            </View>
          </>
        )}
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

      {/* Filter Buttons */}

      <SegmentedButtons
        value={selectedStatus}
        onValueChange={filterByStatus}
        buttons={statuses.map(status => ({
          value: status,
          label: status,
          style: {
            backgroundColor:
              selectedStatus === status
                ? Colors.secondary
                : isDark
                ? Colors.black
                : Colors.white,
          },
          labelStyle: {
            color:
              selectedStatus === status
                ? Colors.white
                : isDark
                ? Colors.white
                : Colors.black,
            fontFamily: 'Lato-Bold',
            fontSize: 11,
          },
        }))}
        style={{marginVertical:10, marginHorizontal: 16}}
        theme={{
          colors: {primary: Colors.primary},
        }}
      />

      {isLoading ? (
        <ShimmerPlaceHolder />
      ) : //@ts-ignore
      filteredItems && filteredItems?.length !== 0 ? (
        <FlatList
        contentContainerStyle={{ paddingHorizontal:16 }}

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
        <EmptyData/>
      )}
    </View>
  );
};

export default LeaveBalance;
