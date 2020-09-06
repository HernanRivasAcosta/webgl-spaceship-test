//==============================================================================
// Initialisation
//==============================================================================
const DRAW_DISTANCE = 10000;
const TILE_SIZE = 150;
const MAX_HEIGHT = 1500;
// Debug UI
const position = document.getElementById('positionField');
const chunk = document.getElementById('chunkField');

// Variables
let _camera, _renderer, _objects, _player, _terrain;

//==============================================================================
// Setup
//==============================================================================
function setup(assets)
{
  _camera = new Camera(DRAW_DISTANCE);
  _renderer = new Renderer(window, document, assets, DRAW_DISTANCE);
  _renderer.camera = _camera;

  _objects = [];

  _player = new Player(_camera);
  _player.z = MAX_HEIGHT;
  _objects[0] = _player;

  _terrain = new TerrainModel(TILE_SIZE, MAX_HEIGHT, 32, 999, _player, _renderer);
  _objects[1] = _terrain;

  requestAnimationFrame(render);
}

let then = 0;
function render(now)
{
  // Get the time delta
  now *= 0.001;
  const delta = now - then;
  then = now;

  // Update all objects
  let l = _objects.length;
  for (let i = 0; i < l; i++)
  {
    _objects[i].update(delta);
  }

  _renderer.update(delta);
  requestAnimationFrame(render);

  position.innerHTML = 'position: ' + _player.getPosition();
  chunk.innerHTML = 'chunk: ' + _terrain.getCurrentChunk();
}

//==============================================================================
// Initialisation
//==============================================================================
const assets = new AssetManager(['prop_column.obj',
                                 'main.vert',
                                 'main.frag',
                                 'post_process.vert',
                                 'post_process.frag'], setup);




//==============================================================================
// Debug only
//==============================================================================
function createObject(assetName, x = 5000, y = 0, z = 0)
{
  let m = Model.fromObj(assetName, assets.getAssetByName(assetName));
  let d = new Drawable(m);
  d.x = x;
  d.y = y;
  d.z = z;
  _renderer.addObject(d);
  return d;
}