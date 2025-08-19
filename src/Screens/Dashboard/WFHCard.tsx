import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {Colors} from '../../constants/Colors';
import {useSelector} from 'react-redux';
import {isDarkTheme} from '../../AppStore/Reducers/appState';
import {
  useCreateBreakInRequestMutation,
  useCreateCheckInRequestMutation,
  useGetAllWFHRecordListQuery,
  useUpdateBreakOutTimeRequestMutation,
  useUpdateOutTimeRequestMutation,
} from '../../Services/workFromHome';
import CustomDialogBox from '../../Components/CustomDialogBox';
import ShimmerPlaceHolder from '../Placeholder/ShimmerPlaceHolder';
import ToastMessage from '../../Components/ToastMessage';
import LinearGradient from 'react-native-linear-gradient';
import {Icon, IconButton} from 'react-native-paper';
const {height, width} = Dimensions.get('window');

const WFHCard = ({
  wfhData,
  onActionComplete,
  refetchData,
  wfhisLoading,
}: any) => {
  const isDark = useSelector(isDarkTheme);
  const Assesstoken = useSelector((state: any) => state?.appState?.authToken);
  const accessToken = Assesstoken?.authToken?.accessToken;
    console.log('1',wfhData);

  const [createCheckIn, checkInResult] = useCreateCheckInRequestMutation();
  const [createBreakIn, BreakInReult] = useCreateBreakInRequestMutation();
  const [createBreakOut, BreakOutResult] =
    useUpdateBreakOutTimeRequestMutation();
  const [updateOutTime, CheckOutResult] = useUpdateOutTimeRequestMutation();

  const [attendanceId, setAttendanceId] = useState(null);
  const [attendanceInOutID, setAttendanceInOutID] = useState(null);
  const [isBreakIn, setIsBreakIn] = useState(false);
  const [isBreakOut, setIsBreakOut] = useState(false);
  const [dialogVisible, setDialogVisible] = useState(false);
  const [dialogTitle, setDialogTitle] = useState('');
  const [dialogMessage, setDialogMessage] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [nonRemote, setNonRemote] = useState(false);

  const [onConfirmAction, setOnConfirmAction] = useState<() => void>(
    () => () => {},
  );

  useEffect(() => {
    // if (!wfhData) return;
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
    if(wfhData?.wfhApplicationId){
      setNonRemote(true)
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
      const response = await createCheckIn({
        body: {inTime: currentTime},
        accessToken: accessToken,
      }).unwrap();
      if (response?.isSuccessful) {
        setAttendanceId(response?.data);
        onActionComplete();
        ToastMessage({
          type: 'success',
          title: 'check In',
          subtitle: response?.messageDetail?.message,
        });
      }
    } catch (error: any) {
      console.error('Check-In error:', error);
    }
  };

  const handleBreakIn = async () => {
    try {
      const response = await createBreakIn({
        body: {attendanceId: attendanceId, isBreakIn: true},
        accessToken: accessToken,
      }).unwrap();
      if (response?.isSuccessful) {
        setIsBreakIn(true);
        setAttendanceInOutID(response?.data);
        onActionComplete();

        ToastMessage({
          type: 'success',
          title: 'Break In',
          subtitle: response?.messageDetail?.message,
        });
      }
    } catch (error: any) {
      console.error('Break-In error:', error);
    }
  };

  const handleBreakOut = async () => {
    try {
      const response = await createBreakOut({
        body: {attendanceInOutId: attendanceInOutID, IsBreakOut: true},
        accessToken: accessToken,
      }).unwrap();
      if (response?.isSuccessful) {
        setIsBreakIn(false);
        setIsBreakOut(false);
        onActionComplete();
        ToastMessage({
          type: 'success',
          title: 'Break out',
          subtitle: response?.messageDetail?.message,
        });
      }
    } catch (error: any) {
      console.error('Break-Out error:', error);
    }
  };

  const handleCheckOut = async () => {
    const currentTime = new Date().toISOString();
    try {
      const response = await updateOutTime({
        body: {attendanceId: attendanceId, outTime: currentTime},
        accessToken: accessToken,
      }).unwrap();

      if (response?.isSuccessful) {
        onActionComplete();
        ToastMessage({
          type: 'success',
          title: 'Check Out',
          subtitle: response?.messageDetail?.message,
        });
      }
    } catch (error: any) {
      console.error('Check-Out error:', error);
    }
  };

  if (wfhData?.isCheckedOut === true) return null;


console.log('check', Assesstoken?.userProfile?.isRemoteWorker ||nonRemote || Assesstoken?.userProfile?.isOnWFH)

  return (
    <>
      {!BreakInReult.isLoading ||
      !BreakOutResult?.isLoading ||
      !checkInResult?.isLoading ||
      !CheckOutResult.isLoading 
      ? (
       (Assesstoken?.userProfile?.isRemoteWorker ||nonRemote || Assesstoken?.userProfile?.isOnWFH)
      ? 
      (
          <LinearGradient
            colors={
              isDark
                ? ['rgba(194, 233, 251, 0.9)', 'rgba(161, 196, 253,0.7)']
                : ['#c2e9fb', '#a1c4fd']
            }
            style={styles(isDark).container}>
            {/* Header */}
            <View style={styles(isDark).headerRow}>
              <Text style={styles(isDark).headerText}>Work from Home</Text>
              <IconButton
                icon="home-outline"
                size={18}
                style={styles(isDark).iconButton}
                iconColor={Colors.black}
              />
            </View>

            {/* Body Content */}
            {wfhData?.isCheckedIn !== true ? (
              <>
                <Text style={styles(isDark).wfhInfoText}>
                  You have an approved WFH today. Start your day to log
                  punch-in.
                </Text>
                <TouchableOpacity
                  style={styles(isDark).alignEnd}
                  onPress={() => {
                    if (wfhData?.isCheckedIn) {
                      ToastMessage({
                        type: 'error',
                        title: 'Already Started',
                        subtitle: 'You have already checked in for WFH today.',
                      });
                      return;
                    }

                    showDialog(
                      'Confirm Check In',
                      'This time will be logged as your punch-in time for the attendance.',
                      handleCheckIn,
                    );
                  }}>
                  <LinearGradient
                    colors={['#00539f', '#307CE8']}
                    style={styles(isDark).startButton}>
                    <Text style={styles(isDark).startButtonText}>Start</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </>
            ) : (
              <>
                <Text style={styles(isDark).checkedInText}>
                  You’re working from home. Manage your status:{' '}
                </Text>
              </>
            )}

            {/* Buttons Row */}
            {wfhData?.isCheckedIn === true && (
              <View
                style={[
                  styles(isDark).actionContainer,
                  {backgroundColor: isDark ? '#0e0d0d' : '#e6e3e3'},
                ]}>
                {/* Take Break */}
                {!isBreakIn && (
                  <TouchableOpacity
                    style={styles(isDark).flexOne}
                    onPress={() =>
                      showDialog(
                        'Confirm Break In',
                        'This time will be logged as Break Start Time in your attendance.',
                        handleBreakIn,
                      )
                    }>
                    <LinearGradient
                      colors={['#ff8c00', '#d19040']}
                      style={styles(isDark).actionButton}>
                      <Text style={styles(isDark).actionButtonText}>
                        {' '}
                        Take a Break
                      </Text>
                    </LinearGradient>
                  </TouchableOpacity>
                )}

                {/* Return from Break */}
                {isBreakIn && !isBreakOut && (
                  <TouchableOpacity
                    style={styles(isDark).flexOne}
                    onPress={() =>
                      showDialog(
                        'Confirm Break Out',
                        'The time will be logged as Break End Time in attendance.',
                        handleBreakOut,
                      )
                    }>
                    <LinearGradient
                      colors={['#ff4381', '#ce557c']}
                      style={[
                        styles(isDark).actionButton,
                        {paddingHorizontal: 9},
                      ]}>
                      <Text style={styles(isDark).actionButtonText}>
                        Return
                      </Text>
                    </LinearGradient>
                  </TouchableOpacity>
                )}

                {/* End Day */}
                <TouchableOpacity
                  style={styles(isDark).flexOne}
                  disabled={isBreakIn && !isBreakOut}
                  onPress={() =>
                    showDialog(
                      'Confirm Check Out',
                      'This time will be logged as your punch-out time.',
                      handleCheckOut,
                    )
                  }>
                  {isBreakIn && !isBreakOut ? (
                    <View style={styles(isDark).endDisabledButton}>
                      <Text
                        style={[
                          styles(isDark).endButtonText,
                          {color: isDark ? Colors.white : Colors.gray},
                        ]}>
                        End your Day
                      </Text>
                    </View>
                  ) : (
                    <LinearGradient
                      colors={['#ff4381', '#ce557c']}
                      style={styles(isDark).actionButton}>
                      <Text style={styles(isDark).actionButtonText}>
                        End your Day
                      </Text>
                    </LinearGradient>
                  )}
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
          </LinearGradient>
        ) : null
      ) : (
        <ShimmerPlaceHolder />
      )}
    </>
  );
};

export default WFHCard;

const styles = (isDark: any) =>
  StyleSheet.create({
    container: {
      width: width * 0.51,
      borderRadius: 15,
      padding: 10,
      justifyContent: 'space-between',
    },
    headerRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    headerText: {
      fontSize: 12,
      fontFamily: 'Lato-Bold',
      color: Colors.black,
    },
    iconButton: {
      margin: 0,
    },
    wfhInfoText: {
      fontSize: 13,
      color: Colors.black,
      fontFamily: 'Lato-Regular',
      marginVertical: 4,
    },
    alignEnd: {
      alignSelf: 'flex-end',
    },
    startButton: {
      paddingVertical: 6,
      paddingHorizontal: 14,
      borderRadius: 20,
    },
    startButtonText: {
      color: Colors.white,
      fontSize: 12,
      fontFamily: 'Lato-Semibold',
    },
    checkedInText: {
      fontSize: 10,
      color: '#444',
      fontFamily: 'Lato-Regular',
      marginBottom: 4,
    },
    actionContainer: {
      borderRadius: 50,
      flexDirection: 'row',
      justifyContent: 'space-between',
      padding: 4,
      gap: 4,
    },
    actionButton: {
      borderRadius: 50,
      paddingVertical: 10,
      alignItems: 'center',
    },
    actionButtonText: {
      color: '#fff',
      fontSize: 10,
      fontFamily: 'Lato-Bold',
    },
    endDisabledButton: {
      borderRadius: 50,
      marginTop: 9,
      alignItems: 'center',
      backgroundColor: 'transparent',
    },
    endButtonText: {
      fontSize: 10,
      fontFamily: 'Lato-Bold',
      flexWrap: 'wrap',
    },
    flexOne: {
      flex: 1,
    },
  });
