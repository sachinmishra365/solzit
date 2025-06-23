import { View, Text, TouchableOpacity, ActivityIndicator, Pressable, Keyboard, Alert, StyleSheet, } from 'react-native';
import React, { useEffect, useState } from 'react';
import CustomTextInput from '../Components/CustomTextInput';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { Colors } from '../constants/Colors';
import { SCREEN_WIDTH } from '../constants/Screen';
import { useEmployeeLeaveApplyMutation, useGetBalanceLeaveDashboardQuery } from '../Services/services';
import { useSelector } from 'react-redux';
import moment from 'moment';
import CustomHeader from '../Components/CustomHeader';
import { useNavigation } from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import { isDarkTheme } from '../AppStore/Reducers/appState';
import Placeholder from './Placeholder/Placeholder';


const validationSchema = Yup.object().shape({
  LeaveDayType: Yup.string().required('Leave Day Type is required'),
  StartDayOfLeave: Yup.string().required('Start Day Of Leave is required'),
  EndDayOfLeave: Yup.string().required('End Day Of Leave is required'),
  HalfDayType: Yup.string().when('LeaveDayType', {
    is: (value: string | string[]) => value === 'Half Day',
    then: () => Yup.string().required('Please select Half Day Type!'),
    otherwise: () => Yup.string().nullable(),
  }),
});

