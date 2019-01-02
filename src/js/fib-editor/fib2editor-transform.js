/* global $ */

import {feedbackPresets, constantInputClass, interactionReferenceString} from './fib2editor-constants';

const buildModelandViewContent = Symbol('ModelandViewContent');
const parseAndUpdateJSONForInteractions = Symbol('parseAndUpdateJSONForInteractions');
const parseAndUpdateJSONForRivets = Symbol('parseAndUpdateJSONForRivets');
const parseQuestionTextJSONForRivets = Symbol('parseQuestionTextJSONForRivets');
const parseInstructionTextJSONForRivets = Symbol('parseInstructionTextJSONForRivets');
const parseGlobalFeedbackJSONForRivets = Symbol('parseGlobalFeedbackJSONForRivets');
const icon = {
  correct: 'thumbs-o-up',
  incorrect: 'thumbs-o-down',
  partiallyIncorrect: 'thumbs-o-down',
  partiallyCorrect: 'thumbs-o-up',
  empty: 'hand-o-right',
  generic: 'hand-o-right'
};
const splitCharacter = '___';

class Fib2Transformer {

  constructor(jsonContent, params) {
    this.editedJsonContent = jsonContent;
    this.params = params;
    this.parsedQuestionArray = [];
    this.interactionIds = [];
    this.finalJSONContent = {};
  }

  transform() {
    this[buildModelandViewContent]();
    return [this.editedJsonContent, this.interactionIds];
  }

  [buildModelandViewContent]() {

    // Process JSON to remove interaction tags and initiate __interactionIds
    this[parseAndUpdateJSONForInteractions]();

    //Process JSON for easy iteration in template
    this[parseAndUpdateJSONForRivets]();
  }

