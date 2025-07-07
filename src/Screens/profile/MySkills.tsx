import {
  View,
  Text,
  StyleSheet,
  FlatList,
  RefreshControl,
  PanResponder,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useSelector} from 'react-redux';
import {isDarkTheme} from '../../AppStore/Reducers/appState';
import CustomHeader from '../../Components/CustomHeader';
import {Colors} from '../../constants/Colors';
import {Card, FAB, IconButton, SegmentedButtons} from 'react-native-paper';
import ShimmerPlaceHolder from '../Placeholder/ShimmerPlaceHolder';
import {Bar as ProgressBar} from 'react-native-progress';
import EmptyData from '../../Components/EmptyData';
import {
  useGetAllMySkillsListAppliedQuery,
  useGetAllMySkillsListApprovedQuery,
} from '../../Services/employeeSkills';

const MySkills = ({navigation}: any) => {
  const isDark = useSelector(isDarkTheme);
  const EmployeeId = useSelector((state: any) => state?.appState?.authToken);
  const connected = useSelector((state: any) => state?.appState?.connected);
  const [selectedStatus, setSelectedStatus] = useState('My Recognized Skills');

  const statuses = ['My Recognized Skills', 'Pending Actions'];
  const [skillData, setSkillData] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const {
    data: appliedData,
    isLoading: appliedLoading,
    refetch: refetchApplied,
  } = useGetAllMySkillsListAppliedQuery({
    applied: 'applied',
    accessToken: EmployeeId?.authToken?.accessToken,
  });

  const {
    data: approvedData,
    isLoading: approvedLoading,
    refetch: refetchApproved,
  } = useGetAllMySkillsListApprovedQuery({
    approved: 'approved',
    accessToken: EmployeeId?.authToken?.accessToken,
  });

  const filterByStatus = (status: string) => {
    setSelectedStatus(status);
    refetchApplied();
    refetchApproved();
  };

  useEffect(() => {
    if (selectedStatus === 'My Recognized Skills') {
      if (
        Array.isArray(approvedData?.data) &&
        approvedData?.messageDetail?.message_code === 200
      ) {
        setSkillData(approvedData?.data);
      } else {
        setSkillData([]);
      }
    } else if (selectedStatus === 'Pending Actions') {
      if (
        Array.isArray(appliedData?.data) &&
        appliedData?.messageDetail?.message_code === 200
      ) {
        setSkillData(appliedData?.data);
      } else {
        setSkillData([]);
      }
    }
  }, [selectedStatus, approvedData, appliedData, connected]);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
      refetchApplied();
      refetchApproved();
    }, 1000);
  }, [refetchApplied, refetchApproved]);

  const panResponder = PanResponder.create({
    onMoveShouldSetPanResponder: (evt, gestureState) => {
      return Math.abs(gestureState.dx) > 20;
    },
    onPanResponderRelease: (evt, gestureState) => {
      if (gestureState.dx > 0) {
        const currentIndex = statuses.indexOf(selectedStatus);
        if (currentIndex > 0) {
          filterByStatus(statuses[currentIndex - 1]);
        }
      } else if (gestureState.dx < 0) {
        const currentIndex = statuses.indexOf(selectedStatus);
        if (currentIndex < statuses?.length - 1) {
          filterByStatus(statuses[currentIndex + 1]);
        }
      }
    },
  });

  const renderItem = ({item}: any) => {
    const skillText =
      item.levelofskill?.label === 'Beginner'
        ? 0.33
        : item.levelofskill?.label === 'Intermediate'
        ? 0.66
        : item.levelofskill?.label === 'Expert'
        ? 1
        : 0;
    const skillTextColor =
      item.levelofskill?.label === 'Beginner'
        ? Colors.secondary
        : item.levelofskill?.label === 'Intermediate'
        ? '#d3ab5c'
        : item.levelofskill?.label === 'Expert'
        ? 'green'
        : Colors.gray;

    return (
      <Card
        style={{
          backgroundColor: isDark ? Colors.black : Colors.background,
          marginVertical: 7,
          borderColor: Colors.background,
          borderWidth: 0.5,
          marginHorizontal: 16,
        }}>0
        <Card.Content>
          <View>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: 10,
                marginTop: 5,
                flexWrap: 'wrap',
              }}>
              <Text style={styles(isDark).skillName}>
                {item.skillName?.name}
              </Text>
              <Text
                style={[
                  styles(isDark).skillName,
                  {
                    color:
                      item?.statusReason?.label === 'Applied'
                        ? Colors.secondary
                        : item?.statusReason?.label === 'Approved'
                        ? 'green'
                        : item?.statusReason?.label === 'Upgrade Requested'
                        ? 'orange'
                         : item?.statusReason?.label === 'Rejected'
                        ? '#f02684'
                        : '#9900ff',
                  },
                ]}>
                {item?.statusReason?.label}
              </Text>
            </View>

            <View style={[styles(isDark).levelContainer]}>
              <Text style={styles(isDark).skillDetail}>Level-{''}</Text>
              <Text
                style={[
                  styles(isDark).skillDetail,
                  {color: skillTextColor, fontFamily: 'Lato-Bold'},
                ]}>
                {' '}
                {item?.levelofskill?.label}
              </Text>
            </View>
            <ProgressBar
              progress={skillText}
              color={Colors.primary}
              animated={true}
              borderColor={isDark ? Colors.gray : Colors.white}
              style={{
                marginTop: 10,
                backgroundColor: isDark ? Colors.gray : Colors.white,
              }}
              // style={styles(isDark).progressBar}
              width={null}
            />        

            <View style={[styles(isDark).rowContainer, {alignItems: 'center'}]}>
              <Text style={styles(isDark).skillDetail}>Certification :</Text>
              <Text style={styles(isDark).skillDetail}>
                {' '}
                {item?.hasCertification?.label || 'No'}
              </Text>
            </View>

            {item?.hasCertification?.label === 'Yes' && (
              <View style={styles(isDark).rowContainer}>
                <Text
                  style={{
                    fontFamily: 'Lato-Bold',
                    fontSize: 16,
                    color: isDark ? Colors.white : Colors.black,
                  }}>
                  {item?.typeOfCertification?.label} {' : '}
                </Text>
                <Text
                  style={{
                    fontFamily: 'Lato-Bold',
                    fontSize: 16,
                    color: isDark ? Colors.white : Colors.black,
                  }}>
                  {item?.certificationName}
                </Text>
              </View>
            )}

            {['Applied', 'Approved','Rejected'].includes(item?.statusReason?.label) && (
              <IconButton
                icon={
                  item?.statusReason?.label === 'Applied'
                    ? 'circle-edit-outline'
                    :  item?.statusReason?.label === 'Approved'
                    ? 'tray-arrow-up'
                    : 'reload'
                }
                size={25}
                onPress={() =>
                  navigation.navigate('AddSkills', {itemData: item})
                }
                iconColor={isDark ? Colors.primary : Colors.primary}
                style={{alignSelf: 'flex-end', marginVertical:-5}}
              />
            )}
          </View>
        </Card.Content>
      </Card>
    );
  };

  return (
    <View style={styles(isDark).maincontainer} {...panResponder.panHandlers}>
      <CustomHeader
        showBackIcon={true}
        title="My Skills"
        onPress={() => navigation.goBack()}
      />
      <View style={styles(isDark).divider} />

      <SegmentedButtons
        value={selectedStatus}
        onValueChange={filterByStatus}
        buttons={statuses.map(status => ({
          value: status,
          label: status,
          style: {
            backgroundColor:
              selectedStatus === status
                ? Colors.secondary
                : isDark
                ? Colors.gray
                : Colors.white,
          },
          labelStyle: {
            color:
              selectedStatus === status
                ? Colors.white
                : isDark
                ? Colors.white
                : Colors.black,
            fontFamily: 'Lato-Semibold',
          },
        }))}
        style={{marginVertical: 10, marginHorizontal: 16}}
        theme={{
          colors: {
            primary: Colors.primary,
          },
        }}
      />

      {(selectedStatus === 'Pending Actions' && appliedLoading) ||
      (selectedStatus === 'My Recognized Skills' && approvedLoading) ? (
        <ShimmerPlaceHolder />
      ) : skillData?.length === 0 ? (
        <EmptyData />
      ) : (
        <FlatList
          showsVerticalScrollIndicator={false}
          data={skillData}
          renderItem={item => renderItem(item)}
          keyExtractor={(item, index) => index.toString()}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => onRefresh()}
            />
          }
          ListFooterComponent={<View style={{height: 100}} />}
        />
      )}
      <FAB
        style={styles(isDark).fab}
        color={Colors.white}
        onPress={() => navigation.navigate('AddSkills')}
        accessibilityLabel="Add Skills"
        icon="plus"
      />
    </View>
  );
};

const styles = (isDark: boolean) =>
  StyleSheet.create({
    maincontainer: {
      flex: 1,
      backgroundColor: isDark ? Colors.black : Colors.white,
    },
    divider: {
      borderWidth: 1,
      height: 1,
      backgroundColor: isDark ? Colors.white : 'transparent',
      borderColor: isDark ? Colors.black : 'transparent',
    },
    skillName: {
      fontSize: 16,
      fontFamily: 'Lato-Bold',
      color: isDark ? Colors.white : Colors.black,
    },
    skillDetail: {
      fontSize: 14,
      fontFamily: 'Lato-Regular',
      color: isDark ? Colors.white : Colors.black,
    },
    levelContainer: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
      marginTop: -10,
    },
    rowContainer: {
      flexDirection: 'row',
      marginTop: 5,
      flexWrap: 'wrap',
    },
    fab: {
      position: 'absolute',
      right: 32,
      bottom: 52,
      backgroundColor: isDark ? Colors.gray : Colors.primary,
      elevation: 10,
    },
  });

export default MySkills;
