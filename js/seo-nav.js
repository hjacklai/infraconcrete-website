/* Shared topbar + bottom-nav for SEO landing pages.
   Matches homepage chrome: Infraconcrete logo image + Panthera badge on the
   left, EN/BM/Chinese language switcher pill on the right, and the swipe-pill
   bottom-nav. */
(function () {
  const lang = (document.documentElement.lang || 'en').toLowerCase();
  const isMs = lang.indexOf('ms') === 0 || lang === 'bm';
  const isZh = lang.indexOf('zh') === 0;
  const isEn = !isMs && !isZh;

  /* ---------- 1. TOPBAR (matches homepage .nav structure) ---------- */
  const topbarRow = document.querySelector('.topbar .topbar-row');
  if (topbarRow && !topbarRow.querySelector('.lang-switch')) {
    const brand = topbarRow.querySelector('.brand');
    const homeLink = topbarRow.querySelector('.home-link');

    /* Replace text wordmark with logo image, mirroring homepage pattern */
    if (brand && !brand.querySelector('img')) {
      brand.innerHTML =
        '<img src="/images/brand/logo.png" alt="Infraconcrete" height="36" style="display:block;width:auto;" onerror="this.style.display=\'none\';this.nextElementSibling.style.display=\'inline-flex\';" />' +
        '<span style="display:none;align-items:baseline;">Infra<b>concrete</b><sup>&trade;</sup></span>';
    }

    /* Wrap brand + Panthera badge into a single left group */
    if (brand && !topbarRow.querySelector('.topbar-left')) {
      const leftGroup = document.createElement('div');
      leftGroup.className = 'topbar-left';
      brand.parentNode.insertBefore(leftGroup, brand);
      leftGroup.appendChild(brand);

      const badge = document.createElement('span');
      badge.className = 'group-badge';
      badge.setAttribute('aria-label', 'Part of Panthera Group');
      badge.innerHTML =
        '<span class="gb-label">Part of</span>' +
        '<img src="/images/brand/panthera-logo.png" alt="Panthera Group" height="14" style="display:block;width:auto;opacity:.7;" />';
      leftGroup.appendChild(badge);
    }

    /* Build language toggle - mirrors homepage .lang-toggle exactly:
       desktop: 3-button pill (EN/BM/中文); mobile <=540px: only the active
       button shows, tap cycles to next language. */
    function getHref(code, fallback) {
      const el = document.querySelector('link[rel="alternate"][hreflang="' + code + '"]');
      return el ? el.getAttribute('href') : fallback;
    }
    const enHref = getHref('en', '/');
    const msHref = getHref('ms', '/?lang=bm');
    const zhHref = getHref('zh-Hans', '/?lang=zh');

    const toggle = document.createElement('div');
    toggle.className = 'lang-toggle';
    toggle.setAttribute('role', 'group');
    toggle.setAttribute('aria-label', 'Language');
    toggle.innerHTML =
      '<button type="button" data-lang="en" data-href="' + enHref + '"' + (isEn ? ' class="active"' : '') + '>EN</button>' +
      '<button type="button" data-lang="ms" data-href="' + msHref + '"' + (isMs ? ' class="active"' : '') + '>BM</button>' +
      '<button type="button" data-lang="zh" data-href="' + zhHref + '"' + (isZh ? ' class="active"' : '') + '>中文</button>';

    /* Click handler: on desktop the button takes you to its target lang;
       on mobile only the active button is visible so tapping cycles to the
       next language (EN -> BM -> ZH -> EN). */
    toggle.addEventListener('click', function (e) {
      const btn = e.target.closest('button[data-lang]');
      if (!btn) return;
      e.preventDefault();
      const isMobile = window.matchMedia('(max-width: 540px)').matches;
      let target = btn;
      if (isMobile && btn.classList.contains('active')) {
        const order = ['en', 'ms', 'zh'];
        const cur = order.indexOf(btn.dataset.lang);
        const nextLang = order[(cur + 1) % 3];
        target = toggle.querySelector('button[data-lang="' + nextLang + '"]');
      }
      const href = target && target.dataset.href;
      if (href) window.location.href = href;
    });

    /* Standalone back button removed — the breadcrumb "← Home" is now the
       primary back affordance. It's a "go home" link, not browser-back:
       ALWAYS navigates to the homepage IN THE CURRENT LANGUAGE. We rewrite
       the href to /?lang=bm or /?lang=zh so the URL itself preserves the
       language choice (works even if localStorage is blocked). EN stays as
       "/" since EN is the default. localStorage is also set as a backup. */
    const crumbHome = document.querySelector('.crumbs a[href="/"], .crumbs a[href="/?lang=bm"], .crumbs a[href="/?lang=zh"]');
    if (crumbHome) {
      const langCode = isMs ? 'bm' : isZh ? 'zh' : 'en';
      const homeHref = isMs ? '/?lang=bm' : isZh ? '/?lang=zh' : '/';
      crumbHome.href = homeHref;
      crumbHome.addEventListener('click', function () {
        try { localStorage.setItem('lang', langCode); } catch (err) {}
        /* Fall through to href — homepage init reads ?lang= and localStorage. */
      });
    }

    if (homeLink) homeLink.replaceWith(toggle);
    else topbarRow.appendChild(toggle);
  }

  /* ---------- 2. RICH FOOTER (mirrors homepage .footer) ---------- */
  const existingFooter = document.querySelector('footer');
  if (existingFooter && !existingFooter.classList.contains('footer-rich')) {
    const F = isMs ? {
      tagline: 'Cerun direka untuk kegunaan tanah maksima.',
      desc: 'Kontraktor pakar geoteknikal G7. Kerja cerun, tanah, dan kontrak utama merentasi Malaysia.',
      hSol: 'Penyelesaian', hCap: 'Kapabiliti', hLoc: 'Lokasi', hCo: 'Syarikat',
      slope: 'Kontraktor cerun', soilNail: 'Soil nailing', retain: 'Tembok penahan',
      gunit: 'Guniting', rockBolt: 'Rock bolting', drains: 'Saliran ufuk', earth: 'Kerja tanah',
      kv: 'Klang Valley', pg: 'Pulau Pinang', jh: 'Johor', ph: 'Pahang', ec: 'Pantai Timur', ss: 'Sabah & Sarawak',
      home: 'Laman Utama', contact: 'Hubungi', philo: 'Falsafah', record: 'Rekod',
      partOf: 'Sebahagian', panOf: 'Syarikat Panthera Group sejak 2018.',
      cred: 'CIDB G7 · ISO 9001:2015 · ARS · UAF · IAF'
    } : isZh ? {
      tagline: '为最大土地用途设计的边坡工程。',
      desc: 'G7 资质专业岩土工程承包商。承接全马来西亚的边坡、地基与总承包工程。',
      hSol: '解决方案', hCap: '能力', hLoc: '地区', hCo: '公司',
      slope: '边坡承包商', soilNail: '土钉', retain: '挡土墙',
      gunit: '喷射混凝土', rockBolt: '锚杆', drains: '水平排水管', earth: '土方工程',
      kv: '巴生谷', pg: '槟城', jh: '柔佛', ph: '彭亨', ec: '东海岸', ss: '沙巴砂拉越',
      home: '首页', contact: '联系', philo: '理念', record: '业绩',
      partOf: '隶属', panOf: 'Panthera Group 旗下公司，自 2018 年起。',
      cred: 'CIDB G7 · ISO 9001:2015 · ARS · UAF · IAF'
    } : {
      tagline: 'Engineered slopes for maximum utility.',
      desc: 'Specialist G7 geotechnical contractor. Slope, ground, and main contracting works across Malaysia.',
      hSol: 'Solutions', hCap: 'Capabilities', hLoc: 'Locations', hCo: 'Company',
      slope: 'Slope Contractor', soilNail: 'Soil Nailing', retain: 'Retaining Walls',
      gunit: 'Guniting', rockBolt: 'Rock Bolting', drains: 'Horizontal Drains', earth: 'Earthworks',
      kv: 'Klang Valley', pg: 'Penang', jh: 'Johor', ph: 'Pahang', ec: 'East Coast', ss: 'Sabah & Sarawak',
      home: 'Home', contact: 'Contact', philo: 'Philosophy', record: 'Track Record',
      partOf: 'Part of', panOf: 'A Panthera Group company. Engineering slopes for maximum utility since 2018.',
      cred: 'CIDB G7 · ISO 9001:2015 · ARS · UAF · IAF'
    };

    const langPrefix = isMs ? '/bm' : isZh ? '/zh' : '';
    const slopeUrl = isMs ? '/bm/kontraktor-cerun/' : isZh ? '/zh/slope-stabilization/' : '/slope-stabilization/';
    const retainUrl = isMs ? '/bm/tembok-penahan/' : isZh ? '/zh/retaining-walls/' : '/retaining-walls/';
    const earthUrl = isMs ? '/bm/kerja-tanah/' : isZh ? '/zh/earthworks/' : '/earthworks/';

    existingFooter.classList.add('footer-rich');
    existingFooter.innerHTML =
      '<div class="container">' +
        '<div class="footer-grid">' +
          '<div class="fg-brand">' +
            '<a href="/" class="footer-logo">' +
              '<img src="/images/brand/logo.png" alt="Infraconcrete" height="40" style="display:block;width:auto;" />' +
            '</a>' +
            '<p class="footer-tagline"><em>' + F.tagline + '</em><br/>' + F.desc + '</p>' +
          '</div>' +
          '<div>' +
            '<h6>' + F.hCap + '</h6>' +
            '<ul>' +
              '<li><a href="' + slopeUrl + '">' + F.slope + '</a></li>' +
              '<li><a href="' + langPrefix + '/soil-nailing/">' + F.soilNail + '</a></li>' +
              '<li><a href="' + retainUrl + '">' + F.retain + '</a></li>' +
              '<li><a href="' + langPrefix + '/guniting/">' + F.gunit + '</a></li>' +
              '<li><a href="' + langPrefix + '/rock-bolting/">' + F.rockBolt + '</a></li>' +
              '<li><a href="' + langPrefix + '/horizontal-drains/">' + F.drains + '</a></li>' +
              '<li><a href="' + earthUrl + '">' + F.earth + '</a></li>' +
            '</ul>' +
          '</div>' +
          '<div>' +
            '<h6>' + F.hLoc + '</h6>' +
            '<ul>' +
              '<li><a href="' + langPrefix + '/klang-valley/">' + F.kv + '</a></li>' +
              '<li><a href="' + langPrefix + '/penang/">' + F.pg + '</a></li>' +
              '<li><a href="' + langPrefix + '/johor/">' + F.jh + '</a></li>' +
              '<li><a href="' + langPrefix + '/pahang/">' + F.ph + '</a></li>' +
              '<li><a href="' + langPrefix + '/east-coast/">' + F.ec + '</a></li>' +
              '<li><a href="' + langPrefix + '/sabah-sarawak/">' + F.ss + '</a></li>' +
            '</ul>' +
          '</div>' +
        '</div>' +
        '<div class="footer-group">' +
          '<div class="footer-group-l">' +
            '<span class="fg-label">' + F.partOf + '</span>' +
            '<img src="/images/brand/panthera-logo.png" alt="Panthera Group" height="22" style="display:block;width:auto;opacity:.65;" />' +
          '</div>' +
          '<p class="footer-group-r">' + F.panOf + '</p>' +
        '</div>' +
        '<div class="footer-bottom">' +
          '<span>&copy; 2025 Infraconcrete Construction Sdn Bhd &middot; SSM 1278618-H &middot; CIDB Reg. 0120220822-WP104845</span>' +
          '<span>' + F.cred + '</span>' +
        '</div>' +
      '</div>';
  }

  /* ---------- 3. BOTTOM-NAV ---------- */
  if (document.querySelector('.bottom-nav')) return;

  const L = isMs ? {
    swipe: 'LEREK', home: 'Utama', start: 'Mula', solutions: 'Solusi',
    example: 'Contoh', ba: 'Sblm/Slps', process: 'Proses', services: 'Khidmat',
    record: 'Rekod', cases: 'Projek', why: 'Kenapa', trust: 'Kredensial',
    faq: 'Soalan', resources: 'Sumber', cta: 'Brif'
  } : isZh ? {
    swipe: '滑动', home: '首页', start: '开始', solutions: '解决方案',
    example: '实例展示', ba: '前后对比', process: '流程', services: '服务',
    record: '业绩', cases: '项目', why: '为什么', trust: '凭证',
    faq: '常见问题', resources: '资源', cta: '联系我们'
  } : {
    swipe: 'SWIPE', home: 'Home', start: 'Start', solutions: 'Solutions',
    example: 'Working example', ba: 'Before/After', process: 'Process', services: 'Services',
    record: 'Record', cases: 'Projects', why: 'Why', trust: 'Trust',
    faq: 'FAQ', resources: 'Resources', cta: 'Brief'
  };
  const resHref = isMs ? '/bm/sumber/' : isZh ? '/zh/resources/' : '/resources/';

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
      '<a href="' + resHref + '" class="bn-item">' +
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 5a2 2 0 0 1 2-2h11l3 3v15a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2z"/><line x1="8" y1="9" x2="16" y2="9"/><line x1="8" y1="13" x2="16" y2="13"/><line x1="8" y1="17" x2="13" y2="17"/></svg>' +
        '<span>' + L.resources + '</span>' +
      '</a>' +
    '</div>' +
    '<a href="/#contact" class="bn-item bn-cta">' +
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 5l7 7-7 7"/></svg>' +
      '<span>' + L.cta + '</span>' +
    '</a>';
  document.body.appendChild(nav);

  const track = nav.querySelector('.bn-scroll');
  if (track) {
    const dismiss = function () {
      nav.classList.add('has-scrolled');
      track.removeEventListener('scroll', dismiss);
    };
    track.addEventListener('scroll', dismiss, { passive: true, once: true });

    /* Click-and-drag scroll on the bottom-nav. Disables scroll-snap during
       the drag so cursor tracks 1:1 (no jumpy snap fight), then restores
       it on release. Click-after-drag suppression is gated on real movement
       AND scroll-delta to avoid eating legit clicks. */
    (function enableDragScroll(el) {
      if (!el) return;
      let isDown = false, startX = 0, startScroll = 0, moved = false;
      const origSnap = el.style.scrollSnapType;
      el.addEventListener('mousedown', function (e) {
        if (e.target.closest('a, button')) return;
        isDown = true; moved = false;
        startX = e.pageX; startScroll = el.scrollLeft;
        el.style.scrollSnapType = 'none';
        el.style.scrollBehavior = 'auto';
        el.style.cursor = 'grabbing'; el.style.userSelect = 'none';
      });
      const stop = function () {
        if (!isDown) return;
        isDown = false;
        el.style.scrollSnapType = origSnap || '';
        el.style.scrollBehavior = '';
        el.style.cursor = ''; el.style.userSelect = '';
      };
      el.addEventListener('mouseleave', stop);
      el.addEventListener('mouseup', function () {
        const movedScroll = Math.abs(el.scrollLeft - startScroll) > 4;
        const wasMoved = moved;
        stop();
        if (wasMoved && movedScroll) {
          const blocker = function (ev) { ev.preventDefault(); ev.stopPropagation(); el.removeEventListener('click', blocker, true); };
          el.addEventListener('click', blocker, true);
          // Auto-remove blocker after one event loop so future clicks work
          setTimeout(function () { el.removeEventListener('click', blocker, true); }, 50);
        }
      });
      el.addEventListener('mousemove', function (e) {
        if (!isDown) return;
        const dx = e.pageX - startX;
        if (Math.abs(dx) > 6) moved = true;
        el.scrollLeft = startScroll - dx;
        e.preventDefault();
      });
      el.style.cursor = 'grab';
    })(track);
  }

  /* Reveal on scroll + sticky topbar scrolled state (matches homepage).
     Trigger at 40% of viewport (~430px on a 1080p screen) — appears as the
     user nears the end of the hero section, well before the first content
     block starts. */
  const topbarEl = document.querySelector('.topbar');
  function onScroll () {
    const y = window.scrollY;
    nav.classList.toggle('is-revealed', y > window.innerHeight * 0.4);
    if (topbarEl) topbarEl.classList.toggle('scrolled', y > 12);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();
