const templates = [
  { code: "ZC-01", thumb: "assets/thumb-zc-01.webp", image: "assets/template-zc-01.webp", title: "次卡哇主题婚礼" },
  { code: "ZC-02", thumb: "assets/thumb-zc-02.webp", image: "assets/template-zc-02.webp", title: "粉色凯蒂婚礼" },
  { code: "ZC-03", thumb: "assets/thumb-zc-03.webp", image: "assets/template-zc-03.webp", title: "紫色香槟手绘" },
  { code: "ZC-04", thumb: "assets/thumb-zc-04.webp", image: "assets/template-zc-04.webp", title: "橙色星星人" },
  { code: "ZC-05", thumb: "assets/thumb-zc-05.webp", image: "assets/template-zc-05.webp", title: "酒红线稿新人" },
  { code: "ZC-06", thumb: "assets/thumb-zc-06.webp", image: "assets/template-zc-06.webp", title: "玫粉丝带酒杯" },
  { code: "ZC-07", thumb: "assets/thumb-zc-07.webp", image: "assets/template-zc-07.webp", title: "复古酒红晚宴" },
  { code: "ZC-08", thumb: "assets/thumb-zc-08.webp", image: "assets/template-zc-08.webp", title: "奶油酒红蝴蝶结" },
  { code: "ZC-09", thumb: "assets/thumb-zc-09.webp", image: "assets/template-zc-09.webp", title: "复古手绘蛋糕" },
  { code: "ZC-10", thumb: "assets/thumb-zc-10.webp", image: "assets/template-zc-10.webp", title: "巧克力复古囍字" },
  { code: "ZC-11", thumb: "assets/thumb-zc-11.webp", image: "assets/template-zc-11.webp", title: "浅粉花卉晚宴" },
  { code: "ZC-12", thumb: "assets/thumb-zc-12.webp", image: "assets/template-zc-12.webp", title: "红色涂鸦婚礼" },
  { code: "ZC-13", thumb: "assets/thumb-zc-13.webp", image: "assets/template-zc-13.webp", title: "花园茶会婚礼" },
  { code: "ZC-14", thumb: "assets/thumb-zc-14.webp", image: "assets/template-zc-14.webp", title: "奶油红线新人" },
  { code: "ZC-15", thumb: "assets/thumb-zc-15.webp", image: "assets/template-zc-15.webp", title: "法式烛光晚宴" },
  { code: "ZC-16", thumb: "assets/thumb-zc-16.webp", image: "assets/template-zc-16.webp", title: "中式鎏金囍字" },
  { code: "ZC-17", thumb: "assets/thumb-zc-17.webp", image: "assets/template-zc-17.webp", title: "百日小熊派对" },
  { code: "ZC-18", thumb: "assets/thumb-zc-18.webp", image: "assets/template-zc-18.webp", title: "彩屑玫瑰婚礼" },
  { code: "ZC-19", thumb: "assets/thumb-zc-19.webp", image: "assets/template-zc-19.webp", title: "粉色蝴蝶结酒杯" },
  { code: "ZC-20", thumb: "assets/thumb-zc-20.webp", image: "assets/template-zc-20.webp", title: "奶油萌宠婚礼" },
  { code: "ZC-21", thumb: "assets/thumb-zc-21.webp", image: "assets/template-zc-21.webp", title: "柔粉极简婚礼" },
  { code: "ZC-22", thumb: "assets/thumb-zc-22.webp", image: "assets/template-zc-22.webp", title: "魔法学院婚礼" },
  { code: "ZC-23", thumb: "assets/thumb-zc-23.webp", image: "assets/template-zc-23.webp", title: "星星人婚礼" },
  { code: "ZC-24", thumb: "assets/thumb-zc-24.webp", image: "assets/template-zc-24.webp", title: "酒红花边婚礼" },
  { code: "ZC-25", thumb: "assets/thumb-zc-25.webp", image: "assets/template-zc-25.webp", title: "复古红线婚礼" },
  { code: "ZC-26", thumb: "assets/thumb-zc-26.webp", image: "assets/template-zc-26.webp", title: "薄荷绿婚礼" }
];

const state = {
  favorites: new Set(JSON.parse(localStorage.getItem("zicoi-favorites-v2") || "[]")),
  selected: localStorage.getItem("zicoi-selected-v2") || "",
  activeTemplate: null
};

const $ = (selector) => document.querySelector(selector);
const templateGrid = $("#templateGrid");
const templateCount = $("#templateCount");
const templateDialog = $("#templateDialog");
const favoritesDialog = $("#favoritesDialog");
const selectionDialog = $("#selectionDialog");

