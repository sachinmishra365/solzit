import {View, Text, StyleSheet, FlatList, RefreshControl} from 'react-native';
import React, {useEffect, useState} from 'react';
import CustomHeader from '../../../Components/CustomHeader';
import {useSelector} from 'react-redux';
import {isDarkTheme} from '../../../AppStore/Reducers/appState';
import {Colors} from '../../../constants/Colors';
import {Card, Divider} from 'react-native-paper';
import Toast from 'react-native-toast-message';
import ShimmerPlaceHolder from '../../Placeholder/ShimmerPlaceHolder';
import {useGetMonthlyReportPlansListQuery} from '../../../Services/workloglevel';
import EmptyData from '../../../Components/EmptyData';
import moment from 'moment';

const MyPlans = ({navigation}: any) => {
  const isDark = useSelector(isDarkTheme);
  const accessToken = useSelector((state: any) => state?.appState?.authToken);
  const connected = useSelector((state: any) => state?.appState?.connected);

  const {data, isLoading, error} = useGetMonthlyReportPlansListQuery({
    accessToken: accessToken?.authToken?.accessToken,
  });
  
  const [myPlanData, setMyPlanData] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const handleMyPlans = async () => {
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
      if (data?.data && (data as any)?.messageDetail?.message_code === 200) {
        setMyPlanData(data?.data);
      }
    } catch (error) {}
  };

  useEffect(() => {
    handleMyPlans();
  }, [data]);

  const onRefresh = () => {
    setRefreshing(true);
    handleMyPlans().finally(() => setRefreshing(false));
  };

const renderItem = ({item}: any) => (
  <Card
    style={[styles(isDark).card]}
    onPress={() => navigation.navigate('TaskDetails', {TaskDetail: item})}>
    <Card.Content>
      <View style={styles(isDark).row}>
        <Text style={[styles(isDark).taskLabel,{fontSize:16}]}>Total Tasks</Text>
        <Text style={styles(isDark).dateText}>
          {moment(item.reportDate, ['DD/MMM/YYYY', 'YYYY-MM-DD']).format( 'DD MMM YYYY',)}
        </Text>
      </View>

      <View style={styles(isDark).rowBetween}>
        <Text style={styles(isDark).totalValue}>{item.totalTask}</Text>
        <View>
          <Text style={styles(isDark).taskLabel}>{'    '}Committed Tasks{' : '}
            <Text style={styles(isDark).taskValue}>{item.commitedTask}</Text>
          </Text>
          <Text style={styles(isDark).taskLabel}>Uncommitted Tasks{' : '}
            <Text style={styles(isDark).taskValue}>{item.unCommittedTask}</Text>
          </Text>
        </View>
      </View>

      <Divider style={{marginVertical: 8}} />

      <View style={styles(isDark).row}>
        <Text style={styles(isDark).taskLabel}>
          Committed Hours{' : '}
          <Text style={styles(isDark).taskValue}>{item.committedHours}</Text>
        </Text>
        <Text style={styles(isDark).taskLabel}>
          Actual Work Log{' : '}
          <Text style={styles(isDark).taskValue}>
            {item.actualWorkLogHours}
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
        title="My Plans"
        isDark={isDark}
        onPress={() => navigation.goBack()}
      />
      {isLoading ? (
        <ShimmerPlaceHolder />
      ) : myPlanData.length === 0 ? (
        <EmptyData/>
      ) : (
        <FlatList
          data={myPlanData}
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
      marginVertical: 5,
      borderColor: Colors.white,
      borderWidth: 0.5,
      marginHorizontal: 16,
      paddingVertical: 5,
    },
    row: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    rowBetween: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginTop: 6,
    },
    dateText: {
      fontSize: 14,
      fontFamily: 'Lato-Semibold',
      color: Colors.primary,
    },
    totalValue: {
      fontSize: 20,
      fontFamily: 'Lato-Bold',
      color: isDark ? Colors.white : Colors.black,
    },
    taskLabel: {
      fontSize: 14,
      fontFamily: 'Lato-Semibold',
      color: isDark ? Colors.white : Colors.black,
      marginVertical: 2,
    },
    taskValue: {
      fontSize: 14,
      fontFamily: 'Lato-Regular',
      color: isDark ? Colors.white : Colors.black,
    },
  });

export default MyPlans;
