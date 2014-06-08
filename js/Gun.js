var Gun = function () {

    this.bulletsAmount = 80;
    this.bulletReloadSpeed = 200;
    this.bullets = [];
    this.bulletShot = 0;
    this.lastTime = 0;

    var bullet;

    for (var i = 0; i < this.bulletsAmount; i++) {
        bullet = new Bullet();
        this.bullets.push(bullet);
    }


};


Gun.prototype.shootBullet = function () {
    var timeNow = new Date().getTime();

    if (timeNow - this.bulletReloadSpeed > this.bulletShot) {


        for (var i = 0; i < this.bulletsAmount; i++) {

            if (this.bullets[i].visible == 0) {
                this.bulletShot = timeNow;
                this.bullets[i].visible = 1;
                this.bullets[i].birthTime = timeNow;
                this.bullets[i].angle = game.ship.angle;
                this.bullets[i].xPos = game.ship.xPos;
                this.bullets[i].yPos = game.ship.yPos;
                break;
            }


        }

    }


}

Gun.prototype.moveAmmo = function () {

    var timeNow = new Date().getTime();

    if (this.lastTime != 0) {
        var elapsed = timeNow - this.lastTime;

        for (var i = 0; i < this.bulletsAmount; i++) {

            if (timeNow - this.bullets[i].deathtime > this.bullets[i].birthTime)
                this.bullets[i].visible = 0;

            posX = this.bullets[i].speed * ( elapsed / 1000.0 ) * Math.cos(this.degToRad(this.bullets[i].angle));
            posY = this.bullets[i].speed * ( elapsed / 1000.0 ) * Math.sin(this.degToRad(this.bullets[i].angle));

            this.bullets[i].xPos += posX;
            this.bullets[i].yPos += posY;

        }

    }


    this.lastTime = timeNow;
}

Gun.prototype.degToRad = function (degrees) {
    return degrees * Math.PI / 180;
}
