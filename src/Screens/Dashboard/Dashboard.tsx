import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Image,
  Modal,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import {DateData, Calendar} from 'react-native-calendars';
import moment from 'moment';
import Fabbutton from './FabButton/Fabbutton';
import {Colors} from '../../constants/Colors';
import {
  useEmployeeAppliedLeavesQuery,
  useProcessedLeavesQuery,
  useSoluzioneHolidaysQuery,
} from '../../Services/services';
import {useDispatch, useSelector} from 'react-redux';
import {
  applied,
  auth,
  isDarkTheme,
  processedLeaves,
} from '../../AppStore/Reducers/appState';
import {Dimensions} from 'react-native';
import ImageShimmerPlaceHolder from '../Placeholder/ImageShimmerPlaceHolder';
import {logProfileData} from 'react-native-calendars/src/Profiler';
import {useEffect, useState} from 'react';
import React from 'react';

const {height, width} = Dimensions.get('window');

const Dashboard = ({navigation}: any) => {
  const dispatch = useDispatch();
  const isDark = useSelector(isDarkTheme);
  const [currentDate, setCurrentDate] = useState('');
  const [HolyDays, setHolyDays] = useState<any>([]);
  const [appliedLeave, SetAppliedLeave] = useState<any>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [markedDates, setMarkedDates] = useState({});
  const [onMonth, setOnMonth] = useState(moment().format('MM-YYYY'));
  const [calendarDate, setCalendarDate] = useState();
  const [refreshing, setRefreshing] = React.useState(false);
  // const financialYearStart = new Date(new Date().getFullYear()+1, 0, 1);
  // const financialYearEnd = new Date(new Date().getFullYear() + 1, 11, 31);

  const processed = useSelector((state: any) => state?.appState?.processed);

  const Assesstoken = useSelector((state: any) => state?.appState?.authToken);
  const accessToken = Assesstoken?.authToken?.accessToken;

  useEffect(() => {
    const tokenExpiry = Assesstoken?.authToken?.tokenExpiry;
    const currentTime = moment().toISOString();
    const isTokenExpired = moment(tokenExpiry).isSameOrBefore(currentTime);

    if (isTokenExpired) {
      dispatch(auth(undefined));
    } else {
      // console.log('Token is still valid.');
    }
  }, []);

  const {data, error, isLoading, refetch} = useSoluzioneHolidaysQuery({
    accessToken: accessToken,
  });

  useEffect(() => {
    handleholiday();
  }, []);

  const handleholiday = async () => {
    try {
      const response = await data;
      if (
        response &&
        response?.data &&
        response?.messageDetail?.message_code === 200
      ) {
        setHolyDays(response?.data);
      } else if (error) {
        dispatch(auth(undefined));
        if (!Assesstoken || Assesstoken === undefined) {
          navigation.navigate('Login');
        }
      }
    } catch (error) {}
  };

  const {data: AppliedLeave, refetch: refetchapplies} =
    useEmployeeAppliedLeavesQuery({
      accessToken: accessToken,
    });

  const ProcessedLeaves = useProcessedLeavesQuery({
    accessToken: accessToken,
  });

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
  }, [AppliedLeave, ProcessedLeaves, refetch]);

  useEffect(() => {
    if (
      ProcessedLeaves?.data?.data !== undefined &&
      ProcessedLeaves?.data?.messageDetail?.message_code === 200
    ) {
      dispatch(processedLeaves(ProcessedLeaves?.data?.data));
    }
  }, [ProcessedLeaves]);

  useEffect(() => {
    const date = moment().format('YYYY-MM-DD');
    setCurrentDate(date);
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

  const renderHolidays = ({item}: any) => {
    const base64 = `data:image/jpeg;base64`;
    const image = item?.holidayImage;
    const HolidayImage = `${base64},${image}`;

    return (
      <View style={styles(isDark).holidayItem}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            elevation: 15,
            shadowColor: isDark ? Colors.white : Colors.black,
          }}>
          <View>
            {image ? (
              <TouchableOpacity onPress={() => handleImagePress(HolidayImage)}>
                <Image
                  source={{uri: HolidayImage}}
                  style={styles(isDark).Holidaylogo}
                />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                onPress={() =>
                  handleImagePress(getImageSource(item?.holidayName))
                }>
                <Image
                  source={getImageSource(item?.holidayName)}
                  style={styles(isDark).Holidaylogo}
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
                        {moment(item.leaveStartDate).format('DD/MM/YY')}
                        {' - '}
                        {moment(item.leaveEndDate).format('DD/MM/YY')}
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

  useEffect(() => {
    handleholiday();
  }, [data]);

  useEffect(() => {
    const marked: any = {};
    const today = moment(currentDate, 'YYYY-MM-DD');
    HolyDays.forEach((holiday: any) => {
      const date = moment(holiday.date).format('YYYY-MM-DD');
      marked[date] = {
        customStyles: {
          container: {
            backgroundColor: Colors.error,
            borderRadius: 50,
          },
          text: {
            color: Colors.white,
            fontWeight: 'bold',
          },
        },
      };
    });

    if (processed !== null) {
      processed.forEach((proceed: any) => {
        const startDate = moment(proceed.leaveStartDate, 'YYYY-MM-DD');
        const endDate = moment(proceed.leaveEndDate, 'YYYY-MM-DD');
        const isApproved = proceed?.status?.label === 'Approved';
        if (isApproved) {
          let current = startDate.clone();
          while (current.isSameOrBefore(endDate)) {
            const formattedDate = current.format('YYYY-MM-DD');

            marked[formattedDate] = {
              customStyles: {
                container: {
                  backgroundColor: 'green',
                  borderRadius: 50,
                },
                text: {
                  color: Colors.white,
                  fontWeight: 'bold',
                },
              },
            };

            current.add(1, 'day');
          }
        }
      });
    }

    marked[currentDate] = {
      selected: true,
      marked: true,
      selectedColor: Colors.primary,
    };

    setMarkedDates(marked);
  }, [HolyDays, processed, currentDate]);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
      refetch();
      refetchapplies();
    }, 1000);
  }, [refetch, refetchapplies]);

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: isDark ? Colors.black : Colors.white,
      }}>
      <Calendar
        // onDayPress={handleDayPress}
        markingType={'custom'}
        markedDates={markedDates}
        onMonthChange={(month: any) => {
          setCalendarDate(month.dateString.toString());
          const date = month?.dateString;
          const extractMonth = moment(date).format('MM-YYYY');
          setOnMonth(() => extractMonth.toString());
        }}
        hideExtraDays={false}
        // disableArrowLeft={
        //   moment(calendarDate).format('YYYY-MM') ===
        //   moment(financialYearStart).format('YYYY-MM')
        //     ? true
        //     : false
        // }
        // disableArrowRight={
        //   moment(calendarDate).format('YYYY-MM') ===
        //   moment(financialYearEnd).format('YYYY-MM')
        //     ? true
        //     : false
        // }
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
          data={[...appliedLeave, ...HolyDays]?.filter(item => {
            if (
              moment(item?.leaveStartDate).format('MM-YYYY') === onMonth &&
              !item?.holidayName
            ) {
              return item;
            } else if (
              moment(item?.date).format('MM-YYYY') === onMonth &&
              item?.holidayName
            ) {
              return item;
            }
          })}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => onRefresh()}
            />
          }
          renderItem={renderHolidays}
          keyExtractor={(item, index) => index.toString()}
          style={{margin: 5}}
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
                  fontSize: 14,
                }}>
                No Records
              </Text>
            </View>
          }
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
            source={
              typeof selectedImage === 'string'
                ? {uri: selectedImage}
                : selectedImage
            }
            style={styles(isDark).modalImage}
          />
          <TouchableOpacity
            onPress={() => setModalVisible(false)}
            style={styles(isDark).closeButton}>
            <Text style={{color: Colors.white}}>Close</Text>
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
    Holidaylogo: {
      width: 45,
      height: 45,
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
    },
  });

export default Dashboard;
