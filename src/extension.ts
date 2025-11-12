import * as vscode from 'vscode';
import { ThemePanel } from './panel';

export function activate(context: vscode.ExtensionContext) {
  const disposable = vscode.commands.registerCommand('themeManager.open', () => {
    ThemePanel.createOrShow(context.extensionUri, context.globalState);
  });

  context.subscriptions.push(disposable);
}

export function deactivate() {}
