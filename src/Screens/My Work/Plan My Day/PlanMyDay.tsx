import { View, Text, StyleSheet, FlatList, RefreshControl, Modal, TouchableOpacity, } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { FAB, IconButton } from 'react-native-paper';
import { isDarkTheme } from '../../../AppStore/Reducers/appState';
import Toast from 'react-native-toast-message';
import CustomHeader from '../../../Components/CustomHeader';
import { Colors } from '../../../constants/Colors';
import moment from 'moment';
import ShimmerPlaceHolder from '../../Placeholder/ShimmerPlaceHolder';
import { useGetAppSettingsValueQuery, useGetDayTaskReportDetailsQuery, useGetGeneralTaskListInMyProjectQuery, useGetToDoListBasedOnFilterMutation, } from '../../../Services/workloglevel';
import WorklogCard from '../../../Components/WorklogCard';
import EmptyData from '../../../Components/EmptyData';
import ToastMessage from '../../../Components/ToastMessage';
import PlanMyDayFilter from './PlanMyDayFilter';

const PlanMyDay = ({ navigation, route }: any) => {
  const isDark = useSelector(isDarkTheme);
  const accessToken = useSelector((state: any) => state?.appState?.authToken);
  const EmployeeId = useSelector((state: any) => state?.appState?.authToken);
  const connected = useSelector((state: any) => state?.appState?.connected);

  const [refreshing, setRefreshing] = useState(false);
  const [myToDosData, setMyToDosData] = useState([]);
  const [generalTasksData, setGeneralTasksData] = useState([]);
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});
  const [selectedTaskType, setSelectedTaskType] = useState('defaultWorkingItems',);
  const [filterVisible, setFilterVisible] = useState(false);
  const [isFilterSelected, setIsFilterSelected] = useState(false);
  const [isFabDisabled, setIsFabDisabled] = useState(false);
  const todayDate = moment().format('YYYY-MM-DDT05:30:00');

  const [getToDoListBasedOnFilter, { isLoading: isToDoLoading }] = useGetToDoListBasedOnFilterMutation();
  const { data: generalTaskData, isLoading: isGeneralTaskLoading } = useGetGeneralTaskListInMyProjectQuery({ accessToken: accessToken?.authToken?.accessToken, });
  const { data: showPlanData, isLoading: ShowPlanLoading, } = useGetDayTaskReportDetailsQuery({ accessToken: EmployeeId?.authToken?.accessToken, Date: todayDate, });
  const { data: appSettingData } = useGetAppSettingsValueQuery({ accessToken: EmployeeId?.authToken?.accessToken, AppSettingName: 'MAX_ADD_DAY_REPORT_TIME', });
  const isLoading = isToDoLoading || isGeneralTaskLoading;

  const fetchData = async () => {
    if (
      selectedTaskType === 'myActiveItems' ||
      selectedTaskType === 'defaultWorkingItems'
    ) {
      await handleMyToDos();
    } else {
      handleGeneralTasks();
    }
  };

  const handleMyToDos = async () => {
    if (!connected) {
      Toast.show({
        type: 'error',
        text1: 'Network Error',
        text2: 'Please check your internet connection',
        topOffset: 80,
        visibilityTime: 5000,
      });
      return;
    }

    try {
      let filterId = 1;
      let itemTypeId = 0;

      if (selectedTaskType === 'defaultWorkingItems') {
        filterId = 3;
        itemTypeId = 0;
      }

      const result = await getToDoListBasedOnFilter({
        data: {},
        filterId,
        itemTypeId,
        accessToken: accessToken?.authToken?.accessToken,
      }).unwrap();
      if (result?.data) {
        setMyToDosData(result?.data);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleGeneralTasks = () => {
    if (generalTaskData?.data) {
      setGeneralTasksData(generalTaskData.data);
    } else {
      setGeneralTasksData([]);
    }
  };

  useEffect(() => {
    fetchData();
  }, [selectedTaskType, generalTaskData]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchData().finally(() => setRefreshing(false));
  };

  useEffect(() => {
    if (appSettingData?.data) {
      const settingTime = moment(appSettingData.data, 'HH:mm:ss');
      const currentTime = moment();

      if (currentTime.isAfter(settingTime)) {
        setIsFabDisabled(true);
      } else {
        setIsFabDisabled(false);
      }
    }
  }, [appSettingData]);

  const toggleCheckbox = (id: any) => {
    setCheckedItems(prev => ({ ...prev, [id]: !prev[id] }));
  };

  useEffect(() => {
    if (route.params?.clearSelected) {
      setCheckedItems({});
    }
  }, [route.params?.clearSelected]);

  const handleMenuOptionSelect = (option: any) => {
    setSelectedTaskType(option);
    setIsFilterSelected(true);
    setFilterVisible(false);
    fetchData();
  };
  const renderItem = ({ item }: any) => {
    
    if (item?.itemType?.value === 674180002 || item?.itemType?.value === 674180003) {
      return (
        <WorklogCard
          projectName={item?.project?.name}
          serialNo={item?.itemNumber}
          title={item?.title}
          startDate={item?.plannedStartDate ? moment(item?.plannedStartDate, 'MM/DD/YYYY HH:mm:ss').format('DD/MM/YYYY') : null}
          endDate={item?.plannedEndDate ? moment(item?.plannedEndDate, 'MM/DD/YYYY HH:mm:ss').format('DD/MM/YYYY') : null}
          status={item?.workStatus?.label}
          iconName2={checkedItems[item.id] ? 'checkbox-marked' : 'checkbox-blank-outline'}
          iconColor2={Colors.primary}
          iconName={item?.itemType?.label === 'To-Do' ? "checkbox-outline" : item?.itemType?.label === 'User Story' ? 'book' : 'bug'}
          iconColor={item?.itemType?.label === 'To-Do' ? "green" : item?.itemType?.label === 'User Story' ? Colors.secondary : item?.itemType?.label === 'Bug' ? Colors.error : null}
          rightIconColor={Colors.primary}
          iconPress2={() => { toggleCheckbox(item.id); }}
          showRightIcon2={false}
          showRightIcon={false}
          showleftIcon2={true}
        />
      );
    }
    return null;
  };

  return (
    <View style={styles(isDark).mainContainer}>
      <CustomHeader
        showBackIcon
        title="Plan My Day"
        isDark={isDark}
        onPress={() => navigation.goBack()}
        showFilterIcon
        filterOnPress={() => setFilterVisible(true)}
      />

      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginHorizontal: 17,
          marginBottom: 10,
          marginTop: 12,
        }}>
        <Text style={[styles(isDark).label, { fontSize: 16 }]}>
          {!isFilterSelected
            ? "Items I'm Working On"
            : selectedTaskType === 'generalTasks'
              ? 'General Tasks'
              : 'My Active Items'}
        </Text>

        {!ShowPlanLoading &&
          showPlanData?.data &&
          Object.keys(showPlanData.data).length > 0 && (
            <TouchableOpacity
              style={styles(isDark).showPlanButton}
              onPress={() => navigation.navigate('ShowPlan')}>
              <Text style={styles(isDark).showPlanText}>Show Plan</Text>
            </TouchableOpacity>
          )}
      </View>

      {isLoading ? (
        <ShimmerPlaceHolder />
      ) : (selectedTaskType === 'myActiveItems' ||
        selectedTaskType === 'defaultWorkingItems'
        ? myToDosData
        : generalTasksData
      )?.length === 0 ? (
        <EmptyData />
      ) : (
        <FlatList
          data={selectedTaskType === 'myActiveItems' || selectedTaskType === 'defaultWorkingItems' ? myToDosData : generalTasksData}
          keyExtractor={(item, index) => index.toString()}
          renderItem={renderItem}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          ListFooterComponent={<View style={{ height: 100 }} />}
          showsVerticalScrollIndicator={false}
        />
      )}

      <FAB
        style={styles(isDark).fab}
        color={Colors.white}
        icon="plus"
        onPress={() => {
          if (isFabDisabled) {
            ToastMessage({
              type: 'error',
              title: 'Time Limit Exceeded',
              subtitle: 'You cannot add to plan after 5:30 pm.',
            });
            return;
          }

          const selectedItems = (
            selectedTaskType === 'myActiveItems' ||
              selectedTaskType === 'defaultWorkingItems'
              ? myToDosData
              : generalTasksData
          ).filter((item: any) => checkedItems[item.id]);

          if (selectedItems.length === 0) {
            ToastMessage({
              type: 'error',
              title: 'No Task Selected',
              subtitle: 'Please select at least one task to add.',
            });
            return;
          }

          const shouldCheckDates =
            selectedTaskType === 'myActiveItems' ||
            selectedTaskType === 'defaultWorkingItems';

          const hasMissingDates = shouldCheckDates
            ? selectedItems.some(
              (item: any) => !item?.plannedStartDate || !item?.plannedEndDate,
            )
            : false;

          if (hasMissingDates) {
            ToastMessage({
              type: 'error',
              title: 'Missing Dates',
              subtitle: 'Planned dates are missing in selected task.',
            });
            return;
          }
          navigation.navigate('AddToMyPlan', { selectedItems });
        }}
      />

      <PlanMyDayFilter
        visible={filterVisible}
        // onClose={() => setFilterVisible(false)}
        setVisible={setFilterVisible}
        onPressProjectItem={() => handleMenuOptionSelect('myActiveItems')}
        onPressGeneral={() => handleMenuOptionSelect('generalTasks')}
      // selectedOption={selectedTaskType}
      />
    </View>
  );
};

