import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { Colors } from '../../constants/Colors';
import { useSelector } from 'react-redux';
import { isDarkTheme } from '../../AppStore/Reducers/appState';
import { useCreateBreakInRequestMutation, useCreateCheckInRequestMutation, useGetAllWFHRecordListQuery, useUpdateBreakOutTimeRequestMutation, useUpdateOutTimeRequestMutation, } from '../../Services/workFromHome';
import EmptyData from '../../Components/EmptyData';
import CustomDialogBox from '../../Components/CustomDialogBox';
import moment from 'moment';
import { ScrollView, RefreshControl } from 'react-native';
import ShimmerPlaceHolder from '../Placeholder/ShimmerPlaceHolder';


const WFHCard = ({ wfhData, onActionComplete, refetchData ,wfhisLoading}: any) => {

  const isDark = useSelector(isDarkTheme);
  const Assesstoken = useSelector((state: any) => state?.appState?.authToken);
  const accessToken = Assesstoken?.authToken?.accessToken;

  const [createCheckIn] = useCreateCheckInRequestMutation();
  const [createBreakIn] = useCreateBreakInRequestMutation();
  const [createBreakOut] = useUpdateBreakOutTimeRequestMutation();
  const [updateOutTime] = useUpdateOutTimeRequestMutation();

  const [attendanceId, setAttendanceId] = useState(null);
  const [attendanceInOutID, setAttendanceInOutID] = useState(null);
  const [isBreakIn, setIsBreakIn] = useState(false);
  const [isBreakOut, setIsBreakOut] = useState(false);
  const [dialogVisible, setDialogVisible] = useState(false);
  const [dialogTitle, setDialogTitle] = useState('');
  const [dialogMessage, setDialogMessage] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  const [onConfirmAction, setOnConfirmAction] = useState<() => void>(
    () => () => { },
  );

  useEffect(() => {
    if (!wfhData) return;
    if (wfhData?.attendanceRegisterId) {
      setAttendanceId(wfhData.attendanceRegisterId);
    }
    if (wfhData?.attendanceInOutID) {
      setAttendanceInOutID(wfhData.attendanceInOutID);
    }
    if (wfhData?.isBreakIn !== null) {
      setIsBreakIn(wfhData.isBreakIn);
    }
    if (wfhData?.isBreakOut !== null) {
      setIsBreakOut(wfhData.isBreakOut);
    }
  }, [wfhData]);

  const showDialog = (
    title: string,
    message: string,
    onConfirm: () => void,
  ) => {
    setDialogTitle(title);
    setDialogMessage(message);
    setOnConfirmAction(() => onConfirm);
    setDialogVisible(true);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await refetchData();
    setRefreshing(false);
  };

  const handleCheckIn = async () => {
    const currentTime = new Date().toISOString();
    try {
      const response = await createCheckIn({ body: { inTime: currentTime }, accessToken: accessToken, }).unwrap();

      if (response?.isSuccessful) {
        setAttendanceId(response?.data);
        onActionComplete();
      }
    } catch (error: any) {
      console.error('Check-In error:', error);
    }
  };

  const handleBreakIn = async () => {
    try {
      const response = await createBreakIn({ body: { attendanceId: attendanceId, isBreakIn: true, }, accessToken: accessToken, }).unwrap();

      if (response?.isSuccessful) {
        setIsBreakIn(true);
        setAttendanceInOutID(response?.data);
        onActionComplete();
      }
    } catch (error: any) {
      console.error('Break-In error:', error);
    }
  };

  const handleBreakOut = async () => {
    try {
      const response = await createBreakOut({ body: { attendanceInOutId: attendanceInOutID, IsBreakOut: true, }, accessToken: accessToken, }).unwrap();

      if (response?.isSuccessful) {
        setIsBreakIn(false);
        setIsBreakOut(false);
        onActionComplete();
      }
    } catch (error: any) {
      console.error('Break-Out error:', error);
    }
  };

  const handleCheckOut = async () => {
    const currentTime = new Date().toISOString();
    try {
      const response = await updateOutTime({ body: { attendanceId: attendanceId, outTime: currentTime, }, accessToken: accessToken, }).unwrap();

      if (response?.isSuccessful) {
        onActionComplete();
      }
    } catch (error: any) {
      console.error('Check-Out error:', error);
    }
  };

  if (wfhData?.isCheckedOut === true) return null;
// console.log( wfhData);

  return (
    <>
      {!wfhisLoading ? (
       wfhData?.wfhDate ? (
          <ScrollView
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            contentContainerStyle={{ flexGrow: 1 }}
          >
            <View style={styles(isDark).cardContainer}>
              <View style={styles(isDark).contentContainer}>
                {wfhData?.isCheckedIn !== true && (
                  <>
                    <Text style={{ color: isDark ? Colors.white : Colors.black, fontFamily: 'Lato-Bold' ,lineHeight: 20}}>
                      You have an approved Work from Home today. Please remember to Start your Day as soon as you start working. This will impact your attendance.
                    </Text>
                    <TouchableOpacity
                      style={{
                        backgroundColor: Colors.primary,
                        paddingHorizontal: 20,
                        paddingVertical: 10,
                        borderRadius: 5,
                        marginTop: 10,
                        alignSelf: 'center',
                      }}
                      onPress={() =>
                        showDialog(
                          'Confirm Check In',
                          'This time will be logged as your punch-in time for the attendance.',
                          handleCheckIn,
                        )
                      }>

                      <Text style={{ color: Colors.white, fontFamily: 'Lato-Bold' }}>
                        Start your Day
                      </Text>
                    </TouchableOpacity>
                  </>
                )}

                {wfhData?.isCheckedIn === true && (
                  <View style={styles(isDark).buttonsContainer}>
                    {!isBreakIn && (
                      <>
                        <Text style={{ color: isDark ? Colors.white : Colors.black, fontFamily: 'Lato-Bold' ,lineHeight: 20}}>
                          You have started your day for Work from Home. Please make sure you End your Day when you are done with the work.
                        </Text>
                        <TouchableOpacity
                          style={[styles(isDark).buttonStyle, { backgroundColor: Colors.primary }]}
                          onPress={() => showDialog(
                            'Confirm Break In',
                            'This time will be logged as Break Start Time in your attendance.',
                            handleBreakIn,
                          )
                          }>
                          <Text style={{ color: Colors.white, fontFamily: 'Lato-Bold' }}>
                            Take a break
                          </Text>
                        </TouchableOpacity>
                      </>
                    )}
                    {isBreakIn && !isBreakOut && (
                      <>
                      <Text style={{ color: isDark ? Colors.white : Colors.black, fontFamily: 'Lato-Bold' ,lineHeight: 20}}>
                          You have started your day for Work from Home. Please make sure you End your Day when you are done with the work.
                        </Text>
                      <TouchableOpacity
                        style={[styles(isDark).buttonStyle, { backgroundColor: Colors.error }]}
                        onPress={() =>
                          showDialog(
                            'Confirm Break Out',
                            'The time will be logged as Break End Time in attendance.',
                            handleBreakOut,
                          )
                        }>
                        <Text style={{ color: Colors.white, fontFamily: 'Lato-Bold' }}>
                          Return from Break
                        </Text>
                      </TouchableOpacity>
                      </>
                    )}

                    <TouchableOpacity
                      style={[styles(isDark).buttonStyle, {
                        backgroundColor: isBreakIn && !isBreakOut ? isDark ? 'rgba(189, 1, 1, 0.3)' : 'rgba(189, 1, 1, 0.3)' : Colors.error,
                        marginLeft: 10,
                      }]}
                      onPress={() =>
                        showDialog(
                          'Confirm Check Out',
                          'This time will be logged as your punch-Out time for the attendance.',
                          handleCheckOut,
                        )
                      }
                      disabled={isBreakIn && !isBreakOut}>
                      <Text style={{ color: Colors.white, fontFamily: 'Lato-Bold' }}>
                        End your Day
                      </Text>
                    </TouchableOpacity>
                  </View>
                )}


                <CustomDialogBox
                  visible={dialogVisible}
                  title={dialogTitle}
                  message={dialogMessage}
                  onCancel={() => setDialogVisible(false)}
                  onConfirm={() => {
                    setDialogVisible(false);
                    onConfirmAction();
                  }}
                />
              </View>
            </View>
          </ScrollView>
        ) :
          (
            <EmptyData />
          )
        ):
        <ShimmerPlaceHolder/>
      }
    </>
  );
};

export default WFHCard;

const styles = (isDark: any) =>
  StyleSheet.create({
    cardContainer: {
      flexDirection: 'row',
      justifyContent: 'space-evenly',
      alignItems: 'center',
      width: '100%',
      borderRadius: 10,
      padding: 15,
    },
    contentContainer: {
      backgroundColor: isDark ? Colors.gray : Colors.background,
      padding: 10,
      borderRadius: 10,
      width: '100%',
      justifyContent: 'center',
      elevation: 1,
    },
    titleText: {
      color: isDark ? Colors.white : Colors.black,
      fontFamily: 'Lato-Semibold',
      fontSize: 16,
      textAlign: 'center',
    },
    buttonsContainer: {
      flexDirection: 'row',
      justifyContent: 'space-evenly',
      flexWrap: 'wrap',
    },
    buttonStyle: {
      paddingHorizontal: 15,
      paddingVertical: 10,
      borderRadius: 5,
      marginVertical: 15
    },
    wfhlogo: {
      width: 60,
      height: 60,
      borderRadius: 35,
    },
  });
