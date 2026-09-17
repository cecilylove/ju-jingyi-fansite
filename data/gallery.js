/* =========================================================
   data/gallery.js — 「图库」页数据
   加图步骤：
   1. 把图片放进 assets/img/ 目录（jpg 或 png）
   2. 在下面 photos 数组里加一行：{ src: '...', label: '营业图 · 十' }
   3. 保存即可（不用改 gallery.html）
   注意：图片文件名要真实存在，扩展名要与实际格式一致（jpg/png）。
   ========================================================= */

window.GALLERY = {
  photos: [
    { src: 'assets/img/gallery-01.jpg', label: '营业图 · 一' },
    { src: 'assets/img/gallery-02.jpg', label: '营业图 · 二' },
    { src: 'assets/img/gallery-03.jpg', label: '营业图 · 三' },
    { src: 'assets/img/gallery-04.jpg', label: '营业图 · 四' },
    { src: 'assets/img/gallery-05.jpg', label: '营业图 · 五' },
    { src: 'assets/img/gallery-06.jpg', label: '营业图 · 六' },
    { src: 'assets/img/gallery-07.jpg', label: '营业图 · 七' },
    { src: 'assets/img/gallery-08.jpg', label: '营业图 · 八' },
    { src: 'assets/img/gallery-09.jpg', label: '营业图 · 九' }
  ],

  /* 页面大标题（gallery.html 顶部） */
  pageHead: {
    kicker: 'Gallery',
    title: '营业图',
    desc: '选择任意图片可放大查看。图源：微博 @鞠婧祎 营业图，版权归权利方所有，仅供粉丝非商业纪念用途。'
  }
};
