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
import CustomDialogBox from '../../Components/CustomDialogBox';

const WorklogDetails = ({ navigation, route }: any) => {
    const isDark = useSelector(isDarkTheme);
    const worklogDetails = route?.params?.item;
    const Assesstoken = useSelector((state: any) => state?.appState?.authToken);
    const accessToken = Assesstoken?.authToken?.accessToken;

    const [workLogsDetailData, setWorkLogsDetailData] = useState([]);
    const [refreshing, setRefreshing] = useState(false);
    const [dialogVisible, setDialogVisible] = useState(false);
    const [dialogTitle, setDialogTitle] = useState('');
    const [dialogMessage, setDialogMessage] = useState('');
    const [onConfirmAction, setOnConfirmAction] = useState<() => void>(
        () => () => { },
    );

    const { data: WorkLogsByEmpIdOnTodo, isSuccess, isLoading, refetch } = useGetWorkLogsByEmpIdOnTodoQuery({ toDoId: worklogDetails?.id, accessToken: accessToken }, { skip: !worklogDetails?.id || !accessToken });


    useEffect(() => {
        if (isSuccess && WorkLogsByEmpIdOnTodo?.data) {
            try {
                setWorkLogsDetailData(WorkLogsByEmpIdOnTodo?.data);
            } catch (err) {
                console.error('Error in success handler:', err);
            }
        }
    }, [WorkLogsByEmpIdOnTodo]);

    const showDialog = (
        title: string,
        message: string,
        onConfirm: () => void,
    ) => {
        setDialogTitle(title);
        setDialogMessage(message);
        setOnConfirmAction(() => onConfirm);
        setDialogVisible(true);
    };

    const handleEdit = (item: any) => {
        showDialog(
            'Confirm Widrawal worklog',
            'Are you sure you want to withdraw this worklog? Once withdrawn, you will be able to edit the date, hours, and description .',
            () => navigation.navigate('AddWorklog', { item })
        );
    };

    const renderItem = ({ item }: any) => (
        <WorklogCard
            projectName={item?.project}
            serialNo={`hours: ${item?.hours}`}
            title={item?.description}
            startDate={item?.date ? moment(item?.date, 'DD-MM-YYYY').format("DD/MM/YYYY") : null}
            status={item?.worklogStatusName}
            iconName={'notebook'}
            iconColor={Colors.primary}
            // showleftIcon={false}
            showRightIcon={item?.worklogStatusName === 'Submitted for approval' || item?.worklogStatusName === 'Approved' ? false : true}
            rightIconName={(item?.worklogStatusName === 'New' || item?.worklogStatusName === 'Rejected') && 'delete'}
            rightIconColor={Colors.error}
            rightIconPress={() => { }}
            rightIconPress2={() => item?.worklogStatusName === 'New' || item?.worklogStatusName === 'Rejected' || item?.worklogStatusName === 'Approved' ? navigation.navigate('AddWorklog', { item }) : handleEdit(item)}
            rightIconColor2={Colors.primary}
            rightIconName2={item?.worklogStatusName === 'New' || item?.worklogStatusName === 'Rejected' ? 'circle-edit-outline' : item?.worklogStatusName === 'Approved' ? 'eye' : 'cloud-upload-outline'}
            showRightIcon2={true}
            cardPress={() => { }}
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
            ) : workLogsDetailData?.length !== 0 ? (
                <FlatList
                    data={workLogsDetailData}
                    renderItem={renderItem}
                    keyExtractor={(item: any, index: any) => item?.id?.toString() + index}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={onRefresh}
                            colors={[Colors?.primary]}
                        />
                    }
                    ListFooterComponent={<View style={{ height: 100 }} />}
                />
            ) : (
                <View style={{ flex: 1, justifyContent: 'center' }}>
                    <Text
                        style={{
                            color: isDark ? Colors.white : Colors.black,
                            alignSelf: 'center',
                            fontFamily: 'Lato-Bold',
                            height: 38,
                            padding: 7,
                        }}>
                        No Worklogs Found
                    </Text>
                </View>
            )}
            <CustomDialogBox
                visible={dialogVisible}
                title={dialogTitle}
                message={dialogMessage}
                onCancel={() => setDialogVisible(false)}
                onConfirm={() => {
                    setDialogVisible(false);
                    onConfirmAction();
                }}
            />

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