const templates = [
  { code: "ZC-01", image: "assets/template-zc-01.png", title: "糖果萌宠婚礼" },
  { code: "ZC-02", image: "assets/template-zc-02.png", title: "粉色凯蒂婚礼" },
  { code: "ZC-03", image: "assets/template-zc-03.png", title: "紫色香槟手绘" },
  { code: "ZC-04", image: "assets/template-zc-04.png", title: "橙色星星童话" },
  { code: "ZC-05", image: "assets/template-zc-05.png", title: "酒红线稿新人" },
  { code: "ZC-06", image: "assets/template-zc-06.png", title: "玫粉丝带酒杯" },
  { code: "ZC-07", image: "assets/template-zc-07.png", title: "复古酒红晚宴" },
  { code: "ZC-08", image: "assets/template-zc-08.png", title: "奶油酒红蝴蝶结" },
  { code: "ZC-09", image: "assets/template-zc-09.png", title: "复古手绘蛋糕" },
  { code: "ZC-10", image: "assets/template-zc-10.png", title: "巧克力复古囍字" },
  { code: "ZC-11", image: "assets/template-zc-11.png", title: "浅粉花卉晚宴" },
  { code: "ZC-12", image: "assets/template-zc-12.png", title: "红色涂鸦婚礼" },
  { code: "ZC-13", image: "assets/template-zc-13.png", title: "花园茶会婚礼" },
  { code: "ZC-14", image: "assets/template-zc-14.png", title: "奶油红线新人" },
  { code: "ZC-15", image: "assets/template-zc-15.png", title: "法式烛光晚宴" },
  { code: "ZC-16", image: "assets/template-zc-16.png", title: "中式鎏金囍字" },
  { code: "ZC-17", image: "assets/template-zc-17.png", title: "百日萌宠派对" },
  { code: "ZC-18", image: "assets/template-zc-18.png", title: "彩屑玫瑰婚礼" },
  { code: "ZC-19", image: "assets/template-zc-19.png", title: "粉色蝴蝶结酒杯" },
  { code: "ZC-20", image: "assets/template-zc-20.png", title: "奶油萌宠婚礼" },
  { code: "ZC-21", image: "assets/template-zc-21.png", title: "柔粉极简婚礼" },
  { code: "ZC-22", image: "assets/template-zc-22.png", title: "魔法学院婚礼" }
];

const state = {
  favorites: new Set(JSON.parse(localStorage.getItem("zicoi-favorites-v2") || "[]")),
  selected: localStorage.getItem("zicoi-selected-v2") || "",
  activeTemplate: null,
  uploadedFile: null
};

const $ = (selector) => document.querySelector(selector);
const templateGrid = $("#templateGrid");
const templateCount = $("#templateCount");
const templateDialog = $("#templateDialog");
const favoritesDialog = $("#favoritesDialog");
const successDialog = $("#successDialog");

function saveState() {
  localStorage.setItem("zicoi-favorites-v2", JSON.stringify([...state.favorites]));
  if (state.selected) localStorage.setItem("zicoi-selected-v2", state.selected);
  else localStorage.removeItem("zicoi-selected-v2");
}

function getTemplate(code) {
  return templates.find(item => item.code === code);
}

