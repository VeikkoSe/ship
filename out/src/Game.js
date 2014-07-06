var Game = function Game(canvas) {
  "use strict";
  this.running = true;
  this.stateEngine = null;
  this.init(canvas);
  this.initGL(canvas);
  this.shotAsteroids = null;
};
($traceurRuntime.createClass)(Game, {
  init: function(canvas) {
    "use strict";
    this.initGL(canvas);
    this.stateEngine = new StateEngine();
    this.stateEngine.changeState("initstate");
    this.tick();
  },
  tick: function() {
    "use strict";
    var that = this;
    requestAnimFrame(function() {
      that.tick();
    });
    this.stateEngine.currentState.animate();
    this.stateEngine.currentState.drawScene();
  },
  initGL: function(canvas) {
    "use strict";
    try {
      gl = WebGLDebugUtils.makeDebugContext(canvas.getContext("webgl"));
      gl.viewportWidth = canvas.width;
      gl.viewportHeight = canvas.height;
    } catch (e) {}
    if (!gl) {
      alert("Could not initialise WebGL, sorry :-(");
    }
  }
}, {});
