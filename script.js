/* Orlay Pay — interactions
   Loader, custom cursor, magnetic buttons, scroll reveal, hero text split-in,
   tilt mockups, parallax & nav hide-on-scroll. Vanilla JS, no deps. */

(() => {
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* -------- LOADER -------- */
  const loader = $('#loader'), num = $('#loaderNum'), fill = $('#loaderFill');
  let p = 0;
  const tick = () => {
    p += Math.random() * 12 + 4;
    if (p >= 100) p = 100;
    num.textContent = Math.floor(p);
    fill.style.width = p + '%';
    if (p < 100) setTimeout(tick, 90);
    else setTimeout(() => { loader.classList.add('done'); start(); }, 400);
  };
  window.addEventListener('load', tick);

  function start() {
    document.body.classList.add('ready');
    // hero lines
    $$('.hero__title .line, .hero__title').forEach(el => {});
    requestAnimationFrame(() => {
      $('.hero')?.classList.add('in');
      $('.hero__title')?.classList.add('in');
    });
  }

  /* -------- CUSTOM CURSOR -------- */
  const cur = $('#cursor'), dot = $('#cursorDot');
  let mx = innerWidth/2, my = innerHeight/2, cx = mx, cy = my;
  addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; dot.style.transform=`translate(${mx}px,${my}px) translate(-50%,-50%)`;});
  function loop(){
    cx += (mx - cx) * 0.18;
    cy += (my - cy) * 0.18;
    cur.style.transform = `translate(${cx}px,${cy}px) translate(-50%,-50%)`;
    requestAnimationFrame(loop);
  }
  if (!reduceMotion) loop();
  $$('a, button, [data-magnet]').forEach(el => {
    el.addEventListener('mouseenter', () => cur.classList.add('is-hover'));
    el.addEventListener('mouseleave', () => cur.classList.remove('is-hover'));
  });

  /* -------- MAGNETIC BUTTONS -------- */
  if (!reduceMotion) {
    $$('[data-magnet]').forEach(el => {
      el.addEventListener('mousemove', e => {
        const r = el.getBoundingClientRect();
        const x = e.clientX - r.left - r.width/2;
        const y = e.clientY - r.top - r.height/2;
        el.style.transform = `translate(${x*0.25}px, ${y*0.35}px)`;
      });
      el.addEventListener('mouseleave', () => el.style.transform = '');
    });
  }

  /* -------- NAV HIDE / SOLID -------- */
  const nav = $('#nav');
  let lastY = 0;
  addEventListener('scroll', () => {
    const y = scrollY;
    nav.classList.toggle('solid', y > 40);
    nav.classList.toggle('hide', y > lastY && y > 200);
    lastY = y;
  }, { passive:true });

  /* -------- SCROLL REVEAL -------- */
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
    });
  }, { threshold:0.18, rootMargin:'0px 0px -8% 0px' });
  $$('.reveal, .reveal-mock, .display, .hero__title').forEach(el => io.observe(el));

  /* -------- TILT MOCKUPS -------- */
  if (!reduceMotion) {
    $$('[data-tilt]').forEach(el => {
      el.addEventListener('mousemove', e => {
        const r = el.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - 0.5;
        const y = (e.clientY - r.top) / r.height - 0.5;
        el.style.transform = `perspective(1200px) rotateX(${ -y*5 }deg) rotateY(${ x*6 }deg) translateY(-4px)`;
      });
      el.addEventListener('mouseleave', () => el.style.transform = '');
    });
  }

  /* -------- HERO MOCKUP PARALLAX -------- */
  const heroMock = $('.hero .mock');
  if (heroMock && !reduceMotion) {
    addEventListener('scroll', () => {
      const y = Math.min(scrollY, 800);
      heroMock.style.translate = `0 ${y * -0.06}px`;
    }, { passive:true });
  }

  /* -------- SMOOTH ANCHOR (reduce abruptness) -------- */
  $$('a[href^="#"]').forEach(a => a.addEventListener('click', e => {
    const id = a.getAttribute('href');
    if (id.length > 1 && $(id)) {
      e.preventDefault();
      $(id).scrollIntoView({ behavior:'smooth', block:'start' });
    }
  }));
})();
