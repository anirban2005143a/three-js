precision mediump float;

uniform vec3 uColor;
uniform sampler2D uTexture;


// varying float Vrandom;
varying vec2 vUv;
varying float vElevation;

void main() {

    vec4 texture = texture2D(uTexture , vUv);
    texture *= vElevation + 1.8;
    gl_FragColor = texture;

}