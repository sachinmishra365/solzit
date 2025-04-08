import { FlatList, RefreshControl, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { isDarkTheme } from '../../AppStore/Reducers/appState';
import { Colors } from '../../constants/Colors';
import CustomHeader from '../../Components/CustomHeader';
import { useGetWorkLogsByEmpIdOnTodoQuery } from '../../Services/workloglevel';
import ShimmerPlaceHolder from '../Placeholder/ShimmerPlaceHolder';
import WorklogCard from '../../Components/WorklogCard';
import moment from 'moment';

const WorklogDetails = ({ navigation, route }: any) => {
    const isDark = useSelector(isDarkTheme);
    const worklogDetails = route?.params?.item;
    const Assesstoken = useSelector((state: any) => state?.appState?.authToken);
    const accessToken = Assesstoken?.authToken?.accessToken;

    const [workLogsDetailData, setWorkLogsDetailData] = useState([]);
    const [refreshing, setRefreshing] = useState(false);

    const { data: WorkLogsByEmpIdOnTodo, isSuccess, isLoading ,refetch} = useGetWorkLogsByEmpIdOnTodoQuery({ toDoId: worklogDetails?.id, accessToken: accessToken }, { skip: !worklogDetails?.id || !accessToken });

    useEffect(() => {
        if (isSuccess && WorkLogsByEmpIdOnTodo?.data) {
            try {
                setWorkLogsDetailData(WorkLogsByEmpIdOnTodo?.data);
            } catch (err) {
                console.error('Error in success handler:', err);
            }
        }
    }, [WorkLogsByEmpIdOnTodo]);

    const renderItem = ({ item }: any) => (
        <WorklogCard
            projectName={item?.project}
            // serialNo={item?.itemNumber}
            title={item?.description}
            startDate={item?.date ? moment(item?.date, "MM/DD/YYYY HH:mm:ss").format("DD/MM/YYYY") : null}
            status={item?.worklogStatusName}
            iconName={item?.worklogStatusName === 'New' ? 'pencil-box-outline' : 'cloud-upload-outline'}
            iconColor={Colors.primary}
            showRightIcon={item?.worklogStatusName === 'Submitted for approval' ? false :true}
            rightIconName="delete-outline"
            rightIconColor={Colors.error}
            iconPress={() => { }}
            rightIconPress={() => navigation.navigate('WorklogDetails', { item })}
            cardPress={() => { item?.workStatus?.label === 'Work In Progress' && navigation.navigate('AddWorklog', { item }) }}
        />
    );

    const onRefresh = async () => {
        setRefreshing(true);
        try {
            await refetch(); 
        } catch (err) {
            console.error('Refetch error:', err);
        } finally {
            setRefreshing(false);
        }
    };
    

    return (
        <View style={styles(isDark).container}>
            <CustomHeader
                showBackIcon={true}
                title={'Worklog Details'}
                onPress={() => navigation.goBack()}
            />
            {isLoading ? (
                <ShimmerPlaceHolder />
            ) : (
                <FlatList
                    data={workLogsDetailData}
                    renderItem={renderItem}
                    keyExtractor={(item: any, index: any) => item?.id?.toString() + index}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[Colors?.primary]} />
                    }
                    ListFooterComponent={<View style={{ height: 100 }} />}
                />
            )}
        </View>
    )
}

export default WorklogDetails

const styles = (isDark: any) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: isDark ? Colors.black : Colors.white,
    },
});