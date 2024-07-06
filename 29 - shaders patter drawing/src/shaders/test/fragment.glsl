#define PI 22.0/7.0

precision mediump float;

// varying vec3 vColor;
varying vec2 vUv;
varying float vRandom;

float random(vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) *
        44444.5453123);
}

vec2 rotate(vec2 uv, float rotation, vec2 mid) {
    return vec2(cos(rotation) * (uv.x - mid.x) + sin(rotation) * (uv.y - mid.y) + mid.x, cos(rotation) * (uv.y - mid.y) - sin(rotation) * (uv.x - mid.x) + mid.y);
}

vec4 permute(vec4 x) {
    return mod(((x * 34.0) + 1.0) * x, 289.0);
}

//	Classic Perlin 2D Noise 
//	by Stefan Gustavson (https://github.com/stegu/webgl-noise)
//
vec2 fade(vec2 t) {
    return t * t * t * (t * (t * 6.0 - 15.0) + 10.0);
}

float cnoise(vec2 P) {
    vec4 Pi = floor(P.xyxy) + vec4(0.0, 0.0, 1.0, 1.0);
    vec4 Pf = fract(P.xyxy) - vec4(0.0, 0.0, 1.0, 1.0);
    Pi = mod(Pi, 289.0); // To avoid truncation effects in permutation
    vec4 ix = Pi.xzxz;
    vec4 iy = Pi.yyww;
    vec4 fx = Pf.xzxz;
    vec4 fy = Pf.yyww;
    vec4 i = permute(permute(ix) + iy);
    vec4 gx = 2.0 * fract(i * 0.0243902439) - 1.0; // 1/41 = 0.024...
    vec4 gy = abs(gx) - 0.5;
    vec4 tx = floor(gx + 0.5);
    gx = gx - tx;
    vec2 g00 = vec2(gx.x, gy.x);
    vec2 g10 = vec2(gx.y, gy.y);
    vec2 g01 = vec2(gx.z, gy.z);
    vec2 g11 = vec2(gx.w, gy.w);
    vec4 norm = 1.79284291400159 - 0.85373472095314 *
        vec4(dot(g00, g00), dot(g01, g01), dot(g10, g10), dot(g11, g11));
    g00 *= norm.x;
    g01 *= norm.y;
    g10 *= norm.z;
    g11 *= norm.w;
    float n00 = dot(g00, vec2(fx.x, fy.x));
    float n10 = dot(g10, vec2(fx.y, fy.y));
    float n01 = dot(g01, vec2(fx.z, fy.z));
    float n11 = dot(g11, vec2(fx.w, fy.w));
    vec2 fade_xy = fade(Pf.xy);
    vec2 n_x = mix(vec2(n00, n01), vec2(n10, n11), fade_xy.x);
    float n_xy = mix(n_x.x, n_x.y, fade_xy.y);
    return 2.3 * n_xy;
}

