import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { Dialog, Divider, Portal } from 'react-native-paper';
import { Colors } from '../../constants/Colors';
import { useSelector } from 'react-redux';
import { isDarkTheme } from '../../AppStore/Reducers/appState';

const WorkTypeDialog = ({
    visibleWorkType,
    setVisibleWorkType,
    plannedStart,
    plannedEnd,
    actualStart,
    actualEnd,
    effort,
    effortSpent,
    priority,
    sprint,
    parent,
}: {
    visibleWorkType: boolean;
    setVisibleWorkType: (value: boolean) => void;
    plannedStart: any
    plannedEnd: any
    actualStart: any
    actualEnd: any
    effort: string
    effortSpent: string
    priority: string
    sprint: string
    parent: string
}) => {

    const isDark = useSelector(isDarkTheme);
    const hideDialog = () => setVisibleWorkType(false);

    return (
        <Portal>
            <Dialog visible={visibleWorkType} style={styles(isDark).container} onDismiss={() => hideDialog()} dismissable={false}>

                <Dialog.Content>
                    <Text style={[styles(isDark).txt, { textAlign: 'center', fontFamily: 'Lato-Bold', fontSize: 15 }]}>{parent}</Text>
                    <View style={styles(isDark).contant}>
                        <View>
                            <Text style={styles(isDark).txt}>{'Planned Start'}{' : '}</Text>
                            <Text style={styles(isDark).txt}>{'Planned End'}{' : '}</Text>
                            <Text style={styles(isDark).txt}>{'Actual Start'}{' : '}</Text>
                            <Text style={styles(isDark).txt}>{'Actual End'}{' : '}</Text>
                            <Text style={styles(isDark).txt}>{'Priority'}{' : '}</Text>
                            <Text style={styles(isDark).txt}>{'Effort'}{' : '}</Text>
                            <Text style={styles(isDark).txt}>{'Effort Spent'}{' : '}</Text>
                            <Text style={styles(isDark).txt}>{'Sprint'}{' : '}</Text>
                        </View>
                        <View >
                            <Text style={styles(isDark).txt}>{plannedStart}</Text>
                            <Text style={styles(isDark).txt}>{plannedEnd}</Text>
                            <Text style={styles(isDark).txt}>{actualStart}</Text>
                            <Text style={styles(isDark).txt}>{actualEnd}</Text>
                            <Text style={styles(isDark).txt}>{priority}</Text>
                            <Text style={styles(isDark).txt}>{effort}</Text>
                            <Text style={styles(isDark).txt}>{effortSpent}</Text>
                            <Text style={[styles(isDark).txt, { width: '75%' }]}>{sprint}</Text>
                        </View>
                    </View>
                    <Divider style={styles(isDark).divider} />
                    <TouchableOpacity onPress={hideDialog}>
                        <Text style={[styles(isDark).txt, { textAlign: 'center', fontFamily: 'Lato-Semibold' }]}>Close</Text>
                    </TouchableOpacity>
                </Dialog.Content>
            </Dialog>
        </Portal>
    )
}

export default WorkTypeDialog

const styles = (isDark: any) => StyleSheet.create({
    container: {
        backgroundColor: isDark ? Colors.gray : Colors.white,
        borderRadius: 5,
    },
    txt: {
        fontSize: 14,
        fontFamily: 'Lato-Regular',
        color: isDark ? Colors.white : Colors.black,
        lineHeight: 25,
    },
    contant: {
        justifyContent: 'space-between',
        flexDirection: 'row',
        marginTop: 10
    },
    divider: {
        backgroundColor: Colors.medium_gray,
        height: 1,
        marginVertical: 10
    },
});