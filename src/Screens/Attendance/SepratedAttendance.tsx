import {FlatList,StyleSheet,Text,TouchableOpacity,View} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import CustomHeader from '../../Components/CustomHeader';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {Colors} from '../../constants/Colors';
import {useSelector} from 'react-redux';
import {isDarkTheme} from '../../AppStore/Reducers/appState';
import {Card, IconButton} from 'react-native-paper';
import moment from 'moment';
import ShimmerPlaceHolder from '../Placeholder/ShimmerPlaceHolder';
import Toast from 'react-native-toast-message';
import EmptyData from '../../Components/EmptyData';
import BreaksDialog from './BreaksDialog';
import {useIsFocused} from '@react-navigation/native';
import { useAttendanceMonthListMutation, useEmployeeAttendanceQueryQuery } from '../../Services/services';

const SepratedAttendance = ({route}: any) => {
  const isFocused = useIsFocused();
  const MonthData = route.params;
  const navigation = useNavigation<any>();
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
  const [refresh, setRefresh] = useState(0);
  useEffect(() => {
    if (pickStartTime && pickEndTime) {
      const startMoment = moment(pickStartTime, 'HH:mm');
      const endMoment = moment(pickEndTime, 'HH:mm');
      let duration = moment.duration(endMoment.diff(startMoment)).asHours();
      setActualTime(duration);
    }
  }, [pickStartTime, pickEndTime]);

  const [AttendanceQueryData, SetAttendanceQueryData] = useState<any>({});

  const Assesstoken = useSelector((state: any) => state?.appState?.authToken);
  const accessToken = Assesstoken?.authToken?.accessToken;
  const connected = useSelector((state: any) => state?.appState?.connected);

  const {data: AttendanceQuery} = useEmployeeAttendanceQueryQuery({
    attendanceID: selectedItem?.id,
    accessToken: accessToken,
  });

  useEffect(() => {
    if (
      isFocused &&
      AttendanceQuery?.messageDetail?.message_code === 200 &&
      AttendanceQuery?.data
    ) {
      SetAttendanceQueryData(AttendanceQuery.data);
    }
  }, [isFocused, AttendanceQuery]);

  const [attendanceData, {isLoading}] = useAttendanceMonthListMutation();

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

    try {
      const response = await attendanceData({data, accessToken}).unwrap();
      if (response?.messageDetail?.message_code === 200) {
        SetAttendancedata(response?.data);
      }
    } catch (err) {}
  };

  useEffect(() => {
    handleSepratedAttendance();
  }, [MonthData, call,refresh]);

  const renderItem = ({item}: any) => {
    return (
      <Card
        //@ts-ignore
        style={styles(isDark).card}
        onPress={() => {
          setVisibleWorkType(!visibleWorkType),
            setSelectedBreak(item?.attendanceInOut);
        }}>
        <Card.Content>
          <View style={{justifyContent: 'space-between', flexDirection: 'row'}}>
            <Text
              style={{
                color: isDark ? Colors.white : Colors.black,
                fontSize: 16,
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
                  <View style={{flexDirection: 'row'}}>
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
                  <View style={{flexDirection: 'row', flexWrap: 'wrap'}}>
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
                  <View style={{flexDirection: 'row', flexWrap: 'wrap'}}>
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
                  <View style={{flexDirection: 'row', flexWrap: 'wrap'}}>
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
                  flexWrap: 'wrap',
                  justifyContent: 'space-between',
                }}>
                <View style={{flexDirection: 'column'}}>
                  <View style={{flexDirection: 'row'}}>
                    <Text
                      style={{
                        color: isDark ? Colors.white : Colors.black,
                        fontSize: 14,
                        fontFamily: 'Lato-Semibold',
                      }}>
                      Day Type{' : '}
                    </Text>
                    <View>
                      <Text
                        style={{
                          color:
                            item?.leaveType?.label === 'Loss of Pay'
                              ? Colors.error
                              : item?.leaveType?.label === 'Working Day'
                              ? Colors.green
                              : item?.leaveType?.label ===
                                'Soluzione Fixed Holiday'
                              ? Colors.darkgreen
                              : item?.leaveType?.label === 'Work From Home' ||
                                item?.leaveType?.label === 'Earn Leave'
                              ? '#FF9800'
                              : Colors.green,
                          fontSize: 14,
                          fontFamily: 'Lato-Semibold',
                        }}>
                        {item?.leaveType?.label
                          ? item?.leaveType?.label
                          : 'Working Day'}
                      </Text>
                      {item.isOnWFH && (
                        <Text
                          style={{
                            fontSize: 13,
                            color: Colors.primary,
                            fontFamily: 'Lato-Semibold',
                            marginTop: 2,
                          }}>
                          (Work from home)
                        </Text>
                      )}
                    </View>
                  </View>
                </View>

                <View style={{height: 'auto'}}>
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
                      navigation.navigate('AttendanceDetails', {
                        selectedItem: item,
                        onRequestChangeSuccess: () =>
                         setRefresh(prev => prev + 1),
                      });
                    }}>
                    <IconButton
                      style={{margin: -2}}
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
                      {item?.queryStatus?.label !== 'Default' &&
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
                <View style={{flexDirection: 'row'}}>
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
        <CustomHeader showBackIcon={true} title="Attendance" onPress={() => navigation.goBack()}/>
        {isLoading ? (
          <ShimmerPlaceHolder />
        ) : attendancedata.length === 0 ? (
          <EmptyData />
        ) : (
          <FlatList
            data={attendancedata}
            renderItem={renderItem}
            keyExtractor={(item: any) => item?.id.toString()}
            ListFooterComponent={<View style={{height: 100}} />}
            showsVerticalScrollIndicator={false}
          />
        )}
        <BreaksDialog
          visibleWorkType={visibleWorkType}
          setVisibleWorkType={setVisibleWorkType}
          BreaksData={selectedBreak}
        />
      </View>
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
