uniform mat4 projectionMatrix;
uniform mat4 viewMatrix;
uniform mat4 modelMatrix;

// uniform vec3 uColor;

attribute vec3 position;
attribute vec2 uv;
attribute float aRandom;

// varying vec3 vColor;
varying vec2 vUv;
varying float vRandom;

void main() {

    vec4 modelPosition = modelMatrix * vec4(position, 1.0) ;

    vec4 viewposition = viewMatrix * modelPosition ;
    vec4 projectedPosition = projectionMatrix * viewposition ;
    gl_Position = projectedPosition ;
    
    // vColor = uColor;
    vUv = uv;
    vRandom = aRandom ;
}