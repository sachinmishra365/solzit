import { View, Text, StyleSheet, FlatList, RefreshControl } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { isDarkTheme } from '../../AppStore/Reducers/appState';
import CustomHeader from '../../Components/CustomHeader';
import { Colors } from '../../constants/Colors';
import { useEmployeeSkillsQuery } from '../../Services/services';
import { Card, } from 'react-native-paper';
import Toast from 'react-native-toast-message';
import ShimmerPlaceHolder from '../Placeholder/ShimmerPlaceHolder';
import { Bar as ProgressBar } from 'react-native-progress';
import EmptyData from '../../Components/EmptyData';

const MySkills = ({ navigation }: any) => {
  const isDark = useSelector(isDarkTheme);
  const EmployeeId = useSelector((state: any) => state?.appState?.authToken);
  const connected = useSelector((state: any) => state?.appState?.connected);

  const [skillData, setSkillData] = useState([]);

  const [refreshing, setRefreshing] = useState(false);

  const { data, isLoading, error, refetch } = useEmployeeSkillsQuery({
    accessToken: EmployeeId?.authToken?.accessToken,
  });

  const handleSkills = async () => {
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
      if (data?.data?.skills && data?.messageDetail?.message_code === 200) {
        setSkillData(data?.data?.skills);
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    handleSkills();
  }, [data]);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
      refetch();
    }, 1000);
  }, [refetch]);

  const renderItem = ({ item }: any) => {    
    const skillText =
      item.levelofskill?.label === 'Beginner'
        ? 0.33
        : item.levelofskill?.label === 'Intermediate'
          ? 0.66
          : item.levelofskill?.label === 'Expert'
            ? 1
            : 0;
    const skillTextColor =
      item.levelofskill?.label === 'Beginner'
        ? Colors.secondary
        : item.levelofskill?.label === 'Intermediate'
          ? '#916918'
          : item.levelofskill?.label === 'Expert'
            ? 'green'
            : Colors.gray;

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
          <View>
            <Text style={styles(isDark).skillName}>{item.skillName?.name}</Text>
            <View style={styles(isDark).levelContainer}>
              <Text style={styles(isDark).skillDetail}>Level-{''}</Text>
              <Text
                style={[
                  styles(isDark).skillDetail,
                  { color: skillTextColor, fontFamily: 'Lato-Bold' },
                ]}>
                {' '}
                {item?.levelofskill?.label}
              </Text>
            </View>
            <ProgressBar
              progress={skillText}
              color={Colors.primary}
              animated={true}
              borderColor={
                isDark ? Colors.gray : Colors.white
              }
              style={{ marginTop: 10, backgroundColor: isDark ? Colors.gray : Colors.white }}
              // style={styles(isDark).progressBar}
              width={null}
            />

            <View style={[styles(isDark).rowContainer, { alignItems: 'center' }]}>
              <Text style={styles(isDark).skillDetail}>Certification :</Text>
              <Text style={styles(isDark).skillDetail}>
                {' '}
                {item?.hasCertification?.label || 'No'}
              </Text>
            </View>

            {item?.hasCertification?.label === 'Yes' && (
              <View style={styles(isDark).rowContainer}>
                <Text style={{ fontFamily: 'Lato-Bold', fontSize: 16, color: isDark ? Colors.white : Colors.black }}>
                  {item?.typeOfCertification?.label} {' : '}
                </Text>
                <Text style={{ fontFamily: 'Lato-Bold', fontSize: 16, color: isDark ? Colors.white : Colors.black }}>
                  {item?.certificationName}
                </Text>
              </View>
            )}
          </View>
        </Card.Content>
      </Card>
    );
  };

  return (
    <View
      style={styles(isDark).maincontainer}>
      <CustomHeader
        showBackIcon={true}
        title="My Skills"
        onPress={() => navigation.goBack()}
      />
      <View style={styles(isDark).divider} />
      {isLoading ? (
        <ShimmerPlaceHolder />
      ) : data?.data === null ? (
        <EmptyData/>
      ) : (
        <FlatList
          showsVerticalScrollIndicator={false}
          data={skillData}
          renderItem={item => renderItem(item)}
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
    skillName: {
      fontSize: 16,
      fontFamily: 'Lato-Bold',
      color: isDark ? Colors.white : Colors.black,
    },
    skillDetail: {
      fontSize: 14,
      fontFamily: 'Lato-Regular',
      color: isDark ? Colors.white : Colors.black,
    },
    levelContainer: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
      marginTop: -10,
    },
    rowContainer: {
      flexDirection: 'row',
      marginTop: 5,
      flexWrap: 'wrap'
    },
  });

export default MySkills;
