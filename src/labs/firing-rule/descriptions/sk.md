---
title: Pravidlo odpálenia
summary: Zisti, ktoré prechody sú spustiteľné, a vypočítaj nové značenie po odpálení.
---

## Cieľ
Pochopiť, kedy je prechod spustiteľný a ako jeho odpálenie zmení značenie siete, vrátane čítacích, inhibičných a resetovacích hrán.

## Zadanie
Napíš dve funkcie:

- `enabled(net, m)` vráti zoznam id prechodov, ktoré sú pri značení `m` spustiteľné.
- `fire(net, m, t)` odpáli prechod `t` a vráti nové značenie.

Značenie je vždy `tuple` počtov tokenov v poradí `net.places`. Počiatočné značenie siete je v `net.marking`.

Prechod `t` je spustiteľný, ak pre každú hranu z miesta `p` do `t` s váhou `w` platí:

| typ hrany | podmienka |
|---|---|
| bežná | `m[p] >= w` |
| čítacia | `m[p] >= w` |
| inhibičná | `m[p] < w` |
| resetovacia | bez podmienky |

Odpálenie prechodu `t`:

1. z každého miesta s bežnou vstupnou hranou odober `w` tokenov,
2. každé miesto s resetovacou hranou vyprázdni,
3. do každého miesta s výstupnou hranou pridaj `w` tokenov.

Čítacia a inhibičná hrana značenie nemenia.

## Kontrakt
```python
def enabled(net, m) -> list[str]:
    ...

def fire(net, m, t) -> tuple[int, ...]:
    ...
```

- Na poradí prechodov vo výsledku `enabled` nezáleží.
- `fire` s prechodom, ktorý nie je spustiteľný, vyhodí `ValueError`.
- Vstupné značenie `m` nemeň, vráť nový `tuple`.

## Príklad
Sieť *Lone worker* s miestami `(idle, busy)` a značením `(1, 0)`:

| volanie | výsledok |
|---|---|
| `enabled(net, (1, 0))` | `["start"]` |
| `fire(net, (1, 0), "start")` | `(0, 1)` |
| `enabled(net, (0, 1))` | `["finish"]` |

## Tipy
- Index miesta zistíš cez `net.places.index(arc.place)`.
- `tuple` sa nedá meniť. Prevedieš ho na `list`, upravíš a na konci vrátiš `tuple(...)`.
- Funkcie `enabled` a `fire` budeš potrebovať aj v labe o grafe dosiahnuteľnosti.
