const Colors = {
  primary: '#00539f',
  // secondary: '#0585b7',
  secondary: '#307CE8',
  accent: '#af292e',
  tertiary: '#a2a5a4',
  white: '#FAFAFA',
  black: '#000',
  gray: '#292929',
  medium_gray: '#999',
  dark_gray: '#808080',
  error: '#BD0101',
  dispatched: '#83B100',
  background: '#FFFFFF',
  green:'#4CAF50'
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
  need_clarification: {label: 'Need Clarification', color: '#E91E63'},
  clarification_given: {label: 'Clarification Given', color: '#8BC34A'},
  new: {label: 'New', color: '#00539f'},
  ready_for_review: {label: 'Ready for Review', color: '#FFEB3B'},
  review_passed: {label: 'Review Passed', color: '#4CAF50'},
  review_failed: {label: 'Review Failed', color: '#F44336'},
  Submitted_for_approval: {label: 'Submitted for approval', color: '#FF9800'},
  Approved: {label: 'Approved', color: '#4CAF50'},
  Rejected: {label: 'Rejected', color: '#BD0101'},
};

export {Colors, FontSize, Statuses};
