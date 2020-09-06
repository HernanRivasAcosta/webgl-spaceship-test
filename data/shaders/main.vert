precision mediump float;

attribute vec3 vertexPosition;
attribute vec3 vertexColor;
attribute vec3 vertexCenter;

uniform mat4 modelMatrix;
uniform mat4 projectionMatrix;

varying vec3 vColor;
varying vec3 vCenter;
varying float vdistToCamera;

void main(void)
{
  vec4 cs_position = modelMatrix * vec4(vertexPosition, 1.0);

  gl_Position = projectionMatrix * cs_position;

  vdistToCamera = 1.0 - gl_Position.z / DRAW_DISTANCE;
  if (vdistToCamera > 0.5)
    vdistToCamera = 1.0;
  else
    vdistToCamera = vdistToCamera / 0.5;
  vCenter = vertexCenter;
  vColor = vertexColor;
}