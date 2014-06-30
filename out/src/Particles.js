var Particles = function Particles(name) {
  "use strict";
  this.asteroidExplosion = [];
};
($traceurRuntime.createClass)(Particles, {newAsteroidExplosion: function(y, x) {
    "use strict";
    var particle = new Particle();
    particle.xPos = x;
    particle.yPos = y;
    particle.time = 0;
    this.asteroidExplosion.push(particle);
  }}, {});
