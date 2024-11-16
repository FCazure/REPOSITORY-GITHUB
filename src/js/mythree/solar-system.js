// Three.js Solar System with Enhanced Features and Nebula Background
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById('space-background').appendChild(renderer.domElement);

// Starfield
const starGeometry = new THREE.BufferGeometry();
const starMaterial = new THREE.PointsMaterial({ color: 0xFFFFFF, size: 0.1 });
const starVertices = [];
for (let i = 0; i < 15000; i++) {
  const x = (Math.random() - 0.5) * 2000;
  const y = (Math.random() - 0.5) * 2000;
  const z = -Math.random() * 2000;
  starVertices.push(x, y, z);
}
starGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starVertices, 3));
const stars = new THREE.Points(starGeometry, starMaterial);
scene.add(stars);

// Nebula
const nebulaTexture = new THREE.TextureLoader().load(generateNebulaTexture());
const nebulaMaterial = new THREE.MeshBasicMaterial({
  map: nebulaTexture,
  transparent: true,
  opacity: 0.5,
  blending: THREE.AdditiveBlending
});
const nebulaGeometry = new THREE.SphereGeometry(500, 64, 64);
const nebula = new THREE.Mesh(nebulaGeometry, nebulaMaterial);
scene.add(nebula);

// Sun
const sunGeometry = new THREE.SphereGeometry(5, 64, 64);
const sunTexture = new THREE.TextureLoader().load(generateSunTexture());
const sunMaterial = new THREE.MeshBasicMaterial({
  map: sunTexture,
  emissive: 0xffff00,
  emissiveIntensity: 0.5
});
const sun = new THREE.Mesh(sunGeometry, sunMaterial);
scene.add(sun);

// Solar radiation
const solarRadiationGeometry = new THREE.SphereGeometry(5.5, 32, 32);
const solarRadiationMaterial = new THREE.MeshBasicMaterial({
  color: 0xffff00,
  transparent: true,
  opacity: 0.2,
  blending: THREE.AdditiveBlending
});
const solarRadiation = new THREE.Mesh(solarRadiationGeometry, solarRadiationMaterial);
sun.add(solarRadiation);

// Planets Data
const planetData = [
  { name: 'Mercury', radius: 0.5, distance: 10, color: '#8B8989', speed: 0.00474 * 0.3, texture: generatePlanetTexture('#8B8989', '#696969') },
  { name: 'Venus', radius: 0.8, distance: 15, color: '#E3A857', speed: 0.00367 * 0.3, texture: generatePlanetTexture('#E3A857', '#B8860B') },
  { name: 'Earth', radius: 1, distance: 20, color: '#4169E1', speed: 0.00300 * 0.3, texture: generatePlanetTexture('#4169E1', '#228B22'), hasMoon: true },
  { name: 'Mars', radius: 0.7, distance: 25, color: '#B22222', speed: 0.00241 * 0.3, texture: generatePlanetTexture('#B22222', '#8B0000') },
  { name: 'Jupiter', radius: 2, distance: 35, color: '#DEB887', speed: 0.00131 * 0.3, texture: generatePlanetTexture('#DEB887', '#CD853F') },
  { name: 'Saturn', radius: 1.8, distance: 45, color: '#F4A460', speed: 0.00097 * 0.3, texture: generatePlanetTexture('#F4A460', '#D2691E'), hasRings: true, ringColor: '#FFD700' },
  { name: 'Uranus', radius: 1.2, distance: 55, color: '#87CEEB', speed: 0.00068 * 0.3, texture: generatePlanetTexture('#87CEEB', '#4682B4'), hasRings: true, ringColor: '#B0E0E6' },
  { name: 'Neptune', radius: 1.1, distance: 65, color: '#4169E1', speed: 0.00054 * 0.3, texture: generatePlanetTexture('#4169E1', '#000080') }
];

// Create Planets and Rings
const planets = planetData.map(planet => {
  const geometry = new THREE.SphereGeometry(planet.radius, 64, 64);
  const texture = new THREE.TextureLoader().load(planet.texture);
  const material = new THREE.MeshStandardMaterial({
    map: texture,
    roughness: 0.7,
    metalness: 0.3
  });
  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.x = planet.distance;
  scene.add(mesh);

  let ring = null;
  if (planet.hasRings) {
    const ringGeometry = new THREE.RingGeometry(planet.radius * 1.5, planet.radius * 2.2, 128);
    const ringTexture = new THREE.TextureLoader().load(generateRingTexture(planet.ringColor));
    const ringMaterial = new THREE.MeshStandardMaterial({
      map: ringTexture,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.8
    });
    ring = new THREE.Mesh(ringGeometry, ringMaterial);
    ring.rotation.x = Math.PI / 2;
    mesh.add(ring);
  }

  let moon = null;
  if (planet.hasMoon) {
    const moonGeometry = new THREE.SphereGeometry(0.2, 32, 32);
    const moonTexture = new THREE.TextureLoader().load(generatePlanetTexture('#C0C0C0', '#808080'));
    const moonMaterial = new THREE.MeshStandardMaterial({ map: moonTexture });
    moon = new THREE.Mesh(moonGeometry, moonMaterial);
    moon.position.set(planet.radius * 2, 0, 0);
    mesh.add(moon);
  }

  return { mesh, ring, moon, distance: planet.distance, speed: planet.speed };
});

