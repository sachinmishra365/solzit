import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import CustomHeader from '../../Components/CustomHeader';
import {isDarkTheme} from '../../AppStore/Reducers/appState';
import {useSelector} from 'react-redux';
import {Colors} from '../../constants/Colors';
import {useAttendanceListQuery} from '../../Services/services';
import {Card, IconButton} from 'react-native-paper';
import ShimmerPlaceHolder from '../Placeholder/ShimmerPlaceHolder';
import Toast from 'react-native-toast-message';

const Attendance = ({navigation}: any) => {
  const isDark = useSelector(isDarkTheme);
  const EmployeeId = useSelector((state: any) => state?.appState?.authToken);
  const connected = useSelector((state: any) => state?.appState?.connected);

  const [attendanceMonthData, SetAttendanceMonthData] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const {data, error, isLoading, refetch} = useAttendanceListQuery({
    accessToken: EmployeeId?.authToken?.accessToken,
  });

  const handleAttendanceList = async () => {
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
      const result = await data;

      if (
        result !== undefined &&
        result?.messageDetail?.message_code === 200 &&
        result !== null
      ) {
        SetAttendanceMonthData(result?.data);
      }
    } catch (err) {}
  };

  useEffect(() => {
    handleAttendanceList();
  }, [data]);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
      refetch();
    }, 1000);
  }, [refetch]);

  const renderAttendance = ({item}: any) => {
    return (
      <Card
        style={{
          backgroundColor: isDark ? Colors.black : Colors.background,
          marginVertical: 10,
          borderColor: Colors.background,
          borderWidth: 1,
          marginHorizontal: 16,
          elevation: 15,
          shadowColor: isDark ? Colors.white : Colors.black,
        }}>
        <Card.Content>
          <View
            style={{
              justifyContent: 'space-between',
              flexDirection: 'row',
              flexWrap: 'wrap',
            }}>
            <Text
              style={{
                color: isDark ? Colors.white : Colors.black,
                fontSize: 16,
                fontFamily: 'Lato-Bold',
              }}>
              Month: {item.month.label ? item.month.label : 'N/A'}
            </Text>

            <View style={{}}>
              <Text
                style={{
                  color: isDark ? Colors.white : Colors.black,
                  fontSize: 16,
                  fontFamily: 'Lato-Bold',
                }}>
                Total Pay Day: {item.totalPayDays ? item.totalPayDays : 0}
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
              Year: {item.year.label ? item.year.label : 'N/A'}
            </Text>
            <Text
              style={{
                color: isDark ? Colors.white : Colors.black,
                fontSize: 14,
                fontFamily: 'Lato-Semibold',
              }}>
              Earned Leave: {item.earnedLeave ? item.earnedLeave : 0}
            </Text>
          </View>

          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginTop: 10,
            }}>
            <TouchableOpacity
              style={{
                height: 'auto',
                backgroundColor: '#916918',
                justifyContent: 'center',
                alignSelf: 'center',
                borderRadius: 3,
                alignItems: 'center',
                flexDirection: 'row',
                minHeight:38
              }}
              // disabled={result.isLoading}
              onPress={() => {
                navigation.navigate('Summary', item);
              }}>
              <IconButton
                style={{margin: -2}}
                icon="information"
                iconColor={Colors.white}
                size={25}
              />
              <Text
                style={{
                  textAlign: 'center',
                  fontFamily: 'Lato-Bold',
                  color: Colors.white,
                  flexWrap: 'wrap',
                  marginRight: 12,
                  fontSize: 16,
                }}>
                Summary
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={{
                backgroundColor: Colors.primary,
                justifyContent: 'center',
                alignSelf: 'center',
                borderRadius: 3,
                alignItems: 'center',
                flexDirection: 'row',
                height: 'auto',
                minHeight:38
              }}
              onPress={() => {
                navigation.navigate('SepratedAttendance', item);
              }}>
              <IconButton
                style={{margin: -2}}
                icon="account-box"
                iconColor={Colors.white}
                size={25}
              />
              <Text
                style={{
                  textAlign: 'center',
                  fontFamily: 'Lato-Bold',
                  color: Colors.white,
                  flexWrap: 'wrap',
                  marginRight: 12,
                  fontSize: 16,
                }}>
                Attendance
              </Text>
            </TouchableOpacity>
          </View>
        </Card.Content>
      </Card>
    );
  };

  return (
    <View style={styles(isDark).maincontainer}>
      <CustomHeader
        showBackIcon={true}
        title="Attendance"
        onPress={() => navigation.goBack()}
      />

      <View style={styles(isDark).divider} />

      {isLoading ? (
        <ShimmerPlaceHolder />
      ) : (
        data &&
        data !== null && (
          <FlatList
            data={attendanceMonthData}
            renderItem={renderAttendance}
            keyExtractor={(item: any, index: any) =>
              item?.id.toString() + index
            }
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
    itemContainer: {
      padding: 16,
      borderBottomWidth: 1,
      borderBottomColor: isDark ? Colors.gray : Colors.medium_gray,
    },
    text: {
      color: 'black',
      lineHeight: 24,
    },
    button: {
      backgroundColor: 'lightblue',
      borderRadius: 12,
      paddingVertical: 12,
      paddingHorizontal: 24,
      fontWeight: '500',
      alignSelf: 'center',
      alignItems: 'center',
    },
  });

export default Attendance;