function renderTemplates() {
  if (templateCount) templateCount.textContent = `共 ${templates.length} 款`;
  templateGrid.innerHTML = templates.map(item => `
    <article class="template-card ${state.selected === item.code ? "selected" : ""}" data-code="${item.code}">
      ${state.selected === item.code ? '<span class="selected-badge">已选择</span>' : ""}
      <button class="template-image-button" type="button" data-view="${item.code}" aria-label="查看 ${item.code} 大图">
        <img src="${item.image}" alt="${item.code} ${item.title}相框模板" loading="lazy" />
      </button>
      <div class="template-meta">
        <div>
          <strong>${item.code}</strong>
          <small>${item.title} · 点击查看大图</small>
        </div>
        <button class="heart-button ${state.favorites.has(item.code) ? "active" : ""}" type="button" data-favorite="${item.code}" aria-label="收藏 ${item.code}">
          ${state.favorites.has(item.code) ? "♥" : "♡"}
        </button>
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
  $("#dockFavoriteCount").textContent = count;
}

function updateSelectedUI() {
  const item = getTemplate(state.selected);
  const preview = $("#selectedPreview");
  const selectedImage = $("#selectedImage");
  const selectedCode = $("#selectedCode");
  const dockText = $("#dockSelectedText");

  if (item) {
    preview.classList.remove("empty");
    selectedImage.src = item.image;
    selectedImage.alt = `${item.code} 模板缩略图`;
    selectedCode.textContent = `${item.code} · ${item.title}`;
    $("#templateCode").value = item.code;
    dockText.textContent = item.code;
  } else {
    preview.classList.add("empty");
    selectedImage.removeAttribute("src");
    selectedImage.alt = "";
    selectedCode.textContent = "暂未选择模板";
    $("#templateCode").value = "";
    dockText.textContent = "尚未选择";
  }
}

function toggleFavorite(code) {
  if (state.favorites.has(code)) state.favorites.delete(code);
  else state.favorites.add(code);
  saveState();
  updateCounters();
  renderTemplates();
  if (templateDialog.open && state.activeTemplate?.code === code) updateDialogFavorite();
  if (favoritesDialog.open) renderFavorites();
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
  templateDialog.showModal();
}

function closeDialog(dialog) {
  if (dialog.open) dialog.close();
}

function chooseTemplate(code) {
  const item = getTemplate(code);
  if (!item) return;
  state.selected = code;
  saveState();
  renderTemplates();
  updateSelectedUI();
  closeDialog(templateDialog);
  setTimeout(() => {
    $("#selectionFormSection").scrollIntoView({ behavior: "smooth", block: "start" });
  }, 120);
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
      <img src="${item.image}" alt="${item.code} 缩略图" />
      <div>
        <strong>${item.code}</strong>
        <small>${item.title}</small>
      </div>
      <button type="button" data-choose-favorite="${item.code}">
        ${state.selected === item.code ? "当前已选" : "选择此款"}
      </button>
    </article>
  `).join("");
  list.querySelectorAll("[data-choose-favorite]").forEach(btn => {
    btn.addEventListener("click", () => {
      chooseTemplate(btn.dataset.chooseFavorite);
      closeDialog(favoritesDialog);
    });
  });
}

function openFavorites() {
  renderFavorites();
  favoritesDialog.showModal();
}

function setEventType(type) {
  const wedding = type === "婚礼";
  const birthday = type === "生日";
  const other = type === "其他活动";

  $("#weddingFields").hidden = !wedding;
  $("#birthdayFields").hidden = !birthday;
  $("#eventNameField").hidden = !other;

  $("#brideName").required = wedding;
  $("#groomName").required = wedding;
  $("#birthdayName").required = birthday;
  $("#eventName").required = other;
}

document.querySelectorAll('input[name="eventType"]').forEach(input => {
  input.addEventListener("change", () => setEventType(input.value));
});

$("#visualUpload").addEventListener("change", (event) => {
  const file = event.target.files?.[0];
  const preview = $("#uploadPreview");
  const previewImage = $("#uploadPreviewImage");
  const fileName = $("#uploadFileName");

  state.uploadedFile = file || null;
  fileName.textContent = file ? `已选择：${file.name}` : "";
  preview.hidden = true;
  previewImage.removeAttribute("src");

  if (!file) return;
  if (file.size > 10 * 1024 * 1024) {
    $("#formError").textContent = "主视觉文件请控制在 10MB 以内。";
    event.target.value = "";
    state.uploadedFile = null;
    fileName.textContent = "";
    return;
  }
  $("#formError").textContent = "";
  if (file.type.startsWith("image/")) {
    const url = URL.createObjectURL(file);
    previewImage.src = url;
    preview.hidden = false;
  }
});

function validateForm() {
  const eventType = document.querySelector('input[name="eventType"]:checked')?.value;
  if (!state.selected) return "请先选择一款相框模板。";
  if (eventType === "婚礼") {
    if (!$("#brideName").value.trim() || !$("#groomName").value.trim()) return "请填写新娘和新郎名字。";
  } else if (eventType === "生日") {
    if (!$("#birthdayName").value.trim()) return "请填写生日主角姓名。";
  } else if (!$("#eventName").value.trim()) {
    return "请填写活动名称。";
  }
  if (!$("#eventDate").value) return "请选择婚礼或活动日期。";
  if (!$("#contact").value.trim()) return "请填写联系微信或手机号。";
  if (!$("#consent").checked) return "请勾选信息确认与联系授权。";
  return "";
}

