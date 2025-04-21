import {View, Text, StyleSheet, ScrollView} from 'react-native';
import React, {useState} from 'react';
import {useSelector} from 'react-redux';
import {isDarkTheme} from '../../../AppStore/Reducers/appState';
import {Colors} from '../../../constants/Colors';
import {useCreateMyDailyTaskReportMutation} from '../../../Services/workloglevel';
import Toast from 'react-native-toast-message';
import CustomHeader from '../../../Components/CustomHeader';
import {
  Button,
  Card,
  Icon,
  List,
  TextInput,
} from 'react-native-paper';

const AddToMyPlan = ({navigation, route}: any) => {
  const isDark = useSelector(isDarkTheme);
  const EmployeeId = useSelector((state: any) => state?.appState?.authToken);
  const {selectedItems = []} = route.params || {};
  const [isCommitting, setIsCommitting] = useState(false);
  const [createTaskReport] = useCreateMyDailyTaskReportMutation();
  const [estimatedEfforts, setEstimatedEfforts] = useState<Record<string, string>>({});
  const [selectedWorkStatuses, setSelectedWorkStatuses] = useState<Record<string, string>>({});
  const [expandedStates, setExpandedStates] = useState<Record<string, boolean>>({},);

  const WORK_STATUS_OPTIONS = [
    {
      value: 674180000,
      label: 'Will continue',
    },
    {
      value: 674180001,
      label: 'Will be completed',
    },
  ];

  const handleCommit = async () => {

    const payload =  selectedItems.map((item:any )=> {
      const effort = parseFloat(estimatedEfforts[item.id]);
      const selectedStatus = selectedWorkStatuses[item.id];
      const statusObj = WORK_STATUS_OPTIONS.find(opt => opt.label === selectedStatus);
  
      if (!effort || effort < 0.25 || !statusObj) return null;
  
      return {
      reportDate: new Date().toISOString().split('T')[0], 
      toDoId: item.id,
      taskEstimatedEffort: effort,
      plannedEffortforDay: effort,
      eodCommittedWorkStatus: {
        value: statusObj.value,
        label: statusObj.label,
      },
    };
    }).filter(Boolean); 
  
    if (payload.length === 0) {
      Toast.show({
        type: 'error',
        text1: 'Validation Error',
        text2: 'Please select at least one valid task',
      });
      return;
    }  
    setIsCommitting(true);
  
    try {
      const res = await createTaskReport({
        accessToken: EmployeeId?.authToken?.accessToken,
        data: payload, 
      }).unwrap();
    
      if (res?.isSuccessful && res?.messageDetail?.message_code === 201) {
        Toast.show({
          type: 'success',
          text1: 'Success',
          text2: res?.messageDetail?.message || 'Tasks committed successfully',
        });
        navigation.navigate('PlanMyDay', { clearSelected: true });
      } 
    } catch (error: any) {
      console.error('Commit error:', error);
      Toast.show({
        type: 'error',
        text1: 'Commit Failed',
        text2: error?.message || 'Something went wrong while committing tasks',
      });
    } finally {
      setIsCommitting(false);
    }
  };
  

  return (
    <View style={styles(isDark).mainContainer}>
      <CustomHeader
        showBackIcon={true}
        title="Add To My Plan"
        isDark={isDark}
        onPress={() => navigation.goBack()}
      />

      <ScrollView style={{}}>
        {selectedItems.length === 0 ? (
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              marginHorizontal: 16,
              marginVertical: 10,
            }}>
            <Text
              style={{
                color: isDark ? Colors.white : Colors.black,
                alignSelf: 'center',
                fontFamily: 'Lato-Bold',
              }}>
              No items selected Please select atleast one item to add to my plan
            </Text>
          </View>
        ) : (
          selectedItems.map((item: any, index: number) => (
            <Card key={item.id} style={styles(isDark).card}>
              <Card.Content>
                <View style={styles(isDark).topRow}>
                  <Text
                    style={[
                      styles(isDark).label,
                      {fontSize: 16, flexShrink: 1},
                    ]}>
                    {item?.project?.name ?? 'No Project Name'}
                  </Text>
                </View>
                <View style={styles(isDark).row}>
                  <Text style={[styles(isDark).label,]}>
                    {item?.itemNumber}
                    {' : '}
                    <Text style={[styles(isDark).value, {flexShrink: 1}]}>{item?.title}
                  </Text></Text>
                </View>

                <View style={[styles(isDark).row, {}]}>
                  <Text style={[styles(isDark).value, {fontSize: 16}]}>
                    Estimated Effort{' : '}
                    <Text style={[styles(isDark).value, {fontSize: 16}]}>
                      {item?.toDoSubViewsDtos?.implementationEffort}
                    </Text>
                  </Text>
                  <Text style={[styles(isDark).label, {fontSize: 16}]}>
                    {item?.workStatus?.label}
                  </Text>
                </View>

                <View style={{marginTop: 10}}>
                  <TextInput
                    label="Estimated Effort"
                    value={estimatedEfforts[item.id] || ''}
                    mode="outlined"
                    keyboardType="numeric"
                    onChangeText={text => {
                      const num = parseFloat(text);
                      setEstimatedEfforts(prev => ({
                        ...prev,
                        [item.id]: !isNaN(num) && num >= 0.25 ? text : '',
                      }));
                    }}
                    outlineColor={Colors.medium_gray}
                    theme={{
                      colors: {
                        primary: Colors.primary,
                        background: isDark ? Colors.gray : Colors.white,
                      },
                    }}
                    contentStyle={{
                      color: isDark ? Colors.white : Colors.black,
                      fontFamily: 'Lato-Regular',
                      fontSize: 14,
                    }}
                    style={styles(isDark).input}
                  />
                  {estimatedEfforts[item.id] !== '' &&
                    parseFloat(estimatedEfforts[item.id]) < 0.25 && (
                      <Text style={{color: 'red', marginTop: 4}}>
                        Must be 0.25 or greater
                      </Text>
                    )}
                </View>

                <View style={{marginTop: 10, marginBottom: 10}}>
                  <List.Accordion
                    title={
                      selectedWorkStatuses[item.id] ||
                      item?.eodCommittedWorkStatus?.label ||
                      'Committed EOD Status'
                    }
                    style={{
                      backgroundColor: isDark ? Colors.gray : Colors.background,
                      borderWidth: 0.5,
                      borderColor: Colors.medium_gray,
                      borderRadius: 1,
                      height: 57,
                    }}
                    titleStyle={{
                      color: isDark ? Colors.white : Colors.black,
                      fontFamily: 'Lato-Regular',
                      fontSize: 14,
                    }}
                    right={props => (
                      <List.Icon
                        {...props}
                        icon="chevron-down"
                        color={isDark ? Colors.white : Colors.black}
                      />
                    )}
                    expanded={!!expandedStates[item.id]}
                    onPress={() =>
                      setExpandedStates(prev => ({
                        ...prev,
                        [item.id]: !prev[item.id],
                      }))
                    }>
                    {WORK_STATUS_OPTIONS.map(option => (
                      <List.Item
                        key={option.value}
                        title={option.label}
                        onPress={() => {
                          setSelectedWorkStatuses(prev => ({
                            ...prev,
                            [item.id]: option.label,
                          }));
                          setExpandedStates(prev => ({
                            ...prev,
                            [item.id]: false,
                          }));
                        }}
                        right={() =>
                          selectedWorkStatuses[item.id] === option.label ? (
                            <Icon
                              source="check"
                              size={20}
                              color={Colors.primary}
                            />
                          ) : null
                        }
                        style={{
                          backgroundColor: isDark ? Colors.gray : Colors.white,
                          height: 51,
                        }}
                        titleStyle={{
                          color: isDark ? Colors.white : Colors.black,
                          fontFamily: 'Lato-Regular',
                          fontSize: 14,
                        }}
                      />
                    ))}
                  </List.Accordion>
                </View>
              </Card.Content>
            </Card>
          ))
        )}
      </ScrollView>

      <Button
        mode="contained"
        onPress={() => handleCommit()}
        loading={isCommitting}
        disabled={isCommitting}
        style={{
          marginHorizontal: 16,
          marginBottom: 20,
          paddingVertical: 2,
          backgroundColor: Colors.primary,
          borderRadius: 3,
        }}
        labelStyle={{color: 'white', fontFamily: 'Lato-Bold'}}>
        Commit
      </Button>
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
    row: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginVertical: 1,
    },
    label: {
      fontFamily: 'Lato-Bold',
      color: isDark ? Colors.white : Colors.black,
      marginBottom: 5,
    },
    value: {
      fontSize: 14,
      fontFamily: 'Lato-Regular',
      color: isDark ? Colors.white : Colors.black,
      flexWrap: 'wrap',
    },
    input: {
      marginTop: 5,
    },
    topRow: {
      flexDirection: 'row',
      alignItems: 'center',
    },
  });

export default AddToMyPlan;