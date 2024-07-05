uniform mat4 projectionMatrix;
uniform mat4 viewMatrix;
uniform mat4 modelMatrix;

uniform float uTime;
uniform vec2 uFrequency;

attribute vec3 position;
attribute vec2 uv;
// attribute float Arandom;

// varying float Vrandom;
varying vec2 vUv;
varying float vElevation;

void main() {

    vec4 modelPosition = modelMatrix * vec4(position, 1.0) ;
    
    modelPosition.z += sin((modelPosition.x * uFrequency.x)*0.8 + uTime) * 0.5 ; 
    modelPosition.z += sin((modelPosition.y * uFrequency.y)*0.3 + uTime) * 0.5 ;


    vec4 viewposition = viewMatrix * modelPosition ;
    vec4 projectedPosition = projectionMatrix * viewposition ;
    gl_Position = projectedPosition ;
    
    // Vrandom = Arandom;
    vUv = uv;
    vElevation = modelPosition.z;
}