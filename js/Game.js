function Game(name) {

    this.asteroids = [];
    this.ship = null;
    this.bullets = [];
    this.xRot = 0;
    this.zRot = 0;
    this.yRot = 0;
    this.lastTime = 0;
    this.mvMatrixStack = [];
    this.frameCount = 0;
    this.elapsedTotal = 0;
    this.texturesLoaded = 0;
    this.asteroidSpeed = 10;
    this.bulletSpeed = 20;

    //this.vertexPositionBuffer = null;

}

Game.prototype.animate = function () {
    var timeNow = new Date().getTime();
    this.frameCount++;
    if (this.lastTime != 0) {
        var elapsed = timeNow - this.lastTime;
        this.elapsedTotal += elapsed;
        this.xRot += (90 * elapsed) / 1000.0;
        this.yRot += (90 * elapsed) / 1000.0;
        this.zRot += (90 * elapsed) / 1000.0;


        var posX = 0;
        var posY = 0;
        var screenWidth = 80; //why?
        var screenHeight = 60; //why?

        for (var i = 0; i < this.asteroids.length; i++) {
            posX = this.asteroidSpeed * ( elapsed / 1000.0 ) * Math.cos(this.degToRad(this.asteroids[i].rotation));
            posY = this.asteroidSpeed * ( elapsed / 1000.0 ) * Math.sin(this.degToRad(this.asteroids[i].rotation));
            this.asteroids[i].xPos += posX;
            this.asteroids[i].yPos += posY;


            if (this.asteroids[i].xPos > screenWidth) {
                this.asteroids[i].xPos = -1 * screenWidth;
            }

            if (this.asteroids[i].yPos > screenHeight) {
                this.asteroids[i].yPos = -1 * screenHeight;
            }

            if (this.asteroids[i].xPos < -1 * screenWidth) {
                this.asteroids[i].xPos = screenWidth;
            }
            if (this.asteroids[i].yPos < -1 * screenHeight) {
                this.asteroids[i].yPos = screenHeight;
            }


        }


        for (var i = 0; i < this.bullets.length; i++) {
            posX = this.bulletSpeed * ( elapsed / 1000.0 ) * Math.cos(this.degToRad(this.bullets[i].rotation));
            posY = this.bulletSpeed * ( elapsed / 1000.0 ) * Math.sin(this.degToRad(this.bullets[i].rotation));
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



        if (this.elapsedTotal >= 1000) {
            var fps = this.frameCount;
            this.frameCount = 0;
            this.elapsedTotal -= 1000;

            if (fps < 59)
                document.getElementById('fps').style.color = 'red';
            else
                document.getElementById('fps').style.color = 'green';
            document.getElementById('fps').innerHTML = fps;
        }


    }


    this.lastTime = timeNow;
}


Game.prototype.tick = function () {

    var that = this;
    requestAnimFrame(function () {
        that.tick()
    });

    this.drawScene();
    this.animate();

}


Game.prototype.degToRad = function (degrees) {
    return degrees * Math.PI / 180;
}

Game.prototype.drawShip = function () {
    //draw ship
    this.mvPushMatrix();

    mat4.translate(mvMatrix, [0, 0, 0]);
    mat4.rotate(mvMatrix, this.degToRad(this.xRot), [1, 1, 1]);

    gl.bindBuffer(gl.ARRAY_BUFFER, this.ship.texturePositionBuffer);
    gl.vertexAttribPointer(shaderProgram.textureCoordAttribute, this.ship.texturePositionBuffer.itemSize, gl.FLOAT, false, 0, 0);

    gl.activeTexture(gl.TEXTURE0);
    //gl.bindTexture(gl.TEXTURE_2D, this.models[i].texture);
    gl.bindTexture(gl.TEXTURE_2D, textures[0]);
    gl.uniform1i(shaderProgram.samplerUniform, 0);


    gl.bindBuffer(gl.ARRAY_BUFFER, this.ship.normalPositionBuffer);
    gl.vertexAttribPointer(shaderProgram.vertexNormalAttribute, this.ship.normalPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);


    gl.bindBuffer(gl.ARRAY_BUFFER, this.ship.vertexPositionBuffer);
    gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, this.ship.vertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.ship.indexPositionBuffer);
    this.setMatrixUniforms();
    gl.drawElements(gl.TRIANGLES, this.ship.indexPositionBuffer.numItems, gl.UNSIGNED_SHORT, 0);

    this.mvPopMatrix();

}

