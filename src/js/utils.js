let dnd2TemplateRef = require('../html/dnd2.html');

 /*
 * Reference to platform's activity adaptor (initialized during init() ).
 */
export let activityAdaptor;

/*
 * Internal Engine Config.
 */ 
export let __config = {
    MAX_RETRIES: 10, /* Maximum number of retries for sending results to platform for a particular activity. */ 
    RESIZE_MODE: 'auto', /* Possible values - "manual"/"auto". Default value is "auto". */
    RESIZE_HEIGHT: '580' /* Applicable, if RESIZE_MODE is manual. If RESIZE_HEIGHT is defined in TOC then that will overrides. */
    /* If both config RESIZE_HEIGHT and TOC RESIZE_HEIGHT are not defined then RESIZE_MODE is set to "auto"*/
};

/*
 * Internal Engine State.
 */ 
export let __state = {
    currentTries: 0, /* Current try of sending results to platform */
    activityPariallySubmitted: false, /* State whether activity has been partially submitted. Possible Values: true/false(Boolean) */
    activitySubmitted: false, /* State whether activity has been submitted. Possible Values: true/false(Boolean) */
    radioButtonClicked: false /* State whether radio button is clicked.  Possible Values: true/false(Boolean) */   
};

/*
 * Content (loaded / initialized during init() ).
 */ 
export let __content = {
    directionsJSON: '',
    questionsJSON: [], /* Contains the question obtained from content JSON. */
    optionsJSON: [], /* Contains all the options for a particular question obtained from content JSON. */
    answersJSON: [], /* Contains the answer for a particular question obtained from content JSON. */
    userAnswersJSON: [], /* Contains the user answer for a particular question. */
    feedbackJSON: {}, /* Contains the feedback for question*/
    activityType: null /* Type of FIB activity. Possible Values :- FIBPassage. */
};

/*
 * Constants.
 */
export const __constants = {
    /* CONSTANT for PLATFORM Save Status NO ERROR */
    STATUS_NOERROR: 'NO_ERROR',
    DOM_SEL_SUBMIT_BTN: '#submit',
    TEMPLATES: {
        /* Regular DND Layout */
        DND2: dnd2TemplateRef
    }
};

// Array of all interaction tags in question
export let __interactionIds = [];
export let __processedJsonContent;
