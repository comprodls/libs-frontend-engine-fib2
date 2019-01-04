/* global $ */

import {constantInputClass, interactionReferenceString} from './fib2editor-constants';

const config = {
  RESIZE_MODE: 'auto', /* Possible values - "manual"/"auto". Default value is "auto". */
  RESIZE_HEIGHT: '580' /* Applicable, if RESIZE_MODE is manual. If RESIZE_HEIGHT is defined in TOC then that will override. */
};

class Fib2EditorUtils {

  constructor(jsonContent, interactionIds, activityAdaptor) {
    this.editedJsonContent = jsonContent;
    this.activityAdaptor = activityAdaptor;
    this.uniqueId = this.activityAdaptor.getId();
    this.interactionIds = interactionIds;
    this.state = {
      'hasUnsavedChanges': false
    };
  }

  questionDataEventListener(e) {
    // Get the clipboard data
    let paste = (e.clipboardData || window.clipboardData).getData('text');

    if (paste.indexOf('Response') !== 0) {

      // Prevent the default pasting event and stop bubbling
      e.preventDefault();
      e.stopPropagation();

      const selection = window.getSelection();

      // Cancel the paste operation if the cursor or highlighted area isn't found
      if (!selection.rangeCount) return false;

      let interactionId = this.getInteractionId();
      let questionBlank = document.createElement('span');

      questionBlank.setAttribute('class', 'response-blank');
      questionBlank.setAttribute('contenteditable', 'false');

      let dragNode = document.createElement('span');
      let newNode = document.createElement('span');

      dragNode.setAttribute('class', 'drag');
      dragNode.textContent = interactionId.substr(1);

      newNode.setAttribute('id', interactionId);
      newNode.setAttribute('class', 'answer');
      newNode.textContent = 'Response';

      questionBlank.appendChild(dragNode);
      questionBlank.appendChild(newNode);
      selection.getRangeAt(0).insertNode(questionBlank);
      return true;
    }
    return false;
  }

  /* Function to get next interaction id and create the corresponding response node. */
  getInteractionId() {
    let id = 'i' + (this.interactionIds.length + 1);

    this.interactionIds.push(id);
    this.editedJsonContent.responses[id] = {correct: ''};
    return id;
  }

  /* Event listener to input box - update the correct response corresponding to the input entered */
  userAnswerInputEventListener(e) {
    const answer = e.currentTarget.value;
    const interactionId = e.currentTarget.classList[0];

    this.editedJsonContent.responses[interactionId].correct = answer;
  }

