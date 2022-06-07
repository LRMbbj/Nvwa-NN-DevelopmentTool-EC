const ACTIVATIONFUNC = require("../json/activation-functions.json");
const fs = require("fs");
const MODELTEMPLETEURL = "./src/module/model-templete.txt";

const sum = (arr) => {
	return eval(arr.join("+"));
};

class Layer {
	constructor(root) {
		this.root = root;
	}

	GenerateCode() {
		throw Error("applying base class generator");
	}

	get size() {
		throw Error("applying base function");
	}
}

class Layer_Input extends Layer {
	constructor(root, para) {
		super(root);
		this.__size = para.size;
	}

	get size() {
		return this.__size;
	}
}

class Layer_Output extends Layer {
	constructor(root, para) {
		super(root);
		this.__size = para.size;
	}

	get size() {
		return this.__size;
	}
}

class Layer_FullConnected extends Layer {
	constructor(root, para) {
		super(root);
		this.nodeNum = para.nodeNum;
		this.ActivationFunc = para.ActivationFunc;
	}

	GenerateCode() {
		console.log(this.root.size);
		if (this.ActivationFunc == "None")
			return {
				layerTag: "fullconnected",
				defination: `nn.Linear(${this.root.size}, ${this.nodeNum})`,
			};
		else {
			return {
				layerTag: "fullconnected",
				defination: `nn.Sequential(\n\t\t\tnn.Linear(${
					this.root.size
				}, ${this.nodeNum}),\n\t\t\t${
					ACTIVATIONFUNC[this.ActivationFunc]
				})`,
			};
		}
	}

	get size() {
		return this.nodeNum;
	}
}

class Layer_Convolutional extends Layer {
	constructor(root, para) {
		super(root);
		this.in_channel = para.in_channel;
		this.out_channel = para.out_channel;
		this.kernel_size = para.kernel_size;
		this.stride = para.stride;
		this.padding = para.padding;
		this.ActivationFunc = para.ActivationFunc;

		this.__size = null;
	}

	GenerateCode(input_size) {
		if (this.ActivationFunc == "None")
			return {
				layerTag: "conv",
				defination: `nn.Conv2d(${this.in_channel}, ${this.out_channel}, ${this.kernel_size}, ${this.stride}, ${this.padding})`,
			};
		else {
			return {
				layerTag: "conv",
				defination: `nn.Sequential(	nn.Conv2d(${this.in_channel}, ${
					this.out_channel
				}, ${this.kernel_size}, ${this.stride}, ${this.padding})
				${ACTIVATIONFUNC[this.ActivationFunc]})`,
			};
		}
	}

	get size() {
		if (this.__size == null) {
			if (this.root.size.length != 3) throw Error("Only accept 2D data");
			var out = [0, 0];
			out[0] =
				(this.root.size[1] - this.kernel_size + 2 * this.padding) /
				this.stride;
			out[1] =
				(this.root.size[2] - this.kernel_size + 2 * this.padding) /
				this.stride;
			this.__size = [this.out_channel, out[0], out[1]];
		}
		return this.__size;
	}
}

class Layer_Flatten extends Layer {
	constructor(root, para) {
		super(root);
		this.__size = null;
	}

	GenerateCode() {
		return {
			layerTag: "flatten",
			defination: `nn.Flatten()`,
		};
	}

	get size() {
		if (this.__size == null) this.__size = sum(this.root.size);

		return this.__size;
	}
}

const LAYERCLASSES = {
	FullConnected: Layer_FullConnected,
	Convolutional: Layer_Convolutional,
	Flatten: Layer_Flatten,
};

class CodeGenerator {
	constructor(networkjson) {
		this.layers = [];

		var last_layer = null;

		this.MODELTEMPLETE = fs.readFileSync(MODELTEMPLETEURL, "utf-8");

		var layerObject, lastLayerObject;
		// 生成层对象
		networkjson.forEach((layerData) => {
			switch (layerData.type) {
				case "Input":
					layerObject = new Layer_Input(
						lastLayerObject,
						layerData.para
					);
					this.input_layer = layerObject;
					break;
				case "Output":
					layerObject = new Layer_Output(
						lastLayerObject,
						layerData.para
					);
					this.output_layer = layerObject;
					break;

				default:
					layerObject = new LAYERCLASSES[layerData.type](
						lastLayerObject,
						layerData.para
					);
					this.layers.push(layerObject);
					break;
			}
			lastLayerObject = layerObject;
		});
	}

	GenerateCode() {
		var defination = "",
			forward = "";
		var layerUsed = {};
		this.layers.forEach((layer) => {
			var code = layer.GenerateCode();

			if (layerUsed[code.layerTag] == undefined)
				layerUsed[code.layerTag] = 0;
			else layerUsed[code.layerTag] += 1;
			defination += `\t\tself.${code.layerTag}_${
				layerUsed[code.layerTag]
			} = ${code.defination}\n`;
			forward += `\t\toutput = self.${code.layerTag}_${
				layerUsed[code.layerTag]
			}(output)\n`;
		});

		return this.MODELTEMPLETE.replace("<defination>", defination).replace(
			"<forward>",
			forward
		);
	}
}

module.exports = CodeGenerator;
