import { RefreshControl, StyleSheet, View, FlatList, Text } from 'react-native'
import React, { useEffect, useState } from 'react'
import WorklogCard from '../../Components/WorklogCard'
import CustomHeader from '../../Components/CustomHeader'
import { useGetToDoListBasedOnFilterMutation } from '../../Services/workloglevel'
import { useSelector } from 'react-redux'
import moment from 'moment'
import { Colors } from '../../constants/Colors'
import ShimmerPlaceHolder from '../Placeholder/ShimmerPlaceHolder'
import FilterWorklogs from './FilterWorklogs'
import { isDarkTheme } from '../../AppStore/Reducers/appState'
import WorkTypeDialog from './WorkTypeDialog'

const Worklog = ({ navigation }: any) => {
    const isDark = useSelector(isDarkTheme);
    const Assesstoken = useSelector((state: any) => state?.appState?.authToken);
    const accessToken = Assesstoken?.authToken?.accessToken;

    const [todoList, SetTodoList] = useState<any>([]);
    const [refreshing, setRefreshing] = useState(false);
    const [visible, setVisible] = React.useState(false);
    const [visibleWorkType, setVisibleWorkType] = React.useState(false);
    const [selectedId, setSelectedId] = useState<any>({ filterID: 3, itemTypeID: 0, label: "Items I'm Working On" });
    const [selectedItem, setSelectedItem] = useState<any>();
    console.log(selectedId);

    const [GetToDoList, { isLoading }] = useGetToDoListBasedOnFilterMutation();

    useEffect(() => {
        handleWorklogs(selectedId?.filterID, selectedId?.itemTypeID, selectedId?.label);
    }, []);

    const handleWorklogs = async (filterID: number, itemTypeID: number, label: string) => {
        setRefreshing(true);
        const body = {
            filterId: filterID,
            itemTypeId: itemTypeID,
            accessToken: accessToken,
        };
        try {
            const response = await GetToDoList(body).unwrap();
            SetTodoList(response?.data);
        } catch (err) {
            console.error("Error fetching worklogs:", err);
        } finally {
            setRefreshing(false);
        }
    };

    const onRefresh = () => {
        handleWorklogs(selectedId?.filterID, selectedId?.itemTypeID, selectedId?.label);
    };

    const handleSelect = (filterID: number, itemTypeID: number, label: string) => {
        console.log("Selected filterID:", filterID, "itemTypeID:", itemTypeID, label);
        setSelectedId({ filterID, itemTypeID, label });
        handleWorklogs(filterID, itemTypeID, label);
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
            iconPress={() => { setVisibleWorkType(!visibleWorkType), setSelectedItem(item) }}
            cardPress={'cardPress'}
        />
    );

    return (
        <View style={styles(isDark).container}>
            <CustomHeader
                showBackIcon={true}
                title="WorkLogs"
                onPress={() => navigation.goBack()}
                showFilterIcon={true}
                filterOnPress={() => setVisible(!visible)}
            />
            <View
                style={{
                    borderWidth: 1,
                    height: 1,
                    backgroundColor: isDark ? Colors.white : 'transparent',
                    borderColor: isDark ? Colors.black : 'transparent',
                }}
            />
            <Text style={styles(isDark).Filterlabel}>{selectedId?.label}</Text>
            <FilterWorklogs visible={visible} setVisible={setVisible} onSelect={handleSelect} />
            <WorkTypeDialog
                visibleWorkType={visibleWorkType}
                setVisibleWorkType={setVisibleWorkType}
                //@ts-ignore
                plannedStart={selectedItem?.toDoSubViewsDtos?.plannedStartDate ? moment(selectedItem?.toDoSubViewsDtos?.plannedStartDate, "MM/DD/YYYY HH:mm:ss").format("DD/MM/YYYY") : null}
                //@ts-ignore
                plannedEnd={selectedItem?.toDoSubViewsDtos?.plannedEndDate ? moment(selectedItem?.toDoSubViewsDtos?.plannedEndDate, "MM/DD/YYYY HH:mm:ss").format("DD/MM/YYYY") : null}
                //@ts-ignore
                actualStart={selectedItem?.toDoSubViewsDtos?.actualStartDate ? moment(selectedItem?.toDoSubViewsDtos?.actualStartDate, "MM/DD/YYYY HH:mm:ss").format("DD/MM/YYYY") : null}
                //@ts-ignore
                actualEnd={selectedItem?.toDoSubViewsDtos?.actualEndDate ? moment(item?.plannedStartDate, "MM/DD/YYYY HH:mm:ss").format("DD/MM/YYYY") : null}
                effort={selectedItem?.toDoSubViewsDtos?.implementationEffort}
                effortSpent={selectedItem?.toDoSubViewsDtos?.effortSpent}
                priority={selectedItem?.toDoSubViewsDtos?.userPriority?.label}
                sprint={selectedItem?.toDoSubViewsDtos?.sprint}
                parent={selectedItem?.toDoSubViewsDtos?.userStoryTitle}
            />
            {isLoading ? (
                <ShimmerPlaceHolder />
            ) : (
                <FlatList
                    data={todoList}
                    renderItem={renderItem}
                    keyExtractor={(item: any, index: any) => item?.id.toString() + index}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[Colors?.primary]} />
                    }
                    ListFooterComponent={<View style={{ height: 100 }} />}
                />
            )}
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
    divider: {
        backgroundColor: Colors.medium_gray,
        height: 1,
        marginVertical: 10
    },
});