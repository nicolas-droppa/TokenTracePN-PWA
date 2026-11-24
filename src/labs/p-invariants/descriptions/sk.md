---
title: P-invarianty
summary: Nájdi váhy miest, pri ktorých sa vážený súčet tokenov nikdy nezmení.
---

## Cieľ
Pochopiť, čo je P-invariant, ako súvisí s maticou incidencie a čo nám hovorí o správaní siete bez toho, aby sme prechádzali všetky stavy.

## Zadanie
P-invariant je vektor váh miest `y` (jedna váha pre každé miesto), pre ktorý platí:

**yᵀ · C = 0**

kde **C** je matica incidencie. Pre každé dosiahnuteľné značenie `m` je potom vážený súčet `y · m` rovnaký ako na začiatku. Tokeny sa medzi miestami presúvajú, ale ich vážený počet sa zachováva.

Napíš funkciu `p_invariants(net)`, ktorá vráti **bázu minimálnych nezáporných P-invariantov**.

## Kontrakt
```python
def p_invariants(net) -> list[list[int]]:
    ...
```

- Každý invariant je zoznam celých čísel `>= 0` v poradí `net.places` a nesmie byť celý nulový.
- Každý invariant je **minimálny**: neexistuje iný invariant, ktorého nenulové miesta sú jeho vlastnou podmnožinou.
- Každý invariant je vydelený najväčším spoločným deliteľom svojich hodnôt (`[2, 2]` → `[1, 1]`).
- Na poradí invariantov nezáleží. Ak sieť nemá žiadny invariant, vráť `[]`.

## Príklad
Sieť *Lone worker* s miestami `(idle, busy)`:

| | start | finish |
|---|---|---|
| idle | -1 | 1 |
| busy | 1 | -1 |

Výsledok je `[[1, 1]]`: súčet tokenov v `idle` a `busy` je vždy rovnaký, robotník je stále práve v jednom stave.

## Tipy
- Začni maticou incidencie z labu *Matica incidencie*.
- Osvedčený postup je **Farkasov algoritmus**: k matici C pripoj jednotkovú maticu a postupne pre každý prechod kombinuj dvojice riadkov s opačnými znamienkami tak, aby v jeho stĺpci vznikla nula. Riadky s nenulou v tom stĺpci potom zahoď.
- Nakoniec odstráň riadky, ktoré nie sú minimálne, a každý vydeľ NSD (`math.gcd`).
- Invarianty počítame iba z bežných hrán. Pri sieťach s resetovacími alebo inhibičnými hranami zachovanie súčtu nemusí platiť, preto ich v testoch nepoužívame.
