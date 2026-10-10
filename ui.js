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

function renderTabContent(tab, panelBody) {
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