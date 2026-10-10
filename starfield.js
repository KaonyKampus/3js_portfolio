import * as THREE from 'three';
import { scene } from './scene.js';
import { STAR_COUNT } from './config.js';

const starPositions = new Float32Array(STAR_COUNT * 3);
const starColors = new Float32Array(STAR_COUNT * 3);

const colorWhite = new THREE.Color(0xffffff);
const colorBlue = new THREE.Color(0x38bdf8);
const colorPurple = new THREE.Color(0xa855f7);
const colorPink = new THREE.Color(0xf472b6);

for (let i = 0; i < STAR_COUNT; i++) {
    const i3 = i * 3;

    if (i < STAR_COUNT * 0.55) {
        const distAlongBand = (Math.random() - 0.5) * 160;
        const distFromCenter = (Math.random() - 0.5) * (Math.random() - 0.5) * 40;
        starPositions[i3] = distAlongBand + distFromCenter;
        starPositions[i3 + 1] = distAlongBand * 0.25 + distFromCenter;
        starPositions[i3 + 2] = -10 - Math.random() * 30;

        const randColor = Math.random();
        let selectedColor = randColor < 0.4 ? colorBlue : (randColor < 0.7 ? colorPurple : colorPink);
        starColors[i3] = selectedColor.r;
        starColors[i3 + 1] = selectedColor.g;
        starColors[i3 + 2] = selectedColor.b;
    } else {
        starPositions[i3] = (Math.random() - 0.5) * 180;
        starPositions[i3 + 1] = (Math.random() - 0.5) * 180;
        starPositions[i3 + 2] = -10 - Math.random() * 60;
        starColors[i3] = colorWhite.r;
        starColors[i3 + 1] = colorWhite.g;
        starColors[i3 + 2] = colorWhite.b;
    }
}

const originalStarPositions = new Float32Array(starPositions);

const starGeometry = new THREE.BufferGeometry();
starGeometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
starGeometry.setAttribute('color', new THREE.BufferAttribute(starColors, 3));

const starMaterial = new THREE.PointsMaterial({ size: 0.08, vertexColors: true, transparent: true, opacity: 0.85 });
const starField = new THREE.Points(starGeometry, starMaterial);
scene.add(starField);

export function updateStars(mouse3D, elapsedTime) {
    const positions = starGeometry.attributes.position.array;
    const radiusRepel = 4.5;
    const forceRepel = 2.0;

    for (let i = 0; i < STAR_COUNT; i++) {
        const i3 = i * 3;

        const origX = originalStarPositions[i3];
        const origY = originalStarPositions[i3 + 1];

        let currentX = positions[i3];
        let currentY = positions[i3 + 1];

        const dx = currentX - mouse3D.x;
        const dy = currentY - mouse3D.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < radiusRepel && dist > 0) {
            const angle = Math.atan2(dy, dx);
            const pushFactor = (1 - dist / radiusRepel) * forceRepel;

            positions[i3] += Math.cos(angle) * pushFactor * 0.15;
            positions[i3 + 1] += Math.sin(angle) * pushFactor * 0.15;
        } else {
            positions[i3] += (origX - currentX) * 0.05;
            positions[i3 + 1] += (origY - currentY) * 0.05;
        }
    }
    starGeometry.attributes.position.needsUpdate = true;

    starField.rotation.y = Math.sin(elapsedTime * 0.2) * 0.08;
    starField.rotation.x = Math.cos(elapsedTime * 0.15) * 0.04;
}