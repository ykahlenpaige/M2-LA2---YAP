const FIRST_NAME = "Kahlen";
const FONT_URL =
  "https://cdn.jsdelivr.net/npm/three@0.135.0/examples/fonts/helvetiker_bold.typeface.json";
const FIELD_HALF_SIZE = 300;
const FALL_SPEED = 0.9;
const COLOR_CHANGE_INTERVAL_MS = 3000;

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  10,
  1000
);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
let cubeMesh = new THREE.Mesh();
let stars, starGeo, starMaterial;

lighting();
cube();
particles();
startColorChange();

function particles() {
  const points = [];

  for (let i = 0; i < 6000; i++) {
    let star = new THREE.Vector3(
      Math.random() * 600 - 300,
      Math.random() * 600 - 300,
      Math.random() * 600 - 300
    );
    points.push(star);
  }

  starGeo = new THREE.BufferGeometry().setFromPoints(points);

  let sprite = new THREE.TextureLoader().load("assets/images/star.png");
  starMaterial = new THREE.PointsMaterial({
    color: 0xffb6c1,
    size: 0.7,
    map: sprite,
  });

  stars = new THREE.Points(starGeo, starMaterial);
  scene.add(stars);
}

// Each star falls on its own and respawns at the top once it passes the bottom
function animateParticles() {
  const positions = starGeo.attributes.position.array;

  for (let i = 1; i < positions.length; i += 3) {
    positions[i] -= FALL_SPEED;

    if (positions[i] < -FIELD_HALF_SIZE) {
      positions[i] = FIELD_HALF_SIZE;
    }
  }

  starGeo.attributes.position.needsUpdate = true;
}

// Bonus: random particle color every 3 seconds
function startColorChange() {
  setInterval(() => {
    starMaterial.color.setHSL(Math.random(), 1, 0.7);
  }, COLOR_CHANGE_INTERVAL_MS);
}

function cube() {
  const texture = new THREE.TextureLoader().load("assets/textures/wooden.jpg");
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(0.1, 0.1);

  const cubeMaterial = new THREE.MeshBasicMaterial({ map: texture });

  new THREE.FontLoader().load(FONT_URL, (font) => {
    const textGeometry = new THREE.TextGeometry(FIRST_NAME, {
      font: font,
      size: 3,
      height: 1,
      curveSegments: 8,
    });
    textGeometry.center();

    cubeMesh.geometry = textGeometry;
    cubeMesh.material = cubeMaterial;
  });

  cubeMesh.position.z = -5;
  camera.position.z = 15;

  scene.add(cubeMesh);
}

function lighting() {
  const light = new THREE.HemisphereLight(0x780a44, 0x1c3020, 1);
  scene.add(light);

  const spotLight = new THREE.SpotLight(0xffffff);
  spotLight.position.set(0, 0, 15);
  spotLight.castShadow = true;
  spotLight.shadow.mapSize.width = 1024;
  spotLight.shadow.mapSize.height = 1024;
  spotLight.shadow.camera.near = 500;
  spotLight.shadow.camera.far = 4000;
  spotLight.shadow.camera.fov = 30;
  scene.add(spotLight);
}

function animate() {
  requestAnimationFrame(animate);

  animateParticles();

  cubeMesh.rotation.x += 0.008;
  cubeMesh.rotation.y += 0.008;
  renderer.render(scene, camera);
}

animate();