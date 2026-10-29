import { hudData } from './data.js';

let currentCarouselIndex = 0;

// ───────────── Experience: metro map ─────────────
// Two lines (work / education). Education stations sit under the work station
// that started in the same year, so you can see what overlapped with what.
function renderMetro(items, container) {
    const firstYear = (period) => Number((period.match(/\d{4}/) || [0])[0]);

    const work = items.filter(i => i.category === 'work');
    const edu = items.filter(i => i.category === 'edu');
    const posWork = work.map((_, i) => ((i + 0.5) / work.length) * 100);
    const yearsWork = work.map(i => firstYear(i.period));

    const stations = [
        ...work.map((item, i) => ({ item, x: posWork[i], up: i % 2 === 0 })),
        ...edu.map(item => {
            const y = firstYear(item.period);
            let j = -1;
            yearsWork.forEach((yy, k) => { if (yy <= y) j = k; });
            return { item, x: j < 0 ? posWork[0] : posWork[j], up: false };
        })
    ];

    const stationsHTML = stations.map((s, idx) => `
        <button class="metro-station ${s.item.category} ${s.up ? 'up' : 'down'} ${/present/i.test(s.item.period) ? 'current' : ''}"
                data-index="${idx}" style="--p:${s.x}">
            <span class="metro-dot"></span>
            <span class="metro-label">
                <span class="metro-period">${s.item.period}</span>
                <span class="metro-role">${s.item.role}</span>
                <span class="metro-inst">${s.item.institution}</span>
            </span>
        </button>
    `).join('');

    const connectorsHTML = stations.filter(s => s.item.category === 'edu')
        .map(s => `<span class="metro-link" style="--p:${s.x}"></span>`).join('');

    container.innerHTML = `
        <div class="metro-scroll">
            <div class="metro-stage">
                <span class="metro-line work"></span>
                <span class="metro-line edu"></span>
                ${connectorsHTML}
                ${stationsHTML}
            </div>
        </div>
        <div class="metro-detail" id="metro-detail"></div>
    `;

    const stationEls = container.querySelectorAll('.metro-station');
    const detail = container.querySelector('#metro-detail');

    function setActive(idx) {
        const { item } = stations[idx];
        stationEls.forEach((el, i) => el.classList.toggle('active', i === idx));
        detail.className = `metro-detail ${item.category} swap`;
        detail.innerHTML = `
            <h4>${item.role}</h4>
            <div class="institution">${item.institution} (${item.period})</div>
            <div class="description">${item.desc}</div>
        `;
    }

    stationEls.forEach((el, i) => {
        el.addEventListener('mouseenter', () => setActive(i));
        el.addEventListener('focus', () => setActive(i));
        el.addEventListener('click', () => setActive(i));
    });

    // start on the current position (last station of the work line)
    const current = stations.findIndex(s => s.item.category === 'work' && /present/i.test(s.item.period));
    setActive(current >= 0 ? current : 0);
}

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

// ───────────── About: orbiting skills ─────────────
let orbitFrame = null;

