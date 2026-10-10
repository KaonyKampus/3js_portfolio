/*
    ||||Mandatory for every 3d JS project 
*/
//we import everything from three
import * as THREE from 'three';
//Import 3d environment 
import gsap from 'gsap';
//We insert a constant which has a query selector that points to WEBGL which is the id of the canvas in the HTML 
const canvas = document.querySelector('#webgl');
//We insert a constant with a ne object three which has the scene. So we put a method which is the scene.  
const scene = new THREE.Scene();
///We create a new object camera wich has a perspective. 
const camera = new THREE.PerspectiveCamera(80, window.innerWidth / window.innerHeight, 0.1, 1000);
//the distance the camera is outside the screen
camera.position.z = 8.5;
//create a const with a new instance which is THREE  that has a method with a parameter which is going to be canvas and it willhave our const canvas included and antialias which   is going to be boolean` 
const renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true });
//It does the resize but it refers to the camera but not the responsive of the website
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
/*
    ||||Mandatory for every 3d JS project 
*/

//BackGround 
//Create a const to inicial count of the stars 
const starCount = 65000;

//with FloatArray() it reserves the amount of starCount multiply by 3 wich is 3 spaces by star which is going to consider the 
//3 positions X,Y,Z which means vertical, horizontal, and deep
const starPositions = new Float32Array(starCount * 3);
//with FloatArray() it reserves the amount of starCount multiply by 3 wich is 3 spaces by star which is going to consider the 
//3 scale of color R,G,B
const starColors = new Float32Array(starCount * 3);


//Create constants for each color which contain a new instance of the object 
const colorWhite = new THREE.Color(0xffffff);
const colorBlue = new THREE.Color(0x38bdf8);
const colorPurple = new THREE.Color(0xa855f7);
const colorPink = new THREE.Color(0xf472b6);
//const colorRed =new THREE.Color(0xff0000)


