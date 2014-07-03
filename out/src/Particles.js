var Particles = function Particles(name) {
  "use strict";
  this.asteroidExplosion = [];
  this.texture = null;
  var t = new Texture('smoke');
  this.texture = t.loadedTexture;
};
($traceurRuntime.createClass)(Particles, {newAsteroidExplosion: function(y, x) {
    "use strict";
    var particle = new Particle();
    particle.xPos = x;
    particle.yPos = y;
    particle.time = 0;
    this.asteroidExplosion.push(particle);
  }}, {});
