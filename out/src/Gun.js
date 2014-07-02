var Gun = function Gun() {
  "use strict";
  this.bulletsAmount = 80;
  this.bulletReloadSpeed = 10;
  this.bullets = [];
  this.bulletShot = 0;
  this.lastTime = 0;
  this.bulletMesh = new Model('bigbullet');
  var bullet;
  for (var i = 0; i < this.bulletsAmount; i++) {
    bullet = new Bullet();
    bullet.bulletModel = this.bulletMesh;
    this.bullets.push(bullet);
  }
};
($traceurRuntime.createClass)(Gun, {
  shootBullet: function() {
    "use strict";
    var timeNow = new Date().getTime();
    if (timeNow - this.bulletReloadSpeed > this.bulletShot) {
      for (var i = 0; i < this.bulletsAmount; i++) {
        if (this.bullets[$traceurRuntime.toProperty(i)].visible == 0) {
          this.bulletShot = timeNow;
          this.bullets[$traceurRuntime.toProperty(i)].visible = 1;
          this.bullets[$traceurRuntime.toProperty(i)].birthTime = timeNow;
          this.bullets[$traceurRuntime.toProperty(i)].angle = game.stateEngine.gameState.ship.angle;
          this.bullets[$traceurRuntime.toProperty(i)].xPos = game.stateEngine.gameState.ship.xPos;
          this.bullets[$traceurRuntime.toProperty(i)].yPos = game.stateEngine.gameState.ship.yPos;
          break;
        }
      }
    }
  },
  moveAmmo: function() {
    "use strict";
    var timeNow = new Date().getTime();
    if (this.lastTime != 0) {
      var elapsed = timeNow - this.lastTime;
      for (var i = 0; i < this.bulletsAmount; i++) {
        if (timeNow - this.bullets[$traceurRuntime.toProperty(i)].deathtime > this.bullets[$traceurRuntime.toProperty(i)].birthTime)
          this.bullets[$traceurRuntime.toProperty(i)].visible = 0;
        var posX = this.bullets[$traceurRuntime.toProperty(i)].speed * (elapsed / 1000.0) * Math.cos(this.degToRad(this.bullets[$traceurRuntime.toProperty(i)].angle));
        var posY = this.bullets[$traceurRuntime.toProperty(i)].speed * (elapsed / 1000.0) * Math.sin(this.degToRad(this.bullets[$traceurRuntime.toProperty(i)].angle));
        this.bullets[$traceurRuntime.toProperty(i)].xPos += posX;
        this.bullets[$traceurRuntime.toProperty(i)].yPos += posY;
        if (this.bullets[$traceurRuntime.toProperty(i)].xPos > screenWidth) {
          this.bullets[$traceurRuntime.toProperty(i)].xPos = -1 * screenWidth;
        }
        if (this.bullets[$traceurRuntime.toProperty(i)].yPos > screenHeight) {
          this.bullets[$traceurRuntime.toProperty(i)].yPos = -1 * screenHeight;
        }
        if (this.bullets[$traceurRuntime.toProperty(i)].xPos < -1 * screenWidth) {
          this.bullets[$traceurRuntime.toProperty(i)].xPos = screenWidth;
        }
        if (this.bullets[$traceurRuntime.toProperty(i)].yPos < -1 * screenHeight) {
          this.bullets[$traceurRuntime.toProperty(i)].yPos = screenHeight;
        }
      }
    }
    this.lastTime = timeNow;
  },
  degToRad: function(degrees) {
    "use strict";
    return degrees * Math.PI / 180;
  },
  checkHit: function() {
    "use strict";
    for (var i = 0; i < this.bulletsAmount; i++) {
      for (var j = 0; j < game.stateEngine.gameState.asteroids.amount; j++) {
        if (this.bullets[$traceurRuntime.toProperty(i)].visible == 1 && game.stateEngine.gameState.asteroids.asteroids[$traceurRuntime.toProperty(j)].visible == 1 && this.bullets[$traceurRuntime.toProperty(i)].xPos > game.stateEngine.gameState.asteroids.asteroids[$traceurRuntime.toProperty(j)].xPos - 4 && this.bullets[$traceurRuntime.toProperty(i)].xPos < game.stateEngine.gameState.asteroids.asteroids[$traceurRuntime.toProperty(j)].xPos + 4 && this.bullets[$traceurRuntime.toProperty(i)].yPos > game.stateEngine.gameState.asteroids.asteroids[$traceurRuntime.toProperty(j)].yPos - 4 && this.bullets[$traceurRuntime.toProperty(i)].yPos < game.stateEngine.gameState.asteroids.asteroids[$traceurRuntime.toProperty(j)].yPos + 4) {
          game.stateEngine.gameState.asteroids.asteroids[$traceurRuntime.toProperty(j)].visible = 0;
          this.bullets[$traceurRuntime.toProperty(i)].visible = 0;
          game.stateEngine.gameState.particles.newAsteroidExplosion(this.bullets[$traceurRuntime.toProperty(i)].yPos, this.bullets[$traceurRuntime.toProperty(i)].xPos);
        }
      }
    }
    var theEnd = true;
    for (var j = 0; j < game.stateEngine.gameState.asteroids.amount; j++) {
      if (game.stateEngine.gameState.asteroids.asteroids[$traceurRuntime.toProperty(j)].visible == 1)
        theEnd = false;
    }
    if (theEnd) {
      game.stateEngine.changeState("endstate");
    }
  }
}, {});
