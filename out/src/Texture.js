var Texture = function Texture(name) {
  "use strict";
  this.name = name;
  this.loadedTexture = null;
  this.loaded = 0;
  this.initTexture(this.name);
};
($traceurRuntime.createClass)(Texture, {
  handleLoadedTexture: function() {
    "use strict";
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.bindTexture(gl.TEXTURE_2D, this.loadedTexture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, this.loadedTexture.image);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.bindTexture(gl.TEXTURE_2D, null);
    this.loaded = 1;
  },
  initTexture: function(name) {
    "use strict";
    this.loadedTexture = gl.createTexture();
    this.loadedTexture.image = new Image();
    this.loadedTexture.image.onload = this.handleLoadedTexture.bind(this);
    this.loadedTexture.image.src = 'resources/images/' + name + '.png';
  }
}, {});
