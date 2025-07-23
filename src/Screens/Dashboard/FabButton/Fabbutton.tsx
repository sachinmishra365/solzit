import {useNavigation} from '@react-navigation/native';
import * as React from 'react';
import {FAB} from 'react-native-paper';
import {Colors} from '../../../constants/Colors';
import {useDispatch, useSelector} from 'react-redux';
import {isDarkTheme, setDashboardZIndex} from '../../../AppStore/Reducers/appState';

const Fabbutton = () => {
  const navigation: any = useNavigation();
  const isDark = useSelector(isDarkTheme);
   const dispatch= useDispatch();
  const [state, setState] = React.useState({open: false});
  const onStateChange = ({open}: any) => setState({open});

  const {open} = state;

  return (
    <FAB.Group
      open={open}
      visible
      icon={open ? 'close' : 'plus'}
      color={isDark ? Colors.white : Colors.white}
      style={{elevation: 5}}
      accessibilityLabel="Fab Button Screen"
      actions={[
        {
          icon: 'card-account-details',
          color: isDark ? Colors.white : Colors.white,
          labelStyle: {
            color: isDark ? Colors.white : Colors.black,
            fontFamily: 'Lato-Semibold',
            marginVertical:5,
            fontSize: 16,
          },
          label: 'Processed Leaves',
          onPress: () => navigation.navigate('LeaveBalance'),
          style: {backgroundColor: isDark ? Colors.gray : Colors.primary},
          accessibilityLabel: 'Processed Leaves',
          size:'small'
        },
        {
          icon: 'calendar',
          label: 'Worklogs Data',
          color: isDark ? Colors.white : Colors.white,
          labelStyle: {
            color: isDark ? Colors.white : Colors.black,
            fontFamily: 'Lato-Semibold',
            marginVertical:5,
            fontSize: 16,
          },
          onPress: () => {navigation.navigate('WorklogHour');dispatch(setDashboardZIndex(true))},
          style: {backgroundColor: isDark ? Colors.gray : Colors.primary},
          accessibilityLabel: 'My Leave Requests',
          size:'small'

        },
        {
          icon: 'airplane',
          label: 'Apply Leave',
          color: isDark ? Colors.white : Colors.white,
          labelStyle: {
            color: isDark ? Colors.white : Colors.black,
            fontFamily: 'Lato-Semibold',
            marginVertical:5,
            fontSize: 16,
          },
          onPress: () => navigation.navigate('ApplyLeave'),
          style: {backgroundColor: isDark ? Colors.gray : Colors.primary},
          accessibilityLabel: 'Apply Leave',
          size:'small'
        },
      ]}
      onStateChange={onStateChange}
      backdropColor={isDark ? Colors.black : Colors.white}
      fabStyle={{
        backgroundColor: isDark ? Colors.gray : Colors.primary,
        elevation: 10,
      }}
      
    />
  );
};

export default Fabbutton;
