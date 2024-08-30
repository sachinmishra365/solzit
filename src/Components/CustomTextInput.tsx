import {StyleSheet, View} from 'react-native';
import React from 'react';
import {TextInput} from 'react-native-paper';
import {Colors} from '../constants/Colors';
import {SCREEN_WIDTH} from '../constants/Screen';

const CustomTextInput = ({
  label,
  value,
  onChangeText,
  autoFocus = false,
  secureTextEntry = false,
  leftIconName = false,
  rightIconName = false,
  onPress,
  lefticon = true,
  editable = false,
  disable = false,
  readOnly = false,
  onLayout,
}: any) => {
  return (
    <View>
      <TextInput
        mode="outlined"
        label={label}
        value={value}
        autoFocus={autoFocus}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry}
        textColor={Colors.white}
        outlineColor={Colors.white}
        activeOutlineColor={Colors.white}
        placeholderTextColor={Colors.white}
        editable={editable}
        disabled={disable}
        readOnly={readOnly}
        onLayout={onLayout}
        left={
          lefticon ? (
            <TextInput.Icon icon={leftIconName} color={Colors.white} />
          ) : null
        }
        right={
          <TextInput.Icon
            icon={rightIconName}
            color={Colors.white}
            onPress={onPress}
          />
        }
        style={styles.input}
        theme={{
          colors: {
            primary: Colors.white,
            background: Colors.black,
            outline: Colors.white,
            outlineVariant: Colors.white,
            tertiaryContainer: Colors.white,
            onSurfaceVariant: Colors.white,
          },
        }}
      />
    </View>
  );
};
export default CustomTextInput;

const styles = StyleSheet.create({
  input: {
    width: SCREEN_WIDTH - 32,
    justifyContent: 'center',
    alignSelf: 'center',
  },
});
