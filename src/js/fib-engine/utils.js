/* global Handlebars */
/* global $ */

/** FIB2 Template Reference */
let fib2TemplateRef = require('../../html/fib2.html');
/** FIB2 Light Theme Template Reference */
let fib2LightTemplateRef = require('../../html/fib2-light.html');
/** FIB2 Dark Theme Template Reference */
let fib2DarkTemplateRef = require('../../html/fib2-dark.html');

require('../../scss/index.scss');

/**
 * @type {Object}
 * Reference to platform's activity adaptor (initialized using constructor).
 */
export let activityAdaptor;

/**
 * @type {Object}
 * Theme Configurations.
 */ 
export let themeConfig;

/**
 * @const {Object}
 * Internal Engine Config.
 */ 
export const __config = {
    MAX_RETRIES: 10, /** Maximum number of retries for sending results to platform for a particular activity. */ 
    RESIZE_MODE: 'auto', /** Possible values - "manual"/"auto". Default value is "auto". */
    RESIZE_HEIGHT: '580' /** Applicable, if RESIZE_MODE is manual. If RESIZE_HEIGHT is defined in TOC then that will overrides. */
    /** If both config RESIZE_HEIGHT and TOC RESIZE_HEIGHT are not defined then RESIZE_MODE is set to "auto"*/
};

/**
 * @type {Object}
 * Internal Engine State.
 */ 
export let __state = {
    currentTries: 0, /** Current try of sending results to platform */
    activityPariallySubmitted: false, /** State whether activity has been partially submitted. Possible Values: true/false(Boolean) */
    activitySubmitted: false, /** State whether activity has been submitted. Possible Values: true/false(Boolean) */
    radioButtonClicked: false /** State whether radio button is clicked.  Possible Values: true/false(Boolean) */   
};

/**
 * @type {Object}
 * Content (loaded / initialized using constructor).
 */ 
export let __content = {
    directionsJSON: '', /** Contains the directions obtained from content JSON. */
    questionsJSON: [], /** Contains the question obtained from content JSON. */
    optionsJSON: [], /** Contains all the options for a particular question obtained from content JSON. */
    answersJSON: [], /** Contains the answer for a particular question obtained from content JSON. */
    userAnswersJSON: [], /** Contains the user answer for a particular question. */
    feedbackJSON: {}, /** Contains the feedback for question. */
    activityType: null /** Type of FIB activity. */
};

/**
 * @const {Object}
 * Constants
 */
export const __constants = {
    TEMPLATES: {
        FIB2: fib2TemplateRef, /** Regular FIB Layout */
        FIB2_LIGHT: fib2LightTemplateRef, /** Regular FIB Light Layout */
        FIB2_DARK: fib2DarkTemplateRef /** Regular FIB Dark Layout */
    },
    THEME_CONFIG: {
        'LIGHT': {
            'backgroundColor': '#F7F1CF' /** Background color for LIGHT Theme */
        },
        'DARK': {
            'backgroundColor': '#8967F3' /** Background color for DARK Theme */
        }
    }
};

/** 
 * @type {Array}
 * Array of all interaction tags in question 
 */
export let __interactionIds = [];

/** 
 *  <-----------------PRIVATE FUNCTIONS----------------->
 */

/**
 *  Function to process HandleBars template with JSON.
 *
 *  @param {String} layoutHTML -  Activity HTML template.
 *  @param {Object} contentJSON - Updated JSON content as per the activity/template requirement.
 *  @return {String} compiledHTML - Activity HTML layout compiled with JSON content.  
 */
export function processLayoutWithContent(layoutHTML, contentJSON) {

    /** 
     * @type {Function}
     * Compiling Template Using Handlebars. 
     */
    let compiledTemplate = Handlebars.compile(layoutHTML);

    /** 
     * @type {String} 
     * Compiling HTML from Template. 
     */
    let compiledHTML = compiledTemplate(contentJSON);

    return compiledHTML;
}

/**
 *  Function to modify JSON as per the activity / template requirement.
 *
 *  @param {Object} jsonContent - Activity JSON content.
 *  @param {Object} params - Startup params passed by platform.
 *  @return {Object} jsonContent - Modified activity JSON content.
 */
export function parseAndUpdateJSONContent(jsonContent, params) {

    /** Make "options" node in JSON. */
    jsonContent.content.options = [];

    /** Type of FIB activity */
    __content.activityType = params.variation;

    /** Activity Instructions. */
    if (jsonContent.content.instructions[0].tag) {
        __content.directionsJSON = jsonContent.content.instructions[0].tag;
    }

    jsonContent.content.directions = {};
    jsonContent.content.directions.text = __content.directionsJSON;

    $.each(jsonContent.content.canvas.data.questiondata, function (num) {
        let questionData = this.text;
        /** Extract interaction id's and tags from question text. */
        let interactionId = [];
        let interactionTag = [];

        /** String present in href of interaction tag. */
        let interactionReferenceString = 'http://www.comprodls.com/m1.0/interaction/fib2';
        /** Parse questiontext as HTML to get HTML tags. */
        let parsedQuestionArray = $.parseHTML(questionData);
        let j = 0;

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
