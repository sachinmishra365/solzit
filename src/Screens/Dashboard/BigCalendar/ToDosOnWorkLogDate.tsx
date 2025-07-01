import { FlatList, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useToDosOnWorkLogDateQuery } from '../../../Services/workloglevel'
import { useSelector } from 'react-redux'
import { useIsFocused } from '@react-navigation/native'
import CustomHeader from '../../../Components/CustomHeader'
import EmptyData from '../../../Components/EmptyData'
import { isDarkTheme } from '../../../AppStore/Reducers/appState'
import { Colors, Statuses } from '../../../constants/Colors'
import { Card } from 'react-native-paper'
import ShimmerPlaceHolder from '../../Placeholder/ShimmerPlaceHolder'

const ToDosOnWorkLogDate = ({ route, navigation }: any) => {
    const Date = route?.params?.selectedDate
    const isFocuse = useIsFocused();

    const isDark = useSelector(isDarkTheme);
    const Assesstoken = useSelector((state: any) => state?.appState?.authToken);
    const accessToken = Assesstoken?.authToken?.accessToken;

    const [selectedDateData, SetSelectedDateData] = useState<any>([])

    const { data, isLoading, isSuccess } = useToDosOnWorkLogDateQuery({ accessToken, workLogDate: Date })

    useEffect(() => {
        if (isSuccess) {
            SetSelectedDateData(data?.data?.toDoList)
        }
    }, [data, isFocuse])

    const renderItem = ({ item }: any) => {

        return (
            <Card style={[styles(isDark).cardContainer,]} >
                <Card.Content style={styles(isDark).cardContant}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Text style={[styles(isDark).txt, { fontFamily: 'Lato-Bold', flexWrap: 'wrap', marginVertical: 5 }]}>{item?.projectName || 'N/A'}</Text>
                    </View>

                </Card.Content>

                <Card.Content >
                    <Text style={styles(isDark).txt}>{item?.title}</Text>
                </Card.Content>

                <Card.Content style={[styles(isDark).cardContant]}>
                    <Text style={styles(isDark).txt}>{'Item No. : '}{item?.itemNo || 'N/A'}</Text>
                    <Text style={styles(isDark).txt}>{'Hour : '}{item?.tShours || 'N/A'}</Text>
                </Card.Content>

                <Card.Content >
                    {item?.tSdescription && (<Text style={[styles(isDark).txt, { fontSize: 14 }]}>{item?.tSdescription}</Text>)}
                </Card.Content>

                <Card.Content>
                    <View style={{ alignItems: 'flex-end' }}>
                        <Text
                            style={[
                                styles(isDark).txt,
                                {
                                    color: Object.values(Statuses).find((statusObj: any) => statusObj.label === item?.worklogStatusName)?.color || '#000',
                                    fontFamily: 'Lato-Semibold',
                                }
                            ]}
                        >
                            {item?.worklogStatusName}
                        </Text>
                    </View>
                </Card.Content>

            </Card>
        )
    }

    return (
        <View style={styles(isDark).container}>
            <CustomHeader
                showBackIcon
                title="Worklog Details"
                onPress={() => navigation.goBack()}
            />
            {isLoading ? (
                <ShimmerPlaceHolder />
            ) :
                (
                    <FlatList
                        data={selectedDateData}
                        keyExtractor={(item, index) => item?.id + index.toString()}
                        renderItem={renderItem}
                        ListFooterComponent={<View style={{ height: 100 }} />}
                        showsVerticalScrollIndicator={false}
                        ListEmptyComponent={() => (
                            <View style={{ marginVertical: '100%' }}>
                                <EmptyData />
                            </View>
                        )}
                    />
                )
            }
        </View>
    )
}

export default ToDosOnWorkLogDate

const styles = (isDark: any) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: isDark ? Colors.black : Colors.white
    },
    cardContainer: {
        backgroundColor: isDark ? Colors.black : Colors.background,
        borderRadius: 5,
        marginHorizontal: 16,
        marginTop: 10,
        borderColor: Colors.background,
        borderWidth: 0.5,
    },
    cardContant: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap'
    },
    txt: {
        fontSize: 15,
        fontFamily: 'Lato-Regular',
        color: isDark ? Colors.white : Colors.black,
        lineHeight: 26
    }
})