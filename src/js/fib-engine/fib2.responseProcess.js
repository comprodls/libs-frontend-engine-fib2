/* global $ */

import generateStatement from '../utils';
import {Constants} from './constant';

const getAnswersJSON = Symbol('getAnswersJSON');
const getFibsrAnswersJSON = Symbol('getFibsrAnswersJSON');
const getUserAnswersStats = Symbol('getUserAnswersStats');
const markInput = Symbol('markInput');
const buildFeedbackResponse = Symbol('buildFeedbackResponse');

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
   * Function called to send result JSON to adaptor (On Submit).
   */
  saveResults() {
    /*Getting answer in JSON format*/
    const answerJSONs = this[getAnswersJSON](false);
    const uniqueId = this.fib2Obj.adaptor.getId();

    /* Disabling entry(input) boxes on click of Submit. */
    $('.userAnswer').attr('disabled', true);
    $('label.input').addClass('state-disabled');

    answerJSONs.forEach((answerJSON, idx) => {
      /* User clicked the Submit button*/
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
          if (__state.currentTries < Constants.MAX_RETRIES) {
            __state.currentTries++;
            this.saveResults();
          }
        }
      });
    });
  }

  /**
   * Function called to send result JSON to adaptor (Partial Save ).
   */
  savePartial() {
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
  [getAnswersJSON](skipQuestion) {
    let response = [];
    let fibsrAns;

    fibsrAns = this[getFibsrAnswersJSON]();
    response.push(fibsrAns);

    return response;
  }

  [getFibsrAnswersJSON]() {
    const maxScore = this.fib2Obj.jsonContent.meta.score.max;
    const perInteractionScore = maxScore / this.fib2Obj.fib2Model.interactionIds.length;
    const stats = this[getUserAnswersStats]();
    let resultArray = [];
    let feedback;
    let statusEvaluation;

    this.fib2Obj.fib2Model.interactionIds.forEach((interactionId) => {
      let score = (stats.userAnswersResult[interactionId] ? perInteractionScore : 0);

      resultArray.push({
        interactionId,
        score,
        answer: this.fib2Obj.userAnswers[interactionId] || '',
        maxScore: perInteractionScore
      });
    });

    if (stats.isAllInteractionsEmpty) {
      statusEvaluation = 'empty';
      feedback = this[buildFeedbackResponse]('global.empty', statusEvaluation, this.fib2Obj.fib2Model.feedback.global.empty);
    } else if (stats.totalQuestions === stats.countCorrectQuestionAttempt && stats.totalInteractions === stats.countCorrectInteractionsAttempt) {
      statusEvaluation = 'correct';
      feedback = this[buildFeedbackResponse]('global.correct', statusEvaluation, this.fib2Obj.fib2Model.feedback.global.correct);
    } else if (stats.countCorrectQuestionAttempt >= (Math.floor(stats.totalQuestions / 2))) {
      statusEvaluation = 'partially_correct';
      feedback = this[buildFeedbackResponse]('global.partiallyCorrect', statusEvaluation, this.fib2Obj.fib2Model.feedback.global.partiallyCorrect);
    } else if (stats.countIncorrectQuestionAttempt >= (Math.floor(stats.totalQuestions / 2))) {
      statusEvaluation = 'partially_incorrect';
      feedback = this[buildFeedbackResponse]('global.partiallyIncorrect', statusEvaluation, this.fib2Obj.fib2Model.feedback.global.partiallyIncorrect);
    } else if (stats.countCorrectQuestionAttempt === 0) {
      statusEvaluation = 'incorrect';
      feedback = this[buildFeedbackResponse]('global.incorrect', statusEvaluation, this.fib2Obj.fib2Model.feedback.global.incorrect);
    }

    return {
      response: {
        'interactions': resultArray,
        statusEvaluation,
        feedback
      }
    };
  }

  /**
   *  Function used to create User Answers stats.
   */
  [getUserAnswersStats]() {
    const questions = this.fib2Obj.fib2Model.questionData;
    const totalInteractions = this.fib2Obj.fib2Model.interactionIds.length;
    const totalQuestions = this.fib2Obj.fib2Model.questionData.length;
    const userAnswersResult = {};
    let countCorrectQuestionAttempt = 0;
    let countIncorrectQuestionAttempt = 0;
    let countCorrectInteractionsAttempt = 0;
    let countIncorrectInteractionsAttempt = 0;
    let isAllInteractionsEmpty = true;

    questions.forEach((question, index) => {
      let isQuestionCorrect = true;

      question.interactions.forEach((interactionId) => {
        let correctAnswer = this.fib2Obj.fib2Model.responses[interactionId].correct;
        let userAnswer = this.fib2Obj.userAnswers[interactionId];

        userAnswersResult[interactionId] = {
          correct: false
        };

        if (this.fib2Obj.fib2Model.responses[interactionId].ignorecase) {
          correctAnswer = correctAnswer.toLowerCase();
          userAnswer = correctAnswer.toLowerCase();
        }

        if (this.fib2Obj.fib2Model.responses[interactionId].ignorewhitespace) {
          correctAnswer = correctAnswer.replace(/ /g, '')();
          userAnswer = correctAnswer.replace(/ /g, '')();
        }

        if (userAnswer !== correctAnswer) {
          isQuestionCorrect = false;
          if (userAnswer !== undefined && userAnswer !== '') {
            isAllInteractionsEmpty = false;
          }
          countIncorrectInteractionsAttempt += 1;
        } else {
          isAllInteractionsEmpty = false;
          userAnswersResult[interactionId].correct = true;
          countCorrectInteractionsAttempt += 1;
        }
      });

      if (isQuestionCorrect) {
        countCorrectQuestionAttempt += 1;
      } else {
        countIncorrectQuestionAttempt += 1;
      }
    });

    return {
      userAnswersResult,
      totalInteractions,
      countIncorrectInteractionsAttempt,
      countCorrectInteractionsAttempt,
      totalQuestions,
      countCorrectQuestionAttempt,
      countIncorrectQuestionAttempt,
      isAllInteractionsEmpty
    };
  }

  /**
   *  Static function to get User state.
   */
  static getState() {
    return __state;
  }

  /**
   *  Static function to reset user answers.
   */
  static resetView(persistUserAnswers = false) {

    $('label.question')
      .removeClass('state-disabled');

    $('.userAnswer').each(function () {
      if (!persistUserAnswers) {
        $(this).val('');
      }
      $(this).removeClass('wrongAnswer correctAnswer')
        .attr('disabled', false);
    });

    $('[id^="answer"]')
      .removeClass('correct wrong')
      .addClass('invisible')
      .next('label')
      .removeClass('state-success state-error');

    $('.grade').remove();
  }

  /**
   *  Function to mark User answers correct or wrong.
   */
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

  [buildFeedbackResponse](id, status, content) {
    const feedback = {};

    feedback.id = id;
    feedback.status = status;
    feedback.content = content;
    return feedback;
  }

  /**
   *  Function to calculate feedback according to user Answers Stats.
   */
  feedbackProcessor() {
    const type = this.fib2Obj.fib2Model.type;
    const stats = this[getUserAnswersStats]();

    this.fib2Obj.fib2Model.feedbackState.correct = false;
    this.fib2Obj.fib2Model.feedbackState.incorrect = false;
    this.fib2Obj.fib2Model.feedbackState.partiallyCorrect = false;
    this.fib2Obj.fib2Model.feedbackState.partiallyIncorrect = false;
    this.fib2Obj.fib2Model.feedbackState.empty = false;

    if (type === 'FIBSR') {
      if (stats.isAllInteractionsEmpty) {
        this.fib2Obj.fib2Model.feedbackState.empty = true;
      } else if (stats.totalQuestions === stats.countCorrectQuestionAttempt && stats.totalInteractions === stats.countCorrectInteractionsAttempt) {
        this.fib2Obj.fib2Model.feedbackState.correct = true;
      } else if (stats.countCorrectQuestionAttempt >= (Math.floor(stats.totalQuestions / 2))) {
        this.fib2Obj.fib2Model.feedbackState.partiallyCorrect = true;
      } else if (stats.countIncorrectQuestionAttempt >= (Math.floor(stats.totalQuestions / 2))) {
        this.fib2Obj.fib2Model.feedbackState.partiallyIncorrect = true;
      } else if (stats.countCorrectQuestionAttempt === 0) {
        this.fib2Obj.fib2Model.feedbackState.incorrect = true;
      }
    }

    this.fib2Obj.adaptor.autoResizeActivityIframe();
  }
}

export {Fib2ResponseProcessor};

