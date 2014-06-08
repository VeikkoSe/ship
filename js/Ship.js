var Ship = function () {


    this.lastTime = 0;
    this.xPos = 0;
    this.yPos = 0;
    this.angle = 90;
    this.turnspeed = 350;
    this.speed = 0.35;
    this.lastFireTime = 0;
    this.shipModel = new Model('ship');
    this.lastDirection = null;
    this.visible = 1;


}
Ship.prototype.rotateShipLeft = function () {

    this.angle += 3;

}

Ship.prototype.rotateShipRight = function () {
    this.angle -= 3;
}

Ship.prototype.addSpeed = function () {
    this.speed += 0.5;
}

Ship.prototype.removeSpeed = function () {
    this.speed -= 0.5;
}


Ship.prototype.moveShip = function () {

    if (this.angle > 360)
        this.angle = 0;

    if (this.angle < 0)
        this.angle = 360;

    var timeNow = new Date().getTime();

    var screenWidth = 80; //worldcoordinates
    var screenHeight = 60; //worldcoordinates

    if (this.lastTime != 0) {
        var elapsed = timeNow - this.lastTime;


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


        posX = this.speed * ( elapsed / 1000.0 ) * Math.cos(this.degToRad(this.angle));
        posY = this.speed * ( elapsed / 1000.0 ) * Math.sin(this.degToRad(this.angle));
        this.xPos += posX;
        this.yPos += posY;


    }
    this.lastTime = timeNow;


}
Ship.prototype.degToRad = function (degrees) {
    return degrees * Math.PI / 180;
}

Ship.prototype.checkHit = function () {
    {

        for (var j = 0; j < game.asteroids.length; j++) {

            if (game.asteroids[j].visible == 1 && this.xPos > game.asteroids[j].xPos - 4 && this.xPos < game.asteroids[j].xPos + 4 &&
                this.yPos > game.asteroids[j].yPos - 4 && this.yPos < game.asteroids[j].yPos + 4
                ) {

                this.visible = 0;
            }
        }


    }

}