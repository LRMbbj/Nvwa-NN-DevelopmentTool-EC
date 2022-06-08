from torch import nn

class Model(nn.Module):
	def __init__(self):
		super(Model, self).__init__()
		self.conv_0 = nn.Sequential(	nn.Conv2d(3, 64, 3, 1, 1)，
				nn.ReLU())
		self.flatten_0 = nn.Flatten()
		self.fullconnected_0 = nn.Sequential(
			nn.Linear(3211264, 1000),
			nn.ReLU())

	def forward(self, x):
		output = x
		output = self.conv_0(output)
		output = self.flatten_0(output)
		output = self.fullconnected_0(output)

		return output

if __name__ == '__main__':
	model = Model()
	print(model)