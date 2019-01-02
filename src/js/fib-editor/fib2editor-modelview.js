/* global $ */

import rivets from 'rivets';
import {feedbackPresets} from './fib2editor-constants';
require('../../scss/fib2-editor.scss');

let fib2TemplateRef = require('../../html/fib2Editor.html');
const initializeRivets = Symbol('initializeRivets');
const constantTemplateRef = {
  TEMPLATES: {
    /* Regular fib2 Layout */
    FIB2_EDITOR: fib2TemplateRef
  }
};

class Fib2ModelAndView {

  constructor(jsonContent, activityAdaptor, utils) {
    this.editedJsonContent = jsonContent;
    this.utils = utils;
    this.sendItemChangeNotification = false;
    this.activityAdaptor = activityAdaptor;
  }

  get template() {
    return constantTemplateRef.TEMPLATES.FIB2_EDITOR;
  }

  bindData() {
    const data = this[initializeRivets]();

    rivets.bind($('#fib-editor'), data);
  }

  [initializeRivets]() {
    let _self = this;
    /*
     * Formatters for rivets
     */

    /* Appends custom arguments to function calls*/
    rivets.formatters.args = function (fn) {
      let args = Array.prototype.slice.call(arguments, 1);

      return function () {
        return fn.apply(this, Array.prototype.concat.call(arguments, args));
      };
    };

    rivets.binders['content'] = {
      bind: function (el) {
        this.callback = (e) => {
          this.publish();
        };
        $(el).on('focusout', '.userAnswer', _self.utils.userAnswerInputEventListener.bind(_self.utils));
        el.addEventListener('blur', this.callback);
      },
      unbind: function (el) {
        el.removeEventListener('blur', this.callback);
      },
      getValue: function (el) {
        return el.innerHTML;
      },
      routine: function (el, value) {
        el.innerHTML = value;
      }
    };

    rivets.binders['content-editable'] = {
      bind: function (el) {
        if (el.className === 'question-data mb-sm') {
          el.addEventListener('paste', _self.utils.questionDataEventListener.bind(_self.utils));
          $(el)
            .on('mouseenter', '.drag', function () {
              $(this).next().css('color', 'dodgerblue');
            })
            .on('mouseleave', '.drag', function () {
              $(this).next().css('color', '');
            })
            .on('mouseenter', '.answer', function () {
              $(this).prev().css('background-color', 'dodgerblue');
            })
            .on('mouseleave', '.answer', function () {
              $(this).prev().css('background-color', '');
            });
        }

        el.setAttribute('contenteditable', true);
        this.callback = (e) => {
          this.publish();
        };
        el.addEventListener('blur', this.callback);
      },
      unbind: function (el) {
        el.removeEventListener('blur', this.callback);
      },
      getValue: function (el) {
        return el.innerHTML;
      },
      routine: (el, value) => {
        if (this.sendItemChangeNotification) {
          if (el.className === 'question-data mb-sm') {
            this.utils.updateAnswerTextJSON();
          }
          this.activityAdaptor.autoResizeActivityIframe();
          this.utils.handleItemChangedInEditor();
        }
        el.innerHTML = value;
      }
    };

    rivets.binders.addclass = function (el, value) {
      if (el.addedClass) {
        $(el).removeClass(el.addedClass);
        delete el.addedClass;
      }

      if (value) {
        $(el).addClass(value);
        el.addedClass = value;
      }
    };

    return {
      editorContent: this.editedJsonContent,
      feedback: this.editedJsonContent.feedback,
      isInstructionEmpty: this.editedJsonContent.isInstructionEmpty,
      removeInstruction: this.utils.removeInstruction.bind(this.utils),
      addInstruction: this.utils.addInstruction.bind(this.utils),
      addQuestion: this.utils.addQuestion.bind(this.utils),
      removeQuestion: this.utils.removeQuestion.bind(this.utils),
      feedbackPresets: feedbackPresets
    };
  }
}

export default Fib2ModelAndView;