//Create a cycle for a variable i which will reach the number of star count
//It will have a const i3 
for (let i = 0; i < starCount; i++) {
    const i3 = i * 3;


    if (i < starCount * 0.55) {
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

const balancedMaterialProps = { color: 0x6b21a8, roughness: 0.22, metalness: 0.6, flatShading: true };

const cubeMesh = new THREE.Mesh(new THREE.BoxGeometry(2.8, 2.8, 2.8), new THREE.MeshStandardMaterial(balancedMaterialProps));
cubeMesh.position.set(-5.8, -0.4, 0.5);
cubeMesh.userData = { section: 'about', initialY: -0.4, label: 'About Me' };

const pyramidMesh = new THREE.Mesh(new THREE.ConeGeometry(2.6, 4.0, 4), new THREE.MeshStandardMaterial(balancedMaterialProps));
pyramidMesh.position.set(0, -0.4, 0.5);
pyramidMesh.userData = { section: 'projects', initialY: -0.4, label: 'Projects' };

const sphereMesh = new THREE.Mesh(new THREE.IcosahedronGeometry(2.3, 1), new THREE.MeshStandardMaterial(balancedMaterialProps));
sphereMesh.position.set(5.8, -0.4, 0.5);
sphereMesh.userData = { section: 'experience', initialY: -0.4, label: 'Experience' };

scene.add(cubeMesh, pyramidMesh, sphereMesh);
const interactiveObjects = [cubeMesh, pyramidMesh, sphereMesh];

const pointLight = new THREE.PointLight(0xc084fc, 75, 100);
pointLight.position.set(6, 6, 8);
const pointLight2 = new THREE.PointLight(0xa855f7, 50, 100);
pointLight2.position.set(-6, -4, 6);
scene.add(pointLight, pointLight2, new THREE.AmbientLight(0xffffff, 0.55));

const hudData = {
    about: {
        title: 'ABOUT ME',
        modalClass: 'modal-about',
        tabs: [
            {
                id: 'profile',
                label: 'Profile',
                type: 'standard',
                content: `
                    <div class="hud-card">
                        <div class="about-profile-grid">
                            <div class="profile-avatar-container" onclick="openLightbox('./assets/david.png', 'David Silva - Profile Photo')" style="cursor: pointer;" title="Click to expand">
                                <img src="./assets/david.png" alt="David Silva" class="profile-avatar-img">
                                <div class="image-hover-overlay" style="border-radius: 50%;">
                                    <i class="fa-solid fa-magnifying-glass-plus"></i>
                                </div>
                            </div>
                            <div class="about-profile-info">
                                <h4>Software Engineer & Quality Business Analyst</h4>
                                <p>Software Engineering student at Fundación Universitaria Compensar and Quality Business Analyst / Champion at TCS. Specializing in software architecture, quality assurance (QA), manual functional testing, and full-stack web development.</p>
                            </div>
                        </div>
                    </div>
                `
            },
            {
                id: 'skills',
                label: 'Skills',
                type: 'standard',
                content: `
                    <div class="hud-card">
                        <h4>Languages & Tools</h4>
                        <p>Java, JavaScript, TypeScript, Angular, Three.js, HTML5/CSS3, Servlets/JSP, MySQL, MariaDB, Git, Jira, IntelliJ, VS Code, and NetBeans.</p>
                    </div>
                `
            }
        ]
    },
    projects: {
        title: 'FEATURED PROJECTS',
        modalClass: 'modal-projects',
        tabs: [
            {
                id: 'web',
                label: 'Web & 3D',
                type: 'carousel',
                projects: [
                    {
                        title: 'Interactive 3D Portfolio',
                        description: 'Immersive web experience built with Three.js, GSAP animations, and neon Glassmorphism design.',
                        image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
                        tags: ['Three.js', 'GSAP', 'WebGL', 'CSS Glassmorphism'],
                        demoUrl: '#',
                        githubUrl: 'https://github.com'
                    },
                    {
                        title: 'Three.js & Angular WebGL Scene',
                        description: 'Tridimensional interactive gallery with calibrated lighting and dynamic polyhedral models.',
                        image: 'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?auto=format&fit=crop&w=800&q=80',
                        tags: ['Angular', 'Three.js', 'TypeScript', 'SCSS'],
                        demoUrl: '#',
                        githubUrl: 'https://github.com'
                    }
                ]
            },
            {
                id: 'java',
                label: 'Java Backend',
                type: 'carousel',
                projects: [
                    {
                        title: 'Applicant Management System',
                        description: 'Web application built with MVC architecture, Java Servlets, JSP views, JPA layer, and MySQL.',
                        image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80',
                        tags: ['Java Servlets', 'JSP', 'JPA', 'MySQL'],
                        demoUrl: '#',
                        githubUrl: 'https://github.com'
                    }
                ]
            }
        ]
    },
    experience: {
        title: 'BACKGROUND & EDUCATION',
        modalClass: 'modal-experience',
        items: [
            {
                category: 'work',
                role: 'Seller, Invoice Clerk & Writer',
                institution: 'TuBici Bike Shop',
                period: '2020',
                desc: 'Managed online sales, e-billing, and wrote web blog articles to enhance brand visibility and sales strategies.'
            },
            {
                category: 'work',
                role: 'Customer Service Representative',
                institution: 'Teleperformance',
                period: '2021 - 2022',
                desc: 'Provided multichannel support (calls, email, chat), handling order tracking, fraudulent transaction verification, and marketplace coordination.'
            },
            {
                category: 'edu',
                role: 'Modern Languages Degree',
                institution: 'Universidad ECCI',
                period: '2017 - 2022',
                desc: 'Higher education degree focused on multi-language acquisition, advanced communication, and linguistic foundations.'
            },
            {
                category: 'work',
                role: 'Tech Support & Sales Rep',
                institution: 'Asurion',
                period: '2022 - 2024',
                desc: 'Delivered technical assistance for mobile devices, computers, and TVs, rapidly troubleshooting software and hardware issues.'
            },
            {
                category: 'work',
                role: 'Tech Advisor',
                institution: 'Teleperformance',
                period: '2024 - 2025',
                desc: 'Integrated Meta Pixel, Conversions API, CRM, and Catalogues across platforms like WordPress, Shopify, and PrestaShop.'
            },
            {
                category: 'work',
                role: 'QA Analyst / Tester',
                institution: 'Tata Consultancy Services (TCS)',
                period: 'Jul 2025 - Oct 2025',
                desc: 'Executed manual functional testing, documented test cases, tracked defects in Jira, and collaborated within Agile Scrum sprints.'
            },
            {
                category: 'work',
                role: 'Quality Business Analyst / Champion',
                institution: 'Tata Consultancy Services (TCS)',
                period: 'Oct 2025 - Present',
                desc: 'Managed end-to-end QA processes, coordinated testing resources, aligned business requirements with technical delivery, and led daily Agile status meetings.'
            },
            {
                category: 'edu',
                role: 'Software Engineering',
                institution: 'Fundación Universitaria Compensar',
                period: '2024 - Present',
                desc: 'Undergraduate degree focusing on software development, object-oriented programming, data structures, and web architecture.'
            }
        ]
    }
};

let currentCarouselIndex = 0;

function renderCleanTimeline(items, container) {
    const nodesHTML = items.map((item, index) => `
        <div class="timeline-node-item ${item.category} ${index === 0 ? 'active' : ''}" data-index="${index}">
            <span class="timeline-node-badge">${item.period}</span>
            <div class="timeline-dot"></div>
            <div class="timeline-node-title">${item.role}</div>
        </div>
    `).join('');


    container.innerHTML = `
        <div class="timeline-clean-container">
            <div class="timeline-track-clean">
                <div class="timeline-line-clean"></div>
                ${nodesHTML}
            </div>
            <div class="timeline-detail-box" id="timeline-detail-box">
                <h4>${items[0].role}</h4>
                <div class="institution">${items[0].institution} (${items[0].period})</div>
                <div class="description">${items[0].desc}</div>
            </div>
        </div>
    `;

    const nodeElements = container.querySelectorAll('.timeline-node-item');
    const detailBox = container.querySelector('#timeline-detail-box');

    nodeElements.forEach(node => {
        node.addEventListener('mouseenter', () => {
            const idx = node.dataset.index;
            const item = items[idx];

            nodeElements.forEach(n => n.classList.remove('active'));
            node.classList.add('active');

            detailBox.innerHTML = `
                <h4>${item.role}</h4>
                <div class="institution">${item.institution} (${item.period})</div>
                <div class="description">${item.desc}</div>
            `;
        });
    });
}

function buildCarouselHTML(projects) {
    const cardsHTML = projects.map(proj => `
        <div class="carousel-card">
            <div class="project-image-container" onclick="openLightbox('${proj.image}', '${proj.title}')">
                <img src="${proj.image}" alt="${proj.title}" class="project-img">
                <div class="image-hover-overlay">
                    <i class="fa-solid fa-magnifying-glass-plus"></i>
                </div>
            </div>
            <div class="project-details">
                <div>
                    <h4>${proj.title}</h4>
                    <p>${proj.description}</p>
                    <div class="tech-tags">
                        ${proj.tags.map(t => `<span class="tech-tag">${t}</span>`).join('')}
                    </div>
                </div>
                <div class="project-actions">
                    <a href="${proj.demoUrl}" target="_blank" rel="noopener noreferrer" class="project-btn">
                        <i class="fa-solid fa-arrow-up-right-from-square"></i> Demo
                    </a>
                    <a href="${proj.githubUrl}" target="_blank" rel="noopener noreferrer" class="project-btn">
                        <i class="fa-brands fa-github"></i> Code
                    </a>
                </div>
            </div>
        </div>
    `).join('');

    const dotsHTML = projects.map((_, i) => `
        <div class="carousel-dot ${i === 0 ? 'active' : ''}" data-index="${i}"></div>
    `).join('');

    return `
        <div class="carousel-wrapper">
            <div class="carousel-viewport">
                <div class="carousel-track" id="carousel-track">
                    ${cardsHTML}
                </div>
            </div>
            <div class="carousel-controls">
                <button class="carousel-arrow" id="prev-btn" aria-label="Previous">
                    <i class="fa-solid fa-chevron-left"></i>
                </button>
                <div class="carousel-dots" id="carousel-dots">
                    ${dotsHTML}
                </div>
                <button class="carousel-arrow" id="next-btn" aria-label="Next">
                    <i class="fa-solid fa-chevron-right"></i>
                </button>
            </div>
        </div>
    `;
}

function initCarouselEvents(projectsCount) {
    currentCarouselIndex = 0;
    const track = document.getElementById('carousel-track');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const dots = document.querySelectorAll('.carousel-dot');

    function updateCarousel() {
        if (!track) return;
        track.style.transform = `translateX(-${currentCarouselIndex * 100}%)`;
        dots.forEach((dot, idx) => {
            if (idx === currentCarouselIndex) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        });
    }

    if (prevBtn && nextBtn) {
        prevBtn.addEventListener('click', () => {
            currentCarouselIndex = (currentCarouselIndex - 1 + projectsCount) % projectsCount;
            updateCarousel();
        });

        nextBtn.addEventListener('click', () => {
            currentCarouselIndex = (currentCarouselIndex + 1) % projectsCount;
            updateCarousel();
        });

        dots.forEach(dot => {
            dot.addEventListener('click', (e) => {
                currentCarouselIndex = parseInt(e.target.dataset.index, 10);
                updateCarousel();
            });
        });
    }
}

window.openLightbox = function (imageUrl, captionText) {
    const lightbox = document.getElementById('image-lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxCaption = document.getElementById('lightbox-caption');

    lightboxImg.src = imageUrl;
    lightboxCaption.textContent = captionText;
    lightbox.classList.remove('hidden');
};

const lightbox = document.getElementById('image-lightbox');
const lightboxCloseBtn = document.getElementById('lightbox-close-btn');

if (lightboxCloseBtn) {
    lightboxCloseBtn.addEventListener('click', () => {
        lightbox.classList.add('hidden');
    });

    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            lightbox.classList.add('hidden');
        }
    });
}

