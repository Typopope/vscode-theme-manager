"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ThemePanel = void 0;
const vscode = require("vscode");
class ThemePanel {
    static createOrShow(extensionUri, globalState) {
        const column = vscode.window.activeTextEditor ? vscode.window.activeTextEditor.viewColumn : undefined;
        if (ThemePanel.currentPanel) {
            ThemePanel.currentPanel.panel.reveal(column);
            return;
        }
        const panel = vscode.window.createWebviewPanel('themeManager', 'Theme Manager', column || vscode.ViewColumn.One, {
            enableScripts: true,
            localResourceRoots: [vscode.Uri.joinPath(extensionUri, 'src')]
        });
        ThemePanel.currentPanel = new ThemePanel(panel, extensionUri, globalState);
    }
    constructor(panel, extensionUri, globalState) {
        this.disposables = [];
        this.panel = panel;
        this.extensionUri = extensionUri;
        this.globalState = globalState;
        this.panel.webview.html = this.getHtmlForWebview(panel.webview);
        this.panel.webview.onDidReceiveMessage(async (message) => {
            const config = vscode.workspace.getConfiguration();
            switch (message.command) {
                case 'applySettings': {
                    const oldSettings = {
                        theme: config.get('workbench.colorTheme'),
                        iconTheme: config.get('workbench.iconTheme'),
                        fontSize: config.get('editor.fontSize')
                    };
                    await this.globalState.update('previousSettings', oldSettings);
                    await config.update('workbench.colorTheme', message.data.theme, vscode.ConfigurationTarget.Global);
                    await config.update('workbench.iconTheme', message.data.iconTheme, vscode.ConfigurationTarget.Global);
                    await config.update('editor.fontSize', message.data.fontSize, vscode.ConfigurationTarget.Global);
                    vscode.window.showInformationMessage('Настройки применены!');
                    break;
                }
                case 'undoSettings': {
                    const prev = this.globalState.get('previousSettings');
                    if (prev) {
                        await config.update('workbench.colorTheme', prev.theme, vscode.ConfigurationTarget.Global);
                        await config.update('workbench.iconTheme', prev.iconTheme, vscode.ConfigurationTarget.Global);
                        await config.update('editor.fontSize', prev.fontSize, vscode.ConfigurationTarget.Global);
                        vscode.window.showInformationMessage('Настройки возвращены!');
                    }
                    else {
                        vscode.window.showWarningMessage('Нет сохранённых настроек для отката.');
                    }
                    break;
                }
                case 'getSettings': {
                    const current = {
                        theme: config.get('workbench.colorTheme'),
                        iconTheme: config.get('workbench.iconTheme'),
                        fontSize: config.get('editor.fontSize')
                    };
                    this.panel.webview.postMessage({ command: 'settings', data: current });
                    break;
                }
            }
        });
        this.panel.onDidDispose(() => this.dispose(), null, this.disposables);
    }
    getHtmlForWebview(webview) {
        const scriptUri = webview.asWebviewUri(vscode.Uri.joinPath(this.extensionUri, 'src', 'ui.js'));
        const styleUri = webview.asWebviewUri(vscode.Uri.joinPath(this.extensionUri, 'src', 'ui.html'));
        return /* html */ `
      <!DOCTYPE html>
      <html lang="ru">
      <head>
        <meta charset="UTF-8" />
        <title>Theme Manager</title>
        <meta http-equiv="Content-Security-Policy"
              content="default-src 'none'; style-src 'unsafe-inline' ${webview.cspSource}; script-src 'unsafe-inline' ${webview.cspSource};">
        <style>
          body {
            font-family: var(--vscode-font-family);
            color: var(--vscode-foreground);
            background: var(--vscode-editor-background);
            padding: 16px;
          }
          label { display: block; margin-top: 8px; }
          select, input { width: 100%; margin-top: 4px; padding: 4px; }
          button { margin-top: 12px; padding: 6px 10px; cursor: pointer; }
        </style>
      </head>
      <body>
        <h2>Настройки оформления</h2>

        <label>Тема</label>
        <select id="theme">
          <option>Default Dark+</option>
          <option>Default Light+</option>
          <option>Monokai</option>
          <option>Quiet Light</option>
          <option>Solarized Dark</option>
        </select>

        <label>Тема иконок</label>
        <select id="iconTheme">
          <option>vs-seti</option>
          <option>vscode-icons</option>
          <option>material-icon-theme</option>
        </select>

        <label>Размер шрифта</label>
        <input id="fontSize" type="number" value="14" min="10" max="30" />

        <button id="apply">Применить</button>
        <button id="undo">Отменить изменения</button>
        <button id="load">Загрузить текущие</button>

        <script src="${scriptUri}"></script>
      </body>
      </html>
    `;
    }
    dispose() {
        ThemePanel.currentPanel = undefined;
        this.panel.dispose();
        while (this.disposables.length) {
            const d = this.disposables.pop();
            if (d)
                d.dispose();
        }
    }
}
exports.ThemePanel = ThemePanel;
//# sourceMappingURL=panel.js.map