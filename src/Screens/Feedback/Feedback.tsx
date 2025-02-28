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
      const sortedData = [...data.data].sort(
        (a, b) => b.feedBackId - a.feedBackId,
      );
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
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
          }}>
          <Text
            style={[styles(isDark).title, {flex: 1, fontSize: 16}]}
            numberOfLines={0}
            ellipsizeMode="tail">
            {item.feedBackTitle}
          </Text>

          <View style={{minWidth: '30%', alignItems: 'flex-end', marginLeft: 7}}>
            <Text style={[styles(isDark).title, {fontSize: 16}]}>
              {moment(item.reportedOn, 'DD-MM-YYYY').format('D MMM,YYYY')}
            </Text>
          </View>
        </View>

        <Text style={[styles(isDark).title, {fontSize: 14,fontFamily:'Lato-Regular',marginTop:-5}]}>
          Status: {item.status.label}
        </Text>

        <View>
          <TouchableOpacity
            style={styles(isDark).viewFeedback}
            onPress={() =>
              navigation.navigate('ViewFeedback', {feedbackData: item})
            }>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                padding:6,
                borderRadius: 3,
                backgroundColor: Colors.primary,
                
              }}>
              <Icon source="eye" size={24} color={Colors.white} />
              <Text
                style={[styles(isDark).addButtonText, {color: Colors.white,marginLeft:4}]}>
                View Feedback
              </Text>
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
        AddFeedbackIcon={true}
        onPress={() => navigation.goBack()}
        addFeedbackOnPress={() => navigation.navigate('AddFeedback')}
      />
      <View style={styles(isDark).divider} />

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
    addButtonText: {
      fontSize: 14,
      fontFamily: 'Lato-Bold',
    },
    title: {
      fontFamily: 'Lato-Bold',
      marginBottom: 5,
      color: isDark ? Colors.white : Colors.black,
    },
    status: {
      fontSize: 14,
      fontFamily: 'Lato-Regular',
      color: isDark ? Colors.white : Colors.black,
      marginBottom: 10,
    },
    viewFeedback: {
      flexDirection: 'row',
      alignItems: 'center',
     
    },
  });

export default Feedback;
