import { View, Text, FlatList, RefreshControl, StyleSheet } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { isDarkTheme } from '../../../AppStore/Reducers/appState';
import { useGetemployeeProjectAllocationQuery } from '../../../Services/workloglevel';
import { Card } from 'react-native-paper';
import { Colors } from '../../../constants/Colors';
import Toast from 'react-native-toast-message';
import CustomHeader from '../../../Components/CustomHeader';
import ShimmerPlaceHolder from '../../Placeholder/ShimmerPlaceHolder';
import EmptyData from '../../../Components/EmptyData';
import ToastMessage from '../../../Components/ToastMessage';

const ProjectAllocation = ({ navigation }: any) => {
  const isDark = useSelector(isDarkTheme);
  const accessToken = useSelector((state: any) => state?.appState?.authToken);
  const connected = useSelector((state: any) => state?.appState?.connected);

  const { data, isLoading, refetch } = useGetemployeeProjectAllocationQuery({ accessToken: accessToken?.authToken?.accessToken, });

  const [myPlanData, setMyPlanData] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const totalAllocation = myPlanData
    .filter((item: any) => item?.status?.value === 1)
    .reduce((sum, item: any) => {
      const percent = typeof item.allocationPercentage === 'string'
        ? parseFloat(item.allocationPercentage.replace('%', ''))
        : Number(item.allocationPercentage);
      return sum + (isNaN(percent) ? 0 : percent);
    }, 0);


  const handleMyPlans = async () => {
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
        setMyPlanData(data.data);
      }
    } catch (error) { }
  };

  useEffect(() => {
    handleMyPlans();

  }, [data,]);


  const onRefresh = () => {
    setRefreshing(true);
    refetch();
    handleMyPlans().finally(() => setRefreshing(false));
  };

  const renderItem = ({ item }: any) => {

    return (
      <>
        {item?.status?.value == 1 && (
          <Card style={styles(isDark).cardcontainer}>
            <Card.Content>

              <Text style={styles(isDark).projectName}>{item.project?.name}</Text>

              <View style={styles(isDark).row}>
                <Text style={[styles(isDark).txt, { fontFamily: 'Lato-Semibold' }]}>{'Allocation'}</Text>
                <Text style={[styles(isDark).txt, { color: 'green', fontFamily: 'Lato-Bold' }]}>{item.allocationPercentage}</Text>
              </View>

              <View style={styles(isDark).row}>
                <Text style={[styles(isDark).txt, { fontFamily: 'Lato-Semibold' }]}>{'Role'}</Text>
                <Text style={styles(isDark).txt}>{item.role?.label}</Text>
              </View>

              <View style={styles(isDark).row}>
                <Text style={[styles(isDark).txt, { fontFamily: 'Lato-Semibold' }]}>{'Project Manager'}</Text>
                <Text style={styles(isDark).txt}>{item.projectManagerName || 'N/A'}</Text>
              </View>

            </Card.Content>
          </Card>
        )}
      </>
    );
  };

  return (
    <View style={styles(isDark).mainContainer}>
      <CustomHeader
        showBackIcon={true}
        title="Project Allocation"
        isDark={isDark}
        onPress={() => navigation.goBack()}
        showallocation={true}
        total={totalAllocation}
        color={totalAllocation < 100 ? Colors.error : 'green'}
      />
      {isLoading ? (
        <ShimmerPlaceHolder />
      ) : data?.data.length > 0 ?
        (
          <FlatList
            data={myPlanData}
            showsVerticalScrollIndicator={false}
            keyExtractor={(item, index) => index.toString()}
            renderItem={renderItem}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            ListFooterComponent={<View style={{ height: 100 }} />}
          />
        ) : (
          <EmptyData />
        )}

    </View>
  );
};
const styles = (isDark: boolean) =>
  StyleSheet.create({
    mainContainer: {
      flex: 1,
      backgroundColor: isDark ? Colors.black : Colors.background,
    },
    cardcontainer: {
      backgroundColor: isDark ? Colors.black : Colors.background,
      marginVertical: 7,
      borderColor: Colors.background,
      borderWidth: 0.5,
      marginHorizontal: 16,
    },
    projectName: {
      fontSize: 16,
      fontFamily: 'Lato-Bold',
      marginBottom: 10,
      color: isDark ? Colors.white : Colors.black,
      flexWrap: 'wrap',
    },
    row: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      flexWrap: 'wrap',
    },
    txt: {
      fontSize: 14,
      fontFamily: 'Lato-Regular',
      color: isDark ? Colors.white : Colors.black,
      lineHeight: 25,
    },

  });

export default ProjectAllocation