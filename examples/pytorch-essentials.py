"""Reproduce the PyTorch Essentials labs. Run with Python + PyTorch; CPU only."""
import json
import torch
from torch import nn


def train(lr=0.1, accumulate=False, steps=60):
    x = torch.tensor([[-2.], [-1.], [0.], [1.], [2.]])
    y = 2 * x + 1
    model = nn.Linear(1, 1)
    with torch.no_grad():
        model.weight.zero_()
        model.bias.zero_()
    optimizer = torch.optim.SGD(model.parameters(), lr=lr)
    history = []
    for i in range(steps):
        if not accumulate:
            optimizer.zero_grad(set_to_none=True)
        loss = nn.functional.mse_loss(model(x), y)
        loss.backward()
        optimizer.step()
        with torch.no_grad():
            mse = nn.functional.mse_loss(model(x), y).item()
        history.append(dict(n=i+1, w=model.weight.item(), b=model.bias.item(), loss=mse))
        if mse > 1e6:
            break
    return history


def verify():
    prediction = torch.tensor([[1.], [2.], [3.]])
    target = torch.tensor([1., 2., 3.])
    assert (prediction - target).shape == (3, 3)
    assert torch.equal(prediction - target.unsqueeze(1), torch.zeros(3, 1))
    w = torch.tensor(1., requires_grad=True)
    b = torch.tensor(1., requires_grad=True)
    ((w * 2 + b - 5) ** 2).backward()
    assert (w.grad.item(), b.grad.item()) == (-8., -4.)
    good = train()
    assert abs(good[0]['loss'] - 3.52) < 1e-5
    assert good[-1]['loss'] < 1e-9
    assert train(0.6)[-1]['loss'] > 1e6
    return {f'{lr}:{acc}': train(lr, acc) for lr in (0.01, 0.1, 0.6) for acc in (False, True)}


if __name__ == '__main__':
    histories = verify()
    print(json.dumps({'torch': torch.__version__, 'runs': histories}, indent=2))
