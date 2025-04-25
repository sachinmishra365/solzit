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
];

export {
  Not_Started,
  In_Progress,
  Completed,
  BugCompleted,
  Bug_In_Progress,
  ReviewFailed,
};
