/* ============================================================
   WOMEN ON THE SPECTRUM — SCRIPT
   ============================================================ */

/* ── CURSOR GLOW ─────────────────────────── */
const cursor = document.getElementById('cursorGlow');
if (cursor) {
  document.addEventListener('mousemove', e => {
    cursor.style.left = e.clientX + 'px';
    cursor.style.top  = e.clientY + 'px';
  });
  document.addEventListener('mouseenter', () => cursor.style.opacity = '1');
  document.addEventListener('mouseleave', () => cursor.style.opacity = '0');
}

/* ── NAVBAR SCROLL STATE ─────────────────── */
const navbar = document.getElementById('navbar');
const onScroll = () => {
  if (window.scrollY > 40) navbar.classList.add('scrolled');
  else navbar.classList.remove('scrolled');
};
window.addEventListener('scroll', onScroll, { passive: true });

/* ── MOBILE NAV ──────────────────────────── */
const hamburger = document.getElementById('navHamburger');
const mobileNav = document.getElementById('navMobile');
if (hamburger && mobileNav) {
  hamburger.addEventListener('click', () => {
    mobileNav.classList.toggle('open');
    const spans = hamburger.querySelectorAll('span');
    if (mobileNav.classList.contains('open')) {
      spans[0].style.transform = 'translateY(7px) rotate(45deg)';
      spans[1].style.opacity   = '0';
      spans[2].style.transform = 'translateY(-7px) rotate(-45deg)';
    } else {
      spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
    }
  });
  // close on nav link click
  mobileNav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    mobileNav.classList.remove('open');
    hamburger.querySelectorAll('span').forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
  }));
}

/* ── INTERSECTION OBSERVER (SCROLL REVEALS) ─ */
const observerOpts = { threshold: 0.15, rootMargin: '0px 0px -60px 0px' };

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      const el = entry.target;
      const delay = el.dataset.delay || 0;
      setTimeout(() => el.classList.add('visible'), delay);
      revealObserver.unobserve(el);
    }
  });
}, observerOpts);

// Observe reveal-up elements
document.querySelectorAll('.reveal-up').forEach(el => revealObserver.observe(el));

// Observe reveal-card elements with stagger
document.querySelectorAll('.reveal-card').forEach((el, i) => {
  el.dataset.delay = (i % 4) * 100;
  revealObserver.observe(el);
});

// Observe quote lines
document.querySelectorAll('.quote-line[data-reveal]').forEach((el, i) => {
  el.dataset.delay = i * 200;
  revealObserver.observe(el);
});

/* ── SERVICES CAROUSEL ───────────────────── */
(function initCarousel(trackId, prevId, nextId, dotsId) {
  const track = document.getElementById(trackId);
  if (!track) return;

  const cards = track.querySelectorAll('.service-card');
  const prevBtn = document.getElementById(prevId);
  const nextBtn = document.getElementById(nextId);
  const dotsContainer = document.getElementById(dotsId);

  let currentIndex = 0;
  const visibleCount = () => {
    if (window.innerWidth < 560)  return 1;
    if (window.innerWidth < 900)  return 2;
    if (window.innerWidth < 1200) return 3;
    return 4;
  };

  const maxIndex = () => Math.max(0, cards.length - visibleCount());

  // Build dots
  const buildDots = () => {
    dotsContainer.innerHTML = '';
    const count = maxIndex() + 1;
    for (let i = 0; i < count; i++) {
      const dot = document.createElement('button');
      dot.className = 'carousel-dot' + (i === currentIndex ? ' active' : '');
      dot.setAttribute('aria-label', `Slide ${i+1}`);
      dot.addEventListener('click', () => goTo(i));
      dotsContainer.appendChild(dot);
    }
  };

  const updateDots = () => {
    dotsContainer.querySelectorAll('.carousel-dot').forEach((d, i) => {
      d.classList.toggle('active', i === currentIndex);
    });
  };

  const goTo = (index) => {
    currentIndex = Math.max(0, Math.min(index, maxIndex()));
    const cardWidth = cards[0].offsetWidth + 24; // gap 1.5rem
    track.style.transform = `translateX(-${currentIndex * cardWidth}px)`;
    updateDots();
  };

  prevBtn && prevBtn.addEventListener('click', () => goTo(currentIndex - 1));
  nextBtn && nextBtn.addEventListener('click', () => goTo(currentIndex + 1));

  buildDots();
  window.addEventListener('resize', () => { buildDots(); goTo(Math.min(currentIndex, maxIndex())); });

  // Touch/drag support
  let startX = 0, isDragging = false;
  track.addEventListener('mousedown',  e => { isDragging = true; startX = e.pageX; });
  track.addEventListener('mousemove',  e => { if (isDragging) e.preventDefault(); });
  track.addEventListener('mouseup',    e => { if (!isDragging) return; isDragging = false; const diff = startX - e.pageX; if (Math.abs(diff) > 50) goTo(diff > 0 ? currentIndex + 1 : currentIndex - 1); });
  track.addEventListener('mouseleave', ()  => { isDragging = false; });
  track.addEventListener('touchstart', e => { startX = e.touches[0].pageX; }, { passive: true });
  track.addEventListener('touchend',   e => { const diff = startX - e.changedTouches[0].pageX; if (Math.abs(diff) > 50) goTo(diff > 0 ? currentIndex + 1 : currentIndex - 1); }, { passive: true });

})('servicesTrack', 'servicesPrev', 'servicesNext', 'servicesDots');

