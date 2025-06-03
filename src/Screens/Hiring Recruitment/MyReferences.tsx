import { View, Text, StyleSheet, RefreshControl, FlatList, TouchableOpacity, Linking } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { isDarkTheme } from '../../AppStore/Reducers/appState';
import CustomHeader from '../../Components/CustomHeader';
import { Colors, FontSize, hiringRecruitment } from '../../constants/Colors';
import Toast from 'react-native-toast-message';
import { useGetCandidateApplicationByEmployeeIdQuery } from '../../Services/services';
import ShimmerPlaceHolder from '../Placeholder/ShimmerPlaceHolder';
import { Card, Icon } from 'react-native-paper';

const MyReferences = ({ navigation }: any) => {
  const isDark = useSelector(isDarkTheme);
  const EmployeeId = useSelector((state: any) => state?.appState?.authToken);
  const connected = useSelector((state: any) => state?.appState?.connected);

  const [ReferenceData, setReferenceDataData] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const { data, error, isLoading, refetch } =
    useGetCandidateApplicationByEmployeeIdQuery({
      accessToken: EmployeeId?.authToken?.accessToken,
    });

    const getStatusColor = (statusValue:any) => {
  const status = hiringRecruitment.find(item => item.value === statusValue);
  return status?.color || '#000'; 
};

  const handleReference = async () => {
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

      if (
        result !== undefined &&
        result?.messageDetail?.message_code === 200 &&
        result !== null
      ) {
        setReferenceDataData(result?.data);
      }
    } catch (err) { }
  };

  useEffect(() => {
    handleReference();
  }, [data]);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
      refetch();
    }, 1000);
  };

  const renderItem = ({ item }: any) => (
    <Card
      style={{
        backgroundColor: isDark ? Colors.black : Colors.background,
        marginVertical: 7,
        borderColor: Colors.background,
        borderWidth: 0.5,
        marginHorizontal: 16,
      }}>
      <Card.Content>
        <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',flexWrap: 'wrap'}}>
          {
            item?.position?.name && (
                <Text style={[styles(isDark).infoText, { fontFamily: 'Lato-Bold', fontSize: 18 }]}>
                  {item.position?.name || 'N/A'}
                </Text>
            )
          }
         <Text
  style={{
    color: getStatusColor(item.applicationStatus?.value),
    fontFamily: 'Lato-Bold',
  }}
>
  {item.applicationStatus?.label}
</Text>
        </View>

        {/* <View style={[styles(isDark).status, { marginVertical: 3 }]}>
          <Text
            style={{
              fontSize: 16,
              fontFamily: 'Lato-Semibold',
              color: isDark ? Colors.white : Colors.black,
            }}>
            Status{' '}:
          </Text>
          <Text style={{ color: Colors.primary, fontFamily: 'Lato-Semibold', }}>
            {' '}
            {item.applicationStatus?.label}
          </Text>
        </View> */}

        <View style={styles(isDark).infoRow}>
          <Icon
            source="account"
            size={20}
            color={isDark ? Colors.white : Colors.primary}
          />
          <Text style={[styles(isDark).infoText, { fontFamily: 'Lato-Semibold', marginLeft: 10,fontSize: 16 }]}>
            {item.firstName} {item.lastName}
          </Text>
        </View>
        <TouchableOpacity
          onPress={() => Linking.openURL(`mailto:${item.email}`)}>
          <View style={styles(isDark).infoRow}>
            <Icon
              source="email"
              size={20}
              color={isDark ? Colors.white : Colors.primary}
            />
            <Text
              style={[
                styles(isDark).infoText,
                {
                  color: Colors.primary, textDecorationLine: 'underline', marginLeft: 10,
                  marginTop: -5
                },
              ]}>
              {item.email}
            </Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => Linking.openURL(`tel:${item.mobileNumber}`)}>
          <View style={styles(isDark).infoRow}>
            <Icon
              source="phone"
              size={20}
              color={isDark ? Colors.white : Colors.primary}
            />
            <Text style={[styles(isDark).infoText, { color: Colors.primary, marginLeft: 10, }]}>
              {item.mobileNumber}
            </Text>
          </View>
        </TouchableOpacity>
      </Card.Content>
    </Card>
  );
  return (
    <View style={styles(isDark).maincontainer}>
      <CustomHeader
        showBackIcon={true}
        title="My References"
        onPress={() => navigation.goBack()}
      />
      <View style={styles(isDark).divider} />

      {isLoading ? (
        <ShimmerPlaceHolder />
      ) : data?.data === null ? (
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
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
        <FlatList
          showsVerticalScrollIndicator={false}
          data={ReferenceData}
          renderItem={renderItem}
          keyExtractor={(item, index) => index.toString()}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => onRefresh()}
            />
          }
          ListFooterComponent={<View style={{ height: 100 }} />}
        />
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
    divider: {
      borderWidth: 1,
      height: 1,
      backgroundColor: isDark ? Colors.white : 'transparent',
      borderColor: isDark ? Colors.black : 'transparent',
    },
    status: {
      flexDirection: 'row',
      justifyContent: 'flex-start',
      alignItems: 'center',
    },
    infoRow: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 5,
    },
    infoText: {
      fontSize: 14,
      fontFamily: 'Lato-Medium',
      color: isDark ? Colors.white : Colors.black,
    },
  });

export default MyReferences;
