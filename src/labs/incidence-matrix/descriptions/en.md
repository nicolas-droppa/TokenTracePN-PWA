---
title: Incidence Matrix
summary: Construct the matrix C = Post − Pre from the net structure.
---

## Objective
Understand how the incidence matrix describes the marking change after firing a transition.

## Task
Write a function `incidence_matrix(net)` that returns the matrix **C**
of dimensions |P| × |T|, where rows are places and columns are transitions in the order from `net.places` and `net.transitions`.

## Contract
```python
def incidence_matrix(net) -> list[list[int]]:
    ...
```

## Example
For the net `p1 → t1 → p2` with weights of 1:

| | t1 |
|---|---|
| p1 | -1 |
| p2 | 1 |

## Tips
- Do not include inhibitor, reset, and read arcs in C.
- Check what `net.arcs` returns.