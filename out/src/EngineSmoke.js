var EngineSmoke = function EngineSmoke(angle) {
  "use strict";
  this.pointEndPositionsBuffer = gl.createBuffer();
  this.pointLifetimeBuffer = gl.createBuffer();
  this.pointStartPositionsBuffer = gl.createBuffer();
  this.time = 0;
  this.numParticles = 10;
  this.xPos = 0;
  this.yPos = 0;
  this.angle = (angle + 180) % 360;
  this.buildBuffers();
};
($traceurRuntime.createClass)(EngineSmoke, {
  buildBuffers: function() {
    "use strict";
    var lifetimes = [];
    var startPositions = [];
    var endPositions = [];
    var dirVectorX = Math.cos(this.degToRad(this.angle));
    var dirVectorY = Math.sin(this.degToRad(this.angle));
    for (var i = 0; i < this.numParticles; i++) {
      lifetimes.push(Math.random());
      startPositions.push(0);
      startPositions.push(0);
      startPositions.push(0);
      endPositions.push((Math.random() * 0.4) + dirVectorX * 0.5);
      endPositions.push((Math.random() * 0.4) + dirVectorY * 0.5);
      endPositions.push(0);
    }
    gl.bindBuffer(gl.ARRAY_BUFFER, this.pointLifetimeBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(lifetimes), gl.STATIC_DRAW);
    this.pointLifetimeBuffer.itemSize = 1;
    this.pointLifetimeBuffer.numItems = this.numParticles;
    gl.bindBuffer(gl.ARRAY_BUFFER, this.pointStartPositionsBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(startPositions), gl.STATIC_DRAW);
    this.pointStartPositionsBuffer.itemSize = 3;
    this.pointStartPositionsBuffer.numItems = this.numParticles;
    gl.bindBuffer(gl.ARRAY_BUFFER, this.pointEndPositionsBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(endPositions), gl.STATIC_DRAW);
    this.pointEndPositionsBuffer.itemSize = 3;
    this.pointEndPositionsBuffer.numItems = this.numParticles;
  },
  degToRad: function(degrees) {
    "use strict";
    return degrees * Math.PI / 180;
  }
}, {});
