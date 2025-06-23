import React, { useState, useRef } from 'react';
import {
  View,
  Modal,
  Pressable,
  Text,
  TouchableOpacity,
  StyleSheet,
  LayoutRectangle,
  findNodeHandle,
  UIManager,
} from 'react-native';
import { useSelector } from 'react-redux';
import { isDarkTheme } from '../AppStore/Reducers/appState';
import { Colors } from '../constants/Colors';
import { TextInput } from 'react-native-paper';
import CustomTextInput from './CustomTextInput';
import EmptyData from './EmptyData';

const CustomDropdownWithModal = ({
  label = 'Select',
  selectedValue,
  options = [],
  onSelect,
}: any) => {
  const isDark = useSelector(isDarkTheme);
  const [modalVisible, setModalVisible] = useState(false);
  const [dropdownPos, setDropdownPos] = useState<LayoutRectangle | null>(null);
  const inputRef = useRef(null);

  const handleOpenDropdown = () => {
    if (inputRef.current) {
      const handle = findNodeHandle(inputRef.current);
      if (handle) {
        UIManager.measureInWindow(handle, (x, y, width, height) => {
          setDropdownPos({ x, y, width, height });
          setModalVisible(true);
        });
      }
    }
  };

  const handleSelect = (option: any) => {
    onSelect(option);
    setModalVisible(false);
  };

  return (
    <View>
      <Pressable onPress={handleOpenDropdown} ref={inputRef}>
        <CustomTextInput
          label={label}
          value={selectedValue?.label}
          editable={false}
          readOnly
          rightIconName="chevron-down"
          lefticon={false}
          leftIconName={undefined}
          onPress={handleOpenDropdown}
          autoFocus={true}
        />
      </Pressable>


      <Modal
        transparent
        animationType="fade"
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}>
        <Pressable
          style={styles(isDark).overlay}
          onPress={() => setModalVisible(false)}>
          {dropdownPos && (
            <View
              style={[
                styles(isDark).menu,
                {
                  backgroundColor: isDark ? Colors.gray : Colors.white,
                  position: 'absolute',
                  top: dropdownPos.y + dropdownPos.height + 5,
                  left: dropdownPos.x,
                },
              ]}>{options.length > 0 ? (
                options.map((option: any) => (
                  <TouchableOpacity
                    key={option.value}
                    onPress={() => handleSelect(option)}
                    style={styles(isDark).item}>
                    <Text
                      style={{
                        color: isDark ? Colors.white : Colors.black,
                        fontFamily: 'Lato-Regular',
                      }}>
                      {option.label}
                    </Text>
                  </TouchableOpacity>
                ))) : (
                <View style={styles(isDark).item}>
                  <Text
                    style={{
                      color: isDark ? Colors.white : Colors.black,
                      fontFamily: 'Lato-Regular',
                    }}>
                   <EmptyData/>
                  </Text>
                </View>
              )}
            </View>
          )}
        </Pressable>
      </Modal>
    </View>
  );
};

const styles = (isDark: boolean) =>
  StyleSheet.create({
    overlay: {
      flex: 1,
    },
    menu: {
      elevation: 5,
      paddingVertical: 4,
      width: 200,
    },
    item: {
      paddingVertical: 10,
      paddingHorizontal: 16,
    },
    input: {
      marginVertical: 8,
    },
  });

export default CustomDropdownWithModal;
