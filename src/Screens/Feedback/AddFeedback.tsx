import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { isDarkTheme } from '../../AppStore/Reducers/appState';
import CustomHeader from '../../Components/CustomHeader';
import { Colors } from '../../constants/Colors';
import { useAttachFileInSharePointMutation, useCreateMyFeedBacksMutation } from '../../Services/services';
import Toast from 'react-native-toast-message';
import DocumentPicker from 'react-native-document-picker';
import RNFS from 'react-native-fs';
import { List, IconButton, Checkbox } from 'react-native-paper';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { SCREEN_WIDTH } from '../../constants/Screen';
import Placeholder from '../Placeholder/Placeholder';

const regardingOptions = [
  { label: 'HR', value: 674180000 },
  { label: 'Administration', value: 674180001 },
  { label: 'Operational', value: 674180002 },
  { label: 'Parking', value: 674180003 },
  { label: 'Canteen', value: 674180004 },
  { label: 'Soluzione ESS Portal', value: 674180005 },
  { label: 'Other', value: 674180006 },
];

const FeedbackSchema = Yup.object().shape({
  regardingTo: Yup.object()
    .shape({
      label: Yup.string().required('Please select a category'),
      value: Yup.number()
        .typeError('Please select a valid category')
        .nullable()
        .required('Please select a category'),
    })
    .nullable()
    .required('Please select a category'),

  feedBackTitle: Yup.string()
    .trim()
    .required('Please fill out this field!')
    .min(20, ' Minimum 20 characters required.'),

  feedBackDescription: Yup.string()
    .trim()
    .required('Please fill out this field!')
    .min(20, ' Minimum 20 characters required.'),

  isAttachmentRequired: Yup.boolean(),
  upload: Yup.object()
    .shape({
      filename: Yup.string().required('Please upload a file'),
    })
    .nullable() // Allow it to be null if not required
    .when('isAttachmentRequired', {
      is: true,
      then: schema =>
        schema.shape({
          filename: Yup.string().required('Please upload a file'),
        }),
      otherwise: schema => Yup.mixed().notRequired(), // Make it optional when false
    }),
});

