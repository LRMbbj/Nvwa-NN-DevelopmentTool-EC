const { ipcRenderer } = require("electron");

var editorOptions = { editMode: 0 };

window.onload = () => {
	const propertybar = document.getElementById("propertybar");

	window.addEventListener(
		"contextmenu",
		(e) => {
			if (!document.querySelector("#cy").contains(e.target))
				ipcRenderer.send("showContextMenu", true);
		},
		false
	);

	CytoscapeInit();

	// 绑定数据
	Object.defineProperty(editorOptions, "mode", {
		set: (val) => {
			mode = val;
			propertybar.innerText = val;
		},
		get: () => {
			if (this.mode === undefined) this.mode = 0;
			return this.mode;
		},
	});
};

function OnBtnPropertyMode() {
	editorOptions.editMode = 0;
	eh.disableDrawMode();
}

function OnBtnEditMode() {
	editorOptions.editMode = 1;
	eh.disableDrawMode();
}

function OnBtnConnectMode() {
	editorOptions.editMode = 2;
	eh.enableDrawMode();
}
