const { BrowserWindow, globalShortcut, ipcMain, screen, app } = require('electron');
const path = require('node:path');
const fs = require('node:fs');
const os = require('os');

// --- RESTORED FUNCTION ---
function ensureDataDirectories() {
    // This was missing in your previous copy
    const homeDir = os.homedir();
    const cheddarDir = path.join(homeDir, 'cheddar');
    
    // Create the directory if it doesn't exist
    if (!fs.existsSync(cheddarDir)) {
        fs.mkdirSync(cheddarDir, { recursive: true });
    }
    
    return { imageDir: cheddarDir, audioDir: cheddarDir };
}

function createWindow(sendToRenderer, geminiSessionRef, randomNames = null) {
    let windowWidth = 1100;
    let windowHeight = 800;

    const mainWindow = new BrowserWindow({
        width: windowWidth,
        height: windowHeight,
        frame: true,
        transparent: false,
        webPreferences: {
            nodeIntegration: false, // Security: Keep false for React
            contextIsolation: true, // Security: Must be true for bridge
            webSecurity: false,
            preload: path.join(__dirname, '../utils/preload.js'), // Bridge file
        },
        backgroundColor: '#222222',
    });

    const isDev = !app.isPackaged;
    
    if (isDev) {
        mainWindow.loadURL('http://localhost:5173');
        mainWindow.webContents.openDevTools({ mode: 'detach' });
        console.log("Loading Development URL: http://localhost:5173");
    } else {
        mainWindow.loadFile(path.join(__dirname, '../../dist/index.html'));
    }

    mainWindow.on('closed', () => {
        // Dereference window if needed
    });

    setupWindowIpcHandlers(mainWindow, sendToRenderer, geminiSessionRef);
    return mainWindow;
}

function getDefaultKeybinds() {
    return {};
}

function updateGlobalShortcuts(keybinds, mainWindow, sendToRenderer, geminiSessionRef) {
    // Shortcuts disabled for migration
}

function setupWindowIpcHandlers(mainWindow, sendToRenderer, geminiSessionRef) {
    ipcMain.handle('window-minimize', () => {
        mainWindow.minimize();
    });
    
    ipcMain.handle('update-sizes', async event => {
        return { success: true };
    });

    // --- LISTENER FOR REACT BUTTON ---
    ipcMain.on('start-session', () => {
        console.log("✅ SESSION STARTED! (Backend received the signal)");
    });
}

module.exports = {
    ensureDataDirectories,
    createWindow,
    getDefaultKeybinds,
    updateGlobalShortcuts,
    setupWindowIpcHandlers,
};