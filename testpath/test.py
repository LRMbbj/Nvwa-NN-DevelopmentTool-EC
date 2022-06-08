from torch import nn

class Model(nn.Module):
	def __init__(self):
		super(Model, self).__init__()

	def forward(self, x):
		output = x

		return output

if __name__ == '__main__':
	model = Model()
	print(model)