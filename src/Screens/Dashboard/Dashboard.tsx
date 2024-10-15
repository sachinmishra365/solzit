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
import {DateData, AgendaSchedule, Calendar} from 'react-native-calendars';
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
  isDarkTheme,
  processedLeaves,
} from '../../AppStore/Reducers/appState';
import {Dimensions} from 'react-native';
import Placeholder from '../Placeholder/Placeholder';
import ShimmerPlaceHolder from '../Placeholder/ShimmerPlaceHolder';

const {height, width} = Dimensions.get('window');

const Dashboard = () => {
  const dispatch = useDispatch();
  const isDark = useSelector(isDarkTheme);
  const [currentDate, setCurrentDate] = useState('');
  const [HolyDays, setHolyDays] = useState<any>([]);
  const [appliedLeave, SetAppliedLeave] = useState<any>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null); 

  const EmployeeId = useSelector((state: any) => state?.appState?.authToken);

  const {data, error, isLoading} = useSoluzioneHolidaysQuery([]);

  const handleholiday = async () => {
    try {
      const response = await data;
      if (response && response?.Data && response?.ResponseCode === 100) {
        setHolyDays(response?.Data);
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    handleholiday();
  }, [data]);

  const AppliedLeave = useEmployeeAppliedLeavesQuery({
    ids: EmployeeId?.userProfile?.userId || null,
  });

  const ProcessedLeaves = useProcessedLeavesQuery({
    Id: EmployeeId?.userProfile?.userId || null,
  });

  useEffect(() => {
    if (
      AppliedLeave?.data?.Data !== undefined &&
      AppliedLeave?.data?.Data !== null
    ) {
      const sortedData: any = [...AppliedLeave?.data?.Data].sort((a, b) =>
        moment(a.leaveStartDate).isBefore(moment(b?.leaveStartDate)) ? -1 : 1,
      );
      SetAppliedLeave(sortedData);
      dispatch(applied(AppliedLeave?.data?.Data));
    }
  }, [AppliedLeave]);

  useEffect(() => {
    if (ProcessedLeaves?.data?.Data !== undefined) {
      dispatch(processedLeaves(ProcessedLeaves?.data?.Data));
    }
  }, [ProcessedLeaves]);

  useEffect(() => {
    const date = moment().format('YYYY-MM-DD');
    setCurrentDate(date);
  }, []);

  const handleDayPress = (day: DateData) => {
    setCurrentDate(day.dateString);
  };

  const handleImagePress = (image:any) => {
    setSelectedImage(image);
    setModalVisible(true);
  };

  const getImageSource = (holidayName:any) => {
    switch (holidayName) {
      case 'Dhanteras':
        return require('../../Assets/Images/Danteras.jpg');
      case 'Mahatma Gandhi Jayanti':
        return require('../../Assets/Images/GandhiJyanti.jpg');
      case 'Deepawali':
      case 'Deepavali':
      case 'Diwali':
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
              onPress={() => handleImagePress(getImageSource(item.holidayName))}
            >
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
            {item?.Status?.Label && (
              <Text
                style={{
                  color: isDark ? Colors.white : Colors.black,
                  fontFamily: 'Lato-Semibold',
                }}>
                {item?.Status?.Label}{' '}
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

  const mergedata = [...appliedLeave, ...HolyDays];

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: isDark ? Colors.black : Colors.white,
      }}>
      <Calendar
        onDayPress={handleDayPress}
        markedDates={{
          [currentDate]: {
            selected: true,
            marked: true,
            selectedColor: Colors.primary,
          },
          '2024-10-16': {
            marked: true,
            dotColor: 'red',
          },
        }}
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
        markingType={'simple'}
        enableSwipeMonths
        disableAllTouchEventsForDisabledDays={false}
      />
      {isLoading ? (
        <ShimmerPlaceHolder />
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
