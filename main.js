import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// Scene setup
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xf0f8ff);

// Camera
const camera = new THREE.PerspectiveCamera(50, window.innerWidth/window.innerHeight, 1, 2000);
camera.position.set(0, 200, 400);

// Renderer
const renderer = new THREE.WebGLRenderer({antialias:true});
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

// Lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
directionalLight.position.set(0, 500, 500);
scene.add(directionalLight);

// Sample earnings data
const earnData = [
    { project: "Project A", amount: 100, color: "#ff6347" },
    { project: "Project B", amount: 250, color: "#1e90ff" },
    { project: "Project C", amount: 150, color: "#32cd32" },
    { project: "Project D", amount: 80, color: "#ffa500" }
];

// Create cuboids
earnData.forEach((cube, i) => {
    const geometry = new THREE.BoxGeometry(40, cube.amount, 40);
    const material = new THREE.MeshStandardMaterial({ color: cube.color });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(i * 60 - (earnData.length*30) + 30, cube.amount / 2, 0);
    scene.add(mesh);
});

// Create side billboards
function addBillboard(x, y, z) {
    const geometry = new THREE.BoxGeometry(60, 100, 5);
    const material = new THREE.MeshStandardMaterial({ color: 0xcccccc });
    const billboard = new THREE.Mesh(geometry, material);
    billboard.position.set(x, y, z);
    scene.add(billboard);
}

addBillboard(-200, 50, 0);
addBillboard(200, 50, 0);

// Render loop
function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
}

animate();

// Handle window resize
window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth/window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
