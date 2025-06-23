import React from 'react';
import { StyleSheet, Text } from 'react-native';
import { Dialog, Portal, Button } from 'react-native-paper';
import { useSelector } from 'react-redux';
import { Colors } from '../../constants/Colors';
import { isDarkTheme } from '../../AppStore/Reducers/appState';
import CustomTextInput from '../../Components/CustomTextInput';

const RejectMessageDialog = ({
    visible,
    title,
    message,
    onCancel,
    onConfirm,
    reason,
    onChangeReason
}: any) => {
    const isDark = useSelector(isDarkTheme);

    return (
        <Portal>
            <Dialog visible={visible} onDismiss={onCancel} style={styles(isDark).dialog} >
                <Dialog.Title style={styles(isDark).titleText}>{title}</Dialog.Title>
                <Dialog.Content>
                    <Text style={styles(isDark).messageText}>{message}</Text>
                </Dialog.Content>
                <CustomTextInput
                    label="Description"
                    value={reason}
                    secureTextEntry={false}
                    lefticon={false}
                    editable={true}
                    style={[styles(isDark).input]}
                    multiline={true}
                    onChangeText={onChangeReason}
                />
                <Dialog.Actions>
                    <Button onPress={onCancel} textColor={Colors.error} labelStyle={{ fontFamily: 'Lato-Bold' }}>No</Button>
                    <Button onPress={onConfirm} textColor={Colors.primary} labelStyle={{ fontFamily: 'Lato-Bold' }}>Yes</Button>
                </Dialog.Actions>
            </Dialog>
        </Portal>
    );
};

export default RejectMessageDialog;

const styles = (isDark: any) =>
    StyleSheet.create({
        dialog: {
            backgroundColor: isDark ? Colors.gray : Colors.white,
            borderRadius: 12,

        },
        titleText: {
            fontSize: 16,
            fontFamily: 'Lato-Semibold',
            color: isDark ? Colors.white : Colors.black,
        },
        messageText: {
            fontSize: 14,
            fontFamily: 'Lato-Regular',
            color: isDark ? Colors.white : Colors.black,
        },
        input: {
            width: '85%',
            marginBottom:10
        },

    });