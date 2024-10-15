import {StyleSheet, Text, View, FlatList, TouchableOpacity} from 'react-native';
import React, {useEffect, useState} from 'react';
import CustomHeader from '../../Components/CustomHeader';
import {isDarkTheme} from '../../AppStore/Reducers/appState';
import {useSelector} from 'react-redux';
import {Colors} from '../../constants/Colors';
import {useAttendanceListQuery} from '../../Services/services';
import {Card, IconButton} from 'react-native-paper';
import Placeholder from '../Placeholder/Placeholder';
import ShimmerPlaceHolder from '../Placeholder/ShimmerPlaceHolder';

const Attendance = ({navigation}: any) => {
  const isDark = useSelector(isDarkTheme);
  const EmployeeId = useSelector((state: any) => state?.appState?.authToken);
  const [attendanceMonthData, SetAttendanceMonthData] = useState([]);  

  const {data, error, isLoading} = useAttendanceListQuery({
    UserID: EmployeeId?.userProfile?.userId,
  });

  const handleAttendanceList = async () => {
    try {
      const result = await data;
      if (
        result !== undefined &&
        result?.ResponseCode === 100 &&
        result !== null
      ) {
        SetAttendanceMonthData(result?.Data);
      }
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    handleAttendanceList();
  }, [data]);

  const renderAttendance = ({item}: any) => {    
    
    return (
      <Card
        style={{
          backgroundColor: isDark ? Colors.black : Colors.background,
          marginVertical: 10,
          borderColor: Colors.background,
          borderWidth: 0.5,
          marginHorizontal: 16,
          elevation: 15,
          shadowColor: isDark ? Colors.white : Colors.black,
        }}>
        <Card.Content>
          <View style={{justifyContent: 'space-between', flexDirection: 'row'}}>
            <Text
              style={{
                color: isDark ? Colors.white : Colors.black,
                fontSize: 16,
                fontFamily: 'Lato-Bold',
              }}>
              Month: {item.Month.Label ? item.Month.Label : 'N/A'}
            </Text>

            <View style={{}}>
              <Text
                style={{
                  color: isDark ? Colors.white : Colors.black,
                  fontSize: 16,
                  fontFamily: 'Lato-Bold',
                }}>
                Total Pay Day: {item.TotalPayDays ? item.TotalPayDays : 'N/A'}
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
              Year: {item.Year.Label ? item.Year.Label :'N/A'}
            </Text>
            <Text
              style={{
                color: isDark ? Colors.white : Colors.black,
                fontSize: 14,
                fontFamily: 'Lato-Semibold',
              }}>
              Earned Leave: {item.EarnedLeave ? item.EarnedLeave :'N/A'}
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
                backgroundColor: '#FEBE05',
                justifyContent: 'center',
                alignSelf: 'center',
                borderRadius: 3,
                alignItems: 'center',
                flexDirection: 'row',
              }}
              // disabled={result.isLoading}
              onPress={() => {
                navigation.navigate('Summary', item);
              }}>
              <IconButton
                style={{margin: -2}}
                icon="information"
                iconColor={Colors.white}
                size={18}
               
              />
              <Text
                style={{
                  textAlign: 'center',
                  fontFamily: 'Lato-Bold',
                  color: Colors.white,
                  flexWrap: 'wrap',
                  marginRight: 12,
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
              }}
              onPress={() => {
                navigation.navigate('SepratedAttendance', item);
              }}>
              <IconButton
                style={{margin: -2}}
                icon="account-box"
                iconColor={Colors.white}
                size={18}
              />
              <Text
                style={{
                  textAlign: 'center',
                  fontFamily: 'Lato-Bold',
                  color: Colors.white,
                  flexWrap: 'wrap',
                  fontSize: 12,
                  marginRight: 5,
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
      ) : 
      data && data !== null &&(
        <FlatList
          data={attendanceMonthData}
          renderItem={renderAttendance}
          keyExtractor={item => item?.ID}
        />
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
