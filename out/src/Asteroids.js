var Asteroids = function Asteroids(amount) {
  "use strict";
  this.asteroids = [];
  this.asteroidSpeed = 10;
  this.amountshot = 0;
  this.model = new Model('asteroid');
  this.addnew(amount);
};
($traceurRuntime.createClass)(Asteroids, {
  addnew: function(addAmount) {
    "use strict";
    var randomnumberRot = 0;
    var randomnumberX = 0;
    var randomnumberY = 0;
    var asteroid = null;
    for (var i = 0; i < addAmount; i++) {
      asteroid = new Asteroid();
      asteroid.model = this.model;
      asteroid.visible = 1;
      do {
        randomnumberX = this.randomIntFromInterval(-80, 80);
      } while (randomnumberY > 30 && randomnumberY < -30);
      do {
        randomnumberY = this.randomIntFromInterval(-80, 80);
      } while (randomnumberY > 30 && randomnumberY < -30);
      randomnumberRot = this.randomIntFromInterval(-360, 360);
      asteroid.xPos = randomnumberX;
      asteroid.yPos = randomnumberY;
      asteroid.rotation = randomnumberRot;
      this.asteroids.push(asteroid);
    }
  },
  move: function(elapsed) {
    "use strict";
    for (var i = 0; i < this.asteroids.length; i++) {
      var posX = this.asteroidSpeed * (elapsed / 1000.0) * Math.cos(this.degToRad(this.asteroids[$traceurRuntime.toProperty(i)].rotation));
      var posY = this.asteroidSpeed * (elapsed / 1000.0) * Math.sin(this.degToRad(this.asteroids[$traceurRuntime.toProperty(i)].rotation));
      this.asteroids[$traceurRuntime.toProperty(i)].xPos += posX;
      this.asteroids[$traceurRuntime.toProperty(i)].yPos += posY;
      if (this.asteroids[$traceurRuntime.toProperty(i)].xPos > screenWidth) {
        this.asteroids[$traceurRuntime.toProperty(i)].xPos = -1 * screenWidth;
      }
      if (this.asteroids[$traceurRuntime.toProperty(i)].yPos > screenHeight) {
        this.asteroids[$traceurRuntime.toProperty(i)].yPos = -1 * screenHeight;
      }
      if (this.asteroids[$traceurRuntime.toProperty(i)].xPos < -1 * screenWidth) {
        this.asteroids[$traceurRuntime.toProperty(i)].xPos = screenWidth;
      }
      if (this.asteroids[$traceurRuntime.toProperty(i)].yPos < -1 * screenHeight) {
        this.asteroids[$traceurRuntime.toProperty(i)].yPos = screenHeight;
      }
    }
  },
  randomIntFromInterval: function(min, max) {
    "use strict";
    return Math.floor(Math.random() * (max - min + 1) + min);
  },
  degToRad: function(degrees) {
    "use strict";
    return degrees * Math.PI / 180;
  }
}, {});
