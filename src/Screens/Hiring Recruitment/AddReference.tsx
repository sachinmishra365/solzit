import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Button,
  TouchableOpacity,
} from 'react-native';
import React, {useState} from 'react';
import {useSelector} from 'react-redux';
import {isDarkTheme} from '../../AppStore/Reducers/appState';
import CustomHeader from '../../Components/CustomHeader';
import {Colors} from '../../constants/Colors';
import Toast from 'react-native-toast-message';
import DocumentPicker from 'react-native-document-picker';
import {
  useCreateCandidateApplicationMutation,
  useAttachFileInSharePointMutation,
} from '../../Services/services';
import RNFS from 'react-native-fs';
import {IconButton} from 'react-native-paper';
import {Formik} from 'formik';
import * as Yup from 'yup';
import CustomTextInput from '../../Components/CustomTextInput';
import {SCREEN_WIDTH} from '../../constants/Screen';

const validationSchema = Yup.object().shape({
  firstName: Yup.string().required('First name is required'),
  lastName: Yup.string().required('Last name is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  mobileNumber: Yup.string()
    .matches(/^\d{10}$/, 'Mobile number must be 10 digits')
    .required('Mobile number is required'),
  resume: Yup.object()
    .shape({
      filename: Yup.string().required('Resume is required'),
      filetype: Yup.string(),
      bytes: Yup.string(),
    })
    .required('Resume is required'),
});

const AddReference = ({navigation, route}: any) => {
  const isDark = useSelector(isDarkTheme);
  const EmployeeId = useSelector((state: any) => state?.appState?.authToken);
  const connected = useSelector((state: any) => state?.appState?.connected);

  const { reference: hiringId, hiringPosition } = route.params;


  const [createCandidateApplication] = useCreateCandidateApplicationMutation();
  const [attachFileInSharePoint] = useAttachFileInSharePointMutation();

  const pickDocument = async (setFieldValue: any) => {
    try {
      const res = await DocumentPicker.pickSingle({
        type: [DocumentPicker.types.allFiles],
      });

      const base64File = await RNFS.readFile(res.uri, 'base64');

      setFieldValue('resume', {
        filename: res.name,
        filetype: res.type,
        bytes: base64File,
      });

      console.log('File selected:', res.name);
    } catch (err: any) {
      if (DocumentPicker.isCancel(err)) {
        console.log('User canceled document picker');
      } else {
        console.error('Document picking error:', err);
      }
    }
  };

  const handleSubmit = async (values: any) => {
    if (!connected) {
      Toast.show({
        type: 'error',
        text1: 'Network Error',
        text2: 'Please check your internet connection',
      });
      return;
    }

    const candidateData = {
      firstName: values.firstName.trim(),
      lastName: values.lastName.trim(),
      email: values.email,
      mobileNumber: values.mobileNumber,
      position: {id: hiringId},
    };

    try {
      const response = await createCandidateApplication({
        accessToken: EmployeeId?.authToken?.accessToken,
        data: candidateData,
      }).unwrap();
      if (
        response?.isSuccessful &&
        response?.messageDetail?.message_shortcode ===
          'SOLZIT_REFERENCE_CREATED_SUCCESSFULLY'
      ) {
        Toast.show({
          type: 'success',
          text1: 'Candidate Added Successfully',
        });

        if (values.resume?.filename) {
          try {
            const fileData = {
              itemDetails: [
                {
                  filename: values.resume.filename,
                  filetype: values.resume.filetype,
                  bytes: values.resume.bytes,
                  ID: hiringId,
                  Name: hiringPosition,
                },
              ],
            };

            await attachFileInSharePoint({
              accessToken: EmployeeId?.authToken?.accessToken,
              data: fileData,
            }).unwrap();

            console.log('Resume uploaded successfully');
          } catch (fileError: any) {
            console.error(
              'Error uploading file:',
              JSON.stringify(fileError, null, 2),
            );

            Toast.show({
              type: 'error',
              text1: 'File Upload Failed',
              text2: fileError?.data?.message || 'Could not upload resume',
            });
          }
        }
        navigation.goBack();
      } else {
        throw new Error(
          response?.messageDetail?.message || 'Failed to add candidate',
        );
      }
    } catch (error: any) {
      console.error('Error adding candidate:', JSON.stringify(error, null, 2));

      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: error?.data?.message || error.message || 'Unknown error',
      });
    }
  };

  return (
    <View style={styles(isDark).maincontainer}>
      <CustomHeader
        showBackIcon={true}
        title="Add Reference"
        onPress={() => navigation.goBack()}
      />
      <View style={styles(isDark).divider} />
      <View style={{marginHorizontal: 16}}>
        <Text style={[styles(isDark).label, {marginBottom: -5}]}>
          Hiring Position:
          <Text style={{color: Colors.primary, fontFamily: 'Lato-Bold'}}>
            {' '}
            {hiringPosition}
          </Text>
        </Text>
        <Formik
          initialValues={{
            firstName: '',
            lastName: '',
            email: '',
            mobileNumber: '',
            resume: {filename: '', filetype: '', bytes: ''},
          }}
          validationSchema={validationSchema}
          validateOnChange={true}
          validateOnBlur={true}
          onSubmit={handleSubmit}>
          {({
            handleChange,
            handleSubmit,
            handleBlur,
            values,
            errors,
            touched,
            setFieldValue,
            setFieldTouched,
          }) => (
            <>
              <CustomTextInput
                label="First Name*"
                value={values.firstName}
                onChangeText={handleChange('firstName')}
                onBlur={handleBlur('firstName')}
                leftIconName="account"
                editable={true}
                accessibilityLabelLeft="account"
                accessibilityLabelRight="Blank"
                style={{marginTop: 10}}
                keyboardType="default"
              />
              {touched.firstName && errors.firstName && (
                <Text style={styles(isDark).error}>{errors.firstName}</Text>
              )}

              <CustomTextInput
                label="Last Name*"
                value={values.lastName}
                onChangeText={handleChange('lastName')}
                onBlur={handleBlur('lastName')}
                leftIconName="account"
                editable={true}
                accessibilityLabelLeft="account"
                accessibilityLabelRight="Blank"
                style={{marginTop: 10}}
                keyboardType="default"
              />
              {touched.lastName && errors.lastName && (
                <Text style={styles(isDark).error}>{errors.lastName}</Text>
              )}

              <CustomTextInput
                label="Email*"
                value={values.email}
                onChangeText={handleChange('email')}
                onBlur={handleBlur('email')}
                leftIconName="email"
                editable={true}
                accessibilityLabelLeft="email"
                accessibilityLabelRight="Blank"
                style={{marginTop: 10}}
                keyboardType="default"
              />
              {touched.email && errors.email && (
                <Text style={styles(isDark).error}>{errors.email}</Text>
              )}

              <CustomTextInput
                label="Mobile Number*"
                value={values.mobileNumber}
                onChangeText={(text:any) => {
                  if (/^\d*$/.test(text)) {
                    setFieldValue('mobileNumber', text);
                    setFieldTouched('mobileNumber', true, false); 
                  }
                }}
                onBlur={handleBlur('mobileNumber')}
                leftIconName="phone"
                editable={true}
                accessibilityLabelLeft="phone"
                accessibilityLabelRight="Blank"
                style={{marginTop: 10}}
                keyboardType="phone-pad"
              />
              {touched.mobileNumber && errors.mobileNumber && (
                <Text style={styles(isDark).error}>{errors.mobileNumber}</Text>
              )}

              <Text style={[styles(isDark).label,{ marginTop: 10}
              ]}>Upload Resume*: {touched.resume && errors.resume?.filename && (
                <Text style={[styles(isDark).error]}>
                  {errors.resume.filename}
                </Text>
              )}</Text>

              <TouchableOpacity
                onPress={() => pickDocument(setFieldValue)}
                style={styles(isDark).uploadButton}>
                <IconButton
                  icon="tray-arrow-up"
                  iconColor={isDark ? Colors.white : Colors.black}
                  size={30}
                />
                <Text
                  style={[
                    styles(isDark).ButtonText,
                    {color: isDark ? Colors.white : Colors.black},
                  ]}>
                  {' '}
                  {values.resume?.filename || 'Upload Here'}
                </Text>
              </TouchableOpacity>
              {/* {touched.resume && errors.resume?.filename && (
                <Text style={styles(isDark).error}>
                  {errors.resume.filename}
                </Text>
              )} */}
              <TouchableOpacity
                style={styles(isDark).submitButton}
                onPress={() => handleSubmit()}
                disabled={!values.resume}>
                <Text
                  style={[styles(isDark).ButtonText, {color: Colors.white}]}>
                  Submit
                </Text>
              </TouchableOpacity>
            </>
          )}
        </Formik>
      </View>
    </View>
  );
};

