import React from 'react';
import { StyleSheet, View, FlatList } from 'react-native';
import { Card, Text } from 'react-native-paper';
import LinearGradient from 'react-native-linear-gradient';
import { createShimmerPlaceholder } from 'react-native-shimmer-placeholder';
import { useSelector } from 'react-redux';
import { isDarkTheme } from '../../AppStore/Reducers/appState';
import { Colors } from '../../constants/Colors';

const ShimmerPlaceHolder = createShimmerPlaceholder(LinearGradient);

export const PlaceholderCard = ( ) => {
    const isDark = useSelector(isDarkTheme);
  return (
    <Card style={[styles(isDark).container]}>
      <View style={{ paddingHorizontal: 16, paddingVertical: 16 }}>
        <ShimmerPlaceHolder style={{ width: '90%' }} shimmerColors={
            isDark
              ? ['#2c2c2c', '#3a3a3a', '#2c2c2c']
              : ['#f7f7f7', '#f7f7f7', '#f0f0f0']
          }  />
        <ShimmerPlaceHolder style={{ width: '50%', marginTop: 16 }} shimmerColors={
            isDark
              ? ['#2c2c2c', '#3a3a3a', '#2c2c2c']
              : ['#f7f7f7', '#f7f7f7', '#f0f0f0']
          }  />
      </View>
      <View
        style={{
          paddingHorizontal: 8,
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}>
        <View>
          <Text style={{ padding: 8 }}>
            <ShimmerPlaceHolder style={{ width: 70 }} 
            shimmerColors={
            isDark
              ? ['#2c2c2c', '#3a3a3a', '#2c2c2c']
              : ['#f7f7f7', '#f7f7f7', '#f0f0f0']
          }  />
          </Text>
          <Text style={{ padding: 8 }}>
            <ShimmerPlaceHolder style={{ width: 50 }}
            shimmerColors={
            isDark
              ? ['#2c2c2c', '#3a3a3a', '#2c2c2c']
              : ['#f7f7f7', '#f7f7f7', '#f0f0f0']
          }  />
          </Text>
        </View>
        <View>
          <Text style={{ padding: 8 }}>
            <ShimmerPlaceHolder style={{ width: 70 }} 
            shimmerColors={
            isDark
              ? ['#2c2c2c', '#3a3a3a', '#2c2c2c']
              : ['#f7f7f7', '#f7f7f7', '#f0f0f0']
          } />
          </Text>
          <Text style={{ padding: 8 }}>
            <ShimmerPlaceHolder style={{ width: 50 }}
            shimmerColors={
            isDark
              ? ['#2c2c2c', '#3a3a3a', '#2c2c2c']
              : ['#f7f7f7', '#f7f7f7', '#f0f0f0']
          }  />
          </Text>
        </View>
      </View>
    </Card>
  );
};

const PlaceholderList = () => {
  const data = Array(5).fill({});

  return (
    <FlatList
      data={data}
      keyExtractor={(item, index) => index.toString()}
      renderItem={() => <PlaceholderCard />}
      contentContainerStyle={{ paddingBottom: 16 }}
      showsVerticalScrollIndicator={false}
    />
  );
};

export default PlaceholderList;

const styles = (isDark:any)=>
StyleSheet.create({
  container: {
    flex:1,
    margin: 16,
    backgroundColor: isDark ? Colors.gray : Colors.background,
    marginVertical:7,
  },
});