Game.prototype.drawBullets = function () {
    //draw bullets
    for (var i = 0; i < this.bullets.length; i++) {
        this.mvPushMatrix();

        mat4.translate(mvMatrix, [this.bullets[i].xPos, this.bullets[i].yPos, 0]);
        gl.activeTexture(gl.TEXTURE0);
        //gl.bindTexture(gl.TEXTURE_2D, this.models[i].texture);
        gl.bindTexture(gl.TEXTURE_2D, textures[1]);
        //gl.uniform1i(shaderProgram.samplerUniform, 0);
        mat4.rotate(mvMatrix, this.degToRad(this.xRot), [0.0, 0.0, 1.0]);
        gl.uniform3f(shaderProgram.colorUniform, 1, 0, 0);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.bullets[i].texturePositionBuffer);
        gl.vertexAttribPointer(shaderProgram.textureCoordAttribute, this.bullets[i].texturePositionBuffer.itemSize, gl.FLOAT, false, 0, 0);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.bullets[i].normalPositionBuffer);
        gl.vertexAttribPointer(shaderProgram.vertexNormalAttribute, this.bullets[i].normalPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.bullets[i].vertexPositionBuffer);
        gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, this.bullets[i].vertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.bullets[i].indexPositionBuffer);
        this.setMatrixUniforms();
        gl.drawElements(gl.TRIANGLES, this.bullets[i].indexPositionBuffer.numItems, gl.UNSIGNED_SHORT, 0);
        this.mvPopMatrix();
    }

}


Game.prototype.drawAsteroids = function () {
    for (var i = 0; i < this.asteroids.length; i++) {

        this.mvPushMatrix();
        mat4.translate(mvMatrix, [this.asteroids[i].xPos, this.asteroids[i].yPos, 0]);
        mat4.rotate(mvMatrix, this.degToRad(this.xRot), [1, 1, 1]);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.asteroids[i].texturePositionBuffer);
        gl.vertexAttribPointer(shaderProgram.textureCoordAttribute, this.asteroids[i].texturePositionBuffer.itemSize, gl.FLOAT, false, 0, 0);

        gl.activeTexture(gl.TEXTURE0);
        //textures are in global variable and we just get it by index after ship and bullet
        gl.bindTexture(gl.TEXTURE_2D, textures[i + 2]);
        gl.uniform1i(shaderProgram.samplerUniform, 0);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.asteroids[i].normalPositionBuffer);
        gl.vertexAttribPointer(shaderProgram.vertexNormalAttribute, this.asteroids[i].normalPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);


        gl.bindBuffer(gl.ARRAY_BUFFER, this.asteroids[i].vertexPositionBuffer);
        gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, this.asteroids[i].vertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.asteroids[i].indexPositionBuffer);

        this.setMatrixUniforms();
        gl.drawElements(gl.TRIANGLES, this.asteroids[i].indexPositionBuffer.numItems, gl.UNSIGNED_SHORT, 0);

        this.mvPopMatrix();
    }

}

Game.prototype.drawScene = function () {


    gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);


    mat4.perspective(60, gl.viewportWidth / gl.viewportHeight, 0.1, 200.0, pMatrix);

    mat4.identity(mvMatrix);


    mat4.translate(mvMatrix, [0.0, 0.0, -100.0]);

    //blending
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE);
    gl.enable(gl.BLEND);

    gl.uniform1f(shaderProgram.alphaUniform, parseFloat(1));


    gl.uniform1i(shaderProgram.useLightingUniform, true);

    gl.uniform3f(
        shaderProgram.ambientColorUniform,
        parseFloat(1), //document.getElementById("ambientR").value
        parseFloat(1), //document.getElementById("ambientG").value
        parseFloat(1) //document.getElementById("ambientB").value
    );


    this.drawShip();
    this.drawBullets();
    this.drawAsteroids();


}


