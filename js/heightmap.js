class HeightMap
{
  constructor(size, seed = null)
  {
    // Ensure the size is given as (N^2+1)
    size--;
    if (size & (size - 1))
    {
      this._size = 1;
      while(size)
      {
        this._size <<= 1;
        size >>= 1;
      }
      this._size = (this._size) | 1;
    }
    else
    {
      this._size = size + 1;
    }
    this._hsize = this._size * 0.5;

    // Initialise the prng
    this._prng = new Rand(seed);

    // Create the map
    this._a = [];
    this._l = this._size * this._size;

    this._min = 99999;
    this._max = -99999;

    // Generate the terrain
    this._generateTerrain();
  }

  _generateTerrain()
  {
    // Initialises the map array
    for (let i = 0; i < this._l; i++)
    {
      this._a[i] = 0;
    }

    // Set the height of the centre of the map
    this._a[this._l >> 1] = this._prng.float() * 3 + 2;

    // Get the initial terrain with DiamondSquare
    this._diamondSquare();

    this._normalise();
  }

  _diamondSquare()
  {
    // Set the center to a random value
    let side = this._size - 1;
    // Do the diamond square loop
    do
    {
      this._squareStep(side);
      side /= 2;
      this._diamondStep(side);
    } while(side > 2);
    this._squareStep(side);
  }

  _squareStep(l)
  {
    let hl = l * 0.5;
    for (let i = 0; i < this._size; i += l)
      for (let j = 0; j < this._size; j += l)
      {
        this._average(true, i + hl, j, hl);
        this._average(true, i, j + hl, hl);
        this._average(true, i + hl, j + this._size, hl);
        this._average(true, i + this._size, j + hl, hl);
      }
  }

  _diamondStep(l)
  {
    let hl = l * 0.5;
    for (let i = 0; i < this._size - 1; i += l)
      for (let j = 0; j < this._size - 1; j += l)
      {
        this._average(false, i + hl, j + hl, hl);
      }
  }

  _average(horizontal, c, r, d)
  {
    let h = 0;

    if (horizontal)
      h = this.getHeight(c, r - d) +
          this.getHeight(c, r + d) +
          this.getHeight(c - d, r) +
          this.getHeight(c + d, r);
    else
      h = this.getHeight(c - d, r - d) +
          this.getHeight(c - d, r + d) +
          this.getHeight(c + d, r - d) +
          this.getHeight(c + d, r + d);

    let v = (this._prng.float() - 0.5) * Math.log2(d) * 1;
    this.setHeight(c, r, h / 4 + v);
  }

  _distFromCenter(c, r)
  {
    let dc = this._hsize - c;
    let dr = this._hsize - r;
    return Math.sqrt(dc * dc + dr * dr) / this._size;
  }

  _normalise()
  {
    let d = this._max - this._min;
    for (let i = 0; i < this._l; i++)
    {
      this._a[i] = (this._a[i] - this._min) / d;
    }
  }

  //============================================================================
  // API
  //============================================================================
  getHeight(i, j)
  {
    if (j >= 0 && j < this._size &&
        i >= 0 && i < this._size)
      return this._a[j * this._size + i];
    else
      return 0;
  }

  setHeight(i, j, h)
  {
    if (j >= 0 && j < this._size &&
        i >= 0 && i < this._size)
    {
      this._a[j * this._size + i] = h;
      if (h > this._max)
        this._max = h;
      if (h < this._min)
        this._min = h;
    }
  }

  size()
  {
    return this._size;
  }
}