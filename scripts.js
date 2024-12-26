// Scene setup
const container = document.getElementById('canvas-container');
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true; // Bật đổ bóng
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
container.appendChild(renderer.domElement);

// Ánh sáng buổi sáng Đông (ánh sáng vàng nhạt)
const ambientLight = new THREE.AmbientLight(0xffffff, 0.3); // Ánh sáng môi trường nhẹ
scene.add(ambientLight);

const morningLight = new THREE.DirectionalLight(0xffffff, 2); // Màu ánh sáng buổi sáng
morningLight.position.set(-10, 15, 5); // Vị trí hướng Đông (x âm, y dương để cao, z dương để hơi chếch)
morningLight.castShadow = true; // Bật đổ bóng
morningLight.shadow.mapSize.width = 2048; // Độ phân giải bóng cao
morningLight.shadow.mapSize.height = 2048;
morningLight.shadow.camera.near = 0.5;
morningLight.shadow.camera.far = 50;

// Điều chỉnh kích thước camera chiếu bóng
morningLight.shadow.camera.left = -20;
morningLight.shadow.camera.right = 20;
morningLight.shadow.camera.top = 20;
morningLight.shadow.camera.bottom = -20;
morningLight.shadow.bias = -0.002; // Làm mềm bóng
scene.add(morningLight);



// OrbitControls
const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.screenSpacePanning = false;
controls.minDistance = 2;
controls.maxDistance = 50;

// Load GLTF model
const loader = new THREE.GLTFLoader();
loader.load(
  './model.gltf',
  (gltf) => {
    const model = gltf.scene;

    model.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true; // Tạo bóng
        child.receiveShadow = true; // Nhận bóng
      }
    });

    const box = new THREE.Box3().setFromObject(model);
    const center = box.getCenter(new THREE.Vector3());
    model.position.sub(center);

    scene.add(model);
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
  controls.update();
  renderer.render(scene, camera);
}

// Set initial camera position
camera.position.set(0, 5, 5);
