import { View, Text, StyleSheet, FlatList, RefreshControl, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { isDarkTheme } from '../../AppStore/Reducers/appState';
import CustomHeader from '../../Components/CustomHeader';
import { Colors } from '../../constants/Colors';
import { useGetListOfOpenPositionQuery } from '../../Services/services';
import Toast from 'react-native-toast-message';
import ShimmerPlaceHolder from '../Placeholder/ShimmerPlaceHolder';
import { Card, Icon, IconButton } from 'react-native-paper';
import EmptyData from '../../Components/EmptyData';
import LinearGradient from 'react-native-linear-gradient';

const getIconAndGradient = (position: string, isDark: boolean) => {
  const name = position?.toLowerCase() || "";

  if (name.includes("designer")) {
    return {
      icon: "palette-outline",
      gradient: isDark ? ["#FFD700", "#FFA500"] : ["#FFFACD", "#FFD700"],
    };
  }

  if (name.includes("engineer") || name.includes("developer")) {
    return {
      icon: "console",
      gradient: isDark ? ["#6cf370", "#2E7D32"] : ["#A5D6A7", "#4CAF50"],
    };
  }

  if (name.includes("manager")) {
    return {
      icon: "account-tie",
      gradient: isDark ? ["#2196F3", "#0D47A1"] : ["#BBDEFB", "#2196F3"],
    };
  }

  if (name.includes("marketing")) {
    return {
      icon: "bullhorn-outline",
      gradient: isDark ? ["#dbc29a", "#ff9a02"] : ["#FFE0B2", "#FF9800"],
    };
  }

  if (name.includes("hr") || name.includes("human resource")) {
    return {
      icon: "account-group-outline",
      gradient: isDark ? ["#9C27B0", "#4A148C"] : ["#E1BEE7", "#9C27B0"],
    };
  }

  if (name.includes("qa") || name.includes("tester")) {
    return {
      icon: "bug-outline",
      gradient: isDark ? ["#E91E63", "#880E4F"] : ["#F8BBD0", "#E91E63"],
    };
  }

  if (name.includes("data")) {
    return {
      icon: "database-outline",
      gradient: isDark ? ["#00BCD4", "#006064"] : ["#B2EBF2", "#00BCD4"],
    };
  }

  if (name.includes("writer")) {
    return {
      icon: "pencil-outline",
      gradient: isDark ? ["#00BCD4", "#006064"] : ["#B2EBF2", "#00BCD4"],
    };
  }

  if (name.includes("finance")) {
    return {
      icon: "cash-multiple",
      gradient: isDark ? ["#8BC34A", "#33691E"] : ["#DCEDC8", "#8BC34A"],
    };
  }

  if (name.includes("sales")) {
    return {
      icon: "chart-line",
      gradient: isDark ? ["#FF5722", "#BF360C"] : ["#FFCCBC", "#FF5722"],
    };
  }

  return {
    icon: "briefcase-outline",
    gradient: isDark ? ["#607D8B", "#263238"] : ["#CFD8DC", "#607D8B"],
  };
};

const OpenPositions = ({ navigation }: any) => {
  const isDark = useSelector(isDarkTheme);
  const EmployeeId = useSelector((state: any) => state?.appState?.authToken);
  const connected = useSelector((state: any) => state?.appState?.connected);

  const [OpenPositionData, setOpenPositionData] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const { data, error, isLoading, refetch } = useGetListOfOpenPositionQuery({
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
    } catch (err) { }
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


  const renderItem = ({item}: any) => {

  const { icon, gradient } = getIconAndGradient(item.hiringPosition, isDark);

    return (
      <Card
        style={styles(isDark).card}
        onPress={() => navigation.navigate('PositionDetail', {position: item})}>
        <Card.Content>
          <View style={styles(isDark).rowAligned}>

            <LinearGradient
              start={{x: 1, y: 0}} 
              end={{x: 0.5, y: 1}}
               colors={gradient}
              style={styles(isDark).iconBox}>
              <IconButton icon={icon} size={30} iconColor="#fff" style={styles(isDark).iconStyle}/>
            </LinearGradient>

     
            <View style={{flex: 1, marginLeft: 12, marginTop:-5}}>
              <Text style={[styles(isDark).title,]}>
                {item.hiringPosition}
              </Text>
              <Text style={styles(isDark, item.urgency).urgencyText}>
                {item.urgency}{' '}
              </Text>
               <View style={[styles(isDark).rowContainer]}>
                <Text style={[styles(isDark).value, {textAlign: 'left'}]}>
                  Experience: {item.experienceRange}
                </Text>
                <Text style={[styles(isDark).value, {textAlign: 'left'}]}>
                  Positions: {item.numberOfPosition}
                </Text>
              </View>
            </View>
          </View>

          <View style={[styles(isDark).rowContainer, {marginTop: 5}]}>
            <View style={styles(isDark).iconTextRow}>
              <Icon source="home-outline" size={18} color={Colors.primary} />
              <Text
                style={[styles(isDark).value, {fontFamily: 'Lato-Semibold'}]}>
                {item.isWorkFromHomeAvailable ? 'Work From Home' : 'Office'}
              </Text>
            </View>

            <View style={styles(isDark).iconTextRow}>
              <Icon
                source="map-marker-outline"
                size={18}
                color={Colors.primary}
              />
              <Text
                style={[styles(isDark).value, {fontFamily: 'Lato-Semibold'}]}>
                {item.location || 'N/A'}
              </Text>
            </View>
          </View>
        </Card.Content>
      </Card>
    );};


  return (
    <View style={styles(isDark).maincontainer}>
      <CustomHeader
        showBackIcon={true}
        title="Open Positions"
        onPress={() => navigation.goBack()}
      />
      {isLoading ? (
        <ShimmerPlaceHolder />
      ) : (
        (data && data?.data?.length > 0) ? (
          <FlatList
            showsVerticalScrollIndicator={false}
            data={OpenPositionData}
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
        ) :
          <EmptyData />
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
    card: {
      backgroundColor: isDark ? Colors.black : Colors.background,
      marginVertical: 5,
      borderColor: Colors.white,
      borderWidth: 0.5,
      marginHorizontal: 16,
      paddingVertical: 5,
    },
    title: {
      fontSize: 18,
      fontFamily: 'Lato-Bold',
      color: isDark ? Colors.white : Colors.black,
      flexWrap:'wrap',
      marginBottom: 4,
    },
    rowContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      flexWrap: 'wrap',
    },

    value: {
      fontSize: 14,
      color: isDark ? Colors.white : Colors.black,
      alignSelf: 'flex-start',
      fontFamily: 'Lato-Regular',
    },
    
    urgencyText: {
      fontSize: 16,
      fontFamily: 'Lato-Bold',
      marginBottom:4,
      alignSelf: 'flex-start',
      color:
        urgency === 'Urgent'
          ? Colors.accent
          : urgency === 'High'
          ? '#916918'
          : 'green',
      //     backgroundColor:isDark ? (urgency === 'Urgent' ? 'rgba(255, 0, 0, 0.2)' : urgency === 'High' ? 'rgba(255, 215, 0, 0.2)' : 'rgba(0, 128, 0, 0.3)')
      //     : (urgency === 'Urgent' ? 'rgba(255, 0, 0, 0.1)' : urgency === 'High' ? 'rgba(255, 215, 0, 0.1)' : 'rgba(0, 128, 0, 0.1)'),
      // paddingHorizontal: 8,
    },
    iconBox: {
      width: 70,
      height: 70,
      borderRadius: 8,
      justifyContent: 'center',
      alignItems: 'center',
    },
    rowAligned: {
      flexDirection: 'row',
      alignItems: 'flex-start',marginBottom: 10,   
    },
    iconTextRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
    },
    iconStyle:{
      backgroundColor:isDark ? 'rgba(2, 2, 2, 0.1)' : 'rgba(255, 255, 255,0.1)',
      padding:7,
      borderRadius:8,
      alignItems:'center',
      justifyContent:'center',
    }
  });

export default OpenPositions;
