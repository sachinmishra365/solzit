import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  StyleSheet,
  Keyboard,
} from 'react-native';

import moment from 'moment';
import * as Yup from 'yup';
import {
  useAskEmployeeAttendanceQueryMutation,
  useEmployeeAttendanceQueryQuery,
} from '../../Services/services';
import {Colors} from '../../constants/Colors';
import {Formik} from 'formik';
import CustomTextInput from '../../Components/CustomTextInput';
import {SCREEN_WIDTH} from '../../constants/Screen';
import DateTimePicker from '@react-native-community/datetimepicker';
import Toast from 'react-native-toast-message';
import ToastMessage from '../../Components/ToastMessage';
import {useSelector} from 'react-redux';
import {isDarkTheme} from '../../AppStore/Reducers/appState';
import {Card} from 'react-native-paper';
import CustomHeader from '../../Components/CustomHeader';

const validationSchema = Yup.object().shape({
  startTime: Yup.string()
    .required('Start time is required.')
    .matches(
      /^([01]\d|2[0-3]):([0-5]\d)$/,
      'Start time must be in HH:mm format.',
    )
    .notOneOf(['00:00'], 'Start time cannot be 00:00'),

  endTime: Yup.string()
    .required('End time is required.')
    .matches(/^([01]\d|2[0-3]):([0-5]\d)$/, 'End time must be in HH:mm format.')
    .notOneOf(['00:00'], 'End time cannot be 00:00'),

  reason: Yup.string()
    .trim()
    .required('Reason is required.')
    .min(20, 'Reason must be at least 20 characters long'),
});

