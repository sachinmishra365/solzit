import { ActivityIndicator, Animated, BackHandler, FlatList, Keyboard, KeyboardAvoidingView, ScrollView, StyleSheet, Text, TouchableOpacity, View, } from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import CustomHeader from '../../Components/CustomHeader';
import { useNavigation } from '@react-navigation/native';
import { Colors } from '../../constants/Colors';
import { useSelector } from 'react-redux';
import { isDarkTheme } from '../../AppStore/Reducers/appState';
import { useAskEmployeeAttendanceQueryMutation, useAttendanceMonthListMutation, useEmployeeAttendanceQueryQuery, } from '../../Services/services';
import { Card, IconButton } from 'react-native-paper';
import { SCREEN_WIDTH } from '../../constants/Screen';
import moment from 'moment';
import CustomTextInput from '../../Components/CustomTextInput';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { BottomSheet, IBottomSheetRef } from '../BottomSheet/BottomSheet';
import DateTimePicker from '@react-native-community/datetimepicker';
import ShimmerPlaceHolder from '../Placeholder/ShimmerPlaceHolder';
import Toast from 'react-native-toast-message';
import EmptyData from '../../Components/EmptyData';
import BreaksDialog from './BreaksDialog';
import ToastMessage from '../../Components/ToastMessage';

