import * as THREE from 'three';
import gsap from 'gsap';
import { camera, view } from './scene.js';
import { interactiveObjects, getSectionRoot } from './models.js';
import { renderHudSection } from './ui.js';

export const mouse = new THREE.Vector2();
const raycaster = new THREE.Raycaster();
const hoverLabelEl = document.getElementById('hover-label');

let activeObject = null;
export function isModalOpen() {
    return activeObject !== null;
}

function closeModal() {
    const modalOverlay = document.getElementById('modal-overlay');
    const lightbox = document.getElementById('image-lightbox');

    if (!lightbox.classList.contains('hidden')) {
        lightbox.classList.add('hidden');
        return;
    }

    if (!modalOverlay.classList.contains('hidden')) {
        modalOverlay.classList.add('hidden');
        gsap.to(camera.position, {
            x: 0, y: 0, z: view.z,
            duration: 1.2, ease: 'power2.inOut',
            onComplete: () => { activeObject = null; view.locked = false; }
        });
        gsap.to('#main-title, #main-footer', { opacity: 1, duration: 0.8 });
    }
}

window.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' || event.key === 'Esc') {
        closeModal();
    }
});

window.addEventListener('mousemove', (event) => {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    if (activeObject) return;

    hoverLabelEl.style.left = `${event.clientX}px`;
    hoverLabelEl.style.top = `${event.clientY}px`;

    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(interactiveObjects, true);

    if (intersects.length > 0) {
        const root = getSectionRoot(intersects[0].object);
        document.body.style.cursor = 'pointer';
        hoverLabelEl.textContent = root.userData.label;
        hoverLabelEl.classList.remove('hidden');
    } else {
        document.body.style.cursor = 'crosshair';
        hoverLabelEl.classList.add('hidden');
    }
});

window.addEventListener('click', (event) => {
    if (activeObject) return;
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(interactiveObjects, true);

    if (intersects.length > 0) {
        const clickedMesh = getSectionRoot(intersects[0].object);
        activeObject = clickedMesh;
        view.locked = true;
        hoverLabelEl.classList.add('hidden');
        renderHudSection(clickedMesh.userData.section);

        gsap.to(camera.position, {
            x: clickedMesh.position.x, y: clickedMesh.position.y, z: clickedMesh.position.z + 3.5,
            duration: 1.2, ease: 'power2.inOut',
            onComplete: () => document.getElementById('modal-overlay').classList.remove('hidden')
        });

        gsap.to('#main-title, #main-footer', { opacity: 0, duration: 0.6 });
    }
});

document.getElementById('modal-overlay').addEventListener('click', (e) => {
    if (e.target.id === 'modal-overlay' || e.target.id === 'close-btn') {
        closeModal();
    }
});

// ── Contact button (footer): opens the contact modal without moving the camera ──
const contactBtn = document.getElementById('contact-btn');
if (contactBtn) {
    contactBtn.addEventListener('click', () => {
        if (activeObject) return;
        activeObject = { contact: true };      // any truthy value: blocks hover/click on the 3D figures
        hoverLabelEl.classList.add('hidden');
        renderHudSection('contact');
        document.getElementById('modal-overlay').classList.remove('hidden');
        gsap.to('#main-title, #main-footer', { opacity: 0, duration: 0.6 });
    });
}