/* =========================================================
   橘光集 · 交互脚本（原生 JS，零依赖）

   ★★ 执行顺序很重要，不要随意调整：★★
     1. 站点外壳渲染（导航/页脚/声明）—— 必须最先，第 2 节要绑到渲染出来的按钮上
     2. 导航交互
     3~9. 各页数据渲染
     10. 滚动揭示动画 —— ★ 必须最后！
         因为 CSS 里有 `.reveal-ready .reveal { opacity: 0 }`，
         若动画初始化早于数据渲染，JS 渲染出的 .reveal 元素无人观察，
         会永久透明。改造前卡片写死在 HTML 里，没暴露这个问题。
     11. 空容器兜底提示
   ========================================================= */

/* 共享工具（脚本作用域，不挂 window） */
const escHtml = (value) => String(value == null ? '' : value)
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;');

const DELAY3 = ['', ' d1', ' d2'];
const DELAY4 = ['', ' d1', ' d2', ' d3'];

/* =========================================================
   1. 站点外壳：导航 / 页脚 / 合规声明
   数据来自 data/site.js（window.SITE），全站共享。
   ========================================================= */
(function renderShell() {
  const site = window.SITE;
  if (!site) {
    console.warn('站点外壳：未找到 window.SITE，请确认 data/site.js 已在 main.js 之前引入。');
    return;
  }
  const meta = site.meta || {};

  /* --- 导航 ---
     当前页由 <body data-page="xxx"> 决定，对应 SITE.nav[].key */
  const navEl = document.querySelector('[data-site-nav]');
  if (navEl && Array.isArray(site.nav)) {
    const current = document.body.getAttribute('data-page') || '';
    const links = site.nav.map(item =>
      `<a href="${escHtml(item.href)}"${item.key === current ? ' class="active"' : ''}>${escHtml(item.label)}</a>`
    ).join('');

    navEl.innerHTML =
      '<div class="wrap">' +
        `<a class="brand" href="index.html">${escHtml(meta.name)}<span class="brand-en">${escHtml(meta.nameEn)}</span></a>` +
        `<nav class="nav-links" id="site-navigation">${links}</nav>` +
        '<button class="nav-toggle" type="button" aria-label="打开导航菜单" aria-controls="site-navigation" aria-expanded="false"><span></span><span></span><span></span></button>' +
      '</div>';
  }

  /* --- 页脚 --- */
  const footerEl = document.querySelector('[data-site-footer]');
  if (footerEl) {
    const groups = (site.footerGroups || []).map(group =>
      `<div><h5>${escHtml(group.title)}</h5>` +
      (group.links || []).map(link => `<a href="${escHtml(link.href)}">${escHtml(link.label)}</a>`).join('') +
      '</div>'
    ).join('');

    const social = (site.social || []).map(item =>
      `<a class="social-chip" href="${escHtml(item.href)}" target="_blank" rel="noopener">${escHtml(item.label)}</a>`
    ).join('');

    footerEl.innerHTML =
      '<div class="wrap">' +
        '<div class="top">' +
          '<div>' +
            `<div class="brand-f">${escHtml(meta.name)}<span class="brand-en">${escHtml(meta.nameEn)}</span></div>` +
            `<p>${escHtml(meta.tagline)}</p>` +
          '</div>' +
          '<div class="links">' + groups +
            `<div class="social-col"><h5>社交账号</h5><div class="social-row">${social}</div></div>` +
          '</div>' +
        '</div>' +
        `<div class="bar">${escHtml(meta.footerNote)}<br />${escHtml(meta.copyright)}</div>` +
      '</div>';
  }

  /* --- 合规声明 ---
     用法：<div data-site-notice></div> 或 <div data-site-notice="image"></div>
     注意：notice.text 允许 HTML（数据由我们自己维护） */
  Array.from(document.querySelectorAll('[data-site-notice]')).forEach(container => {
    const key = container.getAttribute('data-site-notice') || 'default';
    const notice = site.notices && site.notices[key];
    if (!notice) {
      console.warn(`站点外壳：找不到 SITE.notices.${key}，已跳过。`);
      return;
    }
    container.innerHTML =
      '<div class="disclaimer reveal">' +
        '<div class="ico">i</div>' +
        '<div>' +
          `<h3>${escHtml(notice.title)}</h3>` +
          `<p>${notice.text}</p>` +
        '</div>' +
      '</div>';
  });
})();

