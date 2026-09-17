/* =========================================================
   data/gallery.js — 「图库」页数据
   加图步骤：
   1. 把图片放进 assets/img/ 目录（jpg 或 png）
   2. 在下面 photos 数组**最前面**插入新图（见下方顺序约定）
   3. 保存即可（不用改 gallery.html）
   注意：图片文件名要真实存在，扩展名要与实际格式一致（jpg/png）。

   ★ 顺序约定：**时间倒序，最新的放最前面**。
     数组顺序 = 显示顺序，页面不做任何排序（排序是数据的事，不是文件名的事）。
     所以新一批图片要**插到数组开头**，不要追加到末尾。
     2026-09-17 已把全库调为倒序（59 → 1），当前第一张 gallery-59 是最新的一批。
     自检脚本有一条断言盯着这个约定：**编号必须递减**。

   ⚠️ 体积：建议单张控制在 300KB 以内。
      站主提供的原始素材常见 3000~8000px 宽、单张 5MB+（本次 50 张合计 112MB），
      本站统一压到「长边 1600px + 质量 82 + 渐进式」后约 9MB，画质肉眼无差。
      渲染器已加 loading="lazy"，但首屏可见的那几张仍会立即加载 —— 新图请先压缩再放进来。
   ========================================================= */

window.GALLERY = {
  photos: [
    { src: 'assets/img/gallery-59.jpg', label: '图库 · 59' },
    { src: 'assets/img/gallery-58.jpg', label: '图库 · 58' },
    { src: 'assets/img/gallery-57.jpg', label: '图库 · 57' },
    { src: 'assets/img/gallery-56.jpg', label: '图库 · 56' },
    { src: 'assets/img/gallery-55.jpg', label: '图库 · 55' },
    { src: 'assets/img/gallery-54.jpg', label: '图库 · 54' },
    { src: 'assets/img/gallery-53.jpg', label: '图库 · 53' },
    { src: 'assets/img/gallery-52.jpg', label: '图库 · 52' },
    { src: 'assets/img/gallery-51.jpg', label: '图库 · 51' },
    { src: 'assets/img/gallery-50.jpg', label: '图库 · 50' },
    { src: 'assets/img/gallery-49.jpg', label: '图库 · 49' },
    { src: 'assets/img/gallery-48.jpg', label: '图库 · 48' },
    { src: 'assets/img/gallery-47.jpg', label: '图库 · 47' },
    { src: 'assets/img/gallery-46.jpg', label: '图库 · 46' },
    { src: 'assets/img/gallery-45.jpg', label: '图库 · 45' },
    { src: 'assets/img/gallery-44.jpg', label: '图库 · 44' },
    { src: 'assets/img/gallery-43.jpg', label: '图库 · 43' },
    { src: 'assets/img/gallery-42.jpg', label: '图库 · 42' },
    { src: 'assets/img/gallery-41.jpg', label: '图库 · 41' },
    { src: 'assets/img/gallery-40.jpg', label: '图库 · 40' },
    { src: 'assets/img/gallery-39.jpg', label: '图库 · 39' },
    { src: 'assets/img/gallery-38.jpg', label: '图库 · 38' },
    { src: 'assets/img/gallery-37.jpg', label: '图库 · 37' },
    { src: 'assets/img/gallery-36.jpg', label: '图库 · 36' },
    { src: 'assets/img/gallery-35.jpg', label: '图库 · 35' },
    { src: 'assets/img/gallery-34.jpg', label: '图库 · 34' },
    { src: 'assets/img/gallery-33.jpg', label: '图库 · 33' },
    { src: 'assets/img/gallery-32.jpg', label: '图库 · 32' },
    { src: 'assets/img/gallery-31.jpg', label: '图库 · 31' },
    { src: 'assets/img/gallery-30.jpg', label: '图库 · 30' },
    { src: 'assets/img/gallery-29.jpg', label: '图库 · 29' },
    { src: 'assets/img/gallery-28.jpg', label: '图库 · 28' },
    { src: 'assets/img/gallery-27.jpg', label: '图库 · 27' },
    { src: 'assets/img/gallery-26.jpg', label: '图库 · 26' },
    { src: 'assets/img/gallery-25.jpg', label: '图库 · 25' },
    { src: 'assets/img/gallery-24.jpg', label: '图库 · 24' },
    { src: 'assets/img/gallery-23.jpg', label: '图库 · 23' },
    { src: 'assets/img/gallery-22.jpg', label: '图库 · 22' },
    { src: 'assets/img/gallery-21.jpg', label: '图库 · 21' },
    { src: 'assets/img/gallery-20.jpg', label: '图库 · 20' },
    { src: 'assets/img/gallery-19.jpg', label: '图库 · 19' },
    { src: 'assets/img/gallery-18.jpg', label: '图库 · 18' },
    { src: 'assets/img/gallery-17.jpg', label: '图库 · 17' },
    { src: 'assets/img/gallery-16.jpg', label: '图库 · 16' },
    { src: 'assets/img/gallery-15.jpg', label: '图库 · 15' },
    { src: 'assets/img/gallery-14.jpg', label: '图库 · 14' },
    { src: 'assets/img/gallery-13.jpg', label: '图库 · 13' },
    { src: 'assets/img/gallery-12.jpg', label: '图库 · 12' },
    { src: 'assets/img/gallery-11.jpg', label: '图库 · 11' },
    { src: 'assets/img/gallery-10.jpg', label: '图库 · 10' },
    { src: 'assets/img/gallery-09.jpg', label: '图库 · 9' },
    { src: 'assets/img/gallery-08.jpg', label: '图库 · 8' },
    { src: 'assets/img/gallery-07.jpg', label: '图库 · 7' },
    { src: 'assets/img/gallery-06.jpg', label: '图库 · 6' },
    { src: 'assets/img/gallery-05.jpg', label: '图库 · 5' },
    { src: 'assets/img/gallery-04.jpg', label: '图库 · 4' },
    { src: 'assets/img/gallery-03.jpg', label: '图库 · 3' },
    { src: 'assets/img/gallery-02.jpg', label: '图库 · 2' },
    { src: 'assets/img/gallery-01.jpg', label: '图库 · 1' }
  ],

  /* 页面大标题（gallery.html 顶部） */
  pageHead: {
    kicker: 'Gallery',
    title: '图库',
    desc: '选择任意图片可放大查看。图源：微博 @鞠婧祎 公开图片，版权归权利方所有，仅供粉丝非商业纪念用途。'
  }
};
