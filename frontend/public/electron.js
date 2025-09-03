const { app, BrowserWindow, Menu } = require('electron');
const path = require('path');
const isDev = require('electron-is-dev');

let mainWindow;

function createWindow() {
  // Utwórz główne okno aplikacji
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 800,
    minHeight: 600,
    icon: path.join(__dirname, 'icon.png'), // Dodaj ikonę jeśli masz
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: false,
      webSecurity: true
    }
  });

  // Załaduj aplikację
  const startUrl = isDev 
    ? 'http://localhost:3000' 
    : `file://${path.join(__dirname, '../build/index.html')}`;
  
  mainWindow.loadURL(startUrl);

  // Otwórz DevTools w trybie development
  if (isDev) {
    mainWindow.webContents.openDevTools();
  }

  // Usuń referencję do okna gdy jest zamykane
  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  // Ustaw menu
  createMenu();
}

function createMenu() {
  const template = [
    {
      label: 'Plik',
      submenu: [
        {
          label: 'Nowy schemat badawczy',
          accelerator: 'CmdOrCtrl+N',
          click: () => {
            mainWindow.webContents.send('menu-new-schema');
          }
        },
        {
          label: 'Nowe badanie',
          accelerator: 'CmdOrCtrl+Shift+N',
          click: () => {
            mainWindow.webContents.send('menu-new-study');
          }
        },
        { type: 'separator' },
        {
          label: 'Zamknij',
          accelerator: process.platform === 'darwin' ? 'Cmd+Q' : 'Ctrl+Q',
          click: () => {
            app.quit();
          }
        }
      ]
    },
    {
      label: 'Edycja',
      submenu: [
        { role: 'undo', label: 'Cofnij' },
        { role: 'redo', label: 'Ponów' },
        { type: 'separator' },
        { role: 'cut', label: 'Wytnij' },
        { role: 'copy', label: 'Kopiuj' },
        { role: 'paste', label: 'Wklej' },
        { role: 'selectall', label: 'Zaznacz wszystko' }
      ]
    },
    {
      label: 'Widok',
      submenu: [
        { role: 'reload', label: 'Odśwież' },
        { role: 'forceReload', label: 'Wymuś odświeżenie' },
        { role: 'toggleDevTools', label: 'Narzędzia deweloperskie' },
        { type: 'separator' },
        { role: 'resetZoom', label: 'Resetuj powiększenie' },
        { role: 'zoomIn', label: 'Powiększ' },
        { role: 'zoomOut', label: 'Pomniejsz' },
        { type: 'separator' },
        { role: 'togglefullscreen', label: 'Pełny ekran' }
      ]
    },
    {
      label: 'Pomoc',
      submenu: [
        {
          label: 'O aplikacji',
          click: () => {
            // Można dodać okno "O aplikacji"
          }
        }
      ]
    }
  ];

  // Dostosuj menu dla macOS
  if (process.platform === 'darwin') {
    template.unshift({
      label: app.getName(),
      submenu: [
        { role: 'about', label: 'O aplikacji' },
        { type: 'separator' },
        { role: 'services', label: 'Usługi' },
        { type: 'separator' },
        { role: 'hide', label: 'Ukryj' },
        { role: 'hideOthers', label: 'Ukryj inne' },
        { role: 'unhide', label: 'Pokaż wszystkie' },
        { type: 'separator' },
        { role: 'quit', label: 'Zakończ' }
      ]
    });
  }

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
}

// Ta metoda zostanie wywołana gdy Electron zakończy inicjalizację
app.whenReady().then(createWindow);

// Zakończ aplikację gdy wszystkie okna są zamknięte
app.on('window-all-closed', () => {
  // Na macOS aplikacje zwykle pozostają aktywne nawet gdy wszystkie okna są zamknięte
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // Na macOS, gdy ikona w docku jest kliknięta i nie ma innych otwartych okien
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// Zabezpieczenia
app.on('web-contents-created', (event, contents) => {
  contents.on('new-window', (event, navigationUrl) => {
    event.preventDefault();
  });
});