  /* Transform the processedJSON to originally received form so that the platform
  * can use it to repaint the updated json.
  */
  transformJSONtoOriginalForm() {

    let JSONContent = $.extend(true, {}, this.editedJsonContent);
    let finalJSONContent = {};

    finalJSONContent.meta = JSONContent.meta;
    finalJSONContent.content = JSONContent.content;
    finalJSONContent.content.interactions = {};
    finalJSONContent.content.canvas.data.questiondata = [];
    finalJSONContent.responses = {};
    finalJSONContent['learning-objectives'] = JSONContent['learning-objectives'];
    finalJSONContent['tags'] = JSONContent['tags'];
    finalJSONContent.feedback = {
      global: {}
    };

    let splitCharacterPosStart;
    let splitCharacterPosEnd;
    const prefix = new RegExp('<span class=(\'|")input(\'|")><input');
    const suffix = '</span>';

    finalJSONContent.content.instructions = finalJSONContent.content.instructions.map((el) => {
      if (el.tag === 'html') {
        el[el.tag] = el.text;
      }
      return el;
    });

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
          let interactionTag = `<a href='${interactionReferenceString}'>${interactionId}</a>`;

          question = question.replace(questionBlank, interactionTag);
          finalJSONContent.content.interactions[interactionId] = {type: 'FIBSR'};

          finalJSONContent.responses[interactionId] = {
            correct: this.editedJsonContent.responses[interactionId].correct,
            ignorecase: this.editedJsonContent.responses[interactionId].ignorecase || false,
            ignorewhitespace: this.editedJsonContent.responses[interactionId].ignorewhitespace || false
          };

        }

      }
      finalJSONContent.content.canvas.data.questiondata.push({text: question});
    });

    JSONContent.feedback.global.forEach((el) => {
      const key = el.customAttribs.key;

      finalJSONContent.feedback.global[key] = el.customAttribs.value;
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
    this.handleItemChangedInEditor();
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
    this.handleItemChangedInEditor();
  }

  /** Handles the add question button click from the editor */
  addQuestion() {
    const interactionId = this.getInteractionId();

    const questionBlank = `
      <span class="response-blank" contenteditable="false"><span class="drag">${interactionId.substring(1)}</span><span id="${interactionId}" class="answer">Response</span></span>
    `;
    const questionText = 'Placeholder question text. update "Me" with a valid' + questionBlank + 'text for this question';

    const answerBlank = '<span class="input">' + '<input type="text" value="answer" class="' + interactionId + ' input-sm ' + constantInputClass.DOM_SEL_INPUT_BOX + '"/>' + '</span>';
    const answerText = 'Placeholder question text. update "Me" with a valid' + answerBlank + 'text for this question';

    this.editedJsonContent.content.questiondata.push({
      questionText,
      answerText
    });

    this.state.hasUnsavedChanges = true;
    this.handleItemChangedInEditor();
  }

  /* Handles the remove question item text from the editor */
  removeQuestion(event, question, index) {
    if (this.editedJsonContent.content.questiondata.length === 1) {
      this.editedJsonContent.content.questiondata[0].alert = 'Minimum one question required';
      return;
    }
    this.editedJsonContent.content.questiondata.splice(index, 1);

    this.state.hasUnsavedChanges = true;
    this.handleItemChangedInEditor();
  }

  updateAnswerTextJSON() {
    this.editedJsonContent.content.questiondata.forEach((el, index) => {
      let splitCharacterPosStart, splitCharacterPosEnd;
      let numOfInteractions = 0;
      const prefix = new RegExp('<span class=(\'|")response-blank(\'|") contenteditable=(\'|")false(\'|")>');
      const suffix = '</span></span>';

      el.answerText = el.questionText;
      el.alert = '';

      while (true) {
        splitCharacterPosStart = el.answerText.search(prefix);
        splitCharacterPosEnd = el.answerText.indexOf(suffix);
        if (splitCharacterPosStart === -1) {
          break;
        } else {

          numOfInteractions += 1;

          let questionBlank = el.answerText.slice(splitCharacterPosStart, splitCharacterPosEnd + suffix.length);
          let span = $.parseHTML(questionBlank);

          let interactionId = 'i' + ($.parseHTML(span[0].innerHTML))[0].innerHTML;
          let answer = (this.editedJsonContent.responses[interactionId]) ? this.editedJsonContent.responses[interactionId].correct : '';

          if (answer === undefined) {
            answer = '';
          }
          const answerBlank = '<span class="input">' + '<input type="text" value="' + answer + '" class="' + interactionId + ' input-sm ' + constantInputClass.DOM_SEL_INPUT_BOX + '"/>' + '</span>';

          el.answerText = el.answerText.replace(questionBlank, answerBlank);
        }
      }

      if (numOfInteractions === 0) {
        el.alert = 'Minimum one blank required';
      }
    });

    this.state.hasUnsavedChanges = true;
  }

  handleItemChangedInEditor() {
    this.activityAdaptor.autoResizeActivityIframe();
    this.activityAdaptor.itemChangedInEditor(this.transformJSONtoOriginalForm(), this.uniqueId);
  }

  validateEditedJsonContent() {
    /*
    *  Minimum one question required
    */
    if (this.editedJsonContent.content.questiondata.length !== 0) {
      /*
      *  Minimum one blank required in each question
      */
      return this.editedJsonContent.content.questiondata.every((el) => {
        let splitCharacterPosStart, splitCharacterPosEnd;
        let isAtLeastOneInteractionExist = false;
        const prefix = new RegExp('<span class=(\'|")response-blank(\'|") contenteditable=(\'|")false(\'|")>');
        const suffix = '</span></span>';

        splitCharacterPosStart = el.questionText.search(prefix);
        splitCharacterPosEnd = el.questionText.indexOf(suffix);
        if (splitCharacterPosStart !== -1 && splitCharacterPosEnd !== -1 && splitCharacterPosEnd > splitCharacterPosStart) {
          isAtLeastOneInteractionExist = true;
        }

        return isAtLeastOneInteractionExist;
      });
    }

    return false;
  }

  saveItemInEditor() {
    if (this.validateEditedJsonContent()) {
      this.activityAdaptor.submitEditChanges(this.transformJSONtoOriginalForm(), this.uniqueId);
    } else {
      // Validation Failed
    }
  }

  getConfig() {
    return config;
  }

  getStatus() {
    return this.state.hasUnsavedChanges;
  }
}

export default Fib2EditorUtils;
