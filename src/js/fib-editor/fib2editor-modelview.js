/* global $ */

import {feedbackPresets} from './fib2editor-constants';

let fib2TemplateRef = require('../../html/fib2Editor.html');

require('../../scss/fib2-editor.scss');

import rivets from 'rivets';

const initializeRivets = Symbol('initializeRivets');
const bindEvents = Symbol('bindEvents');

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
        this[initializeRivets]();
        this[bindEvents]();
    }

    [initializeRivets]() {
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
                let that = this;

                this.callback = function (e) {
                    that.publish();
                };
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
                let that = this;

                el.setAttribute('contenteditable', true);
                this.callback = function (e) {
                    that.publish();
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
                    if (el.className === 'question-data') {
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

        let data = {
            editorContent: this.editedJsonContent,
            feedback: this.editedJsonContent.feedback,
            isInstructionEmpty: this.editedJsonContent.isInstructionEmpty,
            removeInstruction: this.utils.removeInstruction.bind(this.utils),
            addInstruction: this.utils.addInstruction.bind(this.utils),
            addQuestion: this.utils.addQuestion.bind(this.utils),
            removeQuestion: this.utils.removeQuestion.bind(this.utils),
            feedbackPresets: feedbackPresets
        };

        rivets.bind($('#fib-editor'), data);
    }

    [bindEvents]() {
        $(document).ready(() => {
            this.sendItemChangeNotification = true;

            let questionContainer = $('.question-data');

            for (let i = 0 ; i < questionContainer.length ; i++) {
                questionContainer[i].addEventListener('paste', (e) => {

                    // Get the clipboard data
                    let paste = (e.clipboardData || window.clipboardData).getData('text');

                    if (paste.indexOf('Response-i') === 0) {

                        // Prevent the default pasting event and stop bubbling
                        e.preventDefault();
                        e.stopPropagation();

                        const selection = window.getSelection();

                        // Cancel the paste operation if the cursor or highlighted area isn't found
                        if (!selection.rangeCount) return false;

                        let interactionId = this.utils.getInteractionId();
                        let questionBlank = document.createElement('span');

                        questionBlank.setAttribute('class', 'input');

                        let newNode = document.createElement('span');

                        newNode.setAttribute('id', interactionId);
                        newNode.setAttribute('contenteditable', false);
                        newNode.setAttribute('class', 'answer input-sm');
                        newNode.textContent = 'Response-' + interactionId;

                        questionBlank.appendChild(newNode);
                        selection.getRangeAt(0).insertNode(questionBlank);
                        return true;
                    }
                    return false;
                });
            }

            this.utils.addInputEventListner();

        });
    }

}

export default Fib2ModelAndView;
