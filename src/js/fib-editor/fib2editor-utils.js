/* global $ */

import {constantInputClass, interactionReferenceString} from './fib2editor-constants';

const config = {
    RESIZE_MODE: 'auto', /* Possible values - "manual"/"auto". Default value is "auto". */
    RESIZE_HEIGHT: '580' /* Applicable, if RESIZE_MODE is manual. If RESIZE_HEIGHT is defined in TOC then that will override. */
};

class Fib2EditorUtils {

    constructor(jsonContent, interactionIds, activityAdaptor) {
        this.uniqueId;
        this.editedJsonContent = jsonContent;
        this.activityAdaptor = activityAdaptor;
        this.interactionIds = interactionIds;
        this.state = {
            'hasUnsavedChanges': false
        };
    }

    /* Function to get next interaction id and create the corresponding response node. */
    getInteractionId() {
        let id = 'i' + (this.interactionIds.length + 1);

        this.interactionIds.push(id);
        this.editedJsonContent.responses[id] = {correct: ''};
        return id;
    }

    /* Function to add event listner to input box - update the correct response corresponding to the input entered */
    addInputEventListner() {
        let answerContainer = $('.userAnswer');

        for (let i = 0 ; i < answerContainer.length ; i++) {
            answerContainer[i].addEventListener('blur', (e) => {
                let answer = e.currentTarget.value;
                let interactionId = e.currentTarget.classList[0];

                this.editedJsonContent.responses[interactionId].correct = answer;
            });
        }
    }

    /* Transform the processedJSON to originally received form so that the platform
    * can use it to repaint the updated json.
    */
    transformJSONtoOriginialForm() {

        let JSONContent = $.extend(true, {}, this.editedJsonContent);
        let finalJSONContent = {};

        finalJSONContent.meta = JSONContent.meta;
        finalJSONContent.content = JSONContent.content;
        finalJSONContent.content.interactions = {};
        finalJSONContent.content.canvas.data.questiondata = [];
        finalJSONContent.responses = {};

        //TODO
        finalJSONContent.feedback = JSONContent.feedback;

        let splitCharacterPosStart = 0, splitCharacterPosEnd = 0;
        let prefix = new RegExp("<span class=(\'|\")input(\'|\")><input");
        let suffix = '</span>';

        let i = 1;

        finalJSONContent.content.questiondata.forEach((el, index) => {
            let question = (el.answerText).trim();

            while (true) {
                splitCharacterPosStart = question.search(prefix);
                splitCharacterPosEnd = question.indexOf(suffix);
                if (splitCharacterPosStart === -1) {
                    break;
                } else {
                    let questionBlank = question.slice(splitCharacterPosStart, splitCharacterPosEnd + suffix.length);
                    let interactionId = 'i' + i++;
                    let interactionTag = '<a href="' + interactionReferenceString + '">' + interactionId + '</a>';

                    question = question.replace(questionBlank, interactionTag);
                    finalJSONContent.content.interactions[interactionId] = {type: 'FIBSR'};

                    let span = $.parseHTML(questionBlank);
                    let answer = ($.parseHTML(span[0].innerHTML))[0].value;

                    finalJSONContent.responses[interactionId] = {correct: answer};

                }

            }
            finalJSONContent.content.canvas.data.questiondata.push({text: question});
        });

        delete finalJSONContent.content.questiondata;

        return finalJSONContent;
    }

    /** Handles the add Instruction button click from the editor */
    addInstruction() {
        this.editedJsonContent.content.instructions.push({
            'tag': 'text',
            'text': 'Placeholder Instruction text. Update "Me" with a valid Instruction text for this question'
        });
        this.editedJsonContent.isInstructionEmpty = false;
        $('#instructionLabel').show();
        this.state.hasUnsavedChanges = true;
        this.activityAdaptor.autoResizeActivityIframe();
        this.activityAdaptor.itemChangedInEditor(this.transformJSONtoOriginialForm(), this.uniqueId);
    }

