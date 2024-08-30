import {View, Text, TouchableOpacity, Image, Alert} from 'react-native';
import React, {useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {Colors} from '../constants/Colors';
import CustomTextInput from '../Components/CustomTextInput';
import {SCREEN_WIDTH} from '../constants/Screen';
import {ActivityIndicator} from 'react-native-paper';
import {Formik} from 'formik';
import * as Yup from 'yup';
import {
  useForgetpasswordMutation,
  useUserAuthenticationloginMutation,
} from '../Services/services';
import {auth} from '../AppStore/Reducers/appState';
import Placeholder from '../Screens/Placeholder/Placeholder';

const LoginScreen = ({navigation}: any) => {
  const dispatch = useDispatch();
  const [showPassword, setShowPassword] = useState(true);
  const [userAuthenticationlogin, {isLoading, error}] =
    useUserAuthenticationloginMutation();

  const validationSchema = Yup.object().shape({
    username: Yup.string()
      .email('Invalid email')
      .required('Username is required'),
    password: Yup.string().required('Password is required'),
  });
  const [forget] = useForgetpasswordMutation();

  const handleLogin = async (values: {username: string; password: string}) => {
    try {
      const response = await userAuthenticationlogin({
        email: values.username,
        password: values.password,
      });

      if (response.data.ResponseCode !== 999) {
        dispatch(auth(response));
        navigation.navigate('CheckStack');
      } else {
        Alert.alert(
          'Login Status',
          response.data.Message,
          [{text: 'OK', onPress: () => console.log('OK Pressed')}],
          {cancelable: true},
        );
      }
    } catch (err) {
      console.error('Login failed:', err);
    }
  };

  const handleforget = async () => {
    const param = {
      email: 'govind.l@solzit.com',
    };
    try {
      const response = await forget(param);
    } catch (error) {}
  };

  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        backgroundColor: Colors.black,
        alignItems: 'center',
      }}>
      {isLoading ? (
        <Placeholder />
      ) : (
        <Formik
          initialValues={{
            username: 'govind.l@solzit.com',
            password: 'Govind12@',
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
                <Image
                  source={require('../Assets/Images/Solzlogo.png')}
                  style={{width: '70%', height: 50}}
                />
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
                <Text style={{color: Colors.error, marginLeft: 20}}>
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
                <Text style={{color: Colors.error, marginLeft: 20}}>
                  {errors.password}
                </Text>
              )}
              <View style={{marginVertical: 16}} />
              <TouchableOpacity
                style={{
                  width: SCREEN_WIDTH - 32,
                  height: 45,
                  backgroundColor: Colors.white,
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
                    fontWeight: '600',
                    color: Colors.black,
                  }}>
                  Login
                </Text>
              </TouchableOpacity>

              {isLoading && (
                <ActivityIndicator size="large" color={Colors.black} />
              )}
              {error && (
                <Text
                  style={{
                    color: Colors.error,
                    marginTop: 20,
                    textAlign: 'center',
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
