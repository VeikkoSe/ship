var Particles = function (name) {
    this.asteroidExplosion = [];

}

Particles.prototype.newAsteroidExplosion = function (y,x) {
    var particle = new Particle();

    particle.xPos = x;
    particle.yPos = y;
    particle.time = 0;
    this.asteroidExplosion.push(particle);

}


