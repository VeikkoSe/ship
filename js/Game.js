var Game = function(name) {


    this.asteroids = [];
    this.ship = null;
    this.sun = null;
    this.bullets = [];
    this.xRot = 0;
    this.zRot = 0;
    this.yRot = 0;
    this.lastTime = 0;
    this.mvMatrixStack = [];
    this.mvMatrix = mat4.create();
    this.pMatrix = mat4.create();
    this.frameCount = 0;
    this.elapsedTotal = 0;
    this.background = null;
    this.asteroidSpeed = 10;
    this.bulletSpeed = 20;


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

            //if (fps < 59)
               // document.getElementById('fps').style.color = 'red';
            //else
               // document.getElementById('fps').style.color = 'green';
            //document.getElementById('fps').innerHTML = fps;
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

   // mat4.translate(this.mvMatrix, [0, 0, 0]);
    mat4.translate(this.mvMatrix, [0,0,0]);
    mat4.rotate(this.mvMatrix, this.degToRad(this.xRot), [1, 1, 1]);

    gl.uniform1f(shaderProgram.uMaterialShininess,200.0);


    gl.bindBuffer(gl.ARRAY_BUFFER, this.ship.vertexPositionBuffer);
    gl.vertexAttribPointer(shaderProgram.aVertexPosition, 3, gl.FLOAT, false, 0, 0);



    gl.bindBuffer(gl.ARRAY_BUFFER, this.ship.normalPositionBuffer);
    gl.vertexAttribPointer(shaderProgram.aVertexNormal, 3, gl.FLOAT, false, 0, 0);


    gl.bindBuffer(gl.ARRAY_BUFFER, this.ship.texturePositionBuffer);
    gl.vertexAttribPointer(shaderProgram.textureCoordAttribute, 2, gl.FLOAT, false, 0, 0);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, this.ship.texture);
    gl.uniform1i(shaderProgram.samplerUniform, 0);

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.ship.indexPositionBuffer);

    this.setMatrixUniforms();
    gl.drawElements(gl.TRIANGLES, this.ship.indexPositionBuffer.numItems, gl.UNSIGNED_SHORT, 0);

    this.mvPopMatrix();

}

Game.prototype.drawBackground = function () {
    //draw background
    this.mvPushMatrix();

    mat4.translate(this.mvMatrix, [0, 0, -10]);
    mat4.scale(this.mvMatrix,[0.219, 0.212,0.212]);

    gl.uniform1f(shaderProgram.uMaterialShininess,200.0);


    gl.bindBuffer(gl.ARRAY_BUFFER, this.background.vertexPositionBuffer);
    gl.vertexAttribPointer(shaderProgram.aVertexPosition, 3, gl.FLOAT, false, 0, 0);


    gl.bindBuffer(gl.ARRAY_BUFFER, this.background.normalPositionBuffer);
    gl.vertexAttribPointer(shaderProgram.aVertexNormal, 3, gl.FLOAT, false, 0, 0);



    gl.bindBuffer(gl.ARRAY_BUFFER, this.background.texturePositionBuffer);
    gl.vertexAttribPointer(shaderProgram.textureCoordAttribute, 2, gl.FLOAT, false, 0, 0);

    gl.activeTexture(gl.TEXTURE0);


    gl.bindTexture(gl.TEXTURE_2D, this.background.texture);
    gl.uniform1i(shaderProgram.samplerUniform, 0);


    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.background.indexPositionBuffer);
    this.setMatrixUniforms();
    gl.drawElements(gl.TRIANGLES, this.background.indexPositionBuffer.numItems, gl.UNSIGNED_SHORT, 0);

    this.mvPopMatrix();

}


Game.prototype.drawBullets = function () {
    //draw bullets
    for (var i = 0; i < this.bullets.length; i++) {
        this.mvPushMatrix();

        mat4.translate(this.mvMatrix, [this.bullets[i].xPos, this.bullets[i].yPos, 0]);
        gl.activeTexture(gl.TEXTURE0);
        //gl.bindTexture(gl.TEXTURE_2D, this.models[i].texture);
        gl.bindTexture(gl.TEXTURE_2D, textures[1]);
        //gl.uniform1i(shaderProgram.samplerUniform, 0);
        mat4.rotate(this.mvMatrix, this.degToRad(this.xRot), [0.0, 0.0, 1.0]);
        gl.uniform3f(shaderProgram.colorUniform, 1, 0, 0);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.bullets[i].texturePositionBuffer);
        gl.vertexAttribPointer(shaderProgram.textureCoordAttribute, this.bullets[i].texturePositionBuffer.itemSize, gl.FLOAT, false, 0, 0);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.bullets[i].normalPositionBuffer);
        gl.vertexAttribPointer(shaderProgram.aVertexNormal, this.bullets[i].normalPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.bullets[i].vertexPositionBuffer);
        gl.vertexAttribPointer(shaderProgram.aVertexPosition, this.bullets[i].vertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.bullets[i].indexPositionBuffer);
        this.setMatrixUniforms();
        gl.drawElements(gl.TRIANGLES, this.bullets[i].indexPositionBuffer.numItems, gl.UNSIGNED_SHORT, 0);
        this.mvPopMatrix();
    }

}


