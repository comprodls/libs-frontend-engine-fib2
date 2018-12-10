/* global $ */

import {Constants} from './constant';

const buildModelandViewContent = Symbol('ModelandViewContent');
const setTheme = Symbol('engine-theme');
const setInteractions = Symbol('setInteractions');
const setStimuli = Symbol('setStimuli');
const setInstructions = Symbol('setInstructions');
const setFeedback = Symbol('setFeedback');
const setScoring = Symbol('setScoring');
const setResponses = Symbol('setResponses');

const INTERACTION_REFERENCE_STR = Constants.INTERACTION_REFERENCE_STR;

class FIB2Transformer {
  constructor(entity, params, themeObj) {
    this.entity = entity;
    this.themeObj = themeObj;
    this.fib2Model = {
      instructions: [],
      questionData: [],
      stimuli: [],
      scoring: {},
      feedback: {},
      feedbackState: {
        'correct': false,
        'incorrect': false,
        'empty': false
      },
      responses: {},
      type: '',
      theme: '',
      interactionIds: []
    };
  }

  transform() {
    this[buildModelandViewContent]();
    return this.fib2Model;
  }

  [buildModelandViewContent]() {
    this[setTheme](this.themeObj);
    this[setInteractions]();
    this[setStimuli]();
    this[setInstructions]();
    this[setFeedback]();
    this[setScoring]();
    this[setResponses]();
  }

  [setTheme](themeKey) {
    this.fib2Model.theme = Constants.THEMES[themeKey];
  }

  [setInstructions]() {
    this.fib2Model.instructions = this.entity.content.instructions.map(function (element) {
      return {
        text: element[element['tag']]
      };
    });
  }

  [setInteractions]() {
    let entity = this.entity;
    let _self = this;

    this.fib2Model.questionData = entity.content.canvas.data.questiondata.map((element, index) => {
      let obj = {};
      let parsedQuestionArray = $('<div>' + element['text'] + '</div>');
      let interactionsReferences = $(parsedQuestionArray).find('a[href=\'' + INTERACTION_REFERENCE_STR + '\']');

      obj.interactions = [];
      obj.types = [];
      obj.numberOfInteractions = 0;
      interactionsReferences.each(function (idx) {
        let currinteractionid = $(this).text().trim();
        let newchild = $(`<span  class='input answer'><input type='text' id='${currinteractionid}' class='userAnswer'/></span>`)[0];

        $(this).replaceWith(newchild);
        obj.interactions.push(currinteractionid);
        obj.numberOfInteractions += 1;
        obj.types.push(entity.content.interactions[currinteractionid]);
        _self.fib2Model.interactionIds.push(currinteractionid);
      });

      obj.questionText = parsedQuestionArray[0].innerHTML;
      return obj;
    });
  }

  [setResponses]() {
    this.fib2Model.responses = this.entity.responses;
  }

  [setStimuli]() {
    this.fib2Model.stimuli = this.entity.content.stimulus.map(function (element) {
      let tagtype = element['tag'];
      let obj;

      if (tagtype) {
        obj = {'src': element[tagtype]};
        obj[tagtype] = true;
      }
      if (!obj) {
        obj = element;
      }
      return obj;
    });
  }

  [setFeedback]() {
    this.fib2Model.feedback = this.entity.feedback;
  }

  [setScoring]() {
    this.fib2Model.scoring = this.entity.meta.score;
  }
}

export {FIB2Transformer};
