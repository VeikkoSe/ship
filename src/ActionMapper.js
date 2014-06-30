class ActionMapper {

    constructor() {
        this.shooting = null;
    }


    handleKeyDown(event) {
        currentlyPressedKeys[event.keyCode] = true;
    }

    handleKeyUp(event) {
        currentlyPressedKeys[event.keyCode] = false;
    }


    handleKeys(elapsed) {

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


}