/* ============================================================
   WOMEN ON THE SPECTRUM — SCRIPT
   ============================================================ */

/* ── HERO IMAGE SLIDESHOW ────────────────── */
(function () {
  const slides = document.querySelectorAll('.hero-slide');
  if (!slides.length) return;
  let current = 0;
  setInterval(() => {
    slides[current].classList.remove('active');
    current = (current + 1) % slides.length;
    slides[current].classList.add('active');
  }, 5000);
})();

/* ── NAVBAR SCROLL STATE ─────────────────── */
const navbar = document.getElementById('navbar');
if (navbar) {
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
  }, { passive: true });
}

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
  mobileNav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    mobileNav.classList.remove('open');
    hamburger.querySelectorAll('span').forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
  }));
}

/* ── SCROLL REVEALS ──────────────────────── */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el = entry.target;
      const delay = el.dataset.delay || 0;
      setTimeout(() => el.classList.add('visible'), Number(delay));
      revealObserver.unobserve(el);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -50px 0px' });

document.querySelectorAll('.reveal-up').forEach(el => revealObserver.observe(el));
document.querySelectorAll('.quote-line[data-reveal]').forEach((el, i) => {
  el.dataset.delay = i * 180;
  revealObserver.observe(el);
});

/* ── CAROUSEL FACTORY ────────────────────── */
function initCarousel(trackId, prevId, nextId, dotsId, cardSelector) {
  const track = document.getElementById(trackId);
  if (!track) return;

  const cards = track.querySelectorAll(cardSelector);
  if (!cards.length) return;

  const prevBtn       = document.getElementById(prevId);
  const nextBtn       = document.getElementById(nextId);
  const dotsContainer = document.getElementById(dotsId);
  let currentIndex    = 0;

  const visibleCount = () => {
    if (window.innerWidth < 560)  return 1;
    if (window.innerWidth < 900)  return 2;
    if (window.innerWidth < 1200) return 3;
    return 4;
  };
  const maxIndex = () => Math.max(0, cards.length - visibleCount());

  const buildDots = () => {
    const noScroll = maxIndex() === 0;

    /* show/hide arrows */
    if (prevBtn) prevBtn.style.display = noScroll ? 'none' : '';
    if (nextBtn) nextBtn.style.display = noScroll ? 'none' : '';

    /* center track when all cards fit, scroll from left otherwise */
    track.style.justifyContent = noScroll ? 'center' : '';
    if (noScroll) { currentIndex = 0; track.style.transform = 'translateX(0)'; }

    if (!dotsContainer) return;
    dotsContainer.innerHTML = '';
    if (noScroll) return;
    for (let i = 0; i <= maxIndex(); i++) {
      const dot = document.createElement('button');
      dot.className = 'carousel-dot' + (i === currentIndex ? ' active' : '');
      dot.setAttribute('aria-label', `Slide ${i + 1}`);
      dot.addEventListener('click', () => goTo(i));
      dotsContainer.appendChild(dot);
    }
  };

  const updateDots = () => {
    if (!dotsContainer) return;
    dotsContainer.querySelectorAll('.carousel-dot').forEach((d, i) =>
      d.classList.toggle('active', i === currentIndex)
    );
  };

  const goTo = (index) => {
    currentIndex = Math.max(0, Math.min(index, maxIndex()));
    track.style.transform = `translateX(-${currentIndex * (cards[0].offsetWidth + 24)}px)`;
    updateDots();
  };

  prevBtn && prevBtn.addEventListener('click', () => goTo(currentIndex - 1));
  nextBtn && nextBtn.addEventListener('click', () => goTo(currentIndex + 1));
  buildDots();

  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => { buildDots(); goTo(Math.min(currentIndex, maxIndex())); }, 150);
  });

  /* touch swipe */
  let startX = 0;
  track.addEventListener('touchstart', e => { startX = e.touches[0].pageX; }, { passive: true });
  track.addEventListener('touchend',   e => {
    const d = startX - e.changedTouches[0].pageX;
    if (Math.abs(d) > 50) goTo(d > 0 ? currentIndex + 1 : currentIndex - 1);
  }, { passive: true });
}

/* ── INIT ALL CAROUSELS ──────────────────── */
initCarousel('servicesTrackC', 'servicesPrevC', 'servicesNextC', 'servicesDotsC', '.ic-card');
initCarousel('whyTrackC',      'whyPrevC',      'whyNextC',      'whyDotsC',      '.ic-card');
initCarousel('howTrackC',      'howPrevC',      'howNextC',      'howDotsC',      '.ic-card');
initCarousel('partnerTrackA',  'partnerPrevA',  'partnerNextA',  'partnerDotsA',  '.info-card');

/* ── QUOTES IMAGE CAROUSEL ───────────────── */
(function () {
  const slides = document.querySelectorAll('.qic-slide');
  if (!slides.length) return;
  let current = 0;
  setInterval(() => {
    slides[current].classList.remove('active');
    current = (current + 1) % slides.length;
    slides[current].classList.add('active');
  }, 4000);
})();