function saveState() {
  localStorage.setItem("zicoi-favorites-v2", JSON.stringify([...state.favorites]));
  if (state.selected) localStorage.setItem("zicoi-selected-v2", state.selected);
  else localStorage.removeItem("zicoi-selected-v2");
}

function getTemplate(code) {
  return templates.find(item => item.code === code);
}

function showDialog(dialog) {
  if (!dialog) return;
  if (typeof dialog.showModal === "function") {
    if (!dialog.open) dialog.showModal();
  } else {
    dialog.setAttribute("open", "");
    dialog.classList.add("fallback-open");
    document.body.classList.add("modal-open");
  }
}

function closeDialog(dialog) {
  if (!dialog) return;
  if (typeof dialog.close === "function" && dialog.open) dialog.close();
  else dialog.removeAttribute("open");

  dialog.classList.remove("fallback-open");
  if (!document.querySelector("dialog[open]")) {
    document.body.classList.remove("modal-open");
  }
}

function renderTemplates() {
  if (templateCount) templateCount.textContent = `共 ${templates.length} 款`;

  templateGrid.innerHTML = templates.map((item, index) => `
    <article class="template-card ${state.selected === item.code ? "selected" : ""}" data-code="${item.code}">
      ${state.selected === item.code ? '<span class="selected-badge">已选定</span>' : ""}
      <button class="template-image-button" type="button" data-view="${item.code}" aria-label="查看 ${item.code} 大图">
        <img
          src="${item.thumb || item.image}"
          alt="${item.code} ${item.title}相框模板"
          draggable="false"
          loading="${index < 4 ? "eager" : "lazy"}"
          decoding="async"
          ${index === 0 ? 'fetchpriority="high"' : ""}
        />
      </button>
      <div class="template-meta">
        <div>
          <strong>${item.code}</strong>
          <small>${item.title} · 点击查看大图</small>
        </div>
        <button
          class="heart-button ${state.favorites.has(item.code) ? "active" : ""}"
          type="button"
          data-favorite="${item.code}"
          aria-label="收藏 ${item.code}"
        >${state.favorites.has(item.code) ? "♥" : "♡"}</button>
      </div>
    </article>
  `).join("");

  document.querySelectorAll("[data-view]").forEach(button => {
    button.addEventListener("click", () => openTemplate(button.dataset.view));
  });

  document.querySelectorAll("[data-favorite]").forEach(button => {
    button.addEventListener("click", () => toggleFavorite(button.dataset.favorite));
  });
}

function updateCounters() {
  const count = state.favorites.size;
  $("#favoriteCount").textContent = count;

  const selected = getTemplate(state.selected);
}

function toggleFavorite(code) {
  if (state.favorites.has(code)) state.favorites.delete(code);
  else state.favorites.add(code);

  saveState();
  updateCounters();
  renderTemplates();

  if (templateDialog?.open && state.activeTemplate?.code === code) {
    updateDialogFavorite();
  }
  if (favoritesDialog?.open) renderFavorites();
}

function updateDialogFavorite() {
  if (!state.activeTemplate) return;
  const active = state.favorites.has(state.activeTemplate.code);
  $("#dialogFavorite").textContent = active ? "♥ 已加入心选" : "♡ 加入心选";
  $("#dialogFavorite").classList.toggle("active", active);
}

function openTemplate(code) {
  const item = getTemplate(code);
  if (!item) return;

  state.activeTemplate = item;
  $("#dialogImage").src = item.image;
  $("#dialogImage").alt = `${item.code} ${item.title}相框模板大图`;
  $("#dialogCode").textContent = `${item.code} · ${item.title}`;
  updateDialogFavorite();
  showDialog(templateDialog);
}

function fillSelectionDialog() {
  const item = getTemplate(state.selected);
  if (!item) return false;

  $("#selectionHeading").textContent = `已选定 ${item.code}`;
  $("#selectionImage").src = item.thumb || item.image;
  $("#selectionImage").alt = `${item.code} ${item.title}已选模板预览`;
  $("#selectionCode").textContent = item.code;
  $("#selectionTitle").textContent = item.title;
  return true;
}

function openSelectionDialog() {
  if (!fillSelectionDialog()) {
    $("#templates").scrollIntoView({ behavior: "smooth", block: "start" });
    return;
  }
  showDialog(selectionDialog);
}

function chooseTemplate(code) {
  if (!getTemplate(code)) return;

  state.selected = code;
  saveState();
  renderTemplates();
  updateCounters();
  closeDialog(templateDialog);
  closeDialog(favoritesDialog);
  openSelectionDialog();
}

