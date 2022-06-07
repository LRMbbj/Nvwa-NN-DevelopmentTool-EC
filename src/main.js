const { app, BrowserWindow, ipcMain, ipcRenderer } = require("electron");
const path = require("path");
const remote = require("@electron/remote/main");
remote.initialize();

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require("electron-squirrel-startup")) {
	// eslint-disable-line global-require
	app.quit();
}

const createWindow = () => {
	// Create the browser window.
	const mainWindow = new BrowserWindow({
		width: 1200,
		height: 750,
		minHeight: 600,
		minWidth: 800,
		webPreferences: {
			nodeIntegration: true,
			contextIsolation: false,
		},
	});

	// and load the index.html of the app.
	mainWindow.loadFile(path.join(__dirname, "index.html"));

	// Open the DevTools.
	mainWindow.webContents.openDevTools();
	require("./main/menu.js");

	ipcMain.on("RendererToMainWindowMsg", (e, msg) => {
		mainWindow.webContents.send(msg.e, msg.data);
	});
};

// This method will be called when Electron has finished
app.on("ready", createWindow);

// Quit when all windows are closed, except on macOS.
app.on("window-all-closed", () => {
	if (process.platform !== "darwin") {
		console.log("App Quit!");
		app.quit();
	}
});

app.on("activate", () => {
	// On OS X it's common to re-create a window in the app when the
	// dock icon is clicked and there are no other windows open.
	if (BrowserWindow.getAllWindows().length === 0) {
		createWindow();
	}
});
