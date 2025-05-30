import React, {useState, useRef} from 'react';
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
import {useSelector} from 'react-redux';
import {isDarkTheme} from '../AppStore/Reducers/appState';
import {Colors} from '../constants/Colors';

const CustomDropdownWithModal = ({
  label = 'Select',
  selectedValue,
  options = [],
  onSelect,
}: any) => {
  const isDark = useSelector(isDarkTheme);
  const [modalVisible, setModalVisible] = useState(false);
  const [dropdownPos, setDropdownPos] = useState<LayoutRectangle | null>(null);
  const dropdownRef = useRef(null);

  const handleOpenDropdown = () => {
    if (dropdownRef.current) {
      const handle = findNodeHandle(dropdownRef.current);
      if (handle) {
        UIManager.measureInWindow(handle, (x, y, width, height) => {
          setDropdownPos({x, y, width, height});
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
      <TouchableOpacity
        ref={dropdownRef}
        style={[
          styles(isDark).dropdownButton,
          {
            backgroundColor: isDark ? Colors.black : Colors.background,
            borderColor: isDark ? Colors.background : Colors.primary,
          },
        ]}
        onPress={handleOpenDropdown}>
        <Text style={[styles(isDark).dropdownButtonText]}>
          {selectedValue?.label || label}
        </Text>
      </TouchableOpacity>

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
              ]}>
              {options.map((option: any) => (
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
              ))}
            </View>
          )}
        </Pressable>
      </Modal>
    </View>
  );
};

const styles = (isDark: boolean) =>
  StyleSheet.create({
    dropdownButton: {
      padding: 12,
      borderWidth: 1,
      borderRadius: 5,
    },
    dropdownButtonText: {
      fontFamily: 'Lato-Bold',
      color: isDark ? Colors.white : Colors.black,
    },
    overlay: {
      flex: 1,
    },
    menu: {
      width: 200,
      elevation: 5,
      paddingVertical: 4,
    },
    item: {
      paddingVertical: 10,
      paddingHorizontal: 16,
    },
  });

export default CustomDropdownWithModal;
