import {useNavigation} from '@react-navigation/native';
import * as React from 'react';
import {FAB} from 'react-native-paper';
import {Colors} from '../../../constants/Colors';
import { useSelector } from 'react-redux';
import { isDarkTheme } from '../../../AppStore/Reducers/appState';
import { StyleSheet } from 'react-native';

const Fabbutton = () => {
  const navigation:any = useNavigation();
  const isDark = useSelector(isDarkTheme);

  const [state, setState] = React.useState({open: false});

  const onStateChange = ({open}: any) => setState({open});

  const {open} = state;

  return (
    <FAB.Group
      open={open}
      visible
      icon={open ? 'close' : 'plus'}
      color={isDark ? Colors.white : Colors.white}
      style={{elevation:5}}
      actions={[
        {
          icon: 'card-account-details',
          color:isDark ? Colors.white : Colors.white,
          labelStyle:{color:isDark ? Colors.white : Colors.black, fontFamily:'Lato-Bold'},
          label: 'Processed Leaves',
          onPress: () => navigation.navigate('LeaveBalance'),
          style: {backgroundColor: isDark ? Colors.gray : Colors.primary,},
        },
        {
          icon: 'calendar-clock',
          label: 'My Leave Requests',
          color:isDark ? Colors.white : Colors.white,
          labelStyle:{color:isDark ? Colors.white : Colors.black, fontFamily:'Lato-Bold'},
          onPress: () => navigation.navigate('LeaveRequest'),
          style: {backgroundColor: isDark ? Colors.gray : Colors.primary},
        },
        {
          icon: 'airplane',
          label: 'Apply Leave',
          color:isDark ? Colors.white : Colors.white,
          labelStyle:{color:isDark ? Colors.white : Colors.black, fontFamily:'Lato-Bold'},
          onPress: () => navigation.navigate('ApplyLeave'),
          style: {backgroundColor: isDark ? Colors.gray : Colors.primary},
        },
      ]}
      onStateChange={onStateChange}
      backdropColor={isDark ? Colors.black : Colors.background}
      fabStyle={{
        backgroundColor:isDark ? Colors.gray : Colors.primary,
        elevation:10}}
      onPress={() => {
        if (open) {
          // do something if the speed dial is open
        }
      }}
    />
  );
};

export default Fabbutton;
const styles = (isDark: any) =>
  StyleSheet.create({

});
