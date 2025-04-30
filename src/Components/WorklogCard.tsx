import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Card, IconButton } from 'react-native-paper'
import { Colors, Statuses } from '../constants/Colors'
import { useSelector } from 'react-redux'
import { isDarkTheme } from '../AppStore/Reducers/appState'

const WorklogCard = ({
    projectName,
    serialNo,
    title,
    startDate,
    endDate,
    status,
    iconName,
    iconColor,
    iconPress,
    showleftIcon = true,
    cardPress,
    rightIconPress,
    rightIconColor,
    rightIconName,
    showRightIcon = true,
    rightIconPress2,
    rightIconColor2,
    rightIconName2,
    showRightIcon2 = false,
    rightIconPress3,
    rightIconColor3,
    rightIconName3,
    showRightIcon3 = false,
}: any) => {
    const isDark = useSelector(isDarkTheme);
    return (
        <Card style={styles(isDark).cardContainer} onPress={cardPress}>
            <Card.Content style={styles(isDark).cardContant}>
                <View style={{
                    flexDirection: 'row', alignItems: 'center',
                }}>
                    {
                        showleftIcon && (
                            <IconButton
                                icon={iconName}
                                iconColor={iconColor}
                                size={25}
                                style={{ marginLeft: -10 }}
                                onPress={iconPress}
                            />
                        )
                    }
                    <Text style={[styles(isDark).txt, { fontFamily: 'Lato-Bold', flexWrap: 'wrap', width: '90%' }]}>{projectName}</Text>
                </View>

            </Card.Content>
            <Card.Content >
                <Text style={styles(isDark).txt}>{title}</Text>
            </Card.Content>

            <Card.Content style={[styles(isDark).cardContant, { marginVertical: 5 }]}>
                <Text style={[styles(isDark).txt]}>{startDate}</Text>
                {/* {(startDate && endDate) && (<Text style={[styles(isDark).txt]}>{' - '}</Text>)} */}
                <Text style={styles(isDark).txt}>{endDate}</Text>
            </Card.Content>
            <Card.Content style={[styles(isDark).cardContant]}>
                <Text style={styles(isDark).txt}>{serialNo}</Text>
                <Text
                    style={[
                        styles(isDark).txt,
                        { color: Object.values(Statuses).find(item => item.label === status)?.color || '#000', fontFamily: 'Lato-Semibold' }
                    ]}
                >
                    {status}
                </Text>
            </Card.Content>
            <Card.Content style={[styles(isDark).cardContant, { justifyContent: 'flex-end', marginTop: 10 }]}>
                {
                    showRightIcon3 && (
                        <IconButton
                            icon={rightIconName3}
                            iconColor={rightIconColor3}
                            size={25}
                            style={{ marginRight: -10, marginBottom: -15 }}
                            onPress={rightIconPress3}
                        />
                    )
                }
                {
                    showRightIcon2 && (
                        <IconButton
                            icon={rightIconName2}
                            iconColor={rightIconColor2}
                            size={25}
                            style={{ marginRight: -10, marginBottom: -15 }}
                            onPress={rightIconPress2}
                        />
                    )
                }
                {
                    showRightIcon && (
                        <IconButton
                            icon={rightIconName}
                            iconColor={rightIconColor}
                            size={25}
                            style={{ marginRight: -10, marginBottom: -15 }}

                            onPress={rightIconPress}
                        />
                    )
                }
            </Card.Content>
        </Card>
    )
}

export default WorklogCard

const styles = (isDark: any) => StyleSheet.create({
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
        color: isDark ? Colors.white : Colors.black
    }
})