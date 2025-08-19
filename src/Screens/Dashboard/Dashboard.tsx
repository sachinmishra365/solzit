import { StyleSheet, Text, View, FlatList, Image, Modal, TouchableOpacity, RefreshControl, PanResponder, } from 'react-native';
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
import EmptyData from '../../Components/EmptyData';


const { height, width } = Dimensions.get('window');

const Dashboard = ({ navigation, DrawerOpen }: any) => {
  const dispatch = useDispatch();
  const isDark = useSelector(isDarkTheme);
  const [currentDate, setCurrentDate] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [appliedLeave, SetAppliedLeave] = useState<any>([]);
  const [markedDates, setMarkedDates] = useState({});
  const [onMonth, setOnMonth] = useState(moment().format('MM-YYYY'));
  const [refreshing, setRefreshing] = React.useState(false);

  const processed = useSelector((state: any) => state?.appState?.processed);

  const Assesstoken = useSelector((state: any) => state?.appState?.authToken);
  const accessToken = Assesstoken?.authToken?.accessToken;
  const ProcessedLeaves = useProcessedLeavesQuery({ accessToken: accessToken });

  const {
    data: AppliedLeave,
    refetch: refetchapplies,
    isLoading,
  } = useEmployeeAppliedLeavesQuery({ accessToken: accessToken });

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
  }, [AppliedLeave, ProcessedLeaves]);

  useEffect(() => {
    let marked: any = {};
    const today = moment(currentDate, 'YYYY-MM-DD');

    processed?.forEach((leave: any) => {
      const { leaveStartDate, leaveEndDate } = leave;
      const isApproved = leave?.status?.label === 'Approved';
      if (isApproved) {
        for (
          const d = moment(leaveStartDate);
          d.isSameOrBefore(leaveEndDate);
          d.add(1, 'days')
        ) {
          const formattedDate = d?.format('YYYY-MM-DD');
          marked[formattedDate] = {
            color: 'green',
            textColor: 'white',
          };
          const start = moment(leaveStartDate)?.format('YYYY-MM-DD');
          const end = moment(leaveEndDate)?.format('YYYY-MM-DD');

          if (formattedDate === start) {
            marked[formattedDate] = {
              ...marked[formattedDate],
              startingDay: true,
            };
          }

          if (formattedDate === end) {
            marked[formattedDate] = {
              ...marked[formattedDate],
              endingDay: true,
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
  }, [processed, currentDate]);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      refetchapplies();
      setRefreshing(false);
    }, 1000);
  }, []);

  
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
  const renderLeaveCard = ({ item }: any) => {
    return renderHolidays({ item });
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
              <TouchableOpacity
                onPress={() => handleImagePress(HolidayImage)}
                style={{ minHeight: 38, minWidth: 38 }}>
                <Image
                  source={{ uri: HolidayImage }}
                  style={styles(isDark).Holidaylogo}
                  accessibilityLabel="Image"
                />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                onPress={() =>
                  handleImagePress(getImageSource(item?.holidayName))
                }
                style={{ minHeight: 38, minWidth: 38 }}>
                <Image
                  source={getImageSource(item?.holidayName)}
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

  
  return (
    <View
      style={{
        flex: 1,
       backgroundColor: isDark ? Colors.black : DrawerOpen === true ? Colors.white : Colors.white,
      }}
    >
      {/* <ScreenPlay
        name={
          Assesstoken?.userProfile?.fullName
            ? Assesstoken.userProfile.fullName
            : 'Guest'
        }
      /> */}

      <Calendar
        markingType={'period'}
        markedDates={markedDates}
        onMonthChange={(month: any) => {
          const date = month?.dateString;
          const extractMonth = moment(date).format('MM-YYYY');
          setOnMonth(() => extractMonth.toString());
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
        <FlatList
          data={[...appliedLeave]?.filter((item: any) =>
            moment(item?.leaveStartDate).format('MM-YYYY') === onMonth,
          )}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          renderItem={renderLeaveCard}
          keyExtractor={(item, index) => index.toString()}
          style={{ margin: 5 }}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={<EmptyData />}
        />
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
            <Text
              style={{
                color: Colors.white,
                fontSize: 17,
                fontFamily: 'Lato-Bold',
              }}>
              Close
            </Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
};

const styles = (isDark: any) =>
  StyleSheet.create({
    holidayItem: {
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