Game.prototype.drawSun2 = function () {


    this.mvPushMatrix();



    mat4.translate(this.mvMatrix, [0,0,0]);
    mat4.rotate(this.mvMatrix, this.degToRad(this.xRot), [1, 1, 1]);
    //mat4.scale(this.mvMatrix,[5, 5,5]);

    gl.uniform1f(shaderProgram.uMaterialShininess,200.0);

    gl.bindBuffer(gl.ARRAY_BUFFER, this.sun.vertexPositionBuffer);
    gl.vertexAttribPointer(shaderProgram.aVertexPosition, 3, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, this.sun.normalPositionBuffer);
    gl.vertexAttribPointer(shaderProgram.aVertexNormal, 3, gl.FLOAT, false, 0, 0);


    gl.bindBuffer(gl.ARRAY_BUFFER, this.sun.texturePositionBuffer);
    gl.vertexAttribPointer(shaderProgram.textureCoordAttribute, 2, gl.FLOAT, false, 0, 0);
    gl.activeTexture(gl.TEXTURE0);

    //textures are in global variable and we just get it by index after ship and bullet
    gl.bindTexture(gl.TEXTURE_2D, this.sun.texture);
    gl.uniform1i(shaderProgram.samplerUniform, 0);




    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.sun.indexPositionBuffer);
    this.setMatrixUniforms();
    gl.drawElements(gl.TRIANGLES, this.sun.indexPositionBuffer.numItems, gl.UNSIGNED_SHORT, 0);

    this.mvPopMatrix();


}


Game.prototype.drawSun = function () {


    this.mvPushMatrix();

    var x = $('#slider-x').slider("value");
    var y = $('#slider-y').slider("value");
    var z = $('#slider-z').slider("value");

    mat4.translate(this.mvMatrix, [x,y,z]);

    mat4.scale(this.mvMatrix,[5, 5,5]);

    gl.uniform1f(shaderProgram.uMaterialShininess,200.0);

    gl.bindBuffer(gl.ARRAY_BUFFER, this.sun.vertexPositionBuffer);
    gl.vertexAttribPointer(shaderProgram.aVertexPosition, 3, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, this.sun.normalPositionBuffer);
    gl.vertexAttribPointer(shaderProgram.aVertexNormal, 3, gl.FLOAT, false, 0, 0);


    gl.bindBuffer(gl.ARRAY_BUFFER, this.sun.texturePositionBuffer);
    gl.vertexAttribPointer(shaderProgram.textureCoordAttribute, 2, gl.FLOAT, false, 0, 0);

    gl.activeTexture(gl.TEXTURE0);

    //textures are in global variable and we just get it by index after ship and bullet
    gl.bindTexture(gl.TEXTURE_2D, this.sun.texture);
    gl.uniform1i(shaderProgram.samplerUniform, 0);



    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.sun.indexPositionBuffer);
    this.setMatrixUniforms();
    gl.drawElements(gl.TRIANGLES, this.sun.indexPositionBuffer.numItems, gl.UNSIGNED_SHORT, 0);

    this.mvPopMatrix();


}


