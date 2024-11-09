import {View, Text, TouchableOpacity, Image, Alert} from 'react-native';
import React, {useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {Colors} from '../constants/Colors';
import CustomTextInput from '../Components/CustomTextInput';
import {SCREEN_WIDTH} from '../constants/Screen';
import {ActivityIndicator, Checkbox} from 'react-native-paper';
import {Formik} from 'formik';
import * as Yup from 'yup';
import {auth, credential, isDarkTheme} from '../AppStore/Reducers/appState';
import Placeholder from '../Screens/Placeholder/Placeholder';
import {useUserAuthenticationloginMutation} from '../Services/appLevel';
import Toast from 'react-native-toast-message';

const LoginScreen = ({navigation}: any) => {
  const dispatch = useDispatch();
  const isDark = useSelector(isDarkTheme);

  const authCredential = useSelector(
    (state: any) => state?.appState?.authCredential,
  );
  const connected = useSelector((state: any) => state?.appState?.connected);

  const [showPassword, setShowPassword] = useState(true);
  const [iscredential, setIsCredential] = useState(false);
  const [userAuthenticationlogin, {isLoading, error}] =
    useUserAuthenticationloginMutation();

  const validationSchema = Yup.object().shape({
    username: Yup.string()
      .email('Invalid email')
      .required('Username is required'),
    password: Yup.string().required('Password is required'),
  });

  const handleLogin = async (values: {username: string; password: string}) => {

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
    const email = values.username;
    const password = values.password;

    try {
      const response = await userAuthenticationlogin({
        email: email,
        password: password,
      });
      if (response && response?.data?.messageDetail?.message_code === 200) {
        dispatch(auth(response?.data?.data));

        if (iscredential) {
          dispatch(credential({username: email, password: password}));
        } else {
          dispatch(credential({username: '', password: ''}));
        }

        navigation.navigate('CheckStack');
      } else {
        Alert.alert(
          'Login Status',
          `${response?.data?.messageDetail?.message || ''}`,
          [{text: 'OK', onPress: () => {}}],
          {cancelable: true},
        );
      }
    } catch (err) {
    }
  };

  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        backgroundColor: isDark ? Colors.black : Colors.white,
        alignItems: 'center',
      }}>
      {isLoading ? (
        <Placeholder />
      ) : (
        <Formik
          initialValues={{
            username: authCredential?.username || '',
            password: authCredential?.password || '',
          }}
          validationSchema={validationSchema}
          onSubmit={handleLogin}>
          {({
            handleChange,
            handleBlur,
            handleSubmit,
            values,
            errors,
            touched,
          }) => (
            <View>
              <View
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginVertical: 16,
                }}>
                {isDark ? (
                  <Image
                    source={require('../Assets/Images/Logo/SOLZIT_LOGO.png')}
                    style={{width: '80%', height: 70}}
                  />
                ) : (
                  <Image
                    source={require('../Assets/Images/Solzlogo.png')}
                    style={{width: '90%', height: 70}}
                  />
                )}
              </View>

              <View style={{marginVertical: 16}} />

              <CustomTextInput
                label="Username"
                value={values.username}
                autoFocus={true}
                secureTextEntry={false}
                onChangeText={handleChange('username')}
                onBlur={handleBlur('username')}
                leftIconName="email"
                editable={true}
              />

              {touched.username && errors.username && (
                <Text
                  style={{
                    color: Colors.error,
                    marginLeft: 20,
                    fontFamily: 'Lato-Regular',
                  }}>
                  {errors.username}
                </Text>
              )}

              <View style={{marginVertical: 16}} />

              <CustomTextInput
                label="Password"
                value={values.password}
                secureTextEntry={showPassword}
                onChangeText={handleChange('password')}
                onBlur={handleBlur('password')}
                leftIconName="lock"
                rightIconName={showPassword ? 'eye-off' : 'eye'}
                editable={true}
                onPress={() => {
                  setShowPassword(!showPassword);
                }}
              />

              {touched.password && errors.password && (
                <Text
                  style={{
                    color: Colors.error,
                    marginLeft: 20,
                    fontFamily: 'Lato-Regular',
                  }}>
                  {errors.password}
                </Text>
              )}

              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginVertical: 16,
                }}>
                <View
                  style={{
                    position: 'absolute',
                  }}>
                  <Checkbox
                    status={iscredential ? 'checked' : 'unchecked'}
                    onPress={() => {
                      setIsCredential(!iscredential);
                    }}
                    color={Colors.primary}
                    uncheckedColor={Colors.primary}
                  />
                </View>

                <Text
                  style={{
                    fontSize: 14,
                    fontFamily: 'Lato-Semibold',
                    color: Colors.primary,
                    marginLeft: 35,
                  }}>
                  Remember me
                </Text>
              </View>

              <TouchableOpacity
                onPress={() => {
                  navigation.navigate('ForgotPassword');
                }}
                style={{}}>
                <Text
                  style={{
                    fontSize: 16,
                    fontFamily: 'Lato-Semibold',
                    color: Colors.primary,
                    position: 'absolute',
                    right: 0,
                  }}>
                  Forgot Password?
                </Text>
              </TouchableOpacity>

              <View style={{marginVertical: 20}} />
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
                <Text
                  style={{
                    textAlign: 'center',
                    fontSize: 16,
                    fontFamily: 'Lato-Bold',
                    color: Colors.white,
                  }}>
                  Login
                </Text>
              </TouchableOpacity>

              {isLoading && (
                <ActivityIndicator size="large" color={Colors.white} />
              )}
              {error && (
                <Text
                  style={{
                    color: Colors.error,
                    marginTop: 20,
                    textAlign: 'center',
                    fontFamily: 'Lato-Regular',
                  }}>
                  Login failed. Please try again.
                </Text>
              )}
            </View>
          )}
        </Formik>
      )}
    </View>
  );
};

export default LoginScreen;
