import fib2TemplateRef from '../../html/fib2.html';

export const Constants = {
  TEMPLATES: {
    FIB2: fib2TemplateRef
  },
  THEMES: {
    FIB2: 'fib2',
    FIB2_LIGHT: 'fib2-light',
    FIB2_DARK: 'fib2-dark'
  },
  LAYOUT_COLOR: {
    'BG': {
      'FIB2': '#FFFFFF',
      'FIB2_LIGHT': '#f6f6f6',
      'FIB2_DARK': '#222222'
    }
  },
  MAX_RETRIES: 10, /* Maximum number of retries for sending results to platform for a particular activity. */
  INTERACTION_REFERENCE_STR: 'http://www.comprodls.com/m1.0/interaction/fib2',
  STATEMENT_STARTED: 'started',
  STATEMENT_ANSWERED: 'answered',
  STATEMENT_INTERACTED: 'interacted',
  STATEMENT_SUBMITTED: 'submitted',
  STATUS_NOERROR: 'NO_ERROR'
};
