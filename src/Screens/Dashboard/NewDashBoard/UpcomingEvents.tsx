import {
  Image,
  ScrollView,
  Text,
  View,
  Dimensions,
  StyleSheet,
  RefreshControl,
} from 'react-native';
import React, {useEffect, useMemo, useRef, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {  applied,  isDarkTheme,  processedLeaves,} from '../../../AppStore/Reducers/appState';
import {  useEmployeeAppliedLeavesQuery,  useGetSoluzioneUpcomingBirthdaysQuery,  useProcessedLeavesQuery,} from '../../../Services/services';
import moment from 'moment';
import {Colors} from '../../../constants/Colors';
import LinearGradient from 'react-native-linear-gradient';
import {Card, Icon} from 'react-native-paper';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {useNavigation} from '@react-navigation/native';
import DashboardShimmer from '../../Placeholder/DashboardShimmer';
import ConfettiCannon from 'react-native-confetti-cannon';

const {width} = Dimensions.get('window');

const UpcomingEvents = () => {
  const navigation = useNavigation<any>();
  const dispatch = useDispatch();
  const isDark = useSelector(isDarkTheme);
  const confettiShown = useRef(false);
  const metadata = useSelector((state: any) => state?.appState?.metadata);
  const Assesstoken = useSelector((state: any) => state?.appState?.authToken);
  const accessToken = Assesstoken?.authToken?.accessToken;
  const holidayList = metadata?.filter((item: any) => item?.holidayName && item?.holidayType) || [];
  const birthdayList = metadata?.filter((item: any) => item?.birthdayDate && item?.fullName) || [];
  const statuses = ['Applied', 'Approved', 'Declined'];

  const [appliedLeave, SetAppliedLeave] = useState<any>([]);
  const [confettiActive, setConfettiActive] = useState(false);
   const [refreshing, setRefreshing] = useState(false);

  const {  data: AppliedLeave,  refetch: refetchapplies,  isLoading: appliedLoading,  } = useEmployeeAppliedLeavesQuery({accessToken: accessToken});
  const {  data: ProcessedLeaves,  refetch: refetchprocessed,  isLoading: processedLoading,  } = useProcessedLeavesQuery({accessToken: accessToken});
  const {  data: upcomingBirthdayData,  refetch: refetchBirthday,  isLoading: birthdayLoading,  } = useGetSoluzioneUpcomingBirthdaysQuery({accessToken: accessToken});

  const isLoading = appliedLoading || processedLoading || birthdayLoading;

  useEffect(() => {
    const appliedData = AppliedLeave?.data;
    const appliedStatusCode = AppliedLeave?.messageDetail?.message_code;

    if (Array.isArray(appliedData) && appliedStatusCode === 200) {
      const sortedApplied = [...appliedData].sort((a, b) =>
        moment(a.leaveStartDate).isBefore(moment(b.leaveStartDate)) ? -1 : 1,
      );
      SetAppliedLeave(sortedApplied);
      dispatch(applied(sortedApplied));
    } else if (appliedStatusCode === 204 || appliedData === null) {
      SetAppliedLeave([]);
      dispatch(applied([]));
    }

    const processedData = ProcessedLeaves?.data;
    const processedStatusCode = ProcessedLeaves?.messageDetail?.message_code;

    if (Array.isArray(processedData) && processedStatusCode === 200) {
      const sortedProcessed = [...processedData].sort((a, b) =>
        moment(a.leaveStartDate).isBefore(moment(b.leaveStartDate)) ? -1 : 1,
      );
      dispatch(processedLeaves(sortedProcessed));
    } else if (processedStatusCode === 204 || processedData === null) {
      dispatch(processedLeaves([]));
    }
  }, [AppliedLeave, ProcessedLeaves]);

  const todayBirthdays = useMemo(() => {
    const today = moment().format('MM-DD');
    return (
      upcomingBirthdayData?.data?.filter((item: any) => {
        if (!item?.birthdayDate) return false;
        const birthdayFormatted = moment(item.birthdayDate)
          .local()
          .format('MM-DD');
        return birthdayFormatted === today;
      }) || []
    );
  }, [upcomingBirthdayData]);

  useEffect(() => {
  if (todayBirthdays?.length > 0 && !confettiShown.current) {
    setConfettiActive(true);
    confettiShown.current = true; 
    const timer = setTimeout(() => {
      setConfettiActive(false);
    }, 6000);

    return () => clearTimeout(timer);
  }
}, [todayBirthdays]);


  const getStatusIconAndColor = (status: string) => {
    switch (status) {
      case 'Approved':
        return {icon: 'calendar-check-outline', color: Colors.green};
      case 'Declined':
        return {icon: 'calendar-remove-outline', color: Colors.accent};
      case 'Applied':
      default:
        return {icon: 'calendar-clock-outline', color: Colors.secondary};
    }
  };

  const leavesByStatus: {[key: string]: any[]} = {};
  statuses.forEach(status => {
    const source = status === 'Applied' ? appliedLeave : ProcessedLeaves?.data || [];
    leavesByStatus[status] = source.filter((item: any) => {
      const isThisMonth = moment(item?.leaveStartDate).isSame(
        moment(),'month', );
      return item?.status?.label === status && isThisMonth;
    });
  });

  const hasAnyLeave = statuses.some(
    status => leavesByStatus[status]?.length > 0,
  );

  const BirthdayCard = ({ todayBirthdays }: { todayBirthdays: any[] }) => {
    if (!todayBirthdays.length) return null;
    const gradientColors = isDark ? ['rgba(252, 234, 187,0.8)', 'rgba(248, 181, 0,0.7)'] : ['#fceabb', '#f8b500'];

    if (todayBirthdays?.length === 1) {
      const user = todayBirthdays[0];
      return (
        <View style={styles(isDark).birthdayCard}>
          <LinearGradient colors={gradientColors} style={styles(isDark).gradientBackground1}>
           <Image 
              source={ user.employeeImg? { uri: `data:image/png;base64,${user.employeeImg}`} : require('../../../Assets/Images/EmpBoy.png')}
              style={styles(isDark).userImage1}
            />
            <View>
              <Text style={styles(isDark).birthdayText1}>🎉 Happy Birthday</Text>
              <Text style={styles(isDark).userName1}>{user.fullName}</Text>
            </View>
          </LinearGradient>
        </View>
      );
    }

    return (
      <View style={styles(isDark).birthdayCard}>
        <LinearGradient colors={gradientColors} style={styles(isDark).gradientBackground}>
          <Text style={styles(isDark).birthdayText}>🎉 Happy Birthday</Text>
          <View style={styles(isDark).userRow}>
            {todayBirthdays.map((user, idx) => (
              <View key={idx} style={styles(isDark).userContainer}>
                <Image 
                  source={ user.employeeImg? { uri: `data:image/png;base64,${user.employeeImg}`} : require('../../../Assets/Images/EmpBoy.png')}
                  style={styles(isDark).userImage}
                />
                <Text style={styles(isDark).userName}>{user.fullName}</Text>
              </View>
            ))}
          </View>
        </LinearGradient>
      </View>
    );
  };

  return isLoading ? (
    <DashboardShimmer />
  ) : (
    <View style={styles(isDark).maincontainer}>
       {confettiActive && (
            <ConfettiCannon
              count={200}
              origin={{x: -10, y: 0}}
              explosionSpeed={800}
            />
          )}

       <BirthdayCard todayBirthdays={todayBirthdays} />
       
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{paddingBottom: 5}}>
        {holidayList.map((holiday: any, index: any) => (
          <View
            key={index}
            style={[styles(isDark).holidayCard, {paddingVertical: 12}]}>
            <View style={styles(isDark).holidayContent}>
              <Text style={styles(isDark).holidayName}>
                {holiday.holidayName}
              </Text>
              <Text style={styles(isDark).holidayDate}>
                {moment(holiday.date).format('DD MMM')}
              </Text>
            </View>
          </View>
        ))}
      </ScrollView>

      <Text style={styles(isDark).sectionTitle}>Upcoming Birthdays</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{paddingBottom: 5}}>
        {birthdayList.map((birthday: any, index: any) => (
          <Card key={index} style={styles(isDark).bdyCard}>
            <Card.Cover
              source={
                birthday.employeeImg
                  ? {uri: `data:image/jpeg;base64,${birthday.employeeImg}`}
                  : require('../../../Assets/Images/EmpBoy.png')
              }
              style={styles(isDark).birthdayImage}
              resizeMode="cover"
            />
            <View style={[{flex: 1, justifyContent: 'space-between'}]}>
              <Text style={styles(isDark).holidayName}>
                {birthday.fullName}
              </Text>
              <Text style={[styles(isDark).holidayDate]}>
                {' '}
                {moment(birthday.birthdayDate).format('DD MMM')}
              </Text>
            </View>
          </Card>
        ))}
      </ScrollView>

      {hasAnyLeave && (
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
          <Text style={styles(isDark).sectionTitle}>Leave Status</Text>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('LeaveBalance');
            }}>
            <Text
              style={{
                fontSize: 12,
                color: Colors.primary,
                fontFamily: 'Lato-Regular',
              }}>
              View all
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {statuses.map(status => {
        const leaves = leavesByStatus[status]?.slice(0, 4);
        if (!leaves || leaves.length === 0) return null;

        const {icon, color} = getStatusIconAndColor(status);
        const isSingleCard = leaves.length === 1;

        return (
          <View key={status} style={styles(isDark).statusContainer}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {leaves.map((leave: any, index: number) => (
                <View
                  key={index}
                  style={[
                    styles(isDark).leaveCard,
                    {
                      width: isSingleCard ? width - 33 : width * 0.4,
                      borderLeftColor: color,
                      backgroundColor: isDark
                        ? Colors.black
                        : Colors.background,
                    },
                  ]}>
                  <View
                    style={[
                      styles(isDark).iconContainer,
                      {backgroundColor: color + '20'},
                    ]}>
                    <Icon source={icon} size={20} color={color} />
                  </View>

                  <View style={{flex: 1}}>
                    <Text style={styles(isDark).leaveType}>{status}</Text>
                    <Text style={styles(isDark).leaveDate}>
                      {moment(leave?.leaveStartDate).format('DD MMM')} {' - '}
                      {moment(leave?.leaveEndDate).format('DD MMM')}
                    </Text>
                  </View>
                </View>
              ))}
            </ScrollView>
          </View>
        );
      })}

    </View>
  );
};

