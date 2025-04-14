import {View, Text, StyleSheet, ScrollView,} from 'react-native';
import React, {useState} from 'react';
import CustomHeader from '../../../Components/CustomHeader';
import {useSelector} from 'react-redux';
import {isDarkTheme} from '../../../AppStore/Reducers/appState';
import {Colors} from '../../../constants/Colors';
import {Card, Icon, List, TextInput} from 'react-native-paper';
import CustomTextInput from '../../../Components/CustomTextInput';


const AddToMyPlan = ({navigation, route}: any) => {
  const isDark = useSelector(isDarkTheme);
  const {selectedItems = []} = route.params || {};
  const [selectedWorkStatus, setSelectedWorkStatus] = useState(
    selectedItems?.workStatus?.label ?? '',
  );
  const [expanded, setExpanded] = useState(false);
  const [estimatedEffort, setEstimatedEffort] = useState('');

  const WORK_STATUS_OPTIONS = [
    {
      value: 674180000,
      label: 'Will continue',
    },
    {
      value: 674180001,
      label: 'Will be completed',
    },
  ];
  return (
    <View style={styles(isDark).mainContainer}>
      <CustomHeader
        showBackIcon={true}
        title="Add To My Plan"
        isDark={isDark}
        onPress={() => navigation.goBack()}
      />
      <View style={styles(isDark).divider} />

      <ScrollView style={{}}>
        {selectedItems.length === 0 ? (
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              marginHorizontal: 16,
              marginVertical: 10,
            }}>
            <Text
              style={{
                color: isDark ? Colors.white : Colors.black,
                alignSelf: 'center',
                fontFamily: 'Lato-Bold',
              }}>
              No items selected Please select atleast one item to add to my plan
            </Text>
          </View>
        ) : (
          selectedItems.map((item: any, index: number) => (
            <Card key={item.id} style={styles(isDark).card}>
              <Card.Content>
                <Text style={[styles(isDark).label, {fontSize: 16}]}>
                  {item?.project?.name ?? 'No Project Name'}
                </Text>
                <View style={styles(isDark).row}>
                  <Text style={[styles(isDark).label, {flexShrink: 1}]}>
                    {item?.itemNumber}
                    {' : '}
                    {item?.title}
                  </Text>
                </View>

                <View style={[styles(isDark).row, {}]}>
                  <Text style={[styles(isDark).value, {fontSize: 16}]}>
                    Estimated Effort{' : '}
                    <Text style={[styles(isDark).value, {fontSize: 16}]}>
                      {item?.toDoSubViewsDtos?.implementationEffort}
                    </Text>
                  </Text>
                  <Text style={[styles(isDark).label, {fontSize: 16}]}>
                    {item?.workStatus?.label}
                  </Text>
                </View>

                <View style={{marginTop: 10}}>
                  <TextInput
                    label="Estimated Effort"
                    value={estimatedEffort}
                    mode="outlined"
                    theme={{
                      colors: {
                        primary: Colors.primary,
                        background: isDark ? Colors.gray : Colors.white,
                      },
                    }}
                    keyboardType="numeric"
                    style={styles(isDark).input}
                    onChangeText={text => {
                      const num = parseFloat(text);
                      setEstimatedEffort(
                        !isNaN(num) && num >= 0.25 ? text : '',
                      );
                    }}
                  />
                  {estimatedEffort !== '' &&
                    parseFloat(estimatedEffort) < 0.25 && (
                      <Text style={{color: 'red', marginTop: 4}}>
                        Must be 0.25 or greater
                      </Text>
                    )}
                </View>

                <View style={{marginTop: 10}}>
                  <List.Accordion
                    title={selectedWorkStatus || 'Commited EOD Status'}
                    expanded={expanded}
                    onPress={() => setExpanded(!expanded)}
                    style={{
                      backgroundColor: isDark ? Colors.gray : Colors.background,
                      borderWidth: 0.5,
                      borderColor: isDark
                        ? Colors.medium_gray
                        : Colors.medium_gray,
                      borderRadius: 1,
                      height: 57,
                    }}
                    right={props => (
                      <List.Icon
                        {...props}
                        icon="chevron-down"
                        color={isDark ? Colors.white : Colors.black}
                      />
                    )}
                    titleStyle={{
                      color: isDark ? Colors.white : Colors.black,
                      fontFamily: 'Lato-Regular',
                      fontSize: 14,
                    }}>
                    {WORK_STATUS_OPTIONS.map(option => (
                      <List.Item
                        key={option.value}
                        title={option.label}
                        onPress={() => {
                          setSelectedWorkStatus(option.label);
                          setExpanded(false);
                        }}
                        right={() =>
                          selectedWorkStatus === option.label ? (
                            <Icon
                              source="check"
                              size={20}
                              color={isDark ? Colors.primary : Colors.primary}
                            />
                          ) : null
                        }
                        style={{
                          backgroundColor:
                            selectedWorkStatus === option.label
                              ? isDark
                                ? Colors.gray
                                : Colors.background
                              : 'transparent',
                          borderRadius: 1,
                          marginVertical: 2,
                        }}
                        titleStyle={{
                          color: isDark ? Colors.white : Colors.black,
                          fontFamily: 'Lato-Regular',
                          fontSize: 14,
                        }}
                      />
                    ))}
                  </List.Accordion>
                </View>
              </Card.Content>
            </Card>
          ))
        )}
      </ScrollView>
    </View>
  );
};

const styles = (isDark: boolean) =>
  StyleSheet.create({
    mainContainer: {
      flex: 1,
      backgroundColor: isDark ? Colors.black : Colors.white,
    },
    divider: {
      height: 1,
      backgroundColor: isDark ? Colors.medium_gray : 'transparent',
    },
    card: {
      backgroundColor: isDark ? Colors.black : Colors.background,
      marginVertical: 7,
      borderColor: Colors.background,
      borderWidth: 0.5,
      marginHorizontal: 16,
      overflow: 'hidden',
    },
    row: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginVertical: 1,
    },
    label: {
      fontFamily: 'Lato-Bold',
      color: isDark ? Colors.white : Colors.black,
      marginBottom: 5,
    },
    value: {
      fontSize: 14,
      fontFamily: 'Lato-Regular',
      color: isDark ? Colors.white : Colors.black,
      flexWrap: 'wrap',
    },
    input: {
      marginTop: 5
  },
  });

export default AddToMyPlan;
