/* global Handlebars */
/* global $ */
let dnd2TemplateRef = require('../html/dnd2.html');

require('../css/dnd2.css');

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

/***************************************************************************/

/**
 * Function to process HandleBars template with JSON.
 */
export function processLayoutWithContent(layoutHTML, contentJSON) {

    /* Compiling Template Using Handlebars. */
    var compiledTemplate = Handlebars.compile(layoutHTML);

    /*Compiling HTML from Template. */
    var compiledHTML = compiledTemplate(contentJSON);

    return compiledHTML;
}

/**
 *  Function to modify JSON as per the activity / template requirement.
 */
export function parseAndUpdateJSONContent(jsonContent, params) {

    /* Make "options" node in JSON. */
    jsonContent.content.options = [];

    /* Type of DND activity */
    __content.activityType = params.variation;

    /* Activity Instructions. */
    if (jsonContent.content.instructions[0].tag) {
        __content.directionsJSON = jsonContent.content.instructions[0].tag;
    }

    __content.maxscore = jsonContent.meta.score.max;
    jsonContent.content.directions = {};
    jsonContent.content.directions.text = __content.directionsJSON;

    $.each(jsonContent.content.canvas.data.questiondata, function (num) {
        var questionData = this.text;
        /* Extract interaction id's and tags from question text. */
        var interactionId = [];
        var interactionTag = [];

        /* String present in href of interaction tag. */
        var interactionReferenceString = 'http://www.comprodls.com/m1.0/interaction/kdnd';
        /* Parse questiontext as HTML to get HTML tags. */
        var parsedQuestionArray = $.parseHTML(questionData);
        var j = 0;

        $.each(parsedQuestionArray, function (i) {
          if (this.href === interactionReferenceString) {
            interactionId[j] = this.childNodes[0].nodeValue.trim();
            interactionTag[j] = this.outerHTML;
            interactionTag[j] = interactionTag[j].replace(/"/g, "'");
            j++;
          }
        });
        __content.questionsJSON = parsedQuestionArray[0].data;
        jsonContent.content.questionData = {};
        jsonContent.content.questionData.text = parsedQuestionArray[0].data;
    });
    return jsonContent;
}
