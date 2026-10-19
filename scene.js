import * as THREE from 'three';
import { CAMERA_Z } from './config.js';

const canvas = document.querySelector('#webgl');

export const scene = new THREE.Scene();

export const camera = new THREE.PerspectiveCamera(80, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = CAMERA_Z;

export const renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

const pointLight = new THREE.PointLight(0xfff1e0, 60, 100);   // luz cálida
pointLight.position.set(6, 6, 8);
const pointLight2 = new THREE.PointLight(0x7f9bff, 40, 100);  // relleno azul
pointLight2.position.set(-6, -4, 6);
const sun = new THREE.DirectionalLight(0xffffff, 2.5);        // blanco brillante
sun.position.set(10, 14, 24);
scene.add(pointLight, pointLight2, sun, new THREE.AmbientLight(0xffffff, 0.55));

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});