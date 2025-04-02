import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Dialog, Divider, Portal } from 'react-native-paper';
import { Colors } from '../../constants/Colors';
import { useSelector } from 'react-redux';
import { isDarkTheme } from '../../AppStore/Reducers/appState';
import { string } from 'yup';

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
    // onSelect: (filterID: number, itemTypeID: number) => void;
    plannedStart: string
    plannedEnd: string
    actualStart: string
    actualEnd: string
    effort: string
    effortSpent: string
    priority: string
    sprint: string
    parent: string
}) => {
    const isDark = useSelector(isDarkTheme);
    // const [visible, setVisible] = React.useState(true);
    const hideDialog = () => setVisibleWorkType(false);
    return (
        <Portal>
            <Dialog visible={visibleWorkType} style={styles(isDark).container} onDismiss={()=>hideDialog()}>
                <Dialog.Content>
                    <Text style={[styles(isDark).txt, { textAlign: 'center', fontFamily: 'Lato-Bold' }]}>{parent}</Text>
                    <View style={styles(isDark).contant}>
                        <View style={{ flexDirection: 'row' }}>
                            <Text style={styles(isDark).txt}>{'Planned Start'}</Text>
                            <Text style={[styles(isDark).txt]}>{' : '}</Text>
                            <Text style={[styles(isDark).txt, { fontFamily: 'Lato-Semibold' }]}>{plannedStart}</Text>
                        </View>
                        <View style={{ flexDirection: 'row' }}>
                            <Text style={styles(isDark).txt}>{'Planned End'}</Text>
                            <Text style={[styles(isDark).txt]}>{' : '}</Text>
                            <Text style={[styles(isDark).txt, { fontFamily: 'Lato-Semibold' }]}>{plannedEnd}</Text>
                        </View>
                    </View>
                    <View style={styles(isDark).contant}>
                        <View style={{ flexDirection: 'row' }}>
                            <Text style={styles(isDark).txt}>{'Actual Start'}</Text>
                            <Text style={[styles(isDark).txt]}>{' : '}</Text>
                            <Text style={[styles(isDark).txt, { fontFamily: 'Lato-Semibold' }]}>{actualStart}</Text>
                        </View>
                        <View style={{ flexDirection: 'row' }}>
                            <Text style={styles(isDark).txt}>{'Actual End'}</Text>
                            <Text style={[styles(isDark).txt]}>{' : '}</Text>
                            <Text style={[styles(isDark).txt, { fontFamily: 'Lato-Semibold' }]}>{actualEnd}</Text>
                        </View>
                    </View>
                    <View style={styles(isDark).contant}>
                        <View style={{ flexDirection: 'row' }}>
                            <Text style={styles(isDark).txt}>{'Effort'}</Text>
                            <Text style={[styles(isDark).txt]}>{' : '}</Text>
                            <Text style={[styles(isDark).txt, { fontFamily: 'Lato-Semibold' }]}>{effort}</Text>
                        </View>
                        <View style={{ flexDirection: 'row' }}>
                            <Text style={styles(isDark).txt}>{'Effort Spent'}</Text>
                            <Text style={[styles(isDark).txt]}>{' : '}</Text>
                            <Text style={[styles(isDark).txt, { fontFamily: 'Lato-Semibold' }]}>{effortSpent}</Text>
                        </View>
                    </View>
                    <View style={styles(isDark).contant}>
                        <View style={{ flexDirection: 'row' }}>
                            <Text style={styles(isDark).txt}>{'Sprint'}</Text>
                            <Text style={[styles(isDark).txt]}>{' : '}</Text>
                            <Text style={[styles(isDark).txt, { fontFamily: 'Lato-Semibold' }]}>{sprint}</Text>
                        </View>
                        <View style={{ flexDirection: 'row' }}>
                            <Text style={styles(isDark).txt}>{'Priority'}</Text>
                            <Text style={[styles(isDark).txt]}>{' : '}</Text>
                            <Text style={[styles(isDark).txt, { fontFamily: 'Lato-Semibold' }]}>{priority}</Text>
                        </View>
                    </View>
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
        color: isDark ? Colors.white : Colors.black
    },
    contant: {
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        // margin: 1,
        flexDirection: 'row',
        marginTop: 10
    }
});