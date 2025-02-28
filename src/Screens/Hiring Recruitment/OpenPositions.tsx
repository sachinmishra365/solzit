import {View, Text, StyleSheet, FlatList, RefreshControl} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useSelector} from 'react-redux';
import {isDarkTheme} from '../../AppStore/Reducers/appState';
import CustomHeader from '../../Components/CustomHeader';
import {Colors} from '../../constants/Colors';
import {useGetListOfOpenPositionQuery} from '../../Services/services';
import Toast from 'react-native-toast-message';
import ShimmerPlaceHolder from '../Placeholder/ShimmerPlaceHolder';
import {Card, Icon, IconButton} from 'react-native-paper';
import {TouchableOpacity} from 'react-native-gesture-handler';

const OpenPositions = ({navigation}: any) => {
  const isDark = useSelector(isDarkTheme);
  const EmployeeId = useSelector((state: any) => state?.appState?.authToken);
  const connected = useSelector((state: any) => state?.appState?.connected);

  const [OpenPositionData, setOpenPositionData] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const {data, error, isLoading, refetch} = useGetListOfOpenPositionQuery({
    accessToken: EmployeeId?.authToken?.accessToken,
  });

  const handleOpenPosition = async () => {
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
        setOpenPositionData(result?.data);
      }
    } catch (err) {}
  };

  useEffect(() => {
    handleOpenPosition();
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
        <View style={[styles(isDark).titleContainer, {marginBottom: 8}]}>
          <Text style={styles(isDark).title}>{item.hiringPosition}</Text>
          <View>
            <Text style={styles(isDark, item.urgency).urgencyText}>
              {item.urgency}
            </Text>
          </View>
        </View>

        <View style={styles(isDark).rowContainer}>
          <View>
            <Text style={[styles(isDark).value, {fontFamily: 'Lato-Bold'}]}>
              Experience Range
            </Text>
            <Text style={styles(isDark).value}>{item.experienceRange}</Text>
          </View>
          <View>
            <Text style={[styles(isDark).value, {fontFamily: 'Lato-Bold'}]}>
              Number of Positions
            </Text>
            <Text style={styles(isDark).value}>{item.numberOfPosition}</Text>
          </View>
        </View>

        <View style={styles(isDark).rowContainer}>
          <View>
            <Text style={[styles(isDark).value, {fontFamily: 'Lato-Bold'}]}>
              Is Work From Home?
            </Text>
            <Text style={styles(isDark).value}>
              {item.isWorkFromHomeAvailable}
            </Text>
          </View>
          <View>
            <Text style={[styles(isDark).value, {fontFamily: 'Lato-Bold'}]}>
              Work Location
            </Text>
            <Text style={styles(isDark).value}>{item.location || 'N/A'}</Text>
          </View>
        </View>
        <View style={[styles(isDark).titleContainer, {marginTop: 10}]}>
          <TouchableOpacity
            style={[styles(isDark).addReferenceButton,{backgroundColor: '#916918',}]}
            onPress={() =>
              navigation.navigate('PositionDetail', {position: item})
            }>
            <Icon source="eye" size={25} color={Colors.white} />
            <Text style={styles(isDark).addReferenceText}>Position Detail</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles(isDark).addReferenceButton}
            onPress={() =>
              navigation.navigate('AddReference', {position: item})
            }>
            <Icon source="plus" size={25} color={Colors.white} />
            <Text style={styles(isDark).addReferenceText}>Add Reference</Text>
          </TouchableOpacity>
        </View>
      </Card.Content>
    </Card>
  );

  return (
    <View style={styles(isDark).maincontainer}>
      <CustomHeader
        showBackIcon={true}
        title="Open Positions"
        onPress={() => navigation.goBack()}
      />
      <View style={styles(isDark).divider} />

      {isLoading ? (
        <ShimmerPlaceHolder />
      ) : (
        data &&
        data !== null && (
          <FlatList
            data={OpenPositionData}
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

const styles = (isDark: boolean, urgency?: string) =>
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
      marginBottom: 10,
    },
    title: {
      fontSize: 18,
      fontFamily: 'Lato-Bold',
      color: Colors.primary,
    },
    rowContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 10,
    },

    value: {
      fontSize: 14,
      color: isDark ? Colors.white : Colors.black,
      alignSelf: 'center',
    },
    text: {
      fontSize: 14,
      fontFamily: 'Lato-Regular',
      color: isDark ? Colors.white : Colors.black,
    },
    urgencyText: {
      fontSize: 16,
      fontFamily: 'Lato-Bold',
      color:
        urgency === 'Urgent'
          ? Colors.accent
          : urgency === 'High'
          ? '#916918'
          : 'green',
    },

    titleContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },

    addReferenceButton: {
      backgroundColor: Colors.primary,
      justifyContent: 'center',
      borderRadius: 3,
      paddingVertical: 5,
      paddingHorizontal: 6,
      alignItems: 'center',
      flexDirection: 'row',
      height: 'auto',
      minHeight: 38,
    },
    addReferenceText: {
      fontSize: 16,
      fontFamily: 'Lato-Bold',
      color: Colors.white,
      marginLeft: 3,
    },
  });

export default OpenPositions;
