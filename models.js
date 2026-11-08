import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { scene, camera, view } from './scene.js';
import { PALETTES, ACTIVE_PALETTE, EMISSIVE_STRENGTH, MODEL_SCALE, MODEL_SPACING, CAMERA_Z, STACK_BREAKPOINT, STACK_FILL, STACK_HEIGHT, STACK_GAP, STACK_LIFT } from './config.js';

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
            applyLayout();   // now that the real size is known, fit it to the screen
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

// Phones: scales each figure so it fills its screen (limited by width or height) and centres it on its slot
const boxSize = new THREE.Vector3();
const boxCenter = new THREE.Vector3();
function fitToScreen(obj, visW, visH) {
    const model = obj.userData.model;
    const rotY = obj.rotation.y;
    obj.rotation.y = 0;
    model.scale.setScalar(obj.userData.baseScale);
    model.position.set(0, 0, 0);
    obj.updateMatrixWorld(true);
    const box = new THREE.Box3().setFromObject(model);
    box.getSize(boxSize);
    box.getCenter(boxCenter);
    boxCenter.sub(obj.position);                      // centre of the figure relative to its group
    const f = Math.min((visW * STACK_FILL) / boxSize.x, (visH * STACK_HEIGHT) / boxSize.y);
    model.scale.setScalar(obj.userData.baseScale * f);
    model.position.set(-boxCenter.x * f, -boxCenter.y * f, 0);
    obj.rotation.y = rotY;
}

// Places the figures for the current screen shape: side by side on wide screens,
// stacked vertically on tall ones (phones / tablets in portrait).
export function applyLayout() {
    const aspect = window.innerWidth / window.innerHeight;
    const stacked = aspect < STACK_BREAKPOINT;
    let slots;

    document.documentElement.classList.toggle('stacked', stacked);
    let visW = 0, visH = 0;

    if (stacked) {
        // one figure per screen: the figures are one full screen apart and the camera follows the scroll
        view.z = CAMERA_Z;
        const halfFov = THREE.MathUtils.degToRad(camera.fov / 2);
        visH = 2 * (view.z - 0.5) * Math.tan(halfFov);   // world height visible at the figures' depth
        visW = visH * aspect;
        sizeFactor = 1;
        const gap = visH * STACK_GAP;
        const lift = visH * STACK_LIFT;
        slots = [[0, gap], [0, 0], [0, -gap]];
        view.ys = [gap - lift, -lift, -gap - lift, -gap * 2 - lift];   // camera stops: 3 figures + the links screen
    } else {
        view.ys = [];
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
        const model = obj.userData.model;
        if (!model) return;
        if (stacked) {
            fitToScreen(obj, visW, visH);
        } else {
            model.position.set(0, 0, 0);
            model.scale.setScalar(obj.userData.baseScale * sizeFactor);
        }
    });

    if (!view.locked) camera.position.z = view.z;
    window.dispatchEvent(new Event('layoutchange'));
}

applyLayout();
window.addEventListener('resize', applyLayout);

export function getSectionRoot(object) {
    let current = object;
    while (current && !current.userData.section) current = current.parent;
    return current;
}