var ActionMapper = function () {
    this.shooting = null;
}


ActionMapper.prototype.handleKeyDown = function (event) {
    currentlyPressedKeys[event.keyCode] = true;
}

ActionMapper.prototype.handleKeyUp = function (event) {
    currentlyPressedKeys[event.keyCode] = false;
}


ActionMapper.prototype.handleKeys = function () {
    this.shooting = 0;

    //up
    if (currentlyPressedKeys[38]) {
        game.ship.addSpeed();
    }
    //down
    if (currentlyPressedKeys[40]) {
        game.ship.removeSpeed();
    }
    //left
    if (currentlyPressedKeys[37]) {
        game.ship.rotateShipLeft();
    }
    //right
    if (currentlyPressedKeys[39]) {
        game.ship.rotateShipRight();
    }
    //spacebar
    if (currentlyPressedKeys[32]) {
        game.gun.shootBullet();
    }
}





