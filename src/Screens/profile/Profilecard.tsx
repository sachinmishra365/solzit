import { Image, StyleSheet, Text, TouchableOpacity, View, Pressable } from 'react-native';
import React from 'react';
import { Colors } from '../../constants/Colors';
import { useSelector } from 'react-redux';
import { isDarkTheme } from '../../AppStore/Reducers/appState';
import { IconButton } from 'react-native-paper';

const Profilecard = () => {
    const isDark = useSelector(isDarkTheme);
    const EmployeeId = useSelector((state: any) => state?.appState?.authToken);
    const Profiledata = EmployeeId?.userProfile;

    return (
        <>
            <IconButton
                style={{ position: 'absolute', top: 130, right: 95 ,zIndex: 1}}
                icon="camera"
                iconColor={isDark ? Colors.white : Colors.primary}
                size={30}
                // onPress={openModal}
                accessibilityLabel="Edit Profile"
            />
            <View style={styles(isDark).cardcontainer}>
                <Pressable
                    onPress={() => {
                        // handle profile image press (e.g., open modal)
                    }}
                // style={({ pressed }) => [
                //     styles(isDark).imageWrapper,
                //     pressed && { opacity: 0.7 },
                // ]}
                >
                    <Image
                        style={styles(isDark).image}
                        source={
                            !Profiledata?.employeeImg
                                ? { uri: Profiledata?.employeeImg }
                                : require('../../Assets/Images/profile.png')
                        }
                    />
                    {/* <Text style={{marginLeft:16,marginTop:10,color:Colors.primary,fontFamily:'Lato-Bold'}}>EDIT</Text> */}
                </Pressable>
                {/* 
                <View >
                    <Text style={styles(isDark).txt}>
                        {Profiledata?.fullName || 'N/A'}
                    </Text>
                    <Text style={styles(isDark).txt}>
                        {Profiledata?.designation || 'N/A'}
                    </Text>
                    <Text style={styles(isDark).txt}>
                        {Profiledata?.email || 'N/A'}
                    </Text>

                </View> */}
            </View>
            <View
                style={{
                    borderWidth: 0.5, height: 0.5,
                    backgroundColor: isDark ? Colors.white : Colors.black,
                    borderColor: isDark ? Colors.black : Colors.black,
                    margin: 16,
                    marginRight: -16
                }}
            />
        </>
    );
};

export default Profilecard;

const styles = (isDark: boolean) =>
    StyleSheet.create({
        cardcontainer: {
            backgroundColor: 'transparent',
            marginHorizontal: 70,
            marginTop: 60,
            // alignItems: 'center',
            flexDirection: 'row',
        },
        imageWrapper: {
            marginBottom: 20,
            borderRadius: 100,
            overflow: 'hidden',
            alignSelf: 'center',

        },
        image: {
            height: 100,
            width: 100,
            borderRadius: 50,
            marginRight: 16,
            alignSelf: 'center',
        },
        txt: {
            color: isDark ? Colors.white : Colors.black,
            lineHeight: 25,
            fontFamily: 'Lato-Semibold',
        },
    });