/* ── 3D TILT EFFECT ──────────────────────── */
function applyTilt(selector) {
  document.querySelectorAll(selector).forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect  = card.getBoundingClientRect();
      const x     = (e.clientX - rect.left) / rect.width  - 0.5;
      const y     = (e.clientY - rect.top)  / rect.height - 0.5;
      card.style.transform = `perspective(800px) rotateX(${-y * 10}deg) rotateY(${x * 10}deg) translateY(-6px)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
}
applyTilt('.service-card');
applyTilt('.why-card');
applyTilt('.how-card');
applyTilt('.partner-card');
applyTilt('.collage-card');

/* ── PARALLAX HERO ORBS ──────────────────── */
const orbs = document.querySelectorAll('.hero-orb');
window.addEventListener('scroll', () => {
  const y = window.scrollY;
  orbs.forEach((orb, i) => {
    const speed = 0.06 + i * 0.03;
    orb.style.transform = `translateY(${y * speed}px)`;
  });
}, { passive: true });

/* ── MODAL ───────────────────────────────── */
const modalOverlay = document.getElementById('modalOverlay');
const modalClose   = document.getElementById('modalClose');

// Open modal on nav CTA click (optionally, open after delay on first load)
document.querySelectorAll('a[href="#signup"]').forEach(link => {
  link.addEventListener('click', e => {
    if (link.classList.contains('nav-cta')) {
      e.preventDefault();
      openModal();
    }
  });
});

function openModal() {
  if (!modalOverlay) return;
  modalOverlay.classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeModal() {
  if (!modalOverlay) return;
  modalOverlay.classList.remove('open');
  document.body.style.overflow = '';
}

modalClose  && modalClose.addEventListener('click', closeModal);
modalOverlay && modalOverlay.addEventListener('click', e => { if (e.target === modalOverlay) closeModal(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

/* ── FORM SUBMISSION FEEDBACK ────────────── */
document.querySelectorAll('form').forEach(form => {
  form.addEventListener('submit', async e => {
    e.preventDefault();
    const btn = form.querySelector('[type="submit"]');
    const orig = btn.textContent;
    btn.textContent = 'Sending…';
    btn.disabled = true;

    try {
      const res = await fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: { 'Accept': 'application/json' }
      });
      if (res.ok) {
        btn.textContent = '✓ Submitted!';
        btn.style.background = '#6aab85';
        form.reset();
        setTimeout(() => {
          btn.textContent = orig;
          btn.style.background = '';
          btn.disabled = false;
          closeModal();
        }, 3000);
      } else {
        throw new Error('Server error');
      }
    } catch {
      btn.textContent = 'Try again';
      btn.style.background = '#8b4e5a';
      btn.disabled = false;
    }
  });
});

/* ── SMOOTH ANCHOR SCROLLING ─────────────── */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});
