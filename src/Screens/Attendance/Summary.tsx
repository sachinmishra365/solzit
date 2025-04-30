import { ScrollView, StyleSheet, Text, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useEmployeeLeaveRecordsQuery } from '../../Services/services';
import CustomHeader from '../../Components/CustomHeader';
import { Colors } from '../../constants/Colors';
import { isDarkTheme } from '../../AppStore/Reducers/appState';
import { useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import ShimmerPlaceHolder from '../Placeholder/ShimmerPlaceHolder';
import { Card, Icon, IconButton } from 'react-native-paper';

const Summary = ({ route }: any) => {
  const MonthData = route.params;
  const isDark = useSelector(isDarkTheme);
  const navigation = useNavigation();

  const [records, SetRecords] = useState<any>({});

  const Assesstoken = useSelector((state: any) => state?.appState?.authToken);
  const accessToken = Assesstoken?.authToken?.accessToken;

  const { data, isLoading, error } = useEmployeeLeaveRecordsQuery({ monthID: MonthData?.leaveApplicationId, accessToken: accessToken, });

  useEffect(() => {
    handlesummary();
  }, [data]);

  const UpperData = [
    {
      label: `${records?.month?.label || 'Month'}, ${records?.year?.label || ''}\nDuration`,
      icon: 'calendar-month',
    },
    {
      label: `${records?.totalPayDays || 0}\nPay Days\n`,
      icon: 'calendar-check',
    },
    {
      label: `${records?.earnleaveavailed || 0}\nLeave Availed\n`,
      icon: 'airplane',
    },
    {
      label: `${records?.totallopleave || 0}\nTotal LOP\n`,
      icon: 'minus-circle-outline',
    },
  ]

  const Summary = [
    { label: 'Deficient Hours', value: records?.deficientHours },
    { label: 'Total Low Hours (<8)', value: records?.totalLowHrsLess8 },
    { label: 'Total Low Hours (3-5)', value: records?.totalLowHrs3_5 },
    { label: 'Total Low Hours (<3)', value: records?.totalLowHrsLess3 },
    { label: 'No of Lates', value: records?.noOfLate },
    { label: 'Absent without Leave', value: records?.totalAbsentDays },
    { label: 'LOP Low Hours (<8)', value: records?.lopLowHrsLess8 },
    { label: 'LOP Low Hours (3-5)', value: records?.lopLowHrs3_5 },
    { label: 'LOP Low Hours (<3)', value: records?.lopLowHrsLess3 },
    { label: 'LOP Lates', value: records?.lopLates },
    { label: 'Total LOPs', value: records?.totalLossOfPay },

  ]

  const handlesummary = async () => {
    try {
      const response = data;
      if (
        response?.data !== undefined &&
        response?.messageDetail?.message_code === 200 &&
        response?.data !== null
      ) {
        SetRecords(response?.data);
      }
    } catch (error) { }
  };

  return (
    <View style={styles(isDark).maincontainer}>
      <CustomHeader
        showBackIcon={true}
        title="Leave Balance Detail"
        onPress={() => navigation.goBack()}
      />

      {isLoading ? (
        <ShimmerPlaceHolder />
      ) : (
        <ScrollView showsVerticalScrollIndicator={false}>

          <View style={[styles(isDark).card, {
            elevation: 5, justifyContent: 'space-around', flexDirection: 'row'
          }]}>
            {UpperData.map((item, index) => (
              <View key={index}>
                <IconButton icon={item.icon} size={25} iconColor={isDark ? Colors.white : Colors.primary} />
                <Text style={[styles(isDark).txt, { fontSize: 12, textAlign: 'center' }]}>{item.label}</Text>
              </View>
            ))}
          </View>

          <Card style={styles(isDark).card}>
            <Card.Content>
              <View style={styles(isDark).row}>
                <Text style={[styles(isDark).txt, { fontFamily: 'Lato-Semibold', fontSize: 16, }]}>Leave Summary</Text>
                <Text style={styles(isDark).txt}>{records?.month?.label || 0}</Text>
              </View>
              <View style={styles(isDark).row}>
                <Text style={styles(isDark).txt}>{'Earn Leave'}</Text>
                <Text style={styles(isDark).txt}>{'Starting Balance: '}{records?.earnedLeave || 0}</Text>
              </View>

              <View style={styles(isDark).row}>
                <Text style={styles(isDark).txt}>{'Leave Availed : '}{records?.earnleaveavailed || 0}</Text>
                <Text style={styles(isDark).txt}>{'Closing Balance : '}{records?.earnleaveremaining || 0}</Text>
              </View>
            </Card.Content>
          </Card>

          <Card style={styles(isDark).card}>
            <Card.Content>
              <Text
                style={[styles(isDark).txt, { fontFamily: 'Lato-Semibold', fontSize: 16, textAlign: 'center', }]}>{'LOP Summary'}
              </Text>

              {Summary.map((item, index) => (
                <View
                  key={index}
                  style={styles(isDark).row}>
                  <Text style={styles(isDark).txt}>{item.label}</Text>
                  <Text style={styles(isDark).txt}>{item.value || 0}</Text>
                </View>
              ))}
            </Card.Content>
          </Card>
        </ScrollView>
      )}
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
    card: {
      backgroundColor: isDark ? Colors.black : Colors.background,
      marginHorizontal: 16,
      borderRadius: 5,
      padding: 8,
      marginVertical: 5,
      borderColor : Colors.background,
      borderWidth: 0.5,
    },
    txt: {
      color: isDark ? Colors.white : Colors.black,
      fontSize: 14,
      fontFamily: 'Lato-Regular',
      marginVertical: 2,
    },
    row: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginVertical: 2,
    },
  });