const SepratedAttendance = ({ route }: any) => {
  const MonthData = route.params;
  const navigation = useNavigation();
  const isDark = useSelector(isDarkTheme);
  const [attendancedata, SetAttendancedata] = useState([]);
  const [selectedItem, setSelectedItem] = useState<any>();
  const [showStartTime, setShowStartTime] = useState(false);
  const [pickStartTime, SetpickStartTime] = useState(new Date());
  const [pickEndTime, SetpickEndTime] = useState(new Date());
  const [showEndTime, setShowEndTime] = useState(false);
  const [call, setcall] = useState(false);
  const [close, SetClose] = useState(false);
  // const [load, SetLoad] = useState(false);
  const [actualTime, setActualTime] = useState(0);
  const [visibleWorkType, setVisibleWorkType] = React.useState(false);
  const [selectedBreak, setSelectedBreak] = useState<any>();
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  useEffect(() => {
    const showSubscription = Keyboard.addListener("keyboardDidShow", (event) => {
      setKeyboardHeight(event.endCoordinates.height + 70);
    });
    const hideSubscription = Keyboard.addListener("keyboardDidHide", () => {
      setKeyboardHeight(0);
    });
    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);
  
  useEffect(() => {
    if (pickStartTime && pickEndTime) {
      const startMoment = moment(pickStartTime, 'HH:mm');
      const endMoment = moment(pickEndTime, 'HH:mm');
      let duration = moment.duration(endMoment.diff(startMoment)).asHours();
      setActualTime(duration);
    }
  }, [pickStartTime, pickEndTime]);

  const [AttendanceQueryData, SetAttendanceQueryData] = useState({});

  const Assesstoken = useSelector((state: any) => state?.appState?.authToken);
  const accessToken = Assesstoken?.authToken?.accessToken;
  const connected = useSelector((state: any) => state?.appState?.connected);

  const bottomSheetRef = useRef<IBottomSheetRef>(null);

  const handleClose = () => {
    bottomSheetRef.current?.collapse();
    SetClose(false);
  };

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => backHandler.remove();
  }, [close]);

  const backAction = () => {
    if (close) {
      handleClose();
      return true;
    } else {
      return false;
    }
  };

  const validationSchema = Yup.object().shape({
    startTime: Yup.string().required('Start time is required.').test('Start time can not be 00:00', value => value !== '00:00'),
    endTime: Yup.string().required('End time is required.').test('End time can not be 00:00', value => value !== '00:00'),
    reason: Yup.string().required('Reason is required.'),
  });

  const onChangeStartTime = (event: any, selectedTime: Date | undefined, setFieldValue: any,) => {
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

  const onChangeEndTime = (event: any, selectedTime: Date | undefined, setFieldValue: any,) => {
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

  const [attendanceData, { isLoading, error }] = useAttendanceMonthListMutation();

  const data = {
    month: {
      value: MonthData?.month?.value,
      label: MonthData?.month?.label,
    },
    year: {
      value: MonthData?.year?.value,
      label: MonthData?.year?.label,
    },
  };

  const handleSepratedAttendance = async () => {
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
      const response = await attendanceData({ data, accessToken }).unwrap();
      if (response?.messageDetail?.message_code === 200) {
        SetAttendancedata(response?.data);
      }
    } catch (err) { }
  };

  useEffect(() => {
    handleSepratedAttendance();
  }, [MonthData, call]);

  const AttendanceQuery = useEmployeeAttendanceQueryQuery({
    attendanceID: selectedItem?.id,
    accessToken: accessToken,
  });

  const handlequery = async () => {
    try {
      const response = await AttendanceQuery;
      if (
        response?.data?.messageDetail?.message_code === 200 &&
        response?.data !== undefined &&
        response?.data !== null
      ) {
        SetAttendanceQueryData(response?.data?.data);
        // SetLoad(true);
      }
    } catch (error) { }
  };

  useEffect(() => {
    handlequery();
  }, [AttendanceQuery, call]);

  const [AskAttendanceQuery, result] = useAskEmployeeAttendanceQueryMutation();

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
      const response = await AskAttendanceQuery({ data, accessToken });
      console.log('response:', response);

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

        handleClose();
        setcall(!call);

        setFieldValue('startTime', '');
        setFieldValue('endTime', '');
        setFieldValue('actualHour', null);
        setFieldValue('reason', '');
      } else {
        ToastMessage({ type: "error", title: "Attendance Query", subtitle:response?.data?.messageDetail?.message });
      }
    } catch (error) { }
  };

  const renderItem = ({ item }: any) => {
    console.log('item:', item?.leaveType?.label);

    return (
      <Card
        //@ts-ignore
        style={styles(isDark).card} onPress={item?.leaveType?.value === 674180007 ? () => { setVisibleWorkType(!visibleWorkType), setSelectedBreak(item?.attendanceInOut) } : null}>
        <Card.Content>
          <View style={{ justifyContent: 'space-between', flexDirection: 'row' }}>
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

          {item?.leaveType?.label !== 'Weekend' &&
            item?.leaveType?.label !== 'Soluzione Fixed Holiday' ? (
            <>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  marginTop: 10,
                }}>
                {item?.leaveType?.label !== 'Loss of Pay' &&
                  item?.leaveType?.label !== 'Earn Leave' ? (
                  <View style={{ flexDirection: 'row' }}>
                    {/* <Text
                      style={{
                        color: isDark ? Colors.white : Colors.black,
                        fontSize: 18,
                        fontFamily: 'Lato-Bold',
                      }}>
                      Late?{' : '}
                    </Text> */}
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
                ) : null}

                {item?.leaveType?.label !== 'Loss of Pay' &&
                  item?.hoursPunchInOutTime > 0 ? (
                  <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                    <Text
                      style={{
                        color: isDark ? Colors.white : Colors.black,
                        fontSize: 14,
                        fontFamily: 'Lato-Semibold',
                        flexWrap: 'wrap',
                      }}>
                      Punch In/Out{' : '}
                    </Text>
                    <Text
                      style={{
                        color:
                          item?.hoursPunchInOutTime < 7
                            ? Colors.error
                            : isDark
                              ? Colors.white
                              : Colors.black,
                        fontSize: 14,
                        fontFamily: 'Lato-Semibold',
                      }}>
                      {item?.hoursPunchInOutTime}
                    </Text>
                  </View>
                ) : null}
              </View>

              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  marginVertical: 10,
                }}>
                {item?.leaveType?.label !== 'Loss of Pay' &&
                  item?.loggedHours > 0 ? (
                  <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                    <Text
                      style={{
                        color: isDark ? Colors.white : Colors.black,
                        fontSize: 14,
                        fontFamily: 'Lato-Semibold',
                        flexWrap: 'wrap',
                      }}>
                      Logged Hours{' : '}
                    </Text>
                    <Text
                      style={{
                        color:
                          item?.loggedHours < 7
                            ? Colors.error
                            : isDark
                              ? Colors.white
                              : Colors.black,
                        fontSize: 14,
                        fontFamily: 'Lato-Semibold',
                      }}>
                      {item?.loggedHours}
                    </Text>
                  </View>
                ) : null}

                {item?.leaveType?.label !== 'Loss of Pay' &&
                  item?.totalEffectiveApprovedHours > 0 ? (
                  <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                    <Text
                      style={{
                        color: isDark ? Colors.white : Colors.black,
                        fontSize: 14,
                        fontFamily: 'Lato-Semibold',
                        flexWrap: 'wrap',
                      }}>
                      Effective Hours{' : '}
                    </Text>
                    <Text
                      style={{
                        color:
                          item?.totalEffectiveApprovedHours < 7
                            ? Colors.error
                            : isDark
                              ? Colors.white
                              : Colors.black,
                        fontSize: 14,
                        fontFamily: 'Lato-Semibold',
                      }}>
                      {item?.totalEffectiveApprovedHours}
                    </Text>
                  </View>
                ) : null}
              </View>

              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  // marginTop: 10,
                  flexWrap: 'wrap',
                  justifyContent: 'space-between',
                }}>
                <View style={{ flexDirection: 'row' }}>
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
                        item?.leaveType?.label === 'Loss of Pay'
                          ? Colors.error
                          : item?.leaveType?.label === 'Working Day'
                            ? Colors.green
                            : item?.leaveType?.label === 'Soluzione Fixed Holiday'
                              ? Colors.darkgreen
                              : item?.leaveType?.label === 'Work From Home' || item?.leaveType?.label === 'Earn Leave'
                                ? '#FF9800' : Colors.green,
                      fontSize: 14,
                      fontFamily: 'Lato-Semibold',
                    }}>
                    {item?.leaveType?.label
                      ? item?.leaveType?.label
                      : 'Working Day'}
                  </Text>
                </View>
                <View
                  style={{
                    height: 'auto',
                  }}>
                  <TouchableOpacity
                    style={{
                      backgroundColor: Colors.primary,
                      justifyContent: 'center',
                      alignItems: 'center',
                      borderRadius: 3,
                      flexDirection: 'row',
                      marginTop: 6,
                    }}
                    onPress={() => {
                      setSelectedItem(item);
                      bottomSheetRef.current?.expand();
                      SetClose(true);
                    }}>
                    <IconButton
                      style={{ margin: -2 }}
                      icon={
                        item?.queryStatus?.label !== 'Default'
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
                      {item?.queryStatus?.label != 'Default' &&
                        item?.leaveType?.label !== 'Weekend' &&
                        item?.leaveType?.label !== 'Soluzione Fixed Holiday'
                        ? 'View Request'
                        : 'Request Change'}
                    </Text>
                  </TouchableOpacity>
                </View>
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
              <Text
                style={{
                  color: isDark ? Colors.white : Colors.black,
                  fontSize: 14,
                  fontFamily: 'Lato-Semibold',
                }}>
                Day Type{' : '}
                {item?.leaveType?.label
                  ? item?.leaveType?.label
                  : 'Working Day'}
              </Text>
              {item.hoursPunchInOutTime > 0 ? (
                <View style={{ flexDirection: 'row' }}>
                  <Text
                    style={{
                      color: isDark ? Colors.white : Colors.black,
                      fontSize: 14,
                      fontFamily: 'Lato-Semibold',
                    }}>
                    Punch In/Out{' : '}
                  </Text>
                  <Text
                    style={{
                      color:
                        item?.hoursPunchInOutTime < 7
                          ? Colors.error
                          : isDark
                            ? Colors.white
                            : Colors.black,
                      fontSize: 14,
                      fontFamily: 'Lato-Semibold',
                    }}>
                    {item?.hoursPunchInOutTime}
                  </Text>
                </View>
              ) : null}
            </View>
          )}

          {item?.queryStatus?.label != 'Default' &&
            item?.leaveType?.label !== 'Weekend' &&
            item?.leaveType?.label !== 'Soluzione Fixed Holiday' && (
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
                      item?.queryStatus?.label === 'Pending'
                        ? 'orange'
                        : item?.queryStatus?.label === 'Approved'
                          ? 'green'
                          : Colors.error,
                    fontSize: 14,
                    fontFamily: 'Lato-Semibold',
                  }}>
                  {item?.queryStatus?.label
                    ? item?.queryStatus?.label === 'Default'
                      ? null
                      : item?.queryStatus?.label
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
        {isLoading ? (
          <ShimmerPlaceHolder />
        ) : attendancedata.length === 0 ? (
          <EmptyData />
        ) : (
          <FlatList
            data={attendancedata}
            renderItem={renderItem}
            keyExtractor={(item: any) => item?.id.toString()}
            ListFooterComponent={<View style={{ height: 100 }} />}
            showsVerticalScrollIndicator={false}
          />
        )}
        <BreaksDialog
          visibleWorkType={visibleWorkType}
          setVisibleWorkType={setVisibleWorkType}
          BreaksData={selectedBreak}
        />
      </View>

      <BottomSheet ref={bottomSheetRef}>
        <KeyboardAvoidingView behavior='height' style={{ flex: 1, flexGrow: 1 }} >
          <Animated.View style={[{ paddingBottom: keyboardHeight }]}>
            <ScrollView
              showsVerticalScrollIndicator={false}
              style={{ backgroundColor: isDark ? Colors.black : Colors.white }}>
              {selectedItem && (
                <View>
                  <Text
                    style={{
                      color: isDark ? Colors.white : Colors.black,
                      fontSize: 18,
                      fontFamily: 'Lato-Bold',
                      marginBottom: 6,
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
                        <View style={{ flexDirection: 'row' }}>
                          {/* <Text
                        style={{
                          color: isDark ? Colors.white : Colors.black,
                          fontSize: 18,
                          fontFamily: 'Lato-Bold',
                          marginBottom: 6,
                        }}>
                        Late?{' : '}
                      </Text> */}
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
                        <View style={{ flexDirection: 'row' }}>
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
                                    : selectedItem?.leaveType?.label === 'Soluzione Fixed Holiday'
                                      ? Colors.darkgreen
                                      : selectedItem?.leaveType?.label === 'Work From Home' || selectedItem?.leaveType?.label === 'Earn Leave'
                                        ? '#FF9800' : Colors.green,
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

              {selectedItem?.queryStatus?.label != 'Default' ? (
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
                            {AttendanceQueryData?.suggestedStartTime
                              ? moment(
                                AttendanceQueryData?.suggestedStartTime,
                                'YYYY-MM-DDTHH:mm:ss',
                              ).format('hh:mm A')
                              : 'N/A'}
                            {' - '}
                            {AttendanceQueryData?.suggestedEndtTime
                              ? moment(
                                AttendanceQueryData?.suggestedEndtTime,
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
                          {AttendanceQueryData?.actualHour
                            ? AttendanceQueryData?.actualHour
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
                            {AttendanceQueryData?.statusReason?.label
                              ? AttendanceQueryData?.statusReason?.label
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
                          Reason : {AttendanceQueryData?.reason}
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
                        <View style={{ paddingHorizontal: 10 }}>
                          <View style={{ marginVertical: 6 }} />
                          <CustomTextInput
                            label="Start Time"
                            value={
                              values.startTime
                                ? moment(values.startTime, 'HH:mm').format(
                                  'hh:mm A',
                                )
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
                                onChangeStartTime(
                                  event,
                                  selectedTime,
                                  setFieldValue,
                                )
                              }
                            />
                          )}
                          <View style={{ marginVertical: 16 }} />
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
                          <View style={{ marginVertical: 16 }} />
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
                              Actual hours cannot be negative, Please select end
                              time after start time.
                            </Text>
                          )}
                          <View style={{ marginVertical: 16 }} />
                          <CustomTextInput
                            label="Reason"
                            value={values.reason}
                            secureTextEntry={false}
                            leftIconName="message-reply-text-outline"
                            onChangeText={handleChange('reason')}
                            onBlur={handleBlur('reason')}
                            editable={true}
                            style={[styles(isDark).input]}
                            contentStyle={{ height: 100, paddingBottom: 10 }}
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

                          <View style={{ marginVertical: 16 }} />

                          <TouchableOpacity
                            style={{
                              width: SCREEN_WIDTH - 90,
                              height: 45,
                              backgroundColor:
                                actualTime < 0 ? Colors.tertiary : Colors.primary,
                              justifyContent: 'center',
                              alignSelf: 'center',
                              borderRadius: 3,
                            }}
                            disabled={actualTime < 0 ? true : false}
                            onPress={() => handleSubmit()}>
                            {
                              result?.isLoading ? (
                                <ActivityIndicator
                                  size="small"
                                  color={Colors.white}
                                />
                              ) : (
                                <Text
                                  style={{
                                    textAlign: 'center',
                                    fontFamily: 'Lato-Bold',
                                    color: Colors.white,
                                  }}>
                                  Submit
                                </Text>
                              )
                            }
                          </TouchableOpacity>

                          {isLoading && (
                            <ActivityIndicator size="large" color={Colors.white} />
                          )}
                        </View>
                      );
                    }}
                  </Formik>
                  <View style={{ height: 200 }} />
                </>
              )}
            </ScrollView>
          </Animated.View>
        </KeyboardAvoidingView>
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
    card: {
      backgroundColor: isDark ? Colors.black : Colors.background,
      marginVertical: 7,
      borderColor: Colors.background,
      borderWidth: 0.5,
      marginHorizontal: 16,
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
