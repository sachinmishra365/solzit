import React, { useState } from 'react';
import { View } from 'react-native';
import { List } from 'react-native-paper';
import { useSelector } from 'react-redux';
import { isDarkTheme } from '../AppStore/Reducers/appState';
import { Colors } from '../constants/Colors';

const CustomDropdown = ({
  label = 'Select',
  selectedValue,
  options = [],
  onSelect,

}:any) => {
     const isDark = useSelector(isDarkTheme);
  const [expanded, setExpanded] = useState(false);
  
  return (
    <View>
      <List.Accordion
        title={selectedValue?.label || label}
        expanded={expanded}
        onPress={() => setExpanded(!expanded)}
        titleStyle={{
          color: isDark ? Colors.white : Colors.black,
          fontFamily: 'Lato-Bold',
        }}
        style={{
          backgroundColor: isDark ? Colors.black : Colors.background,
          borderColor: isDark ? Colors.background : Colors.primary,
          borderWidth: 1,
          borderRadius: 1,
          height: 57,
        }}
        right={props => (
          <List.Icon
            {...props}
            icon="chevron-down"
            color={isDark ? Colors.white : Colors.black}
          />
        )}>
        {options.map((option:any) => (
          <List.Item
            key={option.value}
            title={option.label}
            titleStyle={{
              color: isDark ? Colors.white : Colors.black,
              fontFamily: 'Lato-Regular',
            }}
            style={{
              backgroundColor: isDark ? Colors.gray : Colors.background,
              borderRadius: 1,
            }}
            onPress={() => {
              onSelect(option);
              setExpanded(false);
            }}
          />
        ))}
      </List.Accordion>
    </View>
  );
};

export default CustomDropdown;
