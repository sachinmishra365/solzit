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
import {useAttachFileInSharePointMutation} from '../../Services/services';
import Toast from 'react-native-toast-message';
import DocumentPicker from 'react-native-document-picker';
import RNFS from 'react-native-fs';
import {List, IconButton, Checkbox} from 'react-native-paper';
import {Formik} from 'formik';
import * as Yup from 'yup';
import {SCREEN_WIDTH} from '../../constants/Screen';
import Placeholder from '../Placeholder/Placeholder';
import CustomTextInput from '../../Components/CustomTextInput';

import {
  useAddMyNewSkillMutation,
  useEditMySkillMutation,
  useGetAllMasterSkillsQuery,
  useGetOptionSetHasCertificateQuery,
  useGetOptionSetLevelOfSkillQuery,
  useGetOptionSetTypeOfCertificateQuery,
} from '../../Services/employeeSkills';
import CustomDropdownWithModal from '../../Components/CustomDropDown';

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
  const itemData = route?.params?.itemData || null;

  const {data: skillOptionsData, isLoading: skillsLoading} =
    useGetAllMasterSkillsQuery({
      accessToken: EmployeeId?.authToken?.accessToken,
    });
  const {data: levelOptionsData, isLoading: levelLoading} =
    useGetOptionSetLevelOfSkillQuery({
      LevelOfSkill: 'LevelOfSkill',
      accessToken: EmployeeId?.authToken?.accessToken,
    });

    console.log('levelOptionsData', levelOptionsData);
    
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

  const [CreateEditMySkill] = useEditMySkillMutation();
  const [CreateAddNewSkill, {isLoading}] = useAddMyNewSkillMutation();
  const [UploadDocument, result] = useAttachFileInSharePointMutation();

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

  const isEdit =
    itemData?.statusReason?.label === 'Applied' ||
    itemData?.statusReason?.label === 'Approved' ||
    itemData?.statusReason?.label === 'Rejected';

  const STATUS_REASON_MAP: Record<string, number> = {
    Applied: 674180000,
    'Re-Applied': 674180001,
    Pending: 674180002,
    Rejected: 674180003,
    Approved: 674180004,
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

    const validLevelValues = levelOptions?.map((option:any )=> option.value);
    const levelValue = values?.regardingLevelOfSkills?.value;

    const commonPayload = {
      skillId: values?.regardingToSkills?.value ?? null,

       levelOfSkill: validLevelValues.includes(levelValue)
    ? {
        label: values.regardingLevelOfSkills?.label,
        value: levelValue,
      }
    : null,
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
      certicationName: values?.certificateTitle?.trim() || '',
    };

    try {
      let response;

      if (isEdit) {
        const payload = {
          id: itemData?.id,
          name: itemData?.name || 'Skill',

          ...commonPayload,
          statusReason: {
            label: itemData?.statusReason?.label ?? 'Rejected',
            value:
              STATUS_REASON_MAP[itemData?.statusReason?.label] ??
              itemData?.statusReason?.value ??
              674180003,
          },
        };

        response = await CreateEditMySkill({
          accessToken: EmployeeId?.authToken?.accessToken,
          data: payload,
        }).unwrap();
        console.log('Edit Skill Response:', response);
      } else {
        response = await CreateAddNewSkill({
          accessToken: EmployeeId?.authToken?.accessToken,
          data: commonPayload,
        }).unwrap();
      }
      console.log('Response from API:', response);
      console.log('Response message detail:', response?.messageDetail);

      if (
        response?.isSuccessful &&
        [201, 5016, 200].includes(response?.messageDetail?.message_code)
      ) {
        const skillId = response?.data;
        if (values.upload && values.upload.filename) {
          await handleUploadDocument(skillId, values.upload);
        } else {
          Toast.show({
            type: 'success',
            text1: 'Success',
            text2:
              response?.messageDetail?.message_code === 201 ||
              response?.messageDetail?.message_code === 200
                ? 'Skill added successfully'
                : 'Skill updated successfully',
          });
        }
        navigation.goBack();
      } else if (response?.messageDetail?.message_code === 4449) {
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: response.messageDetail.message || 'Failed to add skill',
        });
      } else {
        throw new Error(
          response?.messageDetail?.message || 'Failed to add skill',
        );
      }
    } catch (error: any) {
      console.error('Error in handleSubmit:', error);
      const errorMessage =
        error?.data?.messageDetail?.message ||
        error?.message ||
        'Unknown error occurred';

      if (!isEdit && error?.data?.messageDetail?.message_code === 4449) {
        Toast.show({
          type: 'error',
          text1: 'Skill Already Exists',
          text2: 'You already have added this skill.',
        });
      } else {
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: errorMessage,
        });
      }
    }
  };

  return (
    <View style={styles(isDark).maincontainer}>
      <CustomHeader
        showBackIcon={true}
        title={
          itemData?.statusReason?.label === 'Approved'
            ? 'Approved Skill'
            : itemData?.statusReason?.label === 'Applied'
            ? 'Applied Skill'
            : itemData?.statusReason?.label === 'Rejected'
            ? 'Rejected Skill'
            : 'Add Skill'
        }
        onPress={() => navigation.goBack()}
      />
      {isLoading || result?.isLoading ? (
        <Placeholder />
      ) : (
        <>
          <ScrollView contentContainerStyle={{marginHorizontal: 16}}>
            <Formik
              initialValues={{
                regardingToSkills: itemData
                  ? {
                      label: itemData?.skillName?.name,
                      value: itemData?.skillId,
                    }
                  : {label: 'Select', value: null},

                regardingLevelOfSkills: itemData
                  ? {
                      label: itemData?.levelofskill?.label,
                      value: itemData?.levelofskill?.value,
                    }
                  : {label: 'Select', value: null},

                regardingCertification: route?.params?.itemData
                  ? {
                      label: itemData?.hasCertification?.label,
                      value: itemData?.hasCertification?.value,
                    }
                  : {label: 'Select', value: null},

                certificateTitle: itemData ? itemData?.certificationName : null,

                regardingTypeCertification: itemData?.typeOfCertification
                  ? {
                      label: itemData?.typeOfCertification?.label,
                      value: itemData?.typeOfCertification?.value,
                    }
                  : {label: 'Select', value: null},

                upload: {filename: '', filetype: '', bytes: ''},
              }}
              validationSchema={!isEdit ? FeedbackSchema : undefined}
              onSubmit={handleSubmit}
              validateOnChange={!isEdit}>
              {({
                values,
                handleChange,
                handleSubmit,
                setFieldValue,
                setFieldTouched,
                handleBlur,
                errors,
                touched,
              }) => {
                const selectedLevel = values.regardingLevelOfSkills?.label;

                const allLevels = [
                  {label: 'Beginner', value: 674180001},
                  {label: 'Intermediate', value: 674180002},
                  {label: 'Expert', value: 674180003},
                ];

                let filteredLevelOptions = allLevels;

                if (
                  itemData?.statusReason?.label === 'Approved' ||
                  itemData?.statusReason?.label === 'Applied' ||
                  itemData?.statusReason?.label === 'Rejected'
                ) {
                  if (selectedLevel === 'Beginner') {
                    filteredLevelOptions = allLevels.filter(
                      level =>
                        level.label === 'Beginner' ||
                        level.label === 'Intermediate' ||
                        level.label === 'Expert',
                    );
                  } else if (selectedLevel === 'Intermediate') {
                    filteredLevelOptions = allLevels.filter(
                      level =>
                        level.label === 'Intermediate' ||
                        level.label === 'Expert',
                    );
                  } else if (selectedLevel === 'Expert') {
                    filteredLevelOptions = allLevels.filter(
                      level => level.label === 'Expert',
                    );
                  }
                }

                return (
                  <>
                    <View style={{marginVertical: 5}}>
                      <CustomDropdownWithModal
                        label="Skills"
                        selectedValue={values.regardingToSkills}
                        options={skillOptions}
                        onSelect={(selectedOption: any) =>
                          setFieldValue('regardingToSkills', selectedOption)
                        }
                        disabled={
                          itemData?.statusReason?.label === 'Approved' ||
                          itemData?.statusReason?.label === 'Rejected'
                        }
                      />

                      {touched.regardingToSkills?.value && (
                        <Text style={styles(isDark).error}>
                          {typeof errors.regardingToSkills?.value === 'string'
                            ? errors.regardingToSkills?.value
                            : ''}
                        </Text>
                      )}
                    </View>

                    <View style={{marginVertical: 5}}>
                      <CustomDropdownWithModal
                        label="Level of Skill"
                        selectedValue={values.regardingLevelOfSkills}
                        options={filteredLevelOptions}
                        onSelect={(selectedOption: any) =>
                          setFieldValue(
                            'regardingLevelOfSkills',
                            selectedOption,
                          )
                        }
                      />

                      {touched.regardingLevelOfSkills &&
                        errors.regardingLevelOfSkills && (
                          <Text style={styles(isDark).error}>
                            {typeof errors.regardingLevelOfSkills?.value ===
                            'string'
                              ? errors.regardingLevelOfSkills.value
                              : ''}
                          </Text>
                        )}
                    </View>

                    <View style={{marginVertical: 5}}>
                      <CustomDropdownWithModal
                        label="Has Certification"
                        selectedValue={values.regardingCertification}
                        options={certOptions}
                        onSelect={(selectedOption: any) =>
                          setFieldValue(
                            'regardingCertification',
                            selectedOption,
                          )
                        }
                      />

                      {touched.regardingCertification &&
                        errors.regardingCertification && (
                          <Text style={styles(isDark).error}>
                            {typeof errors.regardingCertification?.value ===
                            'string'
                              ? errors.regardingCertification.value
                              : ''}
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
                            autoFocus={true}
                          />
                          {touched.certificateTitle &&
                            typeof errors.certificateTitle === 'string' &&
                            !!errors.certificateTitle && (
                              <Text style={styles(isDark).error}>
                                {errors.certificateTitle}
                              </Text>
                            )}
                        </View>

                        <View style={{marginVertical: 5}}>
                          <CustomDropdownWithModal
                            autoFocus={true}
                            label="Type of Certification"
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
                                {typeof errors.regardingTypeCertification
                                  ?.value === 'string'
                                  ? errors.regardingTypeCertification.value
                                  : ''}
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
                );
              }}
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
