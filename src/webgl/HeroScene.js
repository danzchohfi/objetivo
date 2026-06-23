import * as THREE from 'three';
import { vertexShader, fragmentShader } from './shaders.js';

const hexToVec3 = (hex) => {
  const c = new THREE.Color(hex);
  return new THREE.Vector3(c.r, c.g, c.b);
};

/**
 * Fullscreen WebGL background. A single shader plane drives the whole
 * ambient gradient + "target" rings. Cheap, smooth, and reactive.
 */
export default class HeroScene {
  constructor(canvas) {
    this.canvas = canvas;
    this.mouse = new THREE.Vector2(0, 0);
    this.targetMouse = new THREE.Vector2(0, 0);
    this.scroll = 0;
    this.targetScroll = 0;
    this.enabled = false;
    this.dpr = Math.min(window.devicePixelRatio || 1, 2);

    this._initRenderer();
  }

  _initRenderer() {
    try {
      this.renderer = new THREE.WebGLRenderer({
        canvas: this.canvas,
        antialias: false,
        alpha: false,
        powerPreference: 'high-performance',
        stencil: false,
        depth: false,
      });
    } catch (e) {
      this._failed = true;
      document.documentElement.classList.add('no-webgl');
      return;
    }

    this.renderer.setClearColor(0x0a0a0c, 1);
    this.renderer.setPixelRatio(this.dpr);

    this.scene = new THREE.Scene();
    this.camera = new THREE.Camera();

    this.uniforms = {
      uTime: { value: 0 },
      uResolution: { value: new THREE.Vector2(1, 1) },
      uMouse: { value: new THREE.Vector2(0, 0) },
      uScroll: { value: 0 },
      uReveal: { value: 0 },
      uInk: { value: hexToVec3('#0a0a0c') },
      uFlare: { value: hexToVec3('#ff5a1f') },
      uIon: { value: hexToVec3('#6f7bff') },
      uEmber: { value: hexToVec3('#7a1f00') },
    };

    const geometry = new THREE.PlaneGeometry(2, 2);
    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: this.uniforms,
      depthTest: false,
      depthWrite: false,
    });

    this.mesh = new THREE.Mesh(geometry, material);
    this.mesh.frustumCulled = false;
    this.scene.add(this.mesh);

    this.resize();
    this.enabled = true;
  }

  resize() {
    if (this._failed) return;
    const w = window.innerWidth;
    const h = window.innerHeight;
    // lighten the load on very large/hi-dpi screens
    this.dpr = Math.min(window.devicePixelRatio || 1, w > 1600 ? 1.5 : 2);
    this.renderer.setPixelRatio(this.dpr);
    this.renderer.setSize(w, h, false);
    this.uniforms.uResolution.value.set(w * this.dpr, h * this.dpr);
  }

  setMouse(x, y) {
    // x, y in -1..1
    this.targetMouse.set(x, y);
  }

  setScroll(progress) {
    this.targetScroll = progress;
  }

  reveal(gsap) {
    if (this._failed || !this.uniforms) return;
    gsap.to(this.uniforms.uReveal, {
      value: 1,
      duration: 1.6,
      ease: 'power2.out',
    });
  }

  /** Called from the shared gsap ticker. time in seconds. */
  update(time) {
    if (!this.enabled || this._failed) return;
    this.mouse.lerp(this.targetMouse, 0.06);
    this.scroll += (this.targetScroll - this.scroll) * 0.08;

    this.uniforms.uTime.value = time;
    this.uniforms.uMouse.value.copy(this.mouse);
    this.uniforms.uScroll.value = this.scroll;

    this.renderer.render(this.scene, this.camera);
  }

  pause() { this.enabled = false; }
  resume() { if (!this._failed) this.enabled = true; }

  dispose() {
    if (this._failed) return;
    this.mesh.geometry.dispose();
    this.mesh.material.dispose();
    this.renderer.dispose();
  }
}
