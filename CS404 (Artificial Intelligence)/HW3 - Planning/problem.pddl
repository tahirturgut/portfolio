(define(problem prob)
    (:domain puzzle)
    (:objects   frog
                node11 node12 node13 node14 node15 
                node21 node22 node23 node24 node25 
                node31 node32 node33 node34 node35 
                node41 node42 node43 node44 node45
                node51 node52 node53 node54 node55)
    (:init
        (at frog node42)(visited node42)
        (line node11 node12)(line node11 node13)(line node11 node14)(line node11 node15)
        (line node11 node21)(line node11 node31)(line node11 node41)(line node11 node51)
        
        (line node12 node11)(line node12 node13)(line node12 node14)(line node12 node15)
        (line node12 node22)(line node12 node32)(line node12 node42)(line node12 node52)
        
        (line node13 node11)(line node13 node12)(line node13 node14)(line node13 node15)
        (line node13 node23)(line node13 node33)(line node13 node43)(line node13 node53)
        

        (line node14 node11)(line node14 node12)(line node14 node13)(line node14 node15)
        (line node14 node24)(line node14 node34)(line node14 node44)(line node14 node54)

        (line node15 node11)(line node15 node12)(line node15 node13)(line node15 node14)
        (line node15 node25)(line node15 node35)(line node15 node45)(line node15 node55)

        (line node21 node22)(line node21 node23)(line node21 node24)(line node21 node25)
        (line node21 node11)(line node21 node31)(line node21 node41)(line node21 node51)

        (line node22 node21)(line node22 node23)(line node22 node24)(line node22 node25)
        (line node22 node12)(line node22 node32)(line node22 node42)(line node22 node52)

        (line node23 node21)(line node23 node22)(line node23 node24)(line node23 node25)
        (line node23 node13)(line node23 node33)(line node23 node43)(line node23 node53)

        (line node24 node21)(line node24 node22)(line node24 node23)(line node24 node25)
        (line node24 node14)(line node24 node34)(line node24 node44)(line node24 node54)

        (line node25 node21)(line node25 node22)(line node25 node23)(line node25 node24)
        (line node25 node15)(line node25 node35)(line node25 node45)(line node25 node55)

        (line node31 node32)(line node31 node33)(line node31 node34)(line node31 node35)
        (line node31 node11)(line node31 node21)(line node31 node41)(line node31 node51)

        (line node32 node31)(line node32 node33)(line node32 node34)(line node32 node35)
        (line node32 node12)(line node32 node22)(line node32 node42)(line node32 node52)

        (line node33 node31)(line node33 node32)(line node33 node34)(line node33 node35)
        (line node33 node13)(line node33 node23)(line node33 node43)(line node33 node53)

        (line node34 node31)(line node34 node32)(line node34 node33)(line node34 node35)
        (line node34 node14)(line node34 node24)(line node34 node44)(line node34 node54)

        (line node35 node31)(line node35 node32)(line node35 node33)(line node35 node34)
        (line node35 node15)(line node35 node25)(line node35 node45)(line node35 node55)

        (line node41 node42)(line node41 node43)(line node41 node44)(line node41 node45)
        (line node41 node11)(line node41 node21)(line node41 node31)(line node41 node51)
        
        (line node42 node41)(line node42 node43)(line node42 node44)(line node42 node45)
        (line node42 node12)(line node42 node22)(line node42 node32)(line node42 node52)

        (line node43 node41)(line node43 node42)(line node43 node44)(line node43 node45)
        (line node43 node13)(line node43 node23)(line node43 node33)(line node43 node53)

        (line node44 node41)(line node44 node42)(line node44 node43)(line node44 node45)
        (line node44 node14)(line node44 node24)(line node44 node34)(line node44 node54)

        (line node45 node41)(line node45 node42)(line node45 node43)(line node45 node44)
        (line node45 node15)(line node45 node25)(line node45 node35)(line node45 node55)

        (line node51 node52)(line node51 node53)(line node51 node54)(line node51 node55)
        (line node51 node11)(line node51 node21)(line node51 node31)(line node51 node41)

        (line node52 node51)(line node52 node53)(line node52 node54)(line node52 node55)
        (line node52 node12)(line node52 node22)(line node52 node32)(line node52 node42)

        (line node53 node51)(line node53 node52)(line node53 node54)(line node53 node55)
        (line node53 node13)(line node53 node23)(line node53 node33)(line node53 node43)

        (line node54 node51)(line node54 node52)(line node54 node53)(line node54 node55)
        (line node54 node14)(line node54 node24)(line node54 node34)(line node54 node44)

        (line node55 node51)(line node55 node52)(line node55 node53)(line node55 node54)
        (line node55 node15)(line node55 node25)(line node55 node35)(line node55 node45)
    )
    (:goal
        (and
            (visited node11)
            (visited node12)
            (visited node13)
            (visited node14)
            (not
                (visited node15)
            )
            (not
                (visited node21)
            )
            (visited node22)
            (not
                (visited node23)
            )
            (not
                (visited node24)
            )
            (visited node25)
            (visited node31)
            (visited node32)
            (visited node33)
            (visited node34)
            (not
                (visited node35)
            )
            (visited node41)
            (visited node42)
            (visited node43)
            (visited node44)
            (visited node45)
            (visited node51)
            (visited node52)
            (visited node53)
            (visited node54)
            (visited node55)
        )
    )
)