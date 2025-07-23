import { RefreshControl, StyleSheet, View, FlatList, Text } from 'react-native'
import React, { useEffect, useState } from 'react'
import WorklogCard from '../../Components/WorklogCard'
import CustomHeader from '../../Components/CustomHeader'
import { useGetActiveItemsInMyProjectQuery, useGetGeneralTaskListInMyProjectQuery, useGetToDoListBasedOnFilterMutation } from '../../Services/workloglevel'
import { useDispatch, useSelector } from 'react-redux'
import moment from 'moment'
import { Colors } from '../../constants/Colors'
import ShimmerPlaceHolder from '../Placeholder/ShimmerPlaceHolder'
import FilterWorklogs from './FilterWorklogs'
import { isDarkTheme, setToDo, SetWorklogDetails } from '../../AppStore/Reducers/appState'
import WorkTypeDialog from './WorkTypeDialog'
import { FAB } from 'react-native-paper'
import CustomTextInput from '../../Components/CustomTextInput'
import ToastMessage from '../../Components/ToastMessage'
import EmptyData from '../../Components/EmptyData'

const Worklog = ({ navigation }: any) => {
    const isDark = useSelector(isDarkTheme);
    const dispatch = useDispatch();
    const Assesstoken = useSelector((state: any) => state?.appState?.authToken);
    const accessToken = Assesstoken?.authToken?.accessToken;

    const [todoList, SetTodoList] = useState<any>([]);
    const [refreshing, setRefreshing] = useState(false);
    const [visible, setVisible] = React.useState(false);
    const [visibleWorkType, setVisibleWorkType] = React.useState(false);
    const [selectedId, setSelectedId] = useState<any>({ filterID: 3, itemTypeID: 0, label: "Items I'm Working On" });
    const [selectedItem, setSelectedItem] = useState<any>();
    const [generalTask, SetGeneralTask] = useState<any>([]);
    const [myProjectItem, SetMyProjectItem] = useState<any>([]);
    const [searchQuery, setSearchQuery] = useState('');

    const { data: GeneralTask, isLoading: isProjectsLoading } = useGetGeneralTaskListInMyProjectQuery({ accessToken: accessToken })
    const { data: ActiveItemsInMyProject, isLoading: isActiveItemsInMyProject } = useGetActiveItemsInMyProjectQuery({ accessToken: accessToken })

    const [GetToDoList, { isLoading }] = useGetToDoListBasedOnFilterMutation();


    useEffect(() => {
        handleWorklogs(selectedId?.filterID, selectedId?.itemTypeID, selectedId?.label);
    }, []);

    const filterData = (data: any) => {      
        return data?.filter((item: any) =>
            item?.project?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item?.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item?.itemNumber?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item?.workStatus?.label?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item?.itemType?.label?.toLowerCase().includes(searchQuery.toLowerCase())
        );
    };

    const filteredList = [
        ...filterData(todoList),
        ...filterData(generalTask),
        ...filterData(myProjectItem)
    ];


    const handleGeneralTask = () => {
        if (GeneralTask?.data !== undefined) {
            SetGeneralTask(GeneralTask?.data)
            SetTodoList([]);
            SetMyProjectItem([]);
        }
    }
    const handleMyProjectActiveItem = () => {
        if (ActiveItemsInMyProject?.data !== undefined) {
            SetMyProjectItem(ActiveItemsInMyProject?.data)
            SetTodoList([]);
            SetGeneralTask([]);
        }
    }

    const handleWorklogs = async (filterID: number, itemTypeID: number, label: string) => {
        setRefreshing(true);
        const body = { filterId: filterID, itemTypeId: itemTypeID, accessToken: accessToken, };
        SetGeneralTask([]);
        SetMyProjectItem([]);
        SetTodoList([]);
        try {
            const response = await GetToDoList(body).unwrap();
            if (response?.isSuccessful) {
                SetTodoList(response?.data);
            }

        } catch (err) {
            ToastMessage({ type: "error", title: "Error", subtitle: "Something went wrong" });
        } finally {
            setRefreshing(false);
        }
    };


    const onRefresh = () => {
        handleWorklogs(selectedId?.filterID, selectedId?.itemTypeID, selectedId?.label);
        SetGeneralTask([]);
        SetMyProjectItem([]);
        dispatch(setToDo(''));

    };

    const handleSelect = (filterID: number, itemTypeID: number, label: string) => {
        setSelectedId({ filterID, itemTypeID, label });
        handleWorklogs(filterID, itemTypeID, label);
        SetGeneralTask([]);
        SetMyProjectItem([]);
    };


    const renderItem = ({ item }: any) => (
        <WorklogCard
            projectName={item?.project?.name}
            serialNo={item?.itemNumber}
            title={item?.title}
            startDate={item?.plannedStartDate ? moment(item?.plannedStartDate, "MM/DD/YYYY HH:mm:ss").format("DD/MM/YYYY") : null}
            endDate={item?.plannedEndDate ? moment(item?.plannedEndDate, "MM/DD/YYYY HH:mm:ss").format('DD/MM/YYYY') : null}
            status={item?.workStatus?.label}
            iconName={item?.itemType?.label === 'To-Do' ? "checkbox-outline" : item?.itemType?.label === 'User Story' ? 'book' : 'bug'}
            iconColor={item?.itemType?.label === 'To-Do' ? "green" : item?.itemType?.label === 'User Story' ? Colors.secondary : item?.itemType?.label === 'Bug' ? Colors.error : null}
            rightIconName="eye"
            rightIconColor={Colors.primary}
            rightIconPress={() => { item?.itemType?.label === 'User Story' ? navigation.navigate('BugDetails', { item }) : navigation.navigate('WorklogDetails', { item }), dispatch(SetWorklogDetails(item)) }}
            rightIconColor2={Colors.green}
            showRightIcon2={(item?.workStatus?.label === 'Work In Progress' || item?.workStatus?.label === 'Review Failed') ? true : false}
            rightIconName2={item?.itemType?.label !== 'User Story' && "plus-circle-outline"}
            // item?.workStatus?.label === 'Review Failed' ? navigation.navigate('AddBug')
            rightIconPress2={() => { item?.workStatus?.label === 'Work In Progress'  && navigation.navigate('AddWorklog') , dispatch(SetWorklogDetails(item)) }}
            // rightIconColor3={Colors.green}
            // showRightIcon3={true}
            // rightIconName3="pencil-circle-outline"
            // rightIconPress3={() => { navigation.navigate('AddToDo'), dispatch(SetWorklogDetails(item)) }}
            cardPress={() => { setVisibleWorkType(!visibleWorkType), setSelectedItem(item) }}
        />
    );

    return (
        <View style={styles(isDark).container}>
            <CustomHeader
                showBackIcon={true}
                title={generalTask.length ? 'General Task' : myProjectItem.length ? 'Active Item in My Project' : selectedId?.label}
                onPress={() => navigation.goBack()}
                showFilterIcon={true}
                filterOnPress={() => setVisible(!visible)}
            />
            <CustomTextInput
                label="Search"
                value={searchQuery}
                secureTextEntry={false}
                lefticon={true}
                leftIconName="magnify"
                onChangeText={(text: any) => setSearchQuery(text)}
                onBlur={() => { }}
                editable={true}
                numberOfLines={3}
                multiline={true}
            />
            <FilterWorklogs visible={visible} setVisible={setVisible} onSelect={handleSelect} onPressGeneral={handleGeneralTask} onPressProjectItem={handleMyProjectActiveItem} />
            <WorkTypeDialog
                visibleWorkType={visibleWorkType}
                setVisibleWorkType={setVisibleWorkType}
                plannedStart={selectedItem?.toDoSubViewsDtos?.plannedStartDate ? moment(selectedItem?.toDoSubViewsDtos?.plannedStartDate, "MM/DD/YYYY HH:mm:ss").format("DD/MM/YYYY") : null}
                plannedEnd={selectedItem?.toDoSubViewsDtos?.plannedEndDate ? moment(selectedItem?.toDoSubViewsDtos?.plannedEndDate, "MM/DD/YYYY HH:mm:ss").format("DD/MM/YYYY") : null}
                actualStart={selectedItem?.toDoSubViewsDtos?.actualStartDate ? moment(selectedItem?.toDoSubViewsDtos?.actualStartDate, "MM/DD/YYYY HH:mm:ss").format("DD/MM/YYYY") : null}
                actualEnd={selectedItem?.toDoSubViewsDtos?.actualEndDate ? moment(selectedItem?.toDoSubViewsDtos?.actualEndDate, "MM/DD/YYYY HH:mm:ss").format("DD/MM/YYYY") : null}
                effort={selectedItem?.toDoSubViewsDtos?.implementationEffort}
                effortSpent={selectedItem?.toDoSubViewsDtos?.effortSpent}
                priority={selectedItem?.toDoSubViewsDtos?.userPriority?.label}
                sprint={selectedItem?.toDoSubViewsDtos?.sprint?.name}
                parent={selectedItem?.toDoSubViewsDtos?.userStoryTitle}
            />
            {isLoading ? (
                <ShimmerPlaceHolder />
            ) :
                filteredList.length === 0 ? (
                    <EmptyData />
                )
                    :
                    <FlatList
                        data={filteredList}
                        // data={[...(todoList ?? []), ...(generalTask ?? []), ...(myProjectItem ?? [])]}
                        renderItem={renderItem}
                        keyExtractor={(item: any, index: any) => item?.id?.toString() + index}
                        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[Colors?.primary]} />}
                        ListFooterComponent={<View style={{ height: 100 }} />}
                        showsVerticalScrollIndicator={false}

                    />}
            {/* <FAB
                style={styles(isDark).fab}
                color={Colors.white}
                onPress={() => navigation.navigate('AddToDo')}
                accessibilityLabel="Add To-Do"
                icon="plus"
            /> */}
        </View>
    );
};

export default Worklog;

const styles = (isDark: any) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: isDark ? Colors.black : Colors.white,
    },
    Filterlabel: {
        fontSize: 16,
        fontFamily: 'Lato-Bold',
        color: isDark ? Colors.white : Colors.black,
        marginVertical: 10,
        marginHorizontal: 16
    },
    fab: {
        position: 'absolute',
        right: 32,
        bottom: 52,
        backgroundColor: isDark ? Colors.gray : Colors.primary,
        elevation: 10,
    },
});