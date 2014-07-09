class AsteroidExplosion {
    constructor() {

        this.pointEndPositionsBuffer = gl.createBuffer();
        this.pointLifetimeBuffer = gl.createBuffer();
        this.pointStartPositionsBuffer = gl.createBuffer();
        this.time = 0;
        this.numParticles = 500;
        this.xPos = 0;
        this.yPos = 0;
        this.buildBuffers();

    }

    buildBuffers() {

        var lifetimes = [];
        var startPositions = [];
        var endPositions = [];
        for (var i = 0; i < this.numParticles; i++) {
            lifetimes.push(Math.random());

            startPositions.push((Math.random() * 0.25) - 0.125);
            startPositions.push((Math.random() * 0.25) - 0.125);
            startPositions.push((Math.random() * 0.25) - 0.125);

            endPositions.push((Math.random() * 2) - 1);
            endPositions.push((Math.random() * 2) - 1);
            endPositions.push((Math.random() * 2) - 1);
        }


        gl.bindBuffer(gl.ARRAY_BUFFER, this.pointLifetimeBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(lifetimes), gl.STATIC_DRAW);
        this.pointLifetimeBuffer.itemSize = 1;
        this.pointLifetimeBuffer.numItems = this.numParticles;


        gl.bindBuffer(gl.ARRAY_BUFFER, this.pointStartPositionsBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(startPositions), gl.STATIC_DRAW);
        this.pointStartPositionsBuffer.itemSize = 3;
        this.pointStartPositionsBuffer.numItems = this.numParticles;


        gl.bindBuffer(gl.ARRAY_BUFFER, this.pointEndPositionsBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(endPositions), gl.STATIC_DRAW);
        this.pointEndPositionsBuffer.itemSize = 3;
        this.pointEndPositionsBuffer.numItems = this.numParticles;
    }

}