function renderTabContent(tab, panelBody) {
    if (tab.type === 'carousel') {
        panelBody.innerHTML = buildCarouselHTML(tab.projects);
        initCarouselEvents(tab.projects.length);
    } else {
        panelBody.innerHTML = tab.content;
    }
}

function renderHudSection(sectionKey) {
    const data = hudData[sectionKey];
    const hudTitleEl = document.getElementById('hud-title');
    const hudTabsNav = document.getElementById('hud-tabs-nav');
    const panelBody = document.getElementById('panel-body');
    const contentPanel = document.getElementById('content-panel');

    contentPanel.className = `hud-panel ${data.modalClass}`;
    hudTitleEl.textContent = data.title;

    if (sectionKey === 'experience') {
        hudTabsNav.innerHTML = `
            <div class="timeline-h-legend">
                <div class="legend-item"><span class="legend-dot-work"></span> Work</div>
                <div class="legend-item"><span class="legend-dot-edu"></span> Education</div>
            </div>
        `;
        renderCleanTimeline(data.items, panelBody);
    } else {
        hudTabsNav.innerHTML = '';
        data.tabs.forEach((tab, index) => {
            const btn = document.createElement('button');
            btn.className = `hud-tab-btn ${index === 0 ? 'active' : ''}`;
            btn.textContent = tab.label;

            btn.addEventListener('click', () => {
                document.querySelectorAll('.hud-tab-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                renderTabContent(tab, panelBody);
            });

            hudTabsNav.appendChild(btn);
        });
        renderTabContent(data.tabs[0], panelBody);
    }
}

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
let activeObject = null;
const hoverLabelEl = document.getElementById('hover-label');

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
            x: 0, y: 0, z: 8.5,
            duration: 1.2, ease: 'power2.inOut',
            onComplete: () => activeObject = null
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
    const intersects = raycaster.intersectObjects(interactiveObjects);

    if (intersects.length > 0) {
        document.body.style.cursor = 'pointer';
        hoverLabelEl.textContent = intersects[0].object.userData.label;
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
    const intersects = raycaster.intersectObjects(interactiveObjects);

    if (intersects.length > 0) {
        const clickedMesh = intersects[0].object;
        activeObject = clickedMesh;
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

const mainTitleEl = document.getElementById('main-title');
const socialIcons = document.querySelectorAll('.social-icon');

const mouse3D = new THREE.Vector3();
const raycasterMouse = new THREE.Raycaster();

let clock = new THREE.Clock();

function animate() {
    requestAnimationFrame(animate);
    const elapsedTime = clock.getElapsedTime();

    raycasterMouse.setFromCamera(mouse, camera);
    const targetZ = -15;
    const distanceToZ = (targetZ - camera.position.z) / raycasterMouse.ray.direction.z;
    mouse3D.copy(camera.position).add(raycasterMouse.ray.direction.clone().multiplyScalar(distanceToZ));

    const positions = starGeometry.attributes.position.array;
    const radiusRepel = 4.5;
    const forceRepel = 2.0;

    for (let i = 0; i < starCount; i++) {
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

    if (!activeObject) {
        cubeMesh.rotation.x += 0.008;
        pyramidMesh.rotation.y -= 0.007;
        sphereMesh.rotation.x -= 0.008;

        cubeMesh.position.y = cubeMesh.userData.initialY + Math.sin(elapsedTime * 1.5) * 0.15;
        pyramidMesh.position.y = pyramidMesh.userData.initialY + Math.sin(elapsedTime * 1.5 + 1) * 0.15;
        sphereMesh.position.y = sphereMesh.userData.initialY + Math.sin(elapsedTime * 1.5 + 2) * 0.15;
    }

    renderer.render(scene, camera);
}

animate();

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});