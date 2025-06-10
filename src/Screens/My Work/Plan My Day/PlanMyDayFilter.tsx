import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React from 'react';
import { Dialog, Divider, IconButton, Portal } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { isDarkTheme, setToDo } from '../../../AppStore/Reducers/appState';
import { Colors } from '../../../constants/Colors';


const PlanMyDayFilter = ({ visible, setVisible, onPressGeneral, onPressProjectItem }: {
    visible: boolean;
    setVisible: (value: boolean) => void;
    onPressGeneral: () => void;
    onPressProjectItem: () => void;
}) => {
    const dispatch = useDispatch();
    const isDark = useSelector(isDarkTheme);
    const hideDialog = () => setVisible(false);

    return (
        <Portal>
            <Dialog visible={visible} style={styles(isDark).container} dismissable={false}>
                <View style={styles(isDark).header}>
                    <Text style={styles(isDark).headerTitle}>Filters</Text>
                    <TouchableOpacity onPress={hideDialog}>
                        <IconButton icon="close" size={25} iconColor={isDark ? Colors.white : Colors.black} />
                    </TouchableOpacity>
                </View>

                <Dialog.Content style={styles(isDark).content}>

                    <View style={styles(isDark).rightPanel}>
                        <TouchableOpacity onPress={() => {
                            onPressProjectItem();
                            dispatch(setToDo('Active Items in My Project'));
                            hideDialog();
                        }}>
                            <Text style={styles(isDark).txt}>My Active Items</Text>
                        </TouchableOpacity>
                        <Divider style={styles(isDark).divider} />

                        <TouchableOpacity onPress={() => {
                            dispatch(setToDo('General Tasks'));
                            onPressGeneral();
                            hideDialog();
                        }}>
                            <Text style={styles(isDark).txt}>General Tasks</Text>
                        </TouchableOpacity>

                    </View>
                </Dialog.Content>
            </Dialog>
        </Portal>
    );
};

export default PlanMyDayFilter;

const styles = (isDark: boolean) => StyleSheet.create({
    container: {
        backgroundColor: isDark ? Colors.gray : Colors.background,
        borderRadius: 0,
        marginHorizontal: 0,
        height: '100%',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 12,
        borderBottomWidth: 1,
        borderBottomColor: Colors.medium_gray,
        maxHeight: 70,
        paddingVertical: 10,
        marginTop:0
    },
    headerTitle: {
        fontSize: 18,
        fontFamily: 'Lato-Bold',
        marginLeft: 10,
        color: isDark ? Colors.white : Colors.black,
    },
    content: {
        flexDirection: 'row',
        paddingTop: 20,
    },
    rightPanel: {
        width: '100%',
        gap: 6,
    },
    txt: {
        fontSize: 15,
        fontFamily: 'Lato-SemiBold',
        textAlign: 'left',
        color: isDark ? Colors.white : Colors.black,
        paddingVertical: 5,
    },
    divider: {
        backgroundColor: Colors.medium_gray,
        height: 1,
        marginVertical: 5,
        marginHorizontal:-20
    },
});