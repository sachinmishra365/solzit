import {View} from 'react-native';
import React from 'react';
import {Button} from 'react-native-paper';

const CustomButton = ({title, icon, onPress}: any) => {
  return (
    <View style={{justifyContent: 'center', alignItems: 'center'}}>
      <Button
        style={{width: '30%'}}
        icon={icon}
        mode="contained"
        onPress={onPress}>
        {title}
      </Button>
    </View>
  );
};

export default CustomButton;
