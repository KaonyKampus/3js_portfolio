// ── Phones / portrait screens: each figure gets its own screen and the camera follows the scroll ──
import { camera, view } from './scene.js';

const html = document.documentElement;
const linksEl = document.getElementById('links-section');
const hintEl = document.getElementById('section-hint');
const hintName = document.getElementById('sh-name');
const LABELS = ['About me', 'Projects', 'Experience'];
let shownIndex = -1;

const clamp = (v, a, b) => Math.min(b, Math.max(a, v));

let maxScroll = 0, ticking = false;
const measure = () => { maxScroll = html.scrollHeight - window.innerHeight; };

function update(snapCamera = false) {
    if (!html.classList.contains('stacked') || view.ys.length < 4) {
        view.y = 0;
        if (linksEl) { linksEl.style.opacity = '0'; linksEl.style.pointerEvents = 'none'; }
        if (hintEl) hintEl.style.opacity = '0';
        if (snapCamera && !view.locked) camera.position.y = 0;
        return;
    }

    const max = maxScroll;
    const p = max > 0 ? clamp(window.scrollY / max, 0, 1) * 3 : 0;   // 0 = about, 1 = projects, 2 = experience, 3 = links
    const i = Math.min(2, Math.floor(p));
    view.y = view.ys[i] + (view.ys[i + 1] - view.ys[i]) * (p - i);
    if (snapCamera && !view.locked) camera.position.y = view.y;

    // caption under the figure
    const idx = Math.min(2, Math.round(p));
    if (idx !== shownIndex && hintName) { hintName.textContent = LABELS[idx]; shownIndex = idx; }
    if (hintEl) hintEl.style.opacity = String(clamp(1 - Math.abs(p - idx) * 2.2, 0, 1) * (p > 2.5 ? 0 : 1));

    // links screen fades in at the end
    if (linksEl) {
        const o = clamp((p - 2.3) / 0.6, 0, 1);
        linksEl.style.opacity = String(o);
        linksEl.style.pointerEvents = o > 0.5 ? 'auto' : 'none';
    }
}

// one update per frame at most (no layout reads while scrolling)
window.addEventListener('scroll', () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => { ticking = false; update(false); });
}, { passive: true });
window.addEventListener('resize', () => { measure(); update(false); });
window.addEventListener('layoutchange', () => { measure(); window.scrollTo(0, 0); update(true); });
measure();
update(true);