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

const ProjectAllocation = ({navigation}:any) => {
    const isDark = useSelector(isDarkTheme);
    const accessToken = useSelector((state: any) => state?.appState?.authToken);
    const connected = useSelector((state: any) => state?.appState?.connected);
  
    
    const {data, isLoading, error} = useGetemployeeProjectAllocationQuery({
      accessToken: accessToken?.authToken?.accessToken,
    });
    const [myPlanData, setMyPlanData] = useState([]);
    const [refreshing, setRefreshing] = useState(false);
  
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
      } catch (error) {}
    };
  
    useEffect(() => {
      handleMyPlans();
    }, [data]);
  
    const onRefresh = () => {
      setRefreshing(true);
      handleMyPlans().finally(() => setRefreshing(false));
    };
  
    const renderItem = ({ item }: any) => {
        return (
          <Card
            style={{
              backgroundColor: isDark ? Colors.black : Colors.background,
              marginVertical: 7,
              borderColor: Colors.background,
              borderWidth: 0.5,
              marginHorizontal: 16,
            }}>
            <Card.Content>

              <Text style={styles(isDark).projectName}>
                {item.project?.name || 'N/A'}
              </Text>

              <View style={styles(isDark).row}>
                <Text style={styles(isDark).label}>Allocation:</Text>
                <Text style={styles(isDark).value}>
                  {item.allocationPercentage}
                </Text>
              </View>

              <View style={styles(isDark).row}>
                <Text style={styles(isDark).label}>Status:</Text>
                <Text style={[styles(isDark).value, {color: 'green',fontFamily: 'Lato-Bold'}]}>
                  {item.status?.label}
                </Text>
              </View>

              <View style={styles(isDark).row}>
                <Text style={styles(isDark).label}>Role:</Text>
                <Text style={styles(isDark).value}>{item.role?.label}</Text>
              </View>

              <View style={styles(isDark).row}>
                <Text style={styles(isDark).label}>Project Manager:</Text>
                <Text style={styles(isDark).value}>
                  {item.projectManagerName || 'N/A'}
                </Text>
              </View>
            </Card.Content>
          </Card>
        );
      };
      
    return (
      <View style={styles(isDark).mainContainer}>
        <CustomHeader
          showBackIcon={true}
          title="Project Allocation"
          isDark={isDark}
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
            data={myPlanData}
            showsVerticalScrollIndicator={false}
            keyExtractor={(item, index) => index.toString()}
            renderItem={renderItem}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            ListFooterComponent={<View style={{height: 100}} />}
          />
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
      divider: {
        height: 1,
        backgroundColor: isDark ? Colors.medium_gray : 'transparent',
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
        marginBottom: 6,
        flexWrap: 'wrap',
      },
      label: {
        fontFamily: 'Lato-Bold',
        fontSize: 14,
        color: isDark ? Colors.white : Colors.black,
      },
      value: {
        fontSize: 14,
        fontFamily: 'Lato-Regular',
        color: isDark ? Colors.white : Colors.black,
      },
      
    });
  
export default ProjectAllocation