class TerrainModel extends Model
{
  constructor(w, h, s)
  {
    super('terrain');

    this._w = w;
    this._h = h;
    this._s = s;
    this._a = [];
    this._generate();
  }

  _generate()
  {
    this._a = [];

    // Create an empty map
    let l = this._s * this._s;
    for (let i = 0; i < l; i++)
    {
      this._a[i] = 0.0;
    }

    let x, y, h;
    for (let i = 0; i < l; i++)
    {
      x = Math.floor(Math.random() * this._s);
      y = Math.floor(Math.random() * this._s);
      h = (Math.random() + Math.random() - 1.0) * 4.0;

      this._addHeight(x, y, 1 * h);
    }

    this._update();
  }

  _addHeight(i, j, h)
  {
    if (i >= 0 && j >= 0 && i < this._s && j < this._s && (h > .1 || h < -.1))
    {
      this._a[i * this._s + j] += h;
      let decay = 0.5;

      this._addHeight(i + 1, j, h * decay);
      this._addHeight(i - 1, j, h * decay);
      this._addHeight(i, j + 1, h * decay);
      this._addHeight(i, j - 1, h * decay);
    }
  }

  _getHeight(i, j)
  {
    if (i < 0 || j < 0 || i >= this._s || j >= this._s)
      return null;
    else
      return this._a[i * this._s + j];
  }

  _getVertextCoordinates(i, j)
  {
    return [(i - (this._s - 1) / 2) * (this._w / this._s),
            (j - (this._s - 1) / 2) * (this._h / this._s),
            this._getHeight(i, j) * 3.0];
  }

  _update()
  {
    this._initVertices(2 * 4 * this._s * (this._s - 1));

    let n;
    let l = this._s - 1;
    for (let i = 0; i < l; i++)
    {
      for (let j = 0; j < l; j++)
      {
        // Vertex data
        n = 6 * 3 * (i * l + j);
        this._vertices.set(this._getVertextCoordinates(i, j), n);
        this._vertices.set(this._getVertextCoordinates(i + 1, j), n + 3);
        this._vertices.set(this._getVertextCoordinates(i, j + 1), n + 6);

        this._vertices.set(this._getVertextCoordinates(i, j + 1), n + 9);
        this._vertices.set(this._getVertextCoordinates(i + 1, j), n + 12);
        this._vertices.set(this._getVertextCoordinates(i + 1, j + 1), n + 15);

        // Barycentric data
        this._bCoordinates.set([1.0, 0.0, 0.0,
                                1.0, 1.0, 1.0,
                                0.0, 0.0, 1.0,
                                1.0, 0.0, 0.0,
                                1.0, 1.0, 1.0,
                                0.0, 0.0, 1.0,
                                1.0, 0.0, 0.0,
                                1.0, 1.0, 1.0,
                                0.0, 0.0, 1.0,
                                1.0, 0.0, 0.0,
                                1.0, 1.0, 1.0,
                                0.0, 0.0, 1.0,
                                1.0, 0.0, 0.0,
                                1.0, 1.0, 1.0,
                                0.0, 0.0, 1.0,
                                1.0, 0.0, 0.0,
                                1.0, 1.0, 1.0,
                                0.0, 0.0, 1.0], n);

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
}