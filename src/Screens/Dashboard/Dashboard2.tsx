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
import React, {useEffect, useState} from 'react';
import {Colors} from '../../constants/Colors';
import {useDispatch, useSelector} from 'react-redux';
import moment from 'moment';
import {auth, isDarkTheme} from '../../AppStore/Reducers/appState';
import ScreenPlay from './ScreenPlay';
import WFHCard from './WFHCard';
import {
  useGetOngoingWFHDateListQuery,
  useGetTodayRemoteEmpAttendanceQuery,
} from '../../Services/workFromHome';
import {Button, IconButton, Portal} from 'react-native-paper';
import {
  useGetBalanceLeaveDashboardQuery,
  useGetTimeLoggedLastWeekQuery,
  useGetTimeLoggedThisWeekQuery,
} from '../../Services/Dashboardlevel';
import Fabbutton from './FabButton/Fabbutton';

const {height, width} = Dimensions.get('window');

const Dashboard2 = () => {
  const dispatch = useDispatch();
  const isDark = useSelector(isDarkTheme);
  const metadata = useSelector((state: any) => state?.appState?.metadata);
  const Assesstoken = useSelector((state: any) => state?.appState?.authToken);

  const accessToken = Assesstoken?.authToken?.accessToken;
  const [selectedImage, setSelectedImage] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  const {
    data: OngoingWFHDateList,
    isLoading: wfhisLoading,
    refetch: onActionComplete,
  } = useGetOngoingWFHDateListQuery({accessToken});
  const {
    data: TodayRemoteEmpAttendance,
    isLoading: wfhisLoading1,
    refetch: onActionComplete1,
  } = useGetTodayRemoteEmpAttendanceQuery({accessToken});
  const {data: BalanceLeaveDashboard, refetch: refetchBalanceLeaveDashboard} =
    useGetBalanceLeaveDashboardQuery({accessToken});
  const {data: TimeLoggedThisWeek, refetch: refetchTimeLoggedThisWeek} =
    useGetTimeLoggedThisWeekQuery({accessToken});
  const {data: TimeLoggedLastWeek, refetch: refetchTimeLoggedLastWeek} =
    useGetTimeLoggedLastWeekQuery({accessToken});

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

  const renderHolidays = ({item}: any) => {
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
                style={{minHeight: 38, minWidth: 38}}>
                <Image
                  source={{uri: HolidayImage}}
                  style={styles(isDark).Holidaylogo}
                  accessibilityLabel="Image"
                />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                onPress={() =>
                  handleImagePress(getImageSource(item?.holidayName))
                }
                style={{minHeight: 38, minWidth: 38}}>
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
        <ScreenPlay
          name={
            Assesstoken?.userProfile?.fullName
              ? Assesstoken.userProfile.fullName
              : 'Guest'
          }
        />

        <View
          style={{
            marginTop: 12,
            justifyContent: 'space-around',
            flexDirection: 'row',
          }}>
          <View
            style={{
              width: '45%',
              backgroundColor: Colors.primary,
              height: 100,
              borderRadius: 15,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Text style={{fontFamily: 'Lato-Semibold', color: Colors.white}}>
              This Week Hours : {TimeLoggedThisWeek?.data}
            </Text>
            <Text style={{fontFamily: 'Lato-Semibold', color: Colors.white}}>
              Last Week Hours : {TimeLoggedLastWeek?.data}
            </Text>
          </View>
          <View
            style={{
              width: '45%',
              backgroundColor: Colors.green,
              height: 100,
              borderRadius: 15,
              justifyContent: 'center',
            }}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginTop: -20,
              }}>
              <IconButton
                icon="swap-horizontal-circle-outline"
                iconColor={isDark ? Colors?.white : Colors?.white}
                size={30}
              />
              <Text
                style={{
                  fontFamily: 'Lato-Semibold',
                  color: Colors.white,
                  fontSize: 15,
                  marginRight: 16,
                }}>
                {BalanceLeaveDashboard?.data?.earnleaveremaining}
              </Text>
            </View>
            <Text
              style={{
                fontFamily: 'Lato-Semibold',
                color: Colors.white,
                fontSize: 13,
                marginLeft: 16,
              }}>
              Earn Leave Balance
            </Text>
          </View>
        </View>
        <View
          style={{
            marginTop: 12,
            justifyContent: 'space-around',
            flexDirection: 'row',
          }}>
          <View
            style={{
              width: '45%',
              backgroundColor: Colors.error,
              height: 100,
              borderRadius: 15,
              justifyContent: 'center',
            }}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginTop: -20,
              }}>
              <IconButton
                icon="swap-horizontal-circle-outline"
                iconColor={isDark ? Colors?.white : Colors?.white}
                size={30}
              />
              <Text
                style={{
                  fontFamily: 'Lato-Semibold',
                  color: Colors.white,
                  fontSize: 15,
                  marginRight: 16,
                }}>
                {BalanceLeaveDashboard?.data?.totallopleave}
              </Text>
            </View>
            <Text
              style={{
                fontFamily: 'Lato-Semibold',
                color: Colors.white,
                fontSize: 13,
                marginLeft: 16,
              }}>
              Total LOPs
            </Text>
          </View>
          <View
            style={{
              width: '45%',
              backgroundColor: Colors.darkorange,
              height: 100,
              borderRadius: 15,
              justifyContent: 'center',
            }}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginTop: -20,
              }}>
              <IconButton
                icon="swap-horizontal-circle-outline"
                iconColor={isDark ? Colors?.white : Colors?.white}
                size={30}
              />
              <Text
                style={{
                  fontFamily: 'Lato-Semibold',
                  color: Colors.white,
                  fontSize: 15,
                  marginRight: 16,
                }}>
                {BalanceLeaveDashboard?.data?.noOfLate}
              </Text>
            </View>
            <Text
              style={{
                fontFamily: 'Lato-Semibold',
                color: Colors.white,
                fontSize: 13,
                marginLeft: 16,
              }}>
              No. Of Lates
            </Text>
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
                ? {uri: selectedImage}
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
  });
