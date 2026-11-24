---
title: Reachability Graph
summary: Explore all reachable markings of the net and the transitions between them.
---

## Objective
Understand how the graph of all reachable states is generated from a net and its initial marking, and what can be deduced from it (deadlocks, boundedness, cycles).

## Task
Write a function `reachability_graph(net, limit=1000)` that returns the reachability graph:

- **nodes** are reachable markings (`tuple` in the order of `net.places`),
- an **edge** `(i, t, j)` means that firing transition `t` from marking `markings[i]` results in marking `markings[j]`.

The first marking in the list is always the initial one (`net.marking`). If there are more markings than `limit`, the net is likely unbounded and the function raises an `OverflowError`.

## Contract
```python
def reachability_graph(net, limit=1000) -> dict:
    ...
    return {
        "markings": [...],        # list[tuple[int, ...]]
        "edges": [(i, t, j), ...] # i, j = indices into markings, t = transition ID
    }
```

- `markings[0]` is the initial marking; the remaining order is arbitrary.
- Compared as a graph: the same set of markings and the same edges between them. Specific indices may differ.
- Each marking appears in the list only once.

## Example
*Lone worker* net with places `(idle, busy)` and marking `(1, 0)`:

```python
{
    "markings": [(1, 0), (0, 1)],
    "edges": [(0, "start", 1), (1, "finish", 0)],
}
```

## Tips
- Use `enabled` and `fire` from the *Firing Rule* lab. Copy them above your function.
- Breadth-first search: a queue of markings to process (`collections.deque`) and a dictionary `marking → index` so you don't add the same marking twice.
- A marking is a `tuple`, so it can be used directly as a dictionary key.
- A deadlock is a marking with no outgoing edges.