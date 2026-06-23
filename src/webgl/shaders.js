// Fullscreen background shader — organic gradient + concentric "target" rings.

export const vertexShader = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`;

export const fragmentShader = /* glsl */ `
  precision highp float;

  varying vec2 vUv;

  uniform float uTime;
  uniform vec2  uResolution;
  uniform vec2  uMouse;     // smoothed, -1..1
  uniform float uScroll;    // 0..1 page progress
  uniform float uReveal;    // 0..1 intro reveal
  uniform vec3  uInk;
  uniform vec3  uFlare;
  uniform vec3  uIon;
  uniform vec3  uEmber;

  //  Simplex noise 3D (Ashima Arts / Stefan Gustavson)
  vec4 permute(vec4 x){ return mod(((x*34.0)+1.0)*x, 289.0); }
  vec4 taylorInvSqrt(vec4 r){ return 1.79284291400159 - 0.85373472095314 * r; }

  float snoise(vec3 v){
    const vec2 C = vec2(1.0/6.0, 1.0/3.0);
    const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
    vec3 i  = floor(v + dot(v, C.yyy));
    vec3 x0 = v - i + dot(i, C.xxx);
    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min(g.xyz, l.zxy);
    vec3 i2 = max(g.xyz, l.zxy);
    vec3 x1 = x0 - i1 + 1.0 * C.xxx;
    vec3 x2 = x0 - i2 + 2.0 * C.xxx;
    vec3 x3 = x0 - 1.0 + 3.0 * C.xxx;
    i = mod(i, 289.0);
    vec4 p = permute(permute(permute(
              i.z + vec4(0.0, i1.z, i2.z, 1.0))
            + i.y + vec4(0.0, i1.y, i2.y, 1.0))
            + i.x + vec4(0.0, i1.x, i2.x, 1.0));
    float n_ = 1.0/7.0;
    vec3 ns = n_ * D.wyz - D.xzx;
    vec4 j = p - 49.0 * floor(p * ns.z *ns.z);
    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0 * x_);
    vec4 x = x_ *ns.x + ns.yyyy;
    vec4 y = y_ *ns.x + ns.yyyy;
    vec4 h = 1.0 - abs(x) - abs(y);
    vec4 b0 = vec4(x.xy, y.xy);
    vec4 b1 = vec4(x.zw, y.zw);
    vec4 s0 = floor(b0)*2.0 + 1.0;
    vec4 s1 = floor(b1)*2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));
    vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
    vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;
    vec3 p0 = vec3(a0.xy, h.x);
    vec3 p1 = vec3(a0.zw, h.y);
    vec3 p2 = vec3(a1.xy, h.z);
    vec3 p3 = vec3(a1.zw, h.w);
    vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
    p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
    vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
    m = m * m;
    return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
  }

  float hash(vec2 p){ return fract(sin(dot(p, vec2(12.9898,78.233))) * 43758.5453); }

  void main(){
    vec2 uv = vUv;
    float aspect = uResolution.x / max(uResolution.y, 1.0);
    vec2 p = uv - 0.5;
    p.x *= aspect;

    vec2 m = uMouse * 0.16;
    float t = uTime * 0.04;

    // domain-warped fbm-ish noise
    vec3 q = vec3(p * 1.35 + m, t);
    float n1 = snoise(q);
    float n2 = snoise(q * 2.1 + n1 * 0.6);
    float n  = n1 * 0.65 + n2 * 0.35;
    float nn = n * 0.5 + 0.5;

    // base vertical gradient, lifted by noise + scroll
    float grad = smoothstep(-0.25, 1.25, uv.y + n * 0.28 + uScroll * 0.5);

    // colour mixing — moody but with a visible ember/flare bloom
    vec3 col = mix(uInk, uEmber, smoothstep(0.18, 0.95, nn));
    col = mix(col, uFlare, smoothstep(0.5, 1.05, nn + uScroll * 0.28) * 0.9);
    col = mix(col, uIon, smoothstep(0.72, 1.05, nn) * (0.55 - uScroll * 0.3));
    col = mix(uInk, col, 0.5 + 0.5 * grad);

    // concentric target rings around the (mouse-offset) centre
    vec2 c = p - m * 1.4;
    float d = length(c);
    float rings = sin(d * 26.0 - uTime * 0.7);
    rings = smoothstep(0.5, 1.0, rings) * smoothstep(0.95, 0.05, d);
    col += rings * uFlare * 0.07;

    // soft bullseye bloom
    float glow = smoothstep(0.6, 0.0, d);
    col += glow * uFlare * 0.18 * (0.65 + 0.35 * sin(uTime * 0.5));

    // vignette
    float vig = smoothstep(1.4, 0.12, length(p));
    col *= 0.55 + 0.45 * vig;

    // animated grain
    float g = hash(uv * uResolution + fract(uTime));
    col += (g - 0.5) * 0.045;

    col *= uReveal;
    gl_FragColor = vec4(col, 1.0);
  }
`;
