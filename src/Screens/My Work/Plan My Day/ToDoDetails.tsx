import {
  View,
  Text,
  StyleSheet,
  FlatList,
  RefreshControl,
  TextInput,
  Button,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import CustomHeader from '../../../Components/CustomHeader';
import {useSelector} from 'react-redux';
import {isDarkTheme} from '../../../AppStore/Reducers/appState';
import {Colors} from '../../../constants/Colors';
import Toast from 'react-native-toast-message';
import ShimmerPlaceHolder from '../../Placeholder/ShimmerPlaceHolder';
import {useGetToDoDetailsByToDoIdQuery} from '../../../Services/workloglevel';
import moment from 'moment';
import {Checkbox, Icon, IconButton, List} from 'react-native-paper';
import {useAttachFileInSharePointMutation} from '../../../Services/services';
import DocumentPicker from 'react-native-document-picker';
import RNFS from 'react-native-fs';

const ToDoDetails = ({navigation, route}: any) => {
  const isDark = useSelector(isDarkTheme);
  const accessToken = useSelector((state: any) => state?.appState?.authToken);
  const EmployeeId = useSelector((state: any) => state?.appState?.authToken);
  const connected = useSelector((state: any) => state?.appState?.connected);

  const ToDoDetail = route?.params?.ToDoDetail;
  const {data, isLoading, error} = useGetToDoDetailsByToDoIdQuery({
    accessToken: accessToken?.authToken?.accessToken,
    ItemId: ToDoDetail?.id ?? 0,
  });
  const [UploadDocument, result] = useAttachFileInSharePointMutation();

  interface PlanData {
    projectName: string;
    workStatus: {label: string};
    userStoryTitle: string;
    itemType: {label: string};
    title: string;
    itemNumber: string;
    description: string;
    userPriority: {label: string};
    implementationeffort: number;
    assignee: {name: string};
    plannedStartDate: string;
    plannedEndDate: string;
    comments: string;
  }
  const WORK_STATUS_OPTIONS = [
    {label: 'Select', value: '674180000'},
    {label: 'On Hold', value: '674180008'},
    {label: 'Work In Progress', value: '674180001'},
    {label: 'Work Complete', value: '674180002'},
  ];
  const [selectedWorkStatus, setSelectedWorkStatus] = useState(
    ToDoDetail?.workStatus?.label ?? '',
  );
  const [expanded, setExpanded] = useState(false);
  const [myPlanData, setMyPlanData] = useState<PlanData[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [isAttachmentRequired, setIsAttachmentRequired] = useState(false);
  const [selectedFile, setSelectedFile] = useState<any>(null);

  const handleMyPlans = async () => {
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
    try {
      if (data?.data && (data as any)?.messageDetail?.message_code === 200) {
        setMyPlanData([data.data]);
      }
      if (
        data?.data?.isSuccessful &&
        data?.data?.messageDetail?.message_code === 201
      ) {
        const feedbackId = data?.data?.data;
        const values = {isAttachmentRequired: false, upload: null};
        if (values.isAttachmentRequired && values.upload) {
          await handleUploadDocument(feedbackId, values.upload);
        }
        navigation.goBack();
      } else {
        throw new Error(
          data?.data?.messageDetail?.message || 'Failed to add Document',
        );
      }
    } catch (error) {
      console.error('Error adding Document:', JSON.stringify(error, null, 2));
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: (error as any)?.message || 'Unknown error',
      });
    }
  };

  useEffect(() => {
    handleMyPlans();
  }, [data]);

  const onRefresh = () => {
    setRefreshing(true);
    handleMyPlans().finally(() => setRefreshing(false));
  };

  const handleUploadDocument = async (feedbackId: string, file: any) => {
    const data = {
      itemDetails: [
        {
          filename: file.filename,
          filetype: file.filetype,
          bytes: file.bytes,
          ID: feedbackId,
          Name: 'solz_feedback',
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
          text2: 'Record created successfully',
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

  const pickDocument = async () => {
    try {
      const res = await DocumentPicker.pickSingle({
        type: [DocumentPicker.types.allFiles],
      });

      const base64File = await RNFS.readFile(res.uri, 'base64');

      return {
        filename: res.name,
        filetype: res.type,
        bytes: base64File,
      };
    } catch (err) {
      console.error('Document picking error:', err);
      return null;
    }
  };

  return (
    <View style={styles(isDark).mainContainer}>
      <CustomHeader
        showBackIcon={true}
        title="To-Do Details"
        isDark={isDark}
        onPress={() => navigation.goBack()}
      />
      <View style={styles(isDark).divider} />
      <Text
        style={[
          styles(isDark).label,
          {marginHorizontal: 16, marginVertical: 10},
        ]}>
        To-Do Details{' | '}
        {ToDoDetail?.itemNumber ?? 'N/A'}
      </Text>
      {isLoading ? (
        <ShimmerPlaceHolder />
      ) : data?.data === null ? (
        <View
          style={{
            flex: 1,
            alignItems: 'center',
          }}>
          <Text
            style={{
              color: isDark ? Colors.white : Colors.black,
              alignSelf: 'center',
              fontFamily: 'Lato-Bold',
            }}>
            No Records
          </Text>
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={styles(isDark).scrollContainer}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          showsVerticalScrollIndicator={false}>
          {myPlanData.map((item, index) => (
            <View key={index} style={styles(isDark).itemContainer}>
              <Text style={styles(isDark).label}>
                Project<Text style={{color: 'red'}}>*</Text>
              </Text>
              <TextInput
                style={styles(isDark).input}
                value={item.projectName || ''}
                editable={false}
              />

              <Text style={styles(isDark).label}>
                Work Status<Text style={{color: 'red'}}>*</Text>
              </Text>
              <List.Accordion
                title={selectedWorkStatus || 'Select Work Status'}
                expanded={expanded}
                onPress={() => setExpanded(!expanded)}
                style={{
                  backgroundColor: isDark ? Colors.gray : Colors.background,
                  borderWidth: 0.5,
                  borderColor: isDark ? Colors.medium_gray : Colors.medium_gray,
                  borderRadius: 1,
                  height: 57,
                }}
                right={props => (
                  <List.Icon
                    {...props}
                    icon="chevron-down"
                    color={isDark ? Colors.white : Colors.black}
                  />
                )}
                titleStyle={{
                  color: isDark ? Colors.white : Colors.black,
                  fontFamily: 'Lato-Regular',
                  fontSize: 14,
                }}>
                {WORK_STATUS_OPTIONS.map(option => (
                  <List.Item
                    key={option.value}
                    title={option.label}
                    onPress={() => {
                      setSelectedWorkStatus(option.label);
                      setExpanded(false);
                    }}
                    right={() =>
                      selectedWorkStatus === option.label ? (
                        <Icon
                          source="check"
                          size={20}
                          color={isDark ? Colors.primary : Colors.primary}
                        />
                      ) : null
                    }
                    style={{
                      backgroundColor:
                        selectedWorkStatus === option.label
                          ? isDark
                            ? Colors.gray
                            : Colors.background
                          : 'transparent',
                      borderRadius: 1,
                      marginVertical: 2,
                    }}
                    titleStyle={{
                      color: isDark ? Colors.white : Colors.black,
                      fontFamily: 'Lato-Regular',
                      fontSize: 14,
                    }}
                  />
                ))}
              </List.Accordion>

              <Text style={[styles(isDark).label, {marginTop: 5}]}>
                User Story
              </Text>
              <TextInput
                style={styles(isDark).input}
                value={item.userStoryTitle}
                editable={false}
                multiline={true}
                numberOfLines={4}
              />

              <View style={styles(isDark).rowContainer}>
                <View style={styles(isDark).halfWidth}>
                  <Text style={styles(isDark).label}>
                    Type<Text style={{color: 'red'}}>*</Text>
                  </Text>
                  <TextInput
                    style={styles(isDark).input}
                    value={item.itemType.label}
                    editable={false}
                  />
                </View>
                <View style={styles(isDark).halfWidth}>
                  <Text style={styles(isDark).label}>Priority</Text>
                  <TextInput
                    style={styles(isDark).input}
                    value={item.userPriority.label}
                    editable={false}
                  />
                </View>
              </View>

              <Text style={styles(isDark).label}>Title</Text>
              <TextInput
                style={styles(isDark).input}
                value={item.title}
                editable={false}
                multiline={true}
                numberOfLines={4}
              />

              <Text style={styles(isDark).label}>Description</Text>
              <TextInput
                style={styles(isDark).input}
                value={item.description}
                editable={false}
                multiline={true}
                numberOfLines={6}
              />

              <View style={styles(isDark).rowContainer}>
                <View style={styles(isDark).halfWidth}>
                  <Text style={styles(isDark).label}>Assignee</Text>
                  <TextInput
                    style={styles(isDark).input}
                    value={item?.assignee?.name ?? 'Unassigned'}
                    editable={false}
                  />
                </View>
                <View style={styles(isDark).halfWidth}>
                  <Text style={styles(isDark).label}>Estimated Effort</Text>
                  <TextInput
                    style={styles(isDark).input}
                    value={item.implementationeffort.toString()}
                    editable={false}
                  />
                </View>
              </View>
              <View style={styles(isDark).rowContainer}>
                <View style={styles(isDark).halfWidth}>
                  <Text style={styles(isDark).label}>Planned Start Date</Text>
                  <TextInput
                    style={styles(isDark).input}
                    value={
                      item?.plannedStartDate
                        ? moment(
                            item.plannedStartDate,
                            'MM/DD/YYYY HH:mm:ss',
                          ).format('DD MMM YYYY')
                        : 'No Data Available'
                    }
                  />
                </View>
                <View style={styles(isDark).halfWidth}>
                  <Text style={styles(isDark).label}>Planned End Date</Text>
                  <TextInput
                    style={styles(isDark).input}
                    value={
                      item?.plannedEndDate
                        ? moment(
                            item.plannedEndDate,
                            'MM/DD/YYYY HH:mm:ss',
                          ).format('DD MMM YYYY')
                        : 'No Data Available'
                    }
                  />
                </View>
              </View>

              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginHorizontal: -8,
                }}>
                <Checkbox
                  status={isAttachmentRequired ? 'checked' : 'unchecked'}
                  onPress={() => setIsAttachmentRequired(!isAttachmentRequired)}
                  color={isDark ? Colors.secondary : Colors.primary}
                  uncheckedColor={isDark ? Colors.secondary : Colors.primary}
                />
                <Text style={styles(isDark).label}>Attachments</Text>
              </View>

              {isAttachmentRequired && (
                <>
                  <TouchableOpacity
                    onPress={async () => {
                      const file = await pickDocument();
                      if (file) {
                        setSelectedFile(file);
                      }
                    }}
                    style={styles(isDark).uploadButton}>
                    <IconButton
                      icon="tray-arrow-up"
                      iconColor={isDark ? Colors.white : Colors.black}
                      size={30}
                    />
                    <Text style={styles(isDark).uploadButtonText}>
                      {selectedFile?.filename || 'Add Attachment'}
                    </Text>
                  </TouchableOpacity>
                </>
              )}
            </View>
          ))}
          <View style={{height: 100}} />
        </ScrollView>
      )}
    </View>
  );
};

const styles = (isDark: boolean) =>
  StyleSheet.create({
    mainContainer: {
      flex: 1,
      backgroundColor: isDark ? Colors.black : Colors.white,
    },
    divider: {
      height: 1,
      backgroundColor: isDark ? Colors.medium_gray : 'transparent',
    },
    card: {
      backgroundColor: isDark ? Colors.black : Colors.background,
      marginVertical: 7,
      borderColor: Colors.background,
      borderWidth: 0.5,
      marginHorizontal: 16,
      overflow: 'hidden',
    },
    scrollContainer: {
      flexGrow: 1,
      marginHorizontal: 16,
    },

    label: {
      fontSize: 14,
      fontFamily: 'Lato-Bold',
      marginBottom: 4,
      color: isDark ? Colors.white : Colors.black,
    },
    input: {
      backgroundColor: isDark ? Colors.gray : Colors.background,
      borderRadius: 2,
      padding: 8,
      marginBottom: 10,
      color: isDark ? Colors.white : Colors.black,
    },
    itemContainer: {marginBottom: 15},
    rowContainer: {flexDirection: 'row', justifyContent: 'space-between'},
    halfWidth: {width: '48%'},
    uploadButtonText: {
      color: isDark ? Colors.white : Colors.black,
      fontFamily: 'Lato-Bold',
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
  });
export default ToDoDetails;
