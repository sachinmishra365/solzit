import {
  ActivityIndicator,
  Alert,
  FlatList,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import CustomHeader from '../../Components/CustomHeader';
import {useNavigation} from '@react-navigation/native';
import {Colors} from '../../constants/Colors';
import {useSelector} from 'react-redux';
import {isDarkTheme} from '../../AppStore/Reducers/appState';
import {
  useAskEmployeeAttendanceQueryMutation,
  useAttendanceMonthListMutation,
  useEmployeeAttendanceQueryQuery,
} from '../../Services/services';
import {Button, Card, IconButton, Modal, Portal} from 'react-native-paper';
import {SCREEN_WIDTH} from '../../constants/Screen';
import moment, {localeData} from 'moment';
import Placeholder from '../Placeholder/Placeholder';
import CustomTextInput from '../../Components/CustomTextInput';
import {Formik} from 'formik';
import * as Yup from 'yup';
import {BottomSheet, IBottomSheetRef} from '../BottomSheet/BottomSheet';
import DateTimePicker from '@react-native-community/datetimepicker';
import ShimmerPlaceHolder from '../Placeholder/ShimmerPlaceHolder';

const SepratedAttendance = ({route}: any) => {
  const MonthData = route.params;

  const navigation = useNavigation();
  const isDark = useSelector(isDarkTheme);

  const EmployeeId = useSelector((state: any) => state?.appState?.authToken);

  const [attendancedata, SetAttendancedata] = useState([]);
  const [selectedItem, setSelectedItem] = useState<any>();
  const [showStartTime, setShowStartTime] = useState(false);
  const [pickStartTime, SetpickStartTime] = useState(new Date());
  const [pickEndTime, SetpickEndTime] = useState(new Date());
  const [showEndTime, setShowEndTime] = useState(false);
  const [AttendanceQueryData, SetAttendanceQueryData] = useState({});
  const [call, setcall] = useState(false);
  const [close, SetClose] = useState(false);
  const [load, SetLoad] = useState(false);


  const bottomSheetRef = useRef<IBottomSheetRef>(null);

  const validationSchema = Yup.object().shape({
    startTime: Yup.string().required('Start time is required'),
    endTime: Yup.string().required('End time is required'),
    actualHours: Yup.number()
      .required('Actual hours are required')
      .positive('Must be a positive number')
      .integer('Must be an integer'),
    reason: Yup.string().required('Reason is required'),
  });

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
    }
  };

  const showEndTimepicker = () => {
    setShowEndTime(true);
  };

  const handleClose = () => {
    bottomSheetRef.current?.collapse();
    SetClose(false);
  };

  const [attendanceData, {isLoading, error}] = useAttendanceMonthListMutation();
  const handleSepratedAttendance = async () => {
    const data = {
      employee: {
        ID: EmployeeId?.userProfile?.userId,
      },
      leaveDM: {
        Month: {
          Value: MonthData?.Month?.Value,
        },
        Year: {
          Value: MonthData?.Year?.Value,
        },
      },
      leaveAppDM: {
        Month: {
          Value: MonthData?.Month?.Value,
        },
        Year: {
          Value: MonthData?.Year?.Value,
        },
      },
    };

    try {
      const response = await attendanceData(data).unwrap();
      if (response.ResponseCode === 100) {
        SetAttendancedata(response?.Data);
      }
    } catch (err) {
      console.error('Failed to fetch attendance:', err);
    }
  };
  useEffect(() => {
    handleSepratedAttendance();
  }, [MonthData, call]);

  const AttendanceQuery = useEmployeeAttendanceQueryQuery({
    AttendanceID: selectedItem?.ID,
  });

  const handlequery = async () => {
    try {
      const response = await AttendanceQuery;
      if (
        (response?.data?.ResponseCode === 100 &&
          response?.data !== undefined) ||
        null
      ) {
        SetAttendanceQueryData(response.data.Data);
        SetLoad(true);
      }
    } catch (error) {
      console.error('Error in handlequery:', error);
    }
  };
  useEffect(() => {
    handlequery();
  }, [AttendanceQuery]);

  const [AskAttendanceQuery] = useAskEmployeeAttendanceQueryMutation();

  const handleSubmit = async (values: any) => {
    const body = {
      ID: selectedItem?.ID,
      SuggestedStartTime: values.startTime || null,
      Dates: moment(selectedItem?.date).format('YYYY-MM-DD'),
      SuggestedEndtTime: values.endTime || null,
      ActualHour: values.actualHours,
      Reason: values.reason,
    };

    try {
      const response = await AskAttendanceQuery(body);
      console.log(response);

      Alert.alert(
        'Attendance Query ',
        'Changes saved successfully',
        [
          {
            text: 'ok',
            onPress: () => {
              handleClose();
            },
          },
        ],
        {cancelable: true},
      );
      if (response?.data) {
        setcall(!call);
      }
    } catch (error) {
      console.error('Error in handlequery:', error);
    }
  };

  const renderItem = ({item}: any) => {
    return (
      <Card
        style={{
          backgroundColor: isDark ? Colors.black : Colors.background,
          marginVertical: 10,
          borderColor: Colors.background,
          borderWidth: 0.5,
          marginHorizontal: 16,
        }}>
        <Card.Content>
          <View style={{justifyContent: 'space-between', flexDirection: 'row'}}>
            <Text
              style={{
                color: isDark ? Colors.white : Colors.black,
                fontSize: 14,
                fontFamily: 'Lato-Semibold',
              }}>
              {item?.date ? moment(item?.date).format('DD MMM, YYYY') : 'N/A'}
            </Text>

            <View style={{}}>
              <Text
                style={{
                  color: isDark ? Colors.white : Colors.black,
                  fontSize: 14,
                  fontFamily: 'Lato-Semibold',
                }}>
                {item?.inTime
                  ? `${moment(item?.inTime).format('h:mm A')}  -  `
                  : null}{' '}
                {item?.outTime ? moment(item?.outTime).format('h:mm A') : null}
              </Text>
            </View>
          </View>

          {item?.leaveType?.Label !== 'Weekend' &&
          item?.leaveType?.Label !== 'Soluzione Fixed Holiday' ? (
            <>
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
                      color: isDark ? Colors.white : Colors.black,
                      fontSize: 18,
                      fontFamily: 'Lato-Bold',
                      marginBottom: 6,
                    }}>
                    Late?{' : '}
                  </Text>
                  <Text
                    style={{
                      color: item?.isLate === false ? 'green' : Colors.error,
                      fontSize: 18,
                      fontFamily: 'Lato-Bold',
                      marginBottom: 6,
                    }}>
                    {item?.isLate === false ? 'Ontime' : 'Late'}
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
                        item?.leaveType?.Label === 'Loss of Pay'
                          ? Colors.error
                          : isDark
                          ? Colors.white
                          : Colors.black,
                      fontSize: 14,
                      fontFamily: 'Lato-Semibold',
                    }}>
                    {item?.leaveType?.Label
                      ? item?.leaveType?.Label
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
                <View style={{flexDirection: 'row'}}>
                  <Text
                    style={{
                      color: isDark ? Colors.white : Colors.black,
                      fontSize: 14,
                      fontFamily: 'Lato-Semibold',
                    }}>
                    Effective Hours{' : '}
                  </Text>
                  <Text
                    style={{
                      color:
                        item?.totalHours < 7
                          ? Colors.error
                          : isDark
                          ? Colors.white
                          : Colors.black,
                      fontSize: 14,
                      fontFamily: 'Lato-Semibold',
                    }}>
                    {item?.totalHours}
                  </Text>
                </View>

                <TouchableOpacity
                  style={{
                    height: 'auto',
                    backgroundColor: Colors.primary,
                    justifyContent: 'center',
                    alignSelf: 'center',
                    borderRadius: 3,
                    position: 'absolute',
                    right: 0,
                    alignItems: 'center',
                    flexDirection: 'row',
                  }}
                  onPress={() => {
                    setSelectedItem(item);
                    bottomSheetRef.current?.expand();
                    SetClose(true);
                  }}>
                  <IconButton
                    style={{margin: -2}}
                    icon={
                      item?.QueryStatus?.Label === 'Pending'
                        ? 'information-outline'
                        : 'circle-edit-outline'
                    }
                    iconColor={Colors.white}
                    size={18}
                  />
                  <Text
                    style={{
                      textAlign: 'center',
                      fontFamily: 'Lato-Bold',
                      color: Colors.white,
                      flexWrap: 'wrap',
                      marginRight: 5,
                    }}>
                    {item?.QueryStatus?.Label != 'Default' &&
                    item?.leaveType?.Label !== 'Weekend' &&
                    item?.leaveType?.Label !== 'Soluzione Fixed Holiday'
                      ? 'View Request'
                      : 'Request Change'}
                  </Text>
                </TouchableOpacity>
              </View>
            </>
          ) : (
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
                    color: isDark ? Colors.white : Colors.black,
                    fontSize: 14,
                    fontFamily: 'Lato-Semibold',
                  }}>
                  Effective Hours{' : '}
                </Text>
                <Text
                  style={{
                    color:
                      item?.totalHours < 7
                        ? Colors.error
                        : isDark
                        ? Colors.white
                        : Colors.black,
                    fontSize: 14,
                    fontFamily: 'Lato-Semibold',
                  }}>
                  {item?.totalHours}
                </Text>
              </View>

              <Text
                style={{
                  color: isDark ? Colors.white : Colors.black,
                  fontSize: 14,
                  fontFamily: 'Lato-Semibold',
                }}>
                Day Type{' : '}
                {item?.leaveType?.Label
                  ? item?.leaveType?.Label
                  : 'Working Day'}
              </Text>
            </View>
          )}

          {item?.QueryStatus?.Label != 'Default' &&
            item?.leaveType?.Label !== 'Weekend' &&
            item?.leaveType?.Label !== 'Soluzione Fixed Holiday' && (
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
                  Status{' : '}
                </Text>
                <Text
                  style={{
                    color:
                      item?.QueryStatus?.Label === 'Pending'
                        ? 'orange'
                        : item?.QueryStatus?.Label === 'Approved'
                        ? 'green'
                        : Colors.error,
                    fontSize: 14,
                    fontFamily: 'Lato-Semibold',
                  }}>
                  {item?.QueryStatus?.Label
                    ? item?.QueryStatus?.Label === 'Default'
                      ? null
                      : item?.QueryStatus?.Label
                    : ' N/A'}
                </Text>
              </View>
            )}
        </Card.Content>
      </Card>
    );
  };


  return (
    <>
      <View style={styles(isDark).maincontainer}>
        <CustomHeader
          showBackIcon={true}
          title="Attendance"
          onPress={() => {
            if (close === true) {
              handleClose();
            } else {
              navigation.goBack();
            }
          }}
        />
        <View style={styles(isDark).divider} />
        {isLoading ? (
          <ShimmerPlaceHolder />
        ) : attendancedata.length === 0 ? (
          <View style={{flex: 1, justifyContent: 'center'}}>
            <Text
              style={{
                color: isDark ? Colors.white : Colors.black,
                alignSelf: 'center',
                fontFamily: 'Lato-Bold',
              }}>
              No Records
            </Text>
          </View>
        ) : (
          <FlatList
            data={attendancedata}
            renderItem={renderItem}
            keyExtractor={item => item?.ID}
          />
        )}
      </View>

      <BottomSheet ref={bottomSheetRef}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={{backgroundColor: isDark ? Colors.black : Colors.white}}>
          {selectedItem && (
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
                  <Text
                    style={{
                      color: isDark ? Colors.white : Colors.black,
                      fontSize: 18,
                      fontFamily: 'Lato-Bold',
                      marginBottom: 6,
                    }}>
                    Late :-{selectedItem?.isLate === false ? 'Ontime' : 'N/A'}
                  </Text>
                  <Text
                    style={{
                      color: isDark ? Colors.white : Colors.black,
                      fontSize: 14,
                      fontFamily: 'Lato-Semibold',
                    }}>
                    Day Type :-{selectedItem?.isPresent ? 'Working Day' : 'N/A'}
                  </Text>
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
                        selectedItem?.leaveType?.Label === 'Earn Leave'
                          ? isDark
                            ? Colors.white
                            : Colors.black
                          : isDark
                          ? Colors.white
                          : Colors.black,
                      fontSize: 14,
                      fontFamily: 'Lato-Semibold',
                    }}>
                    Effective Hours :-{selectedItem?.totalHours}
                  </Text>
                </View>
              </Card.Content>
            </Card>
          )}

          {selectedItem?.QueryStatus?.Label != 'Default' ? (
            load === false ? (
              <ShimmerPlaceHolder />
            ) : (
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
                    }}>
                    <Text
                      style={{
                        color: isDark ? Colors.white : Colors.black,
                        fontSize: 14,
                        fontFamily: 'Lato-Semibold',
                      }}>
                      {AttendanceQueryData?.StatusReason?.Label
                        ? AttendanceQueryData?.StatusReason?.Label
                        : 'N/A'}
                    </Text>

                    <View style={{}}>
                      <Text
                        style={{
                          color: isDark ? Colors.white : Colors.black,
                          fontSize: 16,
                          fontFamily: 'Lato-Semibold',
                        }}>
                        Actual Hours :-
                        {AttendanceQueryData?.ActualHour
                          ? AttendanceQueryData?.ActualHour
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
                    <Text
                      style={{
                        color: isDark ? Colors.white : Colors.black,
                        fontSize: 18,
                        fontFamily: 'Lato-Bold',
                        marginBottom: 6,
                      }}>
                      {AttendanceQueryData?.SuggestedStartTime
                        ? moment(
                            AttendanceQueryData?.SuggestedStartTime,
                            'M/D/YYYY h:mm:ss A',
                          ).format('hh:mm A')
                        : 'N/A'}
                      {'-'}
                      {AttendanceQueryData?.SuggestedEndtTime
                        ? moment(
                            AttendanceQueryData?.SuggestedEndtTime,
                            'M/D/YYYY h:mm:ss A',
                          ).format('hh:mm A')
                        : 'N/A'}
                    </Text>
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
                      Reason :-{AttendanceQueryData?.Reason}
                    </Text>
                  </View>
                </Card.Content>
              </Card>
            )
          ) : (
            <View>
              <Formik
                initialValues={{
                  startTime:
                    selectedItem.inTime &&
                    moment(selectedItem.inTime).format('h:mm A'),
                  endTime:
                    selectedItem.outTime &&
                    moment(selectedItem.outTime).format('h:mm A'),
                  actualHours: '',
                  reason: '',
                }}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}>
                {({
                  handleChange,
                  handleBlur,
                  handleSubmit,
                  values,
                  errors,
                  touched,
                  setFieldValue,
                }) => (
                  <View style={{paddingHorizontal: 10}}>
                    <View style={{marginVertical: 6}} />
                    <CustomTextInput
                      label="Start Time"
                      value={values.startTime}
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
                        is24Hour={true}
                        display="default"
                        onChange={(event, selectedTime) =>
                          onChangeStartTime(event, selectedTime, setFieldValue)
                        }
                      />
                    )}
                    <View style={{marginVertical: 16}} />
                    <CustomTextInput
                      label="End Time"
                      value={values.endTime}
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
                        is24Hour={true}
                        display="default"
                        onChange={(event, selectedTime) =>
                          onChangeEndTime(event, selectedTime, setFieldValue)
                        }
                      />
                    )}
                    <View style={{marginVertical: 16}} />
                    <CustomTextInput
                      label="Actual Hours"
                      value={values.actualHours}
                      autoFocus={false}
                      secureTextEntry={false}
                      leftIconName="hours-24"
                      onChangeText={handleChange('actualHours')}
                      onBlur={handleBlur('actualHours')}
                      editable={true}
                      onPress={() => {
                        // setShowPassword(!showPassword);
                      }}
                      style={styles(isDark).input}
                      keyboardType="numeric"
                    />
                    {touched.actualHours && errors.actualHours && (
                      <Text
                        style={{
                          color: Colors.error,
                          marginLeft: 20,
                          fontFamily: 'Lato-Regular',
                        }}>
                        {errors.actualHours}
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
                      onPress={() => {
                        // setShowPassword(!showPassword);
                      }}
                      style={[styles(isDark).input]}
                      contentStyle={{height: 100, paddingBottom: 50}}
                      numberOfLines={4}
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
                        width: SCREEN_WIDTH - 90,
                        height: 45,
                        backgroundColor: Colors.primary,
                        justifyContent: 'center',
                        alignSelf: 'center',
                        borderRadius: 3,
                      }}
                      onPress={() => {
                        handleSubmit();
                        setFieldValue('ActualHour', null);
                        setFieldValue('Reason', null);
                        // navigation.replace('Attandance');
                      }}>
                      <Text
                        style={{
                          textAlign: 'center',
                          fontSize: 16,
                          fontFamily: 'Lato-Bold',
                          color: Colors.white,
                        }}>
                        Submit
                      </Text>
                    </TouchableOpacity>

                    {isLoading && (
                      <ActivityIndicator size="large" color={Colors.white} />
                    )}
                  </View>
                )}
              </Formik>
              <View style={{height: 200}} />
            </View>
          )}
        </ScrollView>
      </BottomSheet>
    </>
  );
};

export default SepratedAttendance;

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
    modalContainer: {
      backgroundColor: 'white',
      paddingHorizontal: 20,
      margin: 20,
      borderRadius: 8,
      elevation: 5,
    },
    input: {
      width: '95%',
    },
  });
