import { StyleSheet } from 'react-native'
import Toast from 'react-native-toast-message';

const ToastMessage = ({ type, title, subtitle }: any) => {
    return (
        Toast.show({
            type,
            text1: title,
            text2: subtitle,
            text2Style: { flexWrap: 'wrap', fontSize: 20, fontFamily: 'Lato-Regular' },
            topOffset: 80,
            visibilityTime: 3000,
        })
    )
}

export default ToastMessage

const styles = StyleSheet.create({})