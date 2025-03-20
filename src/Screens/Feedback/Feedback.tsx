import { View, Text, StyleSheet, FlatList, RefreshControl, BackHandler } from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { isDarkTheme } from '../../AppStore/Reducers/appState';
import CustomHeader from '../../Components/CustomHeader';
import { Colors } from '../../constants/Colors';
import { useGetMyFeedbacksListByEmpIdQuery } from '../../Services/services';
import ShimmerPlaceHolder from '../Placeholder/ShimmerPlaceHolder';
import { Card, FAB, Icon } from 'react-native-paper';
import { TouchableOpacity } from 'react-native-gesture-handler';
import moment from 'moment';


const Feedback = ({ navigation }: any) => {
  const isDark = useSelector(isDarkTheme);
  const EmployeeId = useSelector((state: any) => state?.appState?.authToken);
  const [FeedbackData, setFeedbackData] = useState<any[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const { data, isLoading, refetch } = useGetMyFeedbacksListByEmpIdQuery({
    accessToken: EmployeeId?.authToken?.accessToken,
  });

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

  const renderItem = ({ item }: any) => (
    <Card
      style={{
        backgroundColor: isDark ? Colors.black : Colors.background,
        marginVertical: 7,
        borderColor: Colors.background,
        borderWidth: 0.5,
        marginHorizontal: 16,
      }}
    >
      <Card.Content>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}>
          <Text style={[styles(isDark).txt, {
            fontFamily: 'Lato-Bold',
          }]}>
            {'Status : '}{item.status.label}
          </Text>
          <Text style={[styles(isDark).txt, { fontSize: 16,fontFamily: 'Lato-Bold' }]}>
            {moment(item.reportedOn, 'DD-MM-YYYY').format('D MMM, YYYY')}
          </Text>
        </View>
        <View>

      <View style={{flexDirection: 'row',}}>
      <Text style={[styles(isDark).txt,{fontFamily: 'Lato-Bold'}]}>
          {'Title : '}
          </Text>
          <Text style={[styles(isDark).txt,{flexWrap:'wrap',flex:1}]}>
            {item.feedBackTitle}
          </Text>
      </View>

          <TouchableOpacity style={styles(isDark).viewFeedback} onPress={() => navigation.navigate('ViewFeedback', { feedbackData: item })}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                padding: 6,
                borderRadius: 3,
                backgroundColor: Colors.primary,
              }}
            >
              <Icon source="eye" size={24} color={Colors.white} />
              <Text style={[styles(isDark).addButtonText, { color: Colors.white, marginLeft: 4 }]}>
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
      <CustomHeader showBackIcon={true} title="Feedback"  onPress={() => navigation.goBack()}
       />
      <View style={styles(isDark).divider} />

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
            ListFooterComponent={<View style={{height: 100}} />}
          />

          : (
            <View
              style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Text
                style={{
                  color: isDark ? Colors.white : Colors.black,
                  alignSelf: 'center',
                  fontFamily: 'Lato-Bold',
                }}>
                No Records
              </Text>
            </View>
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
    txt: {
      fontFamily: 'Lato-SemiBold',
      marginBottom: 5,
      color: isDark ? Colors.white : Colors.black,
      fontSize: 14
    },
    viewFeedback: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'flex-end'
    },
    fab: {
      position: 'absolute',
      right: 32,
      bottom: 32,
      backgroundColor: isDark ? Colors.gray : Colors.primary,
      elevation: 10,
    },
  });

export default Feedback;
