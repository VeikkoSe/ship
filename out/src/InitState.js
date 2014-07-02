var InitState = function InitState(canvas) {
  "use strict";
  this.background = null;
  this.lastTime = 0;
  this.mvMatrixStack = [];
  this.mvMatrix = mat4.create();
  this.pMatrix = mat4.create();
  this.frameCount = 0;
};
($traceurRuntime.createClass)(InitState, {
  cleanup: function() {
    "use strict";
    document.onkeydown = null;
    document.onkeyup = null;
  },
  init: function() {
    "use strict";
    shaderProgram = initShaders("per-fragment-lighting");
    gl.enable(gl.CULL_FACE);
    this.background = new Model('start');
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    document.onkeydown = this.handleKeyDown;
    document.onkeyup = this.handleKeyUp;
  },
  handleKeyDown: function(event) {
    "use strict";
    $traceurRuntime.setProperty(currentlyPressedKeys, event.keyCode, true);
    if (currentlyPressedKeys[13]) {
      $traceurRuntime.setProperty(currentlyPressedKeys, event.keyCode, false);
      game.stateEngine.changeState("gamestate");
    }
  },
  handleKeyUp: function(event) {
    "use strict";
    $traceurRuntime.setProperty(currentlyPressedKeys, event.keyCode, false);
  },
  animate: function() {
    "use strict";
  },
  tick: function() {
    "use strict";
    var that = this;
    requestAnimFrame(function() {
      that.tick();
    });
    this.drawScene();
  },
  drawIntro: function() {
    "use strict";
    this.mvPushMatrix();
    mat4.translate(this.mvMatrix, [0, 0, -10]);
    mat4.scale(this.mvMatrix, [0.219, 0.212, 0.212]);
    gl.uniform1f(shaderProgram.uMaterialShininess, 200.0);
    gl.bindBuffer(gl.ARRAY_BUFFER, this.background.vertexPositionBuffer);
    gl.vertexAttribPointer(shaderProgram.aVertexPosition, 3, gl.FLOAT, false, 0, 0);
    gl.bindBuffer(gl.ARRAY_BUFFER, this.background.normalPositionBuffer);
    gl.vertexAttribPointer(shaderProgram.aVertexNormal, 3, gl.FLOAT, false, 0, 0);
    gl.bindBuffer(gl.ARRAY_BUFFER, this.background.texturePositionBuffer);
    gl.vertexAttribPointer(shaderProgram.textureCoordAttribute, 2, gl.FLOAT, false, 0, 0);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, this.background.texture);
    gl.uniform1i(shaderProgram.samplerUniform, 0);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.background.indexPositionBuffer);
    this.setMatrixUniforms();
    gl.drawElements(gl.TRIANGLES, this.background.indexPositionBuffer.numItems, gl.UNSIGNED_SHORT, 0);
    this.mvPopMatrix();
  },
  drawScene: function() {
    "use strict";
    gl.useProgram(shaderProgram);
    gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.uniform1i(shaderProgram.useLightingUniform, true);
    gl.uniform1f(shaderProgram.alphaUniform, 1);
    mat4.perspective(60, gl.viewportWidth / gl.viewportHeight, 0.1, 1000.0, this.pMatrix);
    gl.disable(gl.DEPTH_TEST);
    var x = $('#slider-x').slider("value");
    var y = $('#slider-y').slider("value");
    var z = $('#slider-z').slider("value");
    gl.uniform3f(shaderProgram.uLightPosition, x, y, z);
    gl.uniform3f(shaderProgram.uLightAmbient, 0, 0, 0);
    gl.uniform3f(shaderProgram.uLightDiffuse, 0.8, 0.8, 0.8);
    gl.uniform3f(shaderProgram.uLightSpecular, 0.8, 0.8, 0.8);
    gl.uniform1f(shaderProgram.uMaterialShininess, 200.0);
    mat4.identity(this.mvMatrix);
    mat4.translate(this.mvMatrix, [0.0, 0.0, -100.0]);
    this.drawIntro();
  },
  setMatrixUniforms: function() {
    "use strict";
    gl.uniformMatrix4fv(shaderProgram.uPMatrix, false, this.pMatrix);
    gl.uniformMatrix4fv(shaderProgram.uMVMatrix, false, this.mvMatrix);
    var normalMatrix = mat3.create();
    mat4.toInverseMat3(this.mvMatrix, normalMatrix);
    mat3.transpose(normalMatrix);
    gl.uniformMatrix3fv(shaderProgram.uNMatrix, false, normalMatrix);
  },
  mvPushMatrix: function() {
    "use strict";
    var copy = mat4.create();
    mat4.set(this.mvMatrix, copy);
    this.mvMatrixStack.push(copy);
  },
  mvPopMatrix: function() {
    "use strict";
    if (this.mvMatrixStack.length == 0) {
      throw "Invalid popMatrix!";
    }
    this.mvMatrix = this.mvMatrixStack.pop();
  }
}, {}, StateEngine);