const styles = (isDark: boolean) =>
  StyleSheet.create({
    mainContainer: {
      flex: 1,
      backgroundColor: isDark ? Colors.black : Colors.white,
    },

    card: {
      backgroundColor: isDark ? Colors.black : Colors.background,
      marginVertical: 7,
      borderColor: Colors.background,
      borderWidth: 0.5,
      marginHorizontal: 16,
      overflow: 'hidden',
    },
    topRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginLeft: -10,
    },

    row: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginVertical: 1,
    },
    label: {
      fontFamily: 'Lato-Bold',
      color: isDark ? Colors.white : Colors.black,
      flexShrink: 1,
    },
    value: {
      fontSize: 14,
      fontFamily: 'Lato-Regular',
      color: isDark ? Colors.white : Colors.black,
      flexWrap: 'wrap',
    },
    iconRow: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
    },
    iconBg: {
      backgroundColor: Colors.primary,
      borderRadius: 50,
      borderWidth: 0.5,
      borderColor: Colors.primary,
    },
    fab: {
      position: 'absolute',
      right: 32,
      bottom: 32,
      backgroundColor: isDark ? Colors.gray : Colors.primary,
      elevation: 10,
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.5)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    modalContainer: {
      width: '80%',
      backgroundColor: isDark ? Colors.gray : Colors.white,
      paddingHorizontal: 20,
      paddingVertical: 20,
      borderRadius: 5,
      alignItems: 'center',
    },
    modalTitle: {
      fontSize: 18,
      fontFamily: 'Lato-Bold',
      color: isDark ? Colors.white : Colors.black,
      marginTop: -50,
    },
    option: {
      width: '100%',
      alignItems: 'center',
      // borderBottomWidth: 1,
      // borderBottomColor: Colors.medium_gray,
      padding: 10,
    },
    optionText: {
      fontSize: 16,
      fontFamily: 'Lato-SemiBold',
      color: isDark ? Colors.white : Colors.black,
      marginBottom: 5,
    },
    showPlanButton: {
      backgroundColor: Colors.primary,
      paddingVertical: 8,
      paddingHorizontal: 20,
      borderRadius: 30,
    },
    showPlanText: {
      color: Colors.white,
      fontSize: 16,
      fontFamily: 'Lato-Bold',
    },
  });

export default PlanMyDay;
