if (require('electron-squirrel-startup')) {
    process.exit(0);
}

const { app, BrowserWindow, shell, ipcMain } = require('electron');
const { createWindow, updateGlobalShortcuts } = require('./utils/window');
const { setupGeminiIpcHandlers, stopMacOSAudioCapture, sendToRenderer } = require('./utils/gemini');
const { getLocalConfig, writeConfig } = require('./config');

const geminiSessionRef = { current: null };
let mainWindow = null;

function createMainWindow() {
    // We pass null for randomNames to disable stealth naming
    mainWindow = createWindow(sendToRenderer, geminiSessionRef, null);
    return mainWindow;
}

app.whenReady().then(async () => {
    // Anti-analysis removed for React Migration
    createMainWindow();
    setupGeminiIpcHandlers(geminiSessionRef);
    setupGeneralIpcHandlers();
});

app.on('window-all-closed', () => {
    stopMacOSAudioCapture();
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('before-quit', () => {
    stopMacOSAudioCapture();
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createMainWindow();
    }
});

function setupGeneralIpcHandlers() {
    ipcMain.handle('set-onboarded', async (event) => {
        return { success: true };
    });

    ipcMain.handle('set-stealth-level', async (event, stealthLevel) => {
        return { success: true };
    });

    ipcMain.handle('set-layout', async (event, layout) => {
        return { success: true };
    });

    ipcMain.handle('get-config', async (event) => {
        return { success: true, config: {} };
    });

    ipcMain.handle('quit-application', async event => {
        app.quit();
        return { success: true };
    });

    ipcMain.handle('open-external', async (event, url) => {
        await shell.openExternal(url);
        return { success: true };
    });
}