export default UpcomingEvents;

const styles = (isDark: boolean) =>
  StyleSheet.create({
    maincontainer: {
      flex: 1,
      backgroundColor: isDark ? Colors.black : Colors.white,
    },
    birthdayCard: {
      borderRadius: 15,
      marginTop: 10,
      elevation: 1,
    },
    gradientBackground1: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 20,
      borderRadius: 15,
    },
    userImage1: {
      width: 60,
      height: 60,
      borderRadius: 30,
      marginRight: 16,
    },
    birthdayText1: {
      fontSize: 14,
      color: isDark ? Colors.white : Colors.black,
      fontFamily: 'Lato-Bold',
    },
    userName1: {
      fontSize: 16,
      color: isDark ? Colors.white : Colors.black,
      fontFamily: 'Lato-Semibold',
    },
    holidayCard: {
      marginTop: 10,
      width: width * 0.4,
      height: 70,
      backgroundColor: isDark ? Colors.black : Colors.background,
      borderRadius: 15,
      marginRight: 10,
      padding:10,
      elevation: 1,
      borderWidth: 0.5,
      borderColor: isDark ? Colors.gray : Colors.background,
      alignItems:'center',
    },
    bdyCard: {
      width: width * 0.4,
      backgroundColor: isDark ? Colors.black : Colors.white,
      borderRadius: 15,
      marginRight: 10,
      overflow: 'hidden',
      elevation: 1,
      borderWidth: 0.5,
      borderColor: isDark ? Colors.gray : Colors.white,
    },
    birthdayImage: {
      width: '100%',
      height: 150,
    },
    sectionTitle: {
      fontSize: 12,
      color: isDark ? Colors.white : Colors.black,
      fontFamily: 'Lato-Bold',
      marginBottom: 10,
      marginTop: 10,
    },
    statusContainer: {
      marginBottom: 5,
    },
    leaveCard: {
      marginRight: 9,
      borderRadius: 15,
      padding: 10,
      flexDirection: 'row',
      alignItems: 'center',
      elevation: 1,
      marginBottom: 5,
      borderWidth: 0.5,
      borderColor: isDark ? Colors.gray : Colors.background,
    },
    iconContainer: {
      width: 30,
      height: 30,
      borderRadius: 9,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 10,
    },
    leaveType: {
      fontFamily: 'Lato-Semibold',
      fontSize: 14,
      marginBottom: 2,
      color: isDark ? Colors.white : Colors.black,
    },
    leaveDate: {
      fontFamily: 'Lato-Regular',
      fontSize: 12,
      color: Colors.dark_gray,
    },
    userRow: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      alignItems: 'center',
      marginTop: 10,
    },

    userContainer: {
      alignItems: 'center',
      marginHorizontal: 10,
    },
    userImage: {
      width: 60,
      height: 60,
      borderRadius: 30,
      marginBottom: 5,
    },

    birthdayText: {
      fontSize: 18,
      fontWeight: 'bold',
      textAlign: 'center',
       color: isDark ? Colors.white : Colors.black,
    },

    userName: {
      fontSize: 14,
      color: isDark ? Colors.white : Colors.black,
      textAlign: 'center',
    },

    gradientBackground: {
      borderRadius: 12,
      padding: 16,
    },

    holidayContent: {
      flex: 1,
      justifyContent: 'space-between',
    },

    holidayName: {
      fontSize: 14,
      fontFamily: 'Lato-Semibold',
      color: isDark ? Colors.white : Colors.black,
      paddingHorizontal: 8,
      flexWrap: 'wrap',
    },

    holidayDate: {
      fontSize: 12,
      fontFamily: 'Lato-Regular',
      color: isDark ? Colors.medium_gray : Colors.dark_gray,
      paddingHorizontal: 8,
    },
  });
