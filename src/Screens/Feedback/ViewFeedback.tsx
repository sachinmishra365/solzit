import {
  View,
  Text,
  StyleSheet,
  RefreshControl,
  FlatList,
  TouchableOpacity,
  Linking,
  PermissionsAndroid,
  Platform,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useSelector} from 'react-redux';
import {isDarkTheme} from '../../AppStore/Reducers/appState';
import CustomHeader from '../../Components/CustomHeader';
import {Colors} from '../../constants/Colors';
import {useGetAttachmentFromSharePointQuery} from '../../Services/services';
import {Card, IconButton} from 'react-native-paper';
import moment from 'moment';
import Share from 'react-native-share';

const ViewFeedback = ({ feedbackData }: { feedbackData: any }) => {

  const isDark = useSelector(isDarkTheme);
  const EmployeeId = useSelector((state: any) => state?.appState?.authToken);


  const [refreshing, setRefreshing] = useState(false);

  const {
    data: attachmentData,
    error,
    isLoading,
    refetch,
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
    return `data:${mimeType};base64,${base64String}`;};


  const downloadFile = async (base64Data: string | null, fileName: string) => { 
   Share.open({
    url: base64ToUri(base64Data, 'application/pdf'),
    type: 'application/pdf',
    title: fileName, 
    message: fileName, 
    subject: fileName,})   
   .then(res => { console.log(res); })   
   .catch(err => {err && console.log(err);}
  );};

  return (
    <View style={styles(isDark).mainContainer}>
      {isLoading ? (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={styles(isDark).loadingText}>Loading...</Text>
        </View>
      ) : (
        <ScrollView
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }>
          <Card
            style={{
              backgroundColor: isDark ? Colors.black : Colors.white,
              borderRadius:1,
              borderColor: Colors.background,
              borderWidth: 0.5,
            }}>
            <Card.Content>
              <Text
                style={[
                  styles(isDark).value,
                  {textAlign: 'right', fontFamily: 'Lato-Semibold'},
                ]}>
                {moment(feedbackData?.reportedOn, 'DD-MM-YYYY').format(
                  'D MMM YYYY',
                )}
              </Text>

              <View>
                <Text style={[styles(isDark).title, {fontSize: 16}]}>
                  {[feedbackData?.feedBackTitle]} 
                </Text>
              </View>

              <View style={styles(isDark).row}>
                <View>
                  <Text
                    style={[styles(isDark).value, {fontFamily: 'Lato-Bold'}]}>
                    Regarding:
                  </Text>
                  <Text style={[styles(isDark).value, {textAlign: 'left'}]}>
                    {feedbackData?.regardingTo.label}
                  </Text>
                </View>
                <View>
                  <Text
                    style={[styles(isDark).value, {fontFamily: 'Lato-Bold'}]}>
                    Status:
                  </Text>
                  <Text style={styles(isDark).value}>
                    {feedbackData?.status.label}
                  </Text>
                </View>
              </View>

              <View style={styles(isDark).section}>
                <Text style={[styles(isDark).value, {fontFamily: 'Lato-Bold'}]}>
                  Description:
                </Text>
                <Text style={styles(isDark).value}>
                  {feedbackData?.feedBackDescription}
                </Text>
              </View>

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
            </Card.Content>
          </Card>
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
      borderWidth: 1,
      height: 1,
      backgroundColor: isDark ? Colors.white : 'transparent',
      borderColor: isDark ? Colors.black : 'transparent',
      marginBottom: 10,
    },
    row: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 8,
    },
    section: {
      marginVertical: 8,
    },
    title: {
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

    loadingText: {
      fontSize: 16,
      textAlign: 'center',
      color: isDark ? Colors.white : Colors.black,
    },
    errorText: {
      fontSize: 16,
      textAlign: 'center',
      color: Colors.accent,
    },
    attachmentBox: {
      borderWidth: 0.5,
      borderRadius: 3,
      padding: 10,
      marginTop: 10,
      backgroundColor: isDark ? Colors.gray : Colors.white,
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
