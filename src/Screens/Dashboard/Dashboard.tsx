import { StyleSheet, Text, View, FlatList, Image, Modal, TouchableOpacity, RefreshControl, } from 'react-native';
import { Calendar } from 'react-native-calendars';
import moment from 'moment';
import Fabbutton from './FabButton/Fabbutton';
import { Colors } from '../../constants/Colors';
import { useEmployeeAppliedLeavesQuery, useProcessedLeavesQuery, } from '../../Services/services';
import { useDispatch, useSelector } from 'react-redux';
import { applied, auth, isDarkTheme, processedLeaves, } from '../../AppStore/Reducers/appState';
import { Dimensions } from 'react-native';
import ImageShimmerPlaceHolder from '../Placeholder/ImageShimmerPlaceHolder';
import { useEffect, useState } from 'react';
import React from 'react';
import ConfettiCannon from 'react-native-confetti-cannon';

const { height, width } = Dimensions.get('window');

const Dashboard = ({ navigation }: any) => {
  const dispatch = useDispatch();
  const isDark = useSelector(isDarkTheme);
  const [currentDate, setCurrentDate] = useState('');
  const [appliedLeave, SetAppliedLeave] = useState<any>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [markedDates, setMarkedDates] = useState({});
  const [onMonth, setOnMonth] = useState(moment().format('MM-YYYY'));
  const [todaybirthday, setTodaybirthday] = useState(moment().format('DD-MM-YYYY'));
  const [refreshing, setRefreshing] = React.useState(false);
  const [confettiActive, setConfettiActive] = useState(true);

  const processed = useSelector((state: any) => state?.appState?.processed);
  const metadata = useSelector((state: any) => state?.appState?.metadata);

  const Assesstoken = useSelector((state: any) => state?.appState?.authToken);
  const accessToken = Assesstoken?.authToken?.accessToken;

  const { data: AppliedLeave, refetch: refetchapplies, isLoading } = useEmployeeAppliedLeavesQuery({ accessToken: accessToken, });

  const ProcessedLeaves = useProcessedLeavesQuery({ accessToken: accessToken });

  useEffect(() => {
    const tokenExpiry = Assesstoken?.authToken?.tokenExpiry;
    const currentTime = moment().toISOString();
    const isTokenExpired = moment(tokenExpiry).isSameOrBefore(currentTime);
    const date = moment().format('YYYY-MM-DD');
    setCurrentDate(date);
    if (isTokenExpired) {
      dispatch(auth(undefined));
    } else {
      console.log('Token is still valid.');
    }
    // setTimeout(() => {
    //   setConfettiActive(false);
    // }, 10000);

    const today = moment().format('MM-DD');
    const hasBirthdayToday = metadata?.some(
      (item: any) => moment(item.birthdayDate).format('MM-DD') === today
    );
    const isBirthday = metadata?.filter((item: any) => {
      moment(item.birthdayDate)?.format('DD-MM-YYYY') === moment()?.format('DD-MM-YYYY') && moment(item.birthdayDate)?.format('DD-MM-YYYY') === todaybirthday
    })

    const birthdayLength = isBirthday.length > 0;

    setConfettiActive(birthdayLength);
    if (birthdayLength) {
      setTimeout(() => {
        setConfettiActive(false);
      }, 6000);
    }
  }, []);


  useEffect(() => {
    if (
      AppliedLeave?.data !== undefined &&
      AppliedLeave?.data !== null &&
      AppliedLeave?.messageDetail?.message_code === 200
    ) {
      const sortedData: any = [...AppliedLeave?.data].sort((a, b) =>
        moment(a.leaveStartDate).isBefore(moment(b?.leaveStartDate)) ? -1 : 1,
      );
      SetAppliedLeave(sortedData);
      dispatch(applied(AppliedLeave?.data));
    }
    if (
      ProcessedLeaves?.data?.data !== undefined &&
      ProcessedLeaves?.data?.messageDetail?.message_code === 200
    ) {
      dispatch(processedLeaves(ProcessedLeaves?.data?.data));
    }
  }, [AppliedLeave, ProcessedLeaves,]);


  useEffect(() => {
    let marked: any = {};
    const today = moment(currentDate, 'YYYY-MM-DD');
    metadata?.forEach((holiday: any) => {
      const date = moment(holiday.date)?.format('YYYY-MM-DD');
      marked[date] = {
        color: Colors.error,
        textColor: 'white',
        startingDay: true,
        endingDay: true,
      };
    });

    processed?.forEach((leave: any) => {
      const { leaveStartDate, leaveEndDate } = leave;
      const isApproved = leave?.status?.label === 'Approved';
      if (isApproved) {
        for (const d = moment(leaveStartDate); d.isSameOrBefore(leaveEndDate); d.add(1, 'days')) {
          const formattedDate = d?.format('YYYY-MM-DD');

          marked[formattedDate] = {
            color: 'green', // Leave background color
            textColor: 'white'
          };
          const start = moment(leaveStartDate)?.format('YYYY-MM-DD')
          const end = moment(leaveEndDate)?.format('YYYY-MM-DD')

          if (formattedDate === start) {
            marked[formattedDate] = {
              ...marked[formattedDate],
              startingDay: true
            };
          }

          if (formattedDate === end) {
            marked[formattedDate] = {
              ...marked[formattedDate],
              endingDay: true
            };
          }
        }
      }
    });

    marked[currentDate] = {
      color: Colors.primary,
      textColor: 'white',
      startingDay: true,
      endingDay: true,

    };
    setMarkedDates(marked);
  }, [metadata, processed, currentDate]);


  const handleImagePress = (image: any) => {
    setSelectedImage(image);
    setModalVisible(true);
  };

  const getImageSource = (holidayName: any) => {
    if (holidayName) {
      return require('../../Assets/Images/holiday.png');
    } else {
      return require('../../Assets/Images/Correct.png');
    }
  };

  const renderBirthdays = ({ item }: any) => {
    const base64 = `data:image/jpeg;base64`;
    const image = item?.employeeImg;
    const birthdayImage = image ? `${base64},${image}` : require('../../Assets/Images/EmpBoy.png');
    const isBirthday =
      moment(item?.birthdayDate).format('DD-MM-YYYY') === moment()?.format('DD-MM-YYYY') && moment(item?.birthdayDate)?.format('DD-MM-YYYY') === todaybirthday

    return (
      <View style={styles(isDark).BithdayItem}>
        {isBirthday &&
          (
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-evenly',
                alignItems: 'center',
                elevation: 5,
                shadowColor: isDark ? Colors.white : Colors.black,
              }}>
              <View>
                {image ? (
                  <TouchableOpacity
                    onPress={() => handleImagePress(birthdayImage)}
                    style={{ minHeight: 38, minWidth: 38 }}>
                    <Image
                      source={{ uri: birthdayImage }}
                      style={styles(isDark).Holidaylogo}
                      accessibilityLabel="Image"
                    />
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    onPress={() => handleImagePress(birthdayImage)}
                    style={{ minHeight: 38, minWidth: 38 }}>
                    <Image
                      source={birthdayImage}
                      style={styles(isDark).Holidaylogo}
                      accessibilityLabel="Image"
                    />
                  </TouchableOpacity>
                )}
              </View>
              <View
                style={{
                  backgroundColor: isDark ? Colors.gray : Colors.background,
                  padding: 10,
                  height: 70,
                  borderRadius: 10,
                  width: '80%',
                  marginLeft: 15,
                  justifyContent: 'center',
                  elevation: 1,
                }}>
                {item?.fullName && (
                  <Text
                    style={{
                      color: isDark ? Colors.white : Colors.black,
                      fontFamily: 'Lato-Semibold',
                    }}>
                    🎉 Happy Birthday,{' '}{item?.fullName}! 🎂
                  </Text>
                )}

              </View>
            </View>
          )
        }
      </View>
    );
  };

  const renderHolidays = ({ item }: any) => {
    const base64 = `data:image/jpeg;base64`;
    const image = item?.holidayImage;
    const HolidayImage = `${base64},${image}`;
    return (
      <View style={styles(isDark).holidayItem}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-evenly',
            alignItems: 'center',
            elevation: 5,
            shadowColor: isDark ? Colors.white : Colors.black,
          }}>
          <View>
            {image ? (
              <TouchableOpacity onPress={() => handleImagePress(HolidayImage)} style={{ minHeight: 38, minWidth: 38 }}>
                <Image
                  source={{ uri: HolidayImage }}
                  style={styles(isDark).Holidaylogo}
                  accessibilityLabel='Image'
                />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                onPress={() =>
                  handleImagePress(getImageSource(item?.holidayName))
                }
                style={{ minHeight: 38, minWidth: 38 }}  >
                <Image
                  source={getImageSource(item?.holidayName)}
                  style={styles(isDark).Holidaylogo}
                  accessibilityLabel='Image'
                />
              </TouchableOpacity>
            )}
          </View>
          <View
            style={{
              backgroundColor: isDark ? Colors.gray : Colors.background,
              padding: 10,
              height: 70,
              borderRadius: 10,
              width: '80%',
              marginLeft: 15,
              justifyContent: 'center',
              elevation: 1,
            }}>
            {item?.holidayName && (
              <Text
                style={{
                  color: isDark ? Colors.white : Colors.black,
                  fontFamily: 'Lato-Semibold',
                }}>
                {item?.holidayName}
                {' ('}
                {moment(item.date).format('DD/MM/YY')}
                {')'}
              </Text>
            )}
            {item?.status?.label && (
              <Text
                style={{
                  color: isDark ? Colors.white : Colors.black,
                  fontFamily: 'Lato-Semibold',
                }}>
                {item?.status?.label}{' '}
                {item?.leaveStartDate === item?.leaveEndDate ? (
                  <>
                    {item.leaveStartDate ? (
                      <>
                        {'('}
                        {moment(item.leaveStartDate).format('DD/MM/YY')}
                        {')'}
                      </>
                    ) : (
                      'N/A'
                    )}
                  </>
                ) : (
                  <>
                    {item.leaveEndDate ? (
                      <>
                        {'('}
                        {moment(item?.leaveStartDate)?.format('DD/MM/YY')}
                        {' - '}
                        {moment(item?.leaveEndDate)?.format('DD/MM/YY')}
                        {')'}
                      </>
                    ) : (
                      'N/A'
                    )}
                  </>
                )}
              </Text>
            )}
          </View>
        </View>
      </View>
    );
  };

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
      refetchapplies();
    }, 1000);
  }, [refetchapplies,]);

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: isDark ? Colors.black : Colors.white,
      }}>
      <Calendar
        markingType={'period'}
        markedDates={markedDates}
        onMonthChange={(month: any) => {
          const date = month?.dateString;
          const extractMonth = moment(date).format('MM-YYYY');
          const birthDate = moment(date).format('DD-MM-YYYY');
          setOnMonth(() => extractMonth.toString());
          setTodaybirthday(() => birthDate.toString())
        }}
        hideExtraDays={true}
        theme={{
          calendarBackground: 'transparent',
          textSectionTitleColor: Colors.dark_gray,
          selectedDayBackgroundColor: Colors.primary,
          dayTextColor: Colors.dark_gray,
          todayTextColor: Colors.primary,
          arrowColor: Colors.primary,
          monthTextColor: Colors.dark_gray,
          textDisabledColor: Colors.error,
        }}
        enableSwipeMonths={false}
        disableAllTouchEventsForDisabledDays={true}
      />

      {isLoading ? (
        <ImageShimmerPlaceHolder />
      ) : (
        <>
          <FlatList
            data={[...metadata, ...appliedLeave]?.filter((item: any) => {
              if (
                moment(item?.date).format('MM-YYYY') === onMonth &&
                item?.holidayName || (item?.birthdayDate && moment(item?.birthdayDate).format('MMM, D') === moment().format('MMM, D'))
                || (moment(item?.leaveStartDate).format('MM-YYYY') === onMonth &&
                  !item?.holidayName && !item?.birthdayDate)
              ) { return item; }
            })}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={() => onRefresh()} />
            }
            renderItem={({ item }) => {
              if (item?.holidayName || (item?.birthdayDate && moment(item?.birthdayDate).format('MMM, D') === moment().format('MMM, D'))
                || (moment(item?.leaveStartDate).format('MM-YYYY') === onMonth && !item?.holidayName && !item?.birthdayDate)) {

                const holidayComponent = item?.holidayName || item?.leaveStartDate ? renderHolidays({ item }) : null;
                const birthdayComponent = item?.birthdayDate ? renderBirthdays({ item }) : null;
                return (
                  <>
                    {holidayComponent}
                    {birthdayComponent}
                  </>
                );
              }
              return null;
            }}

            keyExtractor={(item, index) => index.toString()}
            style={{ margin: 5 }}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <View
                style={{
                  height: Dimensions.get('window').height - 400,
                  justifyContent: 'center',
                }}>
                <Text
                  style={{
                    color: isDark ? Colors.white : Colors.dark_gray,
                    fontFamily: 'Lato-Bold',
                    textAlign: 'center',
                    fontSize: 16,
                  }}>
                  No Records
                </Text>
              </View>
            }
          />
          {confettiActive && (
            <ConfettiCannon
              count={200}
              origin={{ x: -10, y: 0 }}
              explosionSpeed={800}
            />
          )}

        </>
      )}

      <Fabbutton />

      <Modal
        visible={modalVisible}
        transparent={false}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}>
        <View style={styles(isDark).modalContainer}>
          <Image
            // @ts-ignore
            source={
              typeof selectedImage === 'string'
                ? { uri: selectedImage }
                : selectedImage
            }
            style={styles(isDark).modalImage}
          />
          <TouchableOpacity
            onPress={() => setModalVisible(false)}
            style={styles(isDark).closeButton}>
            <Text style={{ color: Colors.white, fontSize: 17, fontFamily: 'Lato-Bold', }}>Close</Text>
          </TouchableOpacity>
        </View>
      </Modal>

    </View>
  );
};

