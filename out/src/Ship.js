var Ship = function Ship() {
  "use strict";
  this.lastTime = 0;
  this.lt = 0;
  this.xPos = 0;
  this.yPos = 0;
  this.angle = 90;
  this.lt = 0;
  this.speed = 0;
  this.shipModel = new Model('ship');
  this.visible = 1;
  this.velocityX = 0;
  this.velocityY = 0;
  this.acceleration = 50;
  this.ships = 5;
  this.crash = false;
  this.engineSmoke = [];
  this.smokeTexture = null;
  var t = new Texture('exhaust');
  this.smokeTexture = t.loadedTexture;
};
($traceurRuntime.createClass)(Ship, {
  rotateShipLeft: function(elapsed) {
    "use strict";
    if (this.angle >= 360)
      this.angle = 0;
    if (this.angle < 0)
      this.angle = 360;
    this.angle += 600 * (elapsed / 1000.0);
  },
  rotateShipRight: function(elapsed) {
    "use strict";
    if (this.angle >= 360)
      this.angle = 0;
    if (this.angle < 0)
      this.angle = 360;
    this.angle -= 600 * (elapsed / 1000.0);
  },
  setAccelerationOn: function(elapsed) {
    "use strict";
    var dirVectorX = Math.cos(this.degToRad(this.angle));
    var dirVectorY = Math.sin(this.degToRad(this.angle));
    this.velocityX += this.acceleration * dirVectorX * (elapsed / 1000.0);
    this.velocityY += this.acceleration * dirVectorY * (elapsed / 1000.0);
    this.newEngineSmoke();
  },
  move: function(elapsed) {
    "use strict";
    if (this.xPos > screenWidth) {
      this.xPos = -1 * screenWidth;
    }
    if (this.yPos > screenHeight) {
      this.yPos = -1 * screenHeight;
    }
    if (this.xPos < -1 * screenWidth) {
      this.xPos = screenWidth;
    }
    if (this.yPos < -1 * screenHeight) {
      this.yPos = screenHeight;
    }
    this.xPos += this.velocityX * (elapsed / 1000.0);
    this.yPos += this.velocityY * (elapsed / 1000.0);
  },
  degToRad: function(degrees) {
    "use strict";
    return degrees * Math.PI / 180;
  },
  checkHit: function() {
    "use strict";
    for (var j = 0; j < game.stateEngine.gameState.asteroids.asteroids.length; j++) {
      if (game.stateEngine.gameState.asteroids.asteroids[$traceurRuntime.toProperty(j)].visible == 1 && this.xPos > game.stateEngine.gameState.asteroids.asteroids[$traceurRuntime.toProperty(j)].xPos - 4 && this.xPos < game.stateEngine.gameState.asteroids.asteroids[$traceurRuntime.toProperty(j)].xPos + 4 && this.yPos > game.stateEngine.gameState.asteroids.asteroids[$traceurRuntime.toProperty(j)].yPos - 4 && this.yPos < game.stateEngine.gameState.asteroids.asteroids[$traceurRuntime.toProperty(j)].yPos + 4) {
        this.ships--;
      }
    }
    if (this.ships < 1) {
      game.stateEngine.changeState("endstate");
    }
  },
  newEngineSmoke: function(y, x) {
    "use strict";
    var particle = new EngineSmoke(this.angle);
    particle.xPos = this.xPos;
    particle.yPos = this.yPos;
    particle.time = 0;
    this.engineSmoke.push(particle);
  }
}, {});
