import { FlatList, RefreshControl, StyleSheet, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import WorklogCard from '../../../Components/WorklogCard';
import { Colors } from '../../../constants/Colors';
import { useDispatch, useSelector } from 'react-redux';
import { isDarkTheme, SetBugDetails } from '../../../AppStore/Reducers/appState';
import CustomHeader from '../../../Components/CustomHeader';
import { useGetBugDetailsByUserStoryIdQuery } from '../../../Services/workloglevel';
import ShimmerPlaceHolder from '../../Placeholder/ShimmerPlaceHolder';
import moment from 'moment';

const BugDetails = ({ navigation }: any) => {

    const isDark = useSelector(isDarkTheme);
    const dispatch = useDispatch();

    const BugDetails = useSelector((state: any) => state?.appState?.worklogDetails);
    const Assesstoken = useSelector((state: any) => state?.appState?.authToken);
    const accessToken = Assesstoken?.authToken?.accessToken;

    const [bugssDetailData, setBugsDetailData] = useState([]);
    const [refreshing, setRefreshing] = useState(false);

    const { data: BugsData, isSuccess, isLoading, refetch } = useGetBugDetailsByUserStoryIdQuery({ ItemId: BugDetails?.id, accessToken: accessToken }, { skip: !BugDetails?.id || !accessToken });


    useEffect(() => {
        if (isSuccess && BugsData?.data) {
            try {
                setBugsDetailData(BugsData?.data);
            } catch (err) {
                console.error('Error in success handler:', err);
            }
        }
    }, [BugsData]);



    const renderItem = ({ item }: any) => (
        <WorklogCard
            projectName={item?.itemNumber}
            serialNo={item?.assignee?.name}
            title={item?.title}
            startDate={item?.createdOn ? moment(item?.createdOn, "MM/DD/YYYY HH:mm:ss").format("DD/MM/YYYY") : null}
            status={item?.workStatus?.label}
            iconName={'bug'}
            iconColor={Colors.error}
            rightIconName="eye"
            showRightIcon={false}
            rightIconColor={Colors.primary}
            rightIconPress={() => { navigation.navigate('WorklogDetails', { item }) }}
            rightIconColor2={Colors.green}
            showRightIcon2={item?.workStatus?.label === 'Work In Progress' ? true : false}
            rightIconName2="plus-circle-outline"
            rightIconPress2={() => {
                if (item?.workStatus?.label === 'Work In Progress') {
                    navigation.navigate('AddWorklog');
                    dispatch(SetBugDetails(item));
                }
            }}
            rightIconColor3={Colors.green}
            showRightIcon3={false}
            rightIconName3="pencil-circle-outline"
            rightIconPress3={() => { navigation.navigate('AddBug') }}
        />
    );

    const onRefresh = async () => {
        setRefreshing(true);
        try {
            await refetch();
            // console.log('Refetching data...');

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
                title={'Bugs Details'}
                onPress={() => navigation.goBack()}
            />

            {isLoading ? (
                <ShimmerPlaceHolder />
            ) : (
                <FlatList
                    data={bugssDetailData}
                    renderItem={renderItem}
                    keyExtractor={(item: any, index: any) => item?.id?.toString() + index}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[Colors?.primary]} />
                    }
                    ListFooterComponent={<View style={{ height: 100 }} />}
                    showsVerticalScrollIndicator={false}
                />
            )}

        </View>
    )
}

export default BugDetails

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
});