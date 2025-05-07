import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { Colors } from '../../constants/Colors';
import { useSelector } from 'react-redux';
import { isDarkTheme } from '../../AppStore/Reducers/appState';
import { useCreateBreakInRequestMutation, useCreateCheckInRequestMutation, useUpdateBreakOutTimeRequestMutation, useUpdateOutTimeRequestMutation, } from '../../Services/workFromHome';
import EmptyData from '../../Components/EmptyData';


const WFHCard = ({ wfhData, onActionComplete }: any) => {

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

  return (
    <>
      {
        wfhData?.length > 0 ? (
          <View style={styles(isDark).cardContainer}>
            <View>
              <Image
                source={require('../../Assets/Images/WFH.jpg')}
                style={styles(isDark).wfhlogo}
                accessibilityLabel="Image"
              />
            </View>

            <View style={styles(isDark).contentContainer}>

              {wfhData?.isCheckedIn !== true && (
                <TouchableOpacity
                  style={{
                    backgroundColor: Colors.primary,
                    paddingHorizontal: 20,
                    paddingVertical: 10,
                    borderRadius: 5,
                    marginTop: 10,
                    alignSelf: 'center',
                  }}
                  onPress={handleCheckIn}>
                  <Text style={{ color: Colors.white, fontFamily: 'Lato-Bold' }}>
                    Start your Day
                  </Text>
                </TouchableOpacity>
              )}

              {wfhData?.isCheckedIn === true && (
                <View style={styles(isDark).buttonsContainer}>
                  {!isBreakIn && (
                    <TouchableOpacity
                      style={[styles(isDark).buttonStyle, { backgroundColor: Colors.primary }]}
                      onPress={handleBreakIn}>
                      <Text style={{ color: Colors.white, fontFamily: 'Lato-Bold' }}>
                        Take a break
                      </Text>
                    </TouchableOpacity>
                  )}
                  {isBreakIn && !isBreakOut && (
                    <TouchableOpacity
                      style={[styles(isDark).buttonStyle, { backgroundColor: Colors.error }]}
                      onPress={handleBreakOut}>
                      <Text style={{ color: Colors.white, fontFamily: 'Lato-Bold' }}>
                        Return from Break
                      </Text>
                    </TouchableOpacity>
                  )}

                  <TouchableOpacity
                    style={[styles(isDark).buttonStyle, {
                      backgroundColor: isBreakIn && !isBreakOut ? isDark ? 'rgba(189, 1, 1, 0.3)' : 'rgba(189, 1, 1, 0.3)' : Colors.error,
                      marginLeft: 10,
                    }]}
                    onPress={handleCheckOut}
                    disabled={isBreakIn && !isBreakOut}>
                    <Text style={{ color: Colors.white, fontFamily: 'Lato-Bold' }}>
                      End your Day
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </View>
        ) :
          (
            <EmptyData />
          )
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
      width: '80%',
      marginLeft: 15,
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
      marginTop: 5,
    },
    buttonStyle: {
      paddingHorizontal: 15,
      paddingVertical: 10,
      borderRadius: 5,

    },
    wfhlogo: {
      width: 60,
      height: 60,
      borderRadius: 35,
    },
  });
