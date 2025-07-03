const Colors = {
  primary: '#00539f',
  // secondary: '#0585b7',
  secondary: '#307CE8',
  accent: '#af292e',
  tertiary: '#a2a5a4',
  white: '#FAFAFA',
  black: '#000000',
  gray: '#292929',
  medium_gray: '#999',
  dark_gray: '#808080',
  error: '#BD0101',
  dispatched: '#83B100',
  background: '#FFFFFF',
  green: '#4CAF50',
  orange: ' #FF9800',
  darkgreen: '#0c660f',
  skyblue: '#2196F3',
  darkorange: '#FF9800',
};
const FontSize = {
  mini: 10,
  small: 12,
  medium: 14,
  large: 16,
  xLarge: 20,
  xxLarge: 24,
};
const Statuses = {
  not_started: {label: 'Not Started', color: '#000000'},
  analysing: {label: 'Analyzing', color: '#2196F3'},
  work_in_progress: {label: 'Work In Progress', color: '#FF9800'},
  work_complete: {label: 'Work Complete', color: '#4CAF50'},
  duplicate: {label: 'Duplicate', color: '#9C27B0'},
  on_hold: {label: 'On Hold', color: '#FFC107'},
  need_clarification: {label: 'Needs Clarification', color: '#E91E63'},
  clarification_given: {label: 'Clarification Given', color: '#8BC34A'},
  new: {label: 'New', color: '#00539f'},
  ready_for_review: {label: 'Ready for Review', color: '#FFEB3B'},
  review_passed: {label: 'Review Passed', color: '#4CAF50'},
  review_failed: {label: 'Review Failed', color: '#F44336'},
  Submitted_for_approval: {label: 'Submitted for approval', color: '#FF9800'},
  Approved: {label: 'Approved', color: '#4CAF50'},
  Rejected: {label: 'Rejected', color: '#BD0101'},
  Review_In_Progress: {label: 'Review In Progress', color: '#FF9800'},
};

const hiringRecruitment = [
  {
    label: 'Interview Scheduled (Round 1)',
    value: 674180001,
    color: '#1E90FF',
  },
  {
    label: 'Offered',
    value: 674180003,
    color: '#32CD32',
  },
  {
    label: 'Offer Accepted',
    value: 674180005,
    color: '#00BFFF',
  },
  {
    label: 'Offer Declined',
    value: 674180006,
    color: '#FF4500',
  },
  {
    label: 'Employed',
    value: 674180007,
    color: '#2E8B57',
  },
  {
    label: 'Rejected',
    value: 674180004,
    color: '#DC143C',
  },
  {
    label: 'Did Not Appear for Interview',
    value: 674180008,
    color: '#FFA500',
  },
  {
    label: 'Short Listed',
    value: 674180000,
    color: '#20B2AA',
  },
  {
    label: 'Wait Listed',
    value: 674180010,
    color: '#FF69B4',
  },
  {
    label: 'To be Scheduled (Round 1)',
    value: 674180021,
    color: '#9370DB',
  },
  {
    label: 'To be Scheduled (Machine Test)',
    value: 674180024,
    color: '#8FBC8F',
  },
  {
    label: 'On-Hold',
    value: 674180020,
    color: '#FFD700',
  },
  {
    label: 'Contact Later - Exp',
    value: 674180014,
    color: '#00CED1',
  },
  {
    label: 'Contact Later - Fresher',
    value: 674180015,
    color: '#87CEEB',
  },
  {
    label: 'Filtered Out',
    value: 674180009,
    color: '#B22222',
  },
  {
    label: 'Follow Up',
    value: 674180016,
    color: '#FF8C00',
  },
  {
    label: 'To be Scheduled (Round 2)',
    value: 674180022,
    color: '#6A5ACD',
  },
  {
    label: 'Interview Scheduled (Round 2)',
    value: 674180002,
    color: '#4169E1',
  },
  {
    label: 'Interview Scheduled (Round 3)',
    value: 674180027,
    color: '#483D8B',
  },
  {
    label: 'Machine Test Cleared',
    value: 674180013,
    color: '#00FA9A',
  },
  {
    label: 'Machine Test Scheduled',
    value: 674180023,
    color: '#4682B4',
  },
  {
    label: 'Black Listed',
    value: 674180025,
    color: '#000000',
  },
  {
    label: 'New',
    value: 1,
    color: '#00539f',
  },
  {
    label: 'Not Interested',
    value: 674180017,
    color: '#A52A2A',
  },
  {
    label: 'Not Reachable',
    value: 674180018,
    color: '#708090',
  },
  {
    label: 'Not Suitable',
    value: 674180019,
    color: '#A9A9A9',
  },
  {
    label: 'Round 1 Cleared',
    value: 674180011,
    color: '#3CB371',
  },
  {
    label: 'Round 2 Cleared',
    value: 674180012,
    color: '#228B22',
  },
  {
    label: 'Round 3 Cleared',
    value: 674180028,
    color: '#006400',
  },
  {
    label: 'To be Scheduled (Round 3)',
    value: 674180026,
    color: '#7B68EE',
  },
  {
    label: 'Inactive',
    value: 2,
    color: '#808080',
  },
];

export {Colors, FontSize, Statuses, hiringRecruitment};
