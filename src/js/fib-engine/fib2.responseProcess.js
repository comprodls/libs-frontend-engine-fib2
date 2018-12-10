/* global $ */

import generateStatement from '../utils';
import {Constants} from './constant';
import {Config} from './config';

const getAnswersJSON = Symbol('getAnswersJSON');
const getFibsrAnswersJSON = Symbol('getFibsrAnswersJSON');
const markInput = Symbol('markInput');
// const buildFeedbackResponse = Symbol('buildFeedbackResponse');

const __state = {
  currentTries: 0, /* Current try of sending results to platform */
  activityPartiallySubmitted: false, /* State whether activity has been partially submitted. Possible Values: true/false(Boolean) */
  activitySubmitted: false /* State whether activity has been submitted. Possible Values: true/false(Boolean) */
};

class Fib2ResponseProcessor {
  constructor(fib2Obj) {
    this.fib2Obj = fib2Obj;
  }

  /**
   * Function called to send result JSON to adaptor (partial save OR submit).
   */
  saveResults(bSubmit) {
    /*Getting answer in JSON format*/
    const answerJSONs = this[getAnswersJSON](false);
    const uniqueId = this.fib2Obj.adaptor.getId();

    /* Disabling entry(input) boxes on click of Submit. */
    $('.userAnswer').attr('disabled', true);
    $('label.input').addClass('state-disabled');

    answerJSONs.forEach((answerJSON, idx) => {
      /* User clicked the Submit button*/
      if (bSubmit === true) {
        answerJSON.statusProgress = 'attempted';
        /*Send Results to platform*/
        this.fib2Obj.adaptor.submitResults(answerJSON, uniqueId, (data, status) => {
          if (status === Constants.STATUS_NOERROR) {
            __state.activitySubmitted = true;
            /*Close platform's session*/
            this.fib2Obj.adaptor.closeActivity();
            __state.currentTries = 0;
          } else {
            /* There was an error during platform communication, so try again (till MAX_RETRIES) */
            if (__state.currentTries < Config.MAX_RETRIES) {
              __state.currentTries++;
              this.saveResults(bSubmit);
            }
          }
        });
      }
    });
  }

  savePartial(interactionId) {
    /*Getting answer in JSON format*/
    const answerJSONs = this[getAnswersJSON](false);
    const uniqueId = this.fib2Obj.adaptor.getId();

    this.fib2Obj.adaptor.sendStatement(uniqueId, generateStatement(Constants.STATEMENT_INTERACTED));

    answerJSONs.forEach((answerJSON, idx) => {
      this.fib2Obj.adaptor.savePartialResults(answerJSON, uniqueId, function (data, status) {
        if (status === Constants.STATUS_NOERROR) {
          __state.activityPariallySubmitted = true;
        } else {
          // There was an error during platform communication, do nothing for partial saves
        }
      });
    });
  }

  /**
   *  Function used to create JSON from user Answers for submit(soft/hard).
   *  Called by :-
   *   1. saveResult or savePartial (internal).
   *   2. Multi-item-handler (external).
   *   3. Divide the maximum marks among interaction.
   *   4. Returns result objects.  [{ id: interactionId,  answer: answer,   score: score, maxscore: maximumScore }]
   */
  [getAnswersJSON](skipQuestion, interactionId) {
    let response = [];
    let fibsrAns;

    fibsrAns = this[getFibsrAnswersJSON]();
    response.push(fibsrAns);

    return response;
  }

  [getFibsrAnswersJSON]() {
    const maxScore = this.fib2Obj.jsonContent.meta.score.max;
    const perInteractionScore = maxScore / this.fib2Obj.fib2Model.interactionIds.length;
    let resultArray = [];
    let statusEvaluation = 'empty';
    let isUserAnswerCorrect = false;
    let countCorrectInteractionAttempt = 0;

    this.fib2Obj.fib2Model.interactionIds.forEach((id, index) => {
      let score = 0;

      if (this.fib2Obj.userAnswers.hasOwnProperty(id)) {
        if (this.fib2Obj.userAnswers[id].length === this.fib2Obj.fib2Model.responses[id]['correct'].length) {
          if (this.fib2Obj.userAnswers[id] === this.fib2Obj.fib2Model.responses[id]['correct']) {
            score = perInteractionScore;
          }
          countCorrectInteractionAttempt++;
          isUserAnswerCorrect = true;
        }
      }
      resultArray.push({
        id,
        score,
        answer: this.fib2Obj.userAnswers[id] || '',
        maxScore: perInteractionScore
      });
    });

    if (isUserAnswerCorrect) {
      statusEvaluation = 'correct';
    } else if (countCorrectInteractionAttempt === 0) {
      statusEvaluation = 'incorrect';
    } else {
      statusEvaluation = 'partially_correct';
    }
    return {
      response: {
        'interactions': resultArray,
        'statusEvaluation': statusEvaluation
      }
    };
  }

  static getState() {
    return __state;
  }

  static resetView() {

    $('label.question')
      .removeClass('state-disabled');

    $('.userAnswer').each(function () {
      $(this).val('')
        .removeClass('wrongAnswer correctAnswer')
        .attr('disabled', false);
    });

    $('[id^="answer"]')
      .removeClass('correct wrong')
      .addClass('invisible')
      .next('label')
      .removeClass('state-success state-error');

    $('.grade').remove();
  }

  markAnswers() {
    this[markInput]();
    this.fib2Obj.adaptor.autoResizeActivityIframe();
  }

  [markInput]() {
    const questions = this.fib2Obj.fib2Model.questionData;

    questions.forEach((question, index) => {
      let isQuestionCorrect = true;

      question.interactions.forEach((interactionId) => {
        let userAnswer = this.fib2Obj.userAnswers[interactionId];
        let correctAnswer = this.fib2Obj.fib2Model.responses[interactionId].correct;

        if (userAnswer !== correctAnswer) {
          isQuestionCorrect = false;
          $('#' + interactionId)
            .addClass('wrongAnswer')
            .removeClass('correctAnswer')
            .attr('disabled', true)
            .parent()
            .after(`<span class="grade" style="color:green;font-weight: bold"> (${correctAnswer})</span>`);
        } else {
          $('#' + interactionId)
            .addClass('correctAnswer')
            .removeClass('wrongAnswer')
            .attr('disabled', true);
        }
      });

      if (isQuestionCorrect) {
        $('#answer' + index).next('label').addClass('state-success');
        $('#answer' + index)
          .addClass('correct')
          .removeClass('wrong')
          .removeClass('invisible');
      } else {
        $('#answer' + index).next('label').addClass('state-error');
        $('#answer' + index)
          .addClass('wrong')
          .removeClass('correct')
          .removeClass('invisible');
      }
    });
  }
}

export {Fib2ResponseProcessor};