const styles = (isDark: boolean) =>
  StyleSheet.create({
    maincontainer: {
      flex: 1,
      backgroundColor: isDark ? Colors.black : Colors.white,
    },
    divider: {
      borderWidth: 1,
      height: 1,
      backgroundColor: isDark ? Colors.white : 'transparent',
      borderColor: isDark ? Colors.black : 'transparent',
      marginBottom: 16,
    },
    label: {
      fontSize: 16,
      fontFamily: 'Lato-Bold',
      marginBottom: 8,
      color: isDark ? Colors.white : Colors.black,
    },
    uploadButton: {
      backgroundColor: isDark ? Colors.gray : Colors.background,
      borderWidth: 1,
      borderColor: isDark ? Colors.dark_gray : Colors.medium_gray,
      padding: 10,
      alignItems: 'center',
      borderRadius: 3,
      marginBottom: 5,
      borderStyle: 'dashed',
    },
    submitButton: {
      width: SCREEN_WIDTH - 32,
      height: 45,
      backgroundColor: Colors.primary,
      justifyContent: 'center',
      alignSelf: 'center',
      borderRadius: 3,
      marginTop: 10,
    },
    ButtonText: {
      fontFamily: 'Lato-Bold',
      textAlign: 'center',
    },
    error: {
      color: 'red',
      fontSize: 12,
      fontFamily:'Lato-Regular',
    },
  });

export default AddReference;
