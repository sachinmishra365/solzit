import React from 'react';
import {StyleSheet, View, FlatList} from 'react-native';
import {Card, Text} from 'react-native-paper';
import LinearGradient from 'react-native-linear-gradient';
import {createShimmerPlaceholder} from 'react-native-shimmer-placeholder';

const ShimmerPlaceHolder = createShimmerPlaceholder(LinearGradient);

const PlaceholderCard = () => {
  return (
    <Card style={styles.containerInner}>
      <View style={{paddingHorizontal: 16, paddingVertical: 16}}>
        <ShimmerPlaceHolder style={{width: '90%'}} />
        <ShimmerPlaceHolder style={{width: '50%', marginTop: 16}} />
      </View>
      <View
        style={{
          paddingHorizontal: 8,
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}>
        <View>
          {/* <Text style={{padding: 8}}>
            <ShimmerPlaceHolder style={{width: 80}} />
          </Text> */}
          <Text style={{padding: 8}}>
            <ShimmerPlaceHolder style={{width: 70}} />
          </Text>
          <Text style={{padding: 8}}>
            <ShimmerPlaceHolder style={{width: 50}} />
          </Text>
        </View>
        <View>
          {/* <Text style={{padding: 8}}>
            <ShimmerPlaceHolder style={{width: 80}} />
          </Text> */}
          <Text style={{padding: 8}}>
            <ShimmerPlaceHolder style={{width: 70}} />
          </Text>
          <Text style={{padding: 8}}>
            <ShimmerPlaceHolder style={{width: 50}} />
          </Text>
        </View>
      </View>
    </Card>
  );
};

const PlaceholderList = () => {
  const data = Array(5).fill({}); // Create a list of 5 empty items

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
