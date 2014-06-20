var Asteroids = function (amount) {
    this.asteroids = [];
    this.amount = amount;
    this.asteroidSpeed = 10;
    var model = new Model('asteroid');
    var asteroid = null;

    var randomnumberRot = 0;
    var randomnumberX = 0;
    var randomnumberY = 0;
    for (i = 0; i < amount; i++) {
        asteroid  = new Asteroid();
        asteroid.model = model;
        asteroid.visible = 1;
        do {
            randomnumberX = this.randomIntFromInterval(-80, 80);
        }
        while (randomnumberY > 30 && randomnumberY < -30);

        do {
            randomnumberY = this.randomIntFromInterval(-80, 80);
        }
        while (randomnumberY > 30 && randomnumberY < -30)

        //randomnumberY=Math.floor(Math.random()*91)-45;
        randomnumberRot = this.randomIntFromInterval(-360, 360);
        asteroid.xPos = randomnumberX;
        asteroid.yPos = randomnumberY;
        asteroid.rotation = randomnumberRot;


        this.asteroids.push(asteroid);
    }



}


Asteroids.prototype.move = function(elapsed) {

    for (var i = 0; i < this.asteroids.length; i++) {
        posX = this.asteroidSpeed * ( elapsed / 1000.0 ) * Math.cos(this.degToRad(this.asteroids[i].rotation));
        posY = this.asteroidSpeed * ( elapsed / 1000.0 ) * Math.sin(this.degToRad(this.asteroids[i].rotation));
        this.asteroids[i].xPos += posX;
        this.asteroids[i].yPos += posY;


        if (this.asteroids[i].xPos > screenWidth) {
            this.asteroids[i].xPos = -1 * screenWidth;
        }

        if (this.asteroids[i].yPos > screenHeight) {
            this.asteroids[i].yPos = -1 * screenHeight;
        }

        if (this.asteroids[i].xPos < -1 * screenWidth) {
            this.asteroids[i].xPos = screenWidth;
        }
        if (this.asteroids[i].yPos < -1 * screenHeight) {
            this.asteroids[i].yPos = screenHeight;
        }


    }
}

Asteroids.prototype.randomIntFromInterval = function (min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

Asteroids.prototype.degToRad = function (degrees) {
    return degrees * Math.PI / 180;
}