// Keep the selected WI demo role across the packaged pages.
(function () {
  const roles = ['co', 'ss', 'eng'];
  function sync(role) {
    document.querySelectorAll('a[href]').forEach(function (a) {
      const url = new URL(a.getAttribute('href'), location.href);
      if (!/\/(?:mwi-[\w-]+|index)\.html$/.test(url.pathname)) return;
      url.searchParams.set('role', role);
      a.setAttribute('href', url.pathname.split('/').pop() + url.search + url.hash);
    });
  }
  document.querySelectorAll('.rolesw-opt[data-role]').forEach(function (button) {
    button.addEventListener('click', function () {
      const role = button.dataset.role;
      if (!roles.includes(role)) return;
      document.body.dataset.role = role;
      const url = new URL(location.href);
      url.searchParams.set('role', role);
      history.replaceState(null, '', url);
      sync(role);
    });
  });
  const requested = new URLSearchParams(location.search).get('role');
  const role = roles.includes(requested) ? requested : 'co';
  const button = document.querySelector('.rolesw-opt[data-role="' + role + '"]');
  if (button) button.click();
  sync(role);
})();

// Keep stacked workflow anchors clear of both sticky navigation rows.
(function () {
  if (!document.body.classList.contains('wi-detail')) return;
  const head = document.querySelector('.pagehead');
  const nav = document.querySelector('.rail');
  if (!head || !nav) return;
  function measure() {
    document.documentElement.style.setProperty('--phh', head.offsetHeight + 'px');
    document.documentElement.style.setProperty('--workflow-nav-h', nav.offsetHeight + 'px');
  }
  const observer = new ResizeObserver(measure);
  observer.observe(head);
  observer.observe(nav);
  measure();
})();
