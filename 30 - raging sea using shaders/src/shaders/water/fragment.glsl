uniform vec3 uDepthColor;
uniform vec3 uSurfaceColor;
uniform float uElevationMultiplier;
uniform float uElevationOffset;

varying float vElevation;


void main(){

    float colorMixer = (vElevation + uElevationOffset) * uElevationMultiplier ;
    vec3 color = mix(uDepthColor , uSurfaceColor , colorMixer);

    gl_FragColor = vec4(color, 1.0);
}