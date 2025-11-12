"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.activate = activate;
exports.deactivate = deactivate;
const vscode = require("vscode");
const panel_1 = require("./panel");
function activate(context) {
    const disposable = vscode.commands.registerCommand('themeManager.open', () => {
        panel_1.ThemePanel.createOrShow(context.extensionUri, context.globalState);
    });
    context.subscriptions.push(disposable);
}
function deactivate() { }
//# sourceMappingURL=extension.js.map