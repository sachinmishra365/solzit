import { Image, StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import CustomHeader from '../../Components/CustomHeader'
import { Colors } from '../../constants/Colors'
import Dashboard from './Dashboard'
import Dashboard2 from './Dashboard2'

const CombinedDashboard = ({ navigation }: any) => {
    const [show, setShow] = useState(false);

    return (
        <>
            <CustomHeader
                showBackIcon={false}
                divider={false}
                titleImage={require('../../Assets/Images/Logo/SolzLogoDash.png')}
                onPress={() => navigation.openDrawer()}
                showRightIcon2={true}
                rightIconName={'swap-horizontal-circle-outline'}
                rightIconColor2={Colors.primary}
                rightIconName2={'swap-horizontal-circle-outline'}
                rightIconPress2={() => setShow(!show)}
            />
            {show ?
                <Dashboard />
                :
                <Dashboard2 />
            }
        </>
    )
}

export default CombinedDashboard

const styles = StyleSheet.create({})