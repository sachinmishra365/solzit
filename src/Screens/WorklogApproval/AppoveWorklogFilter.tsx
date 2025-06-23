import { ActivityIndicator, Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { useState } from 'react';
import { Dialog, Divider, IconButton, Portal } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { isDarkTheme, setFilterEmployeeList } from '../../AppStore/Reducers/appState';
import { Colors } from '../../constants/Colors';
import CustomTextInput from '../../Components/CustomTextInput';
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment';
import CustomDropdownWithModal from '../../Components/CustomDropDown';


const AppoveWorklogFilter = ({ visible, setVisible }: {
    visible: boolean;
    setVisible: (value: boolean) => void;

}) => {
    const dispatch = useDispatch();
    const employees = useSelector((state: any) => state?.appState?.EmployeeList);

    const isDark = useSelector(isDarkTheme);
    const hideDialog = () => setVisible(false);
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const [showStart, setShowStart] = useState(false);
    const [showEnd, setShowEnd] = useState(false);
    const [selectedEmployee, setSelectedEmployee] = useState<any>({ label: '', value: null });
    const [selectedStatus, setSelectedStatus] = useState<any>({ label: '', value: '' });

    const listoption = [
        { label: 'All', value: 'all' },
        { label: 'Approved', value: 'approved' },
        { label: 'Rejected', value: 'rejected' },
    ]

    const Employeelist = employees.map((item: any) => ({
        label: item?.employee?.name,
        value: item?.employee?.id,
    }));

    const handleFilter = () => {
        const filterData = {
            startDate: moment(startDate).utc().format('YYYY-MM-DDTHH:mm:ss.sss') + 'Z',
            endDate: moment(endDate).format('YYYY-MM-DDTHH:mm:ss.SSS') + 'Z',
            statusType: selectedStatus.value || 'all',
            employeeId: selectedEmployee.value || null,
        };
        dispatch(setFilterEmployeeList(filterData));
        hideDialog();

    }

    const onChangeStart = (_: any, selectedDate?: Date) => {
        if (selectedDate) {
            setStartDate(selectedDate);
        }
        setShowStart(false);
    };

    const onChangeEnd = (_: any, selectedDate?: Date) => {
        if (selectedDate) {
            setEndDate(selectedDate);
        }
        setShowEnd(false);
    };

    const showDatepickerStart = () => { setShowStart(true) };
    const showDatepickerEnd = () => { setShowEnd(true) };

    return (
        <Portal>
            <Dialog visible={visible} style={styles(isDark).container} dismissable={false}>
                <View style={styles(isDark).header}>
                    <Text style={styles(isDark).headerTitle}>Filters</Text>
                    <TouchableOpacity onPress={hideDialog}>
                        <IconButton icon="close" size={25} iconColor={isDark ? Colors.white : Colors.black} />
                    </TouchableOpacity>
                </View>

                <Dialog.Content style={styles(isDark).content}>
                    <View style={styles(isDark).rightPanel}>
                        <Pressable onPress={() => { showDatepickerStart(); }}>
                            <CustomTextInput
                                label="Start Day Of Leave"
                                value={moment(startDate).format('DD-MM-YYYY')}
                                lefticon={false}
                                rightIconName={'calendar'}
                                onPress={() => { showDatepickerStart(); }}
                                autoFocus={false}
                                editable={false}
                                readOnly={true}
                            />
                            <View style={{ marginVertical: 8 }} />
                            <Pressable onPress={() => { showDatepickerEnd(); }}>
                                <CustomTextInput
                                    label="End Day Of Leave"
                                    value={moment(endDate).format('DD-MM-YYYY')}
                                    lefticon={false}
                                    rightIconName={'calendar'}
                                    onPress={() => { showDatepickerEnd(); }}
                                    readOnly={true}
                                />
                            </Pressable>
                            <View style={{ marginVertical: 8 }} />
                            <CustomDropdownWithModal
                                label="Status"
                                selectedValue={selectedStatus}
                                options={listoption}
                                onSelect={(selectedOption: any) => setSelectedStatus(selectedOption)}
                            />
                            <View style={{ marginVertical: 8 }} />
                            <CustomDropdownWithModal
                                label="Employee"
                                selectedValue={selectedEmployee}
                                options={Employeelist}
                                onSelect={(selectedOption: any) => setSelectedEmployee(selectedOption)}
                            />
                            {showStart && (
                                <DateTimePicker
                                    testID="dateTimePickerStart"
                                    value={startDate}
                                    mode="date"
                                    display="default"
                                    onChange={onChangeStart}
                                    maximumDate={new Date()}
                                />
                            )}
                            {showEnd && (
                                <DateTimePicker
                                    testID="dateTimePickerEnd"
                                    value={endDate}
                                    mode="date"
                                    display="default"
                                    onChange={onChangeEnd}
                                    maximumDate={new Date()}
                                />
                            )}
                        </Pressable>
                    </View>
                </Dialog.Content>
                <TouchableOpacity style={styles(isDark).btncontainer} onPress={() => { handleFilter() }}>
                    <Text style={styles(isDark).btntxt}>Apply</Text>
                </TouchableOpacity>
            </Dialog>
        </Portal>
    );
};

export default AppoveWorklogFilter;

const styles = (isDark: boolean) => StyleSheet.create({
    container: {
        backgroundColor: isDark ? Colors.gray : Colors.background,
        borderRadius: 0,
        marginHorizontal: 0,
        height: '100%',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 12,
        borderBottomWidth: 1,
        borderBottomColor: Colors.medium_gray,
        maxHeight: 70,
        paddingVertical: 10,
        marginTop: 0
    },
    headerTitle: {
        fontSize: 18,
        fontFamily: 'Lato-Bold',
        marginLeft: 10,
        color: isDark ? Colors.white : Colors.black,
    },
    content: {
        flexDirection: 'row',
        paddingTop: 20,
    },
    rightPanel: {
        width: '100%',
        gap: 6,
    },
    txt: {
        fontSize: 15,
        fontFamily: 'Lato-SemiBold',
        textAlign: 'left',
        color: isDark ? Colors.white : Colors.black,
        paddingVertical: 5,
    },
    btntxt: {
        textAlign: 'center',
        fontSize: 16,
        color: Colors.white,
        fontFamily: 'Lato-Bold',
    },
    btncontainer: {
        height: 45,
        backgroundColor: Colors.primary,
        justifyContent: 'center',
        borderRadius: 3,
        marginHorizontal: 16,
    }

});