---
title: Graf dosiahnuteľnosti
summary: Preskúmaj všetky dosiahnuteľné značenia siete a prechody medzi nimi.
---

## Cieľ
Pochopiť, ako zo siete a jej počiatočného značenia vzniká graf všetkých dosiahnuteľných stavov a čo z neho vieme vyčítať (uviaznutie, ohraničenosť, cykly).

## Zadanie
Napíš funkciu `reachability_graph(net, limit=1000)`, ktorá vráti graf dosiahnuteľnosti:

- **uzly** sú dosiahnuteľné značenia (`tuple` v poradí `net.places`),
- **hrana** `(i, t, j)` znamená, že odpálením prechodu `t` zo značenia `markings[i]` vznikne značenie `markings[j]`.

Prvé značenie v zozname je vždy počiatočné (`net.marking`). Ak by značení bolo viac ako `limit`, sieť je pravdepodobne neohraničená a funkcia vyhodí `OverflowError`.

## Kontrakt
```python
def reachability_graph(net, limit=1000) -> dict:
    ...
    return {
        "markings": [...],        # list[tuple[int, ...]]
        "edges": [(i, t, j), ...] # i, j = indexy do markings, t = id prechodu
    }
```

- `markings[0]` je počiatočné značenie, ostatné poradie je ľubovoľné.
- Porovnáva sa ako graf: rovnaká množina značení a rovnaké hrany medzi nimi. Konkrétne indexy sa môžu líšiť.
- Každé značenie je v zozname iba raz.

## Príklad
Sieť *Lone worker* s miestami `(idle, busy)` a značením `(1, 0)`:

```python
{
    "markings": [(1, 0), (0, 1)],
    "edges": [(0, "start", 1), (1, "finish", 0)],
}
```

## Tipy
- Použi `enabled` a `fire` z labu *Pravidlo odpálenia*. Skopíruj ich nad svoju funkciu.
- Prehľadávanie do šírky: front značení na spracovanie (`collections.deque`) a slovník `značenie → index`, aby si to isté značenie nepridal dvakrát.
- Značenie je `tuple`, takže môže byť priamo kľúčom v slovníku.
- Uviaznutie (deadlock) je značenie, z ktorého nevedie žiadna hrana.
