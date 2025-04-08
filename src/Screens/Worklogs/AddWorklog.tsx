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
import { useSaveWorkLogMutation } from '../../Services/workloglevel'
import Placeholder from '../Placeholder/Placeholder'


const AddWorklog = ({ navigation, route }: any) => {
    const ref = useRef()
    const worklogData = route?.params?.item;
    const isDark = useSelector(isDarkTheme);
    const EmployeeId = useSelector((state: any) => state?.appState?.authToken?.userProfile);
    const Assesstoken = useSelector((state: any) => state?.appState?.authToken);
    const accessToken = Assesstoken?.authToken?.accessToken;
    const [status, setStatus] = useState('');

    const [showdate, setShowDate] = useState(false);

    const [saveworklog, result] = useSaveWorkLogMutation();

    const validationSchema = Yup.object().shape({
        description: Yup.string().required('Description is required').min(5, 'Description must be at least 20 characters'),
        hour: Yup.number()
            .typeError('Hour must be a number')
            .required('Hour is required')
            .max(16, 'Hour cannot be more than 16')
            .test('is-quarter-increment', 'Hour must be in 0.25 increments', (value) => {
                return value % 0.25 === 0;
            }),
    });

    const showDatepickerDate = () => { setShowDate(true); };

    const handleSaveWorklog = async (values: any) => {
        const data = {
            "projectId": worklogData?.project?.id,
            "todoID": worklogData?.id,
            "date": values?.date,
            "hours": Number(values?.hour),
            "workLogStatus": status === 'submitted' ? 674180001 : 674180000,
            "description": values?.description,
            "loggedBy": {
                "id": EmployeeId?.userId,
                "name": EmployeeId?.fullName
            },
            "workLogCategory": 0
        }

        try {
            const response = await saveworklog({ data, accessToken }).unwrap();
            if (response?.messageDetail?.message_code === 201) {
                Alert.alert('Success', 'Work log saved successfully!')
                setStatus('');
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
                rightIconPress={()=>navigation.navigate('WorklogDetails', { item: worklogData })}
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
                                date: moment().format('YYYY-MM-DD'),
                                hour: '',
                                description: '',
                                workStatus: ''
                            }}
                            validationSchema={validationSchema}
                            onSubmit={(values: any) => handleSaveWorklog(values)}
                        >
                            {({ handleSubmit, handleChange, handleBlur, setFieldValue, values, errors, touched }) => {
                                return (
                                    <>
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
                                            readonly={true}
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
                                            readonly={true}
                                        />
                                        <CustomTextInput
                                            label="Hour"
                                            value={values.hour}
                                            secureTextEntry={false}
                                            lefticon={false}
                                            onChangeText={handleChange('hour')}
                                            onBlur={handleBlur('hour')}
                                            editable={true}
                                            style={[styles(isDark).input]}
                                            keyboardType="numeric"
                                        // maxLength={2}
                                        />
                                        {touched.hour && errors.hour && (
                                            <Text style={styles(isDark).errortxt}>{errors.hour}</Text>
                                        )}
                                        <CustomTextInput
                                            label="Description"
                                            value={values.description}
                                            secureTextEntry={false}
                                            lefticon={false}
                                            onChangeText={handleChange('description')}
                                            onBlur={handleBlur('description')}
                                            editable={true}
                                            style={[styles(isDark).input]}
                                            contentStyle={{ height: 80, paddingBottom: 10 }}
                                            multiline={true}
                                        />
                                        {touched.description && errors.description && (
                                            <Text style={styles(isDark).errortxt}>{errors.description}</Text>
                                        )}
                                        <CustomTextInput
                                            label="date"
                                            value={values.date}
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
                                            multiline={true}
                                        />
                                        {showdate && (
                                            <DateTimePicker
                                                testID="dateTimePickerStart"
                                                value={new Date() || values.date}
                                                mode="date"
                                                display="default"
                                                onChange={(event: any, selectedDate: any) => {
                                                    if (selectedDate) {
                                                        setFieldValue('date', moment(selectedDate).format('YYYY-MM-DD'));
                                                        setShowDate(false);
                                                    }
                                                }}
                                                minimumDate={moment().subtract(6, 'days').toDate()}
                                                maximumDate={moment().toDate()} />
                                        )}
                                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginHorizontal: 16, marginTop: 30 }}>
                                            <Button mode="contained" onPress={() => {
                                                setStatus('draft');
                                                handleSubmit()
                                            }} buttonColor={Colors.primary} style={{ width: '48%' }}>
                                                Save As Draft
                                            </Button>

                                            <Button mode="contained" onPress={() => {
                                                setStatus('submitted');
                                                handleSubmit()
                                            }} buttonColor={Colors.primary} style={{ width: '48%' }}>
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
});