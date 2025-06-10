import { View, Text, StyleSheet, FlatList, RefreshControl } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { isDarkTheme } from '../../AppStore/Reducers/appState';
import CustomHeader from '../../Components/CustomHeader';
import { Colors } from '../../constants/Colors';
import moment from 'moment';
import { useEmployeeInventoryAllocationQuery } from '../../Services/services';
import Toast from 'react-native-toast-message';
import { Card } from 'react-native-paper';
import ShimmerPlaceHolder from '../Placeholder/ShimmerPlaceHolder';

const MyAssets = ({ navigation }: any) => {
  const isDark = useSelector(isDarkTheme);
  const EmployeeId = useSelector((state: any) => state?.appState?.authToken);
  const connected = useSelector((state: any) => state?.appState?.connected);

  const [assetsData, setAssetsData] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const { data, error, isLoading, refetch } = useEmployeeInventoryAllocationQuery(
    { accessToken: EmployeeId?.authToken?.accessToken },
  );

  const handleAssets = async () => {
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
      if (data?.data && (data as any)?.messageDetail?.message_code === 200) {
        setAssetsData(data.data);
      }
    } catch (error) { }
  };

  useEffect(() => {
    handleAssets();
  }, [data]);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
      refetch();
    }, 1000);
  }, [refetch]);

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
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          {
            item.allocationDate && (
              <View style={styles(isDark).dateCard}>
                <Text style={styles(isDark).dateNumber}>
                  {moment(item.allocationDate).format('DD')}
                </Text>
                <Text style={styles(isDark).dateNumber}>
                  {moment(item.allocationDate).format('MMM')}
                </Text>
                <Text
                  style={[
                    styles(isDark).dateNumber,
                    { fontFamily: 'Lato-Bold', fontSize: 18 },
                  ]}>
                  {moment(item.allocationDate).format('YYYY')}
                </Text>
              </View>
            )
          }

          <View style={styles(isDark).assetDetails}>
            <View style={styles(isDark).row}>
              <Text style={[styles(isDark).value, { fontFamily: 'Lato-Bold' }]}>
                Name:
              </Text>
              <Text
                style={[
                  styles(isDark).value,
                  { fontFamily: 'Lato-Bold', color: Colors.secondary },
                ]}>
                {item.itemName}
              </Text>
            </View>

            <View style={styles(isDark).row}>
              <Text style={[styles(isDark).value, { fontFamily: 'Lato-Bold' }]}>
                Type:
              </Text>
              <Text style={styles(isDark).value}>{item.inventoryType}</Text>
            </View>

            <View style={styles(isDark).row}>
              <Text style={[styles(isDark).value, { fontFamily: 'Lato-Bold' }]}>
                Class:
              </Text>
              <Text style={styles(isDark).value}>{item.inventoryClass}</Text>
            </View>

            <View style={styles(isDark).row}>
              <Text style={[styles(isDark).value, { fontFamily: 'Lato-Bold' }]}>
                Number:
              </Text>
              <Text style={[styles(isDark).value, {flexShrink: 1}]}>{item.inventoryNumber}</Text>
            </View>

          </View>
        </View>
      </Card.Content>
    </Card>
  );

  return (
    <>
      <CustomHeader
        showBackIcon={true}
        title="My Assets"
        onPress={() => navigation.goBack()}
      />
      {/* <View style={styles(isDark).divider} /> */}
      <View style={styles(isDark).maincontainer}>
        {isLoading ? (
          <ShimmerPlaceHolder />
        ) : (
          data &&
          data !== null && (
            <FlatList
              showsVerticalScrollIndicator={false}
              data={assetsData}
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
          )
        )}
      </View>
    </>
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
    dateCard: {
      width: 80,
      backgroundColor: Colors.primary,
      borderRadius: 8,
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 30,
      marginRight: 15,
    },
    dateNumber: {
      fontSize: 14,
      color: Colors.white,
      fontFamily: 'Lato-SemiBold',
    },
    assetDetails: {
      flex: 1,
    },
    row: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 6,
    },
    value: {
      color: isDark ? Colors.white : Colors.black,
      fontFamily: 'Lato-Regular',
    },
  });

export default MyAssets;
