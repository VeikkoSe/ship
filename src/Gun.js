class Gun {
    constructor() {
        this.bulletsAmount = 80;
        this.bulletReloadSpeed = 100;
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
    }

    shootBullet() {
        var timeNow = new Date().getTime();

        if (timeNow - this.bulletReloadSpeed > this.bulletShot) {


            for (var i = 0; i < this.bulletsAmount; i++) {

                if (this.bullets[i].visible == 0) {
                    this.bulletShot = timeNow;
                    this.bullets[i].visible = 1;
                    this.bullets[i].birthTime = timeNow;
                    this.bullets[i].angle = game.stateEngine.gameState.ship.angle;
                    this.bullets[i].xPos = game.stateEngine.gameState.ship.xPos;
                    this.bullets[i].yPos = game.stateEngine.gameState.ship.yPos;
                    break;
                }
            }
        }
    }

    moveAmmo() {

        var timeNow = new Date().getTime();

        if (this.lastTime != 0) {
            var elapsed = timeNow - this.lastTime;

            for (var i = 0; i < this.bulletsAmount; i++) {

                if (timeNow - this.bullets[i].deathtime > this.bullets[i].birthTime)
                    this.bullets[i].visible = 0;

                var posX = this.bullets[i].speed * ( elapsed / 1000.0 ) * Math.cos(this.degToRad(this.bullets[i].angle));
                var posY = this.bullets[i].speed * ( elapsed / 1000.0 ) * Math.sin(this.degToRad(this.bullets[i].angle));

                this.bullets[i].xPos += posX;
                this.bullets[i].yPos += posY;

                if (this.bullets[i].xPos > screenWidth) {
                    this.bullets[i].xPos = -1 * screenWidth;
                }

                if (this.bullets[i].yPos > screenHeight) {
                    this.bullets[i].yPos = -1 * screenHeight;
                }

                if (this.bullets[i].xPos < -1 * screenWidth) {
                    this.bullets[i].xPos = screenWidth;
                }
                if (this.bullets[i].yPos < -1 * screenHeight) {
                    this.bullets[i].yPos = screenHeight;
                }
            }
        }
        this.lastTime = timeNow;
    }

    degToRad(degrees) {
        return degrees * Math.PI / 180;
    }

    checkHit() {

        for (var i = 0; i < this.bulletsAmount; i++) {
            for (var j = 0; j < game.stateEngine.gameState.asteroids.asteroids.length; j++) {

                if (this.bullets[i].visible == 1 && game.stateEngine.gameState.asteroids.asteroids[j].visible == 1 && this.bullets[i].xPos > game.stateEngine.gameState.asteroids.asteroids[j].xPos - 4 && this.bullets[i].xPos < game.stateEngine.gameState.asteroids.asteroids[j].xPos + 4 &&
                    this.bullets[i].yPos > game.stateEngine.gameState.asteroids.asteroids[j].yPos - 4 && this.bullets[i].yPos < game.stateEngine.gameState.asteroids.asteroids[j].yPos + 4
                    ) {
                    game.stateEngine.gameState.asteroids.asteroids[j].visible = 0;
                    game.stateEngine.gameState.asteroids.amountshot++;
                    this.bullets[i].visible = 0;
                    game.shotAsteroids++;

                    game.stateEngine.gameState.particles.newAsteroidExplosion(this.bullets[i].yPos, this.bullets[i].xPos);


                }
            }
        }
        if (game.stateEngine.gameState.asteroids.asteroids.length == game.stateEngine.gameState.asteroids.amountshot) {

            for (var j = 0; j < game.stateEngine.gameState.asteroids.asteroids.length; j++) {
                game.stateEngine.gameState.asteroids.asteroids[j].visible = 1;
            }
            game.stateEngine.gameState.asteroids.amountshot = 0;
            game.stateEngine.gameState.asteroids.addnew(2);
        }

    }
}