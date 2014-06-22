var ActionMapper = function () {
    this.shooting = null;
}


ActionMapper.prototype.handleKeyDown = function (event) {
    currentlyPressedKeys[event.keyCode] = true;
}

ActionMapper.prototype.handleKeyUp = function (event) {
    currentlyPressedKeys[event.keyCode] = false;
}


ActionMapper.prototype.handleKeys = function (elapsed) {

    //game.ship.setAccelerationOff(elapsed);
    //up
    if (currentlyPressedKeys[38]) {
        game.ship.setAccelerationOn(elapsed);
    }
    //down
    if (currentlyPressedKeys[40]) {
        //game.ship.removeSpeed();
    }
    //left
    if (currentlyPressedKeys[37]) {
        game.ship.rotateShipLeft(elapsed);
    }
    //right
    if (currentlyPressedKeys[39]) {
        game.ship.rotateShipRight(elapsed);
    }
    //spacebar
    if (currentlyPressedKeys[32]) {
        game.gun.shootBullet(elapsed);
    }
}