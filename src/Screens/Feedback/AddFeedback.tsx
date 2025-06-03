import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  Image,
} from 'react-native';
import React, {useState} from 'react';
import {useSelector} from 'react-redux';
import {isDarkTheme} from '../../AppStore/Reducers/appState';
import CustomHeader from '../../Components/CustomHeader';
import {Colors} from '../../constants/Colors';
import {
  useAttachFileInSharePointMutation,
  useCreateMyFeedBacksMutation,
  useGetOptionSetReportedQuery,
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
import ImageCropPicker from 'react-native-image-crop-picker';
import CustomDropdownWithModal from '../../Components/CustomDropDown';


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
  upload: Yup.array().when('isAttachmentRequired', {
    is: true,
    then: schema => schema.min(1, 'Please upload at least one file'),
    otherwise: schema => Yup.array().notRequired(),
  }),
});

const AddFeedback = ({navigation, route}: any) => {
  const isDark = useSelector(isDarkTheme);
  const EmployeeId = useSelector((state: any) => state?.appState?.authToken);
  const connected = useSelector((state: any) => state?.appState?.connected);
  const auth = useSelector((state: any) => state?.appState?.authToken);

  const [CreateMyFeedBacks, {isLoading}] = useCreateMyFeedBacksMutation();
  const [UploadDocument, result] = useAttachFileInSharePointMutation();
  const {data: regardingOptionsData, isLoading: reportedLoading} =
    useGetOptionSetReportedQuery({
      ReportedTo:'ReportedTo',
      accessToken: EmployeeId?.authToken?.accessToken,
    });

  const regardingToData =
    regardingOptionsData?.data?.map((item: any) => ({
      label: item.label,
      value: item.value,
    })) || [];
    
  const [modalVisible, setModalVisible] = useState(false);

  const openModal = () => setModalVisible(true);
  const closeModal = () => setModalVisible(false);

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

  const handleUploadDocument = async (feedbackId: string, files: any[]) => {
    const itemDetails = files.map(file => ({
      filename: file.filename,
      filetype: file.filetype,
      bytes: file.bytes,
      ID: feedbackId,
      Name: 'solz_feedback',
    }));

    const data = {itemDetails};

    try {
      const response = await UploadDocument({
        accessToken: EmployeeId?.authToken?.accessToken,
        data,
      }).unwrap();

      if (response?.isSuccessful) {
        Toast.show({
          type: 'success',
          text1: 'Success',
          text2: 'Files uploaded successfully',
        });
      } else {
        throw new Error(
          response?.messageDetail?.message || 'File upload failed',
        );
      }
    } catch (error) {
      console.error('Upload error:', error);
      Toast.show({
        type: 'error',
        text1: 'Upload Error',
        text2: (error as any)?.message || 'Unknown error',
      });
    }
  };

  // const pickFromCamera = async (setFieldValue: any, currentFiles: any[]) => {
  //   try {
  //     const result = await launchCamera({
  //       mediaType: 'photo',
  //       includeBase64: true,
  //     });
  //     if (result.assets && result.assets.length > 0) {
  //       const asset = result.assets[0];
  //       const newFile = {
  //         filename: asset.fileName,
  //         filetype: asset.type,
  //         bytes: asset.base64,
  //       };
  //       setFieldValue('upload', [...(currentFiles || []), newFile]);
  //     }
  //   } catch (err) {
  //     console.error('Camera error:', err);
  //   }
  // };
  const pickFromCamera = async (setFieldValue: any, currentFiles: any[]) => {
    try {
      const image = await ImageCropPicker.openCamera({
        cropping: false, // Set to true if you want cropping
        width: 500,
        height: 500,
        includeExif: true,
        mediaType: 'photo',
        includeBase64: true,
      });

      const newFile = {
        filename: image.filename || `IMG_${Date.now()}.jpg`,
        filetype: image.mime,
        bytes: image.data,
      };

      setFieldValue('upload', [...(currentFiles || []), newFile]);
    } catch (err: any) {
      if (err.code !== 'E_PICKER_CANCELLED') {
        console.error('Camera pick error:', err);
      }
    }
  };

  const pickFromFiles = async (setFieldValue: any, currentFiles: any[]) => {
    try {
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.allFiles],
        allowMultiSelection: true,
      });

      const filesArray = Array.isArray(res) ? res : [res];

      const newFiles = await Promise.all(
        filesArray.map(async file => {
          const base64File = await RNFS.readFile(file.uri, 'base64');
          return {
            filename: file.name,
            filetype: file.type,
            bytes: base64File,
          };
        }),
      );

      setFieldValue('upload', [...(currentFiles || []), ...newFiles]);
    } catch (err) {
      if (!DocumentPicker.isCancel(err)) {
        console.error('File pick error:', err);
      }
    }
  };

  const onTakePhoto = (setFieldValue: any, currentFiles: any[]) => {
    closeModal();
    pickFromCamera(setFieldValue, currentFiles);
  };

  const onPickFile = (setFieldValue: any, currentFiles: any[]) => {
    closeModal();
    pickFromFiles(setFieldValue, currentFiles);
  };

  return (
    <View style={styles(isDark).maincontainer}>
      <CustomHeader
        showBackIcon={true}
        title="Add Feedback"
        onPress={() => navigation.goBack()}
      />
      {isLoading || result?.isLoading ? (
        <Placeholder />
      ) : (
        <>
          <Text style={[styles(isDark).label, {marginHorizontal: 16}]}>
            Soluzione values your feedback. Please feel free to share your
            thoughts.
          </Text>

          <ScrollView contentContainerStyle={{marginHorizontal: 16}}>
            <Formik
              initialValues={{
                regardingTo: {label: 'Select', value: null},
                feedBackTitle: '',
                feedBackDescription: '',
                isAttachmentRequired: false,
                upload: [], 
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
                  <View style={{marginVertical: 10}} />
                  {/* <Text style={styles(isDark).label}>Regarding</Text> */}
                  <CustomDropdownWithModal
                    label="Regarding"
                    selectedValue={values.regardingTo}
                    options={regardingToData}
                    onSelect={(selectedOption: any) =>
                      setFieldValue('regardingOptions', selectedOption)
                    }
                  />

                  {touched.regardingTo?.value && (
                    <Text style={styles(isDark).error}>
                      {errors.regardingTo?.value}
                    </Text>
                  )}

                  <View style={{marginVertical: 12}} />
                  <CustomTextInput
                    label="Title"
                    value={values.feedBackTitle}
                    secureTextEntry={false}
                    leftIconName="clipboard-text-outline"
                    onChangeText={(text: string) => {
                      handleChange('feedBackTitle')(text);
                      setFieldValue('feedBackTitle', text);
                      setFieldTouched('feedBackTitle', true, false);
                    }}
                    onBlur={handleBlur('feedBackTitle')}
                    editable={true}
                    autoFocus={true}
                  />
                  {touched.feedBackTitle && errors.feedBackTitle && (
                    <Text style={styles(isDark).error}>
                      {errors.feedBackTitle}
                    </Text>
                  )}

                  <View style={{marginVertical: 12}} />
                  <CustomTextInput
                    label="Description"
                    value={values.feedBackDescription}
                    secureTextEntry={false}
                    leftIconName="message-reply-text-outline"
                    onChangeText={(text: string) => {
                      handleChange('feedBackDescription')(text);
                      setFieldValue('feedBackDescription', text);
                      setFieldTouched('feedBackDescription', true, false);
                    }}
                    onBlur={handleBlur('feedBackDescription')}
                    editable={true}
                    contentStyle={{height: 100}}
                    numberOfLines={5}
                    multiline={true}
                    autoFocus={true}
                  />
                  {touched.feedBackDescription &&
                    errors.feedBackDescription && (
                      <Text style={styles(isDark).error}>
                        {errors.feedBackDescription}
                      </Text>
                    )}

                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      marginHorizontal: -8,
                    }}>
                    <Checkbox
                      status={
                        values.isAttachmentRequired ? 'checked' : 'unchecked'
                      }
                      onPress={() =>
                        setFieldValue(
                          'isAttachmentRequired',
                          !values.isAttachmentRequired,
                        )
                      }
                      color={isDark ? Colors.secondary : Colors.primary}
                      uncheckedColor={
                        isDark ? Colors.secondary : Colors.primary
                      }
                    />
                    <Text style={styles(isDark).label}>Attachments</Text>
                  </View>
                  {values.isAttachmentRequired && (
                    <>
                      <TouchableOpacity
                        onPress={openModal}
                        style={styles(isDark).uploadButton}>
                        <IconButton
                          icon="paperclip"
                          iconColor={isDark ? 'white' : 'black'}
                          size={30}
                        />
                        <Text style={styles(isDark).uploadButtonText}>
                          {values.upload && values.upload.length > 0
                            ? values.upload
                                .map((file: any, i: number) =>
                                  file.filetype?.startsWith('image/')
                                    ? `image${i + 1}.${
                                        file.filetype.split('/')[1]
                                      }`
                                    : file.filename,
                                )
                                .join(', ')
                            : 'Add Attachment'}
                        </Text>
                      </TouchableOpacity>

                      {touched.upload && errors.upload && (
                        <Text style={styles(isDark).error}>
                          {errors.upload}
                        </Text>
                      )}

                      <View style={{marginVertical: 16}}>
                        <ScrollView
                          horizontal
                          showsHorizontalScrollIndicator={false}>
                          {values.upload?.map((file: any, index) => {
                            const isImage = file.filetype?.startsWith('image/');
                            return (
                              <View
                                key={index}
                                style={{marginRight: 10, alignItems: 'center'}}>
                                {isImage ? (
                                  <Image
                                    source={{
                                      uri: `data:${file.filetype};base64,${file.bytes}`,
                                    }}
                                    style={{
                                      width: 80,
                                      height: 80,
                                      borderRadius: 8,
                                    }}
                                  />
                                ) : (
                                  <IconButton
                                    icon="file-document-outline"
                                    size={40}
                                  />
                                )}
                                {!isImage && (
                                  <Text
                                    numberOfLines={1}
                                    style={{width: 80, textAlign: 'center'}}>
                                    {file.filename}
                                  </Text>
                                )}
                              </View>
                            );
                          })}
                        </ScrollView>
                      </View>

                      <Modal
                        visible={modalVisible}
                        transparent
                        animationType="fade"
                        onRequestClose={closeModal}>
                        <TouchableOpacity
                          style={styles(isDark).modalOverlay}
                          activeOpacity={1}
                          onPress={closeModal}>
                          <View style={styles(isDark).modalContent}>
                            <TouchableOpacity
                              style={styles(isDark).modalButton}
                              onPress={() =>
                                onTakePhoto(setFieldValue, values.upload)
                              }>
                              <IconButton icon="camera" size={25} />
                              <Text style={styles(isDark).modalButtonText}>
                                Take Photo
                              </Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                              style={styles(isDark).modalButton}
                              onPress={() =>
                                onPickFile(setFieldValue, values.upload)
                              }>
                              <IconButton icon="tray-arrow-up" size={25} />
                              <Text style={styles(isDark).modalButtonText}>
                                Upload File
                              </Text>
                            </TouchableOpacity>
                          </View>
                        </TouchableOpacity>
                      </Modal>
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
                      Submit
                    </Text>
                  </TouchableOpacity>
                  {/* Pass setFieldValue and values.upload to onTakePhoto and onPickFile */}
                  <Modal
                    visible={modalVisible}
                    transparent
                    animationType="fade"
                    onRequestClose={closeModal}>
                    <TouchableOpacity
                      style={styles(isDark).modalOverlay}
                      activeOpacity={1}
                      onPress={closeModal}>
                      <View style={styles(isDark).modalContent}>
                        <TouchableOpacity
                          style={[
                            styles(isDark).modalButton,
                            {
                              borderBottomWidth: 1,
                              borderBottomColor: isDark
                                ? Colors.dark_gray
                                : Colors.medium_gray,
                            },
                          ]}
                          onPress={() =>
                            onTakePhoto(setFieldValue, values.upload)
                          }>
                          <IconButton
                            icon="camera"
                            size={25}
                            iconColor={Colors.primary}
                          />
                          <Text style={styles(isDark).modalButtonText}>
                            Take Photo
                          </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                          style={styles(isDark).modalButton}
                          onPress={() =>
                            onPickFile(setFieldValue, values.upload)
                          }>
                          <IconButton
                            icon="tray-arrow-up"
                            size={25}
                            iconColor={Colors.primary}
                          />
                          <Text style={styles(isDark).modalButtonText}>
                            Upload File
                          </Text>
                        </TouchableOpacity>
                      </View>
                    </TouchableOpacity>
                  </Modal>
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
      marginBottom: 10,
      fontFamily: 'Lato-Regular',
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: isDark ? 'rgba(100,100,100,0.25)' : 'rgba(0,0,0,0.5)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    modalContent: {
      backgroundColor: isDark ? Colors.black : Colors.white,
      borderRadius: 3,
      padding: 20,
      width: '80%',
    },
    modalButton: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    modalButtonText: {
      fontFamily: 'Lato-Bold',
      marginLeft: 10,
      color: isDark ? Colors.white : Colors.black,
    },
  });

export default AddFeedback;
