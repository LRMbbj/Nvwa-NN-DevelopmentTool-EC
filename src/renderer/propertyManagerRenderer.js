const EleGen = {
	Array: (key) => {
		res = document.createElement("input");
		res.name = key;
		res.type = "text";
		res.setAttribute("argType", "Array");
		return res;
	},
	Int: (key) => {
		res = document.createElement("input");
		res.name = key;
		res.type = "number";
		res.setAttribute("argType", "Int");
		return res;
	},
	List: (key) => {
		res = document.createElement("select");
		res.name = key;
		res.setAttribute("argType", "List");
		var listName = "_" + key + "List";

		items = LAYERTEMPLETE[currentObj.data("type")];
		items = items[listName];

		for (var i in items) {
			optn = document.createElement("option");
			optn.innerHTML = items[i];
			optn.value = items[i];
			res.appendChild(optn);
		}
		return res;
	},
	Fixed: (key) => {
		res = document.createElement("input");
		res.name = key;
		res.type = "text";
		res.setAttribute("argType", "Array");
		res.setAttribute("disabled", "disabled");
		return res;
	},
	ActivationFunc: (key) => {
		res = document.createElement("select");
		res.name = key;
		res.setAttribute("argType", "ActivationFunc");
		var items = ACTIVATIONFUNCTIONS;

		for (var i in items) {
			optn = document.createElement("option");
			optn.innerHTML = items[i];
			optn.value = items[i];
			res.appendChild(optn);
		}
		return res;
	},
};

var currentObj = null;

const AddLabel = (text) => {
	label = document.createElement("label");
	label.innerHTML = text;
	label.setAttribute("class", "propertyLabel");
	propertyArea.appendChild(label);
};

const AddData = (text) => {
	label = document.createElement("label");
	label.innerHTML = text;
	label.setAttribute("class", "propertyData");
	propertyArea.appendChild(label);
};

function ShowProperty(obj) {
	const propertyArea = document.getElementById("propertyArea");

	propertyArea.innerHTML = "";
	currentObj = obj;

	AddLabel("ID");
	AddData(currentObj.data("id"));
	propertyArea.appendChild(document.createElement("br"));
	AddLabel("LayerType");
	AddData(currentObj.data("type"));
	propertyArea.appendChild(document.createElement("br"));

	parameters = LAYERTEMPLETE[obj.data("type")];
	for (const key in parameters) {
		if (key[0] == "_") continue;

		AddLabel(key);

		valueBox = EleGen[parameters[key]](key);
		valueBox.value = obj.data("layerPara")[key];
		valueBox.onchange = SetProperty;
		valueBox.setAttribute("class", "propertyData");
		propertyArea.appendChild(valueBox);

		propertyArea.appendChild(document.createElement("br"));
	}
}

function SetProperty(dom) {
	layerPara = currentObj.data("layerPara");

	var data = dom.target.value;

	switch (dom.target.getAttribute("argType")) {
		case "Array":
			data = data.split(/[,\s]/);
			break;

		default:
			break;
	}

	layerPara[dom.target.name] = data;
	ShowProperty(currentObj);
}
