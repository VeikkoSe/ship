var StateEngine = function StateEngine() {
  "use strict";
  this.initState = new InitState();
  this.endState = new EndState();
  this.gameState = new GameState();
  this.pauseState = new PauseState();
  this.running = true;
  this.states = [];
  this.currentState = null;
};
($traceurRuntime.createClass)(StateEngine, {
  init: function() {
    "use strict";
  },
  animate: function() {
    "use strict";
  },
  cleanup: function() {
    "use strict";
    document.onkeydown = null;
    document.onkeyup = null;
  },
  determineState: function(stateStr) {
    "use strict";
    var state = false;
    if (stateStr == "initstate") {
      state = this.initState;
    }
    if (stateStr == "gamestate") {
      state = this.gameState;
    }
    if (stateStr == "pausestate") {
      state = this.pauseState;
    }
    if (stateStr == "endstate") {
      state = this.endState;
    }
    return state;
  },
  changeState: function(stateStr) {
    "use strict";
    var state = this.determineState(stateStr);
    if (this.states.length > 0) {
      this.states[$traceurRuntime.toProperty(this.states.length - 1)].cleanup();
      this.states.pop();
    }
    this.states.push(state);
    this.currentState = state;
    this.states[$traceurRuntime.toProperty(this.states.length - 1)].init();
  },
  pushState: function(stateStr) {
    "use strict";
    var state = this.determineState(stateStr);
    if (this.states.length > 0) {
      this.states[$traceurRuntime.toProperty(this.states.length - 1)].pause();
    }
    this.states.push(state);
    this.states[$traceurRuntime.toProperty(this.states.length - 1)].init();
  },
  popState: function() {
    "use strict";
    if (this.states.length > 0) {
      this.states[$traceurRuntime.toProperty(this.states.length - 1)].cleanup();
      this.states.pop();
    }
    if (!this.states.empty()) {
      this.states[$traceurRuntime.toProperty(this.states.length - 1)].resume();
    }
  },
  handleEvents: function() {
    "use strict";
  },
  draw: function() {
    "use strict";
  }
}, {});
