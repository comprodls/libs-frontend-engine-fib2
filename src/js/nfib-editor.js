/*
 * -------------------
 * Engine Module
 * -------------------
 * 
 * Name: Fill in Blank engine
 * Description: A HTML5 activity template for a fill in the blank type activity.
 *  
 * Interfaces / Modes :->
 * 
 *	1. Supports Standard ENGINE-SHELL interface
 *		{
 *			init(),
 *			getStatus(),
 *			getConfig()
 *		}
 *	2. Supports Multi-item handler interface
 *		{
 *			getAnswersJSON(),
 *			updateLastSavedResults(),
 *			markAnswers(),
 *			disableInputs(),
 *			isCorrectAnswer()
 *		}
 * 
 * ENGINE - SHELL interface : ->
 *
 * This engine assume that a module "shell.js" loads first, and establishes interface with the platform. The shell in
 * turn instantiates [ engine.init() ] this engine with necessary configuration paramters and a reference to platform Adapter
 * object which allows subsequent communuication with the platform.
 *
 * SHELL calls engine.getStatus() to check if SUBMIT has been pressed or not - the response from the engine is 
 * used to enable / disable LMS controls.
 *
 * SHELL calls engine.getConfig() to request SIZE information - the response from the engine is 
 * used to resize the container iframe.
 *
 *
 * EXTERNAL JS DEPENDENCIES : ->
 * Following are shared/common dependencies (specified in index.html), and assumed to loaded via the platform)
 * 1. JQuery
 * 2. Handlebars
 * 3. LMS Adapter
 * 4. Utils (for activity resize etc.)
 * 5. SHELL
 *
 *
 */
    
