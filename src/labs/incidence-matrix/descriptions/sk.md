---
title: Matica incidencie
summary: Zostav maticu C = Post − Pre zo štruktúry siete.
---

## Cieľ
Pochopiť, ako matica incidencie popisuje zmenu značenia po odpálení prechodu.

## Zadanie
Napíš funkciu `incidence_matrix(net)`, ktorá vráti maticu **C**
s rozmermi |P| × |T|, kde riadky sú miesta a stĺpce prechody v poradí z `net.places` a `net.transitions`.

## Kontrakt
```python
def incidence_matrix(net) -> list[list[int]]:
    ...
```

## Príklad
Pre sieť `p1 → t1 → p2` s váhami 1:

| | t1 |
|---|---|
| p1 | -1 |
| p2 | 1 |

## Tipy
- Inhibičné, resetovacie a čítacie hrany do C nezapočítavaj.
- Zisti si, čo vracia `net.arcs`.