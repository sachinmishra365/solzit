import {View, Text, StyleSheet, ScrollView} from 'react-native';
import React, { useState } from 'react';
import {useSelector} from 'react-redux';
import {isDarkTheme} from '../../AppStore/Reducers/appState';
import CustomHeader from '../../Components/CustomHeader';
import {Colors} from '../../constants/Colors';
import {Card,FAB} from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';

const PositionDetail = ({route}: any) => {
  const isDark = useSelector(isDarkTheme);
  const navigation: any = useNavigation();
  const [state, setState] = useState({ open: false });

const onStateChange = ({ open }: any) => setState({ open });
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
      <FAB.Group
        open={state.open}
        visible
        icon={state.open ? 'close' : 'plus'}
        color={isDark ? Colors.white : Colors.white}
        style={{elevation: 5}}
        fabStyle={{
          backgroundColor: isDark ? Colors.gray : Colors.primary,
          elevation: 10,
        }}
        backdropColor={isDark ? Colors.black : Colors.white}
        accessibilityLabel="Fab Button Screen"
        onStateChange={({open}) => setState({open})} 
        actions={[
           {
                    icon: 'account-plus',
                    color: isDark ? Colors.white : Colors.white,
                    labelStyle: {
                      color: isDark ? Colors.white : Colors.black,
                      fontFamily: 'Lato-Bold',
                      marginVertical:5,
                      fontSize: 18,
                    },
                    label: 'Add Reference',
                    onPress: () =>
                      navigation.navigate('AddReference', {
                        reference: position.hiringId,
                        hiringPosition: position.hiringPosition,
                      }),
                    style: {backgroundColor: isDark ? Colors.gray : Colors.primary},
                    accessibilityLabel: 'Add Reference',
                    size:'medium'
                  },
        ]}
      />
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
    fab: {
      position: 'absolute',
      right: 16,
      bottom: 16,
      backgroundColor: isDark ? Colors.gray : Colors.primary,
      elevation: 10,
    },
  });

export default PositionDetail;
