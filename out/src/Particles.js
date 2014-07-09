var Particles = function Particles(name) {
  "use strict";
  this.asteroidExplosion = [];
  this.asteroidTexture = null;
  var t = new Texture('smoke');
  this.asteroidTexture = t.loadedTexture;
};
($traceurRuntime.createClass)(Particles, {newAsteroidExplosion: function(y, x) {
    "use strict";
    var particle = new AsteroidExplosion();
    particle.xPos = x;
    particle.yPos = y;
    particle.time = 0;
    this.asteroidExplosion.push(particle);
  }}, {});
