# 蜜橘小窝 · 鞠婧祎粉丝站

一个**纯静态、零依赖**的粉丝纪念/应援站点，使用手写原生 CSS + 原生 JS 打造，开箱即看、可直接部署到 EdgeOne Makers（或任意静态托管）。

> ⚠️ 本项目为**非官方粉丝站**（蜜橘小窝）。图片为微博 @鞠婧祎 公开营业图，仅供非商业纪念用途；上线前请确认素材授权，并保留站内「非官方声明」。详见文末《合规须知》。

---

## 一、目录结构

```
ju-jingyi-fansite/
├── index.html        # 首页（Hero + 关于摘要 + 作品亮点 + 图库预览 + 动态 + 声明）
├── about.html        # 关于她（简介 + 应援信息）
├── works.html        # 作品（音乐 + 影视综艺）
├── gallery.html      # 图库（含点击放大灯箱）
├── news.html         # 动态（时间线）
├── assets/
│   ├── css/styles.css  # 设计系统（改色/字体/圆角都在这里）
│   └── js/main.js      # 导航、滚动动画、灯箱交互
└── README.md
```

## 二、本地预览

直接用浏览器打开 `index.html` 即可；若图片/路径异常，建议起一个本地静态服务：

```bash
# 在项目根目录执行
python -m http.server 8080
# 然后访问 http://localhost:8080
```

## 三、你需要替换的内容

| 位置 | 要改什么 |
|---|---|
| 全站 `鞠婧祎` | 改成你想要的站名（共 5 个 HTML + 页脚，搜索替换即可） |
| 首页 Hero 文案 | 副标题、按钮文案 |
| `about.html` | 真实简介、应援色 / 应援名 / 粉丝称呼（请以官方公布为准） |
| `works.html` | 真实音乐、影视、综艺作品（名称、年份、简介） |
| `news.html` | 真实动态与时间线 |
| `gallery.html` 及各页 `.feature-media` / `.gallery-item` | 替换为真实图片（见下） |
| 页脚 `© 2026` | 年份与站名 |

### 换图片
把图片放进例如 `assets/img/`，然后在 HTML 中把占位 `<div class="ph">图片占位</div>` 换成：
```html
<div class="gallery-item" data-label="写真·春">
  <img src="assets/img/your-photo.jpg" alt="写真·春" style="width:100%;height:100%;object-fit:cover" />
  <div class="cap">写真 · 春</div>
</div>
```
> 大量图片建议用腾讯云 COS + CDN 托管，避免塞进站点包（Makers 单函数包 ≤128MB，整站也宜精简）。

### 改主题色（可选）
打开 `assets/css/styles.css`，修改 `:root` 里的 `--primary`（应援蓝，主视觉）/ `--accent`（喜爱红，行动色与点缀）/ `--bg`（背景）。当前为「蓝色（应援色）为主 + 红色（喜爱色）点缀」的配色。

## 四、部署到 EdgeOne Makers

> 前置：在 WorkBuddy 的「连接器」页连接 **EdgeOne Makers**（连接后需在 EdgeOne 控制台点「信任」启用）。

纯静态站点，Makers 会自动以 `index.html` 为入口，三种方式任选：

**方式 A · Git 自动部署（推荐，最省心）**
1. 把本目录推到 GitHub / GitLab 仓库。
2. 打开 EdgeOne Makers 控制台 → 新建项目 → 连接该仓库。
3. 构建命令留空（纯静态无需构建），输出目录填 `.`（根目录）。
4. 每次 `git push` 自动构建并全球加速发布。

**方式 B · EdgeOne CLI**
```bash
npm install -g edgeone
cd ju-jingyi-fansite
edgeone pages deploy . --name jingyi-fansite
```

**方式 C · 控制台直接上传**
在 Makers 控制台选择「上传文件夹」，选中本目录即可。

部署后得到一个 `*.pages.dev` 或自定义域名的全球加速站点。

## 五、合规须知（务必保留，不可移除）

1. **非官方声明**：本站首页、关于页、图库页均已内置「非官方声明」banner 与页脚声明，上线时**必须保留**。
2. **素材版权**：艺人肖像、写真、音乐、影视等素材版权归原作者及权利方所有。请仅使用**官方公开宣传图**，并注明来源；未经授权的图片/视频请勿上传或传播。
3. **非营利**：本站仅供粉丝非商业性的喜爱与纪念，**禁止**接广告盈利、售卖印有肖像的周边或任何商业变现。
4. **不冒充官方**：不得宣称与艺人本人或经纪公司存在合作、隶属关系，不得使用官方认证标识。
5. 如权利方要求下架，请积极配合。

---

祝你的星河站点漂亮又安心上线 ✦
