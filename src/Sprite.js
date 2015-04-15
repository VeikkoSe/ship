class Sprite {
    constructor(url, pos, size, speed, frames, dir, once) {

            this.pos = pos;
            this.size = size;
            this.speed = typeof speed === 'number' ? speed : 0;
            this.frames = frames;
            this._index = 0;
            this.url = url;
            this.dir = dir || 'horizontal';
            this.once = once;
        };


    render(image) {
        // Get A WebGL context
        /*
        var canvas = document.getElementById("canvas");
        var gl = getWebGLContext(canvas);
        if (!gl) {
            return;
        }

        // setup GLSL program
        var program = createProgramFromScripts(gl, ["2d-vertex-shader", "2d-fragment-shader"]);
        gl.useProgram(program);

        // look up where the vertex data needs to go.
        var positionLocation = gl.getAttribLocation(program, "a_position");
        var texCoordLocation = gl.getAttribLocation(program, "a_texCoord");
*/
        // provide texture coordinates for the rectangle.
        var texCoordBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, texCoordBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
            0.0,  0.0,
            1.0,  0.0,
            0.0,  1.0,
            0.0,  1.0,
            1.0,  0.0,
            1.0,  1.0]), gl.STATIC_DRAW);
        //gl.enableVertexAttribArray(texCoordLocation);
        //gl.vertexAttribPointer(texCoordLocation, 2, gl.FLOAT, false, 0, 0);

        // Create a texture.
        var texture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, texture);

        // Set the parameters so we can render any size image.
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

        // Upload the image into the texture.
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);

        // lookup uniforms
        //var resolutionLocation = gl.getUniformLocation(program, "u_resolution");

        // set the resolution
        //gl.uniform2f(resolutionLocation, canvas.width, canvas.height);

        // Create a buffer for the position of the rectangle corners.
        var buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.enableVertexAttribArray(positionLocation);
        gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

        // Set a rectangle the same size as the image.
        setRectangle(gl, 0, 0, image.width, image.height);

        // Draw the rectangle.
        gl.drawArrays(gl.TRIANGLES, 0, 6);
    }

}




