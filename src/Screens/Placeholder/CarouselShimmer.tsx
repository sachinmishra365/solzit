import React from 'react';
import { View, StyleSheet, Dimensions, FlatList } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { createShimmerPlaceholder } from 'react-native-shimmer-placeholder';
import { isDarkTheme } from '../../AppStore/Reducers/appState';
import { useSelector } from 'react-redux';
import { Colors } from '../../constants/Colors';

const ShimmerPlaceHolder = createShimmerPlaceholder(LinearGradient);
const screenWidth = Dimensions.get('window').width;

const CarouselShimmer = () => {
    const isDark = useSelector(isDarkTheme);

  return (
     <View style={[styles.container, {backgroundColor: isDark ? Colors.black : Colors.white}]}>
      {/* Top Carousel */}
      <View style={styles.carouselRow}>
        <ShimmerPlaceHolder style={styles.carouselCard}
        shimmerColors={
            isDark
              ? ['#2c2c2c', '#3a3a3a', '#2c2c2c']
              : ['#f7f7f7', '#f7f7f7', '#f0f0f0']
          } />
      </View>
    </View>
  );
};

export default CarouselShimmer;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  carouselRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  carouselCard: {
    marginTop:10,
    width: screenWidth - 30,
    height: 160,
    borderRadius: 12,
  },
 
});
