/* =========================================================
   data/home.js — 「首页」专属内容
   包含：首屏 / 应援档案带 / 各区块标题 / 近期动态 / 关于她摘要
        / 作品卡 / 图库预览 / 成长里程碑

   ★ 只有 index.html 需要引这个文件。
   站点壳（导航、页脚、声明）在 data/site.js。

   新增一个首页区块的步骤：
   1. 在 sections 里加一条 { kicker, title, desc }
   2. 在 index.html 放容器 <div class="section-head reveal" data-heading="你的键名" data-source="HOME"></div>
   ========================================================= */

window.HOME = {

  /* ---------- 1. 首屏 ---------- */
  hero: {
    eyebrow: 'ORANGE LIGHT · JU JINGYI FAN SITE',
    title: '鞠婧祎',
    lead: '璀璨星河里，我们替你收藏每一束光。',
    note: '演员 · 歌手 · 1994.06.18',
    image: 'assets/img/feature-music.jpg',
    imageAlt: '鞠婧祎舞台造型'
  },

  /* 首屏两个按钮：variant 可选 primary（实心）/ ghost（描边） */
  heroActions: [
    { href: 'gallery.html', label: '浏览图库', variant: 'primary' },
    { href: 'works.html',   label: '查看作品', variant: 'ghost' }
  ],

  /* ---------- 2. 应援档案带 ---------- */
  fandomIntro: { kicker: 'MIJU FANDOM', title: '应援档案' },

  fandom: [
    { label: '应援色', value: '蓝色',       note: '属于蜜橘的守护色',                              swatch: 'blue' },
    { label: '粉丝名', value: '蜜橘',       note: '约 2019 年 12 月由“鞠骑”更名为“蜜橘”',   swatch: '' },
    { label: '生日',   value: '6 月 18 日', note: '1994 · 四川遂宁',                              swatch: '' }
  ],

  /* ---------- 3. 各区块标题 ----------
     对应 index.html 里的 <div class="section-head reveal" data-heading="键名" data-source="HOME"> */
  sections: {
    updates:   { kicker: 'Updates',        title: '近期动态',   desc: '记录最近的杂志消息与品牌合作。' },
    works:     { kicker: 'Selected Works', title: '音乐与光影', desc: '从旋律到角色，收藏值得反复回望的代表作品。' },
    gallery:   { kicker: 'Gallery',        title: '光影掠影',   desc: '精选微博营业图，仅供非商业纪念用途。' },
    milestones:{ kicker: 'Milestones',     title: '成长里程碑', link: { href: 'about.html', label: '查看完整成长历程' } }
  },

  /* ---------- 4. 近期动态卡 ----------
     ⚠️ 数据不在这里！
     首页的「近期动态」直接读动态页的 data/news.js → NEWS.articles（唯一源头），
     取数组前 N 条（index.html 上用 data-limit 控制，默认 2 条）。
     要加/改动态 → 只改 data/news.js，首页自动跟着变。 */

  /* ---------- 5. 关于她摘要 ----------
     title 的取名规则：首页区块标题一律用「描述性短语」，不要照搬导航名
     （其他区块是「近期动态 / 音乐与光影 / 光影掠影 / 成长里程碑」，都描述性）。
     ⚠️ 也不要在这里再用「星河」「光」—— 那是首屏 hero 的意象
     （「璀璨星河里，我们替你收藏每一束光」），同一页重复会稀释它。 */
  about: {
    kicker: 'About Her',
    title: '走近她',
    lead: '中国内地影视女演员、流行乐歌手。2013 年正式出道，从剧场舞台走向更广阔的音乐与光影世界。',
    paragraphs: [
      '2016 年、2017 年连续获得 SNH48 总决选第一名，2017 年晋升明星殿堂并成立个人工作室。她用作品记录成长，也在每一次舞台与角色中留下属于自己的光。'
    ],
    image: 'assets/img/about-portrait.jpg',
    imageAlt: '鞠婧祎肖像',
    mediaNote: '1994 · SUI NING',
    /* swatch 可选：red / blue / 留空 */
    facts: [
      { label: '身份',   value: '演员 · 歌手' },
      { label: '出道',   value: '2013.11.02' },
      { label: '喜爱色', value: '红色', swatch: 'red' }
    ],
    link: { href: 'about.html', label: '阅读完整人物资料' }
  },

  /* ---------- 6. 代表作品卡（两张） ---------- */
  workCards: [
    {
      href: 'works.html',
      ariaLabel: '查看音乐作品',
      image: 'assets/img/gallery-07.jpg',
      imageAlt: '音乐篇章',
      badge: 'Music',
      title: '音乐篇章',
      desc: '从首张个人 EP《每一天》到担任总监制的九周年专辑《IX》，用旋律记录每一阶段的自己。',
      items: [
        { title: '《每一天》',   year: '2016' },
        { title: '《恋爱告急》', year: '2019' },
        { title: '《IX》',       year: '2022' }
      ],
      linkLabel: '查看音乐作品'
    },
    {
      href: 'works.html',
      ariaLabel: '查看影视作品',
      image: 'assets/img/feature-screen.jpg',
      imageAlt: '光影足迹',
      badge: 'Screen',
      title: '光影足迹',
      desc: '从雪飞霜、韩芸汐到韩菱纱，她在不同故事里塑造鲜活角色，也不断拓展自己的表演边界。',
      items: [
        { title: '《芸汐传》', year: '2018' },
        { title: '《花戎》',   year: '2023' },
        { title: '《仙剑四》', year: '2024' }
      ],
      linkLabel: '查看影视作品'
    }
  ],

  /* ---------- 7. 首页图库预览（6 张，整块点击进图库） ---------- */
  galleryPreview: {
    href: 'gallery.html',
    photos: [
      { src: 'assets/img/gallery-01.jpg', alt: '鞠婧祎营业图一' },
      { src: 'assets/img/gallery-02.jpg', alt: '鞠婧祎营业图二' },
      { src: 'assets/img/gallery-03.jpg', alt: '鞠婧祎营业图三' },
      { src: 'assets/img/gallery-04.jpg', alt: '鞠婧祎营业图四' },
      { src: 'assets/img/gallery-05.jpg', alt: '鞠婧祎营业图五' },
      { src: 'assets/img/gallery-06.jpg', alt: '鞠婧祎营业图六' }
    ],
    button: { href: 'gallery.html', label: '浏览完整图库' }
  },

  /* ---------- 8. 成长里程碑 ----------
     ⚠️ 数据不在这里！
     里程碑是跨页面共用的内容，唯一源头在 data/site.js 的 SITE.milestones。
     首页用 <div data-render-home="milestones" data-limit="4"> 从那里截取前 4 条。
     要改里程碑 → 改 data/site.js，首页和「关于她」页会同时生效。 */
};
