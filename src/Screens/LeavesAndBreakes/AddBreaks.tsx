import { Pressable, StyleSheet, Text, View } from 'react-native';
import React, { useRef, useState } from 'react';
import CustomHeader from '../../Components/CustomHeader';
import { useSelector } from 'react-redux';
import { isDarkTheme } from '../../AppStore/Reducers/appState';
import { Colors } from '../../constants/Colors';
import { Button, Menu } from 'react-native-paper';
import { Formik } from 'formik';
import * as Yup from 'yup';
import CustomTextInput from '../../Components/CustomTextInput';
import moment from 'moment';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useCreateBreakInRequestMutation } from '../../Services/workFromHome';
import { useSaveEmployeeBreakLogMutation } from '../../Services/services';
import Placeholder from '../Placeholder/Placeholder';
import ToastMessage from '../../Components/ToastMessage';


const AddBreaks = ({ navigation }: any) => {
    const isDark = useSelector(isDarkTheme);
    const ref = useRef<any>();
    const AccessToken = useSelector((state: any) => state?.appState?.authToken);
    const employeeId = AccessToken?.userProfile?.userId;
    const accessToken = AccessToken?.authToken?.accessToken;

    const [menuVisible, setMenuVisible] = useState(false);
    const [showOutTimePicker, setShowOutTimePicker] = useState(false);
    const [showReturnTimePicker, setShowReturnTimePicker] = useState(false);
    const [dateLabel, setDateLabel] = useState('Today');

    const [CreateBreaks, { isLoading }] = useSaveEmployeeBreakLogMutation();

    const validationSchema = Yup.object().shape({
        outTime: Yup.string().required('Out Time is required'),
        returnTime: Yup.string()
            .required('Return Time is required')
        ,

        reason: Yup.string().required('Reason is required').min(20, 'Reason must be at least 20 characters'),
    });

    const openMenu = () => setMenuVisible(true);
    const closeMenu = () => setMenuVisible(false);

    const handleSelect = (label: 'Today' | 'Tomorrow') => {
        console.log(label);
        const selectedDate = label === 'Today' ? moment() : moment().add(1, 'day');
        const formattedDate = selectedDate.format('YYYY-MM-DD');
        setDateLabel(label);
        ref?.current?.setFieldValue('date', formattedDate);
        closeMenu();
    };

    const handleSave = async (values: any) => {

        const out = moment(values.outTime, 'YYYY-MM-DDTHH:mm.sss');
        const ret = moment(values.returnTime, 'YYYY-MM-DDTHH:mm.sss');

        let totalMinutes = ret.diff(out, 'minutes');
        totalMinutes = ((totalMinutes % 1440) + 1440) % 1440;

        const hours = Math.floor(totalMinutes / 60);
        const minutes = totalMinutes % 60;

        const duration = `${hours < 10 ? '0' : ''}${hours}:${minutes < 10 ? '0' : ''}${minutes}`;

        const data = {
            "employeeId": employeeId,
            "reason": values.reason,
            "outTime": values.outTime,
            "returnTime": values.returnTime,
            "breakDuration": duration
        }

        try {
            const response = await CreateBreaks({ data, accessToken, })
            if (response?.data?.isSuccessful) {
                ToastMessage({ type: "success", title: "Break", subtitle: "Break Added Successfully!" });
                navigation.goBack();
            } else {
                ToastMessage({ type: "error", title: "Break", subtitle: "Break not Addedd" });
            }

        } catch (err) {
            console.log(err);
        }
    }

    return (
        <View style={styles(isDark).mainContainer}>
            <CustomHeader
                showBackIcon={true}
                title="Add Breaks"
                isDark={isDark}
                onPress={() => navigation.goBack()}
            />
            {
                isLoading ? (
                    <Placeholder />
                ) :
                    (
                        <Formik
                            innerRef={ref}
                            initialValues={{
                                date: moment().format('YYYY-MM-DD'),
                                outTime: '',
                                returnTime: '',
                                reason: '',
                            }}
                            validationSchema={validationSchema}
                            onSubmit={(values) => { handleSave(values); }}
                        >
                            {({ handleSubmit, handleChange, handleBlur, setFieldValue, values, errors, touched, submitCount }) => (
                                <>
                                    {submitCount > 0 && Object.keys(errors).length > 0 && (
                                        <View style={styles(isDark).formErrorBox}>
                                            <Text style={styles(isDark).formErrorText}>{
                                                //@ts-ignore
                                                String(errors[Object.keys(errors)[0]])}</Text>
                                        </View>
                                    )}

                                    <Menu
                                        visible={menuVisible}
                                        onDismiss={closeMenu}
                                        anchor={
                                            <Pressable onPress={openMenu}>
                                                <CustomTextInput
                                                    label="Log Today or Tomorrow"
                                                    value={dateLabel}
                                                    onChangeText={() => { }}
                                                    lefticon={false}
                                                    rightIconName={'chevron-down'}
                                                    onPress={openMenu}
                                                    editable={false}
                                                    readOnly={true}
                                                    keyboardType={'none'}
                                                    style={{ marginTop: 10 }}
                                                />
                                            </Pressable>
                                        }
                                        contentStyle={{ backgroundColor: isDark ? Colors.gray : Colors.white }}
                                        statusBarHeight={70}
                                        style={{ marginLeft: 10, }}
                                    >
                                        <Menu.Item
                                            onPress={() => {handleSelect('Today'),console.log('Today')}}
                                            title="Today"
                                            titleStyle={{ color: isDark ? Colors.white : Colors.black }}
                                        />
                                        <Menu.Item
                                            onPress={() => {handleSelect('Tomorrow'),console.log('Tomorrow')}}
                                            title="Tomorrow"
                                            titleStyle={{ color: isDark ? Colors.white : Colors.black }}
                                        />
                                    </Menu>

                                    <CustomTextInput
                                        label="Out Time"
                                        value={values.outTime ? moment(values.outTime, 'YYYY-MM-DDTHH:mm:ss').format('HH:mm') : values.outTime}
                                        onChangeText={handleChange('outTime')}
                                        onBlur={handleBlur('outTime')}
                                        rightIconName="clock-time-four-outline"
                                        lefticon={false}
                                        onPress={() => setShowOutTimePicker(true)}
                                        editable={false}
                                        readOnly={true}
                                        style={{ marginTop: 10 }}
                                    />
                                    {showOutTimePicker && (
                                        <DateTimePicker
                                            value={new Date()}
                                            mode="time"
                                            display="default"
                                            is24Hour={true}
                                            onChange={(event, selectedTime) => {
                                                setShowOutTimePicker(false);
                                                if (selectedTime) {
                                                    const selectedMoment = moment(selectedTime);
                                                    const baseDate = dateLabel === 'Tomorrow' ? moment().add(1, 'day') : moment();
                                                    const combined = baseDate.set({
                                                        hour: selectedMoment.get('hour'),
                                                        minute: selectedMoment.get('minute'),
                                                        second: 0,
                                                        millisecond: 0,
                                                    });
                                                    // setFieldValue('outTime', combined.toISOString()); 
                                                    setFieldValue('outTime', combined.format('YYYY-MM-DDTHH:mm:ss'));

                                                }
                                            }}

                                        />
                                    )}

                                    <CustomTextInput
                                        label="Return Time"
                                        value={values.returnTime ? moment(values.returnTime, 'YYYY-MM-DDTHH:mm:ss').format('HH:mm') : values.returnTime}
                                        onChangeText={handleChange('returnTime')}
                                        onBlur={handleBlur('returnTime')}
                                        rightIconName="clock-time-four-outline"
                                        lefticon={false}
                                        onPress={() => setShowReturnTimePicker(true)}
                                        editable={false}
                                        readOnly={true}
                                        style={{ marginTop: 10 }}
                                    />
                                    {showReturnTimePicker && (
                                        <DateTimePicker
                                            value={new Date()}
                                            mode="time"
                                            display='default'
                                            is24Hour={true}
                                            onChange={(event, selectedTime) => {
                                                setShowReturnTimePicker(false);
                                                if (selectedTime) {
                                                    const selectedMoment = moment(selectedTime);
                                                    const baseDate = dateLabel === 'Tomorrow' ? moment().add(1, 'day') : moment();
                                                    const combined = baseDate.set({
                                                        hour: selectedMoment.get('hour'),
                                                        minute: selectedMoment.get('minute'),
                                                        second: 0,
                                                        millisecond: 0,
                                                    });
                                                    // setFieldValue('returnTime', combined.toISOString());
                                                    setFieldValue('returnTime', combined.format('YYYY-MM-DDTHH:mm:ss'));
                                                }
                                            }}

                                        />
                                    )}

                                    <CustomTextInput
                                        label="Reason"
                                        value={values.reason}
                                        onChangeText={handleChange('reason')}
                                        onBlur={handleBlur('reason')}
                                        secureTextEntry={false}
                                        lefticon={false}
                                        editable={true}
                                        numberOfLines={5}
                                        multiline={true}
                                        contentStyle={{ height: 80 }}
                                        style={{ marginTop: 10 }}
                                        autoFocus={true}
                                    />

                                    <Button
                                        mode="contained"
                                        // @ts-ignore
                                        onPress={handleSubmit}
                                        buttonColor={Colors.primary}
                                        style={{ width: '90%', alignSelf: 'center', marginTop: 20 }}
                                    >
                                        Submit
                                    </Button>
                                </>
                            )}
                        </Formik>
                    )}
        </View>
    );
};

export default AddBreaks;


const styles = (isDark: boolean) =>
    StyleSheet.create({
        mainContainer: {
            flex: 1,
            backgroundColor: isDark ? Colors.black : Colors.white,
        },
        formErrorBox: {
            backgroundColor: Colors.error,
            padding: 10,
            marginBottom: 10,
        },
        formErrorText: {
            color: Colors.white,
            fontFamily: 'Lato-Bold',
            textAlign: 'center',
        },
    });
