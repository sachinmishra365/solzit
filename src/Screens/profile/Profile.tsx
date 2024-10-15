import {Image, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import CustomHeader from '../../Components/CustomHeader';
import {useNavigation} from '@react-navigation/native';
import {useSelector} from 'react-redux';
import {Card, IconButton} from 'react-native-paper';
import {isDarkTheme} from '../../AppStore/Reducers/appState';
import { Colors } from '../../constants/Colors';

const Profile = () => {
  const navigation = useNavigation();
  const isDark = useSelector(isDarkTheme);  
  const EmployeeId = useSelector((state: any) => state?.appState?.authToken);
  const Profiledata = EmployeeId?.userProfile;  
  const base64Image = `data:image/jpeg;base64,${Profiledata?.employeeImg}`;

  return (
    <View style={styles(isDark).maincontainer}>
      <CustomHeader
        showBackIcon={true}
        title="Profile"
        onPress={() => {
          navigation.goBack();
        }}
      />
      <View
        style={{
          borderWidth: 1,
          height: 1,
          backgroundColor: isDark ? Colors.white :'transparent',
          borderColor: isDark ? Colors.black : 'transparent',
        }}
      />

      <Card style={styles(isDark).cardcontainer}>
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
          <Text style={styles(isDark).usename}>
            {Profiledata?.fullName ? Profiledata?.fullName : 'N/A'}
            {' | '}
          </Text>
          <Text style={styles(isDark).usename}>
            {Profiledata?.designation ? Profiledata?.designation : 'N/A'}
          </Text>
        </View>

        <View
          style={{
            marginTop: 10,
          }}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
            }}>
            <Text style={[styles(isDark).txt, {fontFamily:'Lato-Semibold'}]}>
              Email{' : '}
            </Text>
            <Text style={styles(isDark).txt}>
              {Profiledata?.email
                ? Profiledata?.email
                : 'N/A'}
            </Text>
          </View>

          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
            }}>
            <Text style={[styles(isDark).txt, {fontFamily:'Lato-Semibold'}]}>
              Employee ID{' : '}
            </Text>
            <Text style={[styles(isDark).txt, {marginVertical: 10}]}>
              {Profiledata?.userName ? Profiledata?.userName : 'N/A'}
            </Text>
          </View>

          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
            }}>
            <Text style={[styles(isDark).txt, {fontFamily:'Lato-Semibold'}]}>
              Reporting Manager{' : '}
            </Text>

            <Text style={styles(isDark).txt}>
              {Profiledata?.reportingManager?.name
                ? Profiledata?.reportingManager?.name
                : 'N/A'}
            </Text>
          </View>
          
        </View>
      </Card>
      
    </View>
  );
};

export default Profile;

const styles = (isDark: any) =>
  StyleSheet.create({
    maincontainer: {
      flex: 1,
      backgroundColor: isDark ? Colors.black : Colors.white,
    },
    cardcontainer: {
      backgroundColor: isDark ? Colors.black : Colors.background,
      borderWidth: 0.5,
      borderColor: Colors.white,
      marginHorizontal: 16,
      padding: 10,
      marginTop: 60,
    },
    usename: {
      color: isDark ? Colors.white : Colors.black,
      fontSize: 20,
      fontFamily:'Lato-Bold'
    },
    txt: {
      color: isDark ? Colors.white : Colors.black,
      marginVertical: 10,
      fontFamily:'Lato-Regular'

    },
  });
