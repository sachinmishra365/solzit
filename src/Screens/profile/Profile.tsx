import {
  Alert,
  Image,
  Linking,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useMemo, useState} from 'react';
import CustomHeader from '../../Components/CustomHeader';
import {useNavigation} from '@react-navigation/native';
import {useSelector} from 'react-redux';
import {Card, IconButton} from 'react-native-paper';
import {isDarkTheme} from '../../AppStore/Reducers/appState';
// import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import {Colors} from '../../constants/Colors';
import {useEmployeeUpdateProfileMutation} from '../../Services/appLevel';
import Toast from 'react-native-toast-message';
import {PERMISSION_TYPE, PermissionHandler} from '../../permissions';
import Placeholder from '../Placeholder/Placeholder';

import ImageCropPicker, {
  ImageOrVideo,
  Image as CropImage,
  Video as CropVideo,
} from 'react-native-image-crop-picker';

const Profile = () => {
  const navigation = useNavigation();
  const isDark = useSelector(isDarkTheme);
  const EmployeeId = useSelector((state: any) => state?.appState?.authToken);
  const Profiledata = EmployeeId?.userProfile;
   
  const connected = useSelector((state: any) => state?.appState?.connected);
  const Assesstoken = useSelector((state: any) => state?.appState?.authToken);
  const accessToken = Assesstoken?.authToken?.accessToken;
  const base64Image = `data:image/jpeg;base64,${Profiledata?.employeeImg}`;
  // const base64Image = useMemo(
  //   () => `data:image/jpeg;base64,${Profiledata?.employeeImg}`,
  //   [Profiledata?.employeeImg]
  // );

  const [imageAsset, setImageAsset] = useState<any>(null);
  
  const [modalVisible, setModalVisible] = useState(false);

  const handlePick = async (
    action: () => Promise<ImageOrVideo | ImageOrVideo[]>,
  ) => {
    try {
      const result = await action();
      if (Array.isArray(result)) {
        setImageAsset(result as CropImage[]);
      } else {
        setImageAsset(result as CropImage);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const openModal = async () => {
    const cameraPermission = await PermissionHandler.checkPermission(
      PERMISSION_TYPE.camera,
    );

    const photosPermission = await PermissionHandler.checkPermission(
      PERMISSION_TYPE.photos,
    );

    if (!cameraPermission) {
      Linking.openSettings();
      return;
    }

    if (cameraPermission) {
      setModalVisible(true);
    }
  };

  const pickSingleWithCamera = (
    cropping = false,
    mediaType: 'photo' | 'video' = 'photo',
  ) => {
    handlePick(() =>
      ImageCropPicker.openCamera({
        cropping,
        width: 500,
        height: 500,
        includeExif: true,
        mediaType,
        includeBase64: true,
      }),
    );
  };
  
  const pickSingleWithGallary = (
    cropping = false,
    mediaType: 'photo' | 'video' = 'photo',
  ) => {
    handlePick(() =>
      ImageCropPicker.openPicker({
        cropping,
        width: 500,
        height: 500,
        includeExif: true,
        mediaType,
        includeBase64: true,
      }),
    );
  };

  const [updateProfile, {isLoading}] = useEmployeeUpdateProfileMutation();

  const handleUpdateImage = async () => {
    if (!connected) {
      Toast.show({
        type: 'error',
        text1: 'Network Error',
        text2: 'Please check your internet connection',
        text2Style: {
          flexWrap: 'wrap',
          fontSize: 20,
          fontFamily: 'Lato-Regular',
        },
        topOffset: 80,
        visibilityTime: 5000,
      });
      return;
    }
    try {
      const data = {
        // email: Profiledata.email,
        profileImage: imageAsset?.base64 || imageAsset.uri || imageAsset.data,
      };

      const response = await updateProfile({data,accessToken});     
      
      if (response?.data?.isSuccessful === true) {
        Toast.show({
          type: 'success',
          text1: 'Profile Update Status',
          text2: response?.data?.messageDetail?.message,
          text2Style: {
            flexWrap: 'wrap',
            fontSize: 13,
            fontFamily: 'Lato-Regular',
          },
          topOffset: 80,
          visibilityTime: 7000,
        });
      }
    } catch (error) {
      console.error('Image update failed:', error);
    }
  };

  useEffect(() => {
    if (imageAsset != null) {
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
      {isLoading ? (
        <Placeholder />
      ) : (
        <Card style={styles(isDark).cardcontainer}>
          <IconButton
            style={{position: 'absolute', top: -10, right: -5}}
            icon="account-edit"
            iconColor={Colors.primary}
            size={30}
            onPress={openModal}
          />
          <TouchableOpacity
            style={{alignItems: 'center', marginBottom: 40}}
            onPress={openModal}>
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
                source={{
                  uri: imageAsset?.data ?
                  `data:image/jpeg;base64,${imageAsset?.data}`
                  : base64Image,
                }}
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
      )}

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
                  source={{uri: `data:image/jpeg;base64,${imageAsset?.data}`}}
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
                onPress={() => pickSingleWithCamera(true)}>
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
                onPress={() => pickSingleWithGallary(true)}>
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
                    marginRight: 12,
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