function buildOrbit(tab, panelBody) {
    const groups = tab.groups;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const ringsHTML = groups.map((g, gi) => `<div class="orb-ring" data-group="${gi}" style="--c:${g.color}"></div>`).join('');
    const skillsHTML = groups.map((g, gi) => g.skills.map(s => `
        <div class="orb-skill" data-group="${gi}" style="--c:${g.color}">
            <span class="orb-dot"></span><span class="orb-name">${s}</span>
        </div>`).join('')).join('');
    const legendHTML = groups.map((g, gi) => `
        <span class="orb-legend-item" data-group="${gi}" style="--c:${g.color}"><i></i>${g.label}</span>`).join('');

    panelBody.innerHTML = `
        <div class="orb-wrapper">
            <div class="orb-stage" id="orb-stage">
                ${ringsHTML}
                <div class="orb-center">
                    <div class="orb-photo" title="Click to expand">
                        <img src="${tab.photo}" alt="${tab.name}">
                        <div class="image-hover-overlay"><i class="fa-solid fa-magnifying-glass-plus"></i></div>
                    </div>
                    <div class="orb-name-main">${tab.name}</div>
                    <div class="orb-role">${tab.role}</div>
                </div>
                ${skillsHTML}
                <div class="orb-caption" id="orb-caption"></div>
            </div>
            <div class="orb-bottom">
                <p class="orb-bio">${tab.bio}</p>
                <div class="orb-legend">${legendHTML}</div>
            </div>
        </div>
    `;

    const stage = panelBody.querySelector('#orb-stage');
    const photoEl = stage.querySelector('.orb-photo');
    const ringEls = [...stage.querySelectorAll('.orb-ring')];
    const overlay = document.getElementById('modal-overlay');
    const caption = stage.querySelector('#orb-caption');
    const defaultCaption = `${tab.name} · ${tab.role}`;
    caption.textContent = defaultCaption;
    let compact = null;

    // one entry per skill: its element, ring index, position inside the ring
    const items = [];
    groups.forEach((g, gi) => {
        const els = [...stage.querySelectorAll(`.orb-skill[data-group="${gi}"]`)];
        els.forEach((el, si) => items.push({ el, gi, name: g.skills[si], base: (si / els.length) * Math.PI * 2 + gi * 0.7, left: false }));
    });

    const phase = groups.map(() => 0);
    const paused = groups.map(() => false);
    const speed = groups.map((_, i) => (0.11 - i * 0.02) * (i % 2 ? -1 : 1)); // rad/s, alternate direction

    photoEl.addEventListener('click', () => window.openLightbox(tab.photo, `${tab.name} - Profile Photo`));

    function setFocus(gi) {
        stage.classList.toggle('focusing', gi !== null);
        items.forEach(it => it.el.classList.toggle('fg', it.gi === gi));
        ringEls.forEach((r, i) => r.classList.toggle('fg', i === gi));
        panelBody.querySelectorAll('.orb-legend-item').forEach((l, i) => l.classList.toggle('fg', i === gi));
    }

    items.forEach(it => {
        const enter = () => {
            paused[it.gi] = true; it.el.classList.add('hot'); setFocus(it.gi);
            caption.textContent = `${it.name} · ${groups[it.gi].label}`;
        };
        const leave = () => {
            paused[it.gi] = false; it.el.classList.remove('hot'); setFocus(null);
            caption.textContent = defaultCaption;
        };
        it.el.addEventListener('mouseenter', enter);
        it.el.addEventListener('mouseleave', leave);
        it.el.addEventListener('click', enter);   // touch screens: a tap selects the skill
    });
    panelBody.querySelectorAll('.orb-legend-item').forEach((l, i) => {
        l.addEventListener('mouseenter', () => setFocus(i));
        l.addEventListener('mouseleave', () => setFocus(null));
    });

    let last = performance.now();
    function frame(now) {
        if (!stage.isConnected) return;               // the panel was replaced: stop the loop
        orbitFrame = requestAnimationFrame(frame);
        if (overlay.classList.contains('hidden')) { last = now; return; }

        const dt = Math.min((now - last) / 1000, 0.05);
        last = now;
        const W = stage.clientWidth, H = stage.clientHeight;
        const n = groups.length;
        // small screens: dots only (the name shows in the caption) so nothing gets cut off
        const isCompact = W < 640 || H < 360;
        if (isCompact !== compact) { compact = isCompact; stage.classList.toggle('compact', compact); }
        const photoR = photoEl.offsetHeight / 2;
        const rxMax = compact ? W / 2 - 16 : Math.max(W / 2 - 120, 140);
        const ryMax = compact ? H / 2 - 30 : H / 2 - 24;
        const rxMin = compact ? Math.min(photoR + 30, rxMax - 18 * (n - 1)) : Math.min(W * 0.18, rxMax - 40 * (n - 1));
        const ryMin = compact ? Math.min(photoR + 36, ryMax - 14 * (n - 1)) : Math.max(H * 0.25, photoR + 80);

        groups.forEach((_, gi) => {
            if (!reduceMotion && !paused[gi]) phase[gi] += speed[gi] * dt;
            const f = n > 1 ? gi / (n - 1) : 1;
            const rx = rxMin + (rxMax - rxMin) * f;
            const ry = ryMin + (ryMax - ryMin) * f;
            ringEls[gi].style.width = `${rx * 2}px`;
            ringEls[gi].style.height = `${ry * 2}px`;
            ringEls[gi]._r = [rx, ry];
        });

        items.forEach(it => {
            const [rx, ry] = ringEls[it.gi]._r;
            const a = it.base + phase[it.gi];
            const x = Math.cos(a) * rx, y = Math.sin(a) * ry;
            it.el.style.transform = `translate(${x.toFixed(1)}px, ${y.toFixed(1)}px)`;
            const toLeft = x < 0;                      // labels point outwards
            if (toLeft !== it.left) { it.left = toLeft; it.el.classList.toggle('to-left', toLeft); }
        });
    }
    if (orbitFrame) cancelAnimationFrame(orbitFrame);
    orbitFrame = requestAnimationFrame(frame);
}

