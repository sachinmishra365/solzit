import React from 'react';
import {StyleSheet, Text, View, TouchableOpacity, Image} from 'react-native';
import {IconButton} from 'react-native-paper';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import {useNavigation, useRoute} from '@react-navigation/native';
import {useSelector} from 'react-redux';
import moment from 'moment';

const Aboutleavedetails = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const proceed = useSelector((state: any) => state?.appState?.processed);

  const leaveApplicationId = route?.params?.leaveApplicationId;

  // Find the matching leave application details
  const matchedLeave = proceed?.find(
    (item: any) => item.leaveApplicationId === leaveApplicationId,
  );
// console.log('matchedLeave',route)
  return (
    <View style={{flex: 1}}>
      <View style={{flex: 0.35}}>
        <IconButton
          icon="close"
          iconColor={Colors.black}
          size={25}
          onPress={() => {
            navigation.goBack();
          }}
          style={{  
            position: 'absolute',
            top: 10,
            left: 10,
            zIndex: 1,
          }}
        />
        <Image
          source={require('../../Assets/Images/Logo/soluzione.jpg')}
          style={{width: '100%', height: '100%'}}
           resizeMode="cover"
        />
      </View>

      {matchedLeave ? (
        <View
          style={{
            flex: 0.65,
            borderTopLeftRadius: 15,
            borderTopRightRadius: 15,
            elevation: 5,
            padding: 20,
            backgroundColor: Colors.black,
          }}>
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <View>
              <Text style={styles.label}>Start Date :</Text>
              <Text style={styles.label}>End Date :</Text>
              <Text style={styles.label}>Applied On :</Text>
              <Text style={styles.label}>Status :</Text>
              <Text style={styles.label}>Absent Day :</Text>
              <Text style={styles.label}>Leave Day :</Text>
              <Text style={styles.label}>Leave Type :</Text>
            </View>
            <View>
              <Text style={styles.value}>
                {moment(matchedLeave?.leaveStartDate).format('YYYY-MM-DD')}
              </Text>
              <Text style={styles.value}>
                {moment(matchedLeave?.leaveEndDate).format('YYYY-MM-DD')}
              </Text>
              <Text style={styles.value}>
                {moment(matchedLeave?.appliedOn).format('YYYY-MM-DD')}
              </Text>
              <Text style={styles.value}>{matchedLeave?.Status?.Label}</Text>
              <Text style={styles.value}>{matchedLeave?.totalAbsentDays}</Text>
              <Text style={styles.value}>{matchedLeave?.totalDaysofLeave}</Text>
              <Text style={styles.value}>{matchedLeave?.leaveType?.Label}</Text>
            </View>
          </View>
        </View>
      ) : (
        <View style={styles.noDataView}>
          <Text style={styles.noDataText}>
            No details found for this leave.
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  label: {
    color: Colors.white,
    fontSize: 14,
    fontWeight: '600',
  },
  value: {
    color: Colors.white,
    fontSize: 14,
    fontWeight: '600',
  },
  cancelButton: {
    width: '30%',
    height: 30,
    backgroundColor: Colors.black,
    justifyContent: 'center',
    alignSelf: 'center',
    borderRadius: 3,
  },
  cancelButtonText: {
    textAlign: 'center',
    fontWeight: '600',
    color: Colors.white,
  },
  noDataView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noDataText: {
    color: Colors.white,
    fontSize: 16,
  },
});

export default Aboutleavedetails;
