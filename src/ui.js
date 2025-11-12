const vscode = acquireVsCodeApi();

const themeSelect = document.getElementById('theme');
const iconSelect = document.getElementById('iconTheme');
const fontInput = document.getElementById('fontSize');

document.getElementById('apply').addEventListener('click', () => {
  vscode.postMessage({
    command: 'applySettings',
    data: {
      theme: themeSelect.value,
      iconTheme: iconSelect.value,
      fontSize: parseInt(fontInput.value, 10)
    }
  });
});

document.getElementById('undo').addEventListener('click', () => {
  vscode.postMessage({ command: 'undoSettings' });
});

document.getElementById('load').addEventListener('click', () => {
  vscode.postMessage({ command: 'getSettings' });
});

window.addEventListener('message', (event) => {
  const msg = event.data;
  if (msg.command === 'settings') {
    themeSelect.value = msg.data.theme || 'Default Dark+';
    iconSelect.value = msg.data.iconTheme || 'vs-seti';
    fontInput.value = msg.data.fontSize || 14;
  }
});
