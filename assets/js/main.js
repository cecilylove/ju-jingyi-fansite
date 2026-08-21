/* 鞠婧祎粉丝站 · 交互脚本（原生 JS，零依赖） */

/* 1. 导航：滚动状态 + 移动端菜单 */
(function () {
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

/* 2. 滚动揭示动画：初始化失败时保持内容可见 */
(function () {
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

/* 3. 图库灯箱 */
(function () {
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

/* （图库分类筛选已移除：营业图单一类型，无需筛选） */