// Space Station with Solar Panels
const stationBodyGeometry = new THREE.CylinderGeometry(1, 1, 5, 16);
const stationBodyMaterial = new THREE.MeshStandardMaterial({ color: 0xC0C0C0, roughness: 0.5, metalness: 0.8 });
const spaceStation = new THREE.Mesh(stationBodyGeometry, stationBodyMaterial);

const solarPanelGeometry = new THREE.BoxGeometry(6, 0.1, 2);
const solarPanelTexture = new THREE.TextureLoader().load(generateSolarPanelTexture());
const solarPanelMaterial = new THREE.MeshStandardMaterial({ map: solarPanelTexture, roughness: 0.2, metalness: 0.8 });

const leftSolarPanel = new THREE.Mesh(solarPanelGeometry, solarPanelMaterial);
leftSolarPanel.position.set(-4, 0, 0);
spaceStation.add(leftSolarPanel);

const rightSolarPanel = new THREE.Mesh(solarPanelGeometry, solarPanelMaterial);
rightSolarPanel.position.set(4, 0, 0);
spaceStation.add(rightSolarPanel);

scene.add(spaceStation);

// Lighting
const ambientLight = new THREE.AmbientLight(0x404040, 1);
scene.add(ambientLight);

const pointLight = new THREE.PointLight(0xFFFFFF, 2, 100);
scene.add(pointLight);

// Add a soft, warm glow to the sun
const sunLight = new THREE.PointLight(0xFFDD99, 2, 100);
sun.add(sunLight);

// Move camera
camera.position.z = 70;
camera.position.y = 30;
camera.lookAt(scene.position);

// Texture generation functions
function generateSunTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');
  const gradient = ctx.createRadialGradient(256, 256, 0, 256, 256, 256);
  gradient.addColorStop(0, '#FFFF00');
  gradient.addColorStop(0.5, '#FFA500');
  gradient.addColorStop(1, '#FF4500');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 512, 512);

  // Add solar flares
  ctx.globalCompositeOperation = 'lighter';
  for (let i = 0; i < 20; i++) {
    const angle = Math.random() * Math.PI * 2;
    const length = Math.random() * 100 + 50;
    ctx.strokeStyle = `rgba(255, 255, 255, ${Math.random() * 0.5 + 0.5})`;
    ctx.lineWidth = Math.random() * 5 + 2;
    ctx.beginPath();
    ctx.moveTo(256 + Math.cos(angle) * 256, 256 + Math.sin(angle) * 256);
    ctx.lineTo(256 + Math.cos(angle) * (256 + length), 256 + Math.sin(angle) * (256 + length));
    ctx.stroke();
  }

  return canvas.toDataURL();
}

function generatePlanetTexture(baseColor, secondaryColor) {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = baseColor;
  ctx.fillRect(0, 0, 512, 512);

  // Add more realistic surface details
  ctx.fillStyle = secondaryColor;
  for (let i = 0; i < 5000; i++) {
    const x = Math.random() * 512;
    const y = Math.random() * 512;
    const size = Math.random() * 3 + 1;
    ctx.globalAlpha = Math.random() * 0.5 + 0.5;
    ctx.beginPath();
    ctx.arc(x, y, size, 0, Math.PI * 2);
    ctx.fill();
  }

  // Add some atmospheric effects
  const gradient = ctx.createRadialGradient(256, 256, 0, 256, 256, 256);
  gradient.addColorStop(0, 'rgba(255, 255, 255, 0)');
  gradient.addColorStop(1, `rgba(255, 255, 255, 0.2)`);
  ctx.fillStyle = gradient;
  ctx.globalCompositeOperation = 'overlay';
  ctx.fillRect(0, 0, 512, 512);

  return canvas.toDataURL();
}

