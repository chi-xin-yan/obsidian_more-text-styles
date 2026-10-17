# More Text Styles 更多文本样式

[English](#english) | [中文](#中文)

An Obsidian plugin that adds extra text styles to the editor: underline, bigger/smaller font, center, and same-file heading/block links. Every feature works as a **toggle** — run the command again to remove the style.

一个为 Obsidian 编辑器增加更多文本样式的插件：下划线、放大/缩小字号、居中、同文件标题/块引用链接。所有功能都是**开关式**的——再次执行即取消。

## English

### Features

- **Underline** (`<u>`): wraps the selection in `<u>…</u>`. Markdown has no native underline syntax; the plugin uses inline HTML. Default hotkey: `Ctrl/Cmd+U`.
- **Bigger font** (`<big>`) / **Smaller font** (`<small>`): wraps the selection; can be applied repeatedly to compound the effect.
- **Center** (`<center>`): centers the line in reading view (off by default).
- **Heading link** (`[[#Heading]]`): select the heading text, run the command, and it is completed into an internal link that jumps to that heading of the current note. Full syntax `[[Note#Heading|Alias]]` is described in the settings.
- **Block link** (`[[#^BlockID]]`): precise jump to any line marked with a `^ID`. Full syntax `[[Note#^BlockID|Alias]]` is described in the settings.

All commands have toggle semantics: running them again removes the wrapping.

### Settings

Each feature can be:

- enabled or disabled (disabled features have no button, no palette entry, and no hotkey);
- shown as a button in the **mobile toolbar** (injected automatically and self-healing when Obsidian rebuilds the toolbar);
- bound to a hotkey — the plugin ships sensible defaults, and you can change them in Obsidian's native hotkey settings (a shortcut on the settings page jumps there with this plugin's commands pre-filtered).

### iPadOS / Chinese IME note

Hardware-keyboard hotkeys are guarded against the known Chinese-IME issue on iPadOS, where a `Cmd+Letter` press also inserts the letter into the note. The plugin snapshots the selection before the command and removes a stray inserted character afterwards.

### Manual installation

Copy `main.js`, `manifest.json` to `<vault>/.obsidian/plugins/more-text-styles/` and enable the plugin in Obsidian.

## 中文

### 功能

- **下划线**（`<u>`）：为选中文本添加下划线（Markdown 没有原生下划线语法，使用内联 HTML 实现），默认热键 `Ctrl/Cmd+U`。
- **放大/缩小字号**（`<big>` / `<small>`）：包裹选中文本，可连续叠加增强效果。
- **居中**（`<center>`）：阅读视图中水平居中（默认关闭）。
- **标题链接**（`[[#标题]]`）：选中标题文字后执行命令，自动补全为文内跳转链接，完整语法 `[[笔记名#标题|别名]]` 见设置页说明。
- **块引用链接**（`[[#^锚点]]`）：精确跳转到标注了 `^ID` 的任意一行，完整语法 `[[笔记名#^锚点|别名]]` 见设置页说明。

所有命令均为开关语义：再次执行即取消。

### 设置

每个功能可以：

- 单独启用/禁用（禁用后没有按钮、不出现在命令面板、快捷键同时失效）；
- 选择是否在移动端工具栏显示按钮（自动注入，Obsidian 重建工具栏后自动补回）；
- 配置快捷键——内置合理默认值，也可在 Obsidian 原生快捷键页修改（设置页有跳转按钮，会自动筛选出本插件的命令）。

### iPadOS / 中文输入法

针对 iPadOS 外接键盘 + 中文输入法下 `Cmd+字母` 会把字母塞进正文的已知问题，插件会在命令执行前快照选区、执行后定时清除误插的孤立字符。

### 手动安装

将 `main.js`、`manifest.json` 复制到 `<仓库>/.obsidian/plugins/more-text-styles/`，在 Obsidian 中启用即可。

## License / 许可证

MIT
