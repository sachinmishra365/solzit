import {View, Text, StyleSheet, FlatList, RefreshControl} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useSelector} from 'react-redux';
import {isDarkTheme} from '../../AppStore/Reducers/appState';
import CustomHeader from '../../Components/CustomHeader';
import {Colors} from '../../constants/Colors';
import {useGetMyFeedbacksListByEmpIdQuery} from '../../Services/services';
import Toast from 'react-native-toast-message';
import ShimmerPlaceHolder from '../Placeholder/ShimmerPlaceHolder';
import {Card, Icon, IconButton} from 'react-native-paper';
import {TouchableOpacity} from 'react-native-gesture-handler';
import moment from 'moment';

const Feedback = ({navigation}: any) => {
  const isDark = useSelector(isDarkTheme);
  const EmployeeId = useSelector((state: any) => state?.appState?.authToken);
  const connected = useSelector((state: any) => state?.appState?.connected);

  const [FeedbackData, setFeedbackData] = useState<any[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const {data, error, isLoading, refetch} = useGetMyFeedbacksListByEmpIdQuery({
    accessToken: EmployeeId?.authToken?.accessToken,
  });


  const handleFeedback = async () => {
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
  
    if (data && data?.messageDetail?.message_code === 200 && data?.data) {
      const sortedData = [...data.data].sort((a, b) => b.feedBackId - a.feedBackId);
      setFeedbackData(sortedData);
    }
  };
  
  useEffect(() => {
    handleFeedback();
  }, [data]);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
      refetch();
    }, 1000);
  };

  const renderItem = ({item}: any) => (
    <Card
      style={{
        backgroundColor: isDark ? Colors.black : Colors.background,
        marginVertical: 10,
        borderColor: Colors.background,
        borderWidth: 0.5,
        marginHorizontal: 16,
      }}>
      <Card.Content>
        <Text style={[styles(isDark).dateText, {textAlign: 'right'}]}>
          {moment(item.reportedOn, 'DD-MM-YYYY').format('D MMM YYYY')}
        </Text>

        <Text style={styles(isDark).title}>{item.feedBackTitle}</Text>

        <Text style={styles(isDark).status}>Status: {item.status.label}</Text>

        <View>
          <TouchableOpacity
            style={styles(isDark).viewFeedback}
            onPress={() =>
              navigation.navigate('ViewFeedback', {
                feedbackId: item.feedBackId,
                feedBackTitle: item.feedBackTitle,
              })
            }>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                borderWidth: 0.5,
                borderColor: Colors.primary,
                padding: 10,
                borderRadius: 3,
                backgroundColor: isDark ? Colors.gray : Colors.white,
              }}>
              <Icon source="eye" size={20} color={Colors.primary} />
              <Text style={styles(isDark).viewText}>View Feedback</Text>
            </View>
          </TouchableOpacity>
        </View>
      </Card.Content>
    </Card>
  );

  return (
    <View style={styles(isDark).maincontainer}>
      <CustomHeader
        showBackIcon={true}
        title="Feedback"
        onPress={() => navigation.goBack()}
      />
      <View style={styles(isDark).divider} />
      <View style={styles(isDark).topBar}>

        <TouchableOpacity
            style={styles(isDark).commonButton}
            onPress={() => navigation.navigate('AddFeedback')}>
            <Icon source="plus" size={25} color={Colors.white} />
            <Text style={styles(isDark).addButtonText}>Add Feedback</Text>
          </TouchableOpacity>
      </View>
      
      {isLoading ? (
        <ShimmerPlaceHolder />
      ) : (
        data &&
        data !== null && (
          <FlatList
            data={FeedbackData}
            renderItem={renderItem}
            keyExtractor={(item, index) => index.toString()}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={() => onRefresh()}
              />
            }
          />
        )
      )}
    </View>
  );
};

const styles = (isDark: boolean) =>
  StyleSheet.create({
    maincontainer: {
      flex: 1,
      backgroundColor: isDark ? Colors.black : Colors.white,
    },
    divider: {
      borderWidth: 1,
      height: 1,
      backgroundColor: isDark ? Colors.white : 'transparent',
      borderColor: isDark ? Colors.black : 'transparent',
    },
    topBar: {
      marginTop: 10,
      alignItems: 'flex-end',
      marginHorizontal: 16,
    },
    commonButton: {
      backgroundColor: Colors.primary,
      borderRadius: 3,
      paddingHorizontal: 5,
      alignItems: 'center',
      flexDirection: 'row',
      height: 'auto',
      minHeight: 38,
      padding:10,
    },
    addButtonText: {
      color:  Colors.white,
      fontSize: 14,
      fontFamily: 'Lato-Bold',
    },
    dateText: {
      fontSize: 14,
      color: isDark ? Colors.white : Colors.black,
      marginBottom: 5,
      fontFamily: 'Lato-Bold',
    },
    title: {
      fontSize: 16,
      fontFamily: 'Lato-Bold',
      marginBottom: 5,
      color: isDark ? Colors.white : Colors.black,
    },
    status: {
      fontSize: 14,
      fontFamily: 'Lato-SemiBold',
      color: isDark ? Colors.white : Colors.black,
      marginBottom: 10,
    },
    viewFeedback: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    viewText: {
      color: Colors.primary,
      marginLeft: 5,
      fontFamily: 'Lato-Bold',
     
    },
    rowBetween: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 5,
    },

  });

export default Feedback;