/* =========================================================
   2. 导航：滚动状态 + 移动端菜单
   ========================================================= */
(function initNav() {
  const nav = document.querySelector('.nav');
  const toggle = document.querySelector('.nav-toggle');
  const links = document.querySelector('.nav-links');
  if (!nav) return;

  const onScroll = () => {
    nav.classList.toggle('scrolled', window.scrollY > 12);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('load', onScroll);
  onScroll();
  requestAnimationFrame(onScroll);

  if (!toggle || !links) return;

  const mobileMedia = window.matchMedia('(max-width: 680px)');
  const menuItems = Array.from(links.querySelectorAll('a'));

  if (!links.id) links.id = 'site-navigation';
  toggle.setAttribute('aria-controls', links.id);
  toggle.setAttribute('aria-expanded', 'false');
  toggle.setAttribute('aria-label', '打开导航菜单');

  const syncMenuAccessibility = (open) => {
    if (mobileMedia.matches) {
      links.toggleAttribute('inert', !open);
      links.setAttribute('aria-hidden', String(!open));
    } else {
      links.removeAttribute('inert');
      links.removeAttribute('aria-hidden');
    }
  };

  const setMenuOpen = (requestedOpen, options = {}) => {
    const open = requestedOpen && mobileMedia.matches;
    links.classList.toggle('open', open);
    toggle.classList.toggle('open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? '关闭导航菜单' : '打开导航菜单');
    document.body.classList.toggle('menu-open', open);
    syncMenuAccessibility(open);

    if (open && options.focusMenu !== false) {
      menuItems[0]?.focus();
    } else if (!open && options.restoreFocus) {
      toggle.focus();
    }
  };

  syncMenuAccessibility(false);

  toggle.addEventListener('click', () => {
    setMenuOpen(!links.classList.contains('open'));
  });
  menuItems.forEach(link =>
    link.addEventListener('click', () => setMenuOpen(false, { focusMenu: false }))
  );
  document.addEventListener('click', (event) => {
    if (links.classList.contains('open') && !nav.contains(event.target)) {
      setMenuOpen(false, { focusMenu: false, restoreFocus: true });
    }
  });
  document.addEventListener('keydown', (event) => {
    if (!links.classList.contains('open')) return;

    if (event.key === 'Escape') {
      event.preventDefault();
      setMenuOpen(false, { restoreFocus: true });
      return;
    }

    if (event.key !== 'Tab' || !menuItems.length) return;
    const first = menuItems[0];
    const last = toggle;
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  });
  window.addEventListener('resize', () => {
    if (!mobileMedia.matches) setMenuOpen(false, { focusMenu: false });
    else syncMenuAccessibility(links.classList.contains('open'));
  });
})();

/* =========================================================
   3. 图库：先渲染图片按钮，再初始化灯箱
   数据：data/gallery.js（window.GALLERY）
   ========================================================= */
(function initGallery() {
  const grid = document.querySelector('[data-render-gallery]');
  if (grid && window.GALLERY && Array.isArray(window.GALLERY.photos)) {
    grid.innerHTML = window.GALLERY.photos.map((photo, index) => {
      const label = photo.label || `图库 · ${index + 1}`;
      return `<button class="gallery-item reveal${DELAY3[index % 3]}" type="button" ` +
        `data-label="${escHtml(label)}" aria-label="放大查看${escHtml(label)}">` +
        `<img src="${escHtml(photo.src)}" alt="${escHtml(label)}" loading="lazy" decoding="async" /></button>`;
    }).join('');
  }

  const items = Array.from(document.querySelectorAll('.gallery-item'));
  const box = document.getElementById('lightbox');
  if (!items.length || !box) return;

  const inner = box.querySelector('.lb-inner');
  const close = box.querySelector('.lb-close');
  const title = box.querySelector('#lightbox-title');
  if (!inner || !close || !title) return;

  const pageSiblings = Array.from(document.body.children).filter(element =>
    element !== box && element.tagName !== 'SCRIPT'
  );
  let trigger = null;

  const setPageInert = (inert) => {
    pageSiblings.forEach(element => element.toggleAttribute('inert', inert));
  };

  const open = (item) => {
    const img = item.querySelector('img');
    const label = item.getAttribute('data-label') || '图片';
    trigger = item;
    inner.innerHTML = '';
    title.textContent = `图片预览：${label}`;

    if (img) {
      const clone = document.createElement('img');
      clone.src = img.src;
      clone.alt = img.alt || label;
      inner.appendChild(clone);
    } else {
      inner.textContent = label;
    }

    setPageInert(true);
    box.removeAttribute('inert');
    box.setAttribute('aria-hidden', 'false');
    box.classList.add('open');
    document.body.style.overflow = 'hidden';
    close.focus();
  };

  const shut = () => {
    if (!box.classList.contains('open')) return;
    box.classList.remove('open');
    box.setAttribute('aria-hidden', 'true');
    box.setAttribute('inert', '');
    document.body.style.overflow = '';
    setPageInert(false);
    const previousTrigger = trigger;
    trigger = null;
    previousTrigger?.focus();
  };

  items.forEach(item => item.addEventListener('click', () => open(item)));
  close.addEventListener('click', shut);
  box.addEventListener('click', event => {
    if (event.target === box) shut();
  });
  box.addEventListener('keydown', event => {
    if (event.key === 'Tab') {
      event.preventDefault();
      close.focus();
    }
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && box.classList.contains('open')) {
      event.preventDefault();
      shut();
    }
  });
})();

/* =========================================================
   4. 通用卡片渲染
   <div class="grid grid-3" data-render="dramas" data-source="WORKS"></div>
   data-source 默认 WORKS；每条数据字段 { year | tag | drama, title, desc }
   ========================================================= */
(function renderCards() {
  const containers = Array.from(document.querySelectorAll('[data-render]'));
  if (!containers.length) return;

  const cardHtml = (item, index) => {
    const tag = item.year || item.tag || item.drama || '';
    return `<div class="card reveal${DELAY3[index % 3]}">` +
      `<span class="tag">${escHtml(tag)}</span>` +
      `<h3>${escHtml(item.title || '')}</h3>` +
      `<p>${escHtml(item.desc || '')}</p>` +
      `</div>`;
  };

  containers.forEach(container => {
    const key = container.getAttribute('data-render');
    const sourceName = container.getAttribute('data-source') || 'WORKS';
    const source = window[sourceName];
    const list = source && source[key];

    if (!Array.isArray(list)) {
      console.warn(`数据渲染：找不到 ${sourceName}.${key}，已跳过。`);
      return;
    }
    container.innerHTML = list.map(cardHtml).join('');
  });
})();

/* =========================================================
   5. 区块标题渲染
   三种容器，各司其职：

   ① 页面大标题
      <div class="section-head reveal" data-pagehead data-source="WORKS"></div>
      → 读 SOURCE.pageHead { kicker, title, desc }

   ② 区块标题
      <div class="section-head reveal" data-heading="screen" data-source="WORKS"></div>
      → 读 SOURCE.sections.screen { kicker, title, desc }
      · sections 里可写 link: { href, label } 代替 desc（首页里程碑那种）

   ③ 小标题
      <h3 class="sub-title reveal" data-subtitle="albums" data-source="WORKS"></h3>
      → 读 SOURCE.subTitles.albums

   容器若带 .home-section-heading 类，会自动用首页的嵌套结构（kicker/h2 包一层 div）。
   ========================================================= */
(function renderHeadings() {
  const isHomeStyle = (el) => el.classList.contains('home-section-heading');

  const build = (container, head) => {
    const kicker = head.kicker
      ? `<div class="kicker">${escHtml(head.kicker)}</div>` : '';
    const title = head.title ? `<h2>${escHtml(head.title)}</h2>` : '';

    let tail = '';
    if (head.desc) {
      tail = `<p>${escHtml(head.desc)}</p>`;
    } else if (head.link) {
      tail = `<a class="home-text-link" href="${escHtml(head.link.href)}">` +
        `${escHtml(head.link.label)}<span aria-hidden="true">→</span></a>`;
    }

    if (isHomeStyle(container)) {
      container.innerHTML = `<div>${kicker}${title}</div>${tail}`;
    } else {
      container.innerHTML = `${kicker}${title}${tail}`;
    }
  };

  const read = (container, key, bucket) => {
    const sourceName = container.getAttribute('data-source') || 'WORKS';
    const source = window[sourceName];
    if (!source) {
      console.warn(`区块标题：找不到 ${sourceName}，已跳过。`);
      return null;
    }
    const value = bucket === 'pageHead'
      ? source.pageHead
      : (source[bucket] && source[bucket][key]);
    if (!value) {
      console.warn(`区块标题：找不到 ${sourceName}.${bucket}.${key}，已跳过。`);
      return null;
    }
    return value;
  };

  Array.from(document.querySelectorAll('[data-pagehead]')).forEach(container => {
    const head = read(container, null, 'pageHead');
    if (head) build(container, head);
  });

  Array.from(document.querySelectorAll('[data-heading]')).forEach(container => {
    const head = read(container, container.getAttribute('data-heading'), 'sections');
    if (head) build(container, head);
  });

  Array.from(document.querySelectorAll('[data-subtitle]')).forEach(container => {
    const text = read(container, container.getAttribute('data-subtitle'), 'subTitles');
    if (text) container.textContent = text;
  });
})();

/* =========================================================
   5b. 成长里程碑（全站共用）
   数据：data/site.js → SITE.milestones（★ 唯一源头）

   <div class="timeline" data-render-milestones></div>          → 全部条目（关于她页）
   <div data-render-home="milestones" data-limit="4"></div>     → 前 N 条（首页）

   data-limit 不写 = 全部。
   ★ 首页只是「截取」同一份数据，不另存一份，所以两处不可能写得不一样。
   ========================================================= */
(function renderMilestones() {
  const site = window.SITE;
  const all = site && Array.isArray(site.milestones) ? site.milestones : null;
  if (!all) return;

  const take = (container) => {
    const limit = parseInt(container.getAttribute('data-limit'), 10);
    return Number.isFinite(limit) && limit > 0 ? all.slice(0, limit) : all;
  };

  /* 时间线样式（关于她页「成长历程」） */
  Array.from(document.querySelectorAll('[data-render-milestones]')).forEach(container => {
    container.innerHTML = take(container).map((item, index) => (
      `<div class="tl-item reveal${DELAY3[index % 3]}">` +
      `<div class="date">${escHtml(item.date)}</div>` +
      `<h4>${escHtml(item.title)}</h4>` +
      `<p>${escHtml(item.desc)}</p>` +
      `</div>`
    )).join('');
  });
})();

/* =========================================================
   6. 关于她页渲染器
   <h2 data-about="name"> / <span data-about="tag">
   <div data-about="paragraphs"> / <img data-about-img>
   <div class="timeline" data-render-about="journey">
   ========================================================= */
(function renderAbout() {
  const about = window.ABOUT;
  if (!about) return;

  if (about.profile) {
    const setText = (selector, value) => {
      const el = document.querySelector(selector);
      if (el && value) el.textContent = value;
    };
    setText('[data-about="name"]', about.profile.name);
    setText('[data-about="tag"]', about.profile.tag);

    const paragraphsEl = document.querySelector('[data-about="paragraphs"]');
    if (paragraphsEl && Array.isArray(about.profile.paragraphs)) {
      paragraphsEl.innerHTML = about.profile.paragraphs
        .map(text => `<p>${escHtml(text)}</p>`).join('');
    }

    const imgEl = document.querySelector('[data-about-img]');
    if (imgEl && about.profile.image) {
      imgEl.src = about.profile.image;
      if (about.profile.imageAlt) imgEl.alt = about.profile.imageAlt;
    }
  }

  Array.from(document.querySelectorAll('[data-render-about]')).forEach(container => {
    const key = container.getAttribute('data-render-about');
    const list = about[key];
    if (!Array.isArray(list)) {
      console.warn(`关于她渲染：找不到 ABOUT.${key}，已跳过。`);
      return;
    }

    if (container.classList.contains('timeline')) {
      container.innerHTML = list.map((item, index) => (
        `<div class="tl-item reveal${DELAY3[index % 3]}">` +
        `<div class="date">${escHtml(item.date)}</div>` +
        `<h4>${escHtml(item.title)}</h4>` +
        `<p>${escHtml(item.desc)}</p>` +
        `</div>`
      )).join('');
    } else {
      container.innerHTML = list.map((item, index) => (
        `<div class="card reveal${DELAY3[index % 3]}">` +
        `<span class="tag">${escHtml(item.tag || item.year)}</span>` +
        `<h3>${escHtml(item.title)}</h3>` +
        `<p>${escHtml(item.desc)}</p>` +
        `</div>`
      )).join('');
    }
  });
})();

/* =========================================================
   7. 动态页渲染器
   <div class="grid grid-2" data-render-news-articles>
   <div class="timeline" data-render-news="timeline">

   ⚠️ timeline 目前【没有页面在用】（星河纪事已从动态页移除，
      见 data/news.js 顶部说明）。渲染器保留，是为了将来想恢复展示时
      直接加个容器就能复用，不用改动 JS。
   ========================================================= */
(function renderNews() {
  const news = window.NEWS;
  if (!news) return;

  Array.from(document.querySelectorAll('[data-render-news]')).forEach(container => {
    const list = news[container.getAttribute('data-render-news')];
    if (!Array.isArray(list)) return;
    container.innerHTML = list.map((item, index) => (
      `<div class="tl-item reveal${DELAY3[index % 3]}">` +
      `<div class="date">${escHtml(item.date)}</div>` +
      `<h4>${escHtml(item.title)}</h4>` +
      `<p>${escHtml(item.desc)}</p>` +
      `</div>`
    )).join('');
  });

  /* 动态卡片：href 自动指向 update.html?id=xxx，不用在数据里手写网址 */
  Array.from(document.querySelectorAll('[data-render-news-articles]')).forEach(container => {
    const list = news.articles;
    if (!Array.isArray(list)) return;
    container.innerHTML = list.map((item, index) => (
      `<a class="card reveal${DELAY3[index % 2]}" href="update.html?id=${encodeURIComponent(item.id)}">` +
      `<span class="tag">${escHtml(item.tag)} · ${escHtml(item.date)}</span>` +
      `<h3>${escHtml(item.title)}</h3>` +
      `<p>${escHtml(item.desc)}</p>` +
      `</a>`
    )).join('');
  });

  /* 品牌合作卡：href 指向品牌方官宣帖，新窗口打开 */
  Array.from(document.querySelectorAll('[data-render-brands]')).forEach(container => {
    const list = news.brands;
    if (!Array.isArray(list)) return;
    container.innerHTML = list.map((item, index) => (
      `<a class="card reveal${DELAY3[index % 3]}" href="${escHtml(item.href)}" target="_blank" rel="noopener">` +
      `<span class="tag">${escHtml(item.date)}</span>` +
      `<h3>${escHtml(item.brand)}</h3>` +
      `<p>${escHtml(item.title)}</p>` +
      `</a>`
    )).join('');
  });
})();

/* =========================================================
   8. 动态详情页渲染器（update.html）
   网址形如 update.html?id=magazine-2026-08
   正文全部来自 data/news.js 的 articles，加文章不用新建 HTML。
   ========================================================= */
(function renderUpdateDetail() {
  const root = document.querySelector('[data-update-root]');
  if (!root) return;

  const news = window.NEWS;
  const articles = news && Array.isArray(news.articles) ? news.articles : [];
  const id = new URLSearchParams(window.location.search).get('id');
  const index = articles.findIndex(item => item.id === id);
  const article = index >= 0 ? articles[index] : null;

  /* 找不到文章（网址被改错 / 文章已删）时的兜底 */
  if (!article) {
    root.innerHTML =
      '<header class="update-header"><div class="wrap update-header-inner">' +
        '<a class="update-back" href="news.html">← 返回动态列表</a>' +
        '<h1>没有找到这条动态</h1>' +
        '<p>链接可能已经失效，或者这条动态已被移除。去看看其他动态吧。</p>' +
      '</div></header>';
    document.title = '动态未找到 · 橘光集';
    return;
  }

  /* previous = 数组前一项（更新）；next = 数组后一项（更早） */
  const newer = index > 0 ? articles[index - 1] : null;
  const older = index < articles.length - 1 ? articles[index + 1] : null;

  const meta = (window.SITE && window.SITE.meta) || {};

  /* 页面标题与描述 */
  document.title = `${article.title} · 近期动态 · ${meta.name || '橘光集'}`;
  const descEl = document.querySelector('meta[name="description"]');
  if (descEl && article.desc) descEl.setAttribute('content', article.desc);

  /* 面包屑回到动态页的锚点 */
  const backHref = 'news.html';

  const factsHtml = Array.isArray(article.facts) && article.facts.length
    ? '<dl class="update-facts">' + article.facts.map(fact =>
        `<div><dt>${escHtml(fact.label)}</dt><dd>${escHtml(fact.value)}</dd></div>`
      ).join('') + '</dl>'
    : '';

  const coverHtml = article.cover
    ? '<figure class="update-cover">' +
        `<img src="${escHtml(article.cover)}" alt="${escHtml(article.coverAlt || article.title)}" />` +
        (article.coverCaption ? `<figcaption>${escHtml(article.coverCaption)}</figcaption>` : '') +
      '</figure>'
    : '';

  const sourceHtml = article.source
    ? '<section class="update-source">' +
        '<h2>信息来源</h2>' +
        (article.source.note ? `<p>${escHtml(article.source.note)}</p>` : '') +
        (article.source.href
          ? `<a href="${escHtml(article.source.href)}" target="_blank" rel="noopener">${escHtml(article.source.label || '查看原文')} →</a>`
          : '') +
      '</section>'
    : '';

  const newerHtml = newer
    ? `<a class="update-next-link prev" href="update.html?id=${encodeURIComponent(newer.id)}">` +
        `<small>上一篇</small><strong>← ${escHtml(newer.title)}</strong></a>`
    : '<span></span>';
  const olderHtml = older
    ? `<a class="update-next-link next" href="update.html?id=${encodeURIComponent(older.id)}">` +
        `<small>下一篇</small><strong>${escHtml(older.title)} →</strong></a>`
    : '<span></span>';

  root.innerHTML =
    '<header class="update-header"><div class="wrap update-header-inner">' +
      `<a class="update-back" href="${backHref}">← 返回近期动态</a>` +
      `<div class="update-meta"><span>${escHtml(article.tag)}</span><time datetime="${escHtml(article.date.replace(/\./g, '-'))}">${escHtml(article.date)}</time></div>` +
      `<h1>${escHtml(article.title)}</h1>` +
      `<p>${escHtml(article.desc)}</p>` +
    '</div></header>' +
    '<article class="update-article">' +
      '<div class="wrap update-article-layout">' +
        coverHtml +
        '<div class="update-body">' +
          '<div class="update-kicker">Update</div>' +
          '<h2>动态摘要</h2>' +
          `<p>${escHtml(article.summary)}</p>` +
          factsHtml +
          sourceHtml +
        '</div>' +
      '</div>' +
      '<nav class="wrap update-next" aria-label="近期动态文章导航">' +
        newerHtml + olderHtml +
      '</nav>' +
    '</article>';
})();

/* =========================================================
   9. 首页渲染器
   <img data-home-hero="image"> / <h1 data-home-hero="title"> / ...
   <div data-render-home="fandom|updates|about|workCards|galleryPreview|milestones">
   数据：data/home.js（window.HOME）
   ========================================================= */
(function renderHome() {
  const home = window.HOME;
  if (!home) return;

  /* --- 首屏文案 --- */
  if (home.hero) {
    Object.keys(home.hero).forEach(key => {
      const el = document.querySelector(`[data-home-hero="${key}"]`);
      if (!el) return;
      const value = home.hero[key];
      if (el.tagName === 'IMG') {
        if (key === 'image') el.src = value;
        if (key === 'imageAlt') el.alt = value;
      } else {
        el.textContent = value;
      }
    });
  }

  /* --- 首屏按钮 --- */
  Array.from(document.querySelectorAll('[data-render-home="heroActions"]')).forEach(container => {
    if (!Array.isArray(home.heroActions)) return;
    container.innerHTML = home.heroActions.map(item =>
      `<a class="btn btn-${escHtml(item.variant || 'primary')}" href="${escHtml(item.href)}">${escHtml(item.label)}</a>`
    ).join('');
  });

  /* --- 应援档案带 --- */
  Array.from(document.querySelectorAll('[data-render-home="fandomIntro"]')).forEach(container => {
    const intro = home.fandomIntro;
    if (!intro) return;
    container.innerHTML =
      `<span class="home-fandom-kicker">${escHtml(intro.kicker)}</span>` +
      `<strong>${escHtml(intro.title)}</strong>`;
  });

  Array.from(document.querySelectorAll('[data-render-home="fandom"]')).forEach(container => {
    if (!Array.isArray(home.fandom)) return;
    container.innerHTML = home.fandom.map(item => {
      const swatch = item.swatch
        ? `<i class="home-swatch home-swatch-${escHtml(item.swatch)}"></i>` : '';
      return `<div class="home-fandom-item">` +
        `<span class="home-fandom-label">${swatch}${escHtml(item.label)}</span>` +
        `<strong>${escHtml(item.value)}</strong>` +
        `<small>${escHtml(item.note)}</small>` +
        `</div>`;
    }).join('');
  });

  /* --- 近期动态卡 ---
     ★ 读动态页的 NEWS.articles（唯一源头），用 data-limit 截取前 N 条。
       不要改回 home.updates —— 那样又会变成两份数据、迟早漂移
       （曾经首页写「凸凸棉品牌全球代言人」、动态页写「鞠婧祎成为凸凸棉品牌全球代言人」）。 */
  Array.from(document.querySelectorAll('[data-render-home="updates"]')).forEach(container => {
    const articles = (window.NEWS && Array.isArray(window.NEWS.articles)) ? window.NEWS.articles : [];
    if (!articles.length) {
      console.warn('首页近期动态：找不到 NEWS.articles，已跳过。');
      return;
    }
    const limit = parseInt(container.getAttribute('data-limit'), 10);
    const items = Number.isFinite(limit) && limit > 0 ? articles.slice(0, limit) : articles;

    container.innerHTML = items.map((item, index) => (
      `<a class="home-focus-card" href="update.html?id=${encodeURIComponent(item.id)}">` +
      `<span class="home-focus-index">${String(index + 1).padStart(2, '0')}</span>` +
      '<div>' +
      `<span class="tag">${escHtml(item.tag)} · ${escHtml(item.date)}</span>` +
      `<h3>${escHtml(item.title)}</h3>` +
      `<p>${escHtml(item.desc)}</p>` +
      '</div>' +
      '<span class="home-focus-arrow" aria-hidden="true">→</span>' +
      '</a>'
    )).join('');
  });

  /* --- 关于她摘要 --- */
  Array.from(document.querySelectorAll('[data-render-home="about"]')).forEach(container => {
    const about = home.about;
    if (!about) return;

    const facts = (about.facts || []).map(fact => {
      const swatch = fact.swatch
        ? `<i class="home-swatch home-swatch-${escHtml(fact.swatch)}"></i>` : '';
      return `<div><dt>${escHtml(fact.label)}</dt><dd>${swatch}${escHtml(fact.value)}</dd></div>`;
    }).join('');

    const paragraphs = (about.paragraphs || [])
      .map(text => `<p>${escHtml(text)}</p>`).join('');

    const imageHtml = about.image
      ? `<div class="home-about-media reveal">` +
          `<img src="${escHtml(about.image)}" alt="${escHtml(about.imageAlt || '')}" loading="lazy" />` +
          `<span>${escHtml(about.mediaNote || '')}</span>` +
        '</div>'
      : '';

    const linkHtml = about.link
      ? `<a class="home-text-link" href="${escHtml(about.link.href)}">` +
          `${escHtml(about.link.label)}<span aria-hidden="true">→</span></a>`
      : '';

    container.innerHTML = imageHtml +
      '<div class="home-about-copy reveal d1">' +
        `<div class="kicker">${escHtml(about.kicker || '')}</div>` +
        `<h2>${escHtml(about.title || '')}</h2>` +
        (about.lead ? `<p class="home-about-lead">${escHtml(about.lead)}</p>` : '') +
        paragraphs +
        `<dl class="home-about-facts">${facts}</dl>` +
        linkHtml +
      '</div>';
  });

  /* --- 代表作品卡（两张） --- */
  Array.from(document.querySelectorAll('[data-render-home="workCards"]')).forEach(container => {
    if (!Array.isArray(home.workCards)) return;
    container.innerHTML = home.workCards.map((card, index) => {
      const items = (card.items || []).map(item =>
        `<li>${escHtml(item.title)}<span>${escHtml(item.year)}</span></li>`
      ).join('');
      return `<article class="home-work-item reveal${DELAY3[index % 3]}">` +
        `<a class="home-work-media" href="${escHtml(card.href)}" aria-label="${escHtml(card.ariaLabel || card.title)}">` +
          `<img src="${escHtml(card.image)}" alt="${escHtml(card.imageAlt || card.title)}" loading="lazy" />` +
          `<span>${escHtml(card.badge || '')}</span>` +
        '</a>' +
        '<div class="home-work-copy">' +
          `<h3>${escHtml(card.title)}</h3>` +
          `<p>${escHtml(card.desc)}</p>` +
          `<ul>${items}</ul>` +
          `<a class="home-text-link" href="${escHtml(card.href)}">${escHtml(card.linkLabel)}<span aria-hidden="true">→</span></a>` +
        '</div>' +
        '</article>';
    }).join('');
  });

  /* --- 首页图库预览 --- */
  Array.from(document.querySelectorAll('[data-render-home="galleryPreview"]')).forEach(container => {
    const preview = home.galleryPreview;
    if (!preview || !Array.isArray(preview.photos)) return;

    /* 首图占两格（home-gallery-feature），延迟沿用原手工排版节奏 */
    const delays = ['', ' d1', '', ' d1', ' d2', ''];

    container.innerHTML = preview.photos.map((photo, index) => {
      const feature = index === 0 ? ' home-gallery-feature' : '';
      const alt = photo.alt || `鞠婧祎图片 ${index + 1}`;
      return `<a class="home-gallery-item${feature} reveal${delays[index % delays.length]}" ` +
        `href="${escHtml(preview.href)}" aria-label="前往完整图库查看${escHtml(alt)}">` +
        `<img src="${escHtml(photo.src)}" alt="${escHtml(alt)}" loading="lazy" /></a>`;
    }).join('');
  });

  /* --- 图库预览下方的按钮 --- */
  Array.from(document.querySelectorAll('[data-render-home="galleryPreviewButton"]')).forEach(container => {
    const button = home.galleryPreview && home.galleryPreview.button;
    if (!button) return;
    container.innerHTML =
      `<a class="btn btn-primary" href="${escHtml(button.href)}">${escHtml(button.label)}</a>`;
  });

  /* --- 成长里程碑 ---
     ★ 读全站共用的 SITE.milestones，用 data-limit 截取前 N 条。
       不要改回 home.milestones —— 那样又会变成两份数据、迟早漂移。 */
  Array.from(document.querySelectorAll('[data-render-home="milestones"]')).forEach(container => {
    const all = (window.SITE && Array.isArray(window.SITE.milestones)) ? window.SITE.milestones : [];
    if (!all.length) {
      console.warn('首页里程碑：找不到 SITE.milestones，已跳过。');
      return;
    }
    const limit = parseInt(container.getAttribute('data-limit'), 10);
    const items = Number.isFinite(limit) && limit > 0 ? all.slice(0, limit) : all;

    container.innerHTML = items.map((item, index) => (
      `<article class="home-milestone reveal${DELAY4[index % 4]}">` +
      `<time>${escHtml(item.date)}</time>` +
      `<h3>${escHtml(item.title)}</h3>` +
      `<p>${escHtml(item.desc)}</p>` +
      `</article>`
    )).join('');
  });
})();

/* =========================================================
   10. 滚动揭示动画 —— ★ 必须放在所有渲染器之后
   若提前执行，JS 渲染出的 .reveal 元素不会被观察，
   会因 `.reveal-ready .reveal { opacity: 0 }` 而永久不可见。
   初始化失败时保持内容可见（不加 reveal-ready）。
   ========================================================= */
(function initReveal() {
  const elements = Array.from(document.querySelectorAll('.reveal'));
  if (!elements.length || !('IntersectionObserver' in window)) return;

  let observer = null;
  try {
    observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    elements.forEach(element => observer.observe(element));
    document.documentElement.classList.add('reveal-ready');
  } catch (error) {
    observer?.disconnect();
    document.documentElement.classList.remove('reveal-ready');
    console.warn('滚动动画初始化失败，已回退为直接显示内容。', error);
  }
})();

/* =========================================================
   11. 空容器兜底：数据没加载时给出可见提示
   ========================================================= */
(function renderFallback() {
  const selector = '[data-render],[data-render-gallery],[data-render-home],' +
    '[data-render-about],[data-render-news],[data-render-news-articles],[data-render-brands],' +
    '[data-render-milestones],[data-pagehead],[data-heading],[data-subtitle],' +
    '[data-site-notice],[data-update-root]';

  Array.from(document.querySelectorAll(selector)).forEach(container => {
    /* 有子元素，或已有纯文本（比如 data-subtitle 只填一段文字），都算已填充 */
    if (container.children.length || container.textContent.trim()) return;
    if (container.classList.contains('sr-only')) return;

    const tip = document.createElement('p');
    tip.className = 'render-warning';
    tip.textContent = '内容未加载：请检查对应 data/*.js 是否已在 main.js 之前引入，或键名是否写对。';
    container.appendChild(tip);
  });
})();
