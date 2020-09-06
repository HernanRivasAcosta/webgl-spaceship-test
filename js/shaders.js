//==============================================================================
// Utils
//==============================================================================
function loadVertexShader(gl, source, vars)
{
  const shader = gl.createShader(gl.VERTEX_SHADER);
  return _loadShader(gl, shader, source, vars);
}

function loadFragmentShader(gl, source, vars)
{
  const shader = gl.createShader(gl.FRAGMENT_SHADER);
  return _loadShader(gl, shader, source, vars);
}

function _loadShader(gl, shader, source, vars)
{
  gl.shaderSource(shader, source);
  gl.compileShader(shader);

  console.log('Shader compile log: ' + (gl.getShaderInfoLog(shader) || 'ok'));
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS))
  {
    gl.deleteShader(shader);
    return null;
  }

  return shader;
}