const ApplyLeave = () => {
  const navigation: any = useNavigation();
  const isDark = useSelector(isDarkTheme);
  const EmployeeId = useSelector((state: any) => state?.appState?.authToken);
  const CheckStatus = useSelector((state: any) => state?.appState?.authToken);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [showStart, setShowStart] = useState(false);
  const [showEnd, setShowEnd] = useState(false);
  const [totalDaysofLeave, setTotalDaysofLeave] = useState(0);
  const Assesstoken = useSelector((state: any) => state?.appState?.authToken);
  const accessToken = Assesstoken?.authToken?.accessToken;
  const financialYearStart = new Date(new Date().getFullYear(), 3, 1);
  const financialYearEnd = new Date(new Date().getFullYear() + 2, 2, 31);
  const connected = useSelector((state: any) => state?.appState?.connected);

  useEffect(() => {
    setTimeout(() => {
      Keyboard.dismiss();
    }, 150);
  }, []);

  const [ApplyLeave, { isLoading, error }] = useEmployeeLeaveApplyMutation();
  const [elAvailable, setElAvailable] = useState<number | null>(null);

  const onChangeStart = (event: any, selectedDate: Date) => {
    const currentDate = selectedDate || startDate;
    setShowStart(false);
    setStartDate(currentDate);
    setEndDate(currentDate);
  };

  const onChangeEnd = (event: any, selectedDate: Date) => {
    const currentDate = selectedDate || endDate;
    setShowEnd(false);
    setEndDate(currentDate);
  };

  const showDatepickerStart = () => {
    setShowStart(true);
  };

  const showDatepickerEnd = () => {
    setShowEnd(true);
  };

  useEffect(() => {
    const SD = moment(startDate).format('YYYY-MM-DD');
    const ED = moment(endDate).format('YYYY-MM-DD');
    if (SD === ED) {
      setTotalDaysofLeave(1);
    } else {
      const daysdiff =
        startDate && endDate
          ? moment(endDate).diff(moment(startDate), 'days')
          : 1;
      setTotalDaysofLeave(daysdiff);
    }
  }, [startDate, endDate]);

  const handleApply = async (values: any) => {
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
    const formattedStartDate = startDate ? moment(startDate).format('YYYY-MM-DD') : null;
    const formattedEndDate = endDate ? moment(endDate).format('YYYY-MM-DD') : null;

    const totalLeaveDay =
      values.LeaveDayType === 'Full Day' ? totalDaysofLeave : 0.5;

    const data = {
      leaveApplicationId: null,
      employeeId: CheckStatus?.userProfile?.userId,
      leaveType: { value: 674180000, label: 'Earn Leave', },
      typeofHalfDayLeave: values.LeaveDayType !== 'Full Day'
        ? {
          value: values.LeaveDayType === 'Full Day' ? null : values.HalfDayType === 'Fore Noon' ? 674180000 : 674180001,
          label: values.LeaveDayType === 'Full Day' ? null : values.HalfDayType,
        }
        : null,
      leaveStartDate: formattedStartDate,
      leaveEndDate: formattedEndDate,
      totalDaysofLeave: totalLeaveDay,
    };

    try {
      if (totalDaysofLeave >= 100) {
        Toast.show({
          type: 'success',
          text1: 'Leave Status',
          text2: 'Leave does not more than 100 days',
          text2Style: {
            flexWrap: 'wrap',
            fontSize: 20,
            fontFamily: 'Lato-Regular',
          },
          topOffset: 80,
          visibilityTime: 5000,
        });
      }
      else {
        const response: any = await ApplyLeave({ data, accessToken });
        Toast.show({
          type: 'success',
          text1: 'Leave Status',
          text2:
            response?.data?.messageDetail?.message_code === 201 &&
              response?.data?.messageDetail?.message_shortcode ===
              'SOLZIT_RECORDS_CREATED_SUCCESSFULLY'
              ? 'Leave applied successfully'
              : response?.error?.data?.messageDetail?.message_code === 4449
                ? response?.error?.data?.messageDetail?.message
                : `Something went wrong...${' '}Please try again.`,
          text2Style: {
            flexWrap: 'wrap',
            fontSize: 20,
            fontFamily: 'Lato-Regular',
          },
          topOffset: 80,
          visibilityTime: 5000,
        });

        setTimeout(() => {
          response?.data?.messageDetail?.message_code === 201 &&
            response?.data?.messageDetail?.message_shortcode ===
            'SOLZIT_RECORDS_CREATED_SUCCESSFULLY'
            ? navigation.replace('LeaveRequest')
            : null;
        }, 5000);
      }
    } catch (err) {
      console.log('Error applying leave:', err);
      
    }
  };

  const { data, refetch } = useGetBalanceLeaveDashboardQuery({
    accessToken: EmployeeId.authToken?.accessToken,
  });

  useEffect(() => {
    if (data?.data) {
      setElAvailable(data?.data?.earnleaveremaining);
    }
  }, [data]);


  return (
    <View style={{ flex: 1, backgroundColor: isDark ? Colors.black : Colors.white, }}>
      <CustomHeader
        showBackIcon={true}
        title="Apply Leave"
        onPress={() => { navigation.goBack() }}
      />
      {
        isLoading ? (
          <Placeholder />
        ) : (
          <Formik
            initialValues={{
              LeaveDayType: 'Full Day',
              LeaveType: 'Earn Leave',
              HalfDayType: 'Fore Noon',
              StartDayOfLeave: moment(startDate).format('DD-MM-YYYY'),
              EndDayOfLeave: moment(endDate).format('DD-MM-YYYY'),
            }}
            validationSchema={validationSchema}
            onSubmit={handleApply}>
            {({
              handleChange,
              handleBlur,
              handleSubmit,
              setFieldValue,
              values,
              errors,
              touched,
            }) => (
              <View>
                <View style={{ marginTop: 12 }} />

                <View style={{ marginHorizontal: 16 }}>
                  <Text
                    style={{
                      color: isDark ? Colors.white : Colors.black,
                      fontSize: 16,
                      fontFamily: 'Lato-Bold',
                      textAlign: 'left',
                      marginBottom: 16,
                    }}>
                    Current EL Balance:{' '}
                    {elAvailable !== null ? elAvailable : ''}
                    {elAvailable === 0 && (
                      <Text
                        style={{
                          color: isDark ? Colors.white : Colors.black,
                          fontSize: 16,
                        }}>
                        {'  '}(Leave applied will be marked as Loss of Pay)
                      </Text>
                    )}
                  </Text>

                  <Text
                    style={{
                      color: isDark ? Colors.white : Colors.black,
                      fontSize: 16,
                      fontFamily: 'Lato-Bold',
                    }}>
                    Leave Type
                  </Text>
                  <View style={{ flexDirection: 'row' }}>
                    <TouchableOpacity
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        marginTop: 10,
                        marginRight: 50,
                      }}
                      onPress={() => setFieldValue('LeaveType', 'Earn Leave')}>
                      <View
                        style={{
                          height: 20,
                          width: 20,
                          borderRadius: 10,
                          borderWidth: 2,
                          borderColor: isDark ? Colors.white : Colors.primary,
                          alignItems: 'center',
                          justifyContent: 'center',
                          marginRight: 10,
                        }}>
                        {values.LeaveType === 'Earn Leave' && (
                          <View
                            style={{
                              height: 10,
                              width: 10,
                              borderRadius: 5,
                              backgroundColor: isDark
                                ? Colors.white
                                : Colors.primary,
                            }}
                          />
                        )}
                      </View>
                      <Text
                        style={{
                          color: isDark ? Colors.white : Colors.black,
                          fontFamily: 'Lato-Regular',
                        }}>
                        Earn Leave
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>

                <View style={{ marginVertical: 16 }} />
                <View style={{ marginHorizontal: 16 }}>
                  <Text
                    style={{
                      color: isDark ? Colors.white : Colors.black,
                      fontSize: 16,
                      fontFamily: 'Lato-Bold',
                    }}>
                    Leave Day Type
                  </Text>
                  <View style={{ flexDirection: 'row' }}>
                    <TouchableOpacity
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        marginTop: 10,
                        marginRight: 50,
                      }}
                      onPress={() => setFieldValue('LeaveDayType', 'Full Day')}>
                      <View
                        style={{
                          height: 20,
                          width: 20,
                          borderRadius: 10,
                          borderWidth: 2,
                          borderColor: isDark ? Colors.white : Colors.primary,
                          alignItems: 'center',
                          justifyContent: 'center',
                          marginRight: 10,
                        }}>
                        {values.LeaveDayType === 'Full Day' && (
                          <View
                            style={{
                              height: 10,
                              width: 10,
                              borderRadius: 5,
                              backgroundColor: isDark
                                ? Colors.white
                                : Colors.primary,
                            }}
                          />
                        )}
                      </View>
                      <Text
                        style={{
                          color: isDark ? Colors.white : Colors.black,
                          fontFamily: 'Lato-Regular',
                        }}>
                        Full Day
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        marginTop: 10,
                      }}
                      onPress={() => setFieldValue('LeaveDayType', 'Half Day')}>
                      <View
                        style={{
                          height: 20,
                          width: 20,
                          borderRadius: 10,
                          borderWidth: 2,
                          borderColor: isDark ? Colors.white : Colors.primary,
                          alignItems: 'center',
                          justifyContent: 'center',
                          marginRight: 10,
                        }}>
                        {values.LeaveDayType === 'Half Day' && (
                          <View
                            style={{
                              height: 10,
                              width: 10,
                              borderRadius: 5,
                              backgroundColor: isDark
                                ? Colors.white
                                : Colors.primary,
                            }}
                          />
                        )}
                      </View>
                      <Text
                        style={{
                          color: isDark ? Colors.white : Colors.black,
                          fontFamily: 'Lato-Regular',
                        }}>
                        Half Day
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
                {touched.LeaveDayType && errors.LeaveDayType && (
                  <Text style={{ color: Colors.error, marginLeft: 20 }}>
                    {errors.LeaveDayType}
                  </Text>
                )}

                {values.LeaveDayType === 'Half Day' ? (
                  <View>
                    <View style={{ marginVertical: 16 }} />
                    <View style={{ marginHorizontal: 16 }}>
                      <Text
                        style={{
                          color: isDark ? Colors.white : Colors.black,
                          fontSize: 16,
                          fontFamily: 'Lato-Bold',
                        }}>
                        Half Day Type
                      </Text>
                      <View style={{ flexDirection: 'row' }}>
                        <TouchableOpacity
                          style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            marginTop: 10,
                            marginRight: 35,
                          }}
                          onPress={() =>
                            setFieldValue('HalfDayType', 'Fore Noon')
                          }>
                          <View
                            style={{
                              height: 20,
                              width: 20,
                              borderRadius: 10,
                              borderWidth: 2,
                              borderColor: isDark ? Colors.white : Colors.primary,
                              alignItems: 'center',
                              justifyContent: 'center',
                              marginRight: 10,
                            }}>
                            {values.HalfDayType === 'Fore Noon' && (
                              <View
                                style={{
                                  height: 10,
                                  width: 10,
                                  borderRadius: 5,
                                  backgroundColor: isDark
                                    ? Colors.white
                                    : Colors.primary,
                                }}
                              />
                            )}
                          </View>
                          <Text
                            style={{
                              color: isDark ? Colors.white : Colors.black,
                              fontFamily: 'Lato-Regular',
                            }}>
                            Fore Noon
                          </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            marginTop: 10,
                          }}
                          onPress={() =>
                            setFieldValue('HalfDayType', 'After Noon')
                          }>
                          <View
                            style={{
                              height: 20,
                              width: 20,
                              borderRadius: 10,
                              borderWidth: 2,
                              borderColor: isDark ? Colors.white : Colors.primary,
                              alignItems: 'center',
                              justifyContent: 'center',
                              marginRight: 10,
                            }}>
                            {values.HalfDayType === 'After Noon' && (
                              <View
                                style={{
                                  height: 10,
                                  width: 10,
                                  borderRadius: 5,
                                  backgroundColor: isDark
                                    ? Colors.white
                                    : Colors.primary,
                                }}
                              />
                            )}
                          </View>
                          <Text
                            style={{
                              color: isDark ? Colors.white : Colors.black,
                              fontFamily: 'Lato-Regular',
                            }}>
                            After Noon
                          </Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                ) : null}

                {touched.HalfDayType && errors.HalfDayType && (
                  <Text style={{ color: Colors.error, marginLeft: 20 }}>
                    {errors.HalfDayType}
                  </Text>
                )}
                <View style={{ marginVertical: 16 }} />
                <Pressable
                  onPress={() => {
                    showDatepickerStart();
                  }}>
                  <CustomTextInput
                    label="Start Day Of Leave"
                    value={moment(startDate).format('DD-MM-YYYY')}
                    onChangeText={handleChange('StartDayOfLeave')}
                    onBlur={handleBlur('StartDayOfLeave')}
                    lefticon={false}
                    rightIconName={'calendar'}
                    onPress={() => {
                      showDatepickerStart();
                    }}
                    autoFocus={false}
                    editable={false}
                    readOnly={true}
                  />
                </Pressable>
                {touched.StartDayOfLeave && errors.StartDayOfLeave && (
                  <Text style={{ color: Colors.error, marginLeft: 20 }}>
                    {errors.StartDayOfLeave}
                  </Text>
                )}
                <View style={{ marginVertical: 16 }} />
                {values.LeaveDayType === 'Half Day' ? (
                  <Pressable>
                    <CustomTextInput
                      label="End Day Of Leave"
                      value={
                        values.LeaveDayType === 'Half Day'
                          ? moment(startDate).format('DD-MM-YYYY')
                          : moment(endDate).format('DD-MM-YYYY')
                      }
                      onChangeText={handleChange('EndDayOfLeave')}
                      onBlur={handleBlur('EndDayOfLeave')}
                      lefticon={false}
                      rightIconName={'calendar'}
                      disable={true}
                      readOnly={true}
                    />
                  </Pressable>
                ) : (
                  <Pressable
                    onPress={() => {
                      showDatepickerEnd();
                    }}>
                    <CustomTextInput
                      label="End Day Of Leave"
                      value={
                        values.LeaveDayType === 'Half Day'
                          ? moment(startDate).format('DD-MM-YYYY')
                          : moment(endDate).format('DD-MM-YYYY')
                      }
                      onChangeText={handleChange('EndDayOfLeave')}
                      onBlur={handleBlur('EndDayOfLeave')}
                      lefticon={false}
                      rightIconName={'calendar'}
                      onPress={() => {
                        showDatepickerEnd();
                      }}
                      readOnly={true}
                    />
                  </Pressable>
                )}
                {touched.EndDayOfLeave && errors.EndDayOfLeave && (
                  <Text style={{ color: Colors.error, marginLeft: 20 }}>
                    {errors.EndDayOfLeave}
                  </Text>
                )}
                {showStart && (
                  <DateTimePicker
                    testID="dateTimePickerStart"
                    value={startDate}
                    mode="date"
                    display="default"
                    onChange={onChangeStart}
                    // minimumDate={new Date()}
                    minimumDate={financialYearStart && new Date()}
                    maximumDate={financialYearEnd}
                  />
                )}
                {showEnd && (
                  <DateTimePicker
                    testID="dateTimePickerEnd"
                    value={
                      values.LeaveDayType === 'Full Day' ? endDate : startDate
                    }
                    mode="date"
                    display="default"
                    onChange={onChangeEnd}
                    // minimumDate={startDate}
                    // maximumDate={
                    //   values.LeaveDayType === 'Half Day' ? startDate : undefined
                    // }
                    minimumDate={startDate}
                    maximumDate={financialYearEnd}
                  />
                )}
                <View style={{ marginVertical: 16 }} />

                <TouchableOpacity
                  style={{
                    width: SCREEN_WIDTH - 32,
                    height: 45,
                    backgroundColor: Colors.primary,
                    justifyContent: 'center',
                    alignSelf: 'center',
                    borderRadius: 3,
                  }}
                  disabled={isLoading ? true : false}
                  onPress={() => {
                    Alert.alert(
                      'Leave Status',
                      'Are you sure you want to Apply the leave?',
                      [
                        {
                          text: 'No',
                          onPress: () => { },
                          style: 'cancel',
                        },
                        {
                          text: 'Yes',
                          onPress: () => {
                            handleApply(values);
                          },
                        },
                      ],
                      { cancelable: true },
                    );
                  }}>
                  {isLoading ? (
                    <ActivityIndicator
                      animating={true}
                      color={Colors.white}
                      style={{
                        justifyContent: 'center',
                        alignItems: 'center',
                        flex: 1,
                      }}
                    />
                  ) : (
                    <Text
                      style={{
                        textAlign: 'center',
                        fontSize: 16,
                        color: Colors.white,
                        fontFamily: 'Lato-Bold',
                      }}>
                      Apply Leave
                    </Text>
                  )}
                </TouchableOpacity>
              </View>
            )}
          </Formik>
        )
      }
    </View >
  );
};

export default ApplyLeave;

const styles = (isDark: any) => StyleSheet.create({});
