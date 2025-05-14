import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { Colors } from '../../constants/Colors';
import { useSelector } from 'react-redux';
import { isDarkTheme } from '../../AppStore/Reducers/appState';
import { Dialog, IconButton, Portal } from 'react-native-paper';
import moment from 'moment';

const BreaksDialog = ({ visibleWorkType, setVisibleWorkType, BreaksData }: any) => {

    const isDark = useSelector(isDarkTheme);
    const hideDialog = () => setVisibleWorkType(false);

    return (
        <Portal>
            <Dialog visible={visibleWorkType} style={styles(isDark).container} onDismiss={() => hideDialog()} dismissable={false}>
                <Dialog.Content style={{paddingBottom:20}}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 6, justifyContent: 'center' }}>
                            <Text style={styles(isDark).txt}>Break-In Time</Text>
                            <Text style={styles(isDark).txt}>Break Out Time</Text>
                            <Text style={styles(isDark).txt}>Total Hours</Text>
                        </View>
                    <ScrollView  showsVerticalScrollIndicator={false} showsHorizontalScrollIndicator={false}>

                        {BreaksData?.map((item: any, index: any) => (
                          <>
                            <View key={index} style={{ flexDirection: 'row', backgroundColor: isDark ? Colors.dark_gray : '#cce0f5', padding: 10, marginTop: 2 }}>
                                <Text style={[styles(isDark).txt, { fontFamily: 'Lato-Regular' }]}>{item.breakInTime ? moment(item.breakInTime).format('hh:mm A') : 'N/A'}</Text>
                                <Text style={[styles(isDark).txt, { fontFamily: 'Lato-Regular' }]}>{item.breakOutTime ? moment(item.breakOutTime).format('hh:mm A') : 'N/A'}</Text>
                                <Text style={[styles(isDark).txt, { fontFamily: 'Lato-Regular' }]}>{item.totalHours ? item.totalHours  : 0}</Text>
                            </View>                         
                          </>
                        ))}
                    </ScrollView>
                </Dialog.Content>
                <IconButton
                    style={{ position: 'absolute', top: 0, right: 0 }}
                    icon="close-octagon"
                    iconColor={Colors.error}
                    size={30}
                    onPress={() => setVisibleWorkType(false)}
                    accessibilityLabel="Close"
                />
            </Dialog>
        </Portal>
    );
};

export default BreaksDialog;


const styles = (isDark: any) => StyleSheet.create({
    container: {
        backgroundColor: isDark ? Colors.gray : Colors.white,
        borderRadius: 5,
    },
    txt: {
        fontFamily: 'Lato-Semibold',
        color: isDark ? Colors.white : Colors.black,
        flex: 1
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