import React from 'react';
import {StyleSheet, View, FlatList} from 'react-native';
import {Card, Text} from 'react-native-paper';
import LinearGradient from 'react-native-linear-gradient';
import {createShimmerPlaceholder} from 'react-native-shimmer-placeholder';

const ImageShimmerPlaceHolder = createShimmerPlaceholder(LinearGradient);

const PlaceholderCard = () => {
  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        padding: 10,
        alignItems: 'center',
        elevation: 15,
      }}>
      <View>
        <Text style={{padding: 8}}>
          <ImageShimmerPlaceHolder
            style={{width: 60, height: 60, borderRadius: 35}}
          />
        </Text>
      </View>

      <View
        style={{
          padding: 8,
        }}>
        <View>
          <Text style={{padding: 8}}>
            <ImageShimmerPlaceHolder style={{width: 230}} />
          </Text>
          <Text style={{padding: 8}}>
            <ImageShimmerPlaceHolder style={{width: 150}} />
          </Text>
        </View>
      </View>
    </View>
  );
};

const PlaceholderList = () => {
  const data = Array(5).fill({}); 

  return (
    <FlatList
      data={data}
      keyExtractor={(item, index) => index.toString()}
      renderItem={() => <PlaceholderCard />}
      contentContainerStyle={{paddingBottom: 16}}
    />
  );
};

export default PlaceholderList;

const styles = StyleSheet.create({
  containerInner: {
    margin: 16,
    backgroundColor: 'white',
  },
});
