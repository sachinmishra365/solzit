import {View, Text, StyleSheet, FlatList, RefreshControl} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useSelector} from 'react-redux';
import {isDarkTheme} from '../../AppStore/Reducers/appState';
import CustomHeader from '../../Components/CustomHeader';
import {Colors} from '../../constants/Colors';
import {useEmployeeAttendanceListMutation} from '../../Services/services';
import Toast from 'react-native-toast-message';
import ShimmerPlaceHolder from '../Placeholder/ShimmerPlaceHolder';
import {Card} from 'react-native-paper';
import moment from 'moment';
import EmptyData from '../../Components/EmptyData';

const LateArrivalTime = ({navigation}: any) => {
  const isDark = useSelector(isDarkTheme);
  const EmployeeId = useSelector((state: any) => state?.appState?.authToken);
  const connected = useSelector((state: any) => state?.appState?.connected);
  const [latearrival, {isLoading}] = useEmployeeAttendanceListMutation();

  const [lateData, setLateData] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const currentMonth = new Date().getMonth() + 1;
  const currentYear = new Date().getFullYear();

  const handleLateArrival = async () => {
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
      const response = await latearrival({
        accessToken: EmployeeId?.authToken?.accessToken,
        data: {
          month: {value: currentMonth, label: 'string'},
          year: {value: currentYear, label: 'string'},
        },
      }).unwrap();


      if (response?.messageDetail?.message_code === 200) {
        const filteredData = response?.data
          ?.filter((item: any) => item?.isLate)
          ?.sort(
            (a: any, b: any) =>
              new Date(b.date).getTime() - new Date(a.date).getTime(),
          );

        setLateData(filteredData || []);
      } else {
        console.log('Unexpected response code or missing data');
      }
    } catch (error: any) {
      Toast.show({
        type: 'error',
        text1: 'Failed to fetch data',
        text2: error?.message || 'Something went wrong',
        topOffset: 80,
      });
    }
  };

  useEffect(() => {
    handleLateArrival();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    handleLateArrival().finally(() => setRefreshing(false));
  };

  const renderItem = ({item}: any) => (
    <Card style={styles(isDark).card}>
      <Card.Content>
        <View style={styles(isDark).row}>
        <Text style={styles(isDark).label}>
            Time{' - '} In{' : '}
            <Text style={styles(isDark).value}>
              {item?.inTime ? moment(item?.inTime).format('h:mm A') : 'N/A'}
            </Text>{' '}{' | '}
            <Text style={styles(isDark).label}>
              Out{' : '}
              <Text style={styles(isDark).value}>
                {item?.outTime ? moment(item?.outTime).format('h:mm A') : 'N/A'}
              </Text>
            </Text>
            
          </Text>
          <Text
            style={{
              color: item?.isLate ? Colors.error :  Colors.green ,
              fontFamily: 'Lato-Bold',
              fontSize: 16,
            }}>
            {item?.isLate ? 'Late' : 'OnTime'}
          </Text>
        </View>
        <View style={styles(isDark).row}>
          <Text
            style={[
              styles(isDark).label,
              {
                fontSize: 16,
              },
            ]}>
            {item?.isPresent ? 'Present' : 'Absent'}
          </Text>
          <Text
            style={[
              {fontSize: 16, color: Colors.primary, fontFamily: 'Lato-Bold'},
            ]}>
            {item?.date ? moment(item?.date).format('DD MMM YYYY') : '—'}
          </Text>
        </View>

        <View style={styles(isDark).row}>
        <Text>
            <Text style={styles(isDark).label}>
              Punch In/Out{' : '}
              <Text style={styles(isDark).value}>
                {item?.hoursPunchInOutTime}
              </Text>
            </Text>
          </Text>
          <Text style={styles(isDark).label}>
            Deficient Hours{' : '}
            <Text style={styles(isDark).value}>
              {item?.deficientHours ?? 0}
            </Text>
          </Text>
        </View>

        
      </Card.Content>
    </Card>
  );

  return (
    <View style={styles(isDark).mainContainer}>
      <CustomHeader
        showBackIcon={true}
        title="Late Arrival Time"
        isDark={isDark}
        onPress={() => navigation.goBack()}
      />
      {isLoading ? (
        <ShimmerPlaceHolder />
      ) : lateData?.length === 0 ? (
       <EmptyData/>
      ) : (
        <FlatList
          data={lateData}
          showsVerticalScrollIndicator={false}
          keyExtractor={(item, index) => index.toString()}
          renderItem={renderItem}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          ListFooterComponent={<View style={{height: 100}} />}
        />
      )}
    </View>
  );
};

const styles = (isDark: boolean) =>
  StyleSheet.create({
    mainContainer: {
      flex: 1,
      backgroundColor: isDark ? Colors.black : Colors.white,
    },
    card: {
      backgroundColor: isDark ? Colors.black : Colors.background,
      marginVertical: 7,
      borderColor: Colors.background,
      borderWidth: 0.5,
      marginHorizontal: 16,
      overflow: 'hidden',
    },
    row: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 5,
      flexWrap: 'wrap',
    },
    label: {
      fontFamily: 'Lato-Semibold',
      color: isDark ? Colors.white : Colors.black,
    },
    value: {
      fontSize: 14,
      fontFamily: 'Lato-Regular',
      color: isDark ? Colors.white : Colors.black,
    },
  });

export default LateArrivalTime;
