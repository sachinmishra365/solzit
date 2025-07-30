import {
  Dimensions,
  FlatList,
  Image,
  Modal,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { Colors } from '../../constants/Colors';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import { auth, isDarkTheme } from '../../AppStore/Reducers/appState';
import ScreenPlay from './ScreenPlay';
import WFHCard from './WFHCard';
import {
  useGetOngoingWFHDateListQuery,
  useGetTodayRemoteEmpAttendanceQuery,
} from '../../Services/workFromHome';
import { Button, IconButton, Portal } from 'react-native-paper';
import {
  useGetBalanceLeaveDashboardQuery,
  useGetTimeLoggedLastWeekQuery,
  useGetTimeLoggedThisWeekQuery,
} from '../../Services/Dashboardlevel';
import Fabbutton from './FabButton/Fabbutton';
import LinearGradient from 'react-native-linear-gradient';
import { useIsFocused } from '@react-navigation/native';
import CustomHeader from '../../Components/CustomHeader';

const { height, width } = Dimensions.get('window');

const Dashboard2 = ({ navigation }: any) => {
  const dispatch = useDispatch();
  const isDark = useSelector(isDarkTheme);

  const metadata = useSelector((state: any) => state?.appState?.metadata);
  const Assesstoken = useSelector((state: any) => state?.appState?.authToken);
  const DashboardZIndex = useSelector((state: any) => state?.appState?.DashboardZIndex);

  const accessToken = Assesstoken?.authToken?.accessToken;
  const [selectedImage, setSelectedImage] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);


  const {
    data: OngoingWFHDateList,
    isLoading: wfhisLoading,
    refetch: onActionComplete,
  } = useGetOngoingWFHDateListQuery({ accessToken });
  const {
    data: TodayRemoteEmpAttendance,
    isLoading: wfhisLoading1,
    refetch: onActionComplete1,
  } = useGetTodayRemoteEmpAttendanceQuery({ accessToken });
  const { data: BalanceLeaveDashboard, refetch: refetchBalanceLeaveDashboard } =
    useGetBalanceLeaveDashboardQuery({ accessToken });
  const { data: TimeLoggedThisWeek, refetch: refetchTimeLoggedThisWeek } =
    useGetTimeLoggedThisWeekQuery({ accessToken });
  const { data: TimeLoggedLastWeek, refetch: refetchTimeLoggedLastWeek } =
    useGetTimeLoggedLastWeekQuery({ accessToken });

  let todayWFHData = [];

  if (Assesstoken?.userProfile?.isRemoteWorker) {
    todayWFHData = TodayRemoteEmpAttendance?.data || [];
  } else if (Assesstoken?.userProfile?.isOnWFH) {
    todayWFHData =
      OngoingWFHDateList?.data?.find((item: any) =>
        moment(item.wfhDate).isSame(moment(), 'day'),
      ) || [];
  }

  const isLoading = wfhisLoading || wfhisLoading1;

  useEffect(() => {
    const tokenExpiry = Assesstoken?.authToken?.tokenExpiry;
    const currentTime = moment().toISOString();
    const isTokenExpired = moment(tokenExpiry).isSameOrBefore(currentTime);
    const date = moment().format('YYYY-MM-DD');
    if (isTokenExpired) {
      dispatch(auth(undefined));
    } else {
      console.log('Token is still valid.');
      onActionComplete();
      onActionComplete1();
      refetchTimeLoggedLastWeek();
      refetchTimeLoggedThisWeek();
      refetchBalanceLeaveDashboard();
    }
  }, []);

  const refetchAll = async () => {
    await Promise.all([onActionComplete(), onActionComplete1()]);
  };
  const handleImagePress = (image: any) => {
    setSelectedImage(image);
  };
  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
      onActionComplete1();
      onActionComplete();
      refetchTimeLoggedLastWeek();
      refetchTimeLoggedThisWeek();
      refetchBalanceLeaveDashboard();
    }, 1000);
  }, [onActionComplete1, onActionComplete]);

  const getImageSource = (holidayName: any) => {
    if (holidayName) {
      return require('../../Assets/Images/holiday.png');
    } else {
      return require('../../Assets/Images/Correct.png');
    }
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
    <>
      <View
        style={{
          flex: 1,
          backgroundColor: isDark ? Colors.black : Colors.white,
        }}>
        {/* <CustomHeader
          showBackIcon={false}
          divider={false}
          title="Soluzione"
          onPress={() => navigation.openDrawer()}
          showRightIcon={true}
          showRightIcon2={true}
          rightIconName={'swap-horizontal-circle-outline'}
          rightIconPress={() =>
            navigation.navigate('WorklogDetails')
          }
          rightIconColor2={Colors.primary}
          rightIconName2={'swap-horizontal-circle-outline'}
          rightIconPress2={() => navigation.navigate('WorklogHour')}
        /> */}
        <ScreenPlay
          name={
            Assesstoken?.userProfile?.fullName
              ? Assesstoken.userProfile.fullName
              : 'Guest'
          }
        />

        <View
        // style={{
        //   backgroundColor: isDark
        //     ? 'rgba(0, 0, 0, 0.35)'
        //     : 'rgba(255, 255, 255, 0.25)',
        // }}
        >
          {/* <LinearGradient
            colors={
              isDark
                ? ['#ca7e8a', '#aa52aa', '#9ceece', '#9de0f5']
                : ['#4e0d17', '#2e082e', '#317a5e', '#206c83']
            }
            start={{x: 0, y: 0}}
            end={{x: 1, y: 0}}
            style={[
              StyleSheet.absoluteFillObject,
              {
                opacity: 0.25,
              },
            ]}
          /> */}


          <View style={{ marginHorizontal: 16, marginTop: 16, overflow: 'hidden' }}>
            <View style={{ position: 'relative', overflow: 'hidden' }}>
              <LinearGradient
                colors={['#c77853', '#f11619']}
                style={[styles(isDark).topBaseCard, { zIndex: DashboardZIndex ? 1 : 0 }]}>
                <View style={styles(isDark).bgStyle} />

                <View style={styles(isDark).rowCard}>
                  <View style={[styles(isDark).columnCard, { width: '60%' }]}>
                    <Text style={[styles(isDark).cardText]}>Total LOPs</Text>
                    <Text style={[styles(isDark).commonValue]}>
                      {BalanceLeaveDashboard?.data?.totallopleave ?? '0'}
                    </Text>
                  </View>
                  <IconButton
                    icon="calendar-week"
                    iconColor={'#d65f10'}
                    size={30}
                    style={[styles(isDark).iconStyle, { right: 40 }]}
                  />
                </View>
              </LinearGradient>

              <View style={{ alignItems: 'flex-start' }}>
                <LinearGradient
                  colors={['#77c753', '#659c22']}
                  style={[
                    styles(isDark).topBaseCard,
                    { width: '53%', height: 100, zIndex: DashboardZIndex ? 1 : 0 },
                  ]}>
                  <View style={styles(isDark).bgStyle} />
                  <View style={styles(isDark).rowCard}>
                    <View style={[styles(isDark).columnCard, { width: '50%' }]}>
                      <Text style={[styles(isDark).cardText]}>Earn Leave</Text>
                      <Text style={[styles(isDark).commonValue]}>
                        {BalanceLeaveDashboard?.data?.earnleaveremaining ?? '0'}
                      </Text>
                    </View>
                    <IconButton
                      icon="calendar-plus"
                      iconColor={'#56ab2f'}
                      size={30}
                      style={[styles(isDark).iconStyle, { right: 14 }]}
                    />
                  </View>
                </LinearGradient>
              </View>

              <LinearGradient
                colors={['#1e8188', '#316dee']}
                style={[styles(isDark).commonOverlay, { height: 150, top: 0, zIndex: DashboardZIndex ? 2 : 0, }]}>
                <View style={styles(isDark).bgStyle} />
                <View style={styles(isDark).rowCard}>
                  <View style={[styles(isDark).columnCard, { width: '50%' }]}>
                    <Text style={[styles(isDark).cardText]}>
                      Hours This Week
                    </Text>
                    <Text style={[styles(isDark).commonValue]}>
                      {TimeLoggedThisWeek?.data ?? '0'}
                    </Text>
                  </View>
                  <IconButton
                    icon="clock-time-twelve"
                    iconColor={isDark ? '#62a2a7' : '#80c9ce'}
                    size={30}
                    style={styles(isDark).iconStyle}
                  />
                </View>
              </LinearGradient>
            </View>

            <View style={{ position: 'relative', marginBottom: 16, }}>
              <LinearGradient
                colors={['#c585d4', '#530a53']}
                style={[styles(isDark).topBaseCard, { zIndex: DashboardZIndex ? 1 : 0, }]}>
                <View style={styles(isDark).bgStyle} />
                <View style={styles(isDark).rowCard}>
                  <View style={[styles(isDark).columnCard, { width: '60%' }]}>
                    <Text style={[styles(isDark).cardText]}>No of Lates</Text>
                    <Text style={[styles(isDark).commonValue]}>
                      {BalanceLeaveDashboard?.data?.noOfLate ?? '0'}
                    </Text>
                  </View>
                  <IconButton
                    icon="clock-time-five"
                    iconColor={'#882388'}
                    size={30}
                    style={[styles(isDark).iconStyle, { right: 40 }]}
                  />
                </View>
              </LinearGradient>

              <LinearGradient
                colors={['#209e94', '#41b96f']}
                style={[
                  styles(isDark).commonOverlay,
                  { height: 151, bottom: 0, zIndex: DashboardZIndex ? 2 : 0, position: 'absolute', },
                ]}>
                <View style={styles(isDark).bgStyle} />
                <View style={styles(isDark).rowCard}>
                  <View style={[styles(isDark).columnCard, { width: '50%' }]}>
                    <Text style={[styles(isDark).cardText]}>
                      Hours Last Week
                    </Text>
                    <Text style={[styles(isDark).commonValue]}>
                      {TimeLoggedLastWeek?.data ?? '0'}
                    </Text>
                  </View>
                  <IconButton
                    icon="chart-bar"
                    iconColor={isDark ? '#689e89' : '#528f87'}
                    size={30}
                    style={styles(isDark).iconStyle}
                  />
                </View>
              </LinearGradient>
            </View>
          </View>
        </View>

        <WFHCard
          wfhData={todayWFHData}
          onActionComplete={refetchAll}
          refetchData={refetchAll}
          wfhisLoading={isLoading}
        />
        <FlatList
          data={metadata}
          renderItem={renderHolidays}
          keyExtractor={(item: any, index: any) => index.toString()}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => onRefresh()}
            />
          }
        />
      </View>
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
    </>
  );
};

export default Dashboard2;

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
    cardText: {
      fontFamily: 'Lato-Semibold',
      color: isDark ? Colors.white : Colors.white,
      fontSize: 18,
    },
    commonValue: {
      fontFamily: 'Lato-Bold',
      color: isDark ? Colors?.white : Colors?.white,
      fontSize: 14,

    },
    topBaseCard: {
      width: '60%',
      height: 100,
      borderRadius: 12,
      padding: 10,
      elevation: 4,
    },
    commonOverlay: {
      width: '50%',
      borderRadius: 12,
      padding: 10,
      position: 'absolute',
      right: 0,
      elevation: 4,
    },
    rowCard: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
    },
    columnCard: {
      alignSelf: 'flex-start',
      flexShrink: 1,
    },
    iconStyle: {
      backgroundColor: 'rgba(255,255,255,0.2)',
      borderRadius: 12,
    },
    bgStyle: {
      position: 'absolute',
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
      backgroundColor: isDark ? 'rgba(0, 0, 0, 0.35)' : 'rgba(255, 255, 255, 0.1)',
      borderRadius: 12,
    },
  });
