import {
  View,
  Text,
  StyleSheet,
  RefreshControl,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { isDarkTheme } from '../../AppStore/Reducers/appState';
import { Colors } from '../../constants/Colors';
import {
  useGetAttachmentFromSharePointQuery,
  useGetMyFeedbacksByFeedBackIdQuery,
} from '../../Services/services';
import { IconButton } from 'react-native-paper';
import moment from 'moment';
import Share from 'react-native-share';
import CustomHeader from '../../Components/CustomHeader';
import RNFS from 'react-native-fs';

const ViewFeedback = ({ route, navigation }: any) => {
  const { feedbackData } = route.params;
  const isDark = useSelector(isDarkTheme);
  const EmployeeId = useSelector((state: any) => state?.appState?.authToken);
  const [refreshing, setRefreshing] = useState(false);
  const [feedbackByID, SetFeedbackByID] = useState<any>([]);

  const params = {
    FeedBackId: feedbackData?.feedBackId,
    accessToken: EmployeeId?.authToken?.accessToken,
  };
  const { data, refetch, error } = useGetMyFeedbacksByFeedBackIdQuery(params);

  useEffect(() => {
    if (data) {
      SetFeedbackByID(() => data?.data);
    }
  }, [data]);

  const { data: attachmentData, isLoading } = useGetAttachmentFromSharePointQuery(
    {
      entityId: feedbackData?.feedBackId,
      entityName: 'solz_feedback',
      accessToken: EmployeeId?.authToken?.accessToken,
    },
  );


  const handleDownload = async (base64Data: string | null, fileName: string) => {
    if (!base64Data) {
      Alert.alert('Download failed', 'No file data available.');
      return;
    }

    try {
      const downloadPath = `${RNFS.DownloadDirectoryPath}/${fileName}`;
      await RNFS.writeFile(downloadPath, base64Data, 'base64');
      Alert.alert('Download Success', `File saved to: ${downloadPath}`);
    } catch (error) {
      console.log('File Download Failed:', error);
      Alert.alert('Download failed', 'There was an error while downloading the file.');
    }
  };

  if (!feedbackData) {
    return (
      <View style={styles(isDark).mainContainer}>
        <Text style={styles(isDark).value}>No Position Details Available</Text>
      </View>
    );
  }

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
      refetch();
    }, 1000);
  };


  return (
    <View style={styles(isDark).mainContainer}>
      <CustomHeader
        showBackIcon={true}
        title="View Feedback"
        onPress={() => navigation.goBack()}
      />
      <View style={styles(isDark).divider} />
      {isLoading ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      ) : (
        <ScrollView
          style={{
            flex: 1,
            backgroundColor: isDark ? Colors.black : Colors.background,
            padding: 10,
          }}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }>
          <Text
            style={[
              styles(isDark).value,
              {
                textAlign: 'right',
                fontFamily: 'Lato-Bold',
                marginHorizontal: 16,
              },
            ]}>
            {moment(feedbackByID[0]?.reportedOn, 'DD-MM-YYYY').format(
              'D MMM, YYYY',
            )}
          </Text>

          <View style={{ marginHorizontal: 16 }}>
            <Text style={[styles(isDark).txt, { flex: 1, flexWrap: 'wrap' }]}>
              {[feedbackByID[0]?.feedBackTitle]}
            </Text>
          </View>

          <View style={{ marginHorizontal: 16, marginBottom: 5 }}>
            <Text style={[styles(isDark).value, { fontFamily: 'Lato-Bold' }]}>
              Regarding{' : '}
              <Text style={[styles(isDark).value, { textAlign: 'left' }]}>
                {feedbackByID[0]?.regardingTo?.label}
              </Text>
            </Text>

            <Text style={[styles(isDark).value, { fontFamily: 'Lato-Bold' }]}>
              Status{' : '}
              <Text style={styles(isDark).value}>
                {feedbackByID[0]?.status?.label}
              </Text>
            </Text>
          </View>

          {(feedbackByID[0]?.status?.label === 'Declined' ||
            (feedbackByID[0]?.status?.label === 'Resolved' &&
              feedbackByID[0]?.publishToEmp === true)) && (
              <>
                <View style={styles(isDark).row}>
                  <View>
                    <Text
                      style={[styles(isDark).value, { fontFamily: 'Lato-Bold' }]}>
                      Date of Resolution:
                    </Text>
                    <Text style={[styles(isDark).value, { textAlign: 'left' }]}>
                      {feedbackByID[0]?.actionTakenOn}
                    </Text>
                  </View>

                  <View>
                    <Text
                      style={[styles(isDark).value, { fontFamily: 'Lato-Bold' }]}>
                      Action taken by:
                    </Text>
                    <Text style={[styles(isDark).value]}>
                      {feedbackByID[0]?.actionTakenBy}
                    </Text>
                  </View>
                </View>
              </>
            )}
          <View style={styles(isDark).section}>
            <Text style={[styles(isDark).value, { fontFamily: 'Lato-Bold' }]}>
              Description:
            </Text>
            <Text style={styles(isDark).value}>
              {feedbackByID[0]?.feedBackDescription}
            </Text>
          </View>

          {(feedbackByID[0]?.status?.label === 'Declined' ||
            (feedbackByID[0]?.status?.label === 'Resolved' &&
              feedbackByID[0]?.publishToEmp === true)) && (
              <View style={styles(isDark).section}>
                <Text style={[styles(isDark).value, { fontFamily: 'Lato-Bold' }]}>
                  Resolution:
                </Text>
                <Text style={styles(isDark).value}>
                  {feedbackByID[0]?.resolution}
                </Text>
              </View>
            )}

          {attachmentData?.data?.length > 0 && (
            <View style={styles(isDark).attachmentBox}>
              {attachmentData.data.map((attachment: any, index: number) => (
                <View key={index} style={styles(isDark).attachmentContainer}>
                  <Text
                    style={[
                      styles(isDark).value,
                      { flexWrap: 'wrap', width: '70%' },
                    ]}>
                    {attachment.fileName}
                  </Text>
                  <IconButton
                    icon="download-circle"
                    size={40}
                    iconColor={Colors.primary}
                    onPress={() =>
                      // downloadFile(attachment.bytes, attachment.fileName)
                      handleDownload(attachment.bytes, attachment.fileName)
                    }
                  />
                </View>
              ))}
            </View>
          )}
        </ScrollView>
      )}
    </View>
  );
};

