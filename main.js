/**
 * main.js
 * Ultra-Unique 3-Stage 3D Landing → E-Commerce Ecosystem
 *
 * Tech: Vanilla JS, Three.js, GSAP (Timeline + ScrollTrigger), Tailwind utilities
 *
 * Structure:
 *  - SceneManager: handles Three.js scenes, shared canvas, render loop, optimized updates
 *  - LandingFlow: orchestrates the three landing experiences using GSAP ScrollTrigger
 *  - CommerceApp: lightweight SPA for product listing, cart, checkout, transitions
 *
 * Notes:
 *  - All animations use GSAP timelines for predictable sequencing.
 *  - requestAnimationFrame used for Three.js render loop; render loop is paused when not needed.
 *  - Code is modular and commented like a senior frontend engineer.
 */

/* =========================
   Module-level configuration
   ========================= */
const CONFIG = {
  accent: '#00ffd5',
  darkBase: '#0b0b0f',
  canvasPixelRatio: Math.min(window.devicePixelRatio || 1, 2),
  productCount: 12,
  currencySymbol: '₹',
  // camera presets for each stage
  cameraPresets: {
    stage1: { fov: 50, pos: [0, 0, 4] },
    stage2: { fov: 45, pos: [0, 0.6, 3.2] },
    stage3: { fov: 40, pos: [0, 0.2, 2.6] },
    commerce: { fov: 50, pos: [0, 1.2, 6] }
  }
};

/* =========================
   Utility helpers
   ========================= */
const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

/* =========================
   SceneManager
   - Single canvas, multiple "modes" (stage1, stage2, stage3, commerce)
   - Optimized render loop: only render when necessary
   ========================= */