// ───────────── Contact: a letter sealed with wax ─────────────
// The form sends a POST (JSON) to this address. It must be a serverless function / backend
// that checks the data and sends the email to you (the email API key stays there, never here).
const CONTACT_ENDPOINT = '/api/contact';

function renderContact(container, data) {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

    const linksHTML = data.links.map(l => `
        <a class="ct-link" href="${l.url}" target="_blank" rel="noopener noreferrer">
            <i class="${l.icon}"></i>${l.label}
        </a>`).join('');

    container.innerHTML = `
        <div class="ct-wrapper">
            <aside class="ct-intro">
                <div class="ct-kicker">${data.kicker}</div>
                <h4 class="ct-headline">${data.headline}</h4>
                <p class="ct-text">${data.text}</p>
                <div class="ct-links-title">Or find me here</div>
                <div class="ct-links">${linksHTML}</div>
                <div class="ct-watermark" aria-hidden="true">DS</div>
            </aside>

            <div class="ct-stage" id="ct-stage">
                <form class="ct-paper" id="ct-form" novalidate>
                    <div class="ct-paper-head">Dear David,</div>
                    <label class="ct-field">
                        <span>Your name</span>
                        <input type="text" name="name" autocomplete="name" maxlength="80">
                        <em class="ct-err"></em>
                    </label>
                    <label class="ct-field">
                        <span>Your email</span>
                        <input type="email" name="email" autocomplete="email" maxlength="120">
                        <em class="ct-err"></em>
                    </label>
                    <label class="ct-field">
                        <span>Your message</span>
                        <textarea name="message" rows="5" maxlength="1500"></textarea>
                        <em class="ct-err"></em>
                    </label>
                    <input type="text" name="website" class="ct-hp" tabindex="-1" autocomplete="off" aria-hidden="true">
                    <div class="ct-foot">
                        <div class="ct-status" id="ct-status" role="status" aria-live="polite"></div>
                        <button type="submit" class="ct-seal">
                            <span class="ct-seal-disc"><i class="fa-solid fa-paper-plane"></i></span>
                            <span class="ct-seal-label">Seal &amp; send</span>
                        </button>
                    </div>
                </form>

                <div class="ct-envelope" aria-hidden="true">
                    <div class="ct-env-back"></div>
                    <div class="ct-env-front"></div>
                    <div class="ct-env-flap"></div>
                    <div class="ct-env-seal">DS</div>
                </div>

                <div class="ct-thanks">
                    <i class="fa-solid fa-circle-check"></i>
                    <h4>Letter sent</h4>
                    <p>Thanks for writing! I will get back to you soon.</p>
                    <button type="button" class="ct-again">Write another</button>
                </div>
            </div>
        </div>
    `;

    const stage = container.querySelector('#ct-stage');
    const form = container.querySelector('#ct-form');
    const status = container.querySelector('#ct-status');
    const paper = container.querySelector('.ct-paper');

    // ── validation (the server must check again: this one only gives quick feedback) ──
    const rules = {
        name: v => v.trim().length >= 2 ? '' : 'Please tell me your name.',
        email: v => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()) ? '' : 'That email does not look right.',
        message: v => v.trim().length >= 10 ? '' : 'A few more words, please (10 characters minimum).'
    };
    function validateField(name) {
        const input = form.elements[name];
        const field = input.closest('.ct-field');
        const msg = rules[name](input.value);
        field.classList.toggle('invalid', !!msg);
        field.querySelector('.ct-err').textContent = msg;
        return !msg;
    }
    Object.keys(rules).forEach(name => {
        const input = form.elements[name];
        input.addEventListener('blur', () => { if (input.value) validateField(name); });
        input.addEventListener('input', () => {
            if (input.closest('.ct-field').classList.contains('invalid')) validateField(name);
        });
    });

    // ── helpers ──
    function shake() {
        paper.classList.remove('shake'); void paper.offsetWidth; paper.classList.add('shake');
    }
    function setBusy(busy) {
        stage.classList.toggle('busy', busy);
        [...form.elements].forEach(el => { el.disabled = busy; });
    }
    async function playSent() {
        if (reduceMotion) { stage.classList.add('done'); return; }
        stage.classList.add('s1'); await sleep(650);   // the letter folds into the envelope
        stage.classList.add('s2'); await sleep(550);   // the flap closes
        stage.classList.add('s3'); await sleep(600);   // the wax seal is stamped
        stage.classList.add('s4'); await sleep(950);   // the envelope flies away
        stage.classList.add('done');
    }

    // ── submit ──
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        if (stage.classList.contains('busy')) return;

        const allValid = Object.keys(rules).map(validateField).every(Boolean);
        if (!allValid) {
            shake();
            const firstBad = form.querySelector('.invalid input, .invalid textarea');
            if (firstBad) firstBad.focus();
            return;
        }

        const payload = {
            name: form.elements.name.value.trim(),
            email: form.elements.email.value.trim(),
            message: form.elements.message.value.trim(),
            website: form.elements.website.value        // hidden trap field: only bots fill it in
        };

        status.textContent = '';
        status.classList.remove('error');

        if (payload.website) {          // a bot: act as if it worked, but send nothing
            setBusy(true);
            await playSent();
            return;
        }

        setBusy(true);
        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), 12000);
        try {
            const res = await fetch(CONTACT_ENDPOINT, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
                signal: controller.signal
            });
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            await playSent();
        } catch (err) {
            setBusy(false);
            status.textContent = 'Something went wrong. Please try again in a moment.';
            status.classList.add('error');
            shake();
        } finally {
            clearTimeout(timer);
        }
    });

    container.querySelector('.ct-again').addEventListener('click', () => {
        form.reset();
        form.querySelectorAll('.ct-field').forEach(f => { f.classList.remove('invalid'); f.querySelector('.ct-err').textContent = ''; });
        stage.classList.remove('s1', 's2', 's3', 's4', 'done');
        setBusy(false);
    });

    // desktop: put the cursor in the first field (on touch screens that would pop up the keyboard)
    if (window.matchMedia('(pointer: fine)').matches) setTimeout(() => form.elements.name.focus(), 450);
}

function renderTabContent(tab, panelBody) {
    if (tab.type === 'orbit') {
        buildOrbit(tab, panelBody);
        return;
    }
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

    if (sectionKey === 'contact') {
        hudTabsNav.innerHTML = '';
        renderContact(panelBody, data);
        return;
    }

    if (sectionKey === 'experience') {
        hudTabsNav.innerHTML = `
            <div class="timeline-h-legend">
                <div class="legend-item"><span class="legend-dot-work"></span> Work</div>
                <div class="legend-item"><span class="legend-dot-edu"></span> Education</div>
            </div>
        `;
        renderMetro(data.items, panelBody);
    } else {
        hudTabsNav.innerHTML = '';
        // a section with a single tab does not need the tab buttons
        (data.tabs.length > 1 ? data.tabs : []).forEach((tab, index) => {
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