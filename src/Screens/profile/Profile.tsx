import {Image, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import CustomHeader from '../../Components/CustomHeader';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import {useNavigation} from '@react-navigation/native';
import {useSelector} from 'react-redux';
import {Card, IconButton} from 'react-native-paper';

const Profile = () => {
  const navigation = useNavigation();
  const EmployeeId = useSelector((state: any) => state?.appState?.authToken);
  const Profiledata = EmployeeId?.data?.Data;
  const base64Image = `data:image/jpeg;base64,${Profiledata?.employeeImg}`;
  console.log(Profiledata);

  return (
    <View style={{flex: 1, backgroundColor: Colors.black}}>
      <CustomHeader
        showBackIcon={true}
        title="Profile"
        onPress={() => {
          navigation.goBack();
        }}
      />
      <View
        style={{borderWidth: 1, backgroundColor: Colors.white, height: 1}}
      />

      <Card
        style={{
          backgroundColor: Colors.black,
          borderWidth: 0.5,
          borderColor: Colors.white,
          marginHorizontal: 16,
          padding: 10,
          marginTop: 60,
        }}>
        <View style={{alignItems: 'center', marginBottom: 40}}>
          {Profiledata?.employeeImg ? (
            <Image
              style={{
                height: 110,
                width: 110,
                borderRadius: 100,
                position: 'absolute',
                top: -55,
                left: 10,
              }}
              source={{uri: base64Image}}
            />
          ) : (
            <Image
              style={{
                height: 110,
                width: 110,
                borderRadius: 100,
                position: 'absolute',
                top: -55,
                left: 10,
              }}
              source={require('../../Assets/Images/profile.png')}
            />
          )}
        </View>

        <View
          style={{
            flexDirection: 'row',
            marginTop: 30,
            flexWrap: 'wrap',
          }}>
          <Text style={{color: Colors.white, fontSize: 22}}>
            {Profiledata?.fullName ? Profiledata?.fullName : 'N/A'}
            {' | '}
          </Text>
          <Text style={{color: Colors.white, fontSize: 22}}>
            {Profiledata?.designation ? Profiledata?.designation : 'N/A'}
          </Text>
        </View>

        <View
          style={{
            flexDirection: 'row',
            marginTop: 10,
          }}>
          <View>
            <Text style={{color: Colors.white, fontWeight: '500'}}>
              Email{' : '}
            </Text>

            <Text
              style={{
                color: Colors.white,
                fontWeight: '500',
                marginVertical: 10,
              }}>
              Employee ID{' : '}
            </Text>

            <Text style={{color: Colors.white, fontWeight: '500'}}>
              Reporting Manager{' : '}
            </Text>
          </View>

          <View>
            <Text style={{color: Colors.white}}>
              {Profiledata?.employee?.email
                ? Profiledata?.employee?.email
                : 'N/A'}
            </Text>

            <Text style={{color: Colors.white, marginVertical: 10}}>
              {Profiledata?.userName ? Profiledata?.userName : 'N/A'}
            </Text>

            <Text style={{color: Colors.white}}>
              {Profiledata?.reportingManager?.Name
                ? Profiledata?.reportingManager?.Name
                : 'N/A'}
            </Text>
          </View>
        </View>
      </Card>
    </View>
  );
};

export default Profile;

const styles = StyleSheet.create({});
