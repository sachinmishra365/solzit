import { View, Text, StyleSheet, FlatList, RefreshControl } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { isDarkTheme } from '../../AppStore/Reducers/appState';
import CustomHeader from '../../Components/CustomHeader';
import { Colors } from '../../constants/Colors';
import { useGetEmloyeeBreaKLogsByEmployeeIdMutation } from '../../Services/services';
import ShimmerPlaceHolder from '../Placeholder/ShimmerPlaceHolder';
import { Card, FAB } from 'react-native-paper';
import moment from 'moment';
import EmptyData from '../../Components/EmptyData';

const Breakes = ({ navigation }: any) => {
    const isDark = useSelector(isDarkTheme);
    const accessToken = useSelector((state: any) => state?.appState?.authToken?.authToken?.accessToken);
    const [EmloyeeBreaKLogs, { isLoading }] = useGetEmloyeeBreaKLogsByEmployeeIdMutation();

    const [breaKLogs, setBreaKLogs] = useState([]);
    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => {
        handlebreaKLogs();
    }, []);

    const handlebreaKLogs = async () => {
        try {
            const response = await EmloyeeBreaKLogs({ accessToken: accessToken, data: {}, }).unwrap();
            if (response?.isSuccessful) {
                setBreaKLogs(response?.data);
            }
        } catch (err) {
            console.log(err);
        }
    };

    const onRefresh = () => {
        setRefreshing(true);
        handlebreaKLogs().finally(() => setRefreshing(false));
    };

    const renderItem = ({ item }: any) => (
        <Card style={styles(isDark).card}>
            <Card.Content>
                <View style={styles(isDark).row}>
                    <Text>
                        <Text style={styles(isDark).label}>
                            Duration{' : '}
                            <Text style={styles(isDark).value}>
                                {item?.breakDuration ? `${item?.breakDuration}${' '}Hours` : 'N/A'}
                            </Text>
                        </Text>
                    </Text>
                    <Text style={styles(isDark).label}>
                        Break Date{' : '}
                        <Text style={styles(isDark).value}>
                            {item?.returnTime ? moment(item?.outTime).format('DD/MM/YYYY') : 'N/A'}
                        </Text>
                    </Text>
                </View>
                <View style={styles(isDark).row}>
                    <Text>
                        <Text style={styles(isDark).label}>
                            Out Time{' : '}
                            <Text style={styles(isDark).value}>
                                {item?.outTime ? moment(item?.outTime).format('h:mm A') : 'N/A'}
                            </Text>
                        </Text>
                    </Text>
                    <Text style={styles(isDark).label}>
                        Return Time{' : '}
                        <Text style={styles(isDark).value}>
                            {item?.returnTime ? moment(item?.returnTime).format('h:mm A') : 'N/A'}
                        </Text>
                    </Text>
                </View>

                <Text style={styles(isDark).label}>
                    Reason{' : '}
                    <Text style={[styles(isDark).value, { flexWrap: 'wrap', lineHeight: 22 }]}>
                        {item?.reason ? item?.reason : 'N/A'}
                    </Text>
                </Text>
            </Card.Content>
        </Card>
    );

    return (
        <View style={styles(isDark).mainContainer}>
            <CustomHeader
                showBackIcon={true}
                title="My Breakes"
                isDark={isDark}
                onPress={() => navigation.goBack()}
            />
            {isLoading ? (
                <ShimmerPlaceHolder />
            ) : breaKLogs?.length > 0 ? (
                <FlatList
                    data={breaKLogs}
                    showsVerticalScrollIndicator={false}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={renderItem}
                    refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
                    ListFooterComponent={<View style={{ height: 100 }} />}
                />
            ) : (
                <EmptyData />
            )}
            <FAB
                style={styles(isDark).fab}
                color={Colors.white}
                onPress={() => navigation.navigate('AddBreaks')}
                accessibilityLabel="Add Feedback"
                icon="plus"
            />
        </View>
    );
};

const styles = (isDark: boolean) =>
    StyleSheet.create({
        mainContainer: {
            flex: 1,
            backgroundColor: isDark ? Colors.black : Colors.white,
        },
        card: {
            backgroundColor: isDark ? Colors.black : Colors.background,
            marginVertical: 7,
            borderColor: Colors.background,
            borderWidth: 0.5,
            marginHorizontal: 16,
            // overflow: 'hidden',
        },
        row: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 5,
            flexWrap: 'wrap',
        },
        label: {
            fontFamily: 'Lato-Semibold',
            color: isDark ? Colors.white : Colors.black,
        },
        value: {
            fontSize: 14,
            fontFamily: 'Lato-Regular',
            color: isDark ? Colors.white : Colors.black,
        },
        fab: {
            position: 'absolute',
            right: 32,
            bottom: 32,
            backgroundColor: isDark ? Colors.gray : Colors.primary,
            elevation: 10,
        },
    });

export default Breakes;
