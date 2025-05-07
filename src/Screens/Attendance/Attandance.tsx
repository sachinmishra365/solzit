import { StyleSheet, Text, View, FlatList, TouchableOpacity, RefreshControl, } from 'react-native';
import React, { useEffect, useState } from 'react';
import CustomHeader from '../../Components/CustomHeader';
import { isDarkTheme } from '../../AppStore/Reducers/appState';
import { useSelector } from 'react-redux';
import { Colors } from '../../constants/Colors';
import { useAttendanceListQuery } from '../../Services/services';
import { Card, IconButton } from 'react-native-paper';
import ShimmerPlaceHolder from '../Placeholder/ShimmerPlaceHolder';
import Toast from 'react-native-toast-message';
import EmptyData from '../../Components/EmptyData';

const Attendance = ({ navigation }: any) => {
  const isDark = useSelector(isDarkTheme);
  const EmployeeId = useSelector((state: any) => state?.appState?.authToken);
  const connected = useSelector((state: any) => state?.appState?.connected);

  const [attendanceMonthData, SetAttendanceMonthData] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const { data, isLoading, refetch } = useAttendanceListQuery({ accessToken: EmployeeId?.authToken?.accessToken });

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
    } catch (err) { }
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

  const renderAttendance = ({ item }: any) => {
    return (
      <Card style={styles(isDark).card}>
        <Card.Content>
          <View
            style={styles(isDark).row}>
            <Text style={styles(isDark).txt}>{'Month : '}{item.month.label ? item.month.label : 'N/A'}</Text>
            <Text style={styles(isDark).txt}>{'Total Pay Day : '}{item.totalPayDays ? item.totalPayDays : 0}</Text>
          </View>

          <View
            style={styles(isDark).row}>
            <Text style={[styles(isDark).txt, { fontFamily: 'Lato-Regular' }]}>{'Year : '}{item.year.label ? item.year.label : 'N/A'}</Text>
            <Text style={[styles(isDark).txt, { fontFamily: 'Lato-Regular' }]}>{'Earned Leave : '}{item.earnedLeave ? item.earnedLeave : 0}</Text>
          </View>

          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginTop: 10,
            }}>
            <TouchableOpacity
              style={[{ backgroundColor: '#916918', }, styles(isDark).button]}
              onPress={() => {
                navigation.navigate('Summary', item);
              }}>
              <IconButton
                style={{ margin: -2 }}
                icon="information"
                iconColor={Colors.white}
                size={25}
              />
              <Text
                style={styles(isDark).btntxt}>
                Summary
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[{
                backgroundColor: Colors.primary,
              }, styles(isDark).button]}
              onPress={() => {
                navigation.navigate('SepratedAttendance', item);
              }}>
              <IconButton
                style={{ margin: -2 }}
                icon="account-box"
                iconColor={Colors.white}
                size={25}
              />
              <Text
                style={styles(isDark).btntxt}>
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

      {isLoading ? (
        <ShimmerPlaceHolder />
      ) : (
        attendanceMonthData && attendanceMonthData.length > 0 ? (
          <FlatList
            data={attendanceMonthData}
            renderItem={renderAttendance}
            keyExtractor={(item: any, index: any) => item?.id.toString() + index}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => onRefresh()} />}
            ListFooterComponent={<View style={{ height: 100 }} />}
          />
        )
          :
          (<EmptyData />)
      )
      }
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
      marginVertical: 7,
      borderColor: Colors.background,
      borderWidth: 0.5,
      marginHorizontal: 16,
      elevation: 15,
      shadowColor: isDark ? Colors.white : Colors.black,
    },
    button: {
      justifyContent: 'center',
      alignSelf: 'center',
      borderRadius: 3,
      alignItems: 'center',
      flexDirection: 'row',
      height: 'auto',
      minHeight: 38
    },
    txt: {
      color: isDark ? Colors.white : Colors.black,
      fontSize: 15,
      fontFamily: 'Lato-Semibold',
      marginBottom: 5
    },
    btntxt: {
      textAlign: 'center',
      fontFamily: 'Lato-Bold',
      color: Colors.white,
      flexWrap: 'wrap',
      marginRight: 12,
      fontSize: 14,
    },
    row: {
      justifyContent: 'space-between',
      flexDirection: 'row',
      flexWrap: 'wrap',
    }
  });

export default Attendance;