function buildSummary() {
  const type = document.querySelector('input[name="eventType"]:checked').value;
  const names = type === "婚礼"
    ? `${$("#brideName").value.trim()} & ${$("#groomName").value.trim()}`
    : type === "生日"
      ? $("#birthdayName").value.trim()
      : $("#eventName").value.trim();
  const notes = $("#notes").value.trim() || "无";
  const file = state.uploadedFile?.name || "暂未上传";

  return [
    "紫菜不菜 Photobooth｜相框模板选择",
    "——————————————",
    `模板编号：${state.selected}`,
    `活动类型：${type}`,
    `${type === "婚礼" ? "新人姓名" : type === "生日" ? "生日主角姓名" : "活动名称"}：${names}`,
    `活动日期：${$("#eventDate").value}`,
    `联系方式：${$("#contact").value.trim()}`,
    `主视觉文件：${file}`,
    `修改说明：${notes}`,
    "——————————————",
    "请将主视觉原文件与以上信息一并发送给客服。"
  ].join("\n");
}

$("#selectionForm").addEventListener("submit", (event) => {
  event.preventDefault();
  const error = validateForm();
  $("#formError").textContent = error;
  if (error) return;

  const summary = buildSummary();
  localStorage.setItem("zicoi-last-submission", summary);
  $("#submissionSummary").textContent = summary;
  successDialog.showModal();
});

$("#copySummary").addEventListener("click", async () => {
  const text = $("#submissionSummary").textContent;
  try {
    await navigator.clipboard.writeText(text);
    $("#copySummary").textContent = "已复制 ✓";
    setTimeout(() => $("#copySummary").textContent = "复制提交信息", 1600);
  } catch {
    alert("复制失败，请长按提交信息手动复制。");
  }
});

$("#shareSummary").addEventListener("click", async () => {
  const text = $("#submissionSummary").textContent;
  const shareData = { title: "Zicoi Photobooth 相框模板选择", text };
  if (state.uploadedFile && navigator.canShare?.({ files: [state.uploadedFile] })) {
    shareData.files = [state.uploadedFile];
  }
  if (navigator.share) {
    try { await navigator.share(shareData); } catch (error) {
      if (error.name !== "AbortError") alert("暂时无法调用系统分享，请复制信息后发送给客服。");
    }
  } else {
    alert("当前浏览器不支持系统分享，请使用“复制提交信息”。");
  }
});

$("#downloadSummary").addEventListener("click", () => {
  const blob = new Blob([$("#submissionSummary").textContent], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `Zicoi-${state.selected}-模板选择.txt`;
  a.click();
  URL.revokeObjectURL(url);
});

$("#dialogFavorite").addEventListener("click", () => {
  if (state.activeTemplate) toggleFavorite(state.activeTemplate.code);
});
$("#confirmTemplate").addEventListener("click", () => {
  if (state.activeTemplate) chooseTemplate(state.activeTemplate.code);
});
$("#closeTemplateDialog").addEventListener("click", () => closeDialog(templateDialog));
$("#closeFavorites").addEventListener("click", () => closeDialog(favoritesDialog));
$("#closeSuccess").addEventListener("click", () => closeDialog(successDialog));
$("#openFavorites").addEventListener("click", openFavorites);
$("#dockFavorites").addEventListener("click", openFavorites);
$("#dockSelected").addEventListener("click", () => {
  if (state.selected) $("#selectionFormSection").scrollIntoView({ behavior: "smooth" });
  else $("#templates").scrollIntoView({ behavior: "smooth" });
});
$("#changeSelection").addEventListener("click", () => $("#templates").scrollIntoView({ behavior: "smooth" }));

[templateDialog, favoritesDialog, successDialog].forEach(dialog => {
  dialog.addEventListener("click", (event) => {
    const rect = dialog.getBoundingClientRect();
    const outside = event.clientX < rect.left || event.clientX > rect.right ||
      event.clientY < rect.top || event.clientY > rect.bottom;
    if (outside) dialog.close();
  });
});

// 防止客户直接保存模板图（右键另存 / 拖拽保存 / 长按保存）
function isProtectedImage(target) {
  return target instanceof Element && !!target.closest(
    ".template-image-button, .dialog-image-stage, .selected-image-wrap, .favorite-row"
  );
}
["contextmenu", "dragstart"].forEach((type) => {
  document.addEventListener(type, (event) => {
    if (isProtectedImage(event.target)) event.preventDefault();
  });
});

setEventType("婚礼");
renderTemplates();
updateCounters();
updateSelectedUI();