function renderFavorites() {
  const list = $("#favoritesList");
  const items = templates.filter(item => state.favorites.has(item.code));

  if (!items.length) {
    list.innerHTML = `<div class="empty-state">还没有收藏模板<br />点击模板右下角的爱心即可加入心选。</div>`;
    return;
  }

  list.innerHTML = items.map(item => `
    <article class="favorite-row">
      <img src="${item.thumb || item.image}" alt="${item.code} 缩略图" draggable="false" loading="lazy" decoding="async" />
      <div>
        <strong>${item.code}</strong>
        <small>${item.title}</small>
      </div>
      <button type="button" data-choose-favorite="${item.code}">
        ${state.selected === item.code ? "查看已选" : "选定此款"}
      </button>
    </article>
  `).join("");

  list.querySelectorAll("[data-choose-favorite]").forEach(button => {
    button.addEventListener("click", () => {
      if (state.selected === button.dataset.chooseFavorite) {
        closeDialog(favoritesDialog);
        openSelectionDialog();
      } else {
        chooseTemplate(button.dataset.chooseFavorite);
      }
    });
  });
}

function openFavorites() {
  renderFavorites();
  showDialog(favoritesDialog);
}

async function copyText(text, button, successText) {
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
    } else {
      const textarea = document.createElement("textarea");
      textarea.value = text;
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      textarea.remove();
    }

    const original = button.textContent;
    button.textContent = successText;
    setTimeout(() => {
      button.textContent = original;
    }, 1600);
  } catch {
    alert(`请手动复制：${text}`);
  }
}

function getSelectionShareText() {
  const item = getTemplate(state.selected);
  return item ? `紫菜不菜 Photobooth 模板选择：${item.code}｜${item.title}` : "";
}

$("#dialogFavorite").addEventListener("click", () => {
  if (state.activeTemplate) toggleFavorite(state.activeTemplate.code);
});

$("#confirmTemplate").addEventListener("click", () => {
  if (state.activeTemplate) chooseTemplate(state.activeTemplate.code);
});

$("#copySelectedCode").addEventListener("click", (event) => {
  const item = getTemplate(state.selected);
  if (item) copyText(item.code, event.currentTarget, "编号已复制 ✓");
});

$("#shareSelected").addEventListener("click", async () => {
  const text = getSelectionShareText();
  if (!text) return;

  if (navigator.share) {
    try {
      await navigator.share({
        title: "Zicoi Photobooth 模板选择",
        text
      });
    } catch (error) {
      if (error.name !== "AbortError") {
        copyText(text, $("#shareSelected"), "已复制分享内容 ✓");
      }
    }
  } else {
    copyText(text, $("#shareSelected"), "已复制分享内容 ✓");
  }
});

$("#openFavoritesFromSelection").addEventListener("click", () => {
  closeDialog(selectionDialog);
  openFavorites();
});

$("#rechooseTemplate").addEventListener("click", () => {
  closeDialog(selectionDialog);
  $("#templates").scrollIntoView({ behavior: "smooth", block: "start" });
});

$("#closeTemplateDialog").addEventListener("click", () => closeDialog(templateDialog));
$("#closeFavorites").addEventListener("click", () => closeDialog(favoritesDialog));
$("#closeSelection").addEventListener("click", () => closeDialog(selectionDialog));
$("#openFavorites").addEventListener("click", openFavorites);

[templateDialog, favoritesDialog, selectionDialog].forEach(dialog => {
  dialog.addEventListener("click", (event) => {
    const rect = dialog.getBoundingClientRect();
    const outside =
      event.clientX < rect.left ||
      event.clientX > rect.right ||
      event.clientY < rect.top ||
      event.clientY > rect.bottom;

    if (outside) closeDialog(dialog);
  });
});

// 图片保护：阻止右键菜单、拖拽和常见保存快捷键。
// 浏览器端无法绝对阻止截图或开发者工具提取。
const protectedImageSelector = [
  ".template-image-button",
  ".dialog-image-stage",
  ".selected-image-wrap",
  ".favorite-row img"
].join(",");

document.addEventListener("contextmenu", (event) => {
  if (event.target.closest?.(protectedImageSelector)) event.preventDefault();
});

document.addEventListener("dragstart", (event) => {
  if (event.target.closest?.(protectedImageSelector) || event.target.tagName === "IMG") {
    event.preventDefault();
  }
});

document.addEventListener("keydown", (event) => {
  const key = event.key.toLowerCase();
  if ((event.ctrlKey || event.metaKey) && (key === "s" || key === "u")) {
    event.preventDefault();
  }
});

renderTemplates();
updateCounters();
