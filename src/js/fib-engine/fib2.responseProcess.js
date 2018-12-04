// /* global $ */
import generateStatement from '../utils';
import {Constants} from './constant';
// import {Config} from './config';

const getAnswersJSON = Symbol('getAnswersJSON');
const getFibsrAnswersJSON = Symbol('getFibsrAnswersJSON');

const __state = {
  currentTries: 0, /* Current try of sending results to platform */
  activityPartiallySubmitted: false, /* State whether activity has been partially submitted. Possible Values: true/false(Boolean) */
  activitySubmitted: false /* State whether activity has been submitted. Possible Values: true/false(Boolean) */
};

class Fib2UserResponse {
  constructor(fib2Obj) {
    this.fib2Obj = fib2Obj;
  }

  /**
   * Function called to send result JSON to adaptor (partial save OR submit).
   */
  saveResults() {

  }

  savePartial(interactionId) {
    let answerJSONs;
    const uniqueId = this.fib2Obj.adaptor.getId();

    this.fib2Obj.adaptor.sendStatement(uniqueId, generateStatement(Constants.STATEMENT_INTERACTED));
    answerJSONs = this[getAnswersJSON](false);
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
   *   1. __saveResults (internal).
   *   2. Multi-item-handler (external).
   *   3. Divide the maximum marks among interaction.
   *   4. Returns result objects.  [{ itemUID: interactionId,  answer: answer,   score: score }]
   */
  [getAnswersJSON](skipQuestion, interactionId) {
    let response = [];
    let fibsrAns = null;

    fibsrAns = this[getFibsrAnswersJSON]();
    response.push(fibsrAns);

    return response;
  }

  [getFibsrAnswersJSON]() {
    return {};
  }

  static getState() {
    return __state;
  }

  static resetView() {
    return true;
  }
}

export {Fib2UserResponse};

