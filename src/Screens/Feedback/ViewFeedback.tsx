import { View, Text, StyleSheet, RefreshControl, TouchableOpacity, ScrollView, ActivityIndicator, } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { isDarkTheme } from '../../AppStore/Reducers/appState';
import { Colors } from '../../constants/Colors';
import { useGetAttachmentFromSharePointQuery, useGetMyFeedbacksByFeedBackIdQuery } from '../../Services/services';
import { IconButton } from 'react-native-paper';
import moment from 'moment';
import Share from 'react-native-share';

const ViewFeedback = ({ feedbackData }: { feedbackData: any }) => {
  const isDark = useSelector(isDarkTheme);
  const EmployeeId = useSelector((state: any) => state?.appState?.authToken);
  const [refreshing, setRefreshing] = useState(false);
  const [feedbackByID, SetFeedbackByID] = useState<any>([]);

  const params = { FeedBackId: feedbackData?.feedBackId, accessToken: EmployeeId?.authToken?.accessToken }
  const { data, isLoading, refetch, error } = useGetMyFeedbacksByFeedBackIdQuery(params)

  useEffect(() => {
    if (data) {
      SetFeedbackByID(() => data?.data)
    }
  }, [data])

  const {
    data: attachmentData,
  } = useGetAttachmentFromSharePointQuery({
    entityId: feedbackData?.feedBackId,
    entityName: 'solz_feedback',
    accessToken: EmployeeId?.authToken?.accessToken,
  });

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

  const base64ToUri = (base64String: string | null, mimeType: string) => {
    return `data:${mimeType};base64,${base64String}`;
  };


  const downloadFile = async (base64Data: string | null, fileName: string) => {
    Share.open({
      url: base64ToUri(base64Data, 'application/pdf'),
      type: 'application/pdf',
      title: fileName,
      message: fileName,
      subject: fileName,
    })
      .then(res => { console.log(res); })
      .catch(err => { err && console.log(err); }
      );
  };

  return (
    <View style={styles(isDark).mainContainer}>
      {isLoading ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      ) : (
        <ScrollView
          style={{ flex: 1, backgroundColor: isDark ? Colors.black : Colors.background, padding: 10 }}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        >
          <Text
            style={[styles(isDark).value, { textAlign: 'right', fontFamily: 'Lato-Bold' },]}>
            {moment(feedbackByID[0]?.reportedOn, 'DD-MM-YYYY').format(
              'D MMM, YYYY',
            )}
          </Text>
          <Text style={[styles(isDark).txt, { flex: 1, flexWrap: 'wrap' }]}>
            {[feedbackByID[0]?.feedBackTitle]}
          </Text>


          <View style={styles(isDark).row}>
            <View>
              <Text
                style={[styles(isDark).value, { fontFamily: 'Lato-Bold' }]}>
                Regarding:
              </Text>
              <Text style={[styles(isDark).value, { textAlign: 'left' }]}>
                {feedbackByID[0]?.regardingTo?.label}
              </Text>
            </View>
            <View>
              <Text
                style={[styles(isDark).value, { fontFamily: 'Lato-Bold' }]}>
                Status:
              </Text>
              <Text style={styles(isDark).value}>
                {feedbackByID[0]?.status?.label}
              </Text>
            </View>
          </View>

          {((feedbackByID[0]?.status?.label === 'Declined') || (feedbackByID[0]?.status?.label === 'Resolved')) &&
            (
              <>
                <View style={styles(isDark).row}>
                  <View>
                    <Text
                      style={[styles(isDark).value, { fontFamily: 'Lato-Bold' }]}>
                      date of Resolution:
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
                    <Text style={styles(isDark).value}>
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

          {((feedbackByID[0]?.status?.label === 'Declined') || (feedbackByID[0]?.status?.label === 'Resolved')) &&
            (
              <View style={styles(isDark).section}>
                <Text style={[styles(isDark).value, { fontFamily: 'Lato-Bold' }]}>
                  Resolution:
                </Text>
                <Text style={styles(isDark).value}>
                  {feedbackByID[0]?.resolution}
                </Text>
              </View>
            )
          }

          {attachmentData?.data?.length > 0 &&
            (
              (
                <View style={styles(isDark).attachmentBox}>
                  {attachmentData.data.map(
                    (attachment: any, index: number) => (
                      <View
                        key={index}
                        style={styles(isDark).attachmentContainer}>
                        <Text style={styles(isDark).value}>
                          {attachment.fileName}
                        </Text>
                        <TouchableOpacity
                          onPress={() =>
                            downloadFile(
                              attachment.bytes,
                              attachment.fileName
                            )
                          }
                          style={styles(isDark).downloadContainer}>
                          <View
                            style={{
                              borderRadius: 45,
                              backgroundColor:
                                Colors.primary,

                            }}>
                            <IconButton
                              icon="download-outline"
                              size={25}
                              iconColor={Colors.white}
                            />
                          </View>
                        </TouchableOpacity>
                      </View>
                    ),
                  )}
                </View>
              ))}
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
    row: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 8,
    },
    section: {
      marginVertical: 8,
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
      marginTop: 10,
      backgroundColor: isDark ? Colors.gray : Colors.white,
      flexWrap: 'wrap'
    },
    attachmentContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: 5,
      flexWrap: 'wrap'

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
