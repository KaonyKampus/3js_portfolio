import * as THREE from 'three';
import { scene, camera, renderer } from './scene.js';
import { SWAY_BUST, SWAY_LAPTOP } from './config.js';
import { updateStars } from './starfield.js';
import { cubeMesh, pyramidMesh, sphereMesh } from './models.js';
import { mouse, isModalOpen } from './interaction.js';

const mainTitleEl = document.getElementById('main-title');
const socialIcons = document.querySelectorAll('.social-icon');

const mouse3D = new THREE.Vector3();
const raycasterMouse = new THREE.Raycaster();

const clock = new THREE.Clock();

let modelTime = 0;
let lastElapsed = 0;

function animate() {
    requestAnimationFrame(animate);
    const elapsedTime = clock.getElapsedTime();
    const delta = elapsedTime - lastElapsed;
    lastElapsed = elapsedTime;

    raycasterMouse.setFromCamera(mouse, camera);
    const targetZ = -15;
    const distanceToZ = (targetZ - camera.position.z) / raycasterMouse.ray.direction.z;
    mouse3D.copy(camera.position).add(raycasterMouse.ray.direction.clone().multiplyScalar(distanceToZ));

    updateStars(mouse3D, elapsedTime);

    if (mainTitleEl) {
        const titleOffsetY = Math.sin(elapsedTime * 1.2) * 6;
        const titleRotZ = Math.cos(elapsedTime * 0.8) * 0.6;
        mainTitleEl.style.transform = `translateY(${titleOffsetY}px) rotate(${titleRotZ}deg)`;
    }

    socialIcons.forEach((icon, index) => {
        const iconOffsetY = Math.sin(elapsedTime * 1.8 + index * 0.8) * 7;
        const iconOffsetX = Math.cos(elapsedTime * 1.2 + index * 0.5) * 4;
        icon.style.transform = `translate(${iconOffsetX}px, ${iconOffsetY}px)`;
    });

    if (!isModalOpen()) {
        modelTime += delta;
        cubeMesh.rotation.y = cubeMesh.userData.faceAngle + Math.sin(modelTime * 0.6) * SWAY_BUST;
        pyramidMesh.rotation.y = pyramidMesh.userData.faceAngle + Math.sin(modelTime * 0.6 + 1) * SWAY_LAPTOP;
        sphereMesh.rotation.y -= 0.008;

        cubeMesh.position.y = cubeMesh.userData.initialY + Math.sin(modelTime * 1.5) * 0.15;
        pyramidMesh.position.y = pyramidMesh.userData.initialY + Math.sin(modelTime * 1.5 + 1) * 0.15;
        sphereMesh.position.y = sphereMesh.userData.initialY + Math.sin(modelTime * 1.5 + 2) * 0.15;
    }

    renderer.render(scene, camera);
}

animate();