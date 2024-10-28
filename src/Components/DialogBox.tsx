import * as React from 'react';
import {StyleSheet, TextComponent, TouchableOpacity} from 'react-native';
import {Button, Dialog, Portal, Text} from 'react-native-paper';
import {Colors} from 'react-native/Libraries/NewAppScreen';

const DialogBox = ({
  visible,
  hideDialog,
  title,
  onPress,
  message,
  icon
}: any) => {
  return (
    <Portal>
      <Dialog
        visible={visible}
        onDismiss={hideDialog}
        style={{
          backgroundColor: Colors.background,
          height: 200,
          borderRadius: 15,
        }}>
        <Dialog.Icon icon={icon} color={Colors.error} />
        <Dialog.Title>{title}</Dialog.Title>
        <Dialog.Content>
          <Text variant="bodyMedium">{message}</Text>
        </Dialog.Content>
        <Dialog.Actions>
          <TouchableOpacity onPress={onPress}>
            <Text
              style={{
                fontSize: 16,
                fontFamily: 'Lato-Semibold',
                color: Colors.primary,
                position: 'absolute',
                right: 0,
              }}>
              OK
            </Text>
          </TouchableOpacity>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
};

const styles = StyleSheet.create({
  title: {
    textAlign: 'center',
  },
});

export default DialogBox;
