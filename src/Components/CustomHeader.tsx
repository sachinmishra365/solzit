import { Dimensions, StyleSheet, Text, TextInput, View } from 'react-native';
import React from 'react';
import { IconButton } from 'react-native-paper';
import { Colors } from '../constants/Colors';
import { useSelector } from 'react-redux';
import { isDarkTheme } from '../AppStore/Reducers/appState';

const { width } = Dimensions.get('window');

const CustomHeader = ({
  showBackIcon = false,
  onPress,
  title,
  searchOnPress,
  showSearchIcon = false,
  onSearchChange,
  searchValue,
  showSearch = false,
  showRightIcon = false,
  rightIconPress,
  rightIconName,
  showFilterIcon = false,
  filterOnPress,
  onMenuSelect,
}: any) => {
  const isDark = useSelector(isDarkTheme);

  return (
    <>
      <View style={styles(isDark).container}>
        {showBackIcon ? (
          <IconButton icon="chevron-left" size={25} accessibilityLabel="Back"
            iconColor={isDark ? Colors.white : Colors.black}
            onPress={onPress}
          />
        ) : (
          <IconButton icon="menu" size={25} accessibilityLabel="Menu"
            iconColor={isDark ? Colors.white : Colors.black}
            onPress={onPress}
          />
        )}

        <Text style={styles(isDark).title}>{title}</Text>

        {showFilterIcon && (
          <IconButton icon="filter" size={25} accessibilityLabel="filter"
            iconColor={isDark ? Colors.white : Colors.primary}
            style={styles(isDark).searchIcon} onPress={filterOnPress}
          />
        )}
        {showSearch && (
          <TextInput
            style={styles(isDark).searchInput}
            placeholder="Search"
            placeholderTextColor={isDark ? Colors.medium_gray : Colors.dark_gray}
            value={searchValue}
            onChangeText={onSearchChange}
            onPress={filterOnPress}
          />
        )}
        {showRightIcon && (
            <IconButton icon={rightIconName} size={25}
              iconColor={isDark ? Colors.white : Colors.primary}
              style={styles(isDark).searchIcon} onPress={rightIconPress}
            />
          )}
      </View>
      <View
        style={{
          borderWidth: 1, height: 1,
          backgroundColor: isDark ? Colors.white : 'transparent',
          borderColor: isDark ? Colors.black : 'transparent',
        }}
      />
    </>
  );
};

export default CustomHeader;

const styles = (isDark: any) =>
  StyleSheet.create({
    container: {
      backgroundColor: isDark ? Colors.black : Colors.white,
      height: 60,
      width: width,
      flexDirection: 'row',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 1,
      alignItems: 'center',
      elevation: 5,
    },
    title: {
      fontSize: 18,
      color: isDark ? Colors.white : Colors.black,
      // marginTop: 2,
      fontFamily: 'Lato-Semibold',
    },
    searchIcon: {
      position: 'absolute',
      right: 16,
    },
    searchInput: {
      flex: 1,
      height: 40,
      backgroundColor: isDark ? Colors.gray : Colors.background,
      borderRadius: 10,
      borderColor: isDark ? Colors.background : Colors.black,
      borderWidth: 0.5,
      fontSize: 12,
      fontFamily: 'Lato-Semibold',
      marginHorizontal: 16,
      color: isDark ? Colors.white : Colors.black,
    },
  });
