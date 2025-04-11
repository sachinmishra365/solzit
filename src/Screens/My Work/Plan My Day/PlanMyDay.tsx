import { View, Text, StyleSheet, FlatList, RefreshControl, Modal, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Checkbox, IconButton, Card, FAB } from 'react-native-paper';
import { isDarkTheme } from '../../../AppStore/Reducers/appState';
import Toast from 'react-native-toast-message';
import CustomHeader from '../../../Components/CustomHeader';
import { Colors } from '../../../constants/Colors';
import moment from 'moment';
import ShimmerPlaceHolder from '../../Placeholder/ShimmerPlaceHolder';
import { useGetGeneralTaskListInMyProjectQuery, useGetToDoListBasedOnFilterMutation } from '../../../Services/workloglevel';
import WorklogCard from '../../../Components/WorklogCard';


const PlanMyDay = ({ navigation }: any) => {
  const isDark = useSelector(isDarkTheme);
  const accessToken = useSelector((state: any) => state?.appState?.authToken);
  const connected = useSelector((state: any) => state?.appState?.connected);

  const [refreshing, setRefreshing] = useState(false);
  const [myToDosData, setMyToDosData] = useState([]);
  const [generalTasksData, setGeneralTasksData] = useState([]);
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});
  const [selectedTaskType, setSelectedTaskType] = useState('myActiveItems');
  const [filterVisible, setFilterVisible] = useState(false);
  const [isFilterSelected, setIsFilterSelected] = useState(false);

  const [getToDoListBasedOnFilter, { isLoading: isToDoLoading }] = useGetToDoListBasedOnFilterMutation();
  const { data: generalTaskData, isLoading: isGeneralTaskLoading } = useGetGeneralTaskListInMyProjectQuery({
    accessToken: accessToken?.authToken?.accessToken,
  });

  const isLoading = isToDoLoading || isGeneralTaskLoading;

  const fetchData = async () => {
    if (selectedTaskType === 'myActiveItems') {
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
      const filterId = selectedTaskType === 'myActiveItems' ? 1 : 3;
      const itemTypeId = selectedTaskType === 'myActiveItems' ? 0 : 1;

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

  const toggleCheckbox = (id: any) => {
    setCheckedItems((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleMenuOptionSelect = (option: any) => {
    setSelectedTaskType(option);
    setIsFilterSelected(true);
    setFilterVisible(false);
    fetchData();
  };


  const FilterModal = ({ visible, onClose, onSelect, selectedOption }: any) => {
    return (
      <Modal
        transparent
        animationType="slide"
        visible={visible}
        onRequestClose={onClose}
      >
        <View style={styles(isDark).modalOverlay}>
          <View style={styles(isDark).modalContainer}>
            <Text style={styles(isDark).modalTitle}>Select To-Do's</Text>
            <TouchableOpacity
              style={[styles(isDark).option, selectedOption === 'myActiveItems' && { backgroundColor: isDark ? Colors.gray : Colors.white, }]}
              onPress={() => onSelect('myActiveItems')}
            >
              <Text style={styles(isDark).optionText}>My Active Items</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles(isDark).option,
                selectedOption === 'generalTasks' && { backgroundColor: isDark ? Colors.gray : Colors.white, }
              ]}
              onPress={() => onSelect('generalTasks')}
            >
              <Text style={styles(isDark).optionText}>General Tasks</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={onClose}>
              <Text style={[styles(isDark).optionText, { padding: 10, }]} >Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  };


  const renderItem = ({ item }: any) => (
    <WorklogCard
      projectName={item?.project?.name}
      serialNo={item?.itemNumber}
      title={item?.title}
      startDate={item?.plannedStartDate ? moment(item?.plannedStartDate, "MM/DD/YYYY HH:mm:ss").format("DD/MM/YYYY") : null}
      endDate={item?.plannedEndDate ? moment(item?.plannedEndDate, "MM/DD/YYYY HH:mm:ss").format('DD/MM/YYYY') : null}
      status={item?.workStatus?.label}
      iconName={checkedItems[item.id] ? 'checkbox-marked' : 'checkbox-blank-outline'}
      iconColor={Colors.primary}
      rightIconColor={Colors.primary}
      iconPress={() => {toggleCheckbox(item.id)}}
      showRightIcon2={false}
      showRightIcon={false}
      cardPress={() => navigation.navigate('ToDoDetails', {ToDoDetail: item})}
    />
  );

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

      <View style={styles(isDark).divider} />

      <Text
        style={[styles(isDark).label, { fontSize: 16, marginHorizontal: 16 }]}>
        {!isFilterSelected
          ? "Items I'm Working On"
          : selectedTaskType === 'generalTasks'
            ? 'General Tasks'
            : 'My Active Items'}
      </Text>

      {isLoading ? (
        <ShimmerPlaceHolder />
      ) : (selectedTaskType === 'myActiveItems'
        ? myToDosData
        : generalTasksData
      )?.length === 0 ? (
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Text
            style={{
              color: isDark ? Colors.white : Colors.black,
              alignSelf: 'center',
              fontFamily: 'Lato-Bold',
            }}>
            No Records
          </Text>
        </View>
      ) : (
        <FlatList
          data={
            selectedTaskType === 'myActiveItems'
              ? myToDosData
              : generalTasksData
          }
          keyExtractor={(item, index) => index.toString()}
          renderItem={renderItem}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          showsVerticalScrollIndicator
          ListFooterComponent={<View style={{ height: 100 }} />}
        />
      )}

      <FAB
        style={styles(isDark).fab}
        color={Colors.white}
        onPress={() => {
          const selectedItems = (
            selectedTaskType === 'myActiveItems'
              ? myToDosData
              : generalTasksData
          ).filter((item: any) => checkedItems[item.id]);
          navigation.navigate('AddToMyPlan', { selectedItems });
        }}
        accessibilityLabel="Add To My Plan"
        icon="plus"
      />

      <FilterModal
        visible={filterVisible}
        onClose={() => setFilterVisible(false)}
        onSelect={handleMenuOptionSelect}
        selectedOption={selectedTaskType}
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
    divider: {
      height: 1,
      backgroundColor: isDark ? Colors.medium_gray : 'transparent',
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
      padding: 20,
      borderRadius: 5,
      alignItems: 'center',
    },
    modalTitle: {
      fontSize: 18,
      fontFamily: 'Lato-Bold',
      color: isDark ? Colors.white : Colors.black,
      marginBottom: 20,
    },
    option: {
      width: '100%',
      alignItems: 'center',
      borderBottomWidth: 1,
      borderBottomColor: Colors.medium_gray,
      padding: 10,
    },
    optionText: {
      fontSize: 16,
      fontFamily: 'Lato-SemiBold',
      color: isDark ? Colors.white : Colors.black,
    },
  });

export default PlanMyDay;
