import { FlatList, PanResponder, RefreshControl, StyleSheet, Text, TouchableOpacity, View, } from 'react-native';
import React, { useEffect, useState } from 'react';
import { Card, Icon, IconButton, SegmentedButtons } from 'react-native-paper';
import { Colors } from '../../constants/Colors';
import { useSelector } from 'react-redux';
import moment from 'moment';
import CustomHeader from '../../Components/CustomHeader';
import { isDarkTheme } from '../../AppStore/Reducers/appState';
import ShimmerPlaceHolder from '../Placeholder/ShimmerPlaceHolder';
import { useGetAllWFHRecordListQuery } from '../../Services/workFromHome';
import EmptyData from '../../Components/EmptyData';

const WorkFromHome = ({ navigation }: any) => {
  const [items, setItems] = useState<any>([]);
  const isDark = useSelector(isDarkTheme);

  const [filteredItems, setFilteredItems] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState('Approved');

  const EmployeeId = useSelector((state: any) => state?.appState?.authToken);

  const statuses = ['Approved', 'Declined', 'Cancelled', 'All'];

  const { data, isLoading, isSuccess, refetch } = useGetAllWFHRecordListQuery({
    accessToken: EmployeeId.authToken?.accessToken,
  });

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
    refetch();

  }, [items, selectedStatus]);

  const filterByStatus = (status: string) => {
    setSelectedStatus(status);
    refetch();

  };

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    refetch();
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  
  const getStatusStyle = (status: string) => {
  switch (status) {
    case 'Approved':
      return { color: '#28a745', backgroundColor: 'rgba(40,167,69,0.15)', icon: 'check-circle' };
    case 'Declined':
      return { color: '#dc3545', backgroundColor: 'rgba(220,53,69,0.15)', icon: 'close-circle' };
    case 'Cancelled':
      return { color: '#E0514D', backgroundColor: 'rgba(224,81,77,0.15)', icon: 'cancel' };
    default:
      return { color: '#6c757d', backgroundColor: 'rgba(108,117,125,0.15)', icon: 'help-circle' };
  }
  };

   const renderItem = ({ item }: any) => {
    const statusStyle = getStatusStyle(item?.status?.label);

    return (
      <Card
        style={[
           styles(isDark).card,
          { backgroundColor: isDark ? Colors.black : Colors.background },
        ]}>
        <Card.Content>

          <View style={ styles(isDark).row}>
            <View>
              <Text
                 style={styles(isDark).label}>
                Start Date
              </Text>
              <Text
                 style={styles(isDark).value}>
                {moment(item?.wfhStartDate).format('D MMM, YYYY')}
              </Text>
            </View>

            {item?.approverOrDecliner && (
              <View >
                <Text
                   style={styles(isDark).label}>
                  {item?.status?.value === 674180002
                    ? 'Declined By'
                    : item?.status?.value === 674180000
                    ? 'Canceled By'
                    : 'Approved By'}
                </Text>
                <Text
                   style={styles(isDark).value}>
                  {item?.approverOrDecliner || 'N/A'}
                </Text>
              </View>
            )}
          </View>


          <View style={ styles(isDark).row}>
            <View>
              <Text
                 style={styles(isDark).label}>
                End Date
              </Text>
              <Text
               style={styles(isDark).value}>
                {moment(item?.wfhEndDate).format('D MMM, YYYY')}
              </Text>
            </View>

            <View
              style={[
                 styles(isDark).statusContainer,
                { backgroundColor: statusStyle.backgroundColor },
              ]}>
              <IconButton
                icon={statusStyle.icon}
                size={14}
                iconColor={statusStyle.color}
                style={ styles(isDark).statusIcon}
              />
              <Text
                style={[
                  styles(isDark).statusText,
                  { color: statusStyle.color },
                ]}>
                {item?.status?.label}
              </Text>
            </View>
          </View>
           {item?.status?.value === 674180002 && (
            <>
              <View
                style={{ flexDirection: 'row', flexWrap: 'wrap',  }}>
                <Text
                  style={[styles(isDark).label,{ marginTop: 4 ,fontFamily: 'Lato-Bold',}]}>
                  Declined Reason{' : '}
                </Text>
                <Text  style={[styles(isDark).label,{ marginTop: 4}]}>{item?.declinedReason ? item?.declinedReason : 'N/A'}
                </Text>
              </View>
            </>
          )}
        </Card.Content>
      </Card>
    );
  };

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
        style={{ marginVertical: 10, marginHorizontal: 16 }}
        theme={{
          colors: { primary: Colors.primary },
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
            ListFooterComponent={<View style={{ height: 100 }} />}
            showsVerticalScrollIndicator={false}
          />
        ) : (
          <EmptyData />
        )}
    </View>
  );
};

const styles = (isDark: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
    },
    card: {
      backgroundColor: isDark ? Colors.black : Colors.background,
      marginTop: 10,
      borderColor: Colors.white,
      borderWidth: 0.5,
    },
    row: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    label: {
      fontSize: 14,
      fontFamily: 'Lato-Regular',
      color: isDark ? Colors.white : Colors.black
    },
    value: {
      fontSize: 14,
      fontFamily: 'Lato-Bold',
      marginBottom: 4,
      color: isDark ? Colors.white : Colors.black
    },
    statusContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 10,
      borderRadius: 8,

    },
    statusIcon: {
      marginRight: -3,
       marginLeft: -7 ,
    },
    statusText: {
      fontSize: 14,
      fontFamily: 'Lato-Bold',
    },
    
  });

export default WorkFromHome;
