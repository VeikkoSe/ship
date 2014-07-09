class Particles {
    constructor(name) {
        this.asteroidExplosion = [];

        this.asteroidTexture = null;

        var t = new Texture('smoke');
        this.asteroidTexture = t.loadedTexture;

    }

    newAsteroidExplosion(y, x) {
        var particle = new AsteroidExplosion();


        particle.xPos = x;
        particle.yPos = y;
        particle.time = 0;
        this.asteroidExplosion.push(particle);

    }


}


