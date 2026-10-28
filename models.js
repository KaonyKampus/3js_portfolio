import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { scene, camera, view } from './scene.js';
import { PALETTES, ACTIVE_PALETTE, EMISSIVE_STRENGTH, MODEL_SCALE, MODEL_SPACING, CAMERA_Z, STACK_BREAKPOINT, STACK_SCALE, STACK_SPACING } from './config.js';

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

let sizeFactor = 1; // 1 on desktop, smaller when the figures are stacked on a phone

function createSection({ file, position, scale, section, label }) {
    const group = new THREE.Group();
    group.position.copy(position);
    group.userData = { section, initialY: position.y, label, baseScale: scale, model: null };
    scene.add(group);

    loader.load(
        file,
        (gltf) => {
            gltf.scene.scale.setScalar(scale * sizeFactor);
            applyPalette(gltf.scene);
            group.add(gltf.scene);
            group.userData.model = gltf.scene;
        },
        undefined,
        (err) => console.error(`Could not load ${file}`, err)
    );
    return group;
}

export const cubeMesh = createSection({
    file: '/models/about-me.glb',
    position: new THREE.Vector3(-MODEL_SPACING, -0.4, 0.5),
    scale: MODEL_SCALE ,
    section: 'about',
    label: 'About Me'
});

export const pyramidMesh = createSection({
    file: '/models/projects.glb',
    position: new THREE.Vector3(0, -0.4, 0.5),
    scale: MODEL_SCALE * 1.8,
    section: 'projects',
    label: 'Projects'
});

export const sphereMesh = createSection({
    file: '/models/experience.glb',
    position: new THREE.Vector3(MODEL_SPACING, -0.4, 0.5),
    scale: MODEL_SCALE * 1.3,
    section: 'experience',
    label: 'Experience'
});

export const interactiveObjects = [cubeMesh, pyramidMesh, sphereMesh];

// Places the figures for the current screen shape: side by side on wide screens,
// stacked vertically on tall ones (phones / tablets in portrait).
export function applyLayout() {
    const aspect = window.innerWidth / window.innerHeight;
    const stacked = aspect < STACK_BREAKPOINT;
    let slots;

    if (stacked) {
        sizeFactor = STACK_SCALE;
        view.z = CAMERA_Z;
        slots = [[0, STACK_SPACING + 0.2], [0, 0.2], [0, -STACK_SPACING + 0.2]];
    } else {
        // very short screens (phones held sideways): shrink a little so the title and footer do not cover the figures
        const short = window.innerHeight < 520;
        sizeFactor = short ? 0.72 : 1;
        // move the camera back a little on squarer screens so the side figures still fit
        const halfFov = THREE.MathUtils.degToRad(camera.fov / 2);
        view.z = Math.max(CAMERA_Z, (MODEL_SPACING + 2.8) / (Math.tan(halfFov) * aspect));
        const y = short ? 0.2 : -0.4;
        slots = [[-MODEL_SPACING, y], [0, y], [MODEL_SPACING, y]];
    }

    interactiveObjects.forEach((obj, i) => {
        obj.position.set(slots[i][0], slots[i][1], 0.5);
        obj.userData.initialY = slots[i][1];
        obj.userData.faceAngle = Math.atan2(0 - obj.position.x, view.z - obj.position.z);
        if (obj.userData.model) obj.userData.model.scale.setScalar(obj.userData.baseScale * sizeFactor);
    });

    if (!view.locked) camera.position.z = view.z;
}

applyLayout();
window.addEventListener('resize', applyLayout);

export function getSectionRoot(object) {
    let current = object;
    while (current && !current.userData.section) current = current.parent;
    return current;
}