import {
  View,
  Text,
  StyleSheet,
  FlatList,
  RefreshControl,
  Image,
  TouchableOpacity,
  Linking,
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
import moment from 'moment';

const SoluzioneDirectory = ({navigation}: any) => {
  const isDark = useSelector(isDarkTheme);
  const accessToken = useSelector((state: any) => state?.appState?.authToken);
  const connected = useSelector((state: any) => state?.appState?.connected);

  const [directoryData, setDirectoryData] = useState([]);
  const [filteredData, setFilteredData] = useState(directoryData);
  const [searchText, setSearchText] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const {data, error, isLoading, refetch} =
    useGetSoluzioneUpcomingBirthdaysQuery({
      accessToken: accessToken?.authToken?.accessToken,
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
    } catch (err) {
      console.log(err);
    }
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
  const filterData = (data: any) => {
    return data?.filter(
      (item: any) =>
        item?.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item?.designation?.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  };

  const filteredList = [...filterData(directoryData)];

  const renderItem = ({item}: any) => {
    return (
      <Card style={styles(isDark).card}>
        <Card.Content>
          <View style={{marginTop: -10}}>
            <Text style={[styles(isDark).name]}>
              {item.fullName}
              {' | '}
              {item.designation}
            </Text>
          </View>

          <View style={[styles(isDark).row, {marginBottom: -10}]}>
            <View style={styles(isDark).imageContainer}>
              <Image
                source={
                  item.employeeImg
                    ? {uri: `data:image/png;base64,${item.employeeImg}`}
                    : require('../../Assets/Images/EmpBoy.png')
                }
                style={styles(isDark).image}
              />
            </View>

            <View>
              <TouchableOpacity
                onPress={() => Linking.openURL(`mailto:${item.email}`)}>
                <View style={[styles(isDark).row]}>
                  <IconButton
                    icon="email"
                    size={15}
                    iconColor={isDark ? Colors.black : Colors.white}
                    style={{
                      borderRadius: 8,
                      backgroundColor: 'rgba(48, 124, 232,0.6)',
                    }}
                  />
                  <Text
                    numberOfLines={2}
                    style={[
                      styles(isDark).email,
                      {flexShrink: 1, maxWidth: '80%'},
                    ]}>
                    {item.email}
                  </Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => Linking.openURL(`tel:${item.mobile}`)}>
                <View style={[styles(isDark).row]}>
                  <IconButton
                    icon="phone"
                    size={15}
                    iconColor={isDark ? Colors.black : Colors.white}
                    style={{
                      borderRadius: 8,
                      backgroundColor: 'rgba(12, 102, 15,0.6)',
                    }}
                  />
                  <Text
                    numberOfLines={2}
                    style={[
                      styles(isDark).email,
                      {flexShrink: 1, maxWidth: '80%'},
                    ]}>
                    {item.mobile}
                  </Text>
                </View>
              </TouchableOpacity>

              <View style={[styles(isDark).row]}>
                <IconButton
                  icon="cake"
                  size={15}
                  iconColor={isDark ? Colors.black : Colors.white}
                  style={{
                    borderRadius: 8,
                    backgroundColor: 'rgba(255, 152, 0,0.6)',
                  }}
                />
                <Text style={[styles(isDark).email]}>
                  {moment(item.birthdayDate).format('MMM D')}
                </Text>
              </View>
            </View>
          </View>
        </Card.Content>
      </Card>
    );
  };

  return (
    <View style={styles(isDark).maincontainer}>
      <CustomHeader
        showBackIcon={true}
        title="Soluzione Directory"
        onPress={() => navigation.goBack()}
        showSearch={true}
        searchValue={searchQuery}
        onSearchChange={(text: any) => setSearchQuery(text)}
      />

      {isLoading ? (
        <ShimmerPlaceHolder />
      ) : (
        data &&
        data !== null && (
          <FlatList
            showsVerticalScrollIndicator={false}
            data={filteredList}
            renderItem={renderItem}
            keyExtractor={(item, index) => index.toString()}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={() => onRefresh()}
              />
            }
            ListFooterComponent={<View style={{height: 100}} />}
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
    card: {
      backgroundColor: isDark ? Colors.black : Colors.background,
      marginVertical: 7,
      borderColor: isDark ? Colors.dark_gray : Colors.background,
      borderWidth: 0.5,
      marginHorizontal: 16,
    },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    image: {
      width: 80,
      height: 80,
      borderRadius: 50,
      marginRight: 10,
      borderWidth: 0.5,
      borderColor: isDark ? Colors.black : Colors.background,
    },
    name: {
      color: isDark ? Colors.white : Colors.black,
      fontFamily: 'Lato-Bold',
      fontSize: 18,
    },
    email: {
      fontSize: 14,
      fontFamily: 'Lato-Regular',
      color: isDark ? Colors.white : Colors.black,
    },
    imageContainer: {
      alignItems: 'center',
    },
  });

export default SoluzioneDirectory;
