import {View, Text, TouchableOpacity, Image, Alert} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {Formik} from 'formik';
import * as Yup from 'yup';
import {isDarkTheme} from '../../AppStore/Reducers/appState';
import {useForgotPasswordQuery} from '../../Services/appLevel';
import {Colors} from '../../constants/Colors';
import CustomTextInput from '../../Components/CustomTextInput';
import {SCREEN_WIDTH} from '../../constants/Screen';
import {TextInput} from 'react-native-paper';

const ForgotPassword = ({navigation}: any) => {
  const dispatch = useDispatch();
  const isDark = useSelector(isDarkTheme);

  const [email, setEmail] = useState('');

  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .email('Invalid email')
      .required('email is required'),
  });

  const [triggerQuery, setTriggerQuery] = useState(false);

  const forget = useForgotPasswordQuery(email);

  useEffect(() => {
    const handleQuery = async () => {
      if (triggerQuery && email) {
        try {
          const response = await forget;
          if (response.status === 'fulfilled') {
            Alert.alert('Success', response?.data?.messageDetail?.message);
          } else if (response.status === 'rejected') {
            Alert.alert('Error', 'Failed to process the request.');
          }
        } catch (err) {
          console.warn(err);
          Alert.alert('Error', 'Something went wrong.');
        } finally {
          setTriggerQuery(false);
        }
      }
    };
    handleQuery();
  }, [triggerQuery, email]);

  const handleForgetPassword = (values: any) => {
    const enteredEmail = values?.email || '';
    console.log(enteredEmail);
    
    setEmail(enteredEmail);
    setTriggerQuery(true);
  };
  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        backgroundColor: isDark ? Colors.black : Colors.white,
        alignItems: 'center',
        paddingHorizontal:16
      }}>
      <Formik
        initialValues={{
          email: '',
        }}
        validationSchema={validationSchema}
        onSubmit={handleForgetPassword}>
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
                  source={require('../../Assets/Images/Logo/SOLZIT_LOGO.png')}
                  style={{width: '100%', height: 70}}
                />
              ) : (
                <Image
                  source={require('../../Assets/Images/Solzlogo.png')}
                  style={{width: '85%', height: 70}}
                />
              )}
            </View>

            <Text
            style={{
              color: isDark ? Colors.white : Colors.black,
              alignSelf: 'center',
              fontFamily: 'Lato-Bold',
            }}>
           Enter your email address below and we'll send you a link to reset your password.
          </Text>

            <View style={{marginVertical: 16}} />

            <CustomTextInput
              label="Email"
              value={values.email}
              secureTextEntry={false}
              onChangeText={handleChange('email')}
              onBlur={handleBlur('email')}
              leftIconName="email"
              editable={true}
            />


            {touched.email && errors.email && (
              <Text
                style={{
                  color: Colors.error,
                  marginLeft: 20,
                  fontFamily: 'Lato-Regular',
                }}>
                {errors.email}
              </Text>
            )}

            <View style={{marginVertical: 32}} />
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
                Continue
              </Text>
            </TouchableOpacity>

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
                navigation.replace('Login');
              }}>
              <Text
                style={{
                  textAlign: 'center',
                  fontSize: 16,
                  fontFamily: 'Lato-Bold',
                  color: Colors.white,
                }}>
                Back to login
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </Formik>
    </View>
  );
};
export default ForgotPassword;