Game.prototype.drawAsteroids = function () {
    for (var i = 0; i < this.asteroids.length; i++) {

        this.mvPushMatrix();
        mat4.translate(this.mvMatrix, [this.asteroids[i].xPos, this.asteroids[i].yPos, 0]);
        mat4.scale(this.mvMatrix,[4, 4,4]);
        mat4.rotate(this.mvMatrix, this.degToRad(this.xRot), [1, 1, 1]);


        gl.uniform1f(shaderProgram.uMaterialShininess,200.0);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.asteroids[i].vertexPositionBuffer);
        gl.vertexAttribPointer(shaderProgram.aVertexPosition, 3, gl.FLOAT, false, 0, 0);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.asteroids[i].texturePositionBuffer);
        gl.vertexAttribPointer(shaderProgram.textureCoordAttribute, 2, gl.FLOAT, false, 0, 0);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.asteroids[i].normalPositionBuffer);
        gl.vertexAttribPointer(shaderProgram.aVertexNormal, 3, gl.FLOAT, false, 0, 0);

        gl.activeTexture(gl.TEXTURE0);
        //textures are in global variable and we just get it by index after ship and bullet
        gl.bindTexture(gl.TEXTURE_2D, this.asteroids[i].texture);
        gl.uniform1i(shaderProgram.samplerUniform, 0);





        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.asteroids[i].indexPositionBuffer);

        this.setMatrixUniforms();
        gl.drawElements(gl.TRIANGLES, this.asteroids[i].indexPositionBuffer.numItems, gl.UNSIGNED_SHORT, 0);

        this.mvPopMatrix();
    }

}


Game.prototype.drawScene = function () {


    gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);


    mat4.perspective(60, gl.viewportWidth / gl.viewportHeight, 0.1, 1000.0, this.pMatrix);

    //Light uniforms
    var x = $('#slider-x').slider("value");
    var y = $('#slider-y').slider("value");
    var z = $('#slider-z').slider("value");

    gl.uniform3f(shaderProgram.uLightPosition, x, y, z);
    gl.uniform3f(shaderProgram.uLightAmbient, 0, 0, 0);
    gl.uniform3f(shaderProgram.uLightDiffuse, 0.8, 0.8, 0.8);
    gl.uniform3f(shaderProgram.uLightSpecular, 0.8, 0.8, 0.8);



    gl.uniform1f(shaderProgram.uMaterialShininess,200.0);

    mat4.identity(this.mvMatrix);




    //blending
    //gl.blendFunc(gl.SRC_ALPHA, gl.ONE);
    //gl.enable(gl.BLEND);

    //gl.uniform1f(shaderProgram.alphaUniform, parseFloat(1));

    //gl.uniform1i(shaderProgram.useLightingUniform, true);


    mat4.translate(this.mvMatrix, [0.0, 0.0, -100.0]);


    this.drawShip();
    //this.drawBullets();
    this.drawAsteroids();
    this.drawSun();
   // this.drawSun2();
    this.drawBackground();


}


Game.prototype.setMatrixUniforms = function () {
    gl.uniformMatrix4fv(shaderProgram.uPMatrix, false, this.pMatrix);
    gl.uniformMatrix4fv(shaderProgram.uMVMatrix, false, this.mvMatrix);

    var normalMatrix = mat3.create();
    mat4.toInverseMat3(this.mvMatrix, normalMatrix);
    mat3.transpose(normalMatrix);
    gl.uniformMatrix3fv(shaderProgram.uNMatrix, false, normalMatrix);


}


Game.prototype.mvPushMatrix = function () {
    var copy = mat4.create();
    mat4.set(this.mvMatrix, copy);
    this.mvMatrixStack.push(copy);
};

Game.prototype.mvPopMatrix = function () {
    if (this.mvMatrixStack.length == 0) {
        throw "Invalid popMatrix!";
    }
    this.mvMatrix = this.mvMatrixStack.pop();

}




Game.prototype.randomIntFromInterval = function (min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}


Game.prototype.init = function (canvas) {
    this.initGL(canvas);
    initShaders();
    //gl.enable(gl.CULL_FACE);
    //gl.enable(gl.BLEND);
    gl.clearColor(0.3, 0.3, 0.3, 1.0);
    gl.enable(gl.DEPTH_TEST);


    this.ship = new Model('ship');

    this.background = new Model('background');


    this.sun = new Model('asteroid');

    var asteroid;
    var randomnumberRot = 0;
    var randomnumberX = 0;
    var randomnumberY = 0;
    for (i = 0; i < 10; i++)
    {
         asteroid = new Model('asteroid');

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
        asteroid.xPos = randomnumberX;
        asteroid.yPos = randomnumberY;
        asteroid.rotation = randomnumberRot;





        this.asteroids.push(asteroid);
    }



















    //alert(this.ship.texture.loaded);
    //var something=this.ship.texture.loaded;
    /*
     var something_cachedValue = this.ship.loadedTexture;
     var that = this;
     function doStuff() {

     if(that.ship.textureLoaded === something_cachedValue) {

     setTimeout(doStuff, 50);//wait 50 millisecnds then recheck
     return;
     }



     something_cachedValue=that.ship.loadedTexture;




     }

     doStuff();
     */



    this.tick();
    /*

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





     }
     */


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





