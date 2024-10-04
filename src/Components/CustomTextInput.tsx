import {StyleSheet, View} from 'react-native';
import React from 'react';
import {TextInput} from 'react-native-paper';
import {Colors} from '../constants/Colors';
import {SCREEN_WIDTH} from '../constants/Screen';
import { useSelector } from 'react-redux';
import { isDarkTheme } from '../AppStore/Reducers/appState';

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
  style,
  keyboardType = 'default',
  contentStyle,
  numberOfLines 
}: any) => {
  const isDark = useSelector(isDarkTheme);

  return (
    <View>
      <TextInput
        mode="outlined"
        label={label}
        value={value}
        autoFocus={autoFocus}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry} 
        textColor={disable !== true ? isDark ? Colors.white : Colors.black :Colors.dark_gray}
        outlineColor={disable !== true ? isDark ? Colors.white : Colors.primary:Colors.dark_gray}
        activeOutlineColor={disable !== true ? isDark ? Colors.white : Colors.primary :Colors.dark_gray}
        placeholderTextColor={disable !== true ? isDark ? Colors.white : Colors.black :Colors.dark_gray}
        editable={editable}
        disabled={disable}
        readOnly={readOnly}
        onLayout={onLayout}
        keyboardType={keyboardType}
        contentStyle={contentStyle}
        numberOfLines ={numberOfLines}
        left={
          lefticon ? (
            <TextInput.Icon icon={leftIconName} color={disable !== true ? isDark ? Colors.white : Colors.primary :Colors.dark_gray} />
          ) : null
        }
        right={
          <TextInput.Icon
            icon={rightIconName}
            color={disable !== true ? isDark ? Colors.white : Colors.primary : Colors.dark_gray}
            onPress={onPress}
          />
        }
        style={[styles(isDark).input, style]}
                theme={{
          colors: {
            primary: isDark ? Colors.white : Colors.primary,
            background: isDark ? Colors.black : Colors.white,
            outline:isDark ? Colors.white : Colors.primary,
            outlineVariant: isDark ? Colors.white : Colors.primary,
            tertiaryContainer:isDark ? Colors.white : Colors.primary,
            onSurfaceVariant: isDark ? Colors.white : Colors.primary,
          },
        }}
      />
    </View>
  );
};
export default CustomTextInput;

const styles = (isDark: any) =>
  StyleSheet.create({
  input: {
    width: SCREEN_WIDTH - 32 ,
    justifyContent: 'center',
    alignSelf: 'center',
  },
});
