import React, { useMemo } from 'react';
import { Dimensions, StyleSheet, Text, View } from 'react-native';
import { useSelector } from 'react-redux';
import { isDarkTheme } from '../../../AppStore/Reducers/appState';
import moment from 'moment';
import LinearGradient from 'react-native-linear-gradient';
import { IconButton } from 'react-native-paper';
import { Carousel } from 'react-native-basic-carousel';
import { useIsFocused } from '@react-navigation/native';

import { Colors } from '../../../constants/Colors';
import WFHCard from '../WFHCard';
import CarouselShimmer from '../../Placeholder/CarouselShimmer';

import {
  useGetBalanceLeaveDashboardQuery,
  useGetTimeLoggedLastWeekQuery,
  useGetTimeLoggedThisWeekQuery,
} from '../../../Services/Dashboardlevel';
import {
  useGetOngoingWFHDateListQuery,
  useGetTodayRemoteEmpAttendanceQuery,
} from '../../../Services/workFromHome';

const { width } = Dimensions.get('window');

const CarouselScreen = () => {
  const isFocused = useIsFocused();
  const isDark = useSelector(isDarkTheme);
  const Assesstoken = useSelector((state: any) => state?.appState?.authToken);
  const accessToken = Assesstoken?.authToken?.accessToken;


  const {
    data: BalanceLeaveDashboard,
    refetch: refetchBalanceLeaveDashboard,
    isLoading: balanceLeaveLoading,
  } = useGetBalanceLeaveDashboardQuery({ accessToken });

  const {
    data: TimeLoggedThisWeek,
    refetch: refetchTimeLoggedThisWeek,
    isLoading: thisWeekLoading,
  } = useGetTimeLoggedThisWeekQuery({ accessToken });

  const {
    data: TimeLoggedLastWeek,
    refetch: refetchTimeLoggedLastWeek,
    isLoading: lastWeekLoading,
  } = useGetTimeLoggedLastWeekQuery({ accessToken });

  const {
    data: OngoingWFHDateList,
    isLoading: ongoingWFHLoading,
    refetch: refetchOngoingWFH,
  } = useGetOngoingWFHDateListQuery({ accessToken });

  const {
    data: TodayRemoteEmpAttendance,
    isLoading: todayWFHLoading,
    refetch: refetchTodayWFH,
  } = useGetTodayRemoteEmpAttendanceQuery({ accessToken });

  const todayWFHData = useMemo(() => {
    if (Assesstoken?.userProfile?.isRemoteWorker) {
      return TodayRemoteEmpAttendance?.data || [];
    }

    const nonRemoteToday = OngoingWFHDateList?.data?.find((item: any) =>
      moment(item.wfhDate).isSame(moment(), 'day'),
    );

    return nonRemoteToday?.wfhApplicationId ? nonRemoteToday : [];
  }, [Assesstoken, OngoingWFHDateList, TodayRemoteEmpAttendance]);


  const isLoading =
    balanceLeaveLoading ||
    thisWeekLoading ||
    lastWeekLoading ||
    ongoingWFHLoading ||
    todayWFHLoading;


  const refetchAll = async () => {
    await Promise.all([
      refetchBalanceLeaveDashboard(),
      refetchTimeLoggedThisWeek(),
      refetchTimeLoggedLastWeek(),
      refetchOngoingWFH(),
      refetchTodayWFH(),
    ]);
  };


  const cards = useMemo(
    () => [
      {
        title: 'Total LOPs',
        value: BalanceLeaveDashboard?.data?.totallopleave ?? '0',
        icon: 'calendar-week',
        colors: ['#c77853', '#f11619'],
        iconColor: '#d65f10',
      },
      {
        title: 'Earn Leave',
        value: BalanceLeaveDashboard?.data?.earnleaveremaining ?? '0',
        icon: 'calendar-plus',
        colors: ['#77c753', '#659c22'],
        iconColor: '#56ab2f',
      },
      {
        title: 'Hours This Week',
        value: TimeLoggedThisWeek?.data ?? '0',
        icon: 'clock-time-twelve',
        colors: ['#1e8188', '#316dee'],
        iconColor: isDark ? '#62a2a7' : '#80c9ce',
      },
      {
        title: 'No of Lates',
        value: BalanceLeaveDashboard?.data?.noOfLate ?? '0',
        icon: 'clock-time-five',
        colors: ['#c585d4', '#530a53'],
        iconColor: '#882388',
      },
      {
        title: 'Hours Last Week',
        value: TimeLoggedLastWeek?.data ?? '0',
        icon: 'chart-bar',
        colors: ['#209e94', '#41b96f'],
        iconColor: isDark ? '#689e89' : '#528f87',
      },
    ],
    [ BalanceLeaveDashboard, TimeLoggedThisWeek, TimeLoggedLastWeek, isDark, ],
  );

  const renderCarouselItem = ({ item }: { item: any }) => (
    <LinearGradient colors={item.colors} style={styles(isDark).carouselCard}>
      <View style={styles(isDark).bgStyle} />
      <View style={styles(isDark).rowCard}>
        <View style={styles(isDark).columnCard}>
          <Text style={styles(isDark).cardText}>{item.title}</Text>
          <Text style={styles(isDark).commonValue}>{item.value}</Text>
        </View>
        <IconButton
          icon={item.icon}
          iconColor={item.iconColor}
          size={30}
          style={styles(isDark).iconStyle}
        />
      </View>
    </LinearGradient>
  );

  const renderPagination = ({ activeIndex }: any) => (
    <View style={styles(isDark).paginationContainer}>
      {cards.map((_, i) => (
        <View
          key={i}
          style={[
            styles(isDark).dot,
            {
              backgroundColor:
                i === activeIndex ? Colors.white : 'rgba(255,255,255,0.4)',
            },
          ]}
        />
      ))}
    </View>
  );

  const hasWFHData = !!todayWFHData && Object.keys(todayWFHData).length > 0;

  const carouselWidth = hasWFHData && !todayWFHData?.isCheckedOut ? width * 0.39 : width * 0.93;


  return isLoading ? (
    <CarouselShimmer />
  ) : (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 7,
      }}>
      <View style={{width: carouselWidth, marginRight: hasWFHData ? 10 : 0}}>
        <Carousel
          data={cards}
          renderItem={renderCarouselItem}
          itemWidth={carouselWidth}
          // contentContainerStyle={{paddingLeft:0,paddingRight: 16}}
          // contentContainerStyle={{paddingHorizontal:16}}
          paginationType="circle"
          paginationPosition="bottom"
          paginationBackgroundColor={isDark ? Colors.black : Colors.white}
          autoplay={isFocused}
          customPagination={renderPagination}
        />
      </View>

      {hasWFHData && (
        <WFHCard
          wfhData={todayWFHData}
          onActionComplete={refetchAll}
          refetchData={refetchAll}
          wfhisLoading={isLoading}
        />
      )}
    </View>
  );
};

