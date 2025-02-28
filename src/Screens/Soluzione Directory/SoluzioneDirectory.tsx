import {
  View,
  Text,
  StyleSheet,
  FlatList,
  RefreshControl,
  Image,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useSelector} from 'react-redux';
import {isDarkTheme} from '../../AppStore/Reducers/appState';
import CustomHeader from '../../Components/CustomHeader';
import {Colors} from '../../constants/Colors';
import {useGetSoluzioneUpcomingBirthdaysQuery} from '../../Services/services';
import Toast from 'react-native-toast-message';
import ShimmerPlaceHolder from '../Placeholder/ShimmerPlaceHolder';
import {Card, Icon, IconButton} from 'react-native-paper';

const SoluzioneDirectory = ({navigation}: any) => {
  const isDark = useSelector(isDarkTheme);
  const EmployeeId = useSelector((state: any) => state?.appState?.authToken);
  const connected = useSelector((state: any) => state?.appState?.connected);

  const [directoryData, setDirectoryData] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const {data, error, isLoading, refetch} =
    useGetSoluzioneUpcomingBirthdaysQuery({
      accessToken: EmployeeId?.authToken?.accessToken,
    });

  const handleDirectory = async () => {
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
        setDirectoryData(result?.data);
      }
    } catch (err) {}
  };

  useEffect(() => {
    handleDirectory();
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
        <View style={styles(isDark).row}>
          {item.employeeImg ? (
            <Image
              source={{uri: `data:image/png;base64,${item.employeeImg}`}}
              style={styles(isDark).image}
            />
          ) : (
            <Image
              source={require('../../Assets/Images/EmpBoy.png')}
              style={styles(isDark).image}
            />
          )}
          <View style={styles(isDark).textContainer}>
            <Text
              style={[
                styles(isDark).name,
                {fontSize: 18, fontFamily: 'Lato-Bold'},
              ]}>
              {item.fullName}
            </Text>
          </View>
        </View>
        <Text
          style={[
            styles(isDark).name,
            {fontSize: 16, fontFamily: 'Lato-Semibold'},
          ]}>
          {item.designation}
        </Text>
        <Text style={styles(isDark).email}>{item.email}</Text>
        <Text style={styles(isDark).email}>{item.mobile}</Text>
      </Card.Content>
    </Card>
  );

  return (
    <View style={styles(isDark).maincontainer}>
      <CustomHeader
        showBackIcon={true}
        title="Soluzione Directory"
        onPress={() => navigation.goBack()}
      />

      <View style={styles(isDark).divider} />
      {isLoading ? (
        <ShimmerPlaceHolder />
      ) : (
        data &&
        data !== null && (
          <FlatList
            data={directoryData}
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
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 10,
    },
    image: {
      width: 60,
      height: 60,
      borderRadius: 30,
      marginRight: 15,
      borderWidth: 1,
      borderColor: '#ddd',

    },
    textContainer: {
      flex: 1,
    },
    name: {
      color: isDark ? Colors.white : Colors.black,
    },
    email: {
      fontSize: 14,
      fontFamily: 'Lato-Regular',
      color: isDark ? Colors.white : Colors.black,
      marginTop: 5,
    },
  });

export default SoluzioneDirectory;
