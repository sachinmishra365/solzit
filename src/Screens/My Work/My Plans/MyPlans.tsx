import {View, Text, StyleSheet, FlatList, RefreshControl} from 'react-native';
import React, {useEffect, useState} from 'react';
import CustomHeader from '../../../Components/CustomHeader';
import {useSelector} from 'react-redux';
import {isDarkTheme} from '../../../AppStore/Reducers/appState';
import {Colors} from '../../../constants/Colors';
import {Card} from 'react-native-paper';
import Toast from 'react-native-toast-message';
import ShimmerPlaceHolder from '../../Placeholder/ShimmerPlaceHolder';
import {useGetMonthlyReportPlansListQuery} from '../../../Services/workloglevel';

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
      style={{
        backgroundColor: isDark ? Colors.black : Colors.background,
        marginVertical: 7,
        borderColor: Colors.white,
        borderWidth: 0.5,
        marginHorizontal: 16,
        overflow: 'hidden',
      }}
      onPress={() => navigation.navigate('TaskDetails', {TaskDetail: item})}>
      <Card.Content>
        <View style={styles(isDark).rowContainer}>
          <Text style={[styles(isDark).dateText, {}]}>
            Total Tasks{' : '}
            {item.totalTask}
          </Text>
          <Text style={styles(isDark).dateText}>{item.reportDate}</Text>
        </View>
        <View style={styles(isDark).rowContainer}>
          <Text style={styles(isDark).taskText}>
            <Text
              style={[styles(isDark).taskText, {fontFamily: 'Lato-Semibold'}]}>
              Committed Tasks{' : '}
            </Text>
            {item.commitedTask}
          </Text>
          <Text style={styles(isDark).taskText}>
            <Text
              style={[styles(isDark).taskText, {fontFamily: 'Lato-Semibold'}]}>
              Uncommitted Tasks{' : '}
            </Text>
            {item.unCommittedTask}
          </Text>
        </View>
        <View style={styles(isDark).rowContainer}>
          <Text style={styles(isDark).taskText}>
            <Text
              style={[styles(isDark).taskText, {fontFamily: 'Lato-Semibold'}]}>
              Committed Hours{' : '}
            </Text>
            {item.committedHours}
          </Text>
          <Text style={styles(isDark).taskText}>
            <Text
              style={[styles(isDark).taskText, {fontFamily: 'Lato-Semibold'}]}>
              Actual Work Log{' : '}
            </Text>
            {item.actualWorkLogHours}
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
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
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
      marginVertical: 7,
      borderColor: Colors.white,
      borderWidth: 0.5,
      marginHorizontal: 16,
    },
    rowContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 5,
      flexWrap: 'wrap',
    },
    dateText: {fontSize:16,fontFamily: 'Lato-Bold', color: Colors.primary},
    taskText: {
      fontSize:14,
      fontFamily: 'Lato-Regular',
      color: isDark ? Colors.white : Colors.black,
      lineHeight: 25,
    },
  });
export default MyPlans;
