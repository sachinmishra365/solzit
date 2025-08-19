import React from 'react';
import {View, StyleSheet, Dimensions, FlatList} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {createShimmerPlaceholder} from 'react-native-shimmer-placeholder';
import {useSelector} from 'react-redux';
import {isDarkTheme} from '../../AppStore/Reducers/appState';
import {Colors} from '../../constants/Colors';

const ShimmerPlaceHolder = createShimmerPlaceholder(LinearGradient);
const screenWidth = Dimensions.get('window').width;

const DashboardShimmer = () => {
  const isDark = useSelector(isDarkTheme);
  const holidays = Array(3).fill({});
  const leaves = Array(3).fill({});

  return (
    <View style={[styles.container, {backgroundColor: isDark ? Colors.black : Colors.white}]}>
      {/* Birthday Card */}
      <ShimmerPlaceHolder
        style={styles.birthdayCard}
        shimmerColors={
          isDark
            ? ['#2c2c2c', '#3a3a3a', '#2c2c2c']
            : ['#f7f7f7', '#f7f7f7', '#f0f0f0']
        }
      />

      {/* Holidays */}
     <View> <FlatList
        data={holidays}
        keyExtractor={(_, index) => index.toString()}
        horizontal
        renderItem={() => (
          <ShimmerPlaceHolder
            style={styles.holidayCard}
            shimmerColors={
              isDark
                ? ['#2c2c2c', '#3a3a3a', '#2c2c2c']
                : ['#f7f7f7', '#f7f7f7', '#f0f0f0']
            }
          />
        )}
        showsHorizontalScrollIndicator={false}
      /></View>

      {/* Upcoming Birthdays */}
      <View>
        <ShimmerPlaceHolder
          style={styles.sectionTitle}
          shimmerColors={
            isDark
              ? ['#2c2c2c', '#3a3a3a', '#2c2c2c']
              : ['#f7f7f7', '#f7f7f7', '#f0f0f0']
          }
        />
        <FlatList
          data={holidays}
          keyExtractor={(_, index) => index.toString()}
          horizontal
          renderItem={() => (
            <ShimmerPlaceHolder
              style={styles.bdyCard}
              shimmerColors={
                isDark
                  ? ['#2c2c2c', '#3a3a3a', '#2c2c2c']
                  : ['#f7f7f7', '#f7f7f7', '#f0f0f0']
              }
            />
          )}
          showsHorizontalScrollIndicator={false}
        />
      </View>

      {/* Leave Status */}
      <View style={{}}>
        <ShimmerPlaceHolder
          style={styles.sectionTitle}
          shimmerColors={
            isDark
              ? ['#2c2c2c', '#3a3a3a', '#2c2c2c']
              :['#f7f7f7', '#f7f7f7', '#f0f0f0']
          }
        />
        {leaves.map((_, index) => (
          <ShimmerPlaceHolder
            key={index}
            style={styles.leaveCard}
            shimmerColors={
              isDark
                ? ['#2c2c2c', '#3a3a3a', '#2c2c2c']
                : ['#f7f7f7', '#f7f7f7', '#f0f0f0']
            }
          />
        ))}
      </View>
    </View>
  );
};

export default DashboardShimmer;


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:'white',
  },
  birthdayCard: {
    height: 100,
    width: screenWidth - 30,
    borderRadius: 12,
    marginBottom: 20,
    marginTop:10,
  },
  sectionTitle: {
    width: 150,
    height: 20,
    borderRadius: 4,
    marginVertical: 8,
  },
  bdyCard: {
    width: 160,
    height: 150,
    borderRadius: 12,
    marginRight: 12,
  },
  holidayCard: {
    width: 160,
    height:70,
    borderRadius: 12,
    marginRight: 12,

  },
  leaveCard: {
    height: 60,
    width: screenWidth - 30,
    borderRadius: 10,
    marginVertical: 8,
  },
});
