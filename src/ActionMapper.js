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
            game.stateEngine.gameState.ship.setAccelerationOn(elapsed);
        }
        //down
        if (currentlyPressedKeys[40]) {
            //game.ship.removeSpeed();
        }
        //left
        if (currentlyPressedKeys[37]) {
            game.stateEngine.gameState.ship.rotateShipLeft(elapsed);
        }
        //right
        if (currentlyPressedKeys[39]) {
            game.stateEngine.gameState.ship.rotateShipRight(elapsed);
        }
        //spacebar
        if (currentlyPressedKeys[32]) {
            game.stateEngine.gameState.gun.shootBullet(elapsed);

        }
    }


}
