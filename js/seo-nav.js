/* Shared topbar + bottom-nav enhancement for SEO landing pages.
   Renders the text wordmark "Infraconcrete(TM) | Part of Panthera" on the left
   and an EN/BM/Chinese language switcher pill on the right, plus the swipe-pill
   bottom-nav matching the homepage. */
(function () {
  const lang = (document.documentElement.lang || 'en').toLowerCase();
  const isMs = lang.indexOf('ms') === 0 || lang === 'bm';
  const isZh = lang.indexOf('zh') === 0;
  const isEn = !isMs && !isZh;

  /* ---------- 1. TOPBAR ---------- */
  const topbarRow = document.querySelector('.topbar .topbar-row');
  if (topbarRow && !topbarRow.querySelector('.lang-switch')) {
    const brand = topbarRow.querySelector('.brand');
    const homeLink = topbarRow.querySelector('.home-link');

    if (brand && !brand.querySelector('.tm')) {
      brand.insertAdjacentHTML('beforeend', '<sup class="tm">&trade;</sup>');
    }

    /* Wrap brand + Panthera badge into a single left group */
    if (brand && !topbarRow.querySelector('.topbar-left')) {
      const leftGroup = document.createElement('div');
      leftGroup.className = 'topbar-left';
      brand.parentNode.insertBefore(leftGroup, brand);
      leftGroup.appendChild(brand);

      const partOf = isMs ? 'Sebahagian' : isZh ? '隶属' : 'Part of';
      const badge = document.createElement('span');
      badge.className = 'group-badge-inline';
      badge.setAttribute('aria-label', 'Part of Panthera Group');
      badge.innerHTML =
        '<span class="gb-divider" aria-hidden="true"></span>' +
        '<span class="gb-label">' + partOf + '</span>' +
        '<img class="panthera-logo" src="/images/brand/panthera-logo.png" alt="Panthera Group" height="14">';
      leftGroup.appendChild(badge);
    }

    /* Build language switcher from the page's hreflang link tags */
    function getHref(code, fallback) {
      const el = document.querySelector('link[rel="alternate"][hreflang="' + code + '"]');
      return el ? el.getAttribute('href') : fallback;
    }
    const enHref = getHref('en', '/');
    const msHref = getHref('ms', '/?lang=bm');
    const zhHref = getHref('zh-Hans', '/?lang=zh');

    const switcher = document.createElement('div');
    switcher.className = 'lang-switch';
    switcher.setAttribute('role', 'group');
    switcher.setAttribute('aria-label', 'Language');
    switcher.innerHTML =
      '<a href="' + enHref + '" class="ls-item' + (isEn ? ' is-active' : '') + '" hreflang="en">EN</a>' +
      '<a href="' + msHref + '" class="ls-item' + (isMs ? ' is-active' : '') + '" hreflang="ms">BM</a>' +
      '<a href="' + zhHref + '" class="ls-item' + (isZh ? ' is-active' : '') + '" hreflang="zh-Hans">中文</a>';

    if (homeLink) homeLink.replaceWith(switcher);
    else topbarRow.appendChild(switcher);
  }

  /* ---------- 2. BOTTOM-NAV ---------- */
  if (document.querySelector('.bottom-nav')) return;

  const L = isMs ? {
    swipe: 'LEREK', home: 'Utama', start: 'Mula', solutions: 'Solusi',
    example: 'Contoh', ba: 'Sblm/Slps', process: 'Proses', services: 'Khidmat',
    record: 'Rekod', cases: 'Projek', why: 'Kenapa', trust: 'Kredensial',
    faq: 'Soalan', cta: 'Brif'
  } : isZh ? {
    swipe: '滑动', home: '首页', start: '开始', solutions: '解决方案',
    example: '实例展示', ba: '前后对比', process: '流程', services: '服务',
    record: '业绩', cases: '项目', why: '为什么', trust: '凭证',
    faq: '常见问题', cta: '联系我们'
  } : {
    swipe: 'SWIPE', home: 'Home', start: 'Start', solutions: 'Solutions',
    example: 'Working example', ba: 'Before/After', process: 'Process', services: 'Services',
    record: 'Record', cases: 'Projects', why: 'Why', trust: 'Trust',
    faq: 'FAQ', cta: 'Brief'
  };

  const nav = document.createElement('nav');
  nav.className = 'bottom-nav';
  nav.setAttribute('aria-label', 'Site navigation');
  nav.innerHTML =
    '<span class="bn-hint" aria-hidden="true">' + L.swipe + ' <span class="bn-hint-arrow">&rarr;</span></span>' +
    '<div class="bn-scroll">' +
      '<a href="/" class="bn-item">' +
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 11 12 3l9 8"/><path d="M5 10v10h14V10"/></svg>' +
        '<span>' + L.home + '</span>' +
      '</a>' +
      '<a href="/#problems" class="bn-item">' +
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 2 C 8 2 5 5 5 9 C 5 14 12 22 12 22 C 12 22 19 14 19 9 C 19 5 16 2 12 2 Z"/><circle cx="12" cy="9" r="2.5"/></svg>' +
        '<span>' + L.start + '</span>' +
      '</a>' +
      '<a href="/#solutions" class="bn-item">' +
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="7" cy="12" r="4"/><line x1="11" y1="12" x2="21" y2="12"/><line x1="17" y1="12" x2="17" y2="16"/><line x1="20" y1="12" x2="20" y2="15"/></svg>' +
        '<span>' + L.solutions + '</span>' +
      '</a>' +
      '<a href="/#approach" class="bn-item">' +
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 20 L 12 8 L 21 16"/><line x1="3" y1="20" x2="21" y2="20"/><line x1="12" y1="4" x2="12" y2="22" stroke-dasharray="2 2"/></svg>' +
        '<span>' + L.example + '</span>' +
      '</a>' +
      '<a href="/#before-after" class="bn-item">' +
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="4" width="8" height="16" rx="1"/><rect x="13" y="4" width="8" height="16" rx="1"/></svg>' +
        '<span>' + L.ba + '</span>' +
      '</a>' +
      '<a href="/#process" class="bn-item">' +
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/><circle cx="6" cy="6" r="1.4" fill="currentColor"/><circle cx="11" cy="12" r="1.4" fill="currentColor"/><circle cx="16" cy="18" r="1.4" fill="currentColor"/></svg>' +
        '<span>' + L.process + '</span>' +
      '</a>' +
      '<a href="/#capabilities" class="bn-item">' +
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33h0a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51h0a1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82v0a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>' +
        '<span>' + L.services + '</span>' +
      '</a>' +
      '<a href="/#record" class="bn-item">' +
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="3 17 9 11 13 15 21 6"/><polyline points="14 6 21 6 21 13"/></svg>' +
        '<span>' + L.record + '</span>' +
      '</a>' +
      '<a href="/#cases" class="bn-item">' +
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="6" width="18" height="14" rx="1"/><polyline points="8 6 8 3 16 3 16 6"/></svg>' +
        '<span>' + L.cases + '</span>' +
      '</a>' +
      '<a href="/#value" class="bn-item">' +
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 12 A 8 8 0 1 1 17 5.5"/><polyline points="20 4 20 8 16 8"/><circle cx="12" cy="12" r="2" fill="currentColor"/></svg>' +
        '<span>' + L.why + '</span>' +
      '</a>' +
      '<a href="/#credentials" class="bn-item">' +
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 2 4 5v6c0 5.5 3.8 10.5 8 11 4.2-.5 8-5.5 8-11V5z"/><polyline points="9 12 11 14 15 10"/></svg>' +
        '<span>' + L.trust + '</span>' +
      '</a>' +
      '<a href="/#faq" class="bn-item">' +
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M9 9 a3 3 0 0 1 6 0 c0 2 -3 2 -3 4"/><circle cx="12" cy="17" r="0.8" fill="currentColor"/></svg>' +
        '<span>' + L.faq + '</span>' +
      '</a>' +
    '</div>' +
    '<a href="/#contact" class="bn-item bn-cta">' +
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 5l7 7-7 7"/></svg>' +
      '<span>' + L.cta + '</span>' +
    '</a>';
  document.body.appendChild(nav);

  /* Hide swipe hint after first scroll */
  const track = nav.querySelector('.bn-scroll');
  if (track) {
    const dismiss = function () {
      nav.classList.add('has-scrolled');
      track.removeEventListener('scroll', dismiss);
    };
    track.addEventListener('scroll', dismiss, { passive: true, once: true });
  }
})();