void main() {

    // float strength = mod( vUv.x * 10.0 , 1.0);
    // strength = strength < 0.5 ? 0.0 : 1.0 ;

    // //pattern 1
    // float barX = step(0.3, mod(vUv.x * 10.0, 1.0));
    // barX *= step(0.8, mod(vUv.y * 10.0, 1.0));
    // float barY = step(0.3, mod(vUv.y * 10.0, 1.0));
    // barY *= step(0.8, mod(vUv.x * 10.0, 1.0));
    // float strength = barX + barY;

    //pattern 2
    // float barX = step(0.4, mod(vUv.x * 10.0 - 0.2, 1.0));
    // barX *= step(0.8, mod(vUv.y * 10.0 , 1.0));
    // float barY = step(0.4, mod(vUv.y * 10.0  - 0.2  , 1.0));
    // barY *= step(0.8, mod(vUv.x * 10.0 , 1.0));
    // float strength = barX + barY;

    //pattern 3
    // float strength = abs(vUv.x - 0.5);
    // strength = strength < 0.5 ? 0.5 - strength : strength - 0.5 ;

    // //pattern 4
    // float strengthx = abs(vUv.x - 0.5);
    // float strengthy = abs(vUv.y - 0.5);
    // float strength = min(strengthx , strengthy) ; 

    // //pattern 5
    // float strengthx = abs(vUv.x - 0.5);
    // float strengthy = abs(vUv.y - 0.5);
    // float strength = max(strengthx , strengthy) ; 

    //pattern 6
    // float strengthx = vUv.x * 2.0;
    // strengthx = strengthx > 0.4 && strengthx< 1.6 ? 0.0 : 1.0 ;
    // float strengthy = vUv.y * 2.0;
    // strengthy = strengthy > 0.4 && strengthy< 1.6 ? 0.0 : 1.0 ;
    // float strength = strengthx + strengthy ;

    // float strengthx = abs(vUv.x - 0.5);
    // float strengthy = abs(vUv.y - 0.5);
    // float strength = max(strengthx, strengthy);
    // strength = step(0.2 , strength) ;

    //pattern 7
    // float square1 = step(0.2 , max(abs(vUv.x - 0.5),  abs(vUv.y - 0.5))) ;
    // float square2 = 1.0 - step(0.25 , max(abs(vUv.x - 0.5),  abs(vUv.y - 0.5))) ;
    // float strength = square2 * square1 ;

    //pattern 8
    // float strength = vUv.x;
    // strength = floor(strength * 10.0) / 10.0;

    //pattern 9
    // float strengthx = floor(vUv.x * 10.0) / 10.0;
    // float strengthy = floor(vUv.y * 10.0) / 10.0;
    // float strength =  strengthx * strengthy ;

    //pattern 10
    // float strength = vRandom;
    // float strength = random(vUv);

    //pattern 11
    // vec2 gridUv = vec2(floor(vUv.x * 10.0) /  10.0, floor( vUv.y * 10.0) / 10.0);
    // float strength = random(gridUv );

    //pattern 12
    // vec2 gridUv = vec2(floor((vUv.x - vUv.y )  * 10.0) /  10.0, floor((vUv.x + vUv.y )* 10.0) / 10.0);
    // float strength = random(gridUv );

    //pattern 13
    // float strength = length(vUv);

    //pattern 14
    // float strength = length(vUv - 0.5);
    // float strength = distance(vUv , vec2(0.5));

    //pattern 15
    // float strength = (1.0 - distance(vUv , vec2(0.5))) ;

    //pattern 16
    // float strength = 0.01 / distance(vUv , vec2(0.5)) ;

    //pattern 17
    // float strength = 0.02 / distance(vec2(vUv.x *0.1 + 0.45  , vUv.y ) , vec2(0.5)) ;

    //pattern 18
    // float strengthx = 0.02 / distance(vec2(vUv.x *0.2 + 0.4  , vUv.y ) , vec2(0.5)) ;
    // float strengthy = 0.02 / distance(vec2(vUv.x , vUv.y *0.2 + 0.4 ) , vec2(0.5)) ;
    // float strength = strengthx * strengthy;

    //pattern 19
    // vec2 rotatedUv = rotate(vUv , PI * 0.25 , vec2(0.5));
    // float strengthx = 0.02 / distance(vec2(rotatedUv.x *0.2 + 0.4  , rotatedUv.y ) , vec2(0.5)) ;
    // float strengthy = 0.02 / distance(vec2(rotatedUv.x , rotatedUv.y *0.2 + 0.4 ) , vec2(0.5)) ;
    // float strength = strengthx * strengthy;

    //pattern 20
    // float strength = step(0.25 , distance(vUv, vec2(0.5)));

    //pattern 2১
    // float strength = abs(0.25 - distance(vUv, vec2(0.5)));

    //pattern 2২
    // float strength = step(0.01 ,abs(0.25 - distance(vUv, vec2(0.5))));

    //pattern 2৩
    // float strength = 1.0 - step(0.01 ,abs(0.25 - distance(vUv, vec2(0.5))));

    //pattern 2৪
    // vec2 waveUv = vec2(vUv.x , vUv.y + sin(vUv.x * 30.0)*0.1 );
    // float strength = 1.0 - step(0.01 ,abs(0.25 - distance(waveUv, vec2(0.5))));

    // pattern 24
    // vec2 waveUv = vec2(vUv.x + sin(vUv.y * 30.0) * 0.1, vUv.y + sin(vUv.x * 30.0) * 0.1);
    // float strength = 1.0 - step(0.01, abs(0.25 - distance(waveUv, vec2(0.5))));

    // pattern 25
    // vec2 waveUv = vec2(vUv.x + sin(vUv.y * 80.0) * 0.1, vUv.y + sin(vUv.x * 80.0) * 0.1);
    // float strength = 1.0 - step(0.01, abs(0.25 - distance(waveUv, vec2(0.5))));

    //pattern 26
    // float angle = atan(vUv.x - 0.5 , vUv.y - 0.5);
    // float strength = angle;

    //pattern 27
    // float angle = atan(vUv.x - 0.5 , vUv.y - 0.5);
    // angle /= PI * 2.0 ;
    // angle += 0.5 ;
    // float strength = angle;

    //pattern 28
    // float angle = atan(vUv.x - 0.5 , vUv.y - 0.5);
    // angle /= PI * 2.0 ;
    // angle += 0.5 ;
    // float strength = floor(angle * 20.0) / 20.0;

    //pattern 29
    // float angle = atan(vUv.x - 0.5 , vUv.y - 0.5);
    // angle /= PI * 2.0 ;
    // angle += 0.5 ;
    // float strength = mod(angle * 30.0 , 1.5) ;

    //pattern 30
    // float angle = atan(vUv.x - 0.5 , vUv.y - 0.5);
    // angle /= PI * 2.0 ;
    // angle += 0.5 ;
    // float strength = sin(angle * 100.0);

    //pattern 31
    // float angle = atan(vUv.x - 0.5 , vUv.y - 0.5);
    // angle /= PI * 2.0 ;
    // angle += 0.5 ;
    // float sinusodal = sin(angle * 100.0);
    // float radius = sinusodal * 0.05 + 0.25;
    // float strength = 1.0 - step(0.02, abs(radius - distance(vUv, vec2(0.5))));

    //pattern 32
    // float strength = cnoise(vUv * 10.0);

    //pattern 33
    // float strength = step( 0.0 , cnoise(vUv * 10.0));
 
    //pattern 34
    // float strength = 1.0 - abs(cnoise(vUv * 10.0));
 
    //pattern 35
    // float strength =  sin(cnoise(vUv * 10.0) * 20.0);
    
    //pattern 36
    float strength = step(0.0, sin(cnoise(vUv * 10.0) * 20.0));

    //limit the strength value
    strength = clamp(strength , 0.0 , 1.0);

    //mix color
    vec3 blackColor = vec3(0.0);
    vec3 uvColor = vec3(vUv , 1.0);
    vec3 mixColor = mix(uvColor , blackColor , strength);

    gl_FragColor = vec4(mixColor , 1.0);


    // gl_FragColor = vec4(strength, strength, strength, 1.0);

}