import { Dimensions, Image, StyleSheet, Text, TextInput, View } from 'react-native';
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
  titleImage, 
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
  marginRight = 0,
  divider = true,
  showLogo = false,
}: any) => {
  const isDark = useSelector(isDarkTheme);

  return (
    <>
      <View style={styles(isDark).container}>
        {showBackIcon ? (
          <IconButton icon="chevron-left" size={25} accessibilityLabel="Back"
            iconColor={isDark ? Colors.white : Colors.white}
            onPress={onPress}
            style={{ marginTop: 8 }}
          />
        ) : (
          <IconButton icon="menu" size={25} accessibilityLabel="Menu"
            iconColor={isDark ? Colors.white : Colors.white}
            onPress={onPress}
          />
        )}
        {titleImage ? (
        <Image
          source={titleImage}
          style={{ width: 100, height: 25, resizeMode: 'contain' }}
        />
      ) : (
        <Text style={styles(isDark).title}>{title}</Text>
      )}

        {showFilterIcon && (
          <IconButton icon="filter" size={25} accessibilityLabel="filter"
            iconColor={isDark ? Colors.white : Colors.white}
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
            iconColor={isDark ? Colors.white : Colors.white}
            style={[styles(isDark).searchIcon, { right: 0 }]} onPress={rightIconPress}
          />
        )}
        {showLogo && (
          <Image
            source={require('../Assets/Images/Logo/solzitLogo.png')}
            style={[{ width: 27, height: 27, borderRadius: 15, right: 0}, styles(isDark).searchIcon ]}
          />
        )}
        {showRightIcon2 && (
          <IconButton icon={rightIconName2} size={25}
            iconColor={isDark ? Colors.white : Colors.white}
            style={[styles(isDark).searchIcon, { right: marginRight }]} onPress={rightIconPress2}
          />
        )}
      </View>
      {
        divider && (
          <View
            style={{
              borderWidth: 1, height: 1,
              backgroundColor: isDark ? Colors.white : 'transparent',
              borderColor: isDark ? Colors.black : 'transparent',
              elevation: 5,

            }}
          />
        )
      }
    </>
  );
};

export default CustomHeader;

const styles = (isDark: any) =>
  StyleSheet.create({
    container: {
      backgroundColor: isDark ? Colors.black : Colors.primary,
      height: 60,
      width: width,
      flexDirection: 'row',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 1,
      alignItems: 'center',
    },
    title: {
      fontSize: 18,
      color: isDark ? Colors.white : Colors.white,
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
      borderColor: isDark ? Colors.background : Colors.white,
      borderWidth: 0.5,
      fontSize: 12,
      fontFamily: 'Lato-Semibold',
      marginHorizontal: 16,
      color: isDark ? Colors.white : Colors.black,
    },
  });
