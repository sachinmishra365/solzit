import { ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { useRef, useState } from 'react'
import CustomHeader from '../../../Components/CustomHeader'
import { Colors } from '../../../constants/Colors'
import { useSelector } from 'react-redux'
import { isDarkTheme } from '../../../AppStore/Reducers/appState'
import { useCreateNewTodoMutation, useGetAllUserStoriesByProjectIdQuery, useGetEmployeeByProjectIdQuery, useGetEmployeePriorityListQuery, useGetEmployeeProjectsListQuery, useGetEmployeeWorkStatusListQuery } from '../../../Services/workloglevel'
import { Formik } from 'formik';
import * as Yup from 'yup';
import CustomTextInput from '../../../Components/CustomTextInput'
import { Button, Menu } from 'react-native-paper'
import { skipToken } from '@reduxjs/toolkit/query/react'
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment'
import Placeholder from '../../Placeholder/Placeholder'


const AddToDo = ({ navigation }: any) => {
    const isDark = useSelector(isDarkTheme);
    const ref = useRef();
    const Assesstoken = useSelector((state: any) => state?.appState?.authToken);
    const accessToken = Assesstoken?.authToken?.accessToken;

    const [projectMenuVisible, setProjectMenuVisible] = useState(false);
    const [userStoryMenuVisible, setUserStoryMenuVisible] = useState(false);
    const [priorityMenuVisible, setPriorityMenuVisible] = useState(false);
    const [assigneeMenuVisible, setAssigneeMenuVisible] = useState(false);
    const [workStatusMenuVisible, setWorkStatusMenuVisible] = useState(false);
    const [showplannedStartDate, setShowPlannedStartDate] = useState(false);
    const [showplannedEndDate, setShowPlannedEndDate] = useState(false);
    const [readonly, SetReadonly] = useState(false);

    const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
    const [selectedUserStoryId, setSelectedUserStoryId] = useState<string | null>(null);
    const [selectedAsigneeId, setSelectedAsigneeId] = useState<string | null>(null);
    const [selectedPriorityId, setSelectedPriorityId] = useState<string | null>(null);

    const { data: projectsData, isLoading: isProjectsLoading } = useGetEmployeeProjectsListQuery({ accessToken: accessToken })
    const { data: UserStoriesByProjectId, isLoading: isUserStoriesLoading } = useGetAllUserStoriesByProjectIdQuery(selectedProjectId ? { projectId: selectedProjectId, accessToken: accessToken } : skipToken)
    const { data: UserPriority, isLoading: isUserPriority } = useGetEmployeePriorityListQuery({ accessToken: accessToken })
    const { data: WorkStatus, isLoading: isWorkStatus } = useGetEmployeeWorkStatusListQuery({ accessToken: accessToken })
    const { data: EmployeeByProjectId, isLoading: isEmployeeByProjectId } = useGetEmployeeByProjectIdQuery(selectedProjectId ? { projectId: selectedProjectId, accessToken: accessToken } : skipToken)
    const [CreateNewTodo, result] = useCreateNewTodoMutation();

    const handleCreateToDo = async (values: any) => {
        const data = {
            "createdBy": selectedAsigneeId,
            "title": values?.title,
            "projectId": selectedProjectId,
            "userStoryId": selectedUserStoryId,
            "implementationEffort": Number(values?.estimatedEffort),
            "assigneeId": selectedAsigneeId,
            "itemDescription": values?.itemDescription,
            "comment": '',
            "plannedStartDate": values?.plannedStartDate,
            "plannedEndDate": values?.plannedEndDate,
            "userPriority": {
                "value": selectedPriorityId,
                "label": values?.priority
            }
        }
        try {
            const response = await CreateNewTodo({ data, accessToken })
            if (response?.data?.messageDetail?.message_code === 201) {
                SetReadonly(true)
            }
            // console.log(JSON.stringify(response));
        } catch (err) {
            console.log(err);
        }
    }

    const validationSchema = Yup.object().shape({
        projectName: Yup.string().required('Project selection is required'),
        userStory: Yup.string().required('User Story is required'),
        title: Yup.string().required('Title is required').min(20, 'Title must be at least 20 characters'),
        itemDescription: Yup.string().required('Item Description is required').min(20, 'Item Description must be at least 20 characters'),
        estimatedEffort: Yup.number().typeError('Hour must be a number')
            .required('Estimated Effort is required')
            .max(16, 'Estimated Effort cannot be more than 16')
            .test('is-quarter-increment', 'Estimated Effort must be in 0.25 increments', (value) => {
                return value % 0.25 === 0;
            }),
        priority: Yup.string().required('Priority is required'),
        // workStatus: Yup.string().required('Work Status is required'),
        assignee: Yup.string().required('Assignee is required'),
        // comment: Yup.string().required('Comment is required'),
        plannedStartDate: Yup.date().required('Planned Start Date is required'),
        plannedEndDate: Yup.date().required('Planned End Date is required'),
    });

    const showDatepickerplannedStartDate = () => { setShowPlannedStartDate(true); };
    const showDatepickerplannedEndDate = () => { setShowPlannedEndDate(true); };

    return (
        <View style={styles(isDark).container}>
            <CustomHeader
                showBackIcon={true}
                title="WorkLogs"
                onPress={() => navigation.goBack()}
            />
            <View
                style={{
                    borderWidth: 1, height: 1,
                    backgroundColor: isDark ? Colors.white : 'transparent',
                    borderColor: isDark ? Colors.black : 'transparent',
                }}
            />
            {
                result.isLoading ? (
                    <Placeholder />
                ) :
                    (
                        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }} >
                            <Formik
                                //@ts-ignore
                                innerRef={ref}
                                initialValues={{
                                    projectName: '',
                                    userStory: '',
                                    title: '',
                                    itemDescription: '',
                                    priority: '',
                                    assignee: '',
                                    estimatedEffort: '',
                                    // workStatus: '',
                                    // comment: '',
                                    plannedStartDate: moment().format('YYYY-MM-DD'),
                                    plannedEndDate: moment().format('YYYY-MM-DD'),
                                }}
                                validationSchema={validationSchema}
                                onSubmit={(values) => handleCreateToDo(values)}
                            >
                                {({ handleSubmit, handleChange, handleBlur, setFieldValue, values, errors, touched, submitCount }) => {
                                    return (
                                        <>
                                            {submitCount > 0 && Object.keys(errors).length > 0 && (
                                                //@ts-ignore
                                                <View style={styles(isDark).formErrorBox}>
                                                    <Text style={styles(isDark).formErrorText}>{errors[Object.keys(errors)[0]]}</Text>
                                                </View>
                                            )}
                                            <Menu
                                                visible={projectMenuVisible}
                                                onDismiss={() => setProjectMenuVisible(false)}
                                                anchor={
                                                    <CustomTextInput
                                                        label="Project Name"
                                                        value={values.projectName}
                                                        onChangeText={(text: any) => setFieldValue('projectName', text)}
                                                        lefticon={false}
                                                        style={[styles(isDark).input]}
                                                        rightIconName={'chevron-down'}
                                                        onPress={() => setProjectMenuVisible(true)}
                                                        editable={false}
                                                        readOnly={readonly}
                                                    />
                                                }
                                                style={{ marginHorizontal: 16, }}
                                                contentStyle={{ backgroundColor: isDark ? Colors.gray : Colors.white }}
                                                statusBarHeight={60}
                                            >
                                                {projectsData?.data?.map((item: any) => (
                                                    <Menu.Item
                                                        key={item.id}
                                                        onPress={() => {
                                                            setFieldValue('projectName', item.projectName);
                                                            setProjectMenuVisible(false);
                                                            setSelectedProjectId(item?.id)
                                                            setFieldValue('userStory', '')
                                                            setFieldValue('assignee', '')
                                                        }}
                                                        title={item.projectName}
                                                    />
                                                ))}
                                            </Menu>

                                            <Menu
                                                visible={userStoryMenuVisible}
                                                onDismiss={() => setUserStoryMenuVisible(false)}
                                                anchor={
                                                    <CustomTextInput
                                                        label="User Story"
                                                        value={values.userStory}
                                                        onChangeText={(text: any) => setFieldValue('userStory', text)}
                                                        lefticon={false}
                                                        style={[styles(isDark).input]}
                                                        rightIconName={'chevron-down'}
                                                        onPress={() => setUserStoryMenuVisible(true)}
                                                        editable={false}
                                                        readOnly={true}
                                                    />
                                                }
                                                style={{ marginHorizontal: 16 }}
                                                contentStyle={{ backgroundColor: isDark ? Colors.gray : Colors.white }}
                                                statusBarHeight={60}
                                            >
                                                {UserStoriesByProjectId?.data?.length > 0 ? (
                                                    UserStoriesByProjectId.data.map((item: any) => (
                                                        <Menu.Item
                                                            key={item.id}
                                                            onPress={() => {
                                                                setFieldValue('userStory', item.title);
                                                                setUserStoryMenuVisible(false);
                                                                setSelectedUserStoryId(item?.id)
                                                            }}
                                                            title={item.title}
                                                        />
                                                    ))
                                                ) : (
                                                    <Text style={{ padding: 10, textAlign: 'center', color: 'gray' }}>No Data Available</Text>
                                                )}
                                            </Menu>

                                            {/* <Menu
                                    visible={workStatusMenuVisible}
                                    onDismiss={() => setWorkStatusMenuVisible(false)}
                                    anchor={
                                        <CustomTextInput
                                            label="Work Status"
                                            value={values.workStatus}
                                            onChangeText={(text: any) => setFieldValue('workStatus', text)}
                                            lefticon={false}
                                            style={[styles(isDark).input]}
                                            rightIconName={'chevron-down'}
                                            onPress={() => setWorkStatusMenuVisible(true)}
                                            editable={false}
                                            readOnly={true}
                                        />
                                    }
                                    style={{ marginHorizontal: 16 }}
                                    contentStyle={{ backgroundColor: isDark ? Colors.gray : Colors.white, maxHeight: 300, }}
                                    statusBarHeight={60}
                                >
                                    <ScrollView>
                                        {
                                            WorkStatus?.data.map((item: any) => (
                                                <Menu.Item
                                                    key={item.value}
                                                    onPress={() => {
                                                        setFieldValue('workStatus', item?.label);
                                                        setWorkStatusMenuVisible(false);
                                                        // setSelectedUserStoryId(item?.id)
                                                    }}
                                                    title={item?.label}
                                                />
                                            ))
                                        }
                                    </ScrollView>
                                </Menu>
                                 */}
                                            <CustomTextInput
                                                label="Title"
                                                value={values.title}
                                                secureTextEntry={false}
                                                lefticon={false}
                                                onChangeText={handleChange('title')}
                                                onBlur={handleBlur('title')}
                                                editable={true}
                                                style={[styles(isDark).input]}
                                                contentStyle={{ height: 80, paddingBottom: 10 }}
                                                numberOfLines={3}
                                                multiline={true}
                                            />

                                            <CustomTextInput
                                                label="Item Description"
                                                value={values.itemDescription}
                                                secureTextEntry={false}
                                                lefticon={false}
                                                onChangeText={handleChange('itemDescription')}
                                                onBlur={handleBlur('itemDescription')}
                                                editable={true}
                                                style={[styles(isDark).input]}
                                                contentStyle={{ height: 80, paddingBottom: 10 }}
                                                numberOfLines={3}
                                                multiline={true}
                                            />

                                            <CustomTextInput
                                                label="Estimated Effort"
                                                value={values.estimatedEffort}
                                                secureTextEntry={false}
                                                lefticon={false}
                                                onChangeText={handleChange('estimatedEffort')}
                                                onBlur={handleBlur('estimatedEffort')}
                                                editable={true}
                                                style={[styles(isDark).input]}
                                                keyboardType="numeric"
                                            />

                                            <Menu
                                                visible={priorityMenuVisible}
                                                onDismiss={() => setPriorityMenuVisible(false)}
                                                anchor={
                                                    <CustomTextInput
                                                        label="Priority"
                                                        value={values.priority}
                                                        onChangeText={(text: any) => setFieldValue('priority', text)}
                                                        lefticon={false}
                                                        style={[styles(isDark).input]}
                                                        rightIconName={'chevron-down'}
                                                        onPress={() => setPriorityMenuVisible(true)}
                                                        editable={false}
                                                        readOnly={true}
                                                    />
                                                }
                                                style={{ marginHorizontal: 16 }}
                                                contentStyle={{ backgroundColor: isDark ? Colors.gray : Colors.white }}
                                                statusBarHeight={60}
                                            >
                                                {UserPriority?.data?.map((item: any) => (
                                                    <Menu.Item
                                                        key={item.value}
                                                        onPress={() => {
                                                            setFieldValue('priority', item.label);
                                                            setPriorityMenuVisible(false)
                                                            setSelectedPriorityId(item?.value)
                                                        }}
                                                        title={item.label}
                                                    />
                                                ))}
                                            </Menu>

                                            <Menu
                                                visible={assigneeMenuVisible}
                                                onDismiss={() => setAssigneeMenuVisible(false)}
                                                anchor={
                                                    <CustomTextInput
                                                        label="Assignee"
                                                        value={values.assignee}
                                                        onChangeText={(text: any) => setFieldValue('assignee', text)}
                                                        lefticon={false}
                                                        style={[styles(isDark).input]}
                                                        rightIconName={'chevron-down'}
                                                        onPress={() => setAssigneeMenuVisible(true)}
                                                        editable={false}
                                                        readOnly={true}
                                                    />
                                                }
                                                style={{ marginHorizontal: 16 }}
                                                contentStyle={{ backgroundColor: isDark ? Colors.gray : Colors.white }}
                                                statusBarHeight={60}
                                            >
                                                {EmployeeByProjectId?.data?.map((item: any) => (
                                                    <Menu.Item
                                                        key={item.id}
                                                        onPress={() => {
                                                            setFieldValue('assignee', item?.employee?.name);
                                                            setAssigneeMenuVisible(false)
                                                            setSelectedAsigneeId(item?.employee?.id)
                                                        }}
                                                        title={item?.employee?.name}
                                                    />
                                                ))}
                                            </Menu>

                                            {/* <CustomTextInput
                                    label="Comment"
                                    value={values.comment}
                                    secureTextEntry={false}
                                    lefticon={false}
                                    onChangeText={handleChange('comment')}
                                    onBlur={handleBlur('comment')}
                                    editable={true}
                                    style={[styles(isDark).input]}
                                    contentStyle={{ height: 80, paddingBottom: 10 }}
                                    numberOfLines={3}
                                    multiline={true}
                                /> */}

                                            <CustomTextInput
                                                label="Planned Start Date"
                                                value={values.plannedStartDate}
                                                secureTextEntry={false}
                                                lefticon={false}
                                                onChangeText={handleChange('plannedStartDate')}
                                                rightIconName={'calendar'}
                                                onPress={() => showDatepickerplannedStartDate()}
                                                onBlur={handleBlur('plannedStartDate')}
                                                editable={true}
                                                readOnly={true}
                                                style={[styles(isDark).input]}
                                                numberOfLines={3}
                                            />

                                            <CustomTextInput
                                                label="Planned End Date"
                                                value={values.plannedEndDate}
                                                secureTextEntry={false}
                                                onChangeText={handleChange('plannedEndDate')}
                                                lefticon={false}
                                                rightIconName={'calendar'}
                                                onPress={() => showDatepickerplannedEndDate()}
                                                onBlur={handleBlur('plannedEndDate')}
                                                editable={true}
                                                readOnly={true}
                                                style={[styles(isDark).input]}
                                                numberOfLines={3}
                                                multiline={true}
                                            />

                                            {showplannedStartDate && (
                                                <DateTimePicker
                                                    testID="dateTimePickerStart"
                                                    value={new Date() || values.plannedStartDate}
                                                    mode="date"
                                                    display="default"
                                                    onChange={(event, selectedDate) => {
                                                        if (selectedDate) {
                                                            setFieldValue('plannedStartDate', moment(selectedDate).format('YYYY-MM-DD'));
                                                            setShowPlannedStartDate(false);
                                                        }
                                                    }}
                                                />
                                            )}
                                            {showplannedEndDate && (
                                                <DateTimePicker
                                                    testID="dateTimePickerEnd"
                                                    value={new Date() || values.plannedEndDate}
                                                    mode="date"
                                                    display="default"
                                                    onChange={(event, selectedDate) => {
                                                        if (selectedDate) {
                                                            setFieldValue('plannedEndDate', moment(selectedDate).format('YYYY-MM-DD'));
                                                            setShowPlannedEndDate(false);
                                                        }
                                                    }}
                                                />
                                            )}
                                            <Button mode="contained" onPress={handleSubmit} style={{ marginTop: 20, marginHorizontal: 16 }} buttonColor={Colors.primary}>
                                                Submit
                                            </Button>
                                        </>
                                    );
                                }}
                            </Formik>
                        </ScrollView>
                    )
            }
        </View>
    )
}

export default AddToDo

const styles = (isDark: any) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: isDark ? Colors.black : Colors.white,
    },
    errortxt: {
        color: Colors.error,
        marginLeft: 16,
        fontFamily: 'Lato-Regular'
    },
    input: {
        marginTop: 5
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