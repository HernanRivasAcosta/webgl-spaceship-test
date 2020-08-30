class TerrainModel extends Model
{

  getHeight(x, y)
  {
    // TODO: This function doesn't work because the 4 points of the quad are not
    // coplanar
    let i = Math.floor(x / (this._w * this._s));
    let j = Math.floor(y / (this._w * this._s));
    return (this.getHeight(i, j) + this.getHeight(i + 1, j + 1)) / 2;
  }

  constructor(w, h, s, seed)
  {
    super('terrain');

    this._w = w;
    this._h = h;
    this._s = enclosingPowerOf2(s);
    this._heightMap = null;
    this._seed = seed;
    this._generate();
  }

  _generate()
  {
    this._heightMap = new HeightMap(this._s + 1, this._seed);

    this._initVertices(2 * 4 * this._s * this._s);

    let bCoordinates = [1.0, 0.0, 0.0,
                        1.0, 1.0, 0.0,
                        0.0, 0.0, 1.0,
                        1.0, 0.0, 0.0,
                        0.0, 1.0, 1.0,
                        0.0, 0.0, 1.0];
    bCoordinates = bCoordinates.concat(bCoordinates, bCoordinates);

    let n;
    let l = this._s;
    for (let i = 0; i < l; i++)
    {
      for (let j = 0; j < l; j++)
      {
        // Vertex data
        n = 6 * 3 * (i * l + j);
        this._vertices.set(this._getVertextCoordinates(i, j),
                           n);
        this._vertices.set(this._getVertextCoordinates(i + 1, j),
                           n + 3);
        this._vertices.set(this._getVertextCoordinates(i, j + 1),
                           n + 6);

        this._vertices.set(this._getVertextCoordinates(i, j + 1),
                           n + 9);
        this._vertices.set(this._getVertextCoordinates(i + 1, j),
                           n + 12);
        this._vertices.set(this._getVertextCoordinates(i + 1, j + 1),
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

  _getVertextCoordinates(i, j)
  {
    return [(i - (this._s >> 1)) * (this._w / this._s),
            (j - (this._s >> 1)) * (this._w / this._s),
            this._getHeight(i, j)];
  }

  _getHeight(i, j)
  {
    let h = this._heightMap.getHeight(i, j);
    return h * this._h;
  }
}