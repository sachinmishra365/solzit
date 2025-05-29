import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import React, {useState} from 'react';
import {useSelector} from 'react-redux';
import {isDarkTheme} from '../../AppStore/Reducers/appState';
import CustomHeader from '../../Components/CustomHeader';
import {Colors} from '../../constants/Colors';
import {
  useAttachFileInSharePointMutation,
  useCreateMyFeedBacksMutation,
} from '../../Services/services';
import Toast from 'react-native-toast-message';
import DocumentPicker from 'react-native-document-picker';
import RNFS from 'react-native-fs';
import {List, IconButton, Checkbox} from 'react-native-paper';
import {Formik} from 'formik';
import * as Yup from 'yup';
import {SCREEN_WIDTH} from '../../constants/Screen';
import Placeholder from '../Placeholder/Placeholder';
import CustomTextInput from '../../Components/CustomTextInput';
import CustomDropdown from '../../Components/CustomDropDown';
import {
  useAddMyNewSkillMutation,
  useGetAllMasterSkillsQuery,
  useGetMySkillBySkillIdQuery,
  useGetOptionSetHasCertificateQuery,
  useGetOptionSetLevelOfSkillQuery,
  useGetOptionSetTypeOfCertificateQuery,
} from '../../Services/employeeSkills';

const FeedbackSchema = Yup.object().shape({
  regardingToSkills: Yup.object().shape({
    label: Yup.string().required('Please select a skill'),
    value: Yup.string().required('Invalid skill selection'),
  }),
  regardingLevelOfSkills: Yup.object().shape({
    label: Yup.string().required('Please select a level'),
    value: Yup.number().required('Invalid level'),
  }),
  regardingCertification: Yup.object().shape({
    label: Yup.string().required('Please select Yes/No'),
    value: Yup.number().required('Invalid choice'),
  }),
  regardingTypeCertification: Yup.object().when('regardingCertification', {
    is: (val: any) => val?.value === 674180000, // "Yes"
    then: schema =>
      Yup.object().shape({
        label: Yup.string().required('Please select certificate type'),
        value: Yup.number().required('Invalid type'),
      }),
    otherwise: schema => Yup.object().nullable(),
  }),
  certificateTitle: Yup.string()
    .trim()
    .when('regardingCertification', {
      is: (val: any) => val?.value === 674180000,
      then: schema =>
        schema
          .required('Please fill out this field!')
          .min(3, 'Minimum 3 characters required'),
      otherwise: schema => schema.notRequired(),
    }),
});

