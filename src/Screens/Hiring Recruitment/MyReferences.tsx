import {View, Text, StyleSheet, RefreshControl, FlatList} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useSelector} from 'react-redux';
import {isDarkTheme} from '../../AppStore/Reducers/appState';
import CustomHeader from '../../Components/CustomHeader';
import {Colors} from '../../constants/Colors';
import Toast from 'react-native-toast-message';
import {useGetCandidateApplicationByEmployeeIdQuery} from '../../Services/services';
import ShimmerPlaceHolder from '../Placeholder/ShimmerPlaceHolder';
import {Card} from 'react-native-paper';

const MyReferences = ({navigation}: any) => {
  const isDark = useSelector(isDarkTheme);
  const EmployeeId = useSelector((state: any) => state?.appState?.authToken);
  const connected = useSelector((state: any) => state?.appState?.connected);

  const [ReferenceData, setReferenceDataData] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const {data, error, isLoading, refetch} =
    useGetCandidateApplicationByEmployeeIdQuery({
      accessToken: EmployeeId?.authToken?.accessToken,
    });

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
    } catch (err) {}
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
        <View style={[styles(isDark).status]}>
          <Text
            style={[
              styles(isDark).value,
              {
                fontSize: 16,
                color: isDark ? Colors.white : Colors.black,
                fontFamily: 'Lato-Bold',
              },
            ]}>
            Status :{' '}
          </Text>
          <Text
            style={[
              styles(isDark).value,
              {fontSize: 16, color: Colors.primary, fontFamily: 'Lato-Bold'},
            ]}>
            {item.applicationStatus?.label}
          </Text>
        </View>
        <View style={styles(isDark).rowContainer}>
          <Text style={[styles(isDark).value, {fontFamily: 'Lato-Bold'}]}>
            Name:
          </Text>
          <Text style={styles(isDark).value}>
            {item.firstName} {item.lastName}
          </Text>
        </View>

        <View style={styles(isDark).rowContainer}>
          <Text style={[styles(isDark).value, {fontFamily: 'Lato-Bold'}]}>
            Mobile:
          </Text>
          <Text style={styles(isDark).value}>{item.mobileNumber}</Text>
        </View>
        <View style={styles(isDark).rowContainer}>
          <Text style={[styles(isDark).value, {fontFamily: 'Lato-Bold'}]}>
            Email:
          </Text>
          <Text style={styles(isDark).value}>{item.email}</Text>
        </View>

        <View style={styles(isDark).rowContainer}>
          <Text style={[styles(isDark).value, {fontFamily: 'Lato-Bold'}]}>
            Position:
          </Text>
          <Text style={styles(isDark).value}>
            {item.position?.name || 'N/A'}
          </Text>
        </View>
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
      ) : (
        data &&
        data !== null && (
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
          />
        )
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
    rowContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 10,
    },
    value: {
      fontFamily: 'Lato-Regular',
      color: isDark ? Colors.white : Colors.black,
    },
    status: {
      flexDirection: 'row',
      justifyContent: 'flex-start',
      alignItems: 'center',
    },
  });

export default MyReferences;
