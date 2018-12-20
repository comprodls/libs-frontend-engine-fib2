/* global $ */

import {FIB2Transformer} from './fib2.transformer';
import {Fib2ModelAndView} from './fib2.modelview';
import {Fib2Events} from './fib2.events';
import {Fib2ResponseProcessor} from './fib2.responseProcess';
import generateStatement from '../utils';
import {Constants} from './constant';

const load = Symbol('loadFib2');
const transform = Symbol('transformFib2');
const renderView = Symbol('renderFib2');
const bindEvents = Symbol('bindEvents');
let fib2ModelAndView;

/**
 *  Engine initialization Class. Provides public functions
 *  -getConfig()
 *  -getStatus()
 *  -handleSubmit()
 *  -resetAnswers()
 *  -showGrades()
 *  -showFeedback()
 *  -clearGrades()
 */

class fib2 {

  /**  ENGINE-SHELL CONSTRUCTOR FUNCTION
   *   @constructor
   *   @param {String} elRoot - DOM Element reference where the engine should paint itself.
   *   @param {Object} params - Startup params passed by platform. Include the following sets of parameters:
   *                                      (a) State (Initial launch / Resume / Gradebook mode ).
   *                   (b) TOC parameters (contentFile, layout, etc.).
   *   @param {Object} adaptor - An adaptor interface for communication with platform (__saveResults, closeActivity, savePartialResults, getLastResults, etc.).
   *   @param {String} htmlLayout - Activity HTML layout (as defined in the TOC LINK paramter).
   *   @param {Object} jsonContentObj - Activity JSON content (as defined in the TOC LINK paramter).
   *   @param {Function} callback - To inform the shell that init is complete.
   */

  constructor(elRoot, params, adaptor, htmlLayout, jsonContentObj, callback) {
    adaptor.sendStatement(adaptor.getId(), generateStatement(Constants.STATEMENT_STARTED));
    this.elRoot = elRoot;
    this.params = params;
    this.adaptor = adaptor;
    this.theme = htmlLayout;
    this.jsonContent = jsonContentObj;
    this.userAnswers = {};
    this[load]();
    if (callback) {
      callback({
        backgroundColor: Constants.LAYOUT_COLOR.BG[htmlLayout],
        fontFamily: 'open-sans-font'
      });
    }
  }

  [load]() {
    this[transform]();
    this[renderView]();
    this[bindEvents]();
  }

  [transform]() {
    let fib2Transformer = new FIB2Transformer(this.jsonContent, this.params, this.theme);

    this.fib2Model = fib2Transformer.transform();
  }

  [renderView]() {
    fib2ModelAndView = new Fib2ModelAndView(this.fib2Model);

    $(this.elRoot).html(fib2ModelAndView.template);
    fib2ModelAndView.bindData();
  }

  [bindEvents]() {
    let fib2Events = new Fib2Events(this);

    fib2Events.bindEvents();
  }

  /**
   * Bound to click of Activity submit button.
   */
  handleSubmit() {
    let fib2ResponseProcessor = new Fib2ResponseProcessor(this);

    /* Saving Answers. */
    fib2ResponseProcessor.saveResults();
    this.adaptor.sendStatement(this.adaptor.getId(), generateStatement(Constants.STATEMENT_SUBMITTED));
  }

  /**
   * ENGINE-SHELL Interface
   * @return {{MAX_RETRIES}} - Configuration
   */
  getConfig() {
    return {
      MAX_RETRIES: Constants.MAX_RETRIES
    };
  }

  /**
   * ENGINE-SHELL Interface
   * @return {Boolean} - The current state (Activity Submitted/ Partial Save State.) of activity.
   */
  getStatus() {
    let state = Fib2ResponseProcessor.getState();

    return state.activityPartiallySubmitted || state.activitySubmitted;
  }

  /**
   * Bound to click of Activity reset button.
   */
  resetAnswers() {
    this.userAnswers = [];
    Fib2ResponseProcessor.resetView();
  }

  /**
   * Bound to click of Activity check-my-work button.
   */
  showGrades() {
    let fib2ResponseProcessor = new Fib2ResponseProcessor(this);

    $('label.question').addClass('state-disabled');
    fib2ResponseProcessor.markAnswers();
  }

  /**
   * Bound to click of Activity show-feedback button.
   */
  showFeedback() {
    let fib2ResponseProcessor = new Fib2ResponseProcessor(this);

    fib2ResponseProcessor.feedbackProcessor();
  }

  clearGrades() {
    Fib2ResponseProcessor.resetView(true);
    fib2ModelAndView.clearGrades();
  }
}

export default fib2;
