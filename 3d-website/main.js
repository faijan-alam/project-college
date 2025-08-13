import * as THREE from 'https://unpkg.com/three@0.160.0/build/three.module.js';
import { OrbitControls } from 'https://unpkg.com/three@0.160.0/examples/jsm/controls/OrbitControls.js';

const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = String(new Date().getFullYear());

function initThreeHero() {
  const container = document.getElementById('webgl-container');
  if (!container) return;

  // Create renderer
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(container.clientWidth, container.clientHeight);
  container.appendChild(renderer.domElement);

  // Scene & camera
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    60,
    container.clientWidth / container.clientHeight,
    0.1,
    100
  );
  camera.position.set(0, 1.2, 3);

  // Controls
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.enablePan = false;
  controls.minDistance = 1.5;
  controls.maxDistance = 6;

  // Lights
  const ambient = new THREE.AmbientLight(0xffffff, 0.6);
  scene.add(ambient);
  const dir = new THREE.DirectionalLight(0xffffff, 1.2);
  dir.position.set(5, 5, 5);
  scene.add(dir);

  // Content group
  const group = new THREE.Group();
  scene.add(group);

  // TorusKnot centerpiece
  const torusGeometry = new THREE.TorusKnotGeometry(0.6, 0.18, 220, 32, 2, 3);
  const torusMaterial = new THREE.MeshStandardMaterial({
    color: 0x7c3aed,
    roughness: 0.3,
    metalness: 0.8,
  });
  const torus = new THREE.Mesh(torusGeometry, torusMaterial);
  group.add(torus);

  // Accent ring
  const ringGeometry = new THREE.TorusGeometry(1.2, 0.02, 16, 200);
  const ringMaterial = new THREE.MeshBasicMaterial({
    color: 0x94a3b8,
    transparent: true,
    opacity: 0.5,
  });
  const ring = new THREE.Mesh(ringGeometry, ringMaterial);
  ring.rotation.x = Math.PI / 2;
  group.add(ring);

  // Particles
  const particlesGeometry = new THREE.BufferGeometry();
  const particleCount = 800;
  const positions = new Float32Array(particleCount * 3);
  for (let i = 0; i < particleCount; i++) {
    positions[i * 3 + 0] = (Math.random() - 0.5) * 8;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 4;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 8;
  }
  particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  const particlesMaterial = new THREE.PointsMaterial({
    color: 0x60a5fa,
    size: 0.02,
    transparent: true,
    opacity: 0.7,
    depthWrite: false,
  });
  const particles = new THREE.Points(particlesGeometry, particlesMaterial);
  scene.add(particles);

  // Resize handler
  function onResize() {
    const width = container.clientWidth;
    const height = container.clientHeight;
    renderer.setSize(width, height);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
  }
  window.addEventListener('resize', onResize);

  const clock = new THREE.Clock();
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Animate
  function animate() {
    const elapsed = clock.getElapsedTime();
    const rotSpeed = prefersReducedMotion ? 0.1 : 0.3;

    torus.rotation.x = elapsed * rotSpeed * 0.5;
    torus.rotation.y = elapsed * rotSpeed;
    ring.rotation.z = elapsed * rotSpeed * 0.2;
    particles.rotation.y = elapsed * 0.02;

    controls.update();
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  }

  onResize();
  animate();
}

initThreeHero();

// Smooth scroll for internal links
for (const anchor of document.querySelectorAll('a[href^="#"]')) {
  anchor.addEventListener('click', (e) => {
    const href = anchor.getAttribute('href');
    const targetId = href ? href.slice(1) : '';
    const el = targetId ? document.getElementById(targetId) : null;
    if (el) {
      e.preventDefault();
      el.scrollIntoView({ behavior: 'smooth' });
    }
  });
}