import { Dimensions, StyleSheet, Text, TextInput, View } from 'react-native';
import React from 'react';
import { Icon, IconButton } from 'react-native-paper';
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
  showRightIcon2 = false,
  rightIconPress2,
  rightIconName2,
  showFilterIcon = false,
  filterOnPress,
  onMenuSelect,
  showallocation = false,
  total = 0,
  color,
  ShowWorkStatusInstruction = false
}: any) => {
  const isDark = useSelector(isDarkTheme);

  return (
    <>
      <View style={styles(isDark).container}>
        {showBackIcon ? (
          <IconButton icon="chevron-left" size={25} accessibilityLabel="Back"
            iconColor={isDark ? Colors.white : Colors.black}
            onPress={onPress}
            style={{ marginTop: 8 }}
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
            style={[styles(isDark).searchIcon, { right: 2 }]} onPress={filterOnPress}
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
        {showallocation && (
          <Text style={[styles(isDark).allocationtxt, { color: color }]}>
            {total}{'%'}
          </Text>
        )}
        {showRightIcon && (
          <IconButton icon={rightIconName} size={25}
            iconColor={isDark ? Colors.white : Colors.primary}
            style={styles(isDark).searchIcon} onPress={rightIconPress}
          />
        )}
        {showRightIcon2 && (
          <IconButton icon={rightIconName2} size={25}
            iconColor={isDark ? Colors.white : Colors.primary}
            style={[styles(isDark).searchIcon, { right: 48 }]} onPress={rightIconPress2}
          />
        )}
        {ShowWorkStatusInstruction && (
          <View style={{ position: 'absolute', right: 16, gap: 2 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Icon source={'checkbox-blank-circle'} size={14} color={isDark ? Colors.secondary : Colors.secondary} />
              <Text style={[styles(isDark).title, { fontSize: 12, marginLeft: 5 }]}>{'Logged Hours'}</Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Icon source={'checkbox-blank-circle'} size={14} color={isDark ? Colors.darkgreen : Colors.darkgreen} />
              <Text style={[styles(isDark).title, { fontSize: 12, marginLeft: 5 }]}>{'Approved Hours'}</Text>
            </View>

          </View>

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
    allocationtxt: {
      fontSize: 16,
      fontFamily: 'Lato-Semibold',
      position: 'absolute',
      right: 20,
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