const AttendanceDetails = ({route, navigation}: any) => {
  const {selectedItem, onRequestChangeSuccess} = route.params || {};
  const isDark = useSelector(isDarkTheme);
  const connected = useSelector((state: any) => state?.appState?.connected);
  const [actualTime, setActualTime] = useState(0);
  const [showStartTime, setShowStartTime] = useState(false);
  const [pickStartTime, SetpickStartTime] = useState(new Date());
  const [pickEndTime, SetpickEndTime] = useState(new Date());
  const [showEndTime, setShowEndTime] = useState(false);
  const [call, setcall] = useState(false);
  const [selectedData, setSelectedData] = useState(null);

  const Assesstoken = useSelector((state: any) => state?.appState?.authToken);
  const accessToken = Assesstoken?.authToken?.accessToken;
  const {
    data: AttendanceQueryData,
    refetch,
    isLoading,
  } = useEmployeeAttendanceQueryQuery(
    {
      attendanceID: selectedItem?.id,
      accessToken: accessToken,
    },
    {refetchOnMountOrArgChange: true},
  );
  const [AskAttendanceQuery, result] = useAskEmployeeAttendanceQueryMutation();

  useEffect(() => {
    if (selectedItem) {
      setSelectedData(selectedItem);
    }
  }, [selectedItem]);

  const onChangeStartTime = (
    event: any,
    selectedTime: Date | undefined,
    setFieldValue: any,
  ) => {
    setShowStartTime(false);
    if (selectedTime) {
      const formattedTime = moment(selectedTime).format('HH:mm');
      SetpickStartTime(selectedTime);
      setFieldValue('startTime', formattedTime);

      // 👉 Update actualTime if endTime is also set
      if (pickEndTime) {
        const diff = moment(pickEndTime).diff(
          moment(selectedTime),
          'hours',
          true,
        );
        setActualTime(diff);
      }
    }
  };

  const showTimepicker = () => {
    setShowStartTime(true);
  };

  const onChangeEndTime = (
    event: any,
    selectedTime: Date | undefined,
    setFieldValue: any,
  ) => {
    setShowEndTime(false);
    if (selectedTime) {
      const formattedTime = moment(selectedTime).format('HH:mm');
      SetpickEndTime(selectedTime);
      setFieldValue('endTime', formattedTime);

      // 👉 Update actualTime if startTime is also set
      if (pickStartTime) {
        const diff = moment(selectedTime).diff(
          moment(pickStartTime),
          'hours',
          true,
        );
        setActualTime(diff);
      }
    }
  };

  const showEndTimepicker = () => {
    setShowEndTime(true);
  };

  const handleSubmit = async (values: any, setFieldValue: any) => {
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
    const data = {
      attendanceId: selectedItem?.id,
      suggestedStartTime: values.startTime,
      dates: moment(selectedItem?.date).format('YYYY-MM-DD'),
      suggestedEndtTime: values.endTime || null,
      actualHour:
        values.endTime && values.startTime
          ? moment(values.endTime, 'HH:mm').diff(
              moment(values.startTime, 'HH:mm'),
              'hours',
              true,
            )
          : 0,
      reason: values.reason,
    };

    try {
      const response = await AskAttendanceQuery({data, accessToken});

      if (response?.data?.messageDetail?.message_code === 201) {
        Toast.show({
          type: 'success',
          text1: 'Attendance Query',
          text2: 'Changes saved successfully',
          text2Style: {
            flexWrap: 'wrap',
            fontSize: 20,
            fontFamily: 'Lato-Regular',
          },
          topOffset: 80,
          visibilityTime: 5000,
        });

        if (typeof onRequestChangeSuccess === 'function') {
          onRequestChangeSuccess();
        }
        navigation.goBack();

        setcall(!call);

        setFieldValue('startTime', '');
        setFieldValue('endTime', '');
        setFieldValue('actualHour', null);
        setFieldValue('reason', '');
      } else {
        ToastMessage({
          type: 'error',
          title: 'Attendance Query',
          subtitle: response?.data?.messageDetail?.message,
        });
      }
    } catch (error) {}
  };

  return (
    <View style={styles(isDark).maincontainer}>
      <CustomHeader
        showBackIcon={true}
        title="Attendance Details"
        onPress={() => navigation.goBack()}
      />
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{backgroundColor: isDark ? Colors.black : Colors.white}}>
        {selectedItem && (
          <View>
            <Text
              style={{
                color: isDark ? Colors.white : Colors.black,
                fontSize: 18,
                fontFamily: 'Lato-Bold',
                marginBottom: 6,
                marginTop:6,
                marginLeft: 15,
              }}>
              Current data
            </Text>
            <Card
              style={{
                backgroundColor: isDark ? Colors.black : Colors.background,
                marginVertical: 10,
                borderColor: Colors.background,
                borderWidth: 1,
                marginHorizontal: 16,
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
                      fontSize: 14,
                      fontFamily: 'Lato-Semibold',
                    }}>
                    {selectedItem?.date
                      ? moment(selectedItem?.date).format('DD MMM, YYYY')
                      : 'N/A'}
                  </Text>

                  <View style={{}}>
                    <Text
                      style={{
                        color: isDark ? Colors.white : Colors.black,
                        fontSize: 16,
                        fontFamily: 'Lato-Semibold',
                      }}>
                      {selectedItem?.inTime
                        ? moment(selectedItem?.inTime).format('h:mm A')
                        : 'N/A'}{' '}
                      {' - '}
                      {selectedItem?.outTime
                        ? moment(selectedItem?.outTime).format('h:mm A')
                        : 'N/A'}
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
                  <View style={{flexDirection: 'row'}}>
                    <Text
                      style={{
                        color:
                          selectedItem?.isLate === false
                            ? 'green'
                            : Colors.error,
                        fontSize: 18,
                        fontFamily: 'Lato-Bold',
                        marginBottom: 6,
                      }}>
                      {selectedItem?.isLate === false ? 'Ontime' : 'Late'}
                    </Text>
                  </View>
                  <View style={{flexDirection: 'row'}}>
                    <Text
                      style={{
                        color: isDark ? Colors.white : Colors.black,
                        fontSize: 14,
                        fontFamily: 'Lato-Semibold',
                      }}>
                      Day Type{' : '}
                    </Text>
                    <Text
                      style={{
                        color:
                          selectedItem?.leaveType?.label === 'Loss of Pay'
                            ? Colors.error
                            : selectedItem?.leaveType?.label === 'Working Day'
                            ? Colors.green
                            : selectedItem?.leaveType?.label ===
                              'Soluzione Fixed Holiday'
                            ? Colors.darkgreen
                            : selectedItem?.leaveType?.label ===
                                'Work From Home' ||
                              selectedItem?.leaveType?.label === 'Earn Leave'
                            ? '#FF9800'
                            : Colors.green,
                        fontSize: 14,
                        fontFamily: 'Lato-Semibold',
                      }}>
                      {selectedItem?.leaveType?.label
                        ? selectedItem?.leaveType?.label
                        : 'Working Day'}
                    </Text>
                  </View>
                </View>

                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginTop: 10,
                  }}>
                  <Text
                    style={{
                      color:
                        selectedItem?.leaveType?.label === 'Earn Leave'
                          ? isDark
                            ? Colors.white
                            : Colors.black
                          : isDark
                          ? Colors.white
                          : Colors.black,
                      fontSize: 14,
                      fontFamily: 'Lato-Semibold',
                    }}>
                    Punch In/Out : {selectedItem?.hoursPunchInOutTime}
                  </Text>
                </View>
              </Card.Content>
            </Card>
          </View>
        )}

        {(AttendanceQueryData?.data?.statusReason?.label ||
          selectedItem?.queryStatus?.label) !== 'Default' ? (
          <View>
            <Text
              style={{
                color: isDark ? Colors.white : Colors.black,
                fontSize: 18,
                fontFamily: 'Lato-Bold',
                marginBottom: 6,
                marginLeft: 15,
              }}>
              Record data
            </Text>
            <Card
              style={{
                backgroundColor: isDark ? Colors.black : Colors.background,
                marginVertical: 10,
                borderColor: Colors.background,
                borderWidth: 0.5,
                marginHorizontal: 16,
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
                      fontSize: 14,
                      fontFamily: 'Lato-Semibold',
                    }}>
                    {selectedItem?.date
                      ? moment(selectedItem?.date).format('DD MMM, YYYY')
                      : 'N/A'}
                  </Text>

                  <View>
                    <Text
                      style={{
                        color: isDark ? Colors.white : Colors.black,
                        fontSize: 16,
                        fontFamily: 'Lato-Semibold',
                      }}>
                      {AttendanceQueryData?.data?.suggestedStartTime
                        ? moment(
                            AttendanceQueryData?.data?.suggestedStartTime,
                            'YYYY-MM-DDTHH:mm:ss',
                          ).format('hh:mm A')
                        : 'N/A'}
                      {' - '}
                      {AttendanceQueryData?.data?.suggestedEndtTime
                        ? moment(
                            AttendanceQueryData?.data?.suggestedEndtTime,
                            'YYYY-MM-DDTHH:mm:ss',
                          ).format('hh:mm A')
                        : 'N/A'}
                    </Text>
                  </View>
                </View>

                <View
                  style={{
                    justifyContent: 'space-between',
                    flexDirection: 'row',
                    marginTop: 5,
                    flexWrap: 'wrap',
                  }}>
                  <Text
                    style={{
                      color: isDark ? Colors.white : Colors.black,
                      fontSize: 14,
                      fontFamily: 'Lato-Semibold',
                    }}>
                    Actual Hours{' : '}
                    {AttendanceQueryData?.data?.actualHour
                      ? AttendanceQueryData?.data?.actualHour
                      : 'N/A'}
                  </Text>

                  <View>
                    <Text
                      style={{
                        color:
                          selectedItem?.queryStatus?.label === 'Pending'
                            ? 'orange'
                            : selectedItem?.queryStatus?.label === 'Approved'
                            ? 'green'
                            : Colors.error,
                        fontSize: 16,
                        fontFamily: 'Lato-Semibold',
                      }}>
                      {AttendanceQueryData?.data?.statusReason?.label
                        ? AttendanceQueryData?.data?.statusReason?.label
                        : 'N/A'}
                    </Text>
                  </View>
                </View>

                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginTop: 10,
                  }}>
                  <Text
                    style={{
                      color: isDark ? Colors.white : Colors.black,
                      fontSize: 14,
                      fontFamily: 'Lato-Semibold',
                    }}>
                    Reason : {AttendanceQueryData?.data?.reason}
                  </Text>
                </View>
              </Card.Content>
            </Card>
          </View>
        ) : (
          <>
            <Formik
              initialValues={{
                startTime: '',
                endTime: '',
                actualHours: null,
                reason: '',
              }}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}>
              {({
                handleChange,
                handleBlur,
                handleSubmit,
                values,
                setFieldValue,
                errors,
                touched,
              }) => {
                return (
                  <View style={{paddingHorizontal: 10}}>
                    <View style={{marginVertical: 6}} />
                    <CustomTextInput
                      label="Start Time"
                      value={
                        values.startTime
                          ? moment(values.startTime, 'HH:mm').format('hh:mm A')
                          : ''
                      }
                      autoFocus={false}
                      secureTextEntry={false}
                      onChangeText={handleChange('startTime')}
                      onBlur={handleBlur('startTime')}
                      rightIconName="clock"
                      readOnly={true}
                      leftIconName="calendar"
                      style={styles(isDark).input}
                      onPress={showTimepicker}
                    />
                    {touched.startTime && errors.startTime && (
                      <Text
                        style={{
                          color: Colors.error,
                          marginLeft: 20,
                          fontFamily: 'Lato-Regular',
                        }}>
                        {errors.startTime}
                      </Text>
                    )}
                    {showStartTime && (
                      <DateTimePicker
                        testID="dateTimePicker"
                        value={pickStartTime || new Date()}
                        mode="time"
                        is24Hour={false}
                        display="default"
                        accentColor={Colors.primary}
                        onChange={(event, selectedTime) =>
                          onChangeStartTime(event, selectedTime, setFieldValue)
                        }
                      />
                    )}
                    <View style={{marginVertical: 16}} />
                    <CustomTextInput
                      label="End Time"
                      value={
                        values.endTime
                          ? moment(values.endTime, 'HH:mm').format('hh:mm A')
                          : ''
                      }
                      autoFocus={false}
                      secureTextEntry={false}
                      rightIconName="clock"
                      leftIconName="calendar"
                      onChangeText={handleChange('endTime')}
                      onBlur={handleBlur('endTime')}
                      editable={true}
                      readOnly={true}
                      style={styles(isDark).input}
                      onPress={showEndTimepicker}
                    />
                    {touched.endTime && errors.endTime && (
                      <Text
                        style={{
                          color: Colors.error,
                          marginLeft: 20,
                          fontFamily: 'Lato-Regular',
                        }}>
                        {errors.endTime}
                      </Text>
                    )}
                    {showEndTime && (
                      <DateTimePicker
                        testID="dateTimePicker"
                        value={pickEndTime || new Date()}
                        mode="time"
                        is24Hour={false}
                        display="default"
                        onChange={(event, selectedTime) =>
                          onChangeEndTime(event, selectedTime, setFieldValue)
                        }
                      />
                    )}
                    <View style={{marginVertical: 16}} />
                    <CustomTextInput
                      label="Actual Hours"
                      value={actualTime.toFixed(2)}
                      onChangeText={handleChange('actualHours')}
                      onBlur={handleBlur('actualHours')}
                      secureTextEntry={false}
                      leftIconName="hours-24"
                      editable={false}
                      readOnly
                      style={styles(isDark).input}
                    />
                    {actualTime < 0 && (
                      <Text
                        style={{
                          color: Colors.error,
                          marginTop: 5,
                          marginHorizontal: 16,
                        }}>
                        Actual hours cannot be negative, Please select end time
                        after start time.
                      </Text>
                    )}
                    <View style={{marginVertical: 16}} />
                    <CustomTextInput
                      label="Reason"
                      value={values.reason}
                      secureTextEntry={false}
                      leftIconName="message-reply-text-outline"
                      onChangeText={handleChange('reason')}
                      onBlur={handleBlur('reason')}
                      editable={true}
                      style={[styles(isDark).input]}
                      contentStyle={{height: 100, paddingBottom: 10}}
                      numberOfLines={5}
                      multiline={true}
                    />
                    {touched.reason && errors.reason && (
                      <Text
                        style={{
                          color: Colors.error,
                          marginLeft: 20,
                          fontFamily: 'Lato-Regular',
                        }}>
                        {errors.reason}
                      </Text>
                    )}

                    <View style={{marginVertical: 16}} />

                    <TouchableOpacity
                      style={{
                        width: SCREEN_WIDTH - 32,
                        height: 50,
                        backgroundColor:
                          actualTime < 0 ? Colors.tertiary : Colors.primary,
                        justifyContent: 'center',
                        alignSelf: 'center',
                        borderRadius: 3,
                      }}
                      disabled={actualTime < 0 ? true : false}
                      onPress={() => handleSubmit()}>
                      {result?.isLoading ? (
                        <ActivityIndicator size="small" color={Colors.white} />
                      ) : (
                        <Text
                          style={{
                            textAlign: 'center',
                            fontFamily: 'Lato-Bold',
                            color: Colors.white,
                          }}>
                          Submit
                        </Text>
                      )}
                    </TouchableOpacity>

                    {isLoading && (
                      <ActivityIndicator size="large" color={Colors.white} />
                    )}
                  </View>
                );
              }}
            </Formik>
          </>
        )}
      </ScrollView>
    </View>
  );
};

export default AttendanceDetails;

const styles = (isDark: boolean) =>
  StyleSheet.create({
    maincontainer: {
      flex: 1,
      backgroundColor: isDark ? Colors.black : Colors.white,
    },
    card: {
      backgroundColor: Colors.background,
      margin: 16,
      padding: 16,
      borderRadius: 8,
    },
    input: {
      width: '95%',
      alignSelf: 'center',
    },
    error: {
      color: Colors.error,
      marginLeft: 20,
      fontFamily: 'Lato-Regular',
    },
  });
