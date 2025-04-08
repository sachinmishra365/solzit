import { StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import { Button, Menu } from 'react-native-paper';
import CustomTextInput from './CustomTextInput';
import { useSelector } from 'react-redux';
import { isDarkTheme } from '../AppStore/Reducers/appState';
import { Colors } from '../constants/Colors';

const CustomMenu = ({ visible, setVisible, items }: {
    visible: boolean;
    setVisible: (value: boolean) => void;
    items: []
}) => {
    const isDark = useSelector(isDarkTheme);
    const openMenu = () => setVisible(true);
    const closeMenu = () => setVisible(false);
    const [selectedProject, setSelectedProject] = useState('');

    const handleSelection = (projectName: string) => {
        setSelectedProject(projectName);
        closeMenu();
    };
    return (
        <View>
            <Menu
                visible={visible}
                onDismiss={closeMenu}
                anchor={
                    <CustomTextInput
                        label="Project Name"
                        value={selectedProject}
                        onChangeText={setSelectedProject}
                        // onBlur={''}
                        lefticon={false}
                        rightIconName={'chevron-down'}
                        onPress={openMenu}
                        autoFocus={true}
                        editable={false}
                        readOnly={true}
                    />
                }
                style={{ marginHorizontal: 16 }}
                contentStyle={{ backgroundColor: isDark ? Colors.gray : Colors.white }}
                statusBarHeight={60}
            >
                {items?.map((item: any, index: any) => (
                    <Menu.Item 
                        key={item.id} 
                        onPress={() => handleSelection(item.projectName)} 
                        title={item.projectName} 
                    />
                ))}
            </Menu>
        </View>
    )
}

export default CustomMenu

const styles = StyleSheet.create({})