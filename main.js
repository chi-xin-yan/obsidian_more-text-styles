"use strict";

const { Plugin, PluginSettingTab, Setting, MarkdownView } = require("obsidian");

/* ------------------------------------------------------------------ */
/* 功能定义                                                             */
/* ------------------------------------------------------------------ */

const MARKER = "mts-custom-option";

/* FEATURES 只保留结构与行为，所有文案按语言放在 I18N 表里 */
const FEATURES = [
  { id: "underline", glyph: "U", prefix: "<u>", suffix: "</u>", hotkey: "Mod+U" },
  { id: "bigger", glyph: "大", prefix: "<big>", suffix: "</big>", hotkey: "Mod+=" },
  { id: "smaller", glyph: "小", prefix: "<small>", suffix: "</small>", hotkey: "Mod+-" },
  { id: "center", glyph: "中", prefix: "<center>", suffix: "</center>", hotkey: "" },
  { id: "heading-link", glyph: "[[#", prefix: "[[#", suffix: "]]", hotkey: "" },
  { id: "block-link", glyph: "[[#^", prefix: "[[#^", suffix: "]]", hotkey: "" },
];

const I18N = {
  en: {
    title: "More Text Styles",
    hotkeys: "Hotkeys",
    openHotkeys: "Open hotkey settings",
    featuresHeading: "Features",
    toolbarButton: "Show toolbar button",
    features: {
      "underline": {
        name: "Underline <u>", label: "Underline",
        desc: "Wrap the selection in a `<u>` tag to underline it. Run again to remove.",
      },
      "bigger": {
        name: "Bigger font <big>", label: "Bigger font",
        desc: "Wrap the selection in a `<big>` tag to enlarge it. Can be applied repeatedly; run again on enlarged text to remove.",
      },
      "smaller": {
        name: "Smaller font <small>", label: "Smaller font",
        desc: "Wrap the selection in a `<small>` tag to shrink it. Can be applied repeatedly; run again on shrunk text to remove.",
      },
      "center": {
        name: "Center <center>", label: "Center",
        desc: "Wrap the selection in a `<center>` tag so it appears centered in reading view (not visible while editing). Run again to remove.",
      },
      "heading-link": {
        name: "Heading link [[#", label: "Heading link",
        desc: "Create a heading link. Usage: `[[Note#Heading|Alias]]` — `Note` is optional and defaults to the current note; `Heading` is the target heading in that note, write `H1#H2#…` for nested headings; `Alias` is optional and sets the displayed text (the heading text is shown if omitted). With text selected, the command completes it into a heading link `[[#Heading]]`.",
      },
      "block-link": {
        name: "Block link [[#^", label: "Block link",
        desc: "Create a block link. Usage: `[[Note#^BlockID|Alias]]` — `Note` is optional and defaults to the current note; `BlockID` is the `^ID` (e.g. `^gz1`, invisible when rendered) marked at the end of the target line; `Alias` is optional and sets the displayed text. With text selected, the command completes it into a block link `[[#^BlockID]]`.",
      },
    },
  },
  zh: {
    title: "更多文本样式",
    hotkeys: "快捷键",
    openHotkeys: "打开快捷键设置",
    featuresHeading: "功能开关",
    toolbarButton: "在工具栏显示按钮",
    features: {
      "underline": {
        name: "下划线 <u>", label: "下划线",
        desc: "用`<u>`标签为选中文字添加下划线，再次执行可取消。",
      },
      "bigger": {
        name: "放大字号 <big>", label: "放大字号",
        desc: "用`<big>`标签放大选中文字，可连续叠加增强效果；对已放大的文字执行则取消。",
      },
      "smaller": {
        name: "缩小字号 <small>", label: "缩小字号",
        desc: "用`<small>`标签缩小选中文字，可连续叠加；对已缩小的文字执行则取消。",
      },
      "center": {
        name: "居中 <center>", label: "居中",
        desc: "用`<center>`标签让选中文字在阅读视图中水平居中，编辑视图不显示效果；再次执行可取消。",
      },
      "heading-link": {
        name: "同文件标题链接 [[#", label: "标题链接",
        desc: "创建标题链接。用法：`[[笔记名#标题|别名]]`——其中`笔记名`可选，留空表示指向本文；`标题`为指向的笔记中的对应标题，需要指向多级标题则写成`一级标题#二级标题#……`；`别名`可选，用于自定义显示文本，省略时显示标题原文。选中文本时可将其补全为标题链接`[[#标题]]`。",
      },
      "block-link": {
        name: "同文件块引用链接 [[#^", label: "块引用链接",
        desc: "创建块引用链接。用法：`[[笔记名#^锚点|别名]]`——其中`笔记名`可选，留空表示指向本文；`锚点`为目标行末尾标注的`^ID`（如`^gz1`，渲染后不可见）；`别名`可选，用于自定义显示文本。选中文本时可将其补全为块引用链接`[[#^锚点]]`。",
      },
    },
  },
  "zh-TW": {
    title: "更多文字樣式",
    hotkeys: "快捷鍵",
    openHotkeys: "開啟快捷鍵設定",
    featuresHeading: "功能開關",
    toolbarButton: "在工具列顯示按鈕",
    features: {
      "underline": {
        name: "底線 <u>", label: "底線",
        desc: "用`<u>`標籤為選取文字加入底線，再次執行可取消。",
      },
      "bigger": {
        name: "放大字號 <big>", label: "放大字號",
        desc: "用`<big>`標籤放大選取文字，可連續疊加增強效果；對已放大的文字執行則取消。",
      },
      "smaller": {
        name: "縮小字號 <small>", label: "縮小字號",
        desc: "用`<small>`標籤縮小選取文字，可連續疊加；對已縮小的文字執行則取消。",
      },
      "center": {
        name: "置中 <center>", label: "置中",
        desc: "用`<center>`標籤讓選取文字在閱讀檢視中水平置中，編輯檢視不顯示效果；再次執行可取消。",
      },
      "heading-link": {
        name: "本文標題連結 [[#", label: "標題連結",
        desc: "建立標題連結。用法：`[[筆記名#標題|別名]]`——其中`筆記名`可選，留空表示指向本文；`標題`為指向的筆記中的對應標題，需要指向多級標題則寫成`一級標題#二級標題#……`；`別名`可選，用於自訂顯示文字，省略時顯示標題原文。選取文字時可將其補全為標題連結`[[#標題]]`。",
      },
      "block-link": {
        name: "本文區塊引用連結 [[#^", label: "區塊引用連結",
        desc: "建立區塊引用連結。用法：`[[筆記名#^錨點|別名]]`——其中`筆記名`可選，留空表示指向本文；`錨點`為目標行末尾標註的`^ID`（如`^gz1`，渲染後不可見）；`別名`可選，用於自訂顯示文字。選取文字時可將其補全為區塊引用連結`[[#^錨點]]`。",
      },
    },
  },
};

