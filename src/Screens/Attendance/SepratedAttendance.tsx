import {
  ActivityIndicator,
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import CustomHeader from '../../Components/CustomHeader';
import {useNavigation} from '@react-navigation/native';
import {Colors} from '../../constants/Colors';
import {useSelector} from 'react-redux';
import {isDarkTheme} from '../../AppStore/Reducers/appState';
import {
  useAttendanceMonthListMutation,
  useEmployeeAttendanceQueryQuery,
} from '../../Services/services';
import {Button, Card, IconButton, Modal, Portal} from 'react-native-paper';
import {SCREEN_WIDTH} from '../../constants/Screen';
import moment from 'moment';
import Placeholder from '../Placeholder/Placeholder';
import CustomTextInput from '../../Components/CustomTextInput';
import {Formik} from 'formik';
import * as Yup from 'yup';
import {BottomSheet, IBottomSheetRef} from '../BottomSheet/BottomSheet';
import DateTimePicker from '@react-native-community/datetimepicker';

const SepratedAttendance = ({route}: any) => {
  const MonthData = route.params;
  const EmployeeId = useSelector((state: any) => state?.appState?.authToken);
  const navigation = useNavigation();
  const isDark = useSelector(isDarkTheme);
  const [attendancedata, SetAttendancedata] = useState([]);
  const [visible, setVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [mode, setMode] = useState('date');
  const [StartTime, SetStartTime] = useState(new Date());
  const [showStartTime, setShowStartTime] = useState(false);
  const [EndTime, SetEndTime] = useState(new Date());
  const [showEndTime, setShowEndTime] = useState(false);
  const [AttendanceQueryData, SetAttendanceQueryData] = useState({});

  const AttendanceQuery = useEmployeeAttendanceQueryQuery({
    AttendanceID: selectedItem?.ID,
  });

  console.log(':::', AttendanceQueryData);

  const onChangeStartTime = (event, selectedDate) => {
    const currentDate = selectedDate || StartTime;
    setShowStartTime(false);
    SetStartTime(currentDate);
  };

  const showTimepicker = () => {
    setMode('time');
    setShowStartTime(true);
  };

  const onChangeEndTime = (event, selectedDate) => {
    const currentDate = selectedDate || EndTime;
    setShowEndTime(false);
    SetEndTime(currentDate);
  };

  const showEndTimepicker = () => {
    setMode('time');
    setShowEndTime(true);
  };

  const bottomSheetRef = React.useRef<IBottomSheetRef>(null);


  const validationSchema = Yup.object().shape({
    startTime: Yup.string().required('Start time is required'),
    endTime: Yup.string().required('End time is required'),
    actualHours: Yup.number()
      .required('Actual hours are required')
      .positive('Must be a positive number')
      .integer('Must be an integer'),
    reason: Yup.string().required('Reason is required'),
  });

  const [attendanceData, {isLoading, error}] =
    useAttendanceMonthListMutation();

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
        // console.log('Attendance response:', JSON.stringify(response));
      }
    } catch (err) {
      console.error('Failed to fetch attendance:', err);
    }
  };

  useEffect(() => {
    handleSepratedAttendance();
  }, [MonthData]);

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
              {moment(item?.date).format('DD MMM, YYYY')}
            </Text>

            <View style={{}}>
              <Text
                style={{
                  color: isDark ? Colors.white : Colors.black,
                  fontSize: 16,
                  fontFamily: 'Lato-Semibold',
                }}>
                {moment(item?.inTime).format('h:mm A')} {' - '}
                {moment(item?.outTime).format('h:mm A')}
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
              Late :-{item?.isLate === false ? 'Ontime' : null}
            </Text>
            <Text
              style={{
                color: isDark ? Colors.white : Colors.black,
                fontSize: 14,
                fontFamily: 'Lato-Semibold',
              }}>
              Day Type :-{item?.isPresent ? 'Working Day' : null}
            </Text>
          </View>

          <View
            style={{flexDirection: 'row', alignItems: 'center', marginTop: 10}}>
            <Text
              style={{
                color:
                  item?.leaveType?.Label === 'Earn Leave'
                    ? isDark
                      ? Colors.white
                      : Colors.black
                    : isDark
                    ? Colors.white
                    : Colors.black,
                fontSize: 14,
                fontFamily: 'Lato-Semibold',
              }}></Text>
            <Text
              style={{
                color:
                  item?.leaveType?.Label === 'Earn Leave'
                    ? isDark
                      ? Colors.white
                      : Colors.black
                    : isDark
                    ? Colors.white
                    : Colors.black,
                fontSize: 14,
                fontFamily: 'Lato-Semibold',
              }}>
              Effective Hours :-{item?.totalHours}
            </Text>
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
              // disabled={result.isLoading}
              // onPress={showModal}
              onPress={() => {
                setSelectedItem(item);
                bottomSheetRef.current?.expand();
              }}>
              <IconButton
                style={{margin: -2}}
                icon="circle-edit-outline"
                iconColor={Colors.white}
                size={18}
                onPress={() => console.log('Pressed')}
              />
              <Text
                style={{
                  textAlign: 'center',
                  fontFamily: 'Lato-Bold',
                  color: Colors.white,
                  flexWrap: 'wrap',
                  margin: 5,
                }}>
                Request Change
              </Text>
            </TouchableOpacity>
          </View>

          <View
            style={{flexDirection: 'row', alignItems: 'center', marginTop: 10}}>
            <Text
              style={{
                color:
                  item?.leaveType?.Label === 'Earn Leave'
                    ? isDark
                      ? Colors.white
                      : Colors.black
                    : isDark
                    ? Colors.white
                    : Colors.black,
                fontSize: 14,
                fontFamily: 'Lato-Semibold',
              }}>
              Status :-
              {item?.QueryStatus?.Label ? item?.QueryStatus?.Label : ' N/A'}
            </Text>
          </View>
        </Card.Content>
      </Card>
    );
  };

  const handlequery = async () => {

    try {
      const response = await AttendanceQuery;
      if (
        (response.data.ResponseCode === 100 && response.data !== undefined) ||
        null
      ) {
        console.log('response', response);
        SetAttendanceQueryData(response.data.Data);
      }
    } catch (error) {
      console.error('Error in handlequery:', error);
    }
  };

  useEffect(() => {
    handlequery();
  }, [AttendanceQuery]);

  return (
    <View style={styles(isDark).maincontainer}>
      <CustomHeader
        showBackIcon={true}
        title="Seprated Attendance"
        onPress={() => navigation.goBack()}
      />
      <View style={styles(isDark).divider} />

      {isLoading ? (
        <Placeholder />
      ) : (
        <FlatList
          data={attendancedata}
          renderItem={renderItem}
          keyExtractor={item => item?.ID}
        />
      )}

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
                    {moment(selectedItem?.date).format('DD MMM, YYYY')}
                  </Text>

                  <View style={{}}>
                    <Text
                      style={{
                        color: isDark ? Colors.white : Colors.black,
                        fontSize: 16,
                        fontFamily: 'Lato-Semibold',
                      }}>
                      {moment(selectedItem?.inTime).format('h:mm A')} {' - '}
                      {moment(selectedItem?.outTime).format('h:mm A')}
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
                    Late :-{selectedItem?.isLate === false ? 'Ontime' : null}
                  </Text>
                  <Text
                    style={{
                      color: isDark ? Colors.white : Colors.black,
                      fontSize: 14,
                      fontFamily: 'Lato-Semibold',
                    }}>
                    Day Type :-{selectedItem?.isPresent ? 'Working Day' : null}
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
                    }}></Text>
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
          {selectedItem?.QueryStatus?.Label === 'Pending' ? (
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
                    {AttendanceQueryData?.StatusReason?.Label}
                  </Text>

                  <View style={{}}>
                    <Text
                      style={{
                        color: isDark ? Colors.white : Colors.black,
                        fontSize: 16,
                        fontFamily: 'Lato-Semibold',
                      }}>
                      Actual Hours :-{AttendanceQueryData?.ActualHour}
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
                      : 'N/A'}{'-'}
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
          ) : (
            <Formik
              initialValues={{
                startTime: moment(StartTime).format('HH:mm'),
                endTime: moment(EndTime).format('HH:mm'),
                actualHours: '',
                reason: '',
              }}
              validationSchema={validationSchema}
              onSubmit={() => {
                handlequery();
              }}>
              {({
                handleChange,
                handleBlur,
                handleSubmit,
                values,
                errors,
                touched,
              }) => (
                <View style={{paddingHorizontal: 10}}>
                  <View style={{marginVertical: 6}} />
                  <CustomTextInput
                    label="Start Time"
                    value={moment(StartTime).format('HH:mm')}
                    autoFocus={true}
                    secureTextEntry={false}
                    onChangeText={handleChange('startTime')}
                    onBlur={handleBlur('startTime')}
                    rightIconName="clock"
                    leftIconName="calendar"
                    editable={true}
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
                      value={StartTime}
                      mode={mode}
                      is24Hour={true}
                      display="default"
                      onChange={onChangeStartTime}
                    />
                  )}
                  <View style={{marginVertical: 16}} />
                  <CustomTextInput
                    label="End Time"
                    value={moment(EndTime).format('HH:mm')}
                    autoFocus={true}
                    secureTextEntry={false}
                    rightIconName="clock"
                    leftIconName="calendar"
                    onChangeText={handleChange('endTime')}
                    onBlur={handleBlur('endTime')}
                    editable={true}
                    // onPress={() => {
                    //   // setShowPassword(!showPassword);
                    // }}
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
                      value={EndTime}
                      mode={mode}
                      is24Hour={true}
                      display="default"
                      onChange={onChangeEndTime}
                    />
                  )}
                  <View style={{marginVertical: 16}} />
                  <CustomTextInput
                    label="Actual Hours"
                    value={values.actualHours}
                    autoFocus={true}
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
                      // hideModal()
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
                  {error && (
                    <Text
                      style={{
                        color: Colors.error,
                        marginTop: 20,
                        textAlign: 'center',
                        fontFamily: 'Lato-Regular',
                      }}>
                      Login failed. Please try again.
                    </Text>
                  )}
                </View>
              )}
            </Formik>
          )}
        </ScrollView>
      </BottomSheet>
      
    </View>
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
