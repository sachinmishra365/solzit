const Not_Started = [
  {label: 'Not Started', value: 674180000},
  {label: 'Analyzing', value: 674180009},
  {label: 'Needs Clarification', value: 674180014},
  {label: 'On Hold', value: 100000008},
  {label: 'Duplicate', value: 674180012},
];

const In_Progress = [
  {label: 'Analyzing', value: 674180009},
  {label: 'Needs Clarification', value: 674180014},
  {label: 'On Hold', value: 100000008},
  {label: 'Duplicate', value: 674180012},
  {label: 'Work In Progress', value: 674180001},
];
const OnHold = [
  {label: 'On Hold', value: 100000008},
  {label: 'Needs Clarification', value: 674180014},
  {label: 'Duplicate', value: 674180012},
  {label: 'Work In Progress', value: 674180001},
];

const Need_clarification = [
  {label: 'Needs Clarification', value: 674180014},
  {label: 'On Hold', value: 100000008},
  {label: 'Clarification Given', value: 674180015},
];

const Clarification_Given = [
  {label: 'Clarification Given', value: 674180015},
  {label: 'Needs Clarification', value: 674180014},
  {label: 'On Hold', value: 100000008},
  {label: 'Duplicate', value: 674180012},
  {label: 'Work In Progress', value: 674180001},
];

const Bug_In_Progress = [
  {label: 'Analyzing', value: 674180009},
  {label: 'Needs Clarification', value: 674180014},
  {label: 'On Hold', value: 100000008},
  {label: 'Not an Issue', value: 674180011},
  {label: 'Duplicate', value: 674180012},
  {label: 'Work In Progress', value: 674180001},
];

const Completed = [
  {label: 'On Hold', value: 100000008},
  {label: 'Work In Progress', value: 674180001},
  {label: 'Completed', value: 674180002},
];
const BugCompleted = [
  {label: 'On Hold', value: 100000008},
  {label: 'Work In Progress', value: 674180001},
  {label: 'Ready for Review', value: 674180003},
];
const ReviewFailed = [
  {label: 'Review Failed', value: 674180006},
  {label: 'Needs Clarification', value: 674180014},
  {label: 'Work In Progress', value: 674180001},
];

const Bug_OnHold = [
  {label: 'On Hold', value: 100000008},
  {label: 'Needs Clarification', value: 674180014},
  {label: 'Work In Progress', value: 674180001},
];

const Bug_Need_clarification = [
  {label: 'Needs Clarification', value: 674180014},
  {label: 'On Hold', value: 100000008},
  {label: 'Work In Progress', value: 674180001},
  {label: 'Clarification Given', value: 674180015},
  {label: 'Not an Issue', value: 674180011},
];
const Not_An_Issue = [
  {label: 'Needs Clarification', value: 674180014},
  {label: 'On Hold', value: 100000008},
  {label: 'Work In Progress', value: 674180001},
];

const User_Story_In_progress = [
  {label: 'Review In Progress', value: 674180004},
  {label: 'On Hold', value: 100000008},
  {label: 'Review Passed', value: 674180005},
];

const Bug_Clarification_Given = [
  {label: 'Clarification Given', value: 674180015},
  {label: 'Needs Clarification', value: 674180014},
  {label: 'On Hold', value: 100000008},
  {label: 'Duplicate', value: 674180012},
  {label: 'Work In Progress', value: 674180001},
  {label: 'Not an Issue', value: 674180011},
];

export {
  Not_Started,
  In_Progress,
  Completed,
  BugCompleted,
  Bug_In_Progress,
  ReviewFailed,
  OnHold,
  Need_clarification,
  Clarification_Given,
  Bug_OnHold,
  Bug_Clarification_Given,
  Bug_Need_clarification,
  Not_An_Issue,
  User_Story_In_progress
};
