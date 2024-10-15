import {FlatList, StyleSheet, Text, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useEmployeeLeaveRecordsQuery} from '../../Services/services';
import CustomHeader from '../../Components/CustomHeader';
import {Colors} from '../../constants/Colors';
import {isDarkTheme} from '../../AppStore/Reducers/appState';
import {useSelector} from 'react-redux';
import {useNavigation} from '@react-navigation/native';
import ShimmerPlaceHolder from '../Placeholder/ShimmerPlaceHolder';
import { Card } from 'react-native-paper';

const Summary = ({route}: any) => {
  const MonthData = route.params;
  const isDark = useSelector(isDarkTheme);
  const navigation = useNavigation();
  const [records, SetRecords] = useState<any>({});

  const {data, isLoading} = useEmployeeLeaveRecordsQuery({
    MonthID: MonthData?.ID,
  });

  const handlesummary = async () => {
    try {
      const response = data;
      if (
        response?.Data !== undefined &&
        response?.ResponseCode === 100 &&
        response?.Data !== null
      ) {
        SetRecords(response?.Data);
      }
    } catch (error) {}
  };

  useEffect(() => {
    handlesummary();
  }, [data]);


  return (
    <View style={styles(isDark).maincontainer}>
      <CustomHeader
        showBackIcon={true}
        title="Summary"
        onPress={() => navigation.goBack()}
      />

      <View style={styles(isDark).divider} />
      {
        isLoading ? 
        <ShimmerPlaceHolder/>
        :(
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
              {records?.Month?.Label ? records?.Month?.Label : 'N/A'}
            </Text>
          </View>

          <View style={{justifyContent: 'space-between', flexDirection: 'row'}}>
            <Text
              style={{
                color: isDark ? Colors.white : Colors.black,
                fontSize: 16,
                fontFamily: 'Lato-Bold',
              }}>
              Earn Leave: {records?.EarnedLeave ? records?.EarnedLeave : 'N/A'}
            </Text>

            <View style={{}}>
              <Text
                style={{
                  color: isDark ? Colors.white : Colors.black,
                  fontSize: 16,
                  fontFamily: 'Lato-Bold',
                }}>
                Total pay day: {records.TotalPayDays ? records.TotalPayDays : 'N/A'}
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
              Total lop leave: {records.totallopleave ? records.totallopleave :0}
            </Text>
            <Text
              style={{
                color: isDark ? Colors.white : Colors.black,
                fontSize: 14,
                fontFamily: 'Lato-Semibold',
              }}>
              Leave availed: {records.earnleaveavailed ? records.earnleaveavailed :0}
            </Text>
          </View>

        </Card.Content>
      </Card>

        )
      }


    </View>
  );
};

export default Summary;

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
  });
