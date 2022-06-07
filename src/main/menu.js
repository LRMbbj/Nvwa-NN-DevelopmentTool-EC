const {
	Menu,
	shell,
	ipcMain,
	BrowserWindow,
	ipcRenderer,
	dialog,
} = require("electron");

const FileOperator = require("./fileOperator.js");

// 顶部菜单
const mainMenuTemplate = [
	{
		label: "File",
		submenu: [
			{
				label: "New",
				click: () => {
					const nnInitializerWindow = new BrowserWindow({
						width: 400,
						height: 200,
						center: true,
						resizable: false,
						movable: false,
						parent: BrowserWindow.getFocusedWindow(),
						autoHideMenuBar: true,
						titleBarStyle: "hidden",
						title: "创建神经网络",
						webPreferences: {
							nodeIntegration: true,
							contextIsolation: false,
						},
					});
					// nnInitializerWindow.webContents.openDevTools();
					nnInitializerWindow.loadFile("src/networkInitializer.html");
				},
			},
			{
				label: "Open",
				click: function () {},
			},
			{
				label: "Open Recently",
				click: function () {},
			},
			{
				type: "separator",
			},
			{
				label: "Export",
				click: () => {
					dialog
						.showSaveDialog(BrowserWindow.getFocusedWindow(), {
							filters: [{ name: "*.py", extensions: ["py"] }],
						})
						.then((r) => {
							if (!r.canceled)
								FileOperator.ExportNetwork(
									BrowserWindow.getFocusedWindow(),
									r.filePath
								);
						});
				},
			},
			{
				type: "separator",
			},
			{
				label: "Quit",
				role: "quit",
			},
		],
	},
	{
		label: "Edit",
		submenu: [
			{ role: "undo" },
			{ role: "redo" },
			{ type: "separator" },
			{ role: "cut" },
			{ role: "copy" },
			{ role: "paste" },
			{ role: "delete" },
			{ type: "separator" },
			{ role: "selectAll" },
		],
	},
	{
		label: "View",
		submenu: [
			{ role: "reload" },
			{ role: "forceReload" },
			{ role: "toggleDevTools" },
			{ type: "separator" },
			{ role: "resetZoom" },
			{ role: "zoomIn" },
			{ role: "zoomOut" },
			{ type: "separator" },
			{ role: "togglefullscreen" },
		],
	},
	{
		label: "Window",
		submenu: [{ role: "minimize" }, { role: "zoom" }, { role: "close" }],
	},
	{
		role: "help",
		submenu: [
			{
				label: "Learn More",
				// click: async () => {
				// 	const { shell } = require("electron");
				// 	await shell.openExternal("https://electronjs.org");
				// },
			},
		],
	},
];

var mainMenu = Menu.buildFromTemplate(mainMenuTemplate);
Menu.setApplicationMenu(mainMenu);

// 右键菜单
const contextMenuTemplate = [
	{ role: "undo" },
	{ role: "redo" },
	{ type: "separator" },
	{ role: "cut" },
	{ role: "copy" },
	{ role: "paste" },
	{ role: "delete" },
	{ type: "separator" },
	{ role: "selectAll" },
];

var contextMenu = Menu.buildFromTemplate(contextMenuTemplate);

// 右键菜单监听
ipcMain.on("showContextMenu", (e, status) => {
	if (status)
		contextMenu.popup({
			window: BrowserWindow.getFocusedWindow(),
		});
});