Game.prototype.setMatrixUniforms = function () {
    gl.uniformMatrix4fv(shaderProgram.pMatrixUniform, false, pMatrix);
    gl.uniformMatrix4fv(shaderProgram.mvMatrixUniform, false, mvMatrix);

    var normalMatrix = mat3.create();
    mat4.toInverseMat3(mvMatrix, normalMatrix);
    mat3.transpose(normalMatrix);
    gl.uniformMatrix3fv(shaderProgram.nMatrixUniform, false, normalMatrix);


}


Game.prototype.mvPushMatrix = function () {
    var copy = mat4.create();
    mat4.set(mvMatrix, copy);
    this.mvMatrixStack.push(copy);
};

Game.prototype.mvPopMatrix = function () {
    if (this.mvMatrixStack.length == 0) {
        throw "Invalid popMatrix!";
    }
    mvMatrix = this.mvMatrixStack.pop();

}


function sleep(milliSeconds) {
    var startTime = new Date().getTime(); // get the current time
    while (new Date().getTime() < startTime + milliSeconds); // hog cpu
}


Game.prototype.randomIntFromInterval = function (min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}


Game.prototype.init = function (canvas) {
    this.initGL(canvas);
    initShaders();
    gl.enable(gl.CULL_FACE);


    this.ship = new Model('ship');
    this.ship.loadMesh();
    this.ship.buildBuffers();
    initTexture(this.ship.name);


    for (i = 0; i < 20; i++)
        this.bullets.push(new Model('bullets'));

    var randomnumberRot = 0;
    randomnumberRot = this.randomIntFromInterval(-360, 360);
    for (var i = 0; i < this.bullets.length; i++) {
        this.bullets[i].loadMesh();
        this.bullets[i].buildBuffers();

        randomnumberRot = this.randomIntFromInterval(-360, 360);
        this.bullets[i].xPos = 70;
        this.bullets[i].yPos = 70;
        this.bullets[i].rotation = randomnumberRot;
        initTexture(this.bullets[i].name);
    }


    for (i = 0; i < 10; i++)
        this.asteroids.push(new Model('asteroid'));


    var randomnumberX = 0;
    var randomnumberY = 0;

    for (var i = 0; i < this.asteroids.length; i++) {
        this.asteroids[i].loadMesh();
        this.asteroids[i].buildBuffers();
        do {

            randomnumberX = this.randomIntFromInterval(-80, 80);
        }
        while (randomnumberY > 30 && randomnumberY < -30);

        do {
            randomnumberY = this.randomIntFromInterval(-80, 80);
        }
        while (randomnumberY > 30 && randomnumberY < -30)


        //randomnumberY=Math.floor(Math.random()*91)-45;
        randomnumberRot = this.randomIntFromInterval(-360, 360);
        this.asteroids[i].xPos = randomnumberX;
        this.asteroids[i].yPos = randomnumberY;
        this.asteroids[i].rotation = randomnumberRot;
        initTexture(this.asteroids[i].name);


    }

    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    //gl.enable(gl.DEPTH_TEST);
    gl.disable(gl.DEPTH_TEST);

    this.tick();


}


Game.prototype.initGL = function (canvas) {
    try {
        //gl = canvas.getContext("webgl");
        gl = WebGLDebugUtils.makeDebugContext(canvas.getContext("webgl"));
        //gl = WebGLDebugUtils.makeDebugContext(gl, undefined, logGLCall);
        gl.viewportWidth = canvas.width;
        gl.viewportHeight = canvas.height;
    } catch (e) {

    }
    if (!gl) {
        alert("Could not initialise WebGL, sorry :-(");
    }


}





