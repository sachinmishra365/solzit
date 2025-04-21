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

const Completed = [
  {label: 'On Hold', value: 100000008},
  {label: 'Work In Progress', value: 674180001},
  {label: 'Completed', value: 674180002},
];

const Others = [
  {label: 'Production Failed', value: 674180002},
  {label: 'Not An Issue', value: 674180000},
  {label: 'Duplicate', value: 674180003},
  {label: 'Duplicate', value: 100000008},
];

export {Not_Started, In_Progress, Completed, Others};
