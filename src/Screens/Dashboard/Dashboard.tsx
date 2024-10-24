import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Image,
  Modal,
  TouchableOpacity,
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

const {height, width} = Dimensions.get('window');

const Dashboard = () => {
  const dispatch = useDispatch();
  const isDark = useSelector(isDarkTheme);
  const [currentDate, setCurrentDate] = useState('');
  const [HolyDays, setHolyDays] = useState<any>([]);
  const [appliedLeave, SetAppliedLeave] = useState<any>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [markedDates, setMarkedDates] = useState({});

  const EmployeeId = useSelector((state: any) => state?.appState?.authToken);
  const processed = useSelector((state: any) => state?.appState?.processed);

  const Assesstoken = useSelector((state: any) => state?.appState?.authToken);
  const accessToken = Assesstoken?.authToken?.accessToken;

  const {data, error, isLoading} = useSoluzioneHolidaysQuery({
    accessToken: accessToken,
  });

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
        dispatch(auth(null));
      }
    } catch (error) {
      // console.log(error);
    }
  };

  useEffect(() => {
    handleholiday();
  }, [data]);

  const AppliedLeave = useEmployeeAppliedLeavesQuery({
    // ids: EmployeeId?.userProfile?.userId || null,
    accessToken: accessToken,
  });

  const ProcessedLeaves = useProcessedLeavesQuery({
    // Id: EmployeeId?.userProfile?.userId || null,
    accessToken: accessToken,
  });

  useEffect(() => {
    if (
      AppliedLeave?.data?.data !== undefined &&
      AppliedLeave?.data?.data !== null &&
      AppliedLeave?.data?.messageDetail?.message_code === 200
    ) {
      const sortedData: any = [...AppliedLeave?.data?.data].sort((a, b) =>
        moment(a.leaveStartDate).isBefore(moment(b?.leaveStartDate)) ? -1 : 1,
      );
      SetAppliedLeave(sortedData);
      dispatch(applied(AppliedLeave?.data?.data));
    }
  }, [AppliedLeave]);
  console.log(JSON.stringify(AppliedLeave));
  

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

  const handleDayPress = (day: DateData) => {
    setCurrentDate(day.dateString);
  };

  const handleImagePress = (image: any) => {
    setSelectedImage(image);
    setModalVisible(true);
  };

  const getImageSource = (holidayName: any) => {
    switch (holidayName) {
      case 'Dhanteras':
        return require('../../Assets/Images/Danteras.jpg');
      case 'Mahatma Gandhi Jayanti':
        return require('../../Assets/Images/GandhiJyanti.jpg');
      case 'Deepawali':
      case 'Deepavali':
      case 'Diwali':
      case 'Diwali/Deepavali':
        return require('../../Assets/Images/Deewali.jpg');
      case 'Christmas':
        return require('../../Assets/Images/Chrismas.jpg');
      case "New Year's Day":
        return require('../../Assets/Images/NewYear.jpg');
      case 'Republic Day':
        return require('../../Assets/Images/republicDay.jpg');
      case 'Holi':
        return require('../../Assets/Images/holi.jpg');
      case 'Ramzan Id':
      case 'Eid-ul-Fitar':
        return require('../../Assets/Images/Chrismas.jpg');
      case 'Bakrid':
      case 'Eid ul-Adha':
        return require('../../Assets/Images/Chrismas.jpg');
      case 'Independence Day':
        return require('../../Assets/Images/independence.jpg');
      case 'Raksha Bandhan':
      case 'Rakhi':
        return require('../../Assets/Images/Rakhi.jpg');
      default:
        return require('../../Assets/Images/Correct.png');
    }
  };

  const renderHolidays = ({item}: any) => {
    const base64 = `data:image/jpeg;base64`;
    const image = item?.holidayImage;
    const HolidayImage = `${base64},${image}`;
    const LeaveIMG = !HolidayImage;

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
                  handleImagePress(getImageSource(item.holidayName))
                }>
                <Image
                  source={getImageSource(item.holidayName)}
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
            {item.holidayName && (
              <Text
                style={{
                  color: isDark ? Colors.white : Colors.black,
                  fontFamily: 'Lato-Semibold',
                }}>
                {item.holidayName}
                {' ('}
                {moment(item.date).format('DD/MM/YY ')}
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

    // processed.forEach((proceed: any) => {
    //   const startDate = moment(proceed.leaveStartDate, 'YYYY-MM-DD');
    //   const endDate = moment(proceed.leaveEndDate, 'YYYY-MM-DD');
    //   const isApproved = proceed?.status?.label === 'Approved';

    //   if (isApproved && endDate.isAfter(today)) {
    //     let current = startDate.clone();
    //     while (current.isSameOrBefore(endDate)) {
    //       if (current.isAfter(today)) {
    //         const formattedDate = current.format('YYYY-MM-DD');
    //         marked[formattedDate] = {
    //           customStyles: {
    //             container: {
    //               backgroundColor: 'green',
    //               borderRadius: 50,
    //             },
    //             text: {
    //               color: Colors.white,
    //               fontWeight: 'bold',
    //             },
    //           },
    //         };
    //       }
    //       current.add(1, 'day');
    //     }
    //   }
    // });
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

  const mergedata = [...appliedLeave, ...HolyDays];

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: isDark ? Colors.black : Colors.white,
      }}>
      <Calendar
        onDayPress={handleDayPress}
        markingType={'custom'}
        markedDates={markedDates}
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
        enableSwipeMonths
        disableAllTouchEventsForDisabledDays={false}
      />

      {isLoading ? (
        <ImageShimmerPlaceHolder />
      ) : (
        <FlatList
          data={mergedata}
          renderItem={renderHolidays}
          keyExtractor={(item, index) => index.toString()}
          style={{margin: 5}}
          showsVerticalScrollIndicator={false}
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