/* 读取用户在 Obsidian 里选择的界面语言：zh-TW/zh-HK 归入繁体，其余归入英文 */
function detectLang() {
  let l = "";
  try { l = window.localStorage.getItem("language") || ""; } catch (e) { /* 忽略 */ }
  if (!l && typeof window.moment === "function") l = window.moment.locale() || "";
  l = (l || "en").toLowerCase();
  if (l.startsWith("zh")) {
    return l.includes("tw") || l.includes("hk") || l.includes("hant") ? "zh-TW" : "zh";
  }
  return "en";
}

/* 设置页说明文字的渲染：把反引号包裹的片段转成真正的 <code> 行内代码元素，
   其余部分保持纯文本（setDesc 对字符串按纯文本处理，Markdown/HTML 都不会渲染） */
function descFragment(text) {
  const frag = document.createDocumentFragment();
  text.split("`").forEach((seg, i) => {
    if (!seg) return;
    if (i % 2 === 1) {
      const code = document.createElement("code");
      code.textContent = seg;
      frag.appendChild(code);
    } else {
      frag.appendChild(document.createTextNode(seg));
    }
  });
  return frag;
}

/* 每个功能的默认配置：两种链接默认无按钮、无快捷键 */
const FEATURE_DEFAULTS = {
  "underline": { enabled: true, button: true },
  "bigger": { enabled: true, button: true },
  "smaller": { enabled: true, button: true },
  "center": { enabled: true, button: false },
  "heading-link": { enabled: true, button: false },
  "block-link": { enabled: true, button: false },
};

/* 把 "Mod+U"、"Ctrl+Shift+=" 这类字符串解析成 Obsidian 的 Hotkey 结构 */
function parseHotkey(str) {
  if (!str || !str.trim()) return undefined;
  const parts = str.trim().split("+").map((p) => p.trim()).filter(Boolean);
  if (parts.length === 0) return undefined;
  const key = parts.pop().toLowerCase();
  const map = {
    mod: "Mod", ctrl: "Ctrl", control: "Ctrl", cmd: "Meta",
    meta: "Meta", command: "Meta", alt: "Alt", option: "Alt",
    opt: "Alt", shift: "Shift",
  };
  const modifiers = [];
  for (const p of parts) {
    const m = map[p.toLowerCase()];
    if (m && !modifiers.includes(m)) modifiers.push(m);
  }
  return [{ modifiers, key }];
}

