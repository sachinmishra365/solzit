import {
  View,
  Text,
  TouchableOpacity,
  Platform,
  ActivityIndicator,
  Alert,
  Pressable,
} from 'react-native';
import React, {useState} from 'react';
import CustomTextInput from '../Components/CustomTextInput';
import DateTimePicker from '@react-native-community/datetimepicker';
import {Formik} from 'formik';
import * as Yup from 'yup';
import {Colors} from '../constants/Colors';
import {SCREEN_WIDTH} from '../constants/Screen';
import {useEmployeeLeaveApplyMutation} from '../Services/services';
import {useSelector} from 'react-redux';
import moment from 'moment';
import {Divider, Menu} from 'react-native-paper';
import CustomHeader from '../Components/CustomHeader';
import {useNavigation} from '@react-navigation/native';
import Placeholder from './Placeholder/Placeholder';

const validationSchema = Yup.object().shape({
  LeaveDayType: Yup.string().required('Leave Day Type is required'),
  // LeaveType: Yup.string().required('Leave Type is required'),
  StartDayOfLeave: Yup.string().required('Start Day Of Leave is required'),
  EndDayOfLeave: Yup.string().required('End Day Of Leave is required'),
  HalfDayType: Yup.string().when('LeaveDayType', {
    is: (value: string | string[]) => value === 'Half Day',
    then: () => Yup.string().required('Please select Half Day Type!'),
    otherwise: () => Yup.string().nullable(),
  }),
});