  [parseAndUpdateJSONForInteractions]() {
    let interactionTag;

    for (let i = 0; i < this.editedJsonContent.content.canvas.data.questiondata.length; i++) {
      this.parsedQuestionArray = $.parseHTML(this.editedJsonContent.content.canvas.data.questiondata[i].text);

      $.each(this.parsedQuestionArray, (index, el) => {
        if (el.href === interactionReferenceString) {
          this.interactionIds.push(el.childNodes[0].nodeValue.trim());
          interactionTag = el.outerHTML;
          interactionTag = interactionTag.replace(/"/g, '\'');
          this.editedJsonContent.content.canvas.data.questiondata[i].text = this.editedJsonContent.content.canvas.data.questiondata[i].text.replace(interactionTag, splitCharacter);
        }
      });
    }
  }

  /*
  This function creates content for the editor from the base JSON data recieved
  */
  [parseAndUpdateJSONForRivets]() {
    this.editedJsonContent.FIBSR = false;
    this.editedJsonContent.isInstructionEmpty = true;
    this.editedJsonContent.enableFeedBack = false;

    for (let i = 0; i < this.interactionIds.length; i++) {
      let interaction = this.editedJsonContent.content.interactions[this.interactionIds[i]];
      let type = interaction.type;

      this.editedJsonContent[type] = true;
    }

    this[parseQuestionTextJSONForRivets]();
    this[parseInstructionTextJSONForRivets]();
    this[parseGlobalFeedbackJSONForRivets]();
  }

  [parseQuestionTextJSONForRivets]() {

    let question = [];
    let k = 0;

    this.editedJsonContent.content.canvas.data.questiondata.forEach((element) => {
      let counter = 0;
      let answer = '';
      let id = '';

      if (element.text !== '') {
        /* Count no of blanks in a question */
        let interactionId = this.interactionIds[k];

        element.text.replace(/(__)/g, function (a) {
          counter++;
        });

        /**
         * If there are more than one blank in single question then add type "multianswer_question"
         * and join answer and interaction id of each blank separated by comma.
         */
        if (counter > 1) {
          for (let i = 0; i < counter; i++) {
            interactionId = this.interactionIds[k++];
            answer = answer + this.editedJsonContent.responses[interactionId].correct + ',';
            id = id + interactionId + ',';
          }
          answer = answer.substring(0, answer.length - 1);
          id = id.substring(0, id.length - 1);
          question.push({
            'text': element.text,
            'correctanswer': answer,
            'type': 'multianswer_question',
            'interactionId': id
          });
        } else {
          k++;
          question.push({
            'text': element.text,
            'correctanswer': this.editedJsonContent.responses[interactionId].correct,
            'interactionId': interactionId
          });
        }

      } else {
        element.text = 'Placeholder Question text. Update "Me" with a valid Question text';
      }

    });

    question.forEach((el, index) => {
      let splitCharacterPos;
      let blankPrefix = '<span class="input">';
      let blankSuffix = '</span>';

      el.questionText = el.text;
      el.answerText = el.text;

      let i = 0;

      while (true) {
        splitCharacterPos = el.questionText.indexOf(splitCharacter);

        if (splitCharacterPos === -1) {
          break;
        } else {
          let interactionId = el.interactionId;
          let answer = el.correctanswer;

          if (el.type === 'multianswer_question') {
            /* In multianswer question split interaction id and correctanswer and then map them with their corresponding interaction */
            interactionId = el.interactionId.split(',');
            answer = el.correctanswer.split(',');
            answer = answer[i];
            interactionId = interactionId[i++];
          }

          const questionBlank = `
            <span class="response-blank" contenteditable="false"><span class="drag">${interactionId.substring(1)}</span><span id="${interactionId}" class="answer">Response</span></span>
          `;

          el.questionText = el.questionText.replace(splitCharacter, questionBlank);

          let answerBlank = blankPrefix + '<input type="text" value="' + answer + '" class=" ' + interactionId + ' input-sm ' + constantInputClass.DOM_SEL_INPUT_BOX + '"/>' + blankSuffix;

          el.answerText = el.answerText.replace(splitCharacter, answerBlank);
        }
      }
    });

    this.editedJsonContent.content.questiondata = question;
  }

  [parseInstructionTextJSONForRivets]() {
    this.editedJsonContent.content.instructions.forEach((element) => {
      if (element.text === '' || element.tag === '') {
        element.text = 'Placeholder Instruction text. Update "Me" with a valid Instruction text for this question';
      }
    });

    this.editedJsonContent.isInstructionEmpty = this.editedJsonContent.content.instructions.length <= 0;
  }

  [parseGlobalFeedbackJSONForRivets]() {
    if (this.editedJsonContent.feedback.global === undefined) {
      this.editedJsonContent.feedback.global = [];
      return;
    }
    const tempObj = this.editedJsonContent.feedback.global;
    let tempArr = [];

    if (tempObj && Object.keys(tempObj).length > 0) {
      Object.keys(tempObj).forEach(function (key, index) {
        let processedObj = {};

        processedObj.customAttribs = {};
        processedObj.customAttribs.key = key;
        processedObj.customAttribs.value = tempObj[key];
        processedObj.customAttribs.index = index;
        if (key === 'correct') {
          processedObj.customAttribs.order = 1;
          feedbackPresets[0].showDropdown = false;
        } else if (key === 'incorrect') {
          processedObj.customAttribs.order = 4;
          feedbackPresets[1].showDropdown = false;
        } else if (key === 'partiallyCorrect') {
          processedObj.customAttribs.order = 2;
          feedbackPresets[2].showDropdown = false;
        } else if (key === 'partiallyIncorrect') {
          processedObj.customAttribs.order = 3;
          feedbackPresets[3].showDropdown = false;
        } else if (key === 'empty') {
          processedObj.customAttribs.order = 5;
          feedbackPresets[4].showDropdown = false;
        } else {
          processedObj.customAttribs.order = 100;
        }
        processedObj.customAttribs.icon = icon[key];
        tempArr.push(processedObj);
      });
      tempArr.sort(function (a, b) {
        return a.customAttribs.order - b.customAttribs.order;
      });
      this.editedJsonContent.feedback.global = tempArr;
      this.editedJsonContent.enableFeedBack = true;
    }
  }
}

export default Fib2Transformer;
