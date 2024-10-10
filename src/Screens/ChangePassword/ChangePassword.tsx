import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useSelector} from 'react-redux';
import {isDarkTheme} from '../../AppStore/Reducers/appState';
import {Colors} from '../../constants/Colors';
import CustomHeader from '../../Components/CustomHeader';
import {useNavigation} from '@react-navigation/native';
import {useChangePasswordMutation} from '../../Services/appLevel';
import CustomTextInput from '../../Components/CustomTextInput';
import {Formik} from 'formik';
import * as Yup from 'yup';
import {SCREEN_WIDTH} from '../../constants/Screen';
import Toast from 'react-native-toast-message';

const ChangePassword = () => {
  const navigation = useNavigation();
  const isDark = useSelector(isDarkTheme);
  const EmployeeId = useSelector((state: any) => state?.appState?.authToken);
  console.log('e',EmployeeId);
  
  const [showPassword, setShowPassword] = useState(true);
  const [showNewPassword, setShowNewPassword] = useState(true);
  const [showConfirmPassword, setShowConfirmPassword] = useState(true);

  const [ChangePassword, {isSuccess, isLoading}] = useChangePasswordMutation();

  const validationSchema = Yup.object().shape({
    email: Yup.string().email('Invalid email').required('Email is required'),
    Oldpassword: Yup.string().required('Old password is required'),
    Newpassword: Yup.string()
      .required('New password is required')
      .min(6, 'Password must be at least 6 characters'),
    ConfirmPassword: Yup.string()
      .required('Confirm password is required')
      .oneOf([Yup.ref('Newpassword')], 'Passwords must match'),
  });

  const handleChangePassword = async (values: any) => {
    const data = {
      email: values.email,
      Oldpassword: values.Oldpassword,
      NewPassword: values.Newpassword,
    };

    try {
      const response = await ChangePassword(data).unwrap();
      console.log(response);

      // Alert.alert('Success', 'Password changed successfully!');
      Toast.show({
        type: 'success',
        text1: 'Password Change Status',
        text2: 'Password Change successfully',
        text1Style: {fontFamily: 'Lato-Regular'},
        text2Style: {
          flexWrap: 'wrap',
          fontSize: 13,
          fontFamily: 'Lato-Regular',
        },
        topOffset: 80,
        visibilityTime: 5000,
      });
    } catch (err) {
      // Alert.alert(
      //   'Error',
      //   error?.data?.message || 'Failed to change password.',
      // );
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Application failed. Please try again.',
        text1Style: {fontFamily: 'Lato-Regular'},
        text2Style: {
          flexWrap: 'wrap',
          fontSize: 13,
          fontFamily: 'Lato-Regular',
        },
        topOffset: 80,
        visibilityTime: 4000,
      });
    }
  };

  useEffect(() => {
    if (isSuccess) {
      // Handle success, if needed (e.g., navigate or reset form)
    }
  }, [isSuccess]);

  return (
    <View style={styles(isDark).maincontainer}>
      <CustomHeader
        showBackIcon={true}
        title="Change Password"
        onPress={() => navigation.goBack()}
      />
      <View
        style={{
          borderWidth: 1,
          height: 1,
          backgroundColor: isDark ? Colors.white : 'transparent',
          borderColor: isDark ? Colors.black : 'transparent',
        }}
      />

      <Formik
        initialValues={{
          email: EmployeeId?.userProfile?.email,
          Oldpassword: '',
          Newpassword: '',
          ConfirmPassword: '',
        }}
        validationSchema={validationSchema}
        onSubmit={handleChangePassword}>
        {({
          handleChange,
          handleBlur,
          handleSubmit,
          values,
          errors,
          touched,
        }) => (
          <View>
            <View style={{marginVertical: 16}} />
            <CustomTextInput
              label="email"
              value={values.email}
              autoFocus={false}
              secureTextEntry={false}
              leftIconName="email"
              readOnly={true}
            />
            {touched.email && errors.email && (
              <Text
                style={{
                  color: Colors.error,
                  marginLeft: 20,
                  fontFamily: 'Lato-Regular',
                }}>
                {errors?.email}
              </Text>
            )}
            <View style={{marginVertical: 16}} />
            <CustomTextInput
              label="Old Password"
              value={values.Oldpassword}
              secureTextEntry={showPassword}
              onChangeText={handleChange('Oldpassword')}
              onBlur={handleBlur('Oldpassword')}
              leftIconName="lock"
              rightIconName={showPassword ? 'eye-off' : 'eye'}
              editable={true}
              onPress={() => {
                setShowPassword(!showPassword);
              }}
            />
            {touched.Oldpassword && errors.Oldpassword && (
              <Text
                style={{
                  color: Colors.error,
                  marginLeft: 20,
                  fontFamily: 'Lato-Regular',
                }}>
                {errors.Oldpassword}
              </Text>
            )}
            <View style={{marginVertical: 16}} />
            <CustomTextInput
              label="New Password"
              value={values.Newpassword}
              secureTextEntry={showNewPassword}
              onChangeText={handleChange('Newpassword')}
              onBlur={handleBlur('Newpassword')}
              leftIconName="lock"
              rightIconName={showNewPassword ? 'eye-off' : 'eye'}
              editable={true}
              onPress={() => {
                setShowNewPassword(!showNewPassword);
              }}
            />
            {touched.Newpassword && errors.Newpassword && (
              <Text
                style={{
                  color: Colors.error,
                  marginLeft: 20,
                  fontFamily: 'Lato-Regular',
                }}>
                {errors.Newpassword}
              </Text>
            )}
            <View style={{marginVertical: 16}} />
            <CustomTextInput
              label="Confirm Password"
              value={values.ConfirmPassword}
              secureTextEntry={showConfirmPassword}
              onChangeText={handleChange('ConfirmPassword')}
              onBlur={handleBlur('ConfirmPassword')}
              leftIconName="lock"
              rightIconName={showConfirmPassword ? 'eye-off' : 'eye'}
              editable={true}
              onPress={() => {
                setShowConfirmPassword(!showConfirmPassword);
              }}
            />
            {touched.ConfirmPassword && errors.ConfirmPassword && (
              <Text
                style={{
                  color: Colors.error,
                  marginLeft: 20,
                  fontFamily: 'Lato-Regular',
                }}>
                {errors.ConfirmPassword}
              </Text>
            )}
            <View style={{marginVertical: 16}} />
            <TouchableOpacity
              style={{
                width: SCREEN_WIDTH - 32,
                height: 45,
                backgroundColor: Colors.primary,
                justifyContent: 'center',
                alignSelf: 'center',
                borderRadius: 3,
              }}
              onPress={() => {
                handleSubmit();
              }}>
              {isLoading ? (
                <ActivityIndicator size="small" color={Colors.white} />
              ) : (
                <Text
                  style={{
                    textAlign: 'center',
                    fontSize: 16,
                    fontFamily: 'Lato-Bold',
                    color: Colors.white,
                  }}>
                  Change Password
                </Text>
              )}
            </TouchableOpacity>
          </View>
        )}
      </Formik>
    </View>
  );
};

export default ChangePassword;

const styles = (isDark: any) =>
  StyleSheet.create({
    maincontainer: {
      flex: 1,
      backgroundColor: isDark ? Colors.black : Colors.white,
    },
  });
