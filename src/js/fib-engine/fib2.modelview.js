/* global $ */

import {Constants} from './constant';

import rivets from 'rivets';
import '../../scss/index.scss';

const initializeRivets = Symbol('initializeRivets');

class Fib2ModelAndView {
  constructor(fib2Model) {
    this.model = fib2Model;
  }

  get template() {
    return Constants.TEMPLATES.FIB2;
  }

  get themes() {
    return Constants.THEMES;
  }

  /**
   * Function to clear grades and reset feedback state
   */
  clearGrades() {
    this.model.feedbackState = {
      'correct': false,
      'partiallyCorrect': false,
      'incorrect': false,
      'partiallyIncorrect': false,
      'empty': false
    };
  }

  /**
   * Function to bind data with rivets
   */
  bindData() {
    const data = this[initializeRivets]();

    /*Bind the data to template using rivets*/
    rivets.bind($('#fib2-engine'), data);
  }

  /**
   * Function to initialize rivets
   */
  [initializeRivets]() {
    rivets.binders['text-parse'] = function (el, value) {
      let innerHtml = $(`<div>${value}</div>`)[0].innerHTML;

      $(el).html(innerHtml);
    };

    rivets.binders['answer-id'] = function (el, value) {
      el.id = 'answer' + value;
    };

    return {
      content: this.model
    };
  }
}

export {Fib2ModelAndView};
