import { Alert, StyleSheet, Text, View } from 'react-native'
import React, { useRef, useState } from 'react'
import CustomHeader from '../../Components/CustomHeader'
import { Colors } from '../../constants/Colors'
import { useSelector } from 'react-redux'
import { isDarkTheme } from '../../AppStore/Reducers/appState'
import { Button, Snackbar } from 'react-native-paper'
import CustomTextInput from '../../Components/CustomTextInput'
import { Formik } from 'formik'
import moment from 'moment'
import * as Yup from 'yup';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useGetWorkLogByIdQuery, useSaveWorkLogMutation } from '../../Services/workloglevel'
import Placeholder from '../Placeholder/Placeholder'


const AddWorklog = ({ navigation, route }: any) => {
    const ref = useRef()
    const statusRef = useRef<string>('');
    // const worklogData = route?.params?.item;
    const SubmittedworklogData = route?.params?.item;

    const isDark = useSelector(isDarkTheme);
    const worklogData = useSelector((state: any) => state?.appState?.worklogDetails);

    const EmployeeId = useSelector((state: any) => state?.appState?.authToken?.userProfile);
    const Assesstoken = useSelector((state: any) => state?.appState?.authToken);
    const accessToken = Assesstoken?.authToken?.accessToken;
    const [showdate, setShowDate] = useState(false);

    const { data: worklogDetails } = useGetWorkLogByIdQuery({ workLogId: SubmittedworklogData?.id, accessToken: accessToken }, { skip: !accessToken || !SubmittedworklogData?.id });
    console.log(worklogDetails?.data, 'worklogDetails');

    const [saveworklog, result] = useSaveWorkLogMutation();

    const validationSchema = Yup.object().shape({
        hour: Yup.number()
            .typeError('Hour must be a number')
            .required('Hour is required')
            .max(16, 'Hour cannot be more than 16')
            .test('is-quarter-increment', 'Hour must be in 0.25 increments', (value) => {
                return value % 0.25 === 0;
            }),
            description: Yup.string().required('Description is required').min(20, 'Description must be at least 20 characters'),
    });

    const showDatepickerDate = () => { setShowDate(true); };

    const handleSaveWorklog = async (values: any) => {
        const data = statusRef.current === 'submitted' ? {
            projectId: worklogData?.project?.id,
            todoID: worklogData?.id,
            date: moment(values?.date).format('YYYY-MM-DD'),
            hours: Number(values?.hour),
            worklogStatus: 674180001,
            description: values?.description,
            loggedBy: {
                id: EmployeeId?.userId,
                name: EmployeeId?.fullName
            },
            // "workLogCategory": 0
        } : {
            projectId: worklogData?.project?.id,
            todoID: worklogData?.id,
            id: statusRef.current === 'submitted' ? '' : SubmittedworklogData?.id,
            date: moment(values?.date).format('YYYY-MM-DD'),
            hours: Number(values?.hour),
            worklogStatus: 674180000,
            description: values?.description,
            loggedBy: {
                id: EmployeeId?.userId,
                name: EmployeeId?.fullName
            },
            // "workLogCategory": 0
        }

        try {
            const response = await saveworklog({ data, accessToken }).unwrap();
            if (response?.messageDetail?.message_code === 201) {
                Alert.alert('Success', 'Work log saved successfully!')
            }
        } catch (err) {
            console.log(err);
        }
    }


    return (
        <View style={styles(isDark).container}>
            <CustomHeader
                showBackIcon={true}
                title={'Add Worklog'}
                onPress={() => navigation.goBack()}
                showRightIcon={true}
                rightIconName={'eye'}
                rightIconPress={() => navigation.navigate('WorklogDetails', { item: worklogData })}
            />
            <View
                style={{
                    borderWidth: 1, height: 1,
                    backgroundColor: isDark ? Colors.white : 'transparent',
                    borderColor: isDark ? Colors.black : 'transparent',
                }}
            />
            {
                result?.isLoading ? (
                    <Placeholder />
                ) :
                    (
                        <Formik
                            //@ts-ignore
                            innerRef={ref}
                            initialValues={{
                                task: '',
                                projectName: '',
                                date: SubmittedworklogData?.date
                                    ? moment(SubmittedworklogData.date, 'DD-MM-YYYY').toDate()
                                    : new Date(),
                                hour: SubmittedworklogData?.hours?.toString() || '',
                                description: SubmittedworklogData?.description || '',
                                workStatus: ''
                            }}
                            validationSchema={validationSchema}
                            onSubmit={(values: any) => handleSaveWorklog(values)}
                        >
                            {({ handleSubmit, handleChange, handleBlur, setFieldValue, values, errors, touched, submitCount }) => {

                                return (
                                    <>
                                        {submitCount > 0 && Object.keys(errors).length > 0 && (
                                            <View style={styles(isDark).formErrorBox}>
                                                <Text style={styles(isDark).formErrorText}>{errors[Object.keys(errors)[0]]}</Text>
                                            </View>
                                        )}
                                        <CustomTextInput
                                            label="ProjectName"
                                            value={worklogData?.project?.name}
                                            secureTextEntry={false}
                                            lefticon={false}
                                            onChangeText={handleChange('projectName')}
                                            onBlur={handleBlur('projectName')}
                                            editable={true}
                                            style={[styles(isDark).input]}
                                            numberOfLines={3}
                                            readOnly={true}
                                        />
                                        <CustomTextInput
                                            label="Task"
                                            value={worklogData?.title}
                                            secureTextEntry={false}
                                            lefticon={false}
                                            onChangeText={handleChange('task')}
                                            onBlur={handleBlur('task')}
                                            editable={true}
                                            style={[styles(isDark).input]}
                                            numberOfLines={3}
                                            readOnly={true}
                                        />
                                        <CustomTextInput
                                            label="Hour"
                                            value={values.hour || SubmittedworklogData?.hours.toString()}
                                            secureTextEntry={false}
                                            lefticon={false}
                                            onChangeText={handleChange('hour')}
                                            onBlur={handleBlur('hour')}
                                            editable={true}
                                            style={[styles(isDark).input]}
                                            keyboardType="numeric"
                                        // maxLength={2}
                                        />
                                        <CustomTextInput
                                            label="Description"
                                            value={values.description || SubmittedworklogData?.description}
                                            secureTextEntry={false}
                                            lefticon={false}
                                            onChangeText={handleChange('description')}
                                            onBlur={handleBlur('description')}
                                            editable={true}
                                            style={[styles(isDark).input]}
                                            contentStyle={{ height: 80, paddingBottom: 10 }}
                                            multiline={true}
                                        />
                                        <CustomTextInput
                                            label="date"
                                            value={moment(values.date).format('YYYY-MM-DD')}
                                            secureTextEntry={false}
                                            onChangeText={handleChange('date')}
                                            lefticon={false}
                                            rightIconName={'calendar'}
                                            onPress={() => showDatepickerDate()}
                                            onBlur={handleBlur('date')}
                                            editable={true}
                                            readOnly={true}
                                            style={[styles(isDark).input]}
                                            numberOfLines={3}
                                        />
                                        {showdate && (
                                            <DateTimePicker
                                                testID="dateTimePickerStart"
                                                value={new Date() || moment(values.date, 'DD-MM-YYYY').format('YYYY-MM-DD')}
                                                mode="date"
                                                display="default"
                                                onChange={(event: any, selectedDate: any) => {
                                                    if (selectedDate) {
                                                        const currentDate = selectedDate || values.date;
                                                        setFieldValue('date', currentDate);
                                                        setShowDate(false);
                                                    }
                                                }}
                                                minimumDate={moment().subtract(6, 'days').toDate()}
                                                maximumDate={moment().toDate()} />
                                        )}
                                        {
                                            (SubmittedworklogData?.worklogStatusName === 'Approved' || SubmittedworklogData?.worklogStatusName === 'Rejected') && (
                                                <>
                                                    <CustomTextInput
                                                        label="Approved By"
                                                        value={worklogDetails?.data?.approvedRejectedBy}
                                                        secureTextEntry={false}
                                                        lefticon={false}
                                                        onChangeText={handleChange('task')}
                                                        onBlur={handleBlur('task')}
                                                        editable={true}
                                                        style={[styles(isDark).input]}
                                                        numberOfLines={3}
                                                        readOnly={true}
                                                    />
                                                    <CustomTextInput
                                                        label="status"
                                                        value={worklogDetails?.data?.worklogStatusName}
                                                        secureTextEntry={false}
                                                        lefticon={false}
                                                        onChangeText={handleChange('task')}
                                                        onBlur={handleBlur('task')}
                                                        editable={true}
                                                        style={[styles(isDark).input]}
                                                        numberOfLines={3}
                                                        readOnly={true}
                                                    />
                                                    {SubmittedworklogData?.worklogStatusName === 'Rejected' && (<CustomTextInput
                                                        label="Reason for Rejection"
                                                        value={worklogDetails?.data?.reasonForRejection}
                                                        secureTextEntry={false}
                                                        lefticon={false}
                                                        onChangeText={handleChange('task')}
                                                        onBlur={handleBlur('task')}
                                                        editable={true}
                                                        contentStyle={{ height: 80, paddingBottom: 10 }}
                                                        style={[styles(isDark).input]}
                                                        numberOfLines={3}
                                                        readOnly={true}
                                                        multiline={true}
                                                    />)}
                                                    <CustomTextInput
                                                        label="Approved On"
                                                        value={worklogDetails?.data?.approvedRejectedOn}
                                                        secureTextEntry={false}
                                                        lefticon={false}
                                                        onChangeText={handleChange('task')}
                                                        onBlur={handleBlur('task')}
                                                        editable={true}
                                                        style={[styles(isDark).input]}
                                                        numberOfLines={3}
                                                        readOnly={true}
                                                    />
                                                </>
                                            )
                                        }

                                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginHorizontal: 16, marginTop: 30 }}>
                                            <Button mode="contained" onPress={() => { statusRef.current = 'draft', handleSubmit() }} buttonColor={Colors.primary} style={{ width: '48%' }}>
                                                Save As Draft
                                            </Button>

                                            <Button mode="contained" onPress={() => { statusRef.current = 'submitted', handleSubmit() }} buttonColor={Colors.primary} style={{ width: '48%' }}>
                                                Submit
                                            </Button>
                                        </View>
                                    </>
                                );
                            }}
                        </Formik>
                    )
            }
        </View>
    )
}

export default AddWorklog

const styles = (isDark: any) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: isDark ? Colors.black : Colors.white,
    },
    input: {
        marginTop: 7
    },
    errortxt: {
        color: Colors.error,
        marginLeft: 16,
        fontFamily: 'Lato-Regular'
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