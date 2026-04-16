(() => {
  const header = document.getElementById('siteHeader');
  const toggle = document.getElementById('menuToggle');

  const onScroll = () => {
    header.classList.toggle('scrolled', window.scrollY > 8);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  toggle?.addEventListener('click', () => {
    const open = header.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(open));
  });

  document.querySelectorAll('.menu a').forEach(a => {
    a.addEventListener('click', () => header.classList.remove('open'));
  });

  const y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();
})();
