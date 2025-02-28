import {View, Text, StyleSheet, ScrollView} from 'react-native';
import React from 'react';
import {useSelector} from 'react-redux';
import {isDarkTheme} from '../../AppStore/Reducers/appState';
import CustomHeader from '../../Components/CustomHeader';
import {Colors} from '../../constants/Colors';
import {Card} from 'react-native-paper';

const PositionDetail = ({route, navigation}: any) => {
  const isDark = useSelector(isDarkTheme);

  const position = route.params.position;

  if (!position) {
    return (
      <View style={styles(isDark).maincontainer}>
        <Text style={styles(isDark).hiringPosition}>
          No Position Details Available
        </Text>
      </View>
    );
  }

  return (
    <View style={styles(isDark).maincontainer}>
      <CustomHeader
        showBackIcon={true}
        title="Position Detail"
        onPress={() => navigation.goBack()}
      />
      <ScrollView>
        <Card
          style={{
            backgroundColor: isDark ? Colors.black : Colors.background,
            marginVertical: 10,
            borderColor: Colors.background,
            borderWidth: 0.5,
            marginHorizontal: 16,
          }}>
          <Card.Content>
            <Text style={[styles(isDark).hiringPosition, {fontSize: 18}]}>
              {position.hiringPosition}
            </Text>

            <View style={styles(isDark).row}>
              <Text style={[styles(isDark).value, {fontFamily: 'Lato-Bold'}]}>
                Experience Range:{' '}
              </Text>
              <Text style={styles(isDark).value}>
                {position.experienceRange} years
              </Text>
            </View>

            <View style={styles(isDark).row}>
              <Text style={[styles(isDark).value, {fontFamily: 'Lato-Bold'}]}>
                Is Work From Home?{' '}
              </Text>
              <Text style={styles(isDark).value}>
                {position.isWorkFromHomeAvailable}
              </Text>
            </View>

            <Text style={[styles(isDark).hiringPosition, {fontSize: 16}]}>
              Skills Required:
            </Text>
            <Text style={styles(isDark).value}>{position.skillsRequired}</Text>

            <Text style={[styles(isDark).hiringPosition, {fontSize: 16}]}>
              Job Description:
            </Text>
            <Text style={styles(isDark).value}>{position.jobDescription}</Text>
          </Card.Content>
        </Card>
      </ScrollView>
    </View>
  );
};

const styles = (isDark: boolean) =>
  StyleSheet.create({
    maincontainer: {
      flex: 1,
      backgroundColor: isDark ? Colors.black : Colors.white,
    },
    hiringPosition: {
      fontSize: 18,
      fontFamily: 'Lato-Bold',
      color: Colors.primary,
      marginBottom: 8,
    },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 5,
    },
    value: {
      fontSize: 14,
      fontFamily: 'Lato-Regular',
      color: isDark ? Colors.white : Colors.black,
    },
  });

export default PositionDetail;
