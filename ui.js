import { hudData } from './data.js';

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

// The HTML strings above call openLightbox from an inline onclick, so it must stay global
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


// ───────────── Projects: 3D ring of framed pieces ─────────────
let ringKeyHandler = null;

function buildRing(projects, panelBody) {
    const total = projects.length;
    const step = total > 1 ? Math.min(360 / total, 42) : 0;   // degrees between frames
    const radius = 'calc(var(--cw) * 1.6)';                    // ring radius, scales with the frame size
    let active = 0;

    const framesHTML = projects.map((proj, i) => `
        <div class="ring-card" data-index="${i}" style="transform: rotateY(${i * step}deg) translateZ(${radius})">
            <div class="ring-frame">
                <div class="ring-mat"><img src="${proj.image}" alt="${proj.title}"></div>
            </div>
            <div class="ring-plaque">${proj.title}</div>
        </div>
    `).join('');

    panelBody.innerHTML = `
        <div class="ring-wrapper">
            <div class="ring-stage">
                <div class="ring" id="ring">${framesHTML}</div>
                ${total > 1 ? `
                <button class="ring-arrow ring-prev" aria-label="Previous"><i class="fa-solid fa-chevron-left"></i></button>
                <button class="ring-arrow ring-next" aria-label="Next"><i class="fa-solid fa-chevron-right"></i></button>` : ''}
            </div>
            <div class="ring-info" id="ring-info"></div>
            <div class="ring-dots">${projects.map((_, i) => `<span class="ring-dot" data-index="${i}"></span>`).join('')}</div>
        </div>
    `;

    const ring = panelBody.querySelector('#ring');
    const info = panelBody.querySelector('#ring-info');
    const cards = panelBody.querySelectorAll('.ring-card');
    const dots = panelBody.querySelectorAll('.ring-dot');

    function setActive(index) {
        active = (index + total) % total;
        ring.style.transform = `translateZ(calc(-1 * ${radius})) rotateY(${-active * step}deg)`;
        cards.forEach((c, i) => c.classList.toggle('active', i === active));
        dots.forEach((d, i) => d.classList.toggle('active', i === active));
        const proj = projects[active];
        info.classList.remove('swap'); void info.offsetWidth; info.classList.add('swap');
        info.innerHTML = `
            <h4>${proj.title}</h4>
            <p>${proj.description}</p>
            <div class="tech-tags">${proj.tags.map(t => `<span class="tech-tag">${t}</span>`).join('')}</div>
            <div class="project-actions">
                <a href="${proj.demoUrl}" target="_blank" rel="noopener noreferrer" class="project-btn"><i class="fa-solid fa-arrow-up-right-from-square"></i> Demo</a>
                <a href="${proj.githubUrl}" target="_blank" rel="noopener noreferrer" class="project-btn"><i class="fa-brands fa-github"></i> Code</a>
            </div>
        `;
    }

    cards.forEach((card, i) => card.addEventListener('click', () => {
        if (i === active) window.openLightbox(projects[i].image, projects[i].title);
        else setActive(i);
    }));
    dots.forEach((d, i) => d.addEventListener('click', () => setActive(i)));
    const prev = panelBody.querySelector('.ring-prev');
    const next = panelBody.querySelector('.ring-next');
    if (prev) prev.addEventListener('click', () => setActive(active - 1));
    if (next) next.addEventListener('click', () => setActive(active + 1));

    if (ringKeyHandler) window.removeEventListener('keydown', ringKeyHandler);
    ringKeyHandler = (e) => {
        if (!document.querySelector('.ring-wrapper') || total < 2) return;
        if (e.key === 'ArrowRight') setActive(active + 1);
        if (e.key === 'ArrowLeft') setActive(active - 1);
    };
    window.addEventListener('keydown', ringKeyHandler);

    setActive(0);
}

function renderTabContent(tab, panelBody) {
    if (tab.type === 'ring') {
        buildRing(tab.projects, panelBody);
        return;
    }
    if (tab.type === 'carousel') {
        panelBody.innerHTML = buildCarouselHTML(tab.projects);
        initCarouselEvents(tab.projects.length);
    } else {
        panelBody.innerHTML = tab.content;
    }
}

export function renderHudSection(sectionKey) {
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