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
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useSelector} from 'react-redux';
import {isDarkTheme} from '../../AppStore/Reducers/appState';
import CustomHeader from '../../Components/CustomHeader';
import {Colors} from '../../constants/Colors';
import {
  useGetMyFeedbacksByFeedBackIdQuery,
  useGetAttachmentFromSharePointQuery,
} from '../../Services/services';
import {Card, IconButton} from 'react-native-paper';
import Toast from 'react-native-toast-message';
import ShimmerPlaceHolder from '../Placeholder/ShimmerPlaceHolder';
import moment from 'moment';
import RNFetchBlob from 'rn-fetch-blob';

const ViewFeedback = ({navigation, route}: any) => {
  const isDark = useSelector(isDarkTheme);
  const EmployeeId = useSelector((state: any) => state?.appState?.authToken);
  const connected = useSelector((state: any) => state?.appState?.connected);

  const {feedbackId, feedBackTitle} = route.params;
  const [ViewData, setViewData] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const {data, error, isLoading, refetch} = useGetMyFeedbacksByFeedBackIdQuery({
    FeedBackId: feedbackId,
    accessToken: EmployeeId?.authToken?.accessToken,
  });

  const {data: attachmentData} = useGetAttachmentFromSharePointQuery({
    entityId: feedbackId,
    entityName: 'solz_feedback',
    accessToken: EmployeeId?.authToken?.accessToken,
  });

  const handleViewFeedback = async () => {
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
      const result = await data;
      if (data?.messageDetail?.message_code === 200) {
        setViewData(data.data);
      } else if (result?.messageDetail?.message_code === 204) {
        setViewData([]);
      }
    } catch (err) {
      console.error('Error fetching feedback data', err);
    }
  };

  useEffect(() => {
    handleViewFeedback();
  }, [data]);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
      refetch();
    }, 1000);
  };

  if (!feedbackId) {
    return (
      <View style={styles(isDark).mainContainer}>
        <Text style={styles(isDark).loadingText}>
          No Feedback Details Available
        </Text>
      </View>
    );
  }

  const requestStoragePermission = async () => {
    console.log('1');
    
    if (Platform.OS === 'android') {
      console.log('2');
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE
        );
        console.log(granted);
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.warn('Permission error:', err);        
        return false;
      }
    }
    return true;
  };

  const downloadFile = async (
    base64Data: string | null,
    fileUrl: string | null,
    fileName: string,
  ) => {
    console.log('Downloading file:', fileName);
    const hasPermission = await requestStoragePermission();
    console.log('Storage permission:', hasPermission);
    if (!hasPermission) {
      Toast.show({
        type: 'error',
        text1: 'Permission Denied',
        text2: 'Storage permission is required.',
      });
      return;
    }

    const {config, fs, android} = RNFetchBlob;
    const filePath = `${fs.dirs.DownloadDir}/${fileName}`;

    try {
      if (fileUrl) {
        config({
          fileCache: true,
          addAndroidDownloads: {
            useDownloadManager: true,
            notification: true,
            title: fileName,
            description: 'Downloading file...',
            path: filePath,
            mime: 'application/octet-stream',
          },
        })
          .fetch('GET', fileUrl)
          .then(res => {
            Toast.show({
              type: 'success',
              text1: 'Download Complete',
              text2: `File saved to Downloads`,
            });
            android.actionViewIntent(res.path(), 'application/octet-stream');
          })
          .catch(error => {
            Toast.show({
              type: 'error',
              text1: 'Download Failed',
              text2: error.message,
            });
          });
      } else if (base64Data) {
        await fs.writeFile(filePath, base64Data, 'base64');
        Toast.show({
          type: 'success',
          text1: 'Download Complete',
          text2: `File saved to Downloads`,
        });
        android.actionViewIntent(filePath, 'application/octet-stream');
      } else {
        Toast.show({
          type: 'error',
          text1: 'Download Failed',
          text2: 'No valid file source available.',
        });
      }
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Download Failed',
        text2: error.message,
      });
    }
  };

  const renderItem = ({item}: any) => (
    <Card
      style={{
        backgroundColor: isDark ? Colors.black : Colors.background,
        marginVertical: 10,
        borderColor: Colors.background,
        borderWidth: 0.5,
        marginHorizontal: 16,
      }}>
      <Card.Content>
        <Text style={[styles(isDark).reportedOn, {textAlign: 'right'}]}>
          {moment(item.reportedOn, 'DD-MM-YYYY').format('D MMM YYYY')}
        </Text>

        <View>
          <Text style={styles(isDark).title}>{item.feedBackTitle}</Text>
        </View>

        <View style={styles(isDark).row}>
          <View>
            <Text style={styles(isDark).label}>Regarding:</Text>
            <Text style={[styles(isDark).value, {textAlign: 'left'}]}>
              {item.regardingTo.label}
            </Text>
          </View>
          <View>
            <Text style={styles(isDark).label}>Status:</Text>
            <Text style={styles(isDark).value}>{item.status.label}</Text>
          </View>
        </View>

        <View style={styles(isDark).section}>
          <Text style={styles(isDark).label}>Description:</Text>
          <Text style={styles(isDark).description}>
            {item.feedBackDescription}
          </Text>
        </View>

        {attachmentData?.data?.length > 0 && (
          <View style={[styles(isDark).attachmentBox]}>
            {attachmentData.data.map((attachment: any, index: number) => (
              <View key={index} style={styles(isDark).attachmentItem}>
                <Text style={styles(isDark).attachmentText}>
                  {attachment.fileName}
                </Text>
                <TouchableOpacity
                  onPress={() =>
                    downloadFile(
                      attachment.bytes,
                      attachment.fileUrl,
                      attachment.fileName,
                    )
                  }
                  style={styles(isDark).downloadContainer}>
                  <IconButton
                    icon="download"
                    size={30}
                    iconColor={isDark ? Colors.white : Colors.black}
                  />
                  <Text style={styles(isDark).downloadText}>Download here</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}
      </Card.Content>
    </Card>
  );

  return (
    <View style={styles(isDark).mainContainer}>
      <CustomHeader
        showBackIcon
        title="View Feedback"
        onPress={() => navigation.goBack()}
      />
      <View style={styles(isDark).divider} />

      {isLoading ? (
        <ShimmerPlaceHolder />
      ) : (
        data &&
        data !== null && (
          <FlatList
            data={ViewData}
            renderItem={renderItem}
            keyExtractor={(item: any) => item.feedBackId}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={() => onRefresh()}
              />
            }
          />
        )
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
    card: {
      marginHorizontal: 16,
      backgroundColor: isDark ? Colors.black : Colors.white,
      borderRadius: 5,
      elevation: 4,
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
    reportedOn: {
      fontSize: 14,
      fontFamily: 'Lato-Semibold',
      color: isDark ? Colors.white : Colors.black,
    },
    label: {
      fontSize: 14,
      fontFamily: 'Lato-Bold',
      color: isDark ? Colors.white : Colors.black,
    },
    value: {
      fontSize: 14,
      fontFamily: 'Lato-Regular',
      color: isDark ? Colors.white : Colors.black,
    },

    description: {
      fontSize: 14,
      fontFamily: 'Lato-Regular',
      color: isDark ? Colors.white : Colors.black,
      marginTop: 4,
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
    attachmentItem: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: 5,
    },
    attachmentText: {
      fontSize: 14,
      fontFamily: 'Lato-Regular',
      color: isDark ? Colors.white : Colors.black,
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
