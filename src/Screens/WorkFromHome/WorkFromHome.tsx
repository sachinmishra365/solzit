import {
  FlatList,
  PanResponder,
  RefreshControl,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {Card, SegmentedButtons} from 'react-native-paper';
import {Colors} from '../../constants/Colors';
import {useSelector} from 'react-redux';
import moment from 'moment';
import CustomHeader from '../../Components/CustomHeader';
import {isDarkTheme} from '../../AppStore/Reducers/appState';
import ShimmerPlaceHolder from '../Placeholder/ShimmerPlaceHolder';
import {useGetAllWFHRecordListQuery} from '../../Services/workFromHome';
import EmptyData from '../../Components/EmptyData';

const WorkFromHome = ({navigation}: any) => {
  const [items, setItems] = useState<any>([]);
  const isDark = useSelector(isDarkTheme);

  const [filteredItems, setFilteredItems] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState('Approved');

  const EmployeeId = useSelector((state: any) => state?.appState?.authToken);

  const statuses = ['Approved', 'Declined', 'Cancelled', 'All'];

  const {data, isLoading, isSuccess, refetch} = useGetAllWFHRecordListQuery({
    accessToken: EmployeeId.authToken?.accessToken,
  });
  console.log('data', data);

  useEffect(() => {
    if (data && isSuccess) {
      setItems(data?.data);
      setSelectedStatus('Approved');
    }
  }, [data, isSuccess]);

  useEffect(() => {
    if (selectedStatus === 'All') {
      setFilteredItems(items);
      refetch();
    } else {
      const filteredData = items?.filter(
        (item: any) => item?.status?.label === selectedStatus,
      );
      setFilteredItems(filteredData);
      refetch();
    }
  }, [items, selectedStatus]);

  const filterByStatus = (status: string) => {
    setSelectedStatus(status);
  };

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    refetch();
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  const renderItem = ({item}: any) => (
    console.log('item', item),
    (
      <Card
        style={{
          backgroundColor: isDark ? Colors.black : Colors.background,
          marginVertical: 7,
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
                color:
                  item.leaveType.label === 'Work From Home'
                    ? isDark
                      ? Colors.white
                      : Colors.black
                    : isDark
                    ? Colors.white
                    : Colors.black,
                fontSize: 16,
                fontFamily: 'Lato-Bold',
              }}>
              {item?.leaveType?.label}
            </Text>

            <View style={{}}>
              <Text
                style={{
                  color:
                    item?.status?.label === 'Cancelled'
                      ? '#E0514D'
                      : item?.status?.label === 'Declined'
                      ? Colors.error
                      : item?.status?.label === 'Approved'
                      ? 'green'
                      : Colors.gray,
                  fontSize: 16,
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
            }}>
            <Text
              style={{
                color: isDark ? Colors.white : Colors.black,
                fontSize: 14,
                fontFamily: 'Lato-Semibold',
                marginBottom: 6,
              }}>
              Start{' : '}
              {moment(item?.wfhStartDate).format('DD/MM/YYYY')}
            </Text>
            <Text
              style={{
                color: isDark ? Colors.white : Colors.black,
                fontSize: 14,
                fontFamily: 'Lato-Semibold',
              }}>
              End{' : '}
              {moment(item?.wfhEndDate).format('DD/MM/YYYY')}
            </Text>
          </View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
            }}>
            {item?.approverOrDecliner && (
              <View style={{flexDirection: 'row'}}>
                <Text
                  style={{
                    color: isDark ? Colors.white : Colors.black,
                    fontSize: 14,
                    fontFamily: 'Lato-Bold',
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
                  {item?.approverOrDecliner || ' N/A'}
                </Text>
              </View>
            )}
          </View>

          {item?.status?.value === 674180002 && (
            <>
              <View
                style={{flexDirection: 'row', flexWrap: 'wrap', marginTop: 10}}>
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
    )
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
          refetch();
        }
      } else if (gestureState.dx < 0) {
        const currentIndex = statuses.indexOf(selectedStatus);
        if (currentIndex < statuses.length - 1) {
          filterByStatus(statuses[currentIndex + 1]);
          refetch();
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
        title="Work From Home"
        onPress={() => {
          navigation.goBack();
        }}
      />
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
                ? Colors.gray
                : Colors.white,
          },
          labelStyle: {
            color:
              selectedStatus === status
                ? Colors.white
                : isDark
                ? Colors.white
                : Colors.black,
            fontFamily: 'Lato-Semibold',
            fontSize: 13,
          },
        }))}
        style={{marginVertical: 10, marginHorizontal: 16}}
        theme={{
          colors: {primary: Colors.primary},
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
      ) : //@ts-ignore
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
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <EmptyData />
      )}
    </View>
  );
};

export default WorkFromHome;
