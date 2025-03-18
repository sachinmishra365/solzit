import * as React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import DrawerNavigator from './DrawerNavigator';
import ApplyLeave from '../Screens/ApplyLeave';
import LeaveRequest from '../Screens/LeavesAndBreakes/LeaveRequest';
import LeaveBalance from '../Screens/LeavesAndBreakes/LeaveBalance';
import Profile from '../Screens/profile/Profile';
import Attandance from '../Screens/Attendance/Attandance';
import ChangePassword from '../Screens/ChangePassword/ChangePassword';
import SepratedAttendance from '../Screens/Attendance/SepratedAttendance';
import Summary from '../Screens/Attendance/Summary';
import { PermissionHandler } from '../permissions';
import { useEffect, useState } from 'react';
import MySkills from '../Screens/profile/MySkills';
import MyAssets from '../Screens/profile/MyAssets';
import OpenPositions from '../Screens/Hiring Recruitment/OpenPositions';
import MyReferences from '../Screens/Hiring Recruitment/MyReferences';
import AddReference from '../Screens/Hiring Recruitment/AddReference';
import PositionDetail from '../Screens/Hiring Recruitment/PositionDetails';
import Feedback from '../Screens/Feedback/Feedback';
import AddFeedback from '../Screens/Feedback/AddFeedback';
import SoluzioneDirectory from '../Screens/Soluzione Directory/SoluzioneDirectory';
import ViewFeedback from '../Screens/Feedback/ViewFeedback';
import { useDispatch, useSelector } from 'react-redux';
import { useEmployeeAppliedLeavesQuery, useGetSoluzioneUpcomingBirthdaysQuery, useProcessedLeavesQuery, useSoluzioneHolidaysQuery } from '../Services/services';
import { SetMetaData } from '../AppStore/Reducers/appState';

const Stack = createNativeStackNavigator();

const RootStack = () => {
  const dispatch = useDispatch();
  const Assesstoken = useSelector((state: any) => state?.appState?.authToken);
  const accessToken = Assesstoken?.authToken?.accessToken;

  const { data: upcomingBirthdayData, refetch: refetchBirthday } = useGetSoluzioneUpcomingBirthdaysQuery({ accessToken: accessToken, });

  const { data:holidaysData, error, isLoading, refetch } = useSoluzioneHolidaysQuery({ accessToken: accessToken, });

  const { data: AppliedLeave, refetch: refetchapplies } = useEmployeeAppliedLeavesQuery({ accessToken: accessToken, });

  const ProcessedLeaves = useProcessedLeavesQuery({ accessToken: accessToken, });

  const [mergedData, setMergedData] = useState([]);

useEffect(() => {
  if (upcomingBirthdayData && holidaysData && AppliedLeave && ProcessedLeaves) {
    const merged:any = [
      ...(upcomingBirthdayData?.data || []),
      ...(holidaysData?.data || []),
    ];
    dispatch(SetMetaData(merged))
  }
}, [upcomingBirthdayData, holidaysData]);

  useEffect(() => {
    PermissionHandler.requestAllPermissions();
  }, []);
  

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="DrawerNavigator" component={DrawerNavigator} />
      <Stack.Screen name="ApplyLeave" component={ApplyLeave} />
      <Stack.Screen name="LeaveRequest" component={LeaveRequest} />
      <Stack.Screen name="LeaveBalance" component={LeaveBalance} />
      <Stack.Screen name="Profile" component={Profile} />
      <Stack.Screen name="ChangePassword" component={ChangePassword} />
      <Stack.Screen name="Attandance" component={Attandance} />
      <Stack.Screen name="OpenPositions" component={OpenPositions} />
      <Stack.Screen name="MyReferences" component={MyReferences} />
      <Stack.Screen name="AddReference" component={AddReference} />
      <Stack.Screen name="PositionDetail" component={PositionDetail} />
      <Stack.Screen name="Feedback" component={Feedback} />
      <Stack.Screen name="AddFeedback" component={AddFeedback} />
      {/* <Stack.Screen name="ViewFeedback" component={ViewFeedback} /> */}
      <Stack.Screen name="MySkills" component={MySkills} />
      <Stack.Screen name="MyAssets" component={MyAssets} />
      <Stack.Screen name="SoluzioneDirectory" component={SoluzioneDirectory} />
      <Stack.Screen name="SepratedAttendance" component={SepratedAttendance} />
      <Stack.Screen name="Summary" component={Summary} />
    </Stack.Navigator>
  );
};

export default RootStack;
