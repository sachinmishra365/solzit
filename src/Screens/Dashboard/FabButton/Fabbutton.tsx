import {useNavigation} from '@react-navigation/native';
import * as React from 'react';
import {FAB} from 'react-native-paper';
import {Colors} from '../../../constants/Colors';

const Fabbutton = () => {
  const navigation = useNavigation();
  const [state, setState] = React.useState({open: false});

  const onStateChange = ({open}: any) => setState({open});

  const {open} = state;

  return (
    <FAB.Group
      open={open}
      visible
      icon={open ? 'close' : 'plus'}
      color='white'
      style={{elevation:5}}
      actions={[
        {
          icon: 'card-account-details',
          color:'white',
          labelStyle:{color:'white'},
          label: 'Processed Leave',
          onPress: () => navigation.navigate('LeaveBalance'),
          style: {backgroundColor: Colors.gray},
        },
        {
          icon: 'calendar-clock',
          label: 'My Leave Requests',
          color:'white',
          labelStyle:{color:'white'},
          onPress: () => navigation.navigate('LeaveRequest'),
          style: {backgroundColor: Colors.gray},
        },
        {
          icon: 'airplane',
          label: 'Apply Leave',
          color:'white',
          labelStyle:{color:'white'},
          onPress: () => navigation.navigate('ApplyLeave'),
          style: {backgroundColor: Colors.gray},
        },
      ]}
      onStateChange={onStateChange}
      backdropColor='#000'
      fabStyle={{backgroundColor:Colors.gray,elevation:10}}
      onPress={() => {
        if (open) {
          // do something if the speed dial is open
        }
      }}
    />
  );
};

export default Fabbutton;
