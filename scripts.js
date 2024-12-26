// Scene setup
const container = document.getElementById('canvas-container');
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();

renderer.setSize(window.innerWidth, window.innerHeight);
container.appendChild(renderer.domElement);

// Lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5); // Soft white light
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(10, 10, 10);
scene.add(directionalLight);

// OrbitControls for rotation and zoom
const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true; // Smooth damping
controls.dampingFactor = 0.05;
controls.screenSpacePanning = false;
controls.minDistance = 2; // Minimum zoom distance
controls.maxDistance = 50; // Maximum zoom distance

// Load GLTF model
const loader = new THREE.GLTFLoader();
loader.load(
  './model.gltf', // Replace with the path to your GLTF file
  (gltf) => {
    const model = gltf.scene;
    scene.add(model);

    // Optional: Center the model
    const box = new THREE.Box3().setFromObject(model);
    const center = box.getCenter(new THREE.Vector3());
    model.position.sub(center);

    animate();
  },
  (xhr) => {
    console.log(`Model ${Math.round((xhr.loaded / xhr.total) * 100)}% loaded`);
  },
  (error) => {
    console.error('An error occurred:', error);
  }
);

// Resize handler
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// Animation loop
function animate() {
  requestAnimationFrame(animate);
  controls.update(); // Update OrbitControls
  renderer.render(scene, camera);
}

// Set initial camera position
camera.position.set(0, 2, 5);
