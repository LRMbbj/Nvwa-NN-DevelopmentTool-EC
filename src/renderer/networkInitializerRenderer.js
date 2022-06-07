const { ipcRenderer } = require("electron");

window.$ = window.jQuery = require("jquery");

var data = {
	inputLayerSize: "",
	outputLayerSize: "",
};

function Submit(e) {
	data.inputLayerSize = document
		.getElementById("inputLayerSize")
		.value.split(/[,\s]/);
	data.outputLayerSize = document
		.getElementById("outputLayerSize")
		.value.split(/[,\s]/);
	console.log(data);
	ipcRenderer.send("RendererToMainWindowMsg", {
		e: "NewNetwork",
		data: data,
	});
	window.close();
}

function Cancel(e) {
	window.close();
}
