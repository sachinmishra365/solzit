import {View, Text, StyleSheet, FlatList, RefreshControl} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useSelector} from 'react-redux';
import {isDarkTheme} from '../../AppStore/Reducers/appState';
import CustomHeader from '../../Components/CustomHeader';
import {Colors} from '../../constants/Colors';
import {useEmployeeSkillsQuery} from '../../Services/services';
import {Card, ProgressBar} from 'react-native-paper';
import Toast from 'react-native-toast-message';
import ShimmerPlaceHolder from '../Placeholder/ShimmerPlaceHolder';

const MySkills = ({navigation}: any) => {
  const isDark = useSelector(isDarkTheme);
  const EmployeeId = useSelector((state: any) => state?.appState?.authToken);
  const connected = useSelector((state: any) => state?.appState?.connected);

  const [skillData, setSkillData] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const {data, isLoading, error, refetch} = useEmployeeSkillsQuery({
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
        setSkillData(data.data.skills);
      }
    } catch (error) {}
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

  const renderItem = ({item}: any) => {
    const skillText =
      item.levelofskill === 'Beginner'
        ? 0.33
        : item.levelofskill === 'Intermediate'
        ? 0.66
        : item.levelofskill === 'Expert'
        ? 1
        : 0;
    const skillTextColor =
      item.levelofskill === 'Beginner'
        ? Colors.secondary
        : item.levelofskill === 'Intermediate'
        ? '#916918'
        : item.levelofskill === 'Expert'
        ? 'green'
        : Colors.gray;

    return (
      <Card
        style={{
          backgroundColor: isDark ? Colors.black : Colors.background,
          marginVertical: 10,
          borderColor: Colors.background,
          borderWidth: 0.5,
          marginHorizontal: 16,
        }}>
        <Card.Content>
          <View>
            <Text style={styles(isDark).skillName}>{item.skillName}</Text>
            <View style={styles(isDark).levelContainer}>
              <Text style={styles(isDark).skillDetail}>Level - </Text>
              <Text
                style={[
                  styles(isDark).skillDetail,
                  {color: skillTextColor, fontFamily: 'Lato-Bold'},
                ]}>
                {' '}
                {item.levelofskill}
              </Text>
            </View>
            <ProgressBar
              progress={skillText}
              color={Colors.primary}
              style={styles(isDark).progressBar}
            />

            <View style={styles(isDark).certificationContainer}>
              <Text style={styles(isDark).skillDetail}>Certification :</Text>
              <Text style={styles(isDark).skillDetail}>
                {' '}
                {item.hasCertification?.label || 'No'}
              </Text>
            </View>

            {item.hasCertification?.label === 'Yes' && (
              <View style={styles(isDark).rowContainer}>
                <Text style={{fontFamily: 'Lato-Bold', fontSize: 16}}>
                {item.typeOfCertification?.label}{' '}:{' '}
                </Text>
                  <Text style={{fontFamily: 'Lato-Bold', fontSize: 16}}>
                    {item.certificationName} 
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
      style={styles(isDark).maincontainer}
      onLayout={() => {
        setRefreshing(true);
        setTimeout(() => {
          setRefreshing(false);
        }, 1000);
      }}>
      <CustomHeader
        showBackIcon={true}
        title="My Skills"
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
            data={skillData}
            renderItem={item => renderItem(item)}
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
    progressBar: {
      height:8,
      borderRadius: 2,
      marginVertical: 5,
      backgroundColor: isDark ? Colors.gray : Colors.white,
    },
    levelContainer: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
      marginTop: -10,
    },
    certificationContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: 5,
    },
    rowContainer: {
      flexDirection: 'row',
     
      marginTop: 5,
    },
  });

export default MySkills;
