import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { Dialog, Divider, Portal } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { isDarkTheme, setToDo } from '../../AppStore/Reducers/appState';
import { Colors } from '../../constants/Colors';

const FILTER_OPTIONS = [
    { id: 1, filterID: 1, label: "My Active Items", itemTypeID: 0 },
    { id: 2, filterID: 2, label: "Not Started Items", itemTypeID: 0 },
    { id: 3, filterID: 3, label: "Items I'm Working On", itemTypeID: 0 },
    { id: 4, filterID: 4, label: "Pending Items", itemTypeID: 0 },
    { id: 5, filterID: 3, label: "Bugs I'm Working On", itemTypeID: 674180003 },
    { id: 6, filterID: 3, label: "User Stories I'm Working On", itemTypeID: 674180001 },
    { id: 7, filterID: 5, label: "Completed Items", itemTypeID: 0 },
    // { filterID: 'tasks', label: "General Tasks", itemTypeID: 0 },
    // { filterID: 'project_items', label: "Active Items in My Projects", itemTypeID: 0 }
];

const FilterWorklogs = ({ visible, setVisible, onSelect, onPressGeneral, onPressProjectItem }: {
    visible: boolean;
    setVisible: (value: boolean) => void;
    onPressGeneral: () => void;
    onPressProjectItem: () => void;
    onSelect: (filterID: number, itemTypeID: number, label: string) => void;
}) => {
    const dispatch = useDispatch();
    const isDark = useSelector(isDarkTheme);
    const hideDialog = () => setVisible(false);

    return (
        <Portal>
            <Dialog visible={visible} style={styles(isDark).container} dismissable={false}>
                <Dialog.Content>
                    {FILTER_OPTIONS.map((item, index) => (
                        <React.Fragment key={item.id}>
                            <TouchableOpacity onPress={() => {
                                onSelect(item.filterID, item.itemTypeID, item?.label);
                                dispatch(setToDo(item?.label))
                                hideDialog();
                            }}>
                                <Text style={styles(isDark).txt}>{item.label}</Text>
                            </TouchableOpacity>
                            {index !== FILTER_OPTIONS.length - 1 && <Divider style={styles(isDark).divider} />}
                        </React.Fragment>
                    ))}
                    <Divider style={styles(isDark).divider} />
                    <TouchableOpacity onPress={() => {
                        dispatch(setToDo('General Tasks'))
                        onPressGeneral()
                        hideDialog();
                    }}>
                        <Text style={styles(isDark).txt}>{'General Tasks'}</Text>
                    </TouchableOpacity>
                    <Divider style={styles(isDark).divider} />
                    <TouchableOpacity onPress={() => {
                        onPressProjectItem(),
                        dispatch(setToDo('Active Items in My Project'))
                        hideDialog();
                    }}>
                        <Text style={styles(isDark).txt}>{'Active Items in My Project'}</Text>
                    </TouchableOpacity>
                    <Divider style={styles(isDark).divider} />
                    <TouchableOpacity onPress={hideDialog}>
                        <Text style={styles(isDark).txt}>Cancel</Text>
                    </TouchableOpacity>
                </Dialog.Content>
            </Dialog>
        </Portal>
    )
}

export default FilterWorklogs;

const styles = (isDark: any) => StyleSheet.create({
    container: {
        backgroundColor: isDark ? Colors.gray : Colors.white,
        borderRadius: 5,
        justifyContent: 'center',
    },
    txt: {
        fontSize: 16,
        fontFamily: 'Lato-Regular',
        textAlign: 'center',
        color: isDark ? Colors.white : Colors.black
    },
    divider: {
        backgroundColor: Colors.medium_gray,
        height: 1,
        marginVertical: 10
    },
});