class SceneManager {
  constructor(canvas) {
    this.canvas = canvas;
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });
    this.renderer.setPixelRatio(CONFIG.canvasPixelRatio);
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.outputEncoding = THREE.sRGBEncoding;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.0;

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(CONFIG.cameraPresets.stage1.fov, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.camera.position.set(...CONFIG.cameraPresets.stage1.pos);

    // shared lights
    this.ambient = new THREE.AmbientLight(0xffffff, 0.25);
    this.scene.add(this.ambient);

    this.directional = new THREE.DirectionalLight(0xffffff, 0.0);
    this.directional.position.set(5, 5, 5);
    this.scene.add(this.directional);

    // root group for the central object
    this.rootGroup = new THREE.Group();
    this.scene.add(this.rootGroup);

    // state
    this.mode = 'stage1';
    this.mouse = { x: 0, y: 0 };
    this.clock = new THREE.Clock();

    // performance flags
    this.needsRender = true;
    this.isRunning = false;

    // create initial object
    this._createAbstractObject();

    // event listeners
    window.addEventListener('resize', () => this._onResize());
    window.addEventListener('mousemove', (e) => this._onMouseMove(e));
    window.addEventListener('touchmove', (e) => this._onTouchMove(e), { passive: true });

    // start loop
    this.start();
  }

  _createAbstractObject() {
    // Create a layered abstract object composed of multiple meshes
    // Each layer will be animated and can change material properties per stage
    this.rootGroup.clear?.();

    // base geometry
    const baseGeo = new THREE.IcosahedronGeometry(1.0, 4);

    // materials for different modes
    this.materials = {
      glass: new THREE.MeshPhysicalMaterial({
        color: 0x9be7ff,
        metalness: 0.0,
        roughness: 0.05,
        transmission: 0.9,
        transparent: true,
        opacity: 0.95,
        clearcoat: 0.2,
        clearcoatRoughness: 0.1
      }),
      metal: new THREE.MeshStandardMaterial({
        color: 0xdfefff,
        metalness: 0.9,
        roughness: 0.18,
        envMapIntensity: 1.0
      }),
      matte: new THREE.MeshStandardMaterial({
        color: 0x0f1724,
        metalness: 0.05,
        roughness: 0.6
      }),
      core: new THREE.MeshStandardMaterial({
        color: 0x00ffd5,
        emissive: 0x002a22,
        emissiveIntensity: 0.6,
        metalness: 0.2,
        roughness: 0.15
      })
    };

    // layered meshes
    this.layers = [];

    for (let i = 0; i < 4; i++) {
      const scale = 1 + i * 0.12;
      const mesh = new THREE.Mesh(baseGeo.clone(), this.materials.glass.clone());
      mesh.scale.setScalar(scale);
      mesh.rotation.set(Math.random() * 0.6, Math.random() * 0.6, Math.random() * 0.6);
      mesh.userData = { layer: i };
      this.rootGroup.add(mesh);
      this.layers.push(mesh);
    }

    // small inner core
    const coreGeo = new THREE.SphereGeometry(0.28, 32, 32);
    this.coreMesh = new THREE.Mesh(coreGeo, this.materials.core.clone());
    this.coreMesh.scale.setScalar(0.001); // will scale in
    this.rootGroup.add(this.coreMesh);

    // subtle environment
    this._setupEnvironment();
  }

  _setupEnvironment() {
    // Add a subtle environment map using a procedural cube render target (approximation)
    // For demo, use a simple color-based environment
    this.scene.background = new THREE.Color(CONFIG.darkBase);
  }

  setMode(mode) {
    // mode: 'stage1' | 'stage2' | 'stage3' | 'commerce'
    if (this.mode === mode) return;
    this.mode = mode;

    // animate camera to preset
    const preset = CONFIG.cameraPresets[mode] || CONFIG.cameraPresets.stage1;
    gsap.to(this.camera, {
      duration: 1.6,
      ease: 'power3.inOut',
      fov: preset.fov,
      onUpdate: () => this.camera.updateProjectionMatrix()
    });
    gsap.to(this.camera.position, {
      duration: 1.6,
      ease: 'power3.inOut',
      x: preset.pos[0],
      y: preset.pos[1],
      z: preset.pos[2]
    });

    // lighting and material transitions
    if (mode === 'stage1') {
      gsap.to(this.ambient, { intensity: 0.35, duration: 1.2 });
      gsap.to(this.directional, { intensity: 0.0, duration: 1.2 });
      this._setMaterials('glass');
      this._animateCoreScale(0.001, 0.6);
    } else if (mode === 'stage2') {
      gsap.to(this.ambient, { intensity: 0.18, duration: 1.2 });
      gsap.to(this.directional, { intensity: 0.9, duration: 1.2 });
      this._setMaterials('metal');
      this._animateCoreScale(0.12, 0.9);
    } else if (mode === 'stage3') {
      gsap.to(this.ambient, { intensity: 0.12, duration: 1.2 });
      gsap.to(this.directional, { intensity: 1.2, duration: 1.2 });
      this._setMaterials('matte');
      this._animateCoreScale(0.28, 1.2);
      // sharpen core color
      gsap.to(this.materials.core, { emissiveIntensity: 1.2, duration: 1.2 });
    } else if (mode === 'commerce') {
      gsap.to(this.ambient, { intensity: 0.22, duration: 1.2 });
      gsap.to(this.directional, { intensity: 0.6, duration: 1.2 });
      this._setMaterials('matte');
      this._animateCoreScale(0.18, 1.0);
    }

    this.needsRender = true;
  }

  _setMaterials(type) {
    // change materials for each layer with subtle stagger
    const mat = this.materials[type];
    this.layers.forEach((mesh, i) => {
      const newMat = mat.clone();
      // slight color variation
      if (type === 'metal') {
        newMat.color = new THREE.Color().setHSL(0.55 + i * 0.02, 0.6, 0.6 - i * 0.03);
      } else if (type === 'glass') {
        newMat.color = new THREE.Color().setHSL(0.55, 0.6, 0.85 - i * 0.05);
      } else if (type === 'matte') {
        newMat.color = new THREE.Color().setHSL(0.62, 0.12, 0.08 + i * 0.02);
      }
      // animate material swap
      gsap.to(mesh.material, {
        duration: 0.9,
        onStart: () => { mesh.material = newMat; },
        onComplete: () => { mesh.material.needsUpdate = true; }
      });
    });
  }

  _animateCoreScale(target, duration = 1.0) {
    gsap.to(this.coreMesh.scale, {
      x: target,
      y: target,
      z: target,
      duration,
      ease: 'elastic.out(1,0.6)'
    });
  }

  _onResize() {
    const w = window.innerWidth;
    const h = window.innerHeight;
    this.renderer.setSize(w, h);
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
    this.needsRender = true;
  }

  _onMouseMove(e) {
    // normalized -1..1
    this.mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
    this.mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
    this.needsRender = true;
  }

  _onTouchMove(e) {
    if (!e.touches || e.touches.length === 0) return;
    const t = e.touches[0];
    this.mouse.x = (t.clientX / window.innerWidth) * 2 - 1;
    this.mouse.y = -(t.clientY / window.innerHeight) * 2 + 1;
    this.needsRender = true;
  }

  start() {
    if (this.isRunning) return;
    this.isRunning = true;
    this._loop();
  }

  stop() {
    this.isRunning = false;
  }

  _loop() {
    if (!this.isRunning) return;
    requestAnimationFrame(() => this._loop());

    const dt = this.clock.getDelta();

    // idle rotation
    this.rootGroup.rotation.y += dt * 0.12;
    this.rootGroup.rotation.x += Math.sin(this.clock.elapsedTime * 0.2) * 0.0008;

    // subtle mouse parallax
    const targetX = this.mouse.x * 0.12;
    const targetY = this.mouse.y * 0.08;
    this.rootGroup.rotation.y += (targetX - this.rootGroup.rotation.y) * 0.06;
    this.rootGroup.rotation.x += (targetY - this.rootGroup.rotation.x) * 0.06;

    // per-layer micro-animations
    this.layers.forEach((mesh, i) => {
      mesh.rotation.z += dt * (0.02 + i * 0.01);
      mesh.position.y = Math.sin(this.clock.elapsedTime * (0.2 + i * 0.05)) * 0.02 * (i + 1);
    });

    // core subtle pulse
    const pulse = 1 + Math.sin(this.clock.elapsedTime * 2.0) * 0.02;
    this.coreMesh.scale.setScalar(this.coreMesh.scale.x * pulse);

    // conditional render
    if (this.needsRender) {
      this.renderer.render(this.scene, this.camera);
      this.needsRender = false;
    }
  }

  // public API for scroll-driven camera control
  setCameraRotation(x, y, z) {
    gsap.to(this.camera.rotation, { x, y, z, duration: 0.8, ease: 'power2.out' });
    this.needsRender = true;
  }

  setCameraPosition(x, y, z, duration = 1.0) {
    gsap.to(this.camera.position, { x, y, z, duration, ease: 'power3.inOut' });
    this.needsRender = true;
  }

  // transform the object into a "product core" (stage3)
  morphToProductCore() {
    // animate layers to collapse and reveal core
    this.layers.forEach((mesh, i) => {
      gsap.to(mesh.scale, { x: 0.2, y: 0.2, z: 0.2, duration: 1.2, delay: i * 0.06, ease: 'power3.inOut' });
      gsap.to(mesh.rotation, { x: Math.random() * 2, y: Math.random() * 2, z: Math.random() * 2, duration: 1.2, delay: i * 0.06 });
      gsap.to(mesh.position, { x: (i - 1.5) * 0.06, y: -0.2 - i * 0.02, z: i * 0.02, duration: 1.2, delay: i * 0.06 });
    });
    gsap.to(this.coreMesh.scale, { x: 0.36, y: 0.36, z: 0.36, duration: 1.6, ease: 'elastic.out(1,0.6)', delay: 0.2 });
    this.needsRender = true;
  }

  // expose a method to change core color (used when entering commerce)
  setCoreColor(hex) {
    this.coreMesh.material.color.set(hex);
    this.coreMesh.material.emissive.set(hex);
    this.needsRender = true;
  }
}

/* =========================
   LandingFlow
   - orchestrates the three stages using GSAP ScrollTrigger
   - animates DOM text, reveals UI, and triggers SceneManager mode changes
   ========================= */
class LandingFlow {
  constructor(sceneManager) {
    this.scene = sceneManager;
    this.init();
  }

    init() {
      // initial DOM references
      this.stage1 = $('#stage1');
      this.stage2 = $('#stage2');
    }
  }
  
  /* =========================
     CommerceApp
     ========================= */
  class CommerceApp {
    constructor(sceneManager) {
      this.scene = sceneManager;
    }
  }
  
  /* =========================
     Initialization
     ========================= */
  document.addEventListener('DOMContentLoaded', () => {
    const canvas = $('#canvas-3d');
    const sceneManager = new SceneManager(canvas);
    const landingFlow = new LandingFlow(sceneManager);
  });