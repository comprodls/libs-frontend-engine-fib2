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

  clearGrades() {
    this.model.feedbackState = {
      'correct': false,
      'incorrect': false,
      'empty': false
    };
  }

  bindData() {
    this[initializeRivets]();
  }

  [initializeRivets]() {
    rivets.formatters.propertyList = function (obj) {
      return (function () {
        let properties = [];

        const keys = Object.keys(obj);

        for (const key of keys) {
          properties.push({key: key, value: obj[key]});
        }

        return properties;
      })();
    };

    rivets.binders['src-strict'] = function (el, value) {
      var img = new Image();

      img.onload = function () {
        $(el).attr('src', value);
      };

      img.src = value;
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

    rivets.binders['text-parse'] = function (el, value) {
      let innerHtml = $(`<div>${value}</div>`)[0].innerHTML;

      $(el).html(innerHtml);
    };

    rivets.binders['answer-id'] = function (el, value) {
      el.id = 'answer' + value;
    };

    let data = {
      content: this.model
    };

    /*Bind the data to template using rivets*/
    rivets.bind($('#fib2-engine'), data);
  }
}

export {Fib2ModelAndView};
