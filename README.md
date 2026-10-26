# Sidebar Notes · 侧栏便签

A Quick Notes scratchpad panel with an entry in the DeepSeek Harness (dsh) left sidebar. Notes stay in the browser's local storage — nothing is sent to the model.

在 DeepSeek Harness（dsh）左侧栏添加快捷便签入口，打开一个草稿面板。内容只保存在本机浏览器里，不会发送给模型。

## Features

- Left sidebar entry that opens a full Quick Notes panel.
- Auto-save to `localStorage` after a short debounce; clear status and character count.
- Two-step "clear" confirmation.
- English and Chinese UI, following the DSH language setting.
- Uses DSH theme tokens, so light and dark themes work.

## Install

From the DSH Web UI:

1. Open **Plugins** in the left sidebar.
2. Choose **Add plugin** → **Install a third-party plugin**.
3. Enter the Git address `https://github.com/sky12-321/dsh-sidebar-notes` and install.
4. Reload the page if the sidebar entry does not appear immediately.

With the DSH CLI:

```sh
dsh plugin add github:sky12-321/dsh-sidebar-notes
```

## Usage

Click **Quick Notes** in the left sidebar. Type into the panel; the footer shows the character count and the browser-local storage notice. The **Clear** button asks for a second click before erasing the note.

## Data

Notes are stored in `localStorage` under `dsh.sidebar-notes.text.v1` for the current DSH Web origin. Clearing browser site data removes them. The plugin has no Host-side state and makes no network requests.

## Package layout

| Path | Purpose |
|---|---|
| `index.js` | Host half; intentionally empty. |
| `client.js` | Browser module: sidebar entry, main panel, locale dictionaries, styles. |
| `cordis.patch.yml` | Inserts the bundle row. |
| `locale/` | Plugin Manager display metadata. |
| `icon.svg` | Plugin icon. |

## License

MIT
