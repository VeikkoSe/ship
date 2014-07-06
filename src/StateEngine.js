class StateEngine {

    constructor() {


        this.initState = new InitState();
        this.endState = new EndState();
        this.gameState = new GameState();
        this.pauseState = new PauseState();


        this.running = true;
        this.states = [];
        this.currentState = null;


        //this.init();
    }

    init() {


    }
    animate() {

    }

    cleanup() {
        document.onkeydown = null;
        document.onkeyup = null;
    }

    determineState(stateStr) {
        var state = false;
        if (stateStr == "initstate") {
            state = this.initState;
        }
        if (stateStr == "gamestate") {
            state = this.gameState;
        }
        if (stateStr == "pausestate") {
            state = this.pauseState;
        }
        if (stateStr == "endstate") {
            state = this.endState;
        }
        return state;
    }


    changeState(stateStr) {

        var state = this.determineState(stateStr);

        // cleanup the current state
        if (this.states.length > 0) {

            this.states[this.states.length - 1].cleanup();
            this.states.pop();
        }

        // store and init the new state
        this.states.push(state);
        this.currentState = state;
        this.states[this.states.length - 1].init();

    }

    pushState(stateStr) {
        var state = this.determineState(stateStr);

        // pause current state
        if (this.states.length > 0) {
            this.states[this.states.length - 1].pause();
        }

        // store and init the new state
        this.states.push(state);
        this.states[this.states.length - 1].init();
    }

    popState() {
        // cleanup the current state
        if (this.states.length > 0) {
            this.states[this.states.length - 1].cleanup();
            this.states.pop();
        }

        // resume previous state
        if (!this.states.empty()) {
            this.states[this.states.length - 1].resume();
        }
    }


    handleEvents() {
        // let the state handle events
        //this.states[this.states.length - 1].handleEvents();
    }


    draw() {
        // let the state draw the screen
        //this.states[this.states.length - 1].draw();
    }

}