module.exports = class MoreTextStylesPlugin extends Plugin {
  async onload() {
    this.lang = detectLang();
    this.settings = { features: {} };
    const data = (await this.loadData()) || {};
    for (const f of FEATURES) {
      this.settings.features[f.id] = Object.assign(
        {},
        FEATURE_DEFAULTS[f.id],
        (data.features && data.features[f.id]) || {}
      );
    }

    /* 设置页子项缩进样式 */
    this.styleEl = document.createElement("style");
    this.styleEl.textContent = ".mts-sub-setting { margin-left: 1.6em; }";
    document.head.appendChild(this.styleEl);

    this.registerCommands();

    /* iPadOS 中文输入法补丁：
       拼音输入法会在默认行为里把热键字母塞进正文（如 Cmd+U → 多出"u"）。
       实测 preventDefault 能拦住字符（2.5.0 中字符确实消失了），
       但插件若自己再执行命令会与 Obsidian 键位表双重触发、相互抵消。
       因此这里命中热键时只 preventDefault，命令交给 Obsidian 执行（恰好一次）；
       同时保留按键前快照，万一字符仍被输入法塞入，由事后清扫兜底。 */
    this.keyHandler = (e) => {
      this.preWasOurs = false;
      if (e.isComposing || e.repeat) return;
      if (!(e.metaKey || e.ctrlKey) || e.altKey) return;
      const key = e.key || "";
      if (!key) return;
      for (const f of FEATURES) {
        const s = this.settings.features[f.id];
        if (!s || !s.enabled) continue;
        for (const h of this.effectiveHotkeys(f)) {
          if (!this.hotkeyMatchesEvent(h, e)) continue;
          const view = this.app.workspace.getActiveViewOfType(MarkdownView);
          if (!view) return;
          this.preWasOurs = true;
          this.preTime = Date.now();
          this.preBareKey = key;
          this.preSnap = {
            sel: view.editor.getSelection(),
            fromOff: view.editor.posToOffset(view.editor.getCursor("from")),
            toOff: view.editor.posToOffset(view.editor.getCursor("to")),
          };
          e.preventDefault();
          return;
        }
      }
    };
    window.addEventListener("keydown", this.keyHandler, { capture: true });

    this.addSettingTab(new MoreTextStylesSettingTab(this.app, this));

    /* 挂在 body 上统一处理：工具栏未创建 / 被重建 / 按钮被清空都会自动补回 */
    this.bodyObserver = new MutationObserver(() => this.ensureButtons());
    this.bodyObserver.observe(document.body, { childList: true, subtree: true });
    this.ensureButtons();
  }

  onunload() {
    if (this.bodyObserver) this.bodyObserver.disconnect();
    if (this.keyHandler) window.removeEventListener("keydown", this.keyHandler, { capture: true });
    if (this.styleEl) this.styleEl.remove();
    document.querySelectorAll("." + MARKER).forEach((el) => el.remove());
  }

  async saveSettings() {
    await this.saveData(this.settings);
  }

  fullId(f) {
    return this.manifest.id + ":" + f.id;
  }

  /* 按当前界面语言取通用文案 */
  t(key) {
    const L = I18N[this.lang] || I18N.en;
    return L[key] != null ? L[key] : I18N.en[key];
  }

  /* 按当前界面语言取某个功能的文案（命令名/设置页标签/说明） */
  ftext(f) {
    const L = I18N[this.lang] || I18N.en;
    return (L.features && L.features[f.id]) || I18N.en.features[f.id];
  }

  /* 命令的生效热键：优先用户在系统快捷键页的绑定，其次插件默认值 */
  effectiveHotkeys(f) {
    try {
      const hm = this.app.hotkeyManager;
      const custom = hm && typeof hm.getHotkeys === "function" ? hm.getHotkeys(this.fullId(f)) : null;
      if (custom && custom.length) return custom;
    } catch (err) { /* 读取失败时回退默认值 */ }
    return parseHotkey(f.hotkey) || [];
  }

  /* 判断热键定义是否与按键事件匹配（要求带 Cmd/Ctrl 修饰键） */
  hotkeyMatchesEvent(h, e) {
    const mods = Array.isArray(h.modifiers) ? h.modifiers : String(h.modifiers || "").split("-").filter(Boolean);
    if (mods.includes("Shift") !== e.shiftKey) return false;
    if (mods.includes("Alt") !== e.altKey) return false;
    if (!(e.metaKey || e.ctrlKey)) return false;
    return (e.key || "").toLowerCase() === String(h.key || "").toLowerCase();
  }

  /* 若刚才是热键触发，安排输入法误插字符的检查（工具栏点击不触发） */
  scheduleImeCleanup(f) {
    if (!this.preWasOurs || !this.preSnap || Date.now() - this.preTime > 800) return;
    for (const delay of [150, 600]) {
      window.setTimeout(() => this.fixArtifact(f, this.preSnap, this.preBareKey), delay);
    }
  }

  /* 检查并清除输入法误插的热键字符（命令执行后光标已收拢，误插字符就在光标处） */
  fixArtifact(f, snap, bareKey) {
    if (!snap || !bareKey) return;
    const view = this.app.workspace.getActiveViewOfType(MarkdownView);
    if (!view) return;
    const ed = view.editor;
    const at = (a, b) => ed.getRange(ed.offsetToPos(a), ed.offsetToPos(b));
    const o = snap.fromOff;
    const headOff = ed.posToOffset(ed.getCursor("head"));
    try {
      /* 光标仍在误插字符附近且字符确为热键字母 → 删除 */
      if (headOff >= o && headOff <= o + bareKey.length && at(o, o + bareKey.length) === bareKey) {
        ed.replaceRange("", ed.offsetToPos(o), ed.offsetToPos(o + bareKey.length));
        ed.setCursor(ed.offsetToPos(o));
      }
    } catch (err) { /* 输入法组词期间编辑器拒绝修改，忽略，等下一轮定时检查 */ }
  }

  /* -------------------- 命令的动态注册/注销 -------------------- */

  registerCommands() {
    const plugin = this;
    for (const f of FEATURES) {
      const s = this.settings.features[f.id];
      if (!s.enabled) continue; /* 禁用的功能：不注册 → 命令面板无、快捷键无 */
      this.addCommand({
        id: f.id,
        name: this.ftext(f).name,
        hotkeys: parseHotkey(f.hotkey),
        editorCheckCallback: function (checking, editor) {
          if (!checking) {
            plugin.toggleWrap(editor, f.prefix, f.suffix);
            plugin.scheduleImeCleanup(f);
          }
          return true;
        },
      });
    }
  }

  unregisterCommands() {
    const store = this.app.commands;
    for (const f of FEATURES) {
      const id = this.fullId(f);
      if (store.commands) delete store.commands[id];
      if (store.editorCommands) delete store.editorCommands[id];
    }
  }

  /* 设置变更后：重注册命令 + 重建工具栏按钮 */
  applySettings() {
    this.unregisterCommands();
    this.registerCommands();
    document.querySelectorAll("." + MARKER).forEach((el) => el.remove());
    this.ensureButtons();
  }

  /* -------------------- 核心：带 toggle 的包裹/拆包 -------------------- */

  /* 1. 标签紧贴选区外侧（含光标卡在空标签中间） → 拆掉，重新选中正文
     2. 标签包含在选区内部 → 拆掉，重新选中正文
     3. 其余情况 → 包裹，并把正文重新选中 */
  toggleWrap(editor, prefix, suffix) {
    if (!editor) return;
    const PL = prefix.length;
    const SL = suffix.length;

    const lastOffset = editor.getValue().length;
    const clamp = (o) => Math.max(0, Math.min(o, lastOffset));
    const pos = (o) => editor.offsetToPos(clamp(o));
    const range = (a, b) => editor.getRange(pos(a), pos(b));

    const fromOff = editor.posToOffset(editor.getCursor("from"));
    const toOff = editor.posToOffset(editor.getCursor("to"));
    const sel = editor.getSelection();

    /* 情况 1：标签在选区外侧 */
    if (
      fromOff - PL >= 0 &&
      range(fromOff - PL, fromOff) === prefix &&
      range(toOff, toOff + SL) === suffix
    ) {
      editor.setSelection(pos(fromOff - PL), pos(toOff + SL));
      editor.replaceSelection(sel);
      /* 光标落到还原后的正文末尾（不保持选区：避免输入法组词吃掉选区） */
      editor.setCursor(pos(fromOff - PL + sel.length));
      return;
    }

    /* 情况 2：标签在选区内部 */
    if (sel && sel.startsWith(prefix) && sel.endsWith(suffix) && sel.length >= PL + SL) {
      const inner = sel.slice(PL, sel.length - SL);
      editor.replaceSelection(inner);
      editor.setCursor(pos(toOff - PL - SL));
      return;
    }

    /* 情况 3：执行包裹 */
    if (sel) {
      editor.replaceSelection(prefix + sel + suffix);
      /* 替换后文档已变长，必须用新的文档长度做钳制 */
      const newLast = editor.getValue().length;
      editor.setCursor(editor.offsetToPos(Math.max(0, Math.min(fromOff + PL + sel.length, newLast))));
    } else {
      editor.replaceSelection(prefix + suffix);
      const head = editor.getCursor("head");
      editor.setCursor({ line: head.line, ch: Math.max(0, head.ch - SL) });
    }
  }

  /* -------------------- 移动端工具栏注入 -------------------- */

  ensureButtons() {
    const toolbar = document.querySelector(".mobile-toolbar");
    if (!toolbar) return;
    if (toolbar.querySelector("." + MARKER)) return; /* 已注入，避免死循环 */

    const container = toolbar.querySelector(".mobile-toolbar-options-container") || toolbar;
    for (const f of FEATURES) {
      const s = this.settings.features[f.id];
      if (!s.enabled || !s.button) continue; /* 禁用或未开按钮的功能不注入 */
      container.appendChild(this.makeOption(f));
    }
  }

  makeOption(f) {
    const el = document.createElement("div");
    el.className = "mobile-toolbar-option " + MARKER;
    el.setAttribute("aria-label", this.ftext(f).name);
    el.style.display = "flex";
    el.style.alignItems = "center";
    el.style.justifyContent = "center";

    const glyph = document.createElement("span");
    glyph.style.fontWeight = "600";
    glyph.style.lineHeight = "1";
    glyph.style.pointerEvents = "none";
    if (f.id === "underline") {
      glyph.textContent = f.glyph;
      glyph.style.textDecoration = "underline";
    } else if (f.id === "bigger") {
      glyph.innerHTML = "<big>" + f.glyph + "</big>";
    } else if (f.id === "smaller") {
      glyph.innerHTML = "<small>" + f.glyph + "</small>";
    } else {
      glyph.textContent = f.glyph;
    }
    el.appendChild(glyph);

    /* pointerdown 阻止默认行为，避免点击按钮时编辑器失焦、键盘收起 */
    el.addEventListener("pointerdown", (e) => e.preventDefault());
    el.addEventListener("click", (e) => {
      e.stopPropagation();
      this.app.commands.executeCommandById(this.fullId(f));
    });
    return el;
  }
};

