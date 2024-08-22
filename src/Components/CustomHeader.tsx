import {Dimensions, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {IconButton} from 'react-native-paper';
import {Colors} from '../constants/Colors';

const {width} = Dimensions.get('window');

const CustomHeader = ({
  showBackIcon = false,
  onPress,
  title,
  searchOnPress,
  showSearchIcon = false,
}: any) => {
  return (
    <View style={styles.container}>
      {showBackIcon ? (
        <IconButton
          icon="chevron-left"
          iconColor={'#fff'}
          size={25}
          onPress={onPress}
        />
      ) : (
        <IconButton
          icon="menu"
          iconColor={'#fff'}
          size={25}
          onPress={onPress}
        />
      )}

      <Text style={styles.title}>{title}</Text>
      {showSearchIcon && (
        <IconButton
          icon="card-search-outline"
          iconColor={'#fff'}
          size={25}
          onPress={searchOnPress}
          style={styles.searchIcon}
        />
      )}
    </View>
  );
};

export default CustomHeader;

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.black,
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
    color: '#fff',
    marginTop: 2,
  },
  searchIcon: {
    position: 'absolute',
    right: 0,
  },
});
