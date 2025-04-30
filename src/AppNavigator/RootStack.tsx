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
import { useEffect } from 'react';
import MySkills from '../Screens/profile/MySkills';
import MyAssets from '../Screens/profile/MyAssets';
import OpenPositions from '../Screens/Hiring Recruitment/OpenPositions';
import MyReferences from '../Screens/Hiring Recruitment/MyReferences';
import AddReference from '../Screens/Hiring Recruitment/AddReference';
import PositionDetail from '../Screens/Hiring Recruitment/PositionDetails';
import Worklog from '../Screens/Worklogs/Worklog';
import Feedback from '../Screens/Feedback/Feedback';
import AddFeedback from '../Screens/Feedback/AddFeedback';
import SoluzioneDirectory from '../Screens/Soluzione Directory/SoluzioneDirectory';
import ViewFeedback from '../Screens/Feedback/ViewFeedback';
import { useDispatch, useSelector } from 'react-redux';
import { useGetSoluzioneUpcomingBirthdaysQuery, useSoluzioneHolidaysQuery } from '../Services/services';
import { SetMetaData } from '../AppStore/Reducers/appState';
import FilterWorklogs from '../Screens/Worklogs/FilterWorklogs';
import AddToDo from '../Screens/Worklogs/AddNewToDo/AddToDo';
import AddWorklog from '../Screens/Worklogs/AddWorklog';
import WorklogDetails from '../Screens/Worklogs/WorklogDetails';
import PlanMyDay from '../Screens/My Work/Plan My Day/PlanMyDay';
import AddToMyPlan from '../Screens/My Work/Plan My Day/AddToMyPlan';
import ToDoDetails from '../Screens/My Work/Plan My Day/ToDoDetails';
import MyPlans from '../Screens/My Work/My Plans/MyPlans';
import TaskDetails from '../Screens/My Work/My Plans/TaskDetails';
import ProjectAllocation from '../Screens/My Work/My Projects/ProjectAllocation';
import LateArrivalTime from '../Screens/LeavesAndBreakes/LateArrivalTime';
import WorkFromHome from '../Screens/WorkFromHome/WorkFromHome';
import ShowPlan from '../Screens/My Work/Plan My Day/Show Plan/ShowPlan';

import AddBug from '../Screens/Worklogs/AddNewToDo/AddBug';
import BugDetails from '../Screens/Worklogs/Bugs/BugDetails';

import WFHCard from '../Screens/Dashboard/WFHCard';


const Stack = createNativeStackNavigator();

const RootStack = () => {
  const dispatch = useDispatch();
  const Assesstoken = useSelector((state: any) => state?.appState?.authToken);
  const accessToken = Assesstoken?.authToken?.accessToken;

  const { data: upcomingBirthdayData, refetch: refetchBirthday } = useGetSoluzioneUpcomingBirthdaysQuery({ accessToken: accessToken, });
  const { data:holidaysData, error, isLoading, refetch } = useSoluzioneHolidaysQuery({ accessToken: accessToken, });


useEffect(() => {
  if (upcomingBirthdayData && holidaysData ) {
    const merged:any = [
      // ...(upcomingBirthdayData?.data || []),
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
      <Stack.Screen name="Worklog" component={Worklog} />
      <Stack.Screen name="Feedback" component={Feedback} />
      <Stack.Screen name="AddFeedback" component={AddFeedback} />
      <Stack.Screen name="ViewFeedback" component={ViewFeedback} />
      <Stack.Screen name="MySkills" component={MySkills} />
      <Stack.Screen name="MyAssets" component={MyAssets} />
      <Stack.Screen name="SoluzioneDirectory" component={SoluzioneDirectory} />
      <Stack.Screen name="SepratedAttendance" component={SepratedAttendance} />
      <Stack.Screen name="Summary" component={Summary} />
      <Stack.Screen name="PlanMyDay" component={PlanMyDay} />
      <Stack.Screen name="AddToMyPlan" component={AddToMyPlan} />
      <Stack.Screen name="ToDoDetails" component={ToDoDetails} />
      <Stack.Screen name="BugDetails" component={BugDetails} />
      <Stack.Screen name="MyPlans" component={MyPlans} />
      <Stack.Screen name="TaskDetails" component={TaskDetails} />
      <Stack.Screen name="ProjectAllocation" component={ProjectAllocation} />
      <Stack.Screen name="LateArrivalTime" component={LateArrivalTime} />
      <Stack.Screen name="WorkFromHome" component={WorkFromHome} />
      {/* <Stack.Screen name="FilterWorklogs" component={FilterWorklogs} /> */}
      <Stack.Screen name="AddToDo" component={AddToDo} />
      <Stack.Screen name="AddBug" component={AddBug} />
      <Stack.Screen name="AddWorklog" component={AddWorklog} />
      <Stack.Screen name="WorklogDetails" component={WorklogDetails} />
      <Stack.Screen name="ShowPlan" component={ShowPlan} />
      <Stack.Screen name="WFHCard" component={WFHCard} />
    </Stack.Navigator>
  );
};

export default RootStack;
