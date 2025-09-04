import {View, Text, StyleSheet, FlatList, RefreshControl} from 'react-native';
import React, {useEffect, useState} from 'react';
import CustomHeader from '../../../Components/CustomHeader';
import {useSelector} from 'react-redux';
import {isDarkTheme} from '../../../AppStore/Reducers/appState';
import {Colors} from '../../../constants/Colors';
import {Card} from 'react-native-paper';
import Toast from 'react-native-toast-message';
import ShimmerPlaceHolder from '../../Placeholder/ShimmerPlaceHolder';
import {useGetDayTaskReportDetailsQuery} from '../../../Services/workloglevel';
import EmptyData from '../../../Components/EmptyData';

const TaskDetails = ({navigation, route}: any) => {
  const isDark = useSelector(isDarkTheme);
  const accessToken = useSelector((state: any) => state?.appState?.authToken);
  const connected = useSelector((state: any) => state?.appState?.connected);

  const TaskDetail = route?.params?.TaskDetail;
  const {data, isLoading, error} = useGetDayTaskReportDetailsQuery({
    accessToken: accessToken?.authToken?.accessToken,
    Date: TaskDetail?.reportDate,
  });

  interface MyPlanItem {
    toDoTicketNumber: string;
    toDoProject?: {name: string};
    toDoTitle: string;
    commitmentStatus?: {label: string};
    currentWorkStatusOfTask?: {label: string};
    taskEstimatedEffort: number;
    actualEffortForDay: number;
  }

  const [myPlanData, setMyPlanData] = useState<MyPlanItem[]>([]);
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
        setMyPlanData(data.data);
      }
    } catch (error) {}
  };

  useEffect(() => {
    handleMyPlans();
  }, [data, error]); 
  

  const onRefresh = () => {
    setRefreshing(true);
    handleMyPlans().finally(() => setRefreshing(false));
  };

const renderItem = ({item}: any) => {
  return (
    <Card
      style={{
        backgroundColor: isDark ? Colors.black : Colors.background,
        marginVertical: 7,
        borderColor: Colors.background,
        borderWidth: 0.5,
        marginHorizontal: 16,
        overflow: 'hidden',
      }}>
      <Card.Content>
        <Text style={[styles(isDark).titleText, {color: Colors.primary}]}>
          {item.toDoTicketNumber} : {item.toDoProject?.name}
        </Text>

        <View style={styles(isDark).row}>
        <Text style={styles(isDark).valueText}>Title : </Text>
         <Text style={styles(isDark).labelText}>{item.toDoTitle}</Text>
         </View>

        <View style={styles(isDark).rowContainer}>
          <Text style={styles(isDark).valueText}>
            {item.commitmentStatus?.label}
          </Text>
          <Text style={styles(isDark).valueText}>
            {item.currentWorkStatusOfTask?.label}
          </Text>
        </View>

        <View style={styles(isDark).rowContainer}>
          <View style={{flexDirection: 'row', flexWrap: 'wrap'}}>
            <Text style={styles(isDark).valueText}>Total Estimated Effort :</Text>
            <Text style={styles(isDark).labelText}> {item.taskEstimatedEffort}</Text>
          </View>
          <View style={{flexDirection: 'row', flexWrap: 'wrap'}}>
            <Text style={styles(isDark).valueText}>Actual Effort :</Text>
            <Text style={styles(isDark).labelText}> {item.actualEffortForDay}</Text>
          </View>
        </View>
      </Card.Content>
    </Card>
  );
};

  return (
    <View style={styles(isDark).mainContainer}>
      <CustomHeader
        showBackIcon={true}
        title={`Task Details${' ('}${TaskDetail.reportDate}${')'}`}
        isDark={isDark}
        onPress={() => navigation.goBack()}
      />
      <View style={styles(isDark).divider} />
      {isLoading ? (
        <ShimmerPlaceHolder />
      ) : data?.data === null ? (
        <EmptyData/>
      ) : (
        <FlatList
          data={myPlanData}
          showsVerticalScrollIndicator={false}
          keyExtractor={item => item.toDoTicketNumber.toString()}
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
    divider: {
      backgroundColor: isDark ? Colors.medium_gray : 'transparent',
    },
    card: {
      backgroundColor: isDark ? Colors.black : Colors.background,
      marginVertical: 5,
      borderColor: Colors.background,
      borderWidth: 0.5,
      marginHorizontal: 16,

    },
    rowContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom:5,
      flexWrap: 'wrap',
    },
    titleText: {
      fontSize: 16,
      fontFamily: 'Lato-Bold',
      color: isDark ? Colors.white : Colors.black,
      marginVertical: 5,
      flexWrap: 'wrap',
    },
    labelText: {
      fontSize: 14,
      fontFamily: 'Lato-Regular',
      color: isDark ? Colors.white : Colors.black,
    },
    valueText: {
      fontSize: 14,
      fontFamily: 'Lato-Semibold',
      color: isDark ? Colors.white : Colors.black,
    },
      row: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 5,
      flexWrap: 'wrap', 
      
    },
  });
export default TaskDetails;