const AddFeedback = ({ navigation, route }: any) => {
  const isDark = useSelector(isDarkTheme);
  const EmployeeId = useSelector((state: any) => state?.appState?.authToken);
  const connected = useSelector((state: any) => state?.appState?.connected);
  const auth = useSelector((state: any) => state?.appState?.authToken);

  const [CreateMyFeedBacks, { isLoading }] = useCreateMyFeedBacksMutation();
  const [UploadDocument, result] = useAttachFileInSharePointMutation();


  const [expanded, setExpanded] = useState(false);

  const handleSubmit = async (values: any) => {
    if (!connected) {
      Toast.show({
        type: 'error',
        text1: 'Network Error',
        text2: 'Please check your internet connection',
      });
      return;
    }
    try {
      const response = await CreateMyFeedBacks({
        accessToken: EmployeeId?.authToken?.accessToken,
        data: {
          feedBackId: null,
          feedBackTitle: values.feedBackTitle,
          feedBackDescription: values.feedBackDescription,
          regardingTo: {
            label: values.regardingTo.label,
            value: values.regardingTo.value,
          },
          reportedBy: auth.userProfile.fullName,
          reportedById: auth.userProfile.userId,
        },
      }).unwrap();
      console.log('response', response);

      if (
        response?.isSuccessful &&
        response?.messageDetail?.message_code === 201
      ) {
        const feedbackId = response?.data;
        if (values.isAttachmentRequired && values.upload) {
          await handleUploadDocument(feedbackId, values.upload);
        } else {
          Toast.show({
            type: 'success',
            text1: 'Success',
            text2: 'Feedback submitted successfully',
          });
        }
        navigation.goBack();
      } else {
        throw new Error(
          response?.messageDetail?.message || 'Failed to add feedback',
        );
      }
    } catch (error) {
      console.error('Error adding feedback:', JSON.stringify(error, null, 2));
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: (error as any)?.message || 'Unknown error',
      });
    }
  };

  const handleUploadDocument = async (feedbackId: string, file: any) => {
    console.log(feedbackId);

    const data = {
      "itemDetails": [
        {
          "filename": file.filename,
          "filetype": file.filetype,
          "bytes": file.bytes,
          "ID": feedbackId,
          "Name": "solz_feedback"
        }
      ]
    }
    try {
      const response = await UploadDocument({
        accessToken: EmployeeId?.authToken?.accessToken,
        data
      }).unwrap();
      console.log('u', response);

      if (response?.isSuccessful) {
        Toast.show({
          type: 'success',
          text1: 'Success',
          text2: 'Record created successfully',
        });
      } else {
        throw new Error(response?.messageDetail?.message || 'File upload failed');
      }
    } catch (error) {
      console.error('Error uploading file:', JSON.stringify(error, null, 2));
      Toast.show({
        type: 'error',
        text1: 'Upload Error',
        text2: (error as any)?.message || 'Unknown error',
      });
    }
  }

  const pickDocument = async (setFieldValue: any) => {
    try {
      const res = await DocumentPicker.pickSingle({
        type: [DocumentPicker.types.allFiles],
      });

      const base64File = await RNFS.readFile(res.uri, 'base64');

      setFieldValue('upload', {
        filename: res.name,
        filetype: res.type,
        bytes: base64File,
      });

    } catch (err) {
      console.error('Document picking error:', err);
    }
  };

  return (
    <View style={styles(isDark).maincontainer}>
      <CustomHeader
        showBackIcon={true}
        title="Add Feedback"
        onPress={() => navigation.goBack()}
      />
      {
        isLoading || result?.isLoading? (
          <Placeholder />
        ) : (
          <>
            <View style={styles(isDark).divider} />
            <Text style={[styles(isDark).label, { marginHorizontal: 16 }]}>
              Soluzione values your feedback. Please feel free to share your thoughts.
            </Text>

            <ScrollView contentContainerStyle={{ marginHorizontal: 16 }}>
              <Formik
                initialValues={{
                  regardingTo: { label: 'Select', value: null },
                  feedBackTitle: '',
                  feedBackDescription: '',
                  isAttachmentRequired: false,
                  upload: { filename: '', filetype: '', bytes: '' },
                }}
                validationSchema={FeedbackSchema}
                onSubmit={handleSubmit}
                validateOnChange={true}>
                {({
                  values,
                  handleChange,
                  handleSubmit,
                  setFieldValue,
                  setFieldTouched,
                  errors,
                  touched,
                }) => (
                  <>
                    <Text style={styles(isDark).label}>Regarding</Text>
                    <List.Accordion
                      title={values.regardingTo.label || 'Select a category'}
                      expanded={expanded}
                      onPress={() => setExpanded(!expanded)}
                      titleStyle={{
                        color: isDark ? Colors.white : Colors.black,
                        fontFamily: 'Lato-Bold',
                      }}
                      style={{
                        backgroundColor: isDark ? Colors.gray : Colors.background,
                        borderColor: isDark ? Colors.dark_gray : Colors.medium_gray,
                        borderWidth: 0.5,
                        borderRadius: 1,
                      }}
                      right={props => (
                        <List.Icon
                          {...props}
                          icon="chevron-down"
                          color={isDark ? Colors.white : Colors.black}
                        />
                      )}>
                      {regardingOptions.map(option => (
                        <List.Item
                          key={option.value}
                          title={option.label}
                          titleStyle={{
                            color: isDark ? Colors.white : Colors.black,
                            fontFamily: 'Lato-Regular',
                          }}
                          style={{
                            backgroundColor: isDark ? Colors.gray : Colors.background,
                            // borderWidth: 0.5,
                            // borderColor: isDark ? Colors.dark_gray : Colors.medium_gray,
                            borderRadius: 1,
                          }}
                          onPress={() => {
                            setFieldValue('regardingTo', option);
                            setExpanded(false);
                          }}
                        />
                      ))}
                    </List.Accordion>

                    {touched.regardingTo && errors.regardingTo && (
                      <Text style={styles(isDark).error}>
                        {typeof errors.regardingTo === 'string'
                          ? errors.regardingTo
                          : errors.regardingTo.value}
                      </Text>
                    )}

                    <Text style={[styles(isDark).label, { marginTop: 12 }]}>
                      Title:
                    </Text>
                    <TextInput
                      style={styles(isDark).input}
                      placeholder="Enter Title"
                      placeholderTextColor={
                        isDark ? Colors.dark_gray : Colors.medium_gray
                      }
                      value={values.feedBackTitle}
                      onChangeText={text => {
                        handleChange('feedBackTitle')(text);
                        setFieldValue('feedBackTitle', text);
                        setFieldTouched('feedBackTitle', true, false);
                      }}
                    />
                    {touched.feedBackTitle && errors.feedBackTitle && (
                      <Text style={styles(isDark).error}>{errors.feedBackTitle}</Text>
                    )}

                    <Text style={styles(isDark).label}>Description:</Text>
                    <TextInput
                      style={[
                        styles(isDark).input,
                        { height: 100, textAlignVertical: 'top' },
                      ]}
                      placeholder="Enter Description"
                      placeholderTextColor={
                        isDark ? Colors.dark_gray : Colors.medium_gray
                      }
                      value={values.feedBackDescription}
                      onChangeText={text => {
                        handleChange('feedBackDescription')(text);
                        setFieldValue('feedBackDescription', text);
                        setFieldTouched('feedBackDescription', true, false);
                      }}
                      multiline
                    />
                    {touched.feedBackDescription && errors.feedBackDescription && (
                      <Text style={styles(isDark).error}>
                        {errors.feedBackDescription}
                      </Text>
                    )}

                    <View style={{ flexDirection: 'row', alignItems: 'center', marginHorizontal: -8, }}>
                      <Checkbox
                        status={values.isAttachmentRequired ? 'checked' : 'unchecked'}
                        onPress={() =>
                          setFieldValue(
                            'isAttachmentRequired',
                            !values.isAttachmentRequired,
                          )
                        }
                        color={isDark ? Colors.secondary : Colors.primary}
                        uncheckedColor={isDark ? Colors.secondary : Colors.primary}
                      />
                      <Text style={styles(isDark).label}>Attachments</Text>
                    </View>
                    {values.isAttachmentRequired && (
                      <>
                        <TouchableOpacity
                          onPress={() => pickDocument(setFieldValue)}
                          style={styles(isDark).uploadButton}>
                          <IconButton
                            icon="tray-arrow-up"
                            iconColor={isDark ? Colors.white : Colors.black}
                            size={30}
                          />
                          <Text style={styles(isDark).uploadButtonText}>
                            {values.upload.filename || 'Add Attachment'}
                          </Text>
                        </TouchableOpacity>
                        {touched.upload && errors.upload?.filename && (
                          <Text style={styles(isDark).error}>
                            {errors.upload.filename}
                          </Text>
                        )}
                      </>
                    )}

                    <TouchableOpacity
                      style={styles(isDark).submitButton}
                      onPress={() => handleSubmit()}>
                      <Text
                        style={[
                          styles(isDark).uploadButtonText,
                          { color: Colors.white, textAlign: 'center' },
                        ]}>
                        Submit
                      </Text>
                    </TouchableOpacity>
                  </>
                )}
              </Formik>
            </ScrollView>
          </>
        )
      }
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
      marginBottom: 4,
      color: isDark ? Colors.white : Colors.black,
    },
    input: {
      borderWidth: 0.5,
      borderColor: isDark ? Colors.dark_gray : Colors.medium_gray,
      borderRadius: 3,
      padding: 10,
      marginBottom: 12,
      backgroundColor: isDark ? Colors.gray : Colors.background,
      fontFamily: 'Lato-Regular',
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
    uploadButtonText: {
      color: isDark ? Colors.white : Colors.black,
      fontFamily: 'Lato-Bold',
    },
    error: {
      color: 'red',
      fontSize: 12,
      marginBottom: 10,
      fontFamily: 'Lato-Regular',
    },
  });

export default AddFeedback;
