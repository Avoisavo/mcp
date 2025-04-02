import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { initSidebar } from './components/sidebar.js';

// Scene setup
const scene = new THREE.Scene();
scene.background = new THREE.Color('#eeeee4'); // Light blue background (sky blue)

// Camera setup
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(5, 5, 5);
camera.lookAt(0, 0, 0);

// Renderer setup
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
document.body.appendChild(renderer.domElement);

// Controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

// Lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1.0);
directionalLight.position.set(5, 10, 5);
directionalLight.castShadow = true;
scene.add(directionalLight);

// Room dimensions
const roomWidth = 6;
const roomHeight = 3;
const roomDepth = 6;

// Floor (specific color)
const floorGeometry = new THREE.PlaneGeometry(roomWidth, roomDepth);
const floorMaterial = new THREE.MeshStandardMaterial({ 
    color: new THREE.Color('#bcbdbc'),  // Fixed to the brown color you wanted
    side: THREE.DoubleSide 
});
const floor = new THREE.Mesh(floorGeometry, floorMaterial);
floor.rotation.x = -Math.PI / 2;
floor.position.y = 0;
floor.receiveShadow = true;
scene.add(floor);

// Left wall (light blue color)
const leftWallGeometry = new THREE.PlaneGeometry(roomDepth, roomHeight);
const leftWallMaterial = new THREE.MeshStandardMaterial({ 
    color: new THREE.Color('#6d99c7'),  // Using string format with THREE.Color
    side: THREE.DoubleSide 
});
const leftWall = new THREE.Mesh(leftWallGeometry, leftWallMaterial);
leftWall.rotation.y = Math.PI / 2;
leftWall.position.set(-roomWidth/2, roomHeight/2, 0);
leftWall.receiveShadow = true;
scene.add(leftWall);

// Back wall (specific color #fff9e3)
const backWallGeometry = new THREE.PlaneGeometry(roomWidth, roomHeight);
const backWallMaterial = new THREE.MeshStandardMaterial({ 
    color: new THREE.Color('#fff9e3'),  // Using string format with THREE.Color
    side: THREE.DoubleSide 
});
const backWall = new THREE.Mesh(backWallGeometry, backWallMaterial);
backWall.position.set(0, roomHeight/2, -roomDepth/2);
backWall.receiveShadow = true;
scene.add(backWall);

// Initialize the sidebar
initSidebar();

// Handle window resize
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

animate();