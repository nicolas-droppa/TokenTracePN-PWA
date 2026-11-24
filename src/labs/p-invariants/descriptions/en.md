---
title: P-Invariants
summary: Find place weights for which the weighted sum of tokens never changes.
---

## Objective

Understand what a P-invariant is, how it relates to the incidence matrix, and what it tells us about the behavior of the net without traversing all states.

## Task

A P-invariant is a vector of place weights `y` (one weight for each place) for which the following holds:

**yᵀ · C = 0**

where **C** is the incidence matrix. For every reachable marking `m`, the weighted sum `y · m` is then the same as at the beginning. Tokens move between places, but their weighted count is conserved.

Write a function `p_invariants(net)` that returns a **basis of minimal non-negative P-invariants**.

## Contract

```python
def p_invariants(net) -> list[list[int]]:
    ...
```

- Each invariant is a list of integers `>= 0` in the order of `net.places` and must not be all zeros.
- Each invariant is **minimal**: there is no other invariant whose non-zero places are a proper subset of its own.
- Each invariant is divided by the greatest common divisor of its values (`[2, 2]` → `[1, 1]`).
- The order of invariants does not matter. If the net has no invariants, return `[]`.

## Example

*Lone worker* net with places `(idle, busy)`:

| | start | finish |
|---|---|---|
| idle | -1 | 1 |
| busy | 1 | -1 |

The result is `[[1, 1]]`: the sum of tokens in `idle` and `busy` is always the same; the worker is always in exactly one state.

## Tips

- Start with the incidence matrix from the *Incidence Matrix* lab.
- A proven approach is **Farkas' algorithm**: append an identity matrix to matrix C and, iteratively for each transition, combine pairs of rows with opposite signs so that a zero is produced in its column. Then discard the rows with a non-zero value in that column.
- Finally, remove rows that are not minimal and divide each by its GCD (`math.gcd`).
- We compute invariants only from normal arcs. For nets with reset or inhibitor arcs, sum conservation might not hold, so we do not use them in tests.