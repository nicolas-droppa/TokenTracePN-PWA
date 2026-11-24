# Reference solution. The net API (net.places, net.arcs...) follows ttpn.py, adjust it when ttpn.py is written.

def incidence_matrix(net):
    places, transitions = net.places, net.transitions
    C = [[0] * len(transitions) for _ in places]

    for arc in net.arcs:
        # Read, inhibitor and reset arcs do not move tokens
        if arc.type != "regular":
            continue

        sign = -1 if arc.direction == "pt" else 1
        C[places.index(arc.place)][transitions.index(arc.transition)] += sign * arc.weight

    return C
