precision mediump float;

attribute vec2 vertexPosition;
varying vec2 vTexcoord;

void main(void)
{
  vTexcoord = vertexPosition * vec2(0.5) + vec2(0.5);
  gl_Position = vec4(vertexPosition, 1.0, 1.0);
}