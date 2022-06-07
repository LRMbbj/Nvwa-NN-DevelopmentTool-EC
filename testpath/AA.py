from torch import nn

class Model(nn.Module):
	def __init__(self):
		super(Model, self).__init__()
		self.fullconnected_0 = nn.Sequential(
			nn.Linear(2000, 1000),
			nn.ReLU())
		self.fullconnected_1 = nn.Sequential(
			nn.Linear(1000, 20),
			nn.ReLU())

	def forward(self, x):
		output = x
		output = self.fullconnected_0(output)
		output = self.fullconnected_1(output)

		return output

if __name__ == '__main__':
	model = Model()
	print(model)