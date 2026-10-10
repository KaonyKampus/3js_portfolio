import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { scene } from './scene.js';
import { PALETTES, ACTIVE_PALETTE, EMISSIVE_STRENGTH, MODEL_SCALE, MODEL_SPACING, CAMERA_Z } from './config.js';

const loader = new GLTFLoader();

function applyPalette(root) {
    const palette = PALETTES[ACTIVE_PALETTE];
    root.traverse((child) => {
        if (!child.isMesh) return;
        const name = child.material.name;
        const hex = palette[name];
        if (!hex) return;
        child.material.color.set(hex);
        child.material.emissive.set(hex);
        child.material.emissiveIntensity = EMISSIVE_STRENGTH[name] ?? 0.12;
        if (name === 'glass') child.material.depthWrite = false;
    });
}

function createSection({ file, position, scale, section, label }) {
    const group = new THREE.Group();
    group.position.copy(position);
    group.userData = { section, initialY: position.y, label };
    scene.add(group);

    loader.load(
        file,
        (gltf) => {
            gltf.scene.scale.setScalar(scale);
            applyPalette(gltf.scene);
            group.add(gltf.scene);
        },
        undefined,
        (err) => console.error(`Could not load ${file}`, err)
    );
    return group;
}

export const cubeMesh = createSection({
    file: '/models/about-me.glb',
    position: new THREE.Vector3(-MODEL_SPACING, -0.4, 0.5),
    scale: MODEL_SCALE,
    section: 'about',
    label: 'About Me'
});

export const pyramidMesh = createSection({
    file: '/models/projects.glb',
    position: new THREE.Vector3(0, -0.4, 0.5),
    scale: MODEL_SCALE,
    section: 'projects',
    label: 'Projects'
});

export const sphereMesh = createSection({
    file: '/models/experience.glb',
    position: new THREE.Vector3(MODEL_SPACING, -0.4, 0.5),
    scale: MODEL_SCALE,
    section: 'experience',
    label: 'Experience'
});

export const interactiveObjects = [cubeMesh, pyramidMesh, sphereMesh];

interactiveObjects.forEach((m) => {
    m.userData.faceAngle = Math.atan2(0 - m.position.x, CAMERA_Z - m.position.z);
});

export function getSectionRoot(object) {
    let current = object;
    while (current && !current.userData.section) current = current.parent;
    return current;
}