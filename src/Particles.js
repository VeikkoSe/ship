class Particles {
    constructor(name) {
        this.asteroidExplosion = [];
    }

    newAsteroidExplosion(y, x) {
        var particle = new Particle();

        particle.xPos = x;
        particle.yPos = y;
        particle.time = 0;
        this.asteroidExplosion.push(particle);


    }
}


