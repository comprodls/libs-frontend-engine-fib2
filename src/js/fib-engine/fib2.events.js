/* global $ */

import {Constants} from './constant';
import {Fib2ResponseProcessor} from './fib2.responseProcess';

class Fib2Events {
  constructor(fib2Obj) {
    this.fib2Obj = fib2Obj;
    this.fib2UserResponse = new Fib2ResponseProcessor(fib2Obj);
  }

  /** Function to handle on input focus in*/
  handleQuestionTextOnFocus(event) {
    if (Constants.PARTIAL_SAVE_TIMER) {
      clearInterval(Constants.PARTIAL_SAVE_TIMER);
    }
    Constants.PARTIAL_SAVE_TIMER = setInterval(() => {
      let currentTarget = event.target;
      let newAnswer = currentTarget.value.replace(/^\s+|\s+$/g, '');
      let interactionId = currentTarget.attributes['id'].value;

      /* If user did not change answer don't soft save. */
      if (newAnswer === this.fib2Obj.userAnswers[interactionId]) {
        return;
      }

      /* Save new Answer back in __content. */
      this.fib2Obj.userAnswers[interactionId] = newAnswer;

      /* Soft save answers. */
      this.fib2UserResponse.savePartial();

    }, 10000);
  }

  /** Function to handle on focus out*/
  handleQuestionTextLostFocus(event) {
    /* Stop previous timer. */
    if (Constants.PARTIAL_SAVE_TIMER) {
      clearInterval(Constants.PARTIAL_SAVE_TIMER);
    }
    let currentTarget = event.currentTarget;
    let newAnswer = currentTarget.value.replace(/^\s+|\s+$/g, '');
    let interactionId = currentTarget.attributes['id'].value;

    /* If user did not change answer don't soft save. */
    if (newAnswer === this.fib2Obj.userAnswers[interactionId]) {
      return;
    }

    /* Save new Answer back in __content. */
    this.fib2Obj.userAnswers[interactionId] = newAnswer;

    /* Soft save answers. */
    this.fib2UserResponse.savePartial();
  }

  bindEvents() {
    $('.userAnswer')
      .focus((event) => {
        this.handleQuestionTextOnFocus(event, this.fib2Obj);
      })
      .blur((event) => {
        this.handleQuestionTextLostFocus(event, this.fib2Obj);
      });
  }
}

export {Fib2Events};
