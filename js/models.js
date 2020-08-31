class Model
{
  //============================================================================
  // Getters/setters
  //============================================================================
  get name() { return this._name; }
  get size() { return this._size; }

  //============================================================================
  // API
  //============================================================================
  constructor(name)
  {
    this._name = name;

    this._size = -1;
    this._colours = null;
    this._vertices = null;
    this._bCoordinates = null;

    this._positionBuffer = null;
    this._barycenterBuffer = null;
    this._colourBuffer = null;
    this._indexBuffer = null;
  }

  bindBuffers(gl)
  {
    // Create and bind the buffers
    this._positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this._positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, this._vertices, gl.STATIC_DRAW);

    this._barycenterBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this._barycenterBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, this._bCoordinates, gl.STATIC_DRAW);

    this._colourBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this._colourBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, this._colours, gl.STATIC_DRAW);

    this._indexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this._indexBuffer);
    let indexData = new Uint16Array(seq(0, this._size));
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indexData, gl.STATIC_DRAW);

    this._colours = null;
    //this._vertices = null;
    this._bCoordinates = null;

    // Return the buffer object
    return {position:   this._positionBuffer,
            barycenter: this._barycenterBuffer,
            colour:     this._colourBuffer,
            index:      this._indexBuffer};
  }

  unbindBuffers(gl)
  {
    gl.deleteBuffer(this._positionBuffer);
    gl.deleteBuffer(this._barycenterBuffer);
    gl.deleteBuffer(this._colourBuffer);
    gl.deleteBuffer(this._indexBuffer);

    this._positionBuffer = null;
    this._barycenterBuffer = null;
    this._colourBuffer = null;
    this._indexBuffer = null;
  }

  //============================================================================
  // Internal functions
  //============================================================================
  _initVertices(size)
  {
    this._size = size;
    this._colours = new Float32Array(this._size * 3);
    this._vertices = new Float32Array(this._size * 3);
    this._bCoordinates = new Float32Array(this._size * 3);
  }
}