const styles = (isDark: boolean) =>
  StyleSheet.create({
    mainContainer: {
      flex: 1,
      backgroundColor: isDark ? Colors.black : Colors.background,
    },
    divider: {
      borderWidth: 1,
      height: 1,
      backgroundColor: isDark ? Colors.white : 'transparent',
      borderColor: isDark ? Colors.black : 'transparent',
    },
    row: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 8,
      marginHorizontal: 16
    },
    section: {
      marginVertical: 8,
      marginHorizontal: 16,
    },
    txt: {
      fontSize: 16,
      fontFamily: 'Lato-Bold',
      color: Colors.primary,
      marginBottom: 8,

    },
    value: {
      fontSize: 14,
      fontFamily: 'Lato-Regular',
      color: isDark ? Colors.white : Colors.black,
    },
    attachmentBox: {
      borderWidth: 0.5,
      borderRadius: 3,
      padding: 10,
      backgroundColor: isDark ? Colors.gray : Colors.white,
      marginHorizontal: 16,
    },
    attachmentContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: 5,

    },
    downloadContainer: {
      alignItems: 'center',
    },
    downloadText: {
      fontSize: 12,
      fontFamily: 'Lato-Regular',
      color: isDark ? Colors.white : Colors.black,
    },
  });

export default ViewFeedback;
