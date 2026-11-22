---
title: Firing Rule
summary: Determine which transitions are enabled and compute the new marking after firing.
---

## Objective
Understand when a transition is enabled and how firing it changes the marking of the net, including read, inhibitor, and reset arcs.

## Task
Write two functions:

- `enabled(net, m)` returns a list of transition IDs that are enabled at marking `m`.
- `fire(net, m, t)` fires transition `t` and returns the new marking.

A marking is always a `tuple` of token counts in the order of `net.places`. The initial marking of the net is in `net.marking`.

A transition `t` is enabled if for every arc from place `p` to `t` with weight `w`, the following holds:

| arc type | condition |
|---|---|
| normal | `m[p] >= w` |
| read | `m[p] >= w` |
| inhibitor | `m[p] < w` |
| reset | unconditional |

Firing transition `t`:

1. remove `w` tokens from every place with a normal input arc,
2. empty every place with a reset arc,
3. add `w` tokens to every place with an output arc.

Read and inhibitor arcs do not change the marking.

## Contract
```python
def enabled(net, m) -> list[str]:
    ...

def fire(net, m, t) -> tuple[int, ...]:
    ...
```

- The order of transitions in the result of `enabled` does not matter.
- Calling `fire` with a transition that is not enabled raises a `ValueError`.
- Do not modify the input marking `m`; return a new `tuple`.

## Example
*Lone worker* net with places `(idle, busy)` and marking `(1, 0)`:

| call | result |
|---|---|
| `enabled(net, (1, 0))` | `["start"]` |
| `fire(net, (1, 0), "start")` | `(0, 1)` |
| `enabled(net, (0, 1))` | `["finish"]` |

## Tips
- You can find the place index using `net.places.index(arc.place)`.
- A `tuple` is immutable. Convert it to a `list`, modify it, and return `tuple(...)` at the end.
- You will also need the `enabled` and `fire` functions in the reachability graph lab.