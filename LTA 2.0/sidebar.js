// Work instruction group is shared across the five pages.
(function () {
  const toggle = document.querySelector('.wi-nav-toggle');
  const submenu = document.getElementById('wi-submenu');
  if (!toggle || !submenu) return;
  toggle.addEventListener('click', function () {
    const collapsed = document.body.classList.contains('nav-collapsed');
    if (collapsed) {
      document.body.classList.remove('nav-collapsed');
      const shellToggle = document.querySelector('#nav-toggle, #navToggle');
      shellToggle.setAttribute('aria-expanded', 'true');
      shellToggle.setAttribute('aria-label', 'Collapse navigation');
    }
    const open = collapsed || toggle.getAttribute('aria-expanded') !== 'true';
    toggle.setAttribute('aria-expanded', String(open));
    submenu.hidden = !open;
  });
  document.addEventListener('click', function (event) {
    const disabled = event.target.closest('[aria-disabled="true"]');
    if (disabled) { event.preventDefault(); event.stopImmediatePropagation(); }
  }, true);
  const link = submenu.querySelector('a[href]');
  function sync() {
    const role = document.body.dataset.role;
    link.href = 'mwi-list.html' + (['co','ss','eng'].includes(role) ? '?role=' + role : '');
  }
  sync();
  new MutationObserver(sync).observe(document.body, {attributes:true, attributeFilter:['data-role']});
})();