define(['text!../html/nfib-editor.html','css!../css/nfib-editor.css',], function (nelsonFibTemplate) {
	
  nfib = function () {
	"use strict";
	
	/*
	 * Reference to platform's activity adaptor (initialized during init() ).
	 */
	var activityAdaptor;	 
      
    /*
	 * Internal Engine Config.
	 */ 
	var __config = {};
	/*
	 * Content (loaded / initialized during init() ).
	 */ 
	var __content = {
		questionsXML: [], /* Contains all questions obtained from content XML. */
		directionsXML: "", /* Contains activity specific instruction obtained from content XML. */
		answersXML: {}, /* Contains all correct answers obtained from content XML. */
		userAnswersXML:{}, /* Contains all user answers submiited. */
        optionsXML: {},
		activityType: null  /* Type of FIB activity. Possible Values :- FIBPassage.  */			
	};

	/*
	 * Constants.
	 */
	var __constants = {
        /* CONSTANTS for HTML selectors */
        
        DOM_SEL_INPUT_BOX: "userAnswer",

        DOM_SEL_ACTIVITY_BODY: ".activity-body",

        DOM_EDIT_INSTRUCTION: 'edit-instruction-val',

        DOM_ANS_VAL: 'edit-answer-val',

        ADAPTOR_INSTANCE_IDENTIFIER: "data-objectid",
		
        /* CONSTANTS for Activity Layout to be used */
        TEMPLATES: {
            /* Regular FIB Layout */
            NFIB_EDITOR: nelsonFibTemplate
        }
    };

    var processedJsonContent;
    var originalContent;
	/********************************************************/
	/*					ENGINE-SHELL INIT FUNCTION
		
		"elRoot" :->		DOM Element reference where the engine should paint itself.														
		"params" :->		Startup params passed by platform. Include the following sets of parameters:
						(a) State (Initial launch / Resume / Gradebook mode ).
						(b) TOC parameters (videoRoot, contentFile, keyframe, layout, etc.).
		"adaptor" :->        An adaptor interface for communication with platform (saveResults, closeActivity, savePartialResults, getLastResults, etc.).
		"htmlLayout" :->    Activity HTML layout (as defined in the TOC LINK paramter). 
		"jsonContent" :->    Activity JSON content (as defined in the TOC LINK paramter).
		"callback" :->      To inform the shell that init is complete.
	*/
	/********************************************************/	
	function init(elRoot, params, adaptor, htmlLayout, jsonContentObj, callback) {
	
		/* ---------------------- BEGIN OF INIT ---------------------------------*/
		var isContentValid = true;
        var jsonContent = jQuery.extend(true, {}, jsonContentObj);
        originalContent = jQuery.extend(true, {}, jsonContentObj);
        activityAdaptor = adaptor;
    	
        /* ------ VALIDATION BLOCK START -------- */	
        if (jsonContent.content === undefined) {
            isContentValid = false;
        }
        /* ------ VALIDATION BLOCK END -------- */	

        if(!isContentValid) {
            /* Inform the shell that init is complete */
            if(callback) {
                callback();
            }			
            return; /* -- EXITING --*/
        }		
				
		/* Parse and update content JSON. */
		processedJsonContent = parseAndUpdateJSONContent(jsonContent, params);
		
		/* Apply the content JSON to the htmllayout */
		var processedHTML = processLayoutWithContent(__constants.TEMPLATES[htmlLayout], processedJsonContent);

		/* Update the DOM and render the processed HTML - main body of the activity */		
		$(elRoot).html(processedHTML);
		
        $(__constants.DOM_SEL_ACTIVITY_BODY).attr(__constants.ADAPTOR_INSTANCE_IDENTIFIER, adaptor.getId());       

		setupEventHandlers();
        /* Inform the shell that init is complete */
        if(callback) {
            callback();
        }								
      
		/* ---------------------- END OF INIT ---------------------------------*/
	} /* init() Ends. */        
	
	/**
	 * ENGINE-SHELL Interface
	 *
	 * Return configuration
	 */
	function getConfig () {
		return __config;
	}
	
	/**
	 * ENGINE-SHELL Interface
	 *
	 * Return the current state (Activity Submitted/ Partial Save State.) of activity.
	 */
	function getStatus() {

	}	
	 
	/**
	 * Function to process HandleBars template with JSON.
	 */
	function processLayoutWithContent(layoutHTML, contentJSON) {
		/* Compiling Template Using Handlebars. */
		var compiledTemplate = Handlebars.compile(layoutHTML);

		/*Compiling HTML from Template. */
		var compiledHTML = compiledTemplate(contentJSON);
		return compiledHTML;
	}
	
	function parseAndUpdateJSONContent(jsonContent, params) {
		jsonContent.content.displaySubmit = activityAdaptor.displaySubmit;    

        /* Activity Instructions. */
        var tagName = jsonContent.content.instructions[0].tag;
        __content.directionsXML = jsonContent.content.instructions[0][tagName];
        /* Put directions in JSON. */
        jsonContent.content.directions = __content.directionsXML;

        /* Set Type for Activity from engine type */
        __content.activityType = params.engineType;

        parseAndUpdateQuestionDataTypeJSON(jsonContent);
		/* Returning processed JSON. */
		return jsonContent;		
	}

	/**
	 * Parse and Update Question Data type JSON based on FIB specific requirements.
	 */	 
    function parseAndUpdateQuestionDataTypeJSON (jsonContent) {
        var splitCharacter = "___";
        var blank_prefix = "";
        var blank_suffix = "";

       
        var question = [];
        var k = 0;

        /* Make question object which contains question and correct answer. */
         $.each(jsonContent.content.canvas.data.questiondata, function (num) {

            /* Extract interaction id's and tags from question text. */
            var interactionId = [];
            var interactionTag = [];
            /* String present in href of interaction tag. */
            var interactionReferenceString = "http://www.comprodls.com/m1.0/interaction/nfib";
            /* Parse questiontext as HTML to get HTML tags. */
            var parsedQuestionArray = $.parseHTML(this.text);
            var j = 0;
            $.each( parsedQuestionArray, function(i) {
              if(this.href === interactionReferenceString) {
                interactionId[j] = this.childNodes[0].nodeValue.trim();
                interactionTag[j] = this.outerHTML;
                interactionTag[j] = interactionTag[j].replace(/"/g, "'");
                j++;
              }
            });
            $.each(interactionTag, function(i) {
              jsonContent.content.canvas.data.questiondata[num].text = jsonContent.content.canvas.data.questiondata[num].text.replace(interactionTag[i],"___");  
            });
            
            var counter = 0;
            var answer = "";
            var id = "";

            /* Count no of blanks in a question */
            var interaction_id = interactionId[k];
            if(!jsonContent.responses){
                jsonContent.responses = jsonContent.content.responses;
            }  
            question.push({
                "text": this.text,
                "correctanswer": jsonContent.responses[interaction_id].correct,
                "interactionId": interaction_id
            }); 
        });
        
         $.each(question, function (num) {
            var questionWithBlank = this.text;
            var startIndex = 0;
            var endIndex = 0;
            var parts = [];
            var splitCharacterPos = 0;
            var blankNumber = 0;
            this.answers = 0;
            blank_prefix = "";
            blank_suffix = "";
           
            var i = 0; 
            while (true) {
                var part = {};
                splitCharacterPos = questionWithBlank.indexOf(splitCharacter, startIndex);

                if (splitCharacterPos === -1) {
                    endIndex = questionWithBlank.length;
                } else {
                    endIndex = splitCharacterPos;
                }

                if (startIndex !== endIndex) {
                    part = {
                        content: questionWithBlank.substring(startIndex, endIndex)
                    };
                    parts.push(part); /* ADDING PREVIOUS PART */
                }
                if (splitCharacterPos !== -1) {
                    var interactionId = this.interactionId;
                    var answer = this.correctanswer;
                    
                    part = {
                        content: blank_prefix + "<span class='answer'><input type='text' id='" + interactionId + "' data-quesNo='" + num + "' class='input-sm " + __constants.DOM_SEL_INPUT_BOX + "'/></span>" + blank_suffix
                    };
                    
                    parts.push(part); /* ADDING PREVIOUS PART */
                    
                    this.answers ++;
                    blankNumber++;
                    /* Make answer and useranswer xml */
                    __content.userAnswersXML[interactionId] = "";
                    __content.answersXML[interactionId] = answer;
                }

                startIndex = splitCharacterPos + splitCharacter.length;
                
                if (splitCharacterPos === -1) {
                    this.index = num;
                    this.parts = parts;
                
                    this.questionText = questionWithBlank.replace(/__/g, "[.....]");
                    __content.questionsXML.push(this);
                    break;
                }
            }
         });
        jsonContent.content.questiondata = question;
    }

	/**
	 * Setting event listeners.
	 */
	function setupEventHandlers() {
        $("." + __constants.DOM_EDIT_INSTRUCTION).blur(function(){
            activityAdaptor.showSaveButton();
        });

        $("." + __constants.DOM_ANS_VAL).blur(function(){
            activityAdaptor.showSaveButton();
        });        

        $('.update-json').on('click',function(){
            saveUpdatedJson();
        });
	}

    function saveUpdatedJson(){
        processedJsonContent.content.instructions = $('.edit-instruction-val').val();
        processedJsonContent.content.questiondata[0].correctanswer = $('.edit-answer-val').val();
        recreateJSON();
    }

    function recreateJSON(){
        var activityBodyObjectRef = $(__constants.DOM_SEL_ACTIVITY_BODY).attr(__constants.ADAPTOR_INSTANCE_IDENTIFIER); 
        var updatedJSON = jQuery.extend(true, {}, originalContent);
        updatedJSON.content.instructions[0].html = processedJsonContent.content.instructions;
        updatedJSON.responses.i1.correct = processedJsonContent.content.questiondata[0].correctanswer;
        activityAdaptor.submitEditChanges(updatedJSON, activityBodyObjectRef);
    }

	return {
		/*Engine-Shell Interface*/
		"init": init, /* Shell requests the engine intialized and render itself. */
		"getStatus": getStatus, /* Shell requests a gradebook status from engine, based on its current state. */
		"getConfig" : getConfig, /* Shell requests a engines config settings.  */
        "saveUpdatedJson" : saveUpdatedJson
	};
    };
});