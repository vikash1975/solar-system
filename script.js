const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(60, window.innerWidth/window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('solarCanvas') });
renderer.setSize(window.innerWidth, window.innerHeight);

const sun = createPlanet(3, 0xffff00, "Sun");
scene.add(sun.mesh);


const planetData = [
  { name: "Mercury", radius: 0.4, distance: 5, speed: 0.02, color: 0xaaaaaa },
  { name: "Venus", radius: 0.6, distance: 7, speed: 0.015, color: 0xffcc00 },
  { name: "Earth", radius: 0.65, distance: 9, speed: 0.01, color: 0x0000ff },
  { name: "Mars", radius: 0.5, distance: 11, speed: 0.008, color: 0xff0000 },
  { name: "Jupiter", radius: 1.5, distance: 14, speed: 0.006, color: 0xff9900 },
  { name: "Saturn", radius: 1.2, distance: 18, speed: 0.004, color: 0xffcc99 },
  { name: "Uranus", radius: 1.0, distance: 22, speed: 0.003, color: 0x66ccff },
  { name: "Neptune", radius: 1.0, distance: 26, speed: 0.002, color: 0x3333ff },
];

const planets = planetData.map(data => {
  const planet = createPlanet(data.radius, data.color, data.name);
  planet.distance = data.distance;
  planet.angle = 0;
  planet.speed = data.speed;
  scene.add(planet.mesh);
  createSlider(data.name, data.speed);
  return planet;
});

function createPlanet(radius, color, name) {
  const geometry = new THREE.SphereGeometry(radius, 32, 32);
  const material = new THREE.MeshStandardMaterial({ color });
  const mesh = new THREE.Mesh(geometry, material);
  mesh.name = name;
  return { mesh };
}

const light = new THREE.PointLight(0xffffff, 2, 100);
scene.add(light);

camera.position.z = 40;

let paused = false;
document.getElementById('pause-btn').onclick = () => paused = true;
document.getElementById('resume-btn').onclick = () => paused = false;

function createSlider(name, defaultSpeed) {
  const container = document.getElementById('control-panel');
  const label = document.createElement('label');
  label.textContent = `${name} Speed: `;
  const input = document.createElement('input');
  input.type = 'range';
  input.min = 0;
  input.max = 0.05;
  input.step = 0.001;
  input.value = defaultSpeed;
  input.oninput = () => {
    const planet = planets.find(p => p.mesh.name === name);
    if (planet) planet.speed = parseFloat(input.value);
  };
  label.appendChild(input);
  container.appendChild(label);
  container.appendChild(document.createElement('br'));
}

const tooltip = document.getElementById('tooltip');
window.addEventListener('mousemove', (event) => {
  const mouse = new THREE.Vector2(
    (event.clientX / window.innerWidth) * 2 - 1,
    -(event.clientY / window.innerHeight) * 2 + 1
  );
  const raycaster = new THREE.Raycaster();
  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(planets.map(p => p.mesh));
  if (intersects.length > 0) {
    tooltip.style.display = 'block';
    tooltip.style.left = event.clientX + 10 + 'px';
    tooltip.style.top = event.clientY + 10 + 'px';
    tooltip.innerText = intersects[0].object.name;
  } else {
    tooltip.style.display = 'none';
  }
});

document.getElementById('toggle-mode').onclick = () => {
  const isDark = document.body.style.backgroundColor === 'black';
  document.body.style.backgroundColor = isDark ? 'white' : 'black';
  document.body.style.color = isDark ? 'black' : 'white';
};

function animate() {
  requestAnimationFrame(animate);
  if (!paused) {
    planets.forEach(p => {
      p.angle += p.speed;
      p.mesh.position.x = p.distance * Math.cos(p.angle);
      p.mesh.position.z = p.distance * Math.sin(p.angle);
    });
  }
  renderer.render(scene, camera);
}

animate();