export default CarouselScreen;

const styles = (isDark: boolean) =>
  StyleSheet.create({
    carouselCard: {
      borderRadius: 10,
      padding: 16,
      elevation: 4,
      height: 160,
      justifyContent: 'center',
      marginHorizontal: 2,
    },
    cardText: {
      fontFamily: 'Lato-Semibold',
      color: Colors.white,
      fontSize: 18,
    },
    commonValue: {
      fontFamily: 'Lato-Bold',
      color: Colors.white,
      fontSize: 14,
    },
    rowCard: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
    },
    columnCard: {
      width: '50%',
      alignSelf: 'flex-start',
      flexShrink: 1,
    },
    iconStyle: {
      backgroundColor: 'rgba(255,255,255,0.2)',
      borderRadius: 15,
    },
    bgStyle: {
      position: 'absolute',
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
      backgroundColor: isDark
        ? 'rgba(0, 0, 0, 0.35)'
        : 'rgba(255, 255, 255, 0.1)',
      borderRadius: 10,
    },
    paginationContainer: {
      flexDirection: 'row',
      position: 'absolute',
      bottom: 10,
      alignSelf: 'center',
    },
    dot: {
      width: 8,
      height: 8,
      borderRadius: 5,
      marginHorizontal: 4,
    },
  });
