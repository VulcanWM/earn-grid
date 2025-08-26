import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { CSS2DRenderer, CSS2DObject } from 'three/addons/renderers/CSS2DRenderer.js';

// Scene
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x87ceeb); // Sky blue

// Camera
const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 1, 2000);
camera.position.set(0, 200, 400);

// Renderer
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Label Renderer
const labelRenderer = new CSS2DRenderer();
labelRenderer.setSize(window.innerWidth, window.innerHeight);
labelRenderer.domElement.style.position = 'absolute';
labelRenderer.domElement.style.top = '0px';
labelRenderer.domElement.style.pointerEvents = 'none'; // <-- allows orbit controls to work
document.body.appendChild(labelRenderer.domElement);

// Controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

// Lights
const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
directionalLight.position.set(0, 500, 500);
scene.add(directionalLight);

// Sun
const sunLight = new THREE.DirectionalLight(0xffffff, 1);
sunLight.position.set(200, 400, 100);
scene.add(sunLight);

const sunMesh = new THREE.Mesh(
    new THREE.SphereGeometry(30, 32, 32),
    new THREE.MeshBasicMaterial({ color: 0xffee88 })
);
sunMesh.position.copy(sunLight.position);
scene.add(sunMesh);

// Ground
const groundGeometry = new THREE.PlaneGeometry(1000, 1000);
const groundMaterial = new THREE.MeshStandardMaterial({ color: 0x228B22 });
const ground = new THREE.Mesh(groundGeometry, groundMaterial);
ground.rotation.x = -Math.PI / 2;
scene.add(ground);

// Sample earnings data
const earnData = [
    { project: "Project A", amount: 100, color: "#ff6347" },
    { project: "Project B", amount: 250, color: "#1e90ff" },
    { project: "Project C", amount: 150, color: "#32cd32" },
    { project: "Project D", amount: 80, color: "#ffa500" }
];

// Cuboids + labels
earnData.forEach((cube, i) => {
    const geometry = new THREE.BoxGeometry(40, cube.amount, 40);
    const material = new THREE.MeshStandardMaterial({ color: cube.color });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(i * 60 - (earnData.length * 30) + 30, cube.amount / 2, 0);
    scene.add(mesh);

    const div = document.createElement('div');
    div.className = 'label';
    div.textContent = `${cube.project}: £${cube.amount}`;
    div.style.color = 'black';
    div.style.fontWeight = 'bold';
    div.style.fontSize = '14px';
    div.style.backgroundColor = 'rgba(255,255,255,0.7)';
    div.style.padding = '2px 5px';
    div.style.borderRadius = '4px';
    const label = new CSS2DObject(div);
    label.position.set(0, cube.amount / 2 + 10, 0);
    mesh.add(label);
});

// Billboards
function addBillboard(x, y, z, text) {
    const geometry = new THREE.BoxGeometry(60, 100, 5);
    const material = new THREE.MeshStandardMaterial({ color: 0xcccccc });
    const billboard = new THREE.Mesh(geometry, material);
    billboard.position.set(x, y, z);
    scene.add(billboard);

    const div = document.createElement('div');
    div.className = 'label';
    div.textContent = text;
    div.style.color = 'black';
    div.style.fontWeight = 'bold';
    div.style.fontSize = '12px';
    div.style.backgroundColor = 'rgba(255,255,255,0.7)';
    div.style.padding = '4px 6px';
    div.style.borderRadius = '4px';
    div.style.textAlign = 'center';
    const label = new CSS2DObject(div);
    label.position.set(0, 50, 0);
    billboard.add(label);
}

addBillboard(-200, 50, 0, "Your business could be here");
addBillboard(200, 50, 0, "Your business could be here");

// Render loop
function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
    labelRenderer.render(scene, camera);
}

animate();

// Resize handling
window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    labelRenderer.setSize(window.innerWidth, window.innerHeight);
});
