//==============================================================================
// Setup
//==============================================================================
let _drawDistance = 10000;
let _camera = new Camera(_drawDistance);
let _renderer = new Renderer(window, document, _drawDistance);
_renderer.camera = _camera;

// Debug UI
let position = document.getElementById('positionField');
let chunk = document.getElementById('chunkField');

//==============================================================================
// Objects
//==============================================================================
let TILE_SIZE = 150;
let MAX_HEIGHT = 1500;

let objects = [];

let _player = new Player(_camera);
objects[0] = _player;

let _terrain = new TerrainModel(TILE_SIZE, MAX_HEIGHT, 32, 999, _player, _renderer);
objects[1] = _terrain;

//let worldSize = _terrain.chunkSize;
//for (let i = 0; i <= 200; i++)
//{
//  let enemy = new Enemy(worldSize);
//  enemy.setPosition((Math.random() - 0.5) * worldSize,
//                    (Math.random() - 0.5) * worldSize,
//                    MAX_HEIGHT * (0.4 + Math.random() * 0.4));
//  objects[2 + i] = enemy;
//  _renderer.addObject(enemy);
//}

_player.z = MAX_HEIGHT;

//==============================================================================
// Update
//==============================================================================

let then = 0;
function render(now)
{
  // Get the time delta
  now *= 0.001;
  const delta = now - then;
  then = now;

  // Update all objects
  let l = objects.length;
  for (let i = 0; i < l; i++)
  {
    objects[i].update(delta);
  }

  _renderer.update(delta);
  requestAnimationFrame(render);

  position.innerHTML = 'position: ' + _player.getPosition();
  chunk.innerHTML = 'chunk: ' + _terrain.getCurrentChunk();
}
requestAnimationFrame(render);