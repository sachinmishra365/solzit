import {
  Dimensions,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React from 'react';
import {IconButton} from 'react-native-paper';
import {Colors} from '../constants/Colors';
import {useSelector} from 'react-redux';
import {isDarkTheme} from '../AppStore/Reducers/appState';

const {width} = Dimensions.get('window');

const CustomHeader = ({
  showBackIcon = false,
  onPress,
  title,
  searchOnPress,
  showSearchIcon = false,
  onSearchChange,
  searchValue,
  showSearch = false,
  showFilterIcon=false,
  filterOnPress
}: any) => {
  const isDark = useSelector(isDarkTheme);

  return (
    <View style={styles(isDark).container}>
      {showBackIcon ? (
        <IconButton
          icon="chevron-left"
          iconColor={isDark ? Colors.white : Colors.black}
          size={25}
          onPress={onPress}
          accessibilityLabel="Back"
        />
      ) : (
        <IconButton
          icon="menu"
          iconColor={isDark ? Colors.white : Colors.black}
          size={25}
          onPress={onPress}
          accessibilityLabel="Menu"
        />
      )}
      <Text style={styles(isDark).title}>{title}</Text>
      {showSearchIcon && (
        <IconButton
          icon="card-search-outline"
          iconColor={'#fff'}
          size={25}
          onPress={searchOnPress}
          style={styles(isDark).searchIcon}
          accessibilityLabel="Search"
        />
      )}
      {showFilterIcon && (
        <IconButton
          icon="filter"
          iconColor={isDark ? Colors.white : Colors.primary}
          size={25}
          onPress={filterOnPress}
          style={styles(isDark).searchIcon}
          accessibilityLabel="filter"
        />
      )}
      {showSearch && (
        <TextInput
          style={styles(isDark).searchInput}
          placeholder=" Search "
          placeholderTextColor={isDark ? Colors.medium_gray : Colors.dark_gray}
          value={searchValue}
          onChangeText={onSearchChange}
          
        />
      )}
    </View>
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
