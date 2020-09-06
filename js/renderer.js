class Renderer
{
  //============================================================================
  // Getters/setters
  //============================================================================
  get width() { return this._w; }
  get height() { return this._h; }
  get aspectRatio() { return this._ar; }

  get camera() { return this._camera; }
  set camera(camera) { this._camera = camera; }

  get drawDistance() { return this._drawDistance; }

  //============================================================================
  // Constructor
  //============================================================================
  constructor(win, doc, assets, drawDistance)
  {
    this._drawDistance = drawDistance;
    this._assets = assets;

    // Get the main properties
    this._w = win.innerWidth;
    this._h = win.innerHeight;
    this._w2 = enclosingPowerOf2(this._w);
    this._h2 = enclosingPowerOf2(this._h);

    this._ar = this._w / this._h; // Aspect ratio

    this._shaderVars = {'DRAW_DISTANCE': this._drawDistance + '.0',
                        'RATIO_X': this._w / this._w2,
                        'RATIO_Y': this._h / this._h2,
                        'WIDTH': this._w2,
                        'HEIGHT': this._h2};

    let canvas = doc.querySelector('#viewport');
    canvas.width = this._w;
    canvas.height = this._h;
    this._gl = canvas.getContext('webgl2');
    if (!this._gl)
    {
      throw 'Unable to initialize WebGL';
      return;
    }

    this._mainProgram = this._createMainProgram(this._gl);
    this._postProcessProgram = this._createPostProcessProgram(this._gl);

    if (!this._mainProgram || !this._postProcessProgram)
    {
      throw 'Unable to initialize WebGL';
    }

    this._initFrameBuffer(this._gl);

    this._models = {};
    this._objects = [];

    this._camera = null;
  }

  update(delta)
  {
    this._render(this._gl, delta);
    this._postProcess(this._gl, delta);
  }

  addObject(drawable)
  {
    this._objects[this._objects.length] = drawable;

    let model = drawable.model;
    if (!this._models[drawable.model.name])
    {
      this._models[drawable.model.name] = model.bindBuffers(this._gl);
    }
  }

  removeObject(drawable)
  {
    let l = this._objects.length;
    for (let i = 0; i < l; i++)
    {
      // Find the object to remove
      if (this._objects[i] == drawable)
      {
        // We found the object, the length of the array goes down by one
        l--;
        // Remove the last element of the list
        let temp = this._objects.pop();
        // And put it in the place of the removed object (unless the last object
        // in the list is the one we were trying to remove)
        if (temp != drawable)
          this._objects[i] = temp;
        // Unbind the buffers
        // TODO: Only unbind if there are no other objects reusing the model
        delete this._models[drawable.model.name];
        drawable.unbindBuffers(this._gl);
        return;
      }
    }
  }

  //============================================================================
  // Internal functions
  //============================================================================
  _createMainProgram(gl)
  {
    // Load the shaders
    let vs = loadVertexShader(gl, this._getShaderSource('main.vert'), this._shaderVars);
    let fs = loadFragmentShader(gl, this._getShaderSource('main.frag'), this._shaderVars);

    // Create the program
    let program = gl.createProgram();
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);

    console.log('Main program compile log: ' + gl.getProgramInfoLog(program));
    if (!gl.getProgramParameter(program, gl.LINK_STATUS))
    {
      return null;
    }

    let attribs = ['vertexPosition', 'vertexColor', 'vertexCenter'];
    let uniforms = ['projectionMatrix', 'modelMatrix'];

    return {program: program,
            attribs: this._buildAttribLocations(gl, program, attribs),
            uniforms: this._buildUniformLocations(gl, program, uniforms)};
  }

  _createPostProcessProgram(gl)
  {
    // Load the shaders
    let vs = loadVertexShader(gl, this._getShaderSource('post_process.vert'), this._shaderVars);
    let fs = loadFragmentShader(gl, this._getShaderSource('post_process.frag'), this._shaderVars);

    // Create the program
    let program = gl.createProgram();
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);

    console.log('Glow program compile log: ' + gl.getProgramInfoLog(program));
    if (!gl.getProgramParameter(program, gl.LINK_STATUS))
    {
      return null;
    }

    let attribs = ['vertexPosition'];
    let uniforms = ['uSampler'];

    return {program: program,
            attribs: this._buildAttribLocations(gl, program, attribs),
            uniforms: this._buildUniformLocations(gl, program, uniforms)};
  }

  _getShaderSource(name)
  {
    let source = this._assets.getAssetByName(name);
    let keys = Object.keys(this._shaderVars);
    let l = keys.length;
    for (let i = 0; i < l; i++)
    {
      let k = keys[i];
      source = source.replace(k, this._shaderVars[k]);
    }
    return source;
  }

  _buildAttribLocations(gl, program, list)
  {
    let a = {};

    let l = list.length;
    for (let i = 0; i < l; i++)
    {
      a[list[i]] = gl.getAttribLocation(program, list[i]);
    }

    return a;
  }

  _buildUniformLocations(gl, program, list)
  {
    let a = {};

    let l = list.length;
    for (let i = 0; i < l; i++)
    {
      a[list[i]] = gl.getUniformLocation(program, list[i]);
    }

    return a;
  }

  _initFrameBuffer(gl)
  {
    // Initial variables
    const w = this._w2;
    const h = this._h2;

    // Objects used by the buffer
    this._frameBuffer = gl.createFramebuffer();
    this._frameTexture = gl.createTexture();
    this._renderBuffer = gl.createRenderbuffer();
    this._positionBuffer = gl.createBuffer();
    this._indexBuffer = gl.createBuffer();

    gl.bindFramebuffer(gl.FRAMEBUFFER, this._frameBuffer);
    this._frameBuffer.width = w;
    this._frameBuffer.height = h;

    gl.bindTexture(gl.TEXTURE_2D, this._frameTexture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER,
                     gl.LINEAR_MIPMAP_NEAREST);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, w, h, 0, gl.RGBA, gl.UNSIGNED_BYTE,
                  null);
    gl.generateMipmap(gl.TEXTURE_2D);

    gl.bindRenderbuffer(gl.RENDERBUFFER, this._renderBuffer);
    gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, w, h);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0,
                            gl.TEXTURE_2D, this._frameTexture, 0);
    gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT,
                               gl.RENDERBUFFER, this._renderBuffer);

    gl.bindBuffer(gl.ARRAY_BUFFER, this._positionBuffer);
    let positionData = new Float32Array([-1, 1, -1, -1, 1, -1, 1, 1])
    gl.bufferData(gl.ARRAY_BUFFER, positionData, gl.STATIC_DRAW);

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this._indexBuffer);
    let indexData = new Uint16Array([3, 2, 1, 3, 1, 0]);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indexData, gl.STATIC_DRAW);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
  }

  _render(gl, delta)
  {
    const w = this._w2;
    const h = this._h2;

    // Bind the frame buffer
    gl.useProgram(this._mainProgram.program);
    gl.bindFramebuffer(gl.FRAMEBUFFER, this._frameBuffer);

    // Clear the screen
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clearDepth(1.0);
    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    let l = this._objects.length;
    for (let i = 0; i < l; i++)
    {
      this._draw(gl, this._objects[i]);
    }
  }

  _draw(gl, drawable)
  {
    // Projection and model matrices
    const projectionMatrix = this._camera.getMatrix(this);
    const modelMatrix = drawable.getMatrix(this);

    // Buffers
    let buffers = this._models[drawable.model.name];

    // Bind the positions
    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.position);
    gl.vertexAttribPointer(this._mainProgram.attribs.vertexPosition,
                           3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(this._mainProgram.attribs.vertexPosition);

    // Bind the barycentric coordinates
    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.barycenter);
    gl.vertexAttribPointer(this._mainProgram.attribs.vertexCenter,
                           3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(this._mainProgram.attribs.vertexCenter);

    // Bind the colours
    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.colour);
    gl.vertexAttribPointer(this._mainProgram.attribs.vertexColor,
                           3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(this._mainProgram.attribs.vertexColor);

    // Bind the index
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffers.index);

    gl.uniformMatrix4fv(this._mainProgram.uniforms.projectionMatrix,
                        false, projectionMatrix);
    gl.uniformMatrix4fv(this._mainProgram.uniforms.modelMatrix,
                        false, modelMatrix);

    // Draw to frame buffer
    gl.drawElements(gl.TRIANGLES, drawable.model.size, gl.UNSIGNED_SHORT, 0);
  }

  _postProcess(gl, delta)
  {
    // Switch to the screen buffer and the glow program
    gl.useProgram(this._postProcessProgram.program);
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);

    // Clear the screen
    gl.clearColor(0.0, 0.0, 1.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    // Bind the buffers
    gl.bindBuffer(gl.ARRAY_BUFFER, this._positionBuffer);
    gl.vertexAttribPointer(this._postProcessProgram.attribs.vertexPosition,
                           2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(this._postProcessProgram.attribs.vertexPosition);

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this._indexBuffer);

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, this._frameTexture);
    gl.generateMipmap(gl.TEXTURE_2D);
    gl.uniform1i(this._postProcessProgram.uniforms.texture, 0);

    // Draw to the sreen buffer
    gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);
  }
}