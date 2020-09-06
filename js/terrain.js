class TerrainModel
{

  get tileSize() { return this._w; }
  get chunkSize() { return this._chunkSize; }

  getCurrentChunk()
  {
    return '(' + this._px + ', ' + this._py + ')';
  }

  // Tile width, max height, chunk size, the player object and the renderer
  constructor(w, mh, s, seed, player, renderer)
  {
    this._w = w;
    this._mh = mh;
    this._s = s;
    this._chunkSize = this._w * this._s;
    this._seed = seed;
    noise.seed(seed);
    this._player = player;
    this._renderer = renderer;

    this._chunks = {};
    this._chunkCache = {};

    // Initialise the previous position of the character
    this._px = 0;
    this._py = 0;
  }

  update(delta)
  {
    // The chunk under the player
    let cx = Math.floor(this._player.x / this._chunkSize);
    let cy = Math.floor(this._player.y / this._chunkSize);

    // Get the radius of chunks we need to write
    let r = Math.ceil(this._renderer.drawDistance / this._chunkSize);

    this._createChunksAround(cx, cy, r);
    this._clearOldChunks(cx, cy, r);
    this._px = cx;
    this._py = cy;
  }

  //============================================================================
  // Internal functions
  //============================================================================
  _createChunksAround(cx, cy, r)
  {
    for (let dx = -r; dx <= r; dx++)
      for (let dy = -r; dy <= r; dy++)
        this._createChunk(cx + dx, cy + dy);
  }

  _createChunk(cx, cy)
  {
    // Don't create an already existing chunk
    if (this._chunks[[cx, cy]])
      return;
    // Create a model and add it to the render queue
    let chunkModel = new Chunk(cx, cy, this._w, this._mh, this._s);
    let chunk = new Drawable(chunkModel);
    this._renderer.addObject(chunk);
    // Store the chunk
    this._chunks[[cx, cy]] = chunk;
  }

  _clearOldChunks(cx, cy, r)
  {
    for (let dx = -r; dx <= r; dx++)
      for (let dy = -r; dy <= r; dy++)
      {
        // Get the position of all the previous chunks
        let x = this._px + dx;
        let y = this._py + dy;
        // Remove all chunks farther away than r
        if (Math.abs(x - cx) > r || Math.abs(y - cy) > r)
          this._deleteChunk(x, y);
      }
  }

  _deleteChunk(cx, cy)
  {
    // Moving diagonally might make us try to remove the same chunk twice
    if (!this._chunks[[cx, cy]])
      return;
    // Remove from the render queue
    this._renderer.removeObject(this._chunks[[cx, cy]]);
    // Delete from the array
    delete this._chunks[[cx, cy]];
  }

}

class Chunk extends Model
{

  constructor(cx, cy, w, mh, s)
  {
    super('chunk(' + cx + ',' + cy + ')');

    this._cx = cx;
    this._cy = cy;
    this._w = w;
    this._s = s;

    // Sets the levels of noise we want to use
    this._noiseLevels = [[1/30, 1],
                         [1/20, 0.5],
                         [1/10, 0.4],
                         [1,    0.07]];
    // Calculate the max height we can reach with our noise functions
    let maxHeight = 0;
    let l = this._noiseLevels.length;
    for (let i = 0; i < l; i++)
      maxHeight += this._noiseLevels[i][1];
    // We already have the maximum height the world should reach, we multiply it
    // by the inverse of the maximum height from our noise function to make sure
    // we don't go over
    this._hmm = 1 / maxHeight;

    this._mh = mh;

    this._generate();
  }

  _generate()
  {
    // The total amount of vertices is given by the 2 tris per quad times by the
    // 3 vertices per tri times the number of quads (the square of the quads per
    // side)
    this._initVertices(2 * 3 * this._s * this._s, [0.8, 0.9, 1.0]);

    let n;
    let s = this._s;
    for (let x = 0; x < s; x++)
    {
      for (let y = 0; y < s; y++)
      {
        // Vertex data
        n = 6 * 3 * (x * s + y);

        this._vertices.set([this._getCoordinates(x, y),
                            this._getCoordinates(x + 1, y),
                            this._getCoordinates(x, y + 1),
                            this._getCoordinates(x, y + 1),
                            this._getCoordinates(x + 1, y),
                            this._getCoordinates(x + 1, y + 1)].flat(), n);
      }
    }
  }

  _getCoordinates(x, y)
  {
    x += this._cx * this._s;
    y += this._cy * this._s;
    return [x * -this._w,
            y * this._w,
            this._getHeight(-x, y)];
  }

  _getHeight(x, y)
  {
    let h = 0;
    let l = this._noiseLevels.length;
    for (let i = 0; i < l; i++)
    {
      let [level, multiplier] = this._noiseLevels[i];
      h += (noise.simplex2(x * level, y * level) + 1) * 0.5 * multiplier;
    }

    h = h * this._hmm;
    let cutoff = 0.5;
    if (h < cutoff)
      h = noise.simplex2(x, y) * 0.01;
    else
      h = (h - cutoff) * 1 / (1 - cutoff);

    return h * this._mh;
  }
}