import { View, Text, StyleSheet, FlatList, RefreshControl, BackHandler } from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { isDarkTheme } from '../../AppStore/Reducers/appState';
import CustomHeader from '../../Components/CustomHeader';
import { Colors } from '../../constants/Colors';
import { useGetMyFeedbacksListByEmpIdQuery } from '../../Services/services';
import ShimmerPlaceHolder from '../Placeholder/ShimmerPlaceHolder';
import { Card, FAB, Icon, IconButton } from 'react-native-paper';
import { TouchableOpacity } from 'react-native-gesture-handler';
import moment from 'moment';
import EmptyData from '../../Components/EmptyData';


const Feedback = ({ navigation }: any) => {
  const isDark = useSelector(isDarkTheme);
  const EmployeeId = useSelector((state: any) => state?.appState?.authToken);
  const [FeedbackData, setFeedbackData] = useState<any[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const { data, isLoading, refetch } = useGetMyFeedbacksListByEmpIdQuery({ accessToken: EmployeeId?.authToken?.accessToken, });

  useEffect(() => {
    if (data && data?.messageDetail?.message_code === 200 && data?.data) {
      const sortedData = [...data.data].sort(
        (a, b) => b.feedBackId - a.feedBackId
      );
      setFeedbackData(sortedData);
    }
  }, [data]);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
      refetch();
    }, 1000);
  };

const getStatusStyle = (status: string) => {
  switch (status) {
    case 'New':
      return { backgroundColor: 'rgba(0, 123, 255, 0.2)', color: '#007bff' }; 
    case 'Resolved':
      return { backgroundColor: 'rgba(40, 167, 69, 0.2)', color: '#28a745' }; 
    case 'Declined':
      return { backgroundColor: 'rgba(220, 53, 69, 0.2)', color: '#dc3545' }; 
    case 'Under Review':
      return { backgroundColor: 'rgba(255, 193, 7, 0.2)', color: '#ffc107' }; 
    default:
      return { backgroundColor: 'rgba(108, 117, 125, 0.2)', color: '#6c757d' }; 
  }
};


const renderItem = ({item}: any) => (
  <Card
    style={styles(isDark).card}
    onPress={() => navigation.navigate('ViewFeedback', {feedbackData: item})}>
    <Card.Content>
      <Text style={[styles(isDark).txt, {fontFamily: 'Lato-Regular'}]}>
        {'Reported On : '}
        {moment(item.reportedOn, 'DD-MM-YYYY').format('D MMM, YYYY')}
      </Text>

      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
        <Text
          style={[
            styles(isDark).txt,
            {fontFamily: 'Lato-Bold', fontSize: 16, flex: 1},
          ]}>
          {item.feedBackTitle}
        </Text>
        <IconButton
          icon="chevron-right"
          size={25}
          iconColor={Colors.primary}
          onPress={() =>
            navigation.navigate('ViewFeedback', {feedbackData: item})
          }
          style={{marginTop:-10}}
        />
      </View>

      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
        <Text style={[styles(isDark).txt, {flex: 1}]}>Status</Text>
        <Text
          style={[
            styles(isDark).statusText,
            {             
              color: getStatusStyle(item.status.label).color,
            },
          ]}>
          {item.status.label}
        </Text>
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

      {isLoading ? (
        <ShimmerPlaceHolder />
      ) :
        FeedbackData.length > 0 ?
          <FlatList
            showsVerticalScrollIndicator={false}
            data={FeedbackData}
            renderItem={renderItem}
            keyExtractor={(item, index) => index.toString()}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
            ListFooterComponent={<View style={{ height: 100 }} />}
          />
          : (
            <EmptyData />
          )}

      <FAB
        style={styles(isDark).fab}
        color={Colors.white}
        onPress={() => navigation.navigate('AddFeedback')}
        accessibilityLabel="Add Feedback"
        icon="plus"
      />

    </View>
  );
};

const styles = (isDark: boolean) =>
  StyleSheet.create({
    maincontainer: {
      flex: 1,
      backgroundColor: isDark ? Colors.black : Colors.white,
    },
    card: {
      backgroundColor: isDark ? Colors.black : Colors.background,
      marginTop: 10,
      borderColor: Colors.white,
      borderWidth: 0.5,
      marginHorizontal: 16,
    },

    txt: {
      fontFamily: 'Lato-Regular',
      marginBottom: 5,
      color: isDark ? Colors.white : Colors.black,
      fontSize: 14,
      flexWrap: 'wrap',
    },
    fab: {
      position: 'absolute',
      right: 32,
      bottom: 52,
      backgroundColor: isDark ? Colors.gray : Colors.primary,
      elevation: 10,
    },
    button: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 6,
      borderRadius: 3,
      backgroundColor: Colors.primary,
    },
    statusText: {
      fontSize: 14,
      fontFamily: 'Lato-Bold',
      color: Colors.white,
      overflow: 'hidden',
    },
  });

export default Feedback;
