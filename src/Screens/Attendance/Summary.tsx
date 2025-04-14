import {FlatList, ScrollView, StyleSheet, Text, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useEmployeeLeaveRecordsQuery} from '../../Services/services';
import CustomHeader from '../../Components/CustomHeader';
import {Colors} from '../../constants/Colors';
import {isDarkTheme} from '../../AppStore/Reducers/appState';
import {useSelector} from 'react-redux';
import {useNavigation} from '@react-navigation/native';
import ShimmerPlaceHolder from '../Placeholder/ShimmerPlaceHolder';
import {Card, Icon} from 'react-native-paper';

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

  useEffect(() => {
    handlesummary();
  }, [data]);

  return (
    <View style={styles(isDark).maincontainer}>
      <CustomHeader
        showBackIcon={true}
        title="Leave Balance Detail"
        onPress={() => navigation.goBack()}
      />
      <View style={styles(isDark).divider} />

      {isLoading ? (
        <ShimmerPlaceHolder />
      ) : (
        <ScrollView showsVerticalScrollIndicator={false}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-around',
              marginHorizontal: 16,
              marginTop: 10,
            }}>
            {[
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
            ].map((item, index) => (
              <View
                key={index}
                style={{
                  backgroundColor: isDark ? Colors.black : Colors.white,
                  flex: 1,
                  marginHorizontal: 4,
                  borderRadius: 10,
                  padding: 10,
                  alignItems: 'center',
                }}>
                <Icon
                  source={item.icon}
                  size={24}
                  color={isDark ? Colors.white : Colors.primary}
                />
                <Text
                  style={{
                    color: isDark ? Colors.white : Colors.primary,
                    fontSize: 12,
                    textAlign: 'center',
                    marginTop: 5,
                    fontFamily: 'Lato-Semibold',
                  }}>
                  {item.label}
                </Text>
              </View>
            ))}
          </View>

          {/* <View
            style={{
              justifyContent: 'space-between',
              flexDirection: 'row',
              marginHorizontal: 16,
            }}>
            <Text
              style={{
                color: isDark ? Colors.white : Colors.black,
                fontSize: 16,
                fontFamily: 'Lato-Bold',
              }}>
              Leave Summary
            </Text>
          </View> */}
          <Card
            style={{
              backgroundColor: isDark ? Colors.black : Colors.background,
              marginVertical: 7,
              borderColor: Colors.background,
              borderWidth: 0.5,
              marginHorizontal: 16,
              overflow: 'hidden',
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
                  Leave Summary
                </Text>
                <Text
                  style={{
                    color: isDark ? Colors.white : Colors.primary,
                    fontSize: 16,
                    fontFamily: 'Lato-Bold',
                  }}>
                  {records?.month?.label ? records?.month?.label : 0}
                </Text>
              </View>
              <View
                style={{
                  justifyContent: 'space-between',
                  flexDirection: 'row',
                  flexWrap: 'wrap',
                }}>
                <Text
                  style={{
                    color: isDark ? Colors.white : Colors.black,
                    fontSize: 14,
                    fontFamily: 'Lato-Semibold',
                  }}>
                  Earn Leave
                </Text>
                <Text
                  style={{
                    color: isDark ? Colors.white : Colors.black,
                    fontSize: 14,
                    fontFamily: 'Lato-Regular',
                  }}>
                  Starting Balance{' : '}
                  <Text style={{fontFamily: 'Lato-Regular'}}>
                    {records?.earnedLeave || 0}
                  </Text>
                </Text>
              </View>

              <View
                style={{
                  justifyContent: 'space-between',
                  flexDirection: 'row',
                  flexWrap: 'wrap',
                }}>
                <Text
                  style={{
                    color: isDark ? Colors.white : Colors.black,
                    fontSize: 14,
                    fontFamily: 'Lato-Regular',
                  }}>
                  Leave Availed{' : '}
                  <Text style={{fontFamily: 'Lato-Regular'}}>
                    {records?.earnleaveavailed || 0}
                  </Text>
                </Text>

                <Text
                  style={{
                    color: isDark ? Colors.white : Colors.black,
                    fontSize: 14,
                    fontFamily: 'Lato-Regular',
                  }}>
                  Closing Balance{' : '}
                  <Text style={{fontFamily: 'Lato-Regular'}}>
                    {records?.earnleaveremaining || 0}
                  </Text>
                </Text>
              </View>
            </Card.Content>
          </Card>

          <Card
            style={{
              backgroundColor: isDark ? Colors.black : Colors.background,
              marginVertical: 7,
              borderColor: Colors.background,
              borderWidth: 0.5,
              marginHorizontal: 16,
              overflow: 'hidden',
            }}>
            <Card.Content>
              <Text
                style={{
                  color: isDark ? Colors.white : Colors.black,
                  fontSize: 16,
                  fontFamily: 'Lato-Bold',
                
                }}>
                LOP Summary
              </Text>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  marginVertical: 4,
                }}>
                <Text
                  style={{
                    color: isDark ? Colors.white : Colors.black,
                    fontFamily: 'Lato-Regular',
                  }}>
                  Deficient Hours
                </Text>
                <Text
                  style={{
                    color: isDark ? Colors.white : Colors.black,
                    fontFamily: 'Lato-Bold',
                  }}>
                  {records?.deficientHours || 0}
                </Text>
              </View>

              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  marginVertical: 4,
                }}>
                <Text
                  style={{
                    color: isDark ? Colors.white : Colors.black,
                    fontFamily: 'Lato-Regular',
                  }}>
                  Total Low Hours ({'<8'})
                </Text>
                <Text
                  style={{
                    color: isDark ? Colors.white : Colors.black,
                    fontFamily: 'Lato-Bold',
                  }}>
                  {records?.totalLowHrsLess8 || 0}
                </Text>
              </View>

              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  marginVertical: 4,
                }}>
                <Text
                  style={{
                    color: isDark ? Colors.white : Colors.black,
                    fontFamily: 'Lato-Regular',
                  }}>
                  Total Low Hours (3-5)
                </Text>
                <Text
                  style={{
                    color: isDark ? Colors.white : Colors.black,
                    fontFamily: 'Lato-Bold',
                  }}>
                  {records?.totalLowHrs3_5 || 0}
                </Text>
              </View>

              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  marginVertical: 4,
                }}>
                <Text
                  style={{
                    color: isDark ? Colors.white : Colors.black,
                    fontFamily: 'Lato-Regular',
                  }}>
                  Total Low Hours ({'<3'})
                </Text>
                <Text
                  style={{
                    color: isDark ? Colors.white : Colors.black,
                    fontFamily: 'Lato-Bold',
                  }}>
                  {records?.totalLowHrsLess3 || 0}
                </Text>
              </View>

              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  marginVertical: 4,
                }}>
                <Text
                  style={{
                    color: isDark ? Colors.white : Colors.black,
                    fontFamily: 'Lato-Regular',
                  }}>
                  No of Lates
                </Text>
                <Text
                  style={{
                    color: isDark ? Colors.white : Colors.black,
                    fontFamily: 'Lato-Bold',
                  }}>
                  {records?.noOfLate || 0}
                </Text>
              </View>

              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  marginVertical: 4,
                }}>
                <Text
                  style={{
                    color: isDark ? Colors.white : Colors.black,
                    fontFamily: 'Lato-Regular',
                  }}>
                  Absent without Leave
                </Text>
                <Text
                  style={{
                    color: isDark ? Colors.white : Colors.black,
                    fontFamily: 'Lato-Bold',
                  }}>
                  {records?.totalAbsentDays || 0}
                </Text>
              </View>

              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  marginVertical: 4,
                }}>
                <Text
                  style={{
                    color: isDark ? Colors.white : Colors.black,
                    fontFamily: 'Lato-Regular',
                  }}>
                  LOP Low Hours ({'<8'})
                </Text>
                <Text
                  style={{
                    color: isDark ? Colors.white : Colors.black,
                    fontFamily: 'Lato-Bold',
                  }}>
                  {records?.lopLowHrsLess8 || 0}
                </Text>
              </View>

              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  marginVertical: 4,
                }}>
                <Text
                  style={{
                    color: isDark ? Colors.white : Colors.black,
                    fontFamily: 'Lato-Regular',
                  }}>
                  LOP Low Hours (3-5)
                </Text>
                <Text
                  style={{
                    color: isDark ? Colors.white : Colors.black,
                    fontFamily: 'Lato-Bold',
                  }}>
                  {records?.lopLowHrs3_5 || 0}
                </Text>
              </View>

              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  marginVertical: 4,
                }}>
                <Text
                  style={{
                    color: isDark ? Colors.white : Colors.black,
                    fontFamily: 'Lato-Regular',
                  }}>
                  LOP Low Hours ({'<3'})
                </Text>
                <Text
                  style={{
                    color: isDark ? Colors.white : Colors.black,
                    fontFamily: 'Lato-Bold',
                  }}>
                  {records?.lopLowHrsLess3 || 0}
                </Text>
              </View>

              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  marginVertical: 4,
                }}>
                <Text
                  style={{
                    color: isDark ? Colors.white : Colors.black,
                    fontFamily: 'Lato-Regular',
                  }}>
                  LOP Lates
                </Text>
                <Text
                  style={{
                    color: isDark ? Colors.white : Colors.black,
                    fontFamily: 'Lato-Bold',
                  }}>
                  {records?.lopLates || 0}
                </Text>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  marginVertical: 4,
                }}>
                <Text
                  style={{
                    color: isDark ? Colors.white : Colors.black,
                    fontFamily: 'Lato-Bold',
                    fontSize: 16,
                  }}>
                  Total LOPs
                </Text>
                <Text
                  style={{
                    color: isDark ? Colors.white : Colors.black,
                    fontFamily: 'Lato-Bold',
                    fontSize: 16,
                  }}>
                  {records?.totalLossOfPay || 0}
                </Text>
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
    divider: {
      borderWidth: 1,
      height: 1,
      backgroundColor: isDark ? Colors.white : 'transparent',
      borderColor: isDark ? Colors.black : 'transparent',
    },
  });