/* ------------------------------------------------------------------ */
/* 设置页                                                               */
/* ------------------------------------------------------------------ */

class MoreTextStylesSettingTab extends PluginSettingTab {
  constructor(app, plugin) {
    super(app, plugin);
    this.plugin = plugin;
  }

  /* 跳转到系统快捷键页并自动填入插件名过滤 */
  openNativeHotkeySettings() {
    const setting = this.app.setting;
    setting.open();
    setting.openTabById("hotkeys");
    setTimeout(() => {
      const input =
        setting.containerEl.querySelector(".vertical-tab-content input[type='search']") ||
        setting.containerEl.querySelector("input[type='search']");
      if (input) {
        input.value = this.plugin.manifest.name;
        input.dispatchEvent(new Event("input", { bubbles: true }));
      }
    }, 50);
  }

  display() {
    const { containerEl } = this;
    const p = this.plugin;
    containerEl.empty();

    containerEl.createEl("div", { text: p.t("title") }).addClass("mts-settings-title");

    new Setting(containerEl)
      .setName(p.t("hotkeys"))
      .addButton((b) =>
        b.setButtonText(p.t("openHotkeys")).onClick(() => this.openNativeHotkeySettings())
      );

    containerEl.createEl("h2", { text: p.t("featuresHeading") });

    for (const f of FEATURES) {
      const s = p.settings.features[f.id];
      const tx = p.ftext(f);
      let buttonToggle = null;

      const parent = new Setting(containerEl).setName(tx.label);
      if (tx.desc) parent.setDesc(descFragment(tx.desc));
      parent.addToggle((t) =>
        t.setValue(s.enabled).onChange(async (v) => {
          s.enabled = v;
          await p.saveSettings();
          p.applySettings();
          if (buttonToggle) buttonToggle.setDisabled(!v);
        })
      );

      buttonToggle = new Setting(containerEl)
        .setName(p.t("toolbarButton"))
        .setClass("mts-sub-setting")
        .addToggle((t) =>
          t.setValue(s.button).onChange(async (v) => {
            s.button = v;
            await p.saveSettings();
            p.applySettings();
          })
        );
      buttonToggle.setDisabled(!s.enabled);
    }
  }
}
