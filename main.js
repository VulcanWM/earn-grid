import * as THREE from 'three';
import { FlyControls } from 'three/addons/controls/FlyControls.js';
import { CSS2DRenderer, CSS2DObject } from 'three/addons/renderers/CSS2DRenderer.js';

// Scene
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x87ceeb);

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
labelRenderer.domElement.style.pointerEvents = 'none';
labelRenderer.domElement.style.fontFamily = 'Arial'
document.body.appendChild(labelRenderer.domElement);

// ---------------------------
// Fly Controls (fast)
// ---------------------------
const flyControls = new FlyControls(camera, renderer.domElement);
flyControls.movementSpeed = 800; // faster movement
flyControls.rollSpeed = Math.PI / 8; // rotation speed
flyControls.dragToLook = true;
flyControls.autoForward = false;

const clock = new THREE.Clock();

// ---------------------------
// Lights
// ---------------------------
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
    { project: "Earn Grid", amount: 10, color: "#ff6347" },
    // { project: "Project B", amount: 250, color: "#1e90ff" },
    // { project: "Project C", amount: 150, color: "#32cd32" },
    // { project: "Project D", amount: 80, color: "#ffa500" }
];

const targetAmount = 100000; // £100k goal

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

// Side Billboards
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

// Replace with image billboard
function addImageBillboard(x, y, z, imageUrl) {
    const loader = new THREE.TextureLoader();
    loader.load(imageUrl, (texture) => {
        const aspect = texture.image.width / texture.image.height;
        const height = 100; // keep same height as old billboard
        const width = height * aspect;

        const geometry = new THREE.PlaneGeometry(width, height);
        const material = new THREE.MeshBasicMaterial({
            map: texture,
            side: THREE.DoubleSide
        });

        const billboard = new THREE.Mesh(geometry, material);
        billboard.position.set(x, y, z);
        scene.add(billboard);
    });
}

// Example image billboard on the right
addImageBillboard(200, 50, 0, "assets/worldguessr.png");


// Sky Billboard for Earnings Progress
const progressCanvas = document.createElement('canvas');
progressCanvas.width = 1024;
progressCanvas.height = 1024;
const progressCtx = progressCanvas.getContext('2d');
const progressTexture = new THREE.CanvasTexture(progressCanvas);

const progressMaterial = new THREE.MeshBasicMaterial({ map: progressTexture, side: THREE.DoubleSide, transparent: true });
const progressBillboard = new THREE.Mesh(new THREE.PlaneGeometry(80, 80), progressMaterial);
progressBillboard.position.set(0, 180, -200);
scene.add(progressBillboard);

function drawProgress() {
    const current = earnData.reduce((sum, d) => sum + d.amount, 0);
    const percent = Math.min(current / targetAmount, 1);

    progressCtx.clearRect(0, 0, progressCanvas.width, progressCanvas.height);

    progressCtx.fillStyle = '#222';
    progressCtx.fillRect(0, 0, progressCanvas.width, progressCanvas.height);

    progressCtx.fillStyle = 'white';
    progressCtx.font = 'bold 80px Arial';
    progressCtx.textAlign = 'center';
    progressCtx.fillText('Earnings Progress', progressCanvas.width / 2, 150);

    progressCtx.fillStyle = 'lightgreen';
    progressCtx.font = 'bold 100px Arial';
    progressCtx.fillText(`£${current.toLocaleString()} / £${targetAmount.toLocaleString()}`, progressCanvas.width / 2, 300);

    const centerX = progressCanvas.width / 2;
    const centerY = 800;
    const radius = 200;

    progressCtx.beginPath();
    progressCtx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
    progressCtx.strokeStyle = '#555';
    progressCtx.lineWidth = 40;
    progressCtx.stroke();

    progressCtx.beginPath();
    progressCtx.arc(centerX, centerY, radius, -Math.PI / 2, (-Math.PI / 2) + (2 * Math.PI * percent));
    progressCtx.strokeStyle = '#4caf50';
    progressCtx.lineWidth = 40;
    progressCtx.stroke();

    progressCtx.fillStyle = 'yellow';
    progressCtx.font = 'bold 80px Arial';
    progressCtx.fillText(`${Math.round(percent * 100)}%`, centerX, centerY + 30);

    progressTexture.needsUpdate = true;
}

drawProgress();

// Animate Loop
function animate() {
    requestAnimationFrame(animate);
    const delta = clock.getDelta();
    flyControls.update(delta);
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
