import {View, Text, StyleSheet, FlatList, RefreshControl} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useSelector} from 'react-redux';
import {isDarkTheme} from '../../AppStore/Reducers/appState';
import CustomHeader from '../../Components/CustomHeader';
import {Colors} from '../../constants/Colors';
import {useGetEmloyeeBreaKLogsByEmployeeIdMutation} from '../../Services/services';
import ShimmerPlaceHolder from '../Placeholder/ShimmerPlaceHolder';
import {Card, Chip, FAB, Icon} from 'react-native-paper';
import moment from 'moment';
import EmptyData from '../../Components/EmptyData';

const Breakes = ({navigation}: any) => {
  const isDark = useSelector(isDarkTheme);
  const accessToken = useSelector(
    (state: any) => state?.appState?.authToken?.authToken?.accessToken,
  );
  const [EmloyeeBreaKLogs, {isLoading}] =
    useGetEmloyeeBreaKLogsByEmployeeIdMutation();

  const [breaKLogs, setBreaKLogs] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    handlebreaKLogs();
  }, []);

  const handlebreaKLogs = async () => {
    try {
      const response = await EmloyeeBreaKLogs({
        accessToken: accessToken,
        data: {},
      }).unwrap();
      if (response?.isSuccessful) {
        setBreaKLogs(response?.data);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    handlebreaKLogs().finally(() => setRefreshing(false));
  };

  const renderItem = ({item}: any) => (
    <Card style={styles(isDark).card} elevation={3}>
      <Card.Content>
        <View style={styles(isDark).headerRow}>
          <View style={styles(isDark).headerLeft}>
            {/* <Icon
              source="calendar-month-outline"
              size={20}
              color={Colors.primary}
            /> */}
            <Text style={[styles(isDark).label, {fontSize: 16}]}>
              {item?.returnTime
                ? moment(item?.outTime).format('DD MMM YYYY')
                : 'No Date'}
            </Text>
          </View>

          <View
            style={{
              flexDirection: 'row',
              backgroundColor: Colors.primary,
              paddingVertical: 6,
              paddingHorizontal: 12,
              borderRadius: 16,
              alignItems: 'center',
              justifyContent: 'center',
              alignSelf: 'flex-start',
              gap: 4, 
            }}>
            <Icon source="clock-outline" size={16} color={Colors.white} />
            <Text
              style={{
                color: Colors.white,
                fontFamily: 'Lato-Bold',
                fontSize: 12,
              }}>
              {item?.breakDuration ? `${item?.breakDuration} hrs` : 'N/A'}
            </Text>
          </View>
        </View>


        <View style={styles(isDark).timeRow}>
          <View style={styles(isDark).halfRow}>
            <Icon source="logout" size={20} color={Colors.error} />
            <Text style={styles(isDark).label}>
              Out{' : '}
              <Text style={styles(isDark).value}>
                {item?.outTime
                  ? moment(item?.outTime).format('hh:mm A')
                  : 'N/A'}
              </Text>
            </Text>
          </View>
          <View style={styles(isDark).halfRow}>
            <Icon source="login" size={20} color={Colors.green} />
            <Text style={styles(isDark).label}>
              Return{' : '}
              <Text style={styles(isDark).value}>
                {item?.returnTime
                  ? moment(item?.returnTime).format('hh:mm A')
                  : 'N/A'}
              </Text>
            </Text>
          </View>
        </View>

   
        <View style={styles(isDark).infoRow}>
          {/* <Icon
            source="file-document-outline"
            size={20}
            color={Colors.primary}
          /> */}
          <Text style={[styles(isDark).label, {flex: 1}]}>
            Reason{' : '}
            <Text
              style={[
                styles(isDark).value,
                {lineHeight: 20, color: isDark ? Colors.white : Colors.black},
              ]}>
              {item?.reason ? item?.reason : 'N/A'}
            </Text>
          </Text>
        </View>
      </Card.Content>
    </Card>
  );

  return (
    <View style={styles(isDark).mainContainer}>
      <CustomHeader
        showBackIcon={true}
        title="My Breakes"
        isDark={isDark}
        onPress={() => navigation.goBack()}
      />
      {isLoading ? (
        <ShimmerPlaceHolder />
      ) : breaKLogs?.length > 0 ? (
        <FlatList
          data={breaKLogs}
          showsVerticalScrollIndicator={false}
          keyExtractor={(item, index) => index.toString()}
          renderItem={renderItem}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          ListFooterComponent={<View style={{height: 100}} />}
        />
      ) : (
        <EmptyData />
      )}
      <FAB
        style={styles(isDark).fab}
        color={Colors.white}
        onPress={() => navigation.navigate('AddBreaks')}
        accessibilityLabel="Add Feedback"
        icon="plus"
      />
    </View>
  );
};

const styles = (isDark: boolean) =>
  StyleSheet.create({
    mainContainer: {
      flex: 1,
      backgroundColor: isDark ? Colors.black : Colors.white,
    },
    card: {
      backgroundColor: isDark ? Colors.black : Colors.background,
      marginVertical: 5,
      borderColor: Colors.white,
      borderWidth: 0.5,
      marginHorizontal: 16,
    },
    headerRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 8,
    },
    headerLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6, 
    },

    titleText: {
      fontSize: 16,
      fontFamily: 'Lato-Bold',
      color: isDark ? Colors.white : Colors.black,
      flex: 1,
      marginLeft: 8,
    },
    chip: {
      backgroundColor: Colors.primary,
      height: 28,
      borderRadius: 20,
    },
    chipText: {
      color: Colors.white,
      fontSize: 12,
      fontFamily: 'Lato-Bold',
    },
    infoRow: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      marginVertical: 4,
      gap: 6,
    },
    label: {
      fontSize: 14,
      color: isDark ? Colors.white : Colors.black,
      fontFamily: 'Lato-Semibold',
      flexWrap: 'wrap',
    },
    value: {
      fontSize: 14,
      fontFamily: 'Lato-Regular',
      color: Colors.primary,
    },
    fab: {
      position: 'absolute',
      right: 32,
      bottom: 52,
      backgroundColor: isDark ? Colors.gray : Colors.primary,
      elevation: 10,
    },
    timeRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 10,
      gap: 12,
    },

    halfRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      flex: 1,
    },
  });

export default Breakes;
