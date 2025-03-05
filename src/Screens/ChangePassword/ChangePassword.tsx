import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {auth, isDarkTheme} from '../../AppStore/Reducers/appState';
import {Colors} from '../../constants/Colors';
import CustomHeader from '../../Components/CustomHeader';
import {useNavigation} from '@react-navigation/native';
import {useChangePasswordMutation} from '../../Services/appLevel';
import CustomTextInput from '../../Components/CustomTextInput';
import {Formik} from 'formik';
import * as Yup from 'yup';
import {SCREEN_WIDTH} from '../../constants/Screen';
import Toast from 'react-native-toast-message';


const ChangePassword = ({navigation}: any) => {
  const isDark = useSelector(isDarkTheme);
  const EmployeeId = useSelector((state: any) => state?.appState?.authToken);
  const dispatch = useDispatch();

  const [showPassword, setShowPassword] = useState(true);
  const [showNewPassword, setShowNewPassword] = useState(true);
  const [showConfirmPassword, setShowConfirmPassword] = useState(true);

  const connected = useSelector((state: any) => state?.appState?.connected);
  const Assesstoken = useSelector((state: any) => state?.appState?.authToken);
  const accessToken = Assesstoken?.authToken?.accessToken;

  const validationSchema = Yup.object().shape({
    email: Yup.string().email('Invalid email').required('Email is required'),
    Oldpassword: Yup.string().required('Old password is required'),
    Newpassword: Yup.string()
      .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
      .matches(/[0-9]/, 'Password must contain at least one number')
      .matches(
        /[!@#$%^&*(),.?":{}|<>]/,
        'Password must contain at least one special character',
      )
      .min(8, 'New Password must be at least 8 characters long')
      .required(' New Password is required'),

    ConfirmPassword: Yup.string()
      .required('Confirm New password is required')
      .oneOf([Yup.ref('Newpassword')], 'Passwords must match'),
  });
  const [ChangePassword, {isSuccess, isLoading}] = useChangePasswordMutation();

  const handleChangePassword = async (values: any) => {

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
    const data = {
      email: values.email,
      Oldpassword: values.Oldpassword,
      NewPassword: values.Newpassword,
    };

    try {
      const response = await ChangePassword({data,accessToken}).unwrap();
      if(response?.isSuccessful === true){
        navigation.replace('AuthStack');
        dispatch(auth(undefined));
      }
      Toast.show({
        type: 'success',
        text1: 'Password Change Status',
        text2: response?.messageDetail?.message,
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
      Toast.show({
        type: 'error',
        text1: 'Password Change Status',
        //@ts-ignore
        text2: err?.data?.messageDetail?.message,
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
      console.log('success');
      
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
              leftIconName="account"
              readOnly={true}
              accessibilityLabelLeft="Email"
              accessibilityLabelRight="Blank"
            />
            {touched.email && errors.email && (
              //@ts-ignore
              <Text style={{color: Colors.error,marginLeft: 20,fontFamily: 'Lato-Regular',}}>{errors?.email}</Text>
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
              accessibilityLabelLeft="Lock"
              accessibilityLabelRight="Eye"
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
              accessibilityLabelLeft="Lock"
              accessibilityLabelRight="Eye"
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
              accessibilityLabelLeft="Lock"
              accessibilityLabelRight="Eye"
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
