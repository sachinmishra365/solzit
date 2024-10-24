import {
  Alert,
  Image,
  Modal,
  PermissionsAndroid,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import CustomHeader from '../../Components/CustomHeader';
import {useNavigation} from '@react-navigation/native';
import {useSelector} from 'react-redux';
import {Card, IconButton} from 'react-native-paper';
import {isDarkTheme} from '../../AppStore/Reducers/appState';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import {Colors} from '../../constants/Colors';
import {useEmployeeUpdateProfileMutation} from '../../Services/appLevel';
import Toast from 'react-native-toast-message';

const Profile = () => {
  const navigation = useNavigation();
  const isDark = useSelector(isDarkTheme);
  const EmployeeId = useSelector((state: any) => state?.appState?.authToken);
  const Profiledata = EmployeeId?.userProfile;
  const base64Image = `data:image/jpeg;base64,${Profiledata?.employeeImg}`;

  const [imageAsset, setImageAsset] = useState(null); 
  const [modalVisible, setModalVisible] = useState(false);
  

  const requestPermissions = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.CAMERA,
          PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        ]);
        return (
          granted['android.permission.CAMERA'] ===
            PermissionsAndroid.RESULTS.GRANTED &&
          granted['android.permission.READ_EXTERNAL_STORAGE'] ===
            PermissionsAndroid.RESULTS.GRANTED
        );
      } catch (err) {
        console.warn(err);
        return false;
      }
    }
    return true; 
  };

  const openImagePicker = async (type: string) => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) {
      Alert.alert(
        'Permissions Required',
        'Please grant the required permissions.',
      );
      return;
    }
    const options = {
      includeBase64: true,
      mediaType: 'photo',
      quality: 1,
    };

    const pickerFunction =
      type === 'camera' ? launchCamera : launchImageLibrary;

    pickerFunction(options, response => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.errorMessage) {
        console.log('Image Picker Error: ', response.errorMessage);
      } else {
        const asset = response.assets[0];
        setImageAsset(asset); 
        // console.log('Selected Asset:', asset);
        setModalVisible(false); 
      }
    });
  };

  const [updateProfile, result] = useEmployeeUpdateProfileMutation();

  const handleUpdateImage = async () => {
    try {
      const body = {
        email: Profiledata.email,
        profileImage: imageAsset?.base64 || imageAsset.uri, 
      };
  
      const response = await updateProfile(body); 
      
      if (response?.data?.isSuccessful === true) {
        Toast.show({
          type: 'success',
          text1: 'Profile Update Status',
          text2: response?.data?.messageDetail?.message,
          text2Style: { flexWrap: 'wrap', fontSize: 13,fontFamily:'Lato-Regular'},
          topOffset: 80,
          visibilityTime: 7000, 
        });
      }
    } catch (error) {
      console.error('Image update failed:', error);
      Alert.alert('Error', 'Failed to update profile image.');
    }
  };

  useEffect(() => {
    if(imageAsset != null){
      handleUpdateImage();
    }
  }, [imageAsset]);

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
          backgroundColor: isDark ? Colors.white : 'transparent',
          borderColor: isDark ? Colors.black : 'transparent',
        }}
      />

      <Card style={styles(isDark).cardcontainer}>
      <IconButton
                style={{position:'absolute',top:-10,right:-5}}
                icon="account-edit"
                iconColor={Colors.primary}
                size={30}
                onPress={() => setModalVisible(true)}
              />
        <TouchableOpacity
          style={{alignItems: 'center', marginBottom: 40}}
          onPress={() => setModalVisible(true)}>
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
              source={{uri: imageAsset?.uri ? imageAsset?.uri : base64Image}}
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
              source={
                imageAsset?.uri 
                  ? { uri: imageAsset.uri } 
                  : require('../../Assets/Images/profile.png')
              }
            />
          )}
        </TouchableOpacity>

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
            <Text style={[styles(isDark).txt, {fontFamily: 'Lato-Semibold'}]}>
              Email{' : '}
            </Text>
            <Text style={styles(isDark).txt}>
              {Profiledata?.email ? Profiledata?.email : 'N/A'}
            </Text>
          </View>

          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
            }}>
            <Text style={[styles(isDark).txt, {fontFamily: 'Lato-Semibold'}]}>
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
            <Text style={[styles(isDark).txt, {fontFamily: 'Lato-Semibold'}]}>
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

      <Modal
        visible={modalVisible}
        transparent={false}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
        style={styles(isDark).modalContainer}>
        <View style={styles(isDark).modalContainer}>
          <View style={styles(isDark).modalContent}>
            <Text style={styles(isDark).header}>Select Image</Text>

            <View style={styles(isDark).imageContainer}>
              {imageAsset ? (
                <Image
                  source={{uri: imageAsset?.uri}}
                  style={styles(isDark).image}
                />
              ) : Profiledata?.employeeImg ? (
                <Image
                  source={{uri: base64Image}}
                  style={styles(isDark).image}
                />
              ) : (
                <Image
                  source={require('../../Assets/Images/profile.png')}
                  style={styles(isDark).image}
                />
              )}
            </View>

            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-evenly',
                width: '100%',
              }}>
              <TouchableOpacity
                style={{
                  height: 'auto',
                  backgroundColor: '#FEBE05',
                  justifyContent: 'center',
                  alignSelf: 'center',
                  borderRadius: 3,
                  alignItems: 'center',
                  flexDirection: 'row',
                }}
                // disabled={result.isLoading}
                onPress={() => openImagePicker('camera')}>
                <IconButton
                  style={{margin: -2}}
                  icon="camera"
                  iconColor={Colors.white}
                  size={18}
                />
                <Text
                  style={{
                    textAlign: 'center',
                    fontFamily: 'Lato-Bold',
                    color: Colors.white,
                    flexWrap: 'wrap',
                    marginRight: 12,
                  }}>
                  Camera
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={{
                  backgroundColor: Colors.primary,
                  justifyContent: 'center',
                  alignSelf: 'center',
                  borderRadius: 3,
                  alignItems: 'center',
                  flexDirection: 'row',
                  height: 'auto',
                }}
                onPress={() => openImagePicker('gallery')}>
                <IconButton
                  style={{margin: -2}}
                  icon="account-box"
                  iconColor={Colors.white}
                  size={18}
                />
                <Text
                  style={{
                    textAlign: 'center',
                    fontFamily: 'Lato-Bold',
                    color: Colors.white,
                    flexWrap: 'wrap',
                    fontSize: 12,
                    marginRight: 5,
                  }}>
                  Gallary
                </Text>
              </TouchableOpacity>
            </View>

            <IconButton
              style={{position: 'absolute', top: 0, right: 0}}
              icon="close-octagon"
              iconColor={Colors.error}
              size={30}
              onPress={() => setModalVisible(false)}
            />
          </View>
        </View>
      </Modal>
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
      fontFamily: 'Lato-Bold',
    },
    txt: {
      color: isDark ? Colors.white : Colors.black,
      marginVertical: 10,
      fontFamily: 'Lato-Regular',
    },
    modalContainer: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.5)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    modalContent: {
      width: '80%',
      backgroundColor: 'white',
      padding: 20,
      borderRadius: 10,
      justifyContent: 'center',
      alignItems: 'center',
    },
    header: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 20,
    },
    imageContainer: {
      width: 200,
      height: 200,
      marginBottom: 20,
      borderRadius: 10,
      borderWidth: 1,
      borderColor: '#ccc',
      justifyContent: 'center',
      alignItems: 'center',
    },
    image: {
      width: '100%',
      height: '100%',
      borderRadius: 10,
    },
  });
