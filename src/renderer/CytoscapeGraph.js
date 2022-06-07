const cytoscape = require("cytoscape");
const navigator = require("cytoscape-navigator");
const edgehandles = require("cytoscape-edgehandles");
const styleFileUrl = "../src/json/cytoscape-graph-style.json";

var cy, eh;

const LayerType = ["Input", "Output", "FullConnected", "Convolutional"];

function CytoscapeInit() {
	// 读取外部样式表
	$.ajax({
		url: styleFileUrl,
		type: "GET",
		dataType: "json",
		success: (data) => {
			cy.style(data.style);
		},
	});

	cy = cytoscape({
		container: document.getElementById("cy"), // container to render in
		wheelSensitivity: 0.2,
	});

	// 注册导航器

	var navigatorOptions = {
		container: "#nav",
		viewLiveFramerate: 0,
		thumbnailEventFramerate: 30,
		thumbnailLiveFramerate: false,
		dblClickDelay: 200,
		removeCustomContainer: false,
		rerenderDelay: 25,
	};

	cy.navigator(navigatorOptions); // get navigator instance

	// 注册边缘节点连接

	var defaults = {
		canConnect: function (sourceNode, targetNode) {
			// whether an edge can be created between source and target
			return (
				!sourceNode.same(targetNode) &&
				!sourceNode.neighborhood("node").contains(targetNode) &&
				!targetNode.neighborhood("node").contains(sourceNode) &&
				targetNode.data("type") != "Input" &&
				sourceNode.data("type") != "Output" &&
				targetNode.incomers().empty()
			); // e.g. disallow loops
		},
		edgeParams: function (sourceNode, targetNode) {
			// for edges between the specified source and target
			// return element object to be passed to cy.add() for edge
			return {};
		},
		hoverDelay: 150, // time spent hovering over a target node before it is considered selected
		snap: false, // when enabled, the edge can be drawn by just moving close to a target node (can be confusing on compound graphs)
		snapThreshold: 50, // the target node must be less than or equal to this many pixels away from the cursor/finger
		snapFrequency: 15, // the number of times per second (Hz) that snap checks done (lower is less expensive)
		noEdgeEventsInDraw: false, // set events:no to edges during draws, prevents mouseouts on compounds
		disableBrowserGestures: true, // during an edge drawing gesture, disable browser gestures such as two-finger trackpad swipe and pinch-to-zoom
	};

	eh = cy.edgehandles(defaults);
	eh.enable();

	CyEventBinding();
}

function CyEventBinding() {
	cy.on("select", "node", (e) => {
		ShowProperty(e.target);
	});

	cy.on("dbltap", 'node[type != "Input"][type != "Output"]', (e) => {
		if (editorOptions.editMode == 1) {
			e.target.remove();
		}
	});

	cy.on("dbltap", "edge", (e) => {
		if (editorOptions.editMode == 2) {
			e.target.remove();
		}
	});

	// 新建网络
	ipcRenderer.on("NewNetwork", (e, msg) => {
		RemoveAll();
		CreateNetwork(msg.inputLayerSize, msg.outputLayerSize);
	});

	// 导出网络
	ipcRenderer.on("ExportNetwork", (e, msg) => {
		// 生成网络架构
		var nn = { Available: IsAvailable(cy), NeuralNetwork: ExportNetwork() };
		ipcRenderer.send("SendNNStructure", nn);
	});
}

function RemoveAll() {
	cy.remove("node");
}

function CreateLayer(type, layerPara = {}, pos = { x: 0, y: 0 }, id = null) {
	layer = {
		group: "nodes",
		data: {
			id: id,
			type: type,
			layerPara: layerPara,
		},
		position: pos,
	};

	return cy.add([layer]);
}

function CreateNetwork(inputLayerSize, outputLayerSize) {
	inputLayer = CreateLayer(
		"Input",
		{ size: inputLayerSize },
		{ x: 0, y: 0 },
		"input"
	);
	outputLayer = CreateLayer(
		"Output",
		{ size: outputLayerSize },
		{ x: 0, y: 200 },
		"output"
	);

	cy.add([
		{
			group: "edges",
			data: {
				source: inputLayer.data("id"),
				target: outputLayer.data("id"),
			},
		},
	]);
}

function ExportNetwork() {
	var layerEles = cy
		.elements()
		.dfs({
			roots: "#input",
		})
		.path.nodes();

	var layerCollection = [];

	layerEles.forEach((ele) => {
		layerCollection.push({
			type: ele.data("type"),
			para: ele.data("layerPara"),
		});
	});

	return layerCollection;
}

function IsAvailable(cy) {
	return cy
		.elements()
		.dfs({
			roots: "#input",
		})
		.path.nodes()
		.contains(cy.$("#output"));
}
