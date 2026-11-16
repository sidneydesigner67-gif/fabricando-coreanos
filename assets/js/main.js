(() => {
  const doc = document.documentElement;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* Reveal on scroll (stagger siblings) */
  const els = document.querySelectorAll('[data-reveal]');
  if ('IntersectionObserver' in window && !reduce) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        const sibs = [...e.target.parentElement.children].filter((c) => c.hasAttribute('data-reveal'));
        e.target.style.setProperty('--d', `${Math.min(sibs.indexOf(e.target), 5) * 0.08}s`);
        e.target.classList.add('is-in');
        io.unobserve(e.target);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.12 });
    els.forEach((el) => io.observe(el));
  } else {
    els.forEach((el) => el.classList.add('is-in'));
  }

  /* Header: solid after scroll, hide on scroll down */
  const hdr = document.querySelector('[data-hdr]');
  const fab = document.querySelector('[data-fab]');
  const line = document.querySelector('[data-line]');
  let lastY = 0, ticking = false;
  const onScroll = () => {
    const y = scrollY;
    hdr.classList.toggle('is-solid', y > 40);
    hdr.classList.toggle('is-hidden', y > 400 && y > lastY && !nav.classList.contains('is-open'));
    fab.classList.toggle('is-on', y > innerHeight * 0.9);
    lastY = y;
    if (line) {
      const r = line.getBoundingClientRect();
      const p = Math.min(1, Math.max(0, (innerHeight * 0.75 - r.top) / r.height));
      line.style.setProperty('--p', p.toFixed(3));
    }
    ticking = false;
  };
  addEventListener('scroll', () => { if (!ticking) { requestAnimationFrame(onScroll); ticking = true; } }, { passive: true });

  /* Mobile menu */
  const burger = document.querySelector('[data-burger]');
  const nav = document.getElementById('nav');
  const toggle = (open) => {
    burger.setAttribute('aria-expanded', String(open));
    nav.classList.toggle('is-open', open);
    doc.style.overflow = open ? 'hidden' : '';
  };
  burger.addEventListener('click', () => toggle(burger.getAttribute('aria-expanded') !== 'true'));
  nav.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => toggle(false)));
  addEventListener('keydown', (e) => { if (e.key === 'Escape') toggle(false); });

  /* Magnetic CTAs (pointer devices only) */
  if (matchMedia('(hover: hover)').matches && !reduce) {
    document.querySelectorAll('[data-magnet]').forEach((btn) => {
      btn.addEventListener('pointermove', (e) => {
        const r = btn.getBoundingClientRect();
        btn.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * 0.15}px, ${(e.clientY - r.top - r.height / 2) * 0.25}px)`;
      });
      btn.addEventListener('pointerleave', () => { btn.style.transform = ''; });
    });

    /* Polaroid parallax */
    const pol = document.querySelector('[data-depth]');
    if (pol) addEventListener('pointermove', (e) => {
      const x = (e.clientX / innerWidth - 0.5) * 14, y = (e.clientY / innerHeight - 0.5) * 14;
      pol.style.transform = `translate(${x}px, ${y}px) rotate(-6deg)`;
    }, { passive: true });
  }

  /* Duplicate ticker for seamless loop */
  const track = document.querySelector('.ticker__track');
  if (track) { const clone = track.innerHTML; track.insertAdjacentHTML('beforeend', clone); [...track.children].slice(track.children.length / 2).forEach((c) => c.setAttribute('aria-hidden', 'true')); }

  onScroll();
})();
