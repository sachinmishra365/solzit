import { Alert, BackHandler, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import CustomHeader from '../../../Components/CustomHeader'
import { Colors } from '../../../constants/Colors'
import { useDispatch, useSelector } from 'react-redux'
import { isDarkTheme, SetWorklogDetails } from '../../../AppStore/Reducers/appState'
import { useCreateNewBugMutation, useCreateNewTodoMutation, useEditBugMutation, useEditTodoMutation, useGetAllUserStoriesByProjectIdQuery, useGetEmployeeByProjectIdQuery, useGetEmployeePriorityListQuery, useGetEmployeeProjectsListQuery, useGetEmployeeWorkStatusListQuery, useGetToDoDetailsByToDoIdQuery } from '../../../Services/workloglevel'
import { Formik } from 'formik';
import * as Yup from 'yup';
import CustomTextInput from '../../../Components/CustomTextInput'
import { Button, Menu } from 'react-native-paper'
import { skipToken } from '@reduxjs/toolkit/query/react'
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment'
import Placeholder from '../../Placeholder/Placeholder'
import { Not_Started, In_Progress, Completed, Bug_In_Progress, BugCompleted, ReviewFailed } from '../../../constants/WorkStatuses'
import ToastMessage from '../../../Components/ToastMessage'


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

const AddToDo = ({ navigation }: any) => {
    const isDark = useSelector(isDarkTheme);
    const disptch = useDispatch()
    const ref = useRef();
    const Assesstoken = useSelector((state: any) => state?.appState?.authToken);
    const accessToken = Assesstoken?.authToken?.accessToken;
    const worklogData = useSelector((state: any) => state?.appState?.worklogDetails);

    const [projectMenuVisible, setProjectMenuVisible] = useState(false);
    const [userStoryMenuVisible, setUserStoryMenuVisible] = useState(false);
    const [priorityMenuVisible, setPriorityMenuVisible] = useState(false);
    const [assigneeMenuVisible, setAssigneeMenuVisible] = useState(false);
    const [workStatusMenuVisible, setWorkStatusMenuVisible] = useState(false);
    const [showplannedStartDate, setShowPlannedStartDate] = useState(false);
    const [showplannedEndDate, setShowPlannedEndDate] = useState(false);

    const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
    const [selectedUserStoryId, setSelectedUserStoryId] = useState<string | null>(null);
    const [selectedAsigneeId, setSelectedAsigneeId] = useState<string | null>(null);
    const [selectedPriorityId, setSelectedPriorityId] = useState<string | null>(null);
    const [selectedWorkStatusId, setSelectedWorkStatusId] = useState<string | null>(null);

    const { data: projectsData, isLoading: isProjectsLoading } = useGetEmployeeProjectsListQuery({ accessToken: accessToken })
    const { data: UserStoriesByProjectId, isLoading: isUserStoriesLoading } = useGetAllUserStoriesByProjectIdQuery(selectedProjectId ? { projectId: selectedProjectId, accessToken: accessToken } : { projectId: worklogData?.project?.id, accessToken: accessToken }, { skip: !selectedProjectId && !worklogData?.project?.id })
    const { data: UserPriority, isLoading: isUserPriority } = useGetEmployeePriorityListQuery({ accessToken: accessToken })
    const { data: WorkStatus, isLoading: isWorkStatus } = useGetEmployeeWorkStatusListQuery({ accessToken: accessToken })
    const { data: EmployeeByProjectId, isLoading: isEmployeeByProjectId } = useGetEmployeeByProjectIdQuery(selectedProjectId ? { projectId: selectedProjectId, accessToken: accessToken } : { projectId: worklogData?.project?.id, accessToken: accessToken }, { skip: !selectedProjectId && !worklogData?.project?.id })
    // const { data: TodoDetailById, isLoading: isTodoDetailById,refetch } = useGetToDoDetailsByToDoIdQuery(newToDoId && accessToken ? { ItemId: newToDoId, accessToken: accessToken } : skipToken)
    const { data: TodoDetailById, isLoading: isTodoDetailById, refetch } = useGetToDoDetailsByToDoIdQuery(worklogData?.id && accessToken ? { ItemId: worklogData?.id, accessToken: accessToken } : skipToken)

    const [CreateNewTodo, result] = useCreateNewTodoMutation();
    const [CreateNewBug, response] = useCreateNewBugMutation();
    const [updateTODO,] = useEditTodoMutation();
    const [updateBug] = useEditBugMutation();

    useEffect(() => {
        const backAction = () => {
            disptch(SetWorklogDetails([]))
            navigation.goBack();
            return true;
        };
        const backHandler = BackHandler.addEventListener(
            'hardwareBackPress',
            backAction,
        );
        return () => backHandler.remove();
    }, []);

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
                // Alert.alert('Success', 'ToDo Created successfully!')
                ToastMessage({ type: "success", title: "To-Do", subtitle: "ToDo Created successfully!" });
                await navigation.goBack()
                await refetch()
            }
        } catch (err) {
            console.log(err);
        }
    }
    const handleCreateBug = async (values: any) => {
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
            const response = await CreateNewBug({ data, accessToken })

            if (response?.data?.messageDetail?.message_code === 201) {
                // Alert.alert('Success', 'Bug Created successfully!')
                ToastMessage({ type: "success", title: "Bug", subtitle: "Bug Created successfully!" });
                await navigation.goBack()
                await refetch()
            }
        } catch (err) {
            console.log(err);
        }
    }

    const handleEditToDo = async (values: any) => {
        const data = {
            "toDoId": worklogData?.id,
            "comment": values.comment,
            "duplicateTaskId": null,
            "workStatus": {
                "value": selectedWorkStatusId,
                "label": values.workStatus
            }
        }
        try {
            const response = await updateTODO({ data, accessToken })
            if (response?.data?.isSuccessful) {
                navigation.goBack()
                refetch()
            }
        } catch (err) {
            console.log(err);
        }
    }
    const handleEditBug = async (values: any) => {
        const data = {
            "bugId": worklogData?.id,
            "plannedStartDate": values.plannedStartDate,
            "plannedEndDate": values.plannedEndDate,
            "implementationEffort": Number(values?.estimatedEffort),
            "comment": values.comment,
            "reproSteps": "Repro",
            "workStatus": {
                "value": selectedWorkStatusId,
                "label": values.workStatus
            },
            "assigneeId": selectedAsigneeId,
            "duplicateTaskId": null
        }
        try {
            const response = await updateBug({ data, accessToken })
            if (response?.data?.isSuccessful) {
                navigation.goBack()
                refetch()
            }
        } catch (err) {
            console.log(err);
        }
    }

    const showDatepickerplannedStartDate = () => { setShowPlannedStartDate(true); };
    const showDatepickerplannedEndDate = () => { setShowPlannedEndDate(true); };

    return (
        <View style={styles(isDark).container}>
            <CustomHeader
                showBackIcon={true}
                title="Add To Do"
                onPress={() => { navigation.goBack(), disptch(SetWorklogDetails([])) }}
            />
            {
                (result.isLoading || isTodoDetailById) ? (
                    <Placeholder />
                ) :
                    (
                        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }} >
                            <Formik
                                //@ts-ignore
                                innerRef={ref}
                                initialValues={{
                                    projectName: TodoDetailById?.data?.projectName || '',
                                    userStory: TodoDetailById?.data?.userStory?.name || '',
                                    title: TodoDetailById?.data?.title || '',
                                    itemDescription: TodoDetailById?.data?.description || '',
                                    estimatedEffort: TodoDetailById?.data?.implementationeffort.toString() || '',
                                    priority: TodoDetailById?.data?.userPriority?.label || '',
                                    assignee: TodoDetailById?.data?.assignee?.name || '',
                                    workStatus: TodoDetailById?.data?.workStatus?.label || '',
                                    comment: TodoDetailById?.data?.comments || '',
                                    plannedStartDate: moment().format('YYYY-MM-DD'),
                                    plannedEndDate: moment().format('YYYY-MM-DD'),
                                }}
                                validationSchema={validationSchema}
                                onSubmit={(values) => {
                                    if (worklogData?.id) {
                                        if (
                                            values.workStatus === 'On Hold' ||
                                            values.workStatus === 'Duplicate' ||
                                            values.workStatus === 'Needs Clarification'
                                        ) {
                                            if (!values.comment?.trim()) {
                                                return;
                                            }
                                        }
                                        if (worklogData?.itemType?.label === 'Bug') {
                                            handleEditBug(values);
                                        } else if (worklogData?.itemType?.label === 'Task') {
                                            handleEditToDo(values);
                                        }
                                        handleEditToDo(values);
                                    }
                                    else {
                                        if (worklogData?.itemType?.label === 'User Story') {
                                            handleCreateBug(values)
                                        } else if (worklogData?.itemType?.label === 'Task') {
                                            handleCreateToDo(values)
                                        }
                                        handleCreateToDo(values)
                                    }
                                }}
                            >
                                {({ handleSubmit, handleChange, handleBlur, setFieldValue, values, errors, touched, submitCount }) => {
                                    return (
                                        <>
                                            {submitCount > 0 && Object.keys(errors).length > 0 && (
                                                <View style={styles(isDark).formErrorBox}>
                                                    <Text style={styles(isDark).formErrorText}>
                                                        {//@ts-ignore
                                                            errors[Object.keys(errors)[0]]
                                                        }
                                                    </Text>
                                                </View>
                                            )}
                                            {(values.workStatus === 'On Hold' || values.workStatus === 'Duplicate' || values.workStatus === 'Needs Clarification') &&
                                                (<View style={styles(isDark).formErrorBox}>
                                                    <Text style={styles(isDark).formErrorText}>{'comment is required.'}</Text>
                                                </View>)}
                                            <Menu
                                                visible={projectMenuVisible}
                                                onDismiss={() => setProjectMenuVisible(false)}
                                                anchor={
                                                    <Pressable onPress={() => setProjectMenuVisible(true)} disabled={worklogData?.id ? true : false}  >
                                                        <CustomTextInput
                                                            label="Project Name"
                                                            value={values.projectName}
                                                            onChangeText={(text: any) => setFieldValue('projectName', text)}
                                                            lefticon={false}
                                                            style={[styles(isDark).input]}
                                                            rightIconName={'chevron-down'}
                                                            onPress={() => { worklogData?.id ? null : setProjectMenuVisible(true) }}
                                                            editable={false}
                                                            readOnly={true}
                                                            keyboardType={'none'}
                                                        />
                                                    </Pressable>
                                                }
                                                contentStyle={{ backgroundColor: isDark ? Colors.gray : Colors.white }}
                                                statusBarHeight={70}
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
                                                        titleStyle={styles(isDark).txt}
                                                    />
                                                ))}
                                            </Menu>

                                            <Menu
                                                visible={userStoryMenuVisible}
                                                onDismiss={() => setUserStoryMenuVisible(false)}
                                                anchor={
                                                    <Pressable onPress={() => setUserStoryMenuVisible(true)} disabled={worklogData?.id ? true : false} >
                                                        <CustomTextInput
                                                            label="User Story"
                                                            value={values.userStory}
                                                            onChangeText={(text: any) => setFieldValue('userStory', text)}
                                                            lefticon={false}
                                                            style={[styles(isDark).input]}
                                                            rightIconName={'chevron-down'}
                                                            onPress={() => worklogData?.id ? null : setUserStoryMenuVisible(true)}
                                                            editable={false}
                                                            readOnly={true}
                                                        />
                                                    </Pressable>
                                                }
                                                contentStyle={{ backgroundColor: isDark ? Colors.gray : Colors.white }}
                                                statusBarHeight={70}
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
                                                            titleStyle={styles(isDark).txt}
                                                        />
                                                    ))
                                                ) : (
                                                    <Text style={[styles(isDark).txt, { padding: 10 }]}>No Data Available</Text>
                                                )}
                                            </Menu>
                                            <CustomTextInput
                                                label="Item Type"
                                                value={worklogData?.itemType?.label ? worklogData?.itemType?.label : 'To-Do'}
                                                // onChangeText={(text: any) => setFieldValue('userStory', text)}
                                                lefticon={false}
                                                style={[styles(isDark).input]}
                                                editable={false}
                                                readOnly={true}
                                            />

                                            {worklogData?.id &&
                                                (<Menu
                                                    visible={workStatusMenuVisible}
                                                    onDismiss={() => setWorkStatusMenuVisible(false)}
                                                    anchor={
                                                        <Pressable onPress={() => setWorkStatusMenuVisible(true)}  >
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
                                                        </Pressable>
                                                    }
                                                    contentStyle={{ backgroundColor: isDark ? Colors.gray : Colors.white, maxHeight: 300, }}
                                                    statusBarHeight={70}
                                                >
                                                    <ScrollView>
                                                        {
                                                            (worklogData?.workStatus?.label === 'Not Started' ? Not_Started :
                                                                worklogData?.workStatus?.label === 'Analyzing' ? worklogData?.itemType?.label === 'Bug' ? Bug_In_Progress : In_Progress :
                                                                    worklogData?.workStatus?.label === 'Work In Progress' ? worklogData?.itemType?.label === 'Bug' ? BugCompleted : Completed :
                                                                        worklogData?.workStatus?.label === 'Review Failed' ? ReviewFailed :
                                                                            []).map((item: any) => (
                                                                                <Menu.Item
                                                                                    key={item.value}
                                                                                    onPress={() => {
                                                                                        setFieldValue('workStatus', item?.label);
                                                                                        setWorkStatusMenuVisible(false);
                                                                                        setSelectedWorkStatusId(item?.value)
                                                                                    }}
                                                                                    title={item?.label}
                                                                                    titleStyle={styles(isDark).txt}
                                                                                />
                                                                            ))
                                                        }
                                                    </ScrollView>
                                                </Menu>)
                                            }

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
                                                readOnly={worklogData?.id ? true : false}

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
                                                readOnly={worklogData?.id ? true : false}
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
                                                readOnly={(TodoDetailById?.data?.workStatus?.label === 'Work In Progress' || TodoDetailById?.data?.workStatus?.label === 'Work Complete') ? true : false}
                                            />

                                            <Menu
                                                visible={priorityMenuVisible}
                                                onDismiss={() => setPriorityMenuVisible(false)}
                                                anchor={
                                                    <Pressable onPress={() => setPriorityMenuVisible(true)} disabled={worklogData?.id ? true : false}  >
                                                        <CustomTextInput
                                                            label="Priority"
                                                            value={values.priority}
                                                            onChangeText={(text: any) => setFieldValue('priority', text)}
                                                            lefticon={false}
                                                            style={[styles(isDark).input]}
                                                            rightIconName={'chevron-down'}
                                                            onPress={() => worklogData?.id ? null : setPriorityMenuVisible(true)}
                                                            editable={false}
                                                            readOnly={true}
                                                        />
                                                    </Pressable>
                                                }
                                                contentStyle={{ backgroundColor: isDark ? Colors.gray : Colors.white }}
                                                statusBarHeight={70}
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
                                                        titleStyle={styles(isDark).txt}
                                                    />
                                                ))}
                                            </Menu>

                                            <Menu
                                                visible={assigneeMenuVisible}
                                                onDismiss={() => setAssigneeMenuVisible(false)}
                                                anchor={
                                                    <Pressable onPress={() => setAssigneeMenuVisible(true)} disabled={worklogData?.id ? true : false} >
                                                        <CustomTextInput
                                                            label="Assignee"
                                                            value={values.assignee}
                                                            onChangeText={(text: any) => setFieldValue('assignee', text)}
                                                            lefticon={false}
                                                            style={[styles(isDark).input]}
                                                            rightIconName={'chevron-down'}
                                                            onPress={() => worklogData?.id ? null : setAssigneeMenuVisible(true)}
                                                            editable={false}
                                                            readOnly={true}
                                                        />
                                                    </Pressable>
                                                }
                                                contentStyle={{ backgroundColor: isDark ? Colors.gray : Colors.white }}
                                                statusBarHeight={70}
                                            >
                                                {
                                                    EmployeeByProjectId?.data?.length > 0 ? (EmployeeByProjectId?.data?.map((item: any) => (
                                                        <Menu.Item
                                                            key={item.id}
                                                            onPress={() => {
                                                                setFieldValue('assignee', item?.employee?.name);
                                                                setAssigneeMenuVisible(false)
                                                                setSelectedAsigneeId(item?.employee?.id)
                                                            }}
                                                            title={item?.employee?.name}
                                                            titleStyle={styles(isDark).txt}
                                                        />
                                                    )))
                                                        : (
                                                            <Text style={[styles(isDark).txt, { padding: 10 }]}>No Assignee Available</Text>
                                                        )}
                                            </Menu>

                                            {worklogData?.id &&
                                                (
                                                    <CustomTextInput
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
                                                    />
                                                )
                                            }

                                            <CustomTextInput
                                                label="Planned Start Date"
                                                value={values.plannedStartDate || TodoDetailById?.data?.plannedStartDate}
                                                secureTextEntry={false}
                                                lefticon={false}
                                                onChangeText={handleChange('plannedStartDate')}
                                                rightIconName={'calendar'}
                                                onPress={() => (TodoDetailById?.data?.workStatus?.label === 'Work In Progress' || TodoDetailById?.data?.workStatus?.label === 'Work Complete') ? null : showDatepickerplannedStartDate()}
                                                onBlur={handleBlur('plannedStartDate')}
                                                editable={true}
                                                readOnly={true}
                                                style={[styles(isDark).input]}
                                                numberOfLines={3}
                                            />

                                            <CustomTextInput
                                                label="Planned End Date"
                                                value={values.plannedEndDate || TodoDetailById?.data?.plannedEndDate}
                                                secureTextEntry={false}
                                                onChangeText={handleChange('plannedEndDate')}
                                                lefticon={false}
                                                rightIconName={'calendar'}
                                                onPress={() => (TodoDetailById?.data?.workStatus?.label === 'Work In Progress' || TodoDetailById?.data?.workStatus?.label === 'Work Complete') ? null : showDatepickerplannedEndDate()}
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
                                            <Button mode="contained"
                                                //@ts-ignore
                                                onPress={handleSubmit} style={{ marginTop: 20, marginHorizontal: 16 }} buttonColor={Colors.primary}>
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
        marginTop: 10
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
    txt: {
        fontSize: 15,
        fontFamily: 'Lato-Regular',
        color: isDark ? Colors.white : Colors.black
    }
});