const AddSkills = ({navigation, route}: any) => {
  const isDark = useSelector(isDarkTheme);
  const EmployeeId = useSelector((state: any) => state?.appState?.authToken);
  const connected = useSelector((state: any) => state?.appState?.connected);
  const auth = useSelector((state: any) => state?.appState?.authToken);

  const {data: skillOptionsData, isLoading: skillsLoading} =
    useGetAllMasterSkillsQuery({
      accessToken: EmployeeId?.authToken?.accessToken,
    });
  const {data: levelOptionsData, isLoading: levelLoading} =
    useGetOptionSetLevelOfSkillQuery({
      LevelOfSkill: 'LevelOfSkill',
      accessToken: EmployeeId?.authToken?.accessToken,
    });
  const {data: hasCertOptionsData, isLoading: certLoading} =
    useGetOptionSetHasCertificateQuery({
      HasCertification: 'HasCertification',
      accessToken: EmployeeId?.authToken?.accessToken,
    });
  const {data: certTypeOptionsData, isLoading: certTypeLoading} =
    useGetOptionSetTypeOfCertificateQuery({
      TypeOfCertification: 'TypeOfCertification',
      accessToken: EmployeeId?.authToken?.accessToken,
    });

  const skillOptions =
    skillOptionsData?.data?.map((item: any) => ({
      label: item.skillName,
      value: item.skillId,
    })) || [];

  const levelOptions =
    levelOptionsData?.data?.map((item: any) => ({
      label: item.label,
      value: item.value,
    })) || [];

  const certOptions =
    hasCertOptionsData?.data?.map((item: any) => ({
      label: item.label,
      value: item.value,
    })) || [];

  const certTypeOptions =
    certTypeOptionsData?.data?.map((item: any) => ({
      label: item.label,
      value: item.value,
    })) || [];

  const [CreateAddNewSkill, {isLoading}] = useAddMyNewSkillMutation();
  const [UploadDocument, result] = useAttachFileInSharePointMutation();

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
      const response = await CreateAddNewSkill({
        accessToken: EmployeeId?.authToken?.accessToken,
        data: {
          skillId: values.regardingToSkills?.value,
          levelOfSkill: {
            label: values.regardingLevelOfSkills?.label,
            value: values.regardingLevelOfSkills?.value,
          },
          hasCertification: {
            label: values.regardingCertification?.label,
            value: values.regardingCertification?.value,
          },
          typeOfCertification: values.regardingTypeCertification?.value
            ? {
                label: values.regardingTypeCertification?.label,
                value: values.regardingTypeCertification?.value,
              }
            : null,
          certicationName: values.certificateTitle,
        },
      }).unwrap();

      if (
        response?.isSuccessful &&
        response?.messageDetail?.message_code === 201
      ) {
        const skillId = response?.data;
        if (values.upload && values.upload.filename) {
          await handleUploadDocument(skillId, values.upload);
        } else {
          Toast.show({
            type: 'success',
            text1: 'Success',
            text2: 'Skill added successfully',
          });
        }
        navigation.goBack();
      } else {
        throw new Error(
          response?.messageDetail?.message || 'Failed to add skill',
        );
      }
    } catch (error) {
      console.error('Submit error:', JSON.stringify(error));
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: (error as any)?.message || 'Unknown error',
      });
    }
  };

  const handleUploadDocument = async (skillId: string, file: any) => {
    const data = {
      itemDetails: [
        {
          filename: file.filename,
          filetype: file.filetype,
          bytes: file.bytes,
          ID: skillId,
          Name: 'solz_employeeskill',
        },
      ],
    };
    try {
      const response = await UploadDocument({
        accessToken: EmployeeId?.authToken?.accessToken,
        data,
      }).unwrap();

      if (response?.isSuccessful) {
        Toast.show({
          type: 'success',
          text1: 'Success',
          text2: 'File uploaded successfully',
        });
      } else {
        throw new Error(
          response?.messageDetail?.message || 'File upload failed',
        );
      }
    } catch (error) {
      console.error('Error uploading file:', JSON.stringify(error, null, 2));
      Toast.show({
        type: 'error',
        text1: 'Upload Error',
        text2: (error as any)?.message || 'Unknown error',
      });
    }
  };

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
        title="Add Skills"
        onPress={() => navigation.goBack()}
      />
      {isLoading || result?.isLoading ? (
        <Placeholder />
      ) : (
        <>
          <ScrollView contentContainerStyle={{marginHorizontal: 16}}>
            <Formik
              initialValues={{
                regardingToSkills: {label: 'Select', value: null},
                regardingLevelOfSkills: {label: 'Select', value: null},
                regardingCertification: {label: 'Select', value: null},
                certificateTitle: '',
                regardingTypeCertification: {label: 'Select', value: null},
                upload: {filename: '', filetype: '', bytes: ''},
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
                handleBlur,
                errors,
                touched,
              }) => (
                <>
                  <View style={{marginVertical: 5}}>
                    <Text style={styles(isDark).label}>Skills</Text>
                    <CustomDropdown
                      selectedValue={values.regardingToSkills}
                      options={skillOptions}
                      onSelect={(selectedOption: any) =>
                        setFieldValue('regardingToSkills', selectedOption)
                      }
                    />

                    {touched.regardingToSkills?.value && (
                      <Text style={styles(isDark).error}>
                        {errors.regardingToSkills?.value}
                      </Text>
                    )}
                  </View>

                  <View style={{marginVertical: 10}}>
                    <Text style={styles(isDark).label}>Level of Skill</Text>
                    <CustomDropdown
                      selectedValue={values.regardingLevelOfSkills}
                      options={levelOptions}
                      onSelect={(selectedOption: any) =>
                        setFieldValue('regardingLevelOfSkills', selectedOption)
                      }
                    />

                    {touched.regardingLevelOfSkills &&
                      errors.regardingLevelOfSkills && (
                        <Text style={styles(isDark).error}>
                          {errors.regardingLevelOfSkills.value}
                        </Text>
                      )}
                  </View>

                  <View style={{marginVertical: 5}}>
                    <Text style={styles(isDark).label}>Has Certification</Text>
                    <CustomDropdown
                      selectedValue={values.regardingCertification}
                      options={certOptions}
                      onSelect={(selectedOption: any) =>
                        setFieldValue('regardingCertification', selectedOption)
                      }
                    />
                    {touched.regardingCertification &&
                      errors.regardingCertification && (
                        <Text style={styles(isDark).error}>
                          {errors.regardingCertification.value}
                        </Text>
                      )}
                  </View>

                  {values?.regardingCertification?.value === 674180000 && (
                    <>
                      <View style={{marginVertical: 5}}>
                        <CustomTextInput
                          label="Certification Name"
                          value={values.certificateTitle}
                          secureTextEntry={false}
                          leftIconName="clipboard-text-outline"
                          onChangeText={handleChange('certificateTitle')}
                          onBlur={handleBlur('certificateTitle')}
                          onFocus={() =>
                            setFieldTouched('certificateTitle', true)
                          }
                          editable={true}
                        />
                        {touched.certificateTitle &&
                          errors.certificateTitle && (
                            <Text style={styles(isDark).error}>
                              {errors.certificateTitle}
                            </Text>
                          )}
                      </View>

                      <View style={{marginVertical: 5}}>
                        <Text style={styles(isDark).label}>
                          Type of Certification
                        </Text>
                        <CustomDropdown
                          selectedValue={values.regardingTypeCertification}
                          options={certTypeOptions}
                          onSelect={(selectedOption: any) =>
                            setFieldValue(
                              'regardingTypeCertification',
                              selectedOption,
                            )
                          }
                        />

                        {touched.regardingTypeCertification &&
                          errors.regardingTypeCertification && (
                            <Text style={styles(isDark).error}>
                              {errors.regardingTypeCertification.value}
                            </Text>
                          )}
                      </View>

                      <View
                        style={{
                          marginVertical: 5,
                        }}>
                        <Text style={styles(isDark).label}>Attachments</Text>
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
                        </>
                      </View>
                    </>
                  )}
                  <TouchableOpacity
                    style={styles(isDark).submitButton}
                    onPress={() => handleSubmit()}>
                    <Text
                      style={[
                        styles(isDark).uploadButtonText,
                        {color: Colors.white, textAlign: 'center'},
                      ]}>
                      Save
                    </Text>
                  </TouchableOpacity>
                </>
              )}
            </Formik>
          </ScrollView>
        </>
      )}
    </View>
  );
};

const styles = (isDark: boolean) =>
  StyleSheet.create({
    maincontainer: {
      flex: 1,
      backgroundColor: isDark ? Colors.black : Colors.white,
    },
    label: {
      fontSize: 16,
      fontFamily: 'Lato-Bold',
      marginBottom: 4,
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
      fontFamily: 'Lato-Regular',
    },
  });

export default AddSkills;