const styles = (isDark: any) =>
  StyleSheet.create({
    item: {
      flex: 1,
      borderRadius: 5,
      padding: 10,
      marginRight: 10,
      marginTop: 17,
    },
    emptyDate: {
      height: 15,
      flex: 1,
      paddingTop: 30,
    },
    customDay: {
      margin: 10,
      fontSize: 24,
      color: 'green',
      fontFamily: 'Lato-Semibold',
    },
    dayItem: {
      marginLeft: 34,
    },
    holidayItem: {
      padding: 10,
      elevation: 15,
      shadowColor: isDark ? Colors.white : Colors.black,
      justifyContent: 'space-evenly',
      alignItems: 'center',
    },
    BithdayItem: {
      padding: 10,
      elevation: 15,
      shadowColor: isDark ? Colors.white : Colors.black,
      justifyContent: 'space-evenly',
      alignItems: 'center',
    },
    Holidaylogo: {
      width: 50,
      height: 50,
      borderRadius: 25,
    },
    modalContainer: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    modalImage: {
      width: width * 0.9,
      height: height * 0.5,
      resizeMode: 'contain',
    },
    closeButton: {
      position: 'absolute',
      top: 40,
      right: 20,
      padding: 10,
      minHeight: 37,
    },
  });

export default Dashboard;