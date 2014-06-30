class Ship {
    constructor() {


        this.lastTime = 0;
        this.lt = 0;
        this.xPos = 0;
        this.yPos = 0;
        this.angle = 90;
        this.lt = 0;
        this.speed = 0;

        this.shipModel = new Model('ship');

        this.visible = 1;

        this.velocityX = 0;
        this.velocityY = 0;

        this.acceleration = 50;


    }

    rotateShipLeft(elapsed) {
        if (this.angle > 360)
            this.angle = 0;

        if (this.angle < 0)
            this.angle = 360;

        this.angle += 3;
    }

    rotateShipRight(elapsed) {

        if (this.angle > 360)
            this.angle = 0;

        if (this.angle < 0)
            this.angle = 360;
        this.angle -= 3;

    }

    setAccelerationOn(elapsed) {


        var dirVectorX = Math.cos(this.degToRad(this.angle));
        var dirVectorY = Math.sin(this.degToRad(this.angle));


        this.velocityX += this.acceleration * dirVectorX * ( elapsed / 1000.0 );
        this.velocityY += this.acceleration * dirVectorY * ( elapsed / 1000.0 );


    }


    move(elapsed) {

        if (this.xPos > screenWidth) {
            this.xPos = -1 * screenWidth;
        }

        if (this.yPos > screenHeight) {
            this.yPos = -1 * screenHeight;
        }

        if (this.xPos < -1 * screenWidth) {
            this.xPos = screenWidth;
        }
        if (this.yPos < -1 * screenHeight) {
            this.yPos = screenHeight;
        }

        this.xPos += this.velocityX * ( elapsed / 1000.0 );
        this.yPos += this.velocityY * ( elapsed / 1000.0 );

    }

    degToRad(degrees) {
        return degrees * Math.PI / 180;
    }

    checkHit() {


        for (var j = 0; j < game.asteroids.length; j++) {

            if (game.asteroids[j].visible == 1 && this.xPos > game.asteroids[j].xPos - 4 && this.xPos < game.asteroids[j].xPos + 4 &&
                this.yPos > game.asteroids[j].yPos - 4 && this.yPos < game.asteroids[j].yPos + 4
                ) {

                //this.visible = 0;
            }
        }


    }

}