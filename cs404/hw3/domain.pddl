(define(domain puzzle)
    (:predicates
        (at ?frog ?node)
        (visited ?node)
        (line ?node1 ?node2)
    )
    (:action jump
        :parameters (?from ?to ?frog)
        :precondition
            (and
                (at ?frog ?from)
                (not
                    (visited ?to)
                )
                (line ?from ?to)
            )
        :effect
            (and
                (visited ?to)
                (at ?frog ?to)
                (not
                    (at ?frog ?from)    
                )
            )
    )
)