    /* Handles the remove Instruction item text from the editor */
    removeInstruction(event, instruction, index) {
        this.editedJsonContent.content.instructions.splice(index, 1);

        if (this.editedJsonContent.content.instructions.length > 0) {
            this.editedJsonContent.isInstructionEmpty = false;
            $('#instructionLabel').show();
        } else {
            this.editedJsonContent.isInstructionEmpty = true;
            $('#instructionLabel').hide();
        }

        this.state.hasUnsavedChanges = true;
        this.activityAdaptor.autoResizeActivityIframe();
        this.activityAdaptor.itemChangedInEditor(this.transformJSONtoOriginialForm(), this.uniqueId);
    }

    /** Handles the add question button click from the editor */
    addQuestion() {
        let blankPrefix = '<span class="input">';
        let blankSuffix = '</span>';
        let interactionId = this.getInteractionId();

        let questionBlank = blankPrefix + '<span contenteditable="false" id="' + interactionId + '" class="answer input-sm">Response-' + interactionId + '</span>' + blankSuffix;
        let questionText = 'Placeholder Question text. Update "Me" with a valid' + questionBlank + 'text for this question';

        let answerBlank = blankPrefix + '<input type="text" value="answer" class="' + interactionId + ' input-sm ' + constantInputClass.DOM_SEL_INPUT_BOX + '"/>' + blankSuffix;
        let answerText = 'Placeholder Question text. Update "Me" with a valid' + answerBlank + 'text for this question';

        this.editedJsonContent.content.questiondata.push({
            questionText: questionText,
            answerText: answerText,
            'correctanswer': '',
            'interactionId': interactionId
        });

        this.state.hasUnsavedChanges = true;
        this.activityAdaptor.autoResizeActivityIframe();
        this.activityAdaptor.itemChangedInEditor(this.transformJSONtoOriginialForm(), this.uniqueId);
    }

    /* Handles the remove question item text from the editor */
    removeQuestion(event, question, index) {
        if (this.editedJsonContent.content.questiondata.length === 1) {
            alert('Minimum one question required.');
            return;
        }
        this.editedJsonContent.content.questiondata.splice(index, 1);

        this.state.hasUnsavedChanges = true;
        this.activityAdaptor.autoResizeActivityIframe();
        this.activityAdaptor.itemChangedInEditor(this.transformJSONtoOriginialForm(), this.uniqueId);
    }

    updateAnswerTextJSON() {

        this.editedJsonContent.content.questiondata.forEach((el, index) => {
            let splitCharacterPosStart = 0, splitCharacterPosEnd = 0;
            let blankPrefix = '<span class="input">';
            let blankSuffix = '</span>';

            let prefix = new RegExp("<span class=(\'|\")input(\'|\")><span");
            let suffix = '</span></span>';

            el.answerText = el.questionText;

            while (true) {
                splitCharacterPosStart = el.answerText.search(prefix);
                splitCharacterPosEnd = el.answerText.indexOf(suffix);
                if (splitCharacterPosStart === -1) {
                    break;
                } else {

                    let questionBlank = el.answerText.slice(splitCharacterPosStart, splitCharacterPosEnd + suffix.length);

                    let span = $.parseHTML(questionBlank);
                    let interactionId = ($.parseHTML(span[0].innerHTML))[0].id;
                    let answer = (this.editedJsonContent.responses[interactionId]) ? this.editedJsonContent.responses[interactionId].correct : '';

                    if (answer === undefined) {
                        answer = '';
                    }
                    let answerBlank = blankPrefix + '<input type="text" value="' + answer + '" class="' + interactionId + ' input-sm ' + constantInputClass.DOM_SEL_INPUT_BOX + '"/>' + blankSuffix;

                    el.answerText = el.answerText.replace(questionBlank, answerBlank);
                }
            }

        });

        this.addInputEventListner();
        this.state.hasUnsavedChanges = true;
    }

    handleItemChangedInEditor() {
        this.activityAdaptor.itemChangedInEditor(this.transformJSONtoOriginialForm(), this.uniqueId);
    }

    saveItemInEditor() {
        this.activityAdaptor.submitEditChanges(this.transformJSONtoOriginialForm(), this.uniqueId);
    }

    getConfig() {
        return config;
    }

    getStatus() {
        return this.state.hasUnsavedChanges;
    }

}

export default Fib2EditorUtils;
