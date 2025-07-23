import {ScrollView, StyleSheet, Text, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useEmployeeLeaveRecordsQuery} from '../../Services/services';
import CustomHeader from '../../Components/CustomHeader';
import {Colors} from '../../constants/Colors';
import {isDarkTheme} from '../../AppStore/Reducers/appState';
import {useSelector} from 'react-redux';
import {useNavigation} from '@react-navigation/native';
import ShimmerPlaceHolder from '../Placeholder/ShimmerPlaceHolder';
import {Card, Icon, IconButton} from 'react-native-paper';

const Summary = ({route}: any) => {
  const MonthData = route.params;
  const isDark = useSelector(isDarkTheme);
  const navigation = useNavigation();

  const [records, SetRecords] = useState<any>({});

  const Assesstoken = useSelector((state: any) => state?.appState?.authToken);
  const accessToken = Assesstoken?.authToken?.accessToken;

  const {data, isLoading, error} = useEmployeeLeaveRecordsQuery({
    monthID: MonthData?.leaveApplicationId,
    accessToken: accessToken,
  });

  useEffect(() => {
    handlesummary();
  }, [data]);

  const UpperData = [
    {
      label: `${records?.month?.label || 'Month'}, ${
        records?.year?.label || ''
      }\nDuration`,
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
  ];

  const Summary = [
    {label: 'Deficient Hours', value: records?.deficientHours},
    {label: 'Total Low Hours (<8)', value: records?.totalLowHrsLess8},
    {label: 'Total Low Hours (3-5)', value: records?.totalLowHrs3_5},
    {label: 'Total Low Hours (<3)', value: records?.totalLowHrsLess3},
    {label: 'No of Lates', value: records?.noOfLate},
    {label: 'Absent without Leave', value: records?.totalAbsentDays},
    {label: 'LOP Low Hours (<8)', value: records?.lopLowHrsLess8},
    {label: 'LOP Low Hours (3-5)', value: records?.lopLowHrs3_5},
    {label: 'LOP Low Hours (<3)', value: records?.lopLowHrsLess3},
    {label: 'LOP Lates', value: records?.lopLates},
  ];

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
    } catch (error) {}
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
          <View
            style={[
              styles(isDark).card,
              {
                elevation: 3,
                justifyContent: 'space-around',
                flexDirection: 'row',
                borderRadius: 5,
              },
            ]}>
            {UpperData.map((item, index) => (
              <View key={index}>
                <IconButton
                  icon={item.icon}
                  size={25}
                  iconColor={isDark ? Colors.white : Colors.primary}
                />
                <Text
                  style={[
                    styles(isDark).txt,
                    {fontSize: 12, textAlign: 'center', marginBottom: 5},
                  ]}>
                  {item.label}
                </Text>
              </View>
            ))}
          </View>

          <Card style={[styles(isDark).card]}>
            <Card.Content>
              <Text style={styles(isDark).coolTitle}>
                Leave Summary — {records?.month?.label || 'Month'}
              </Text>

              <View style={styles(isDark).infoBox}>
                <Text style={styles(isDark).txt}>Leave Type{' :'}</Text>
                <Text style={[styles(isDark).txt, {color: Colors.darkorange}]}>
                  Earn Leave
                </Text>
              </View>

              <View style={styles(isDark).grid}>
                <View style={[styles(isDark).metricContainer, {width: '30%'}]}>
                  <Text style={styles(isDark).txt}>Starting Balance</Text>
                  <Text style={styles(isDark).metricValue}>
                    {records?.earnedLeave || 0}
                  </Text>
                </View>
                <View style={[styles(isDark).metricContainer, {width: '30%'}]}>
                  <Text style={styles(isDark).txt}>Leave Availed</Text>
                  <Text style={styles(isDark).metricValue}>
                    {records?.earnleaveavailed || 0}
                  </Text>
                </View>
                <View style={[styles(isDark).metricContainer, {width: '30%'}]}>
                  <Text style={styles(isDark).txt}>Closing Balance</Text>
                  <Text style={styles(isDark).metricValue}>
                    {records?.earnleaveremaining || 0}
                  </Text>
                </View>
              </View>
            </Card.Content>
          </Card>

          <Card style={[styles(isDark).card, styles(isDark).card]}>
            <Card.Content>
              <Text style={styles(isDark).coolTitle}>Leave Summary</Text>
              <View style={styles(isDark).grid}>
                {Summary.map((item, index) => (
                  <View
                    key={index}
                    style={[
                      styles(isDark).metricContainer,
                      {width: '48%', flexDirection: 'row'},
                    ]}>
                    <IconButton
                      icon="clock-outline"
                      size={20}
                      iconColor={
                        index % 2 === 0 ? Colors.green : Colors.secondary
                      }
                      style={styles(isDark).metricIcon}
                    />
                    <View style={styles(isDark).metricText}>
                      <Text style={styles(isDark).txt}>{item.label}</Text>
                      <Text style={styles(isDark).metricValue}>
                        {item.value || 0}
                      </Text>
                    </View>
                  </View>
                ))}
                <View style={{alignItems: 'flex-end', width: '100%'}}>
                  <Text
                    style={{
                      fontSize: 14,
                      color: Colors.error,
                      fontFamily: 'Lato-Semibold',
                    }}>
                    Total LOPs{' : '}
                    {records?.totalLossOfPay}
                  </Text>
                </View>
              </View>
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
      marginVertical: 7,
      borderColor: Colors.background,
      borderWidth: 0.5,
    },
    txt: {
      color: isDark ? Colors.white : Colors.black,
      fontSize: 14,
      fontFamily: 'Lato-Regular',
    },

    coolTitle: {
      fontSize: 16,
      fontFamily: 'Lato-Bold',
      textAlign: 'left',
      color: isDark ? Colors.primary : Colors.primary,
    },

    grid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
    },
    metricContainer: {
      backgroundColor: isDark ? Colors.gray : Colors.white,
      borderRadius: 5,
      padding: 10,
      marginVertical: 6,
      alignItems: 'center',
      elevation: 1,
    },
    metricIcon: {
      marginRight: 8,
    },
    metricText: {
      flex: 1,
    },

    metricValue: {
      fontSize: 16,
      color: isDark ? Colors.darkorange : Colors.black,
      fontFamily: 'Lato-Semibold',
    },

    infoBox: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      marginBottom: 10,
      gap: 6,
    },
  });