function generateRingTexture(color) {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 32;
  const ctx = canvas.getContext('2d');
  const gradient = ctx.createLinearGradient(0, 0, 512, 0);
  gradient.addColorStop(0, 'transparent');
  gradient.addColorStop(0.4, color);
  gradient.addColorStop(0.6, color);
  gradient.addColorStop(1, 'transparent');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 512, 32);

  // Add some variation to the rings
  ctx.globalCompositeOperation = 'overlay';
  for (let i = 0; i < 100; i++) {
    ctx.fillStyle = `rgba(255, 255, 255, ${Math.random() * 0.5})`;
    ctx.fillRect(Math.random() * 512, 0, Math.random() * 10, 32);
  }

  return canvas.toDataURL();
}

function generateSolarPanelTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#1a1a1a';
  ctx.fillRect(0, 0, 256, 256);
  ctx.fillStyle = '#4169E1';
  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
      ctx.fillRect(i * 32 + 1, j * 32 + 1, 30, 30);
    }
  }

  // Add some reflective highlights
  ctx.globalCompositeOperation = 'lighter';
  const gradient = ctx.createLinearGradient(0, 0, 256, 256);
  gradient.addColorStop(0, 'rgba(255, 255, 255, 0.1)');
  gradient.addColorStop(0.5, 'rgba(255, 255, 255, 0.3)');
  gradient.addColorStop(1, 'rgba(255, 255, 255, 0.1)');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 256, 256);

  return canvas.toDataURL();
}

function generateNebulaTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d');

  // Create a gradient background
  const gradient = ctx.createRadialGradient(512, 512, 0, 512, 512, 512);
  gradient.addColorStop(0, 'rgba(25, 25, 112, 0.2)');
  gradient.addColorStop(0.5, 'rgba(72, 61, 139, 0.2)');
  gradient.addColorStop(1, 'rgba(138, 43, 226, 0.2)');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 1024, 1024);

  // Add some "stars"
  ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
  for (let i = 0; i < 1000; i++) {
    ctx.beginPath();
    ctx.arc(Math.random() * 1024, Math.random() * 1024, Math.random() * 2, 0, Math.PI * 2);
    ctx.fill();
  }

  // Add some nebula-like structures
    for (let i = 0; i < 5; i++) {
      const x = Math.random() * 1024;
      const y = Math.random() * 1024;
      const radius = Math.random() * 200 + 100;
      const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
      gradient.addColorStop(0, 'rgba(255, 0, 255, 0.2)');
      gradient.addColorStop(0.5, 'rgba(0, 255, 255, 0.1)');
      gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fill();
    }

    // Add some wispy details
    ctx.globalCompositeOperation = 'screen';
    for (let i = 0; i < 50; i++) {
      const x = Math.random() * 1024;
      const y = Math.random() * 1024;
      const length = Math.random() * 200 + 50;
      const angle = Math.random() * Math.PI * 2;
      ctx.strokeStyle = `rgba(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255}, 0.1)`;
      ctx.lineWidth = Math.random() * 3 + 1;
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x + Math.cos(angle) * length, y + Math.sin(angle) * length);
      ctx.stroke();
    }

    return canvas.toDataURL();
  }

  let nebulaRotation = 0;

  function animate() {
    requestAnimationFrame(animate);

    // Rotate planets and rings
    planets.forEach((planet, index) => {
      planet.mesh.rotation.y += 0.005 / (index + 1);
      if (planet.ring) planet.ring.rotation.z += 0.001;
      const time = Date.now() * planet.speed;
      planet.mesh.position.x = Math.cos(time) * planet.distance;
      planet.mesh.position.z = Math.sin(time) * planet.distance;

      // Animate moon
      if (planet.moon) {
        const moonTime = Date.now() * 0.001;
        planet.moon.position.x = Math.cos(moonTime) * planet.mesh.geometry.parameters.radius * 2;
        planet.moon.position.z = Math.sin(moonTime) * planet.mesh.geometry.parameters.radius * 2;
      }
    });

    // Rotate stars
    stars.rotation.y += 0.00005;

    // Animate space station
    const time = Date.now() * 0.0002;
    spaceStation.position.x = Math.cos(time) * 50;
    spaceStation.position.z = Math.sin(time) * 50;
    spaceStation.position.y = Math.sin(Date.now() * 0.0005) * 10;
    spaceStation.rotation.y += 0.001;

    // Rotate sun
    sun.rotation.y += 0.001;

    // Animate solar radiation
    solarRadiation.scale.x = 1 + Math.sin(Date.now() * 0.001) * 0.1;
    solarRadiation.scale.y = 1 + Math.sin(Date.now() * 0.001) * 0.1;
    solarRadiation.scale.z = 1 + Math.sin(Date.now() * 0.001) * 0.1;

    // Animate nebula
    nebulaRotation += 0.0001;
    nebula.rotation.x = Math.sin(nebulaRotation) * 0.1;
    nebula.rotation.y = Math.cos(nebulaRotation) * 0.1;

    renderer.render(scene, camera);
  }

  animate();

  // Resize handler
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
