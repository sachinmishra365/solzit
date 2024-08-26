import {Image, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import CustomHeader from '../../Components/CustomHeader';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import {useNavigation} from '@react-navigation/native';
import {useSelector} from 'react-redux';
import {Card} from 'react-native-paper';
import moment from 'moment';

const Profile = () => {
  const navigation = useNavigation();
  const EmployeeId = useSelector((state: any) => state?.appState?.authToken);
  const Profiledata = EmployeeId?.data?.Data;
  const base64Image = `data:image/jpeg;base64,${Profiledata?.employeeImg}`;

  return (
    <View style={{flex: 1, backgroundColor: Colors.black}}>
      <CustomHeader
        showBackIcon={true}
        title="Profile"
        onPress={() => {
          navigation.goBack();
        }}
      />

      <Card
        style={{
          backgroundColor: Colors.black,
          borderWidth: 0.5,
          borderColor: Colors.white,
          marginHorizontal: 16,
          padding: 10,
          marginTop:20
        }}>
        <View style={{alignItems: 'center', marginBottom: 40}}>
          <Image
            style={{height: 100, width: 100, borderRadius: 50}}
            source={{uri:base64Image}}
          />
        </View>

        <View style={{flexDirection: 'row', justifyContent: 'space-around'}}>
          <View>
            <Text style={{color: Colors.white, fontWeight: '500'}}>EMP ID{' : '}</Text>
            <Text style={{color: Colors.white, fontWeight: '500'}}>Email{' : '}</Text>
            <Text style={{color: Colors.white, fontWeight: '500'}}>
              Designation{' : '}
            </Text>
            <Text style={{color: Colors.white, fontWeight: '500'}}>
              Joining Date{' : '}
            </Text>

            <Text style={{color: Colors.white, fontWeight: '500'}}>
              Reporting Manager{' : '}
            </Text>
          </View>
          <View>
            <Text style={{color: Colors.white}}>{Profiledata?.userName}</Text>

            <Text style={{color: Colors.white}}>
              {Profiledata?.employee?.email}
            </Text>

            <Text style={{color: Colors.white}}>
              {Profiledata?.designation}
            </Text>

            <Text style={{color: Colors.white}}>
              {moment(Profiledata?.joiningDate).format('DD/MM/YY')}
            </Text>

            <Text style={{color: Colors.white}}>
              {Profiledata?.reportingManager?.Name}
            </Text>
          </View>
        </View>
      </Card>

      {/* <Card style={{backgroundColor:Colors.black,borderWidth:0.5,borderColor:Colors.white,marginHorizontal:16,padding:10}}>
        <View style={{alignItems: 'center', marginBottom: 40}}>
          <Image
            style={{height: 100, width: 100, borderRadius: 50}}
            source={require('../../Assets/Images/photo.jpg')}
          />
        </View>

        <View style={{alignSelf:'center'}}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              width: '90%',
            }}>
            <Text style={{color: Colors.white, fontWeight: '500'}}>EMP ID</Text>
            <Text style={{color: Colors.white}}>{Profiledata?.userName}</Text>
          </View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              width: '90%',
            }}>
            <Text style={{color: Colors.white, fontWeight: '500'}}>Email</Text>
            <Text style={{color: Colors.white}}>
              {Profiledata?.employee?.email}
            </Text>
          </View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              width: '90%',
            }}>
            <Text style={{color: Colors.white, fontWeight: '500'}}>
              Designation
            </Text>
            <Text style={{color: Colors.white}}>
              {Profiledata?.designation}
            </Text>
          </View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              width: '90%',
            }}>
            <Text style={{color: Colors.white, fontWeight: '500'}}>
              Joining Date
            </Text>
            <Text style={{color: Colors.white}}>
              {Profiledata?.joiningDate}
            </Text>
          </View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              width: '90%',
            }}>
            <Text style={{color: Colors.white, fontWeight: '500'}}>
              Reporting Manager
            </Text>
            <Text style={{color: Colors.white}}>
              {Profiledata?.reportingManager?.Name}
            </Text>
          </View>
        </View>
      </Card> */}
    </View>
  );
};

export default Profile;

const styles = StyleSheet.create({});