const ApplyLeave = () => {
  const CheckStatus = useSelector((state: any) => state?.appState?.authToken);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [showStart, setShowStart] = useState(false);
  const [showEnd, setShowEnd] = useState(false);
  const [visible, setVisible] = useState(false);
  const [halfDayMenu, SetHalfDayMenu] = useState(false);

  const navigation = useNavigation();

  const openMenu = () => {
    setVisible(true);
  };
  const openHalfDayMenu = () => {
    SetHalfDayMenu(true);
  };
  const closeMenu = () => {
    setVisible(false);
  };
  const closeHalfDayMenu = () => {
    SetHalfDayMenu(false);
  };

  const [ApplyLeave, {isLoading, error}] = useEmployeeLeaveApplyMutation();

  const onChangeStart = (event: any, selectedDate: Date) => {
    const currentDate = selectedDate || startDate;
    setShowStart(false);
    setStartDate(currentDate);
  };

  const onChangeEnd = (event: any, selectedDate: Date) => {
    const currentDate = selectedDate || endDate;
    setShowEnd(false);
    setEndDate(currentDate);
  };

  const showDatepickerStart = () => {
    setShowStart(true);
  };

  const showDatepickerEnd = () => {
    setShowEnd(true);
  };

  const handleApply = async (values: any) => {
    // const formattedStartDate = moment(startDate).format('YYYY-MM-DD');
    // const formattedEndDate = moment(endDate).format('YYYY-MM-DD');
    const formattedStartDate = startDate ? moment(startDate).format('YYYY-MM-DD') : null;
    const formattedEndDate = endDate ? moment(endDate).format('YYYY-MM-DD') : null;
    console.log(values)
    const data = {
      leaveDayType: {
        Value: values.LeaveDayType === 'Full Day' ? 0 : 1,
        Label: values.LeaveDayType,
      },
      leaveType: {
        Value: 674180000,
        Label: 'Earn Leave',
      },
      typeofHalfDayLeave: {
        Value: values.LeaveDayType === 'Full Day' ? null : values.HalfDayType === 'Fore Noon' ? 674180000 : 674180001,
        Label: values.LeaveDayType === 'Full Day' ? null : values.HalfDayType,
      },
      employee: {
        ID: CheckStatus.data.Data.ID,
        email: CheckStatus.data.Data.employee.email,
        fullName: CheckStatus.data.Data.fullName,
      },
      leaveStartDate: formattedStartDate,
      leaveEndDate: formattedEndDate,
    };
    console.log(data);
    
    try {
      const response = await ApplyLeave(data).unwrap();
      
      Alert.alert(
        'Leave Status', 
        response.Message,
        [
          
          {text: 'OK', onPress: () => console.log('OK Pressed')}, 
        ],
        {cancelable: true}, 
      );
    } catch (err) {
      console.error('Error:', err);
    }
  };



  return (
    <View
      style={{
        flex: 1,
        backgroundColor: Colors.black,
      }}>
      <CustomHeader
        showBackIcon={true}
        title="Apply Leave"
        onPress={() => {
          navigation.goBack();
        }}
      />
      <View style={{borderWidth:1,backgroundColor:Colors.white,height:1}}/>
      {isLoading ? (
        <Placeholder/>
      ) : (
        <Formik
          initialValues={{
            LeaveDayType: '',
            LeaveType: 'Earn Leave',
            HalfDayType: '',
            StartDayOfLeave: moment(startDate).format('YYYY-MM-DD'),
            EndDayOfLeave: moment(endDate).format('YYYY-MM-DD'),
          }}
          validationSchema={validationSchema}
          onSubmit={ApplyLeave}>
          {({
            handleChange,
            handleBlur,
            handleSubmit,
            setFieldValue,
            values,
            errors,
            touched,
          }) => (
            <View>
              <View style={{marginVertical: 16}} />
              <Menu
                visible={visible}
                onDismiss={closeMenu}
                contentStyle={{backgroundColor: Colors.gray}}
                anchor={
                  <Pressable onPress={openMenu}>
                  <CustomTextInput
                    label="Leave Day Type"
                    value={values.LeaveDayType}
                    secureTextEntry={false}
                    onChangeText={handleChange('LeaveDayType')}
                    onBlur={handleBlur('LeaveDayType')}
                    lefticon={false}
                    rightIconName={'chevron-down'}
                    onPress={openMenu}
                  />
                  </Pressable>
                }
                style={{marginTop: 10, marginHorizontal: 14}}>
                <Menu.Item
                  onPress={() => {
                    setFieldValue('LeaveDayType', 'Full Day');
                    closeMenu();
                  }}
                  title="Full Day"
                  titleStyle={{color: Colors.white}}
                />
                <Divider />
                <Menu.Item
                  onPress={() => {
                    setFieldValue('LeaveDayType', 'Half Day');
                    closeMenu();
                  }}
                  title="Half Day"
                  titleStyle={{color: Colors.white}}
                />
              </Menu>
              {touched.LeaveDayType && errors.LeaveDayType && (
                <Text style={{color: Colors.error, marginLeft: 20}}>
                  {errors.LeaveDayType}
                </Text>
              )}
              <View style={{marginVertical: 16}} />
              <CustomTextInput
                label="Leave Type"
                value={values.LeaveType}
                onChangeText={handleChange('LeaveType')}
                onBlur={handleBlur('LeaveType')}
                lefticon={false}
                rightIconName={false}
                editable={false}
              />
              {/* {touched.LeaveType && errors.LeaveType && (
                <Text style={{color: Colors.error, marginLeft: 20}}>
                  {errors.LeaveType}
                </Text>
              )} */}
              {values.LeaveDayType === 'Half Day' ? (
                <View>
                  <View style={{marginVertical: 16}} />
                  <Menu
                    visible={halfDayMenu}
                    onDismiss={closeHalfDayMenu}
                    contentStyle={{backgroundColor: Colors.gray}} // Style for the full menu item
                    anchor={
                      <CustomTextInput
                        label="Half Day Type"
                        value={values.HalfDayType}
                        secureTextEntry={false}
                        onChangeText={handleChange('HalfDayType')}
                        onBlur={handleBlur('HalfDayType')}
                        lefticon={false}
                        rightIconName={'chevron-down'}
                        onPress={openHalfDayMenu}
                        style={{marginTop: 10, marginHorizontal: 16}}
                      />
                    }>
                    <Menu.Item
                      onPress={() => {
                        setFieldValue('HalfDayType', 'Fore Noon');
                        closeHalfDayMenu();
                      }}
                      title="Fore Noon"
                      titleStyle={{color: Colors.white}}
                    />
                    <Divider />
                    <Menu.Item
                      onPress={() => {
                        setFieldValue('HalfDayType', 'After Noon');
                        closeHalfDayMenu();
                      }}
                      title="After Noon"
                      titleStyle={{color: Colors.white}}
                    />
                  </Menu>
                </View>
              ) : null}
          
                {touched.HalfDayType && errors.HalfDayType && (
                <Text style={{color: Colors.error, marginLeft: 20}}>
                  {errors.HalfDayType}
                </Text>
              )}
              <View style={{marginVertical: 16}} />
              <Pressable onPress={showDatepickerStart}>
              <CustomTextInput
                label="Start Day Of Leave"
                value={moment(startDate).format('YYYY-MM-DD')}
                onChangeText={handleChange('StartDayOfLeave')}
                onBlur={handleBlur('StartDayOfLeave')}
                lefticon={false}
                rightIconName={'calendar'}
                onPress={showDatepickerStart}
              />
              </Pressable>
              {touched.StartDayOfLeave && errors.StartDayOfLeave && (
                <Text style={{color: Colors.error, marginLeft: 20}}>
                  {errors.StartDayOfLeave}
                </Text>
              )}
              <View style={{marginVertical: 16}} />
              <Pressable onPress={showDatepickerEnd}>
              <CustomTextInput
                label="End Day Of Leave"
                value={moment(endDate).format('YYYY-MM-DD')}
                onChangeText={handleChange('EndDayOfLeave')}
                onBlur={handleBlur('EndDayOfLeave')}
                lefticon={false}
                rightIconName={'calendar'}
                onPress={showDatepickerEnd}
              />
              </Pressable>
              {touched.EndDayOfLeave && errors.EndDayOfLeave && (
                <Text style={{color: Colors.error, marginLeft: 20}}>
                  {errors.EndDayOfLeave}
                </Text>
              )}
              {showStart && (
                <DateTimePicker
                  testID="dateTimePickerStart"
                  value={startDate}
                  mode="date"
                  display="default"
                  onChange={onChangeStart}
                  minimumDate={new Date()}
                />
              )}
              {showEnd && (
                <DateTimePicker
                  testID="dateTimePickerEnd"
                  value={
                    values.LeaveDayType === 'Full Day' ? endDate : startDate
                  }
                  mode="date"
                  display="default"
                  onChange={onChangeEnd}
                  minimumDate={startDate}
                />
              )}
              <View style={{marginVertical: 16}} />
              <TouchableOpacity
                style={{
                  width: SCREEN_WIDTH - 32,
                  height: 45,
                  backgroundColor: Colors.white,
                  justifyContent: 'center',
                  alignSelf: 'center',
                  borderRadius: 3,
                }}
                onPress={handleSubmit}>
                <Text
                  style={{
                    textAlign: 'center',
                    fontSize: 16,
                    fontWeight: '600',
                    color: Colors.black,
                  }}>
                  Apply
                </Text>
              </TouchableOpacity>
              {isLoading && (
                <ActivityIndicator size="large" color={Colors.black} />
              )}
              {error && (
                <Text
                  style={{
                    color: Colors.error,
                    marginTop: 20,
                    textAlign: 'center',
                  }}>
                  Application failed. Please try again.
                </Text>
              )}
             
            </View>
          )}
        </Formik>
      )}
    </View>
  );
};

export default ApplyLeave;