/* ── QUOTES TEXT CAROUSEL ────────────────── */
(function () {
  const slides = document.querySelectorAll('.qtc-slide');
  if (!slides.length) return;
  let current = 0;
  setInterval(() => {
    slides[current].classList.remove('active');
    current = (current + 1) % slides.length;
    slides[current].classList.add('active');
  }, 3500);
})();

/* ── PARTNER CARD MODALS ─────────────────── */
(function () {
  const overlay  = document.getElementById('partnerModalOverlay');
  if (!overlay) return;

  const titleEl  = document.getElementById('partnerModalTitle');
  const bodyEl   = document.getElementById('partnerModalBody');
  const closeBtn = document.getElementById('partnerModalClose');
  const ctaBtn   = document.getElementById('partnerModalCta');

  const openModal = (title, contentHTML) => {
    titleEl.textContent = title;
    bodyEl.innerHTML    = contentHTML;
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  };
  const closeModal = () => {
    overlay.classList.remove('open');
    document.body.style.overflow = '';
  };

  document.querySelectorAll('.partner-modal-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const card    = btn.closest('.partner-card');
      const title   = card.querySelector('h3').textContent;
      const content = card.querySelector('.partner-full-content').innerHTML;
      openModal(title, content);
    });
  });

  closeBtn && closeBtn.addEventListener('click', closeModal);
  overlay.addEventListener('click', e => { if (e.target === overlay) closeModal(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

  ctaBtn && ctaBtn.addEventListener('click', () => {
    closeModal();
    setTimeout(() => {
      document.querySelector('#partner-form')?.scrollIntoView({ behavior: 'smooth' });
    }, 320);
  });
})();

/* ── PARTNER HERO SLIDESHOW ──────────────── */
(function () {
  const slides = document.querySelectorAll('.phg-slide');
  if (!slides.length) return;
  let current = 0;
  setInterval(() => {
    slides[current].classList.remove('active');
    current = (current + 1) % slides.length;
    slides[current].classList.add('active');
  }, 4000);
})();

/* ── MOBILE TAP-TO-EXPAND — Services Style C image cards ── */
(function () {
  const isTouchOnly = () => window.matchMedia('(hover: none)').matches;

  function initImageCardTap(trackId) {
    const track = document.getElementById(trackId);
    if (!track) return;
    track.querySelectorAll('.ic-card').forEach(card => {
      card.addEventListener('click', e => {
        if (!isTouchOnly()) return;
        const isExpanded = card.classList.contains('expanded');
        track.querySelectorAll('.ic-card.expanded').forEach(c => c.classList.remove('expanded'));
        if (!isExpanded) card.classList.add('expanded');
      });
    });
  }

  initImageCardTap('servicesTrackC');
  initImageCardTap('whyTrackC');
  initImageCardTap('howTrackC');

  /* collapse on tap outside */
  document.addEventListener('click', e => {
    if (!isTouchOnly()) return;
    if (!e.target.closest('.ic-card')) {
      document.querySelectorAll('.ic-card.expanded').forEach(c => c.classList.remove('expanded'));
    }
  });
})();

/* ── MODAL ───────────────────────────────── */
const modalOverlay = document.getElementById('modalOverlay');
const modalClose   = document.getElementById('modalClose');

document.querySelectorAll('a.nav-cta[href="#signup"], a[href="index.html#signup"]').forEach(link => {
  link.addEventListener('click', e => { e.preventDefault(); openModal(); });
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

modalClose   && modalClose.addEventListener('click', closeModal);
modalOverlay && modalOverlay.addEventListener('click', e => { if (e.target === modalOverlay) closeModal(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

/* ── REQUIRED CHECKBOX GROUPS ────────────── */
document.querySelectorAll('[data-required-checkbox-group]').forEach(group => {
  const checkboxes = group.querySelectorAll('input[type="checkbox"]');
  if (!checkboxes.length) return;

  const validate = () => {
    const hasSelection = Array.from(checkboxes).some(checkbox => checkbox.checked);
    checkboxes[0].setCustomValidity(hasSelection ? '' : 'Please choose at least one area of interest.');
  };

  checkboxes.forEach(checkbox => checkbox.addEventListener('change', validate));
  group.closest('form')?.addEventListener('reset', () => setTimeout(validate));
  validate();
});

/* ── FORM FEEDBACK ───────────────────────── */
document.querySelectorAll('form').forEach(form => {
  form.addEventListener('submit', async e => {
    e.preventDefault();
    const btn  = form.querySelector('[type="submit"]');
    const orig = btn.textContent;
    btn.textContent = 'Sending…';
    btn.disabled    = true;
    try {
      const res = await fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: { Accept: 'application/json' }
      });
      if (res.ok) {
        btn.textContent = '✓ Done!';
        form.reset();
        setTimeout(() => { btn.textContent = orig; btn.disabled = false; closeModal(); }, 2500);
      } else throw new Error();
    } catch {
      btn.textContent = 'Try again';
      btn.disabled    = false;
    }
  });
});

/* ── SMOOTH ANCHOR SCROLL ────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) { e.preventDefault(); target.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
  });
});
