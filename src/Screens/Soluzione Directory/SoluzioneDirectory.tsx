import { View, Text, StyleSheet, FlatList, RefreshControl, Image, TouchableOpacity, Linking } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { isDarkTheme } from '../../AppStore/Reducers/appState';
import CustomHeader from '../../Components/CustomHeader';
import { Colors } from '../../constants/Colors';
import { useGetSoluzioneUpcomingBirthdaysQuery } from '../../Services/services';
import Toast from 'react-native-toast-message';
import ShimmerPlaceHolder from '../Placeholder/ShimmerPlaceHolder';
import { Card, Icon } from 'react-native-paper';
import moment from 'moment';

const SoluzioneDirectory = ({ navigation }: any) => {
  const isDark = useSelector(isDarkTheme);
  const accessToken = useSelector((state: any) => state?.appState?.authToken);
  const connected = useSelector((state: any) => state?.appState?.connected);

  const [directoryData, setDirectoryData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  const { data, error, isLoading, refetch } = useGetSoluzioneUpcomingBirthdaysQuery({ accessToken: accessToken?.authToken?.accessToken });

  const handleDirectory = async () => {
    if (!connected) {
      Toast.show({
        type: 'error',
        text1: 'Network Error',
        text2: 'Please check your internet connection',
        text2Style: { flexWrap: 'wrap', fontSize: 20, fontFamily: 'Lato-Regular', },
        topOffset: 80,
        visibilityTime: 5000,
      });
      return;
    }
    try {
      const result = await data;
      if (result !== undefined && result?.messageDetail?.message_code === 200 && result !== null) {
        setDirectoryData(result?.data);
        setFilteredData(result?.data);
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

  const handleSearch = (text: string) => {
    setSearchText(text);
    if (text) {
      const filtered = directoryData.filter(
        (item: any) =>
          item.fullName.toLowerCase().includes(text.toLowerCase()) ||
          item.designation.toLowerCase().includes(text.toLowerCase()),
      );
      setFilteredData(filtered);
    } else {
      setFilteredData(directoryData);
    }
  };

  const renderItem = ({ item }: any) => {
    return (
      <Card style={styles(isDark).card}>
        <Card.Content>
          <View style={[styles(isDark).row]}>
            <View style={styles(isDark).imageContainer}>
              <Image
                source={item.employeeImg ? { uri: `data:image/png;base64,${item.employeeImg}` } : require('../../Assets/Images/EmpBoy.png')}
                style={styles(isDark).image}
              />
              <View style={[styles(isDark).row, { marginTop: 5 }]}>
                <Icon source="cake" size={20} color={isDark ? Colors.white : Colors.primary} />
                <Text style={styles(isDark).birthday}>
                  {' '}{moment(item.birthdayDate).format('MMM, D')}
                </Text>
              </View>
            </View>
            <View style={{ flex: 1, marginRight: 8 }}>
              <View style={[styles(isDark).row, {}]}>
                <Icon source="account" size={20} color={isDark ? Colors.white : Colors.primary} />
                <Text style={[styles(isDark).name, { fontFamily: 'Lato-Bold', fontSize: 18 }]}>
                  {item.fullName}
                </Text>
              </View>
              <View style={[styles(isDark).row, { marginVertical: 5 }]}>
                <Icon source="briefcase" size={20} color={isDark ? Colors.white : Colors.primary} />
                <Text style={[styles(isDark).name, { fontFamily: 'Lato-Semibold', fontSize: 16 },]}>
                  {item.designation}
                </Text>
              </View>
              <TouchableOpacity onPress={() => Linking.openURL(`mailto:${item.email}`)}>
                <View style={[styles(isDark).row, { marginVertical: 5 }]}>
                  <Icon source="email" size={20} color={isDark ? Colors.white : Colors.primary} />
                  <Text
                    style={[styles(isDark).email,
                    {
                      marginTop: -5,
                      textDecorationLine: 'underline',
                      textDecorationColor: isDark ? Colors.primary : Colors.primary
                    }
                    ]}>
                    {item.email}
                  </Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => Linking.openURL(`tel:${item.mobile}`)}>
                <View style={[styles(isDark).row, { marginVertical: 5 }]}>
                  <Icon source="phone" size={20} color={isDark ? Colors.white : Colors.primary} />
                  <Text style={styles(isDark).email}>{item.mobile}</Text>
                </View>
              </TouchableOpacity>
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
        searchValue={searchText}
        onSearchChange={handleSearch}
      />

      {isLoading ? (
        <ShimmerPlaceHolder />
      ) : (
        data && data !== null && (
          <FlatList
            showsVerticalScrollIndicator={false}
            data={filteredData}
            renderItem={renderItem}
            keyExtractor={(item, index) => index.toString()}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={() => onRefresh()} />
            }
            ListFooterComponent={<View style={{ height: 100 }} />}
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
      borderColor: Colors.background,
      borderWidth: 0.5,
      marginHorizontal: 16,
      overflow: 'hidden',
    },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    image: {
      width: 80,
      height: 80,
      borderRadius: 50,
      marginRight: 15,
      borderWidth: 0.5,
      borderColor: isDark ? Colors.black : Colors.background,
    },
    name: {
      marginLeft: 10,
      color: isDark ? Colors.white : Colors.black,
    },
    birthday: {
      fontSize: 14,
      fontFamily: 'Lato-Bold',
      color: isDark ? Colors.white : Colors.primary,
      marginRight: 15,
      marginBottom: -9,
    },
    email: {
      marginLeft: 10,
      fontSize: 14,
      fontFamily: 'Lato-Medium',
      color: Colors.primary,
    },
    imageContainer: {
      alignItems: 'center',
    },
  });

export default SoluzioneDirectory;
