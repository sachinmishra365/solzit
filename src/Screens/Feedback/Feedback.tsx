import { View, Text, StyleSheet, FlatList, RefreshControl } from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { isDarkTheme } from '../../AppStore/Reducers/appState';
import CustomHeader from '../../Components/CustomHeader';
import { Colors } from '../../constants/Colors';
import { useGetMyFeedbacksListByEmpIdQuery } from '../../Services/services';
import Toast from 'react-native-toast-message';
import ShimmerPlaceHolder from '../Placeholder/ShimmerPlaceHolder';
import { Card, FAB, Icon } from 'react-native-paper';
import { TouchableOpacity } from 'react-native-gesture-handler';
import moment from 'moment';
import { BottomSheet, IBottomSheetRef } from '../BottomSheet/BottomSheet';
import ViewFeedback from './ViewFeedback';

const Feedback = ({ navigation }: any) => {
  const isDark = useSelector(isDarkTheme);
  const EmployeeId = useSelector((state: any) => state?.appState?.authToken);
  const connected = useSelector((state: any) => state?.appState?.connected);

  const [FeedbackData, setFeedbackData] = useState<any[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const bottomSheetRef = useRef<IBottomSheetRef>(null);
  const [selectedFeedback, setSelectedFeedback] = useState(null);

  const handleOpenBottomSheet = (feedback: any) => {
    setSelectedFeedback(feedback);
    setTimeout(() => {
      bottomSheetRef.current?.expand(); 
    }, 50);
  };
  
  
  useEffect(() => {
    if (selectedFeedback && bottomSheetRef.current) {
      bottomSheetRef.current.expand();
    }
  }, [selectedFeedback]);
  
  useEffect(() => {
    if (!bottomSheetRef.current) {
      console.log("BottomSheet ref is not assigned yet.");
    }
  }, []);

  const { data, isLoading, refetch } = useGetMyFeedbacksListByEmpIdQuery({
    accessToken: EmployeeId?.authToken?.accessToken,
  });

  useEffect(() => {
    if (data && data?.messageDetail?.message_code === 200 && data?.data) {
      const sortedData = [...data.data].sort(
        (a, b) => b.feedBackId - a.feedBackId
      );
      setFeedbackData(sortedData);
    }
  }, [data]);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
      refetch();
    }, 1000);
  };

  const renderItem = ({ item }: any) => (
    <Card
      style={{
        backgroundColor: isDark ? Colors.black : Colors.background,
        marginVertical: 7,
        borderColor: Colors.background,
        borderWidth: 0.5,
        marginHorizontal: 16,
      }}
    >
      <Card.Content>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
          }}
        >
          <Text style={[styles(isDark).title, { flex: 1, fontSize: 16 }]}>
            {item.feedBackTitle}
          </Text>

          <View style={{ minWidth: '30%', alignItems: 'flex-end', marginLeft: 7 }}>
            <Text style={[styles(isDark).title, { fontSize: 16 }]}>
              {moment(item.reportedOn, 'DD-MM-YYYY').format('D MMM, YYYY')}
            </Text>
          </View>
        </View>

        <Text style={[styles(isDark).title, { fontSize: 14, marginTop: -5 }]}>
          Status: {item.status.label}
        </Text>

        <TouchableOpacity style={styles(isDark).viewFeedback} onPress={() => handleOpenBottomSheet(item)}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              padding: 6,
              borderRadius: 3,
              backgroundColor: Colors.primary,
            }}
          >
            <Icon source="eye" size={24} color={Colors.white} />
            <Text style={[styles(isDark).addButtonText, { color: Colors.white, marginLeft: 4 }]}>
              View Feedback
            </Text>
          </View>
        </TouchableOpacity>
      </Card.Content>
    </Card>
  );

  return (
    <View style={styles(isDark).maincontainer}>
      <CustomHeader showBackIcon={true} title="Feedback" onPress={() => navigation.goBack()} />
      <View style={styles(isDark).divider} />

      {isLoading ? (
        <ShimmerPlaceHolder />
      ) : (
        <FlatList
        showsVerticalScrollIndicator={false}
          data={FeedbackData}
          renderItem={renderItem}
          keyExtractor={(item, index) => index.toString()}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        />
      )}

      <FAB
        style={styles(isDark).fab}
        color={Colors.white}
        onPress={() => navigation.navigate('AddFeedback')}
        accessibilityLabel="Add Feedback"
        icon="plus"
      />

     
      <BottomSheet ref={bottomSheetRef}>
  {selectedFeedback ? (
    <ViewFeedback feedbackData={selectedFeedback} />
  ) : (
    <Text style={{ padding: 20, textAlign: 'center' }}>No Feedback Selected</Text>
  )}
</BottomSheet>

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
    addButtonText: {
      fontSize: 14,
      fontFamily: 'Lato-Bold',
    },
    title: {
      fontFamily: 'Lato-Bold',
      marginBottom: 5,
      color: isDark ? Colors.white : Colors.black,
    },
    viewFeedback: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    fab: {
      position: 'absolute',
      right: 16,
      bottom: 16,
      backgroundColor: isDark ? Colors.gray : Colors.primary,
      elevation: 10,
    },
  });

export default Feedback;
