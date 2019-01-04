/* global $ */

import {feedbackPresets, constantInputClass, interactionReferenceString} from './fib2editor-constants';

const buildModelandViewContent = Symbol('ModelandViewContent');
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

class Fib2Transformer {

  constructor(jsonContent) {
    this.editedJsonContent = jsonContent;
    this.interactionIds = [];
  }

  transform() {
    this[buildModelandViewContent]();
    return [this.editedJsonContent, this.interactionIds];
  }

  [buildModelandViewContent]() {
    //Process JSON for easy iteration in template
    this[parseAndUpdateJSONForRivets]();
  }

  /*
  This function creates content for the editor from the base JSON data recieved
  */
  [parseAndUpdateJSONForRivets]() {
    this.editedJsonContent.FIBSR = false;
    this.editedJsonContent.isInstructionEmpty = true;
    this.editedJsonContent.enableFeedBack = false;

    // Process JSON to initiate interactionIds and parse questionText
    this[parseQuestionTextJSONForRivets]();
    this[parseInstructionTextJSONForRivets]();
    this[parseGlobalFeedbackJSONForRivets]();

    for (let i = 0; i < this.interactionIds.length; i++) {
        let interaction = this.editedJsonContent.content.interactions[this.interactionIds[i]];
        let type = interaction.type;

        this.editedJsonContent[type] = true;
    }
  }

  [parseQuestionTextJSONForRivets]() {
    this.editedJsonContent.content.questiondata = [];

    this.editedJsonContent.content.canvas.data.questiondata.forEach((element, index) => {
      if (element.text !== '') {
        element.questionText = element.text;
        element.answerText = element.text;

        let parsedQuestionArray = $('<div>' + element['text'] + '</div>');
        let interactionsReferences = $(parsedQuestionArray).find('a[href=\'' + interactionReferenceString + '\']');

        interactionsReferences.each((id, el) => {
          let interactionId = $(el).text().trim();

          this.interactionIds.push(interactionId);

          let interactionTag = el.outerHTML;

          interactionTag = interactionTag.replace(/"/g, '\'');

          const answer = this.editedJsonContent.responses[interactionId].correct;

          const questionBlank = `
            <span class="response-blank" contenteditable="false"><span class="drag">${interactionId.substring(1)}</span><span id="${interactionId}" class="answer">Response</span></span>
          `;

          element.questionText = element.questionText.replace(interactionTag, questionBlank);

          const answerBlank = '<span class="input">' + '<input type="text" value="' + answer + '" class=" ' + interactionId + ' input-sm ' + constantInputClass.DOM_SEL_INPUT_BOX + '"/>' + '</span>';

          element.answerText = element.answerText.replace(interactionTag, answerBlank);
        });
        this.editedJsonContent.content.questiondata.push(element);
      }
    });
  }

  [parseInstructionTextJSONForRivets]() {
    this.editedJsonContent.content.instructions = this.editedJsonContent.content.instructions.map((element) => {
        let text = 'Placeholder Instruction text. Update "Me" with a valid Instruction text for this question';

        if (element.text !== '' || element.tag === 'html') {
            text = element.text || element[element['tag']];
        }
        return {
          text,
          tag: element.tag
        };
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
