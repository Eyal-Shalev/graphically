'use strict';
 
/*
 * Based on work done by Nikhil Nigade (@dezinezync) https://gist.github.com/dezinezync/5487119
 */

(function (w, doc) {
  var DEFAULT_CONTAINER = doc.documentElement.scrollTop ? doc.documentElement : doc.body;
  var REQUEST_ANIMATION_FRAME = (w.requestAnimationFrame || w.mozRequestAnimationFrame ||
      w.webkitRequestAnimationFrame || w.oRequestAnimationFrame).bind(w);

  /**
   * Creates a new Scroller object.
   * @param {HTMLElement} container
   * @param {Number} duration
   */
  var Scroller = function Scroller(duration, container) {
    container = container ? container : DEFAULT_CONTAINER;

    var prefs = {
      easing: Scroller.EASING.linear,
      callback: null
    };

    var callback = function () {
      if (prefs.callback) {
        prefs.callback();
      }
    };

    /**
     * Sets the easing function function to use.
     * @param {Function} easing The easing function to use.
     * @returns {Scroller}
     */
    this.easing = function (easing) {
      prefs.easing = easing;
      return this;
    };

    /**
     * Sets the callback function to call at the end of the scroll.
     * @param {Function} callback
     * @returns {Scroller}
     */
    this.callback = function (callback) {
      prefs.callback = callback;
      return this;
    };

  /**
   * Scrolls the prepared element to targetX and targetY.
   * @param {Number} targetX
   * @param {Number} targetY
   */
    this.to = function (targetX, targetY) {
      var startX = container.scrollLeft,
          startY = container.scrollTop;
      
      var distanceX = (targetX - startX),
          distanceY = (targetY - startY);
      
      // Prevent Scrolling if already there.
      if (startX === targetX && startY === targetY) {
        return callback();
      }

      var startTime = Date.now();

      /**
       * The scroll animation function. Will only be called via the animation frame.
       * @see window.requestAnimationFrame
       */
      var scrollAnimation = function (/*timestamp*/) {

        var currentTime = Date.now(),
            time = Math.min(1, ((currentTime - startTime) / duration)),
            easedT = prefs.easing(time);

        container.scrollTop = (easedT * distanceY) + startY;
        container.scrollLeft = (easedT * distanceX) + startX;

        if (time < 1) {
          REQUEST_ANIMATION_FRAME(scrollAnimation);
        }
        else callback();
      };

      REQUEST_ANIMATION_FRAME(scrollAnimation);
    };
  };
  
  /* bits and bytes of the scrollTo function inspired by the works of Benjamin DeCock */

  /*
   * Easing Functions - inspired from http://gizma.com/easing/
   * only considering the t value for the range [0, 1] => [0, 1]
   */
  Scroller.EASING = {
    // no easing, no acceleration
    linear: function (t) {
      return t;
    },
    // accelerating from zero velocity
    easeInQuad: function (t) {
      return t * t;
    },
    // decelerating to zero velocity
    easeOutQuad: function (t) {
      return t * (2 - t);
    },
    // acceleration until halfway, then deceleration
    easeInOutQuad: function (t) {
      return t < .5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
    },
    // accelerating from zero velocity 
    easeInCubic: function (t) {
      return t * t * t;
    },
    // decelerating to zero velocity 
    easeOutCubic: function (t) {
      return (--t) * t * t + 1;
    },
    // acceleration until halfway, then deceleration 
    easeInOutCubic: function (t) {
      return t < .5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
    },
    // accelerating from zero velocity 
    easeInQuart: function (t) {
      return t * t * t * t;
    },
    // decelerating to zero velocity 
    easeOutQuart: function (t) {
      return 1 - (--t) * t * t * t;
    },
    // acceleration until halfway, then deceleration
    easeInOutQuart: function (t) {
      return t < .5 ? 8 * t * t * t * t : 1 - 8 * (--t) * t * t * t;
    },
    // accelerating from zero velocity
    easeInQuint: function (t) {
      return t * t * t * t * t;
    },
    // decelerating to zero velocity
    easeOutQuint: function (t) {
      return 1 + (--t) * t * t * t * t;
    },
    // acceleration until halfway, then deceleration 
    easeInOutQuint: function (t) {
      return t < .5 ? 16 * t * t * t * t * t : 1 + 16 * (--t) * t * t * t * t;
    }
  };
  
  w.Scroller = Scroller;

})(window, document);