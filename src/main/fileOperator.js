const { ipcMain, dialog } = require("electron");

const CodeGenerate = require("../module/code-generator");
const fs = require("fs");

const FileOperator = {
	ExportNetwork: function (mainWindow, path) {
		// 获取网络结构json
		mainWindow.webContents.send("ExportNetwork", "ExportNetwork");
		ipcMain.once("SendNNStructure", (e, msg) => {
			if (msg.Available) {
				var generator = new CodeGenerate(msg.NeuralNetwork);
				var output_str = generator.GenerateCode();
				fs.writeFile(path, output_str, (e) => {
					if (e != null) throw Error(e);
				});
			} else {
				dialog.showErrorBox(
					"Export Failed",
					"Network Structure Illegal!"
				);
			}
		});
	},
};

module.exports = FileOperator;
