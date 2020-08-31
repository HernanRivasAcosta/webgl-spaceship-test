class TerrainModel
{

  get tileSize() { return this._w; }
  get chunkSize() { return this._w * this._s; }

  getCurrentChunk()
  {
    let c = this.chunkSize;
    return '(' + Math.floor(this._player.x / c) + ', ' +
                 Math.floor(this._player.y / c) + ')';
  }

  // Tile width, max height, chunk size, the player object and the renderer
  constructor(w, mh, s, seed, player, renderer)
  {
    this._w = w;
    this._mh = mh;
    this._s = s;
    this._seed = seed;
    noise.seed(seed);
    this._player = player;
    this._renderer = renderer;

    this._chunks = {};

    // Initialise the previous position of the character
    this._px = 0;
    this._py = 0;
  }

  update(delta)
  {
    // Ensure all the required chunks exist
    let c = this.chunkSize;
    let cx = Math.floor(this._player.x / c);
    let cy = Math.floor(this._player.y / c);

    this._createChunksAround(cx, cy);
    this._clearOldChunks(cx, cy);
    this._px = cx;
    this._py = cy;
  }

  //============================================================================
  // Internal functions
  //============================================================================
  _createChunksAround(cx, cy)
  {
    for (let dx = -1; dx <= 1; dx++)
      for (let dy = -1; dy <= 1; dy++)
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

  _clearOldChunks(cx, cy)
  {
    for (let dx = -1; dx <= 1; dx++)
      for (let dy = -1; dy <= 1; dy++)
      {
        // Get the position of all the previous chunks
        let x = this._px + dx;
        let y = this._py + dy;
        // If the distance to the current position is larger than one, then this
        // chunk existed on the previous position and not in the current one, so
        // we can just delete it
        if (Math.abs(x - cx) > 1 || Math.abs(y - cy) > 1)
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
    super('chunk' + cx + '-' + cy);

    this._cx = cx;
    this._cy = cy;
    this._w = w;
    this._s = s;

    // Sets the levels of noise we want to use
    this._noiseLevels = [[1/30, 1],
                         [1/20, 0.5],
                         [1/10, 0.4],
                         [1,    0.12]];
    // Calculate the max height we can reach with our noise functions
    let maxHeight = 0;
    let l = this._noiseLevels.length;
    for (let i = 0; i < l; i++)
      maxHeight += this._noiseLevels[i][1];
    // We already have the maximum height the world should reach, we multiply it
    // by the inverse of the maximum height from our noise function to make sure
    // we don't go over
    this._mh = mh * 1 / maxHeight;

    this._generate();
  }

  _generate()
  {
    this._initVertices(2 * 4 * this._s * this._s);

    let bCoordinates = [1.0, 0.0, 0.0,
                        1.0, 1.0, 0.0,
                        0.0, 0.0, 1.0,
                        1.0, 0.0, 0.0,
                        0.0, 1.0, 1.0,
                        0.0, 0.0, 1.0];
    bCoordinates = bCoordinates.concat(bCoordinates, bCoordinates);

    let n;
    let s = this._s;
    for (let x = 0; x < s; x++)
    {
      for (let y = 0; y < s; y++)
      {
        // Vertex data
        n = 6 * 3 * (x * s + y);
        this._vertices.set(this._getVertextCoordinates(x, y),
                           n);
        this._vertices.set(this._getVertextCoordinates(x + 1, y),
                           n + 3);
        this._vertices.set(this._getVertextCoordinates(x, y + 1),
                           n + 6);

        this._vertices.set(this._getVertextCoordinates(x, y + 1),
                           n + 9);
        this._vertices.set(this._getVertextCoordinates(x + 1, y),
                           n + 12);
        this._vertices.set(this._getVertextCoordinates(x + 1, y + 1),
                           n + 15);

        // Barycentric data
        this._bCoordinates.set(bCoordinates, n);

        // Colour data
        let r = 0.8;
        let g = 0.9;
        let b = 1.0;
        this._colours.set([r, g, b,
                           r, g, b,
                           r, g, b,
                           r, g, b,
                           r, g, b,
                           r, g, b,
                           r, g, b,
                           r, g, b,
                           r, g, b,
                           r, g, b,
                           r, g, b,
                           r, g, b,
                           r, g, b,
                           r, g, b,
                           r, g, b,
                           r, g, b,
                           r, g, b,
                           r, g, b], n);
      }
    }
  }

  _getVertextCoordinates(x, y)
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
    return h * this._mh;
  }
}