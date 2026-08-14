/* 鞠婧祎粉丝站 · 交互脚本（原生 JS，零依赖） */

/* 1. 导航：滚动加阴影 + 移动端菜单 */
(function () {
  const nav = document.querySelector('.nav');
  const toggle = document.querySelector('.nav-toggle');
  const links = document.querySelector('.nav-links');

  const onScroll = () => {
    if (window.scrollY > 12) nav.classList.add('scrolled');
    else nav.classList.remove('scrolled');
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  if (toggle && links) {
    toggle.addEventListener('click', () => links.classList.toggle('open'));
    links.querySelectorAll('a').forEach(a =>
      a.addEventListener('click', () => links.classList.remove('open'))
    );
  }
})();

/* 2. 滚动揭示动画 */
(function () {
  const els = document.querySelectorAll('.reveal');
  if (!('IntersectionObserver' in window)) {
    els.forEach(e => e.classList.add('in'));
    return;
  }
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  els.forEach(e => io.observe(e));
})();

/* 3. 图库灯箱（仅 gallery 页生效） */
(function () {
  const items = document.querySelectorAll('.gallery-item');
  const box = document.getElementById('lightbox');
  if (!items.length || !box) return;
  const inner = box.querySelector('.lb-inner');
  const close = box.querySelector('.lb-close');

  items.forEach(item => {
    item.addEventListener('click', () => {
      const img = item.querySelector('img');
      const label = item.getAttribute('data-label') || '图片';
      inner.innerHTML = '';
      if (img) {
        const clone = document.createElement('img');
        clone.src = img.src;
        clone.alt = img.alt || label;
        inner.appendChild(clone);
      } else {
        inner.textContent = label;
      }
      box.classList.add('open');
      document.body.style.overflow = 'hidden';
    });
  });
  const shut = () => { box.classList.remove('open'); document.body.style.overflow = ''; };
  close.addEventListener('click', shut);
  box.addEventListener('click', e => { if (e.target === box) shut(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') shut(); });
})();

/* （图库分类筛选已移除：营业图单一类型，无需筛选） */
