class Model
{
  //============================================================================
  // Getters/setters
  //============================================================================
  get name() { return this._name; }
  get size() { return this._size; }

  //============================================================================
  // Constructor
  //============================================================================
  constructor(name)
  {
    this._name = name;

    this._size = -1;
    this._colours = null;
    this._vertices = null;
    this._bCoordinates = null;
  }

  bindBuffers(gl)
  {
    // Create and bind the buffers
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, this._vertices, gl.STATIC_DRAW);

    const barycenterBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, barycenterBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, this._bCoordinates, gl.STATIC_DRAW);

    const colourBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, colourBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, this._colours, gl.STATIC_DRAW);

    const indexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    let indexData = new Uint16Array(seq(0, this._size));
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indexData, gl.STATIC_DRAW);

    this.clean();

    // Return the buffer object
    return {position:   positionBuffer,
            barycenter: barycenterBuffer,
            colour:     colourBuffer,
            index:      indexBuffer};
  }

  clean()
  {
    this._colours = null;
    this._vertices = null;
    this._bCoordinates = null;
  }

  _initVertices(size)
  {
    this._size = size;
    this._colours = new Float32Array(this._size * 3);
    this._vertices = new Float32Array(this._size * 3);
    this._bCoordinates = new Float32Array(this._size * 3);
  }
}