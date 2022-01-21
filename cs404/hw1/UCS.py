import heapq
import copy
import time
import tracemalloc

# Tahir Turgut - 27035


class PriorityQueue:                # class to call heapq functions more easily

    def __init__(self):
        self._queue = []
        self._index = 0

    def insert(self, item, priority):
        heapq.heappush(self._queue, (priority, self._index, item))
        self._index += 1

    def remove(self):
        return heapq.heappop(self._queue)[-1]

    def is_empty(self):
        return len(self._queue) == 0


def goalTest(matrix):             # function to check goal test
    for tube in matrix:
        if len(tube) > 0:
            if len(tube) < 4:             # a bottle should be either full or empty in goal test
                return False
            elif tube.count(tube[0]) != 4:  # ball count with same color is not 4
                return False
    return True


def isMoveValid(tubeA, tubeB):          # function to check whether a move is valid or not
    if len(tubeA) == 0 or len(tubeB) == 4:     # no balls in A, or B is full
        return False

    if len(tubeB) == 0:                     # when no balls in bottle, every color can be carried
        if tubeA.count(tubeA[0]) == len(tubeA):  # no need to carry same color bottle to an empty bottle
            return False
        return True

    if tubeA[-1] == tubeB[-1]:          # whether the very top of the bottles are same or not
        return True

    return False


def matrixToString(matrix):         # function to transform matrix into string so that they can be hashed
    tubes = []
    for tube in matrix:
        tubes.append(','.join(tube))
    return ';'.join(tubes)


def solveBallMatrix(matrix):
    frontier = PriorityQueue()
    reached = set()
    realCost = {matrixToString(matrix): 0}      # this hashmap traces the cost to reach a specific state

    frontierSet = set()
    frontier.insert(matrix, realCost[matrixToString(matrix)])

    while not frontier.is_empty():
        curr_state = frontier.remove()               # take the frontier with the less cost SO FAR
        if matrixToString(curr_state) in reached:      # if the state is already processed
            continue
        reached.add(matrixToString(curr_state))        # mark the state as processed

        # expansion part, make ALL of the possible valid moves and add that states to frontier
        for i in range(len(curr_state)):
            tubeA = curr_state[i]
            for j in range(len(curr_state)):         # check each combination of tubes to make a move
                if i != j:
                    tubeB = curr_state[j]
                    if isMoveValid(tubeA, tubeB) and tubeA.count(tubeA[0]) != 4:
                        possible_state = copy.deepcopy(curr_state)
                        possible_state[j].append(possible_state[i].pop())           # child state derived via move
                        if goalTest(possible_state):
                            print("Last state of balls:")
                            print(possible_state)
                            return realCost[matrixToString(curr_state)] + 1        # if it is the goal state

                        # if that state is already processed, check whether there is a path that costs less to that state
                        if matrixToString(possible_state) in reached:
                            realCost[matrixToString(possible_state)] = min(realCost[matrixToString(possible_state)],
                                                                       (realCost[matrixToString(curr_state)] + 1))
                        else:
                            realCost[matrixToString(possible_state)] = realCost[matrixToString(curr_state)] + 1

                        # check whether this state is already frontier, if it is not add it to frontier
                        if not matrixToString(possible_state) in frontierSet:
                            frontier.insert(possible_state, realCost[matrixToString(possible_state)])
                            frontierSet.add(matrixToString(possible_state))

    # no solution case
    return -1


if __name__ == "__main__":

    # process the test files (txt)
    for i in range(0, 8):
        file = open('test' + str(i) + '.txt', 'r')
        lines = file.readlines()
        f, e = [int(x) for x in lines[0].split(',')]
        inputState = []
        for j in range(1, f+1):
            line = lines[j].rstrip('\n')
            inputState.append(line.split(','))
        for k in range(e):
            inputState.append([])

        print("Initial state of balls:")
        print(inputState)
        print("--")

        tracemalloc.start()            # memory trace
        startTime = time.time()         # time trace
        stepCount = solveBallMatrix(inputState)
        endTime = time.time()
        print(tracemalloc.get_traced_memory())
        tracemalloc.stop()

        if stepCount < 0:
            print("No solution")
        else:
            print("Solved in " + str(stepCount) + " moves")
        print("Test", str(i), "takes", endTime - startTime, "seconds with UCS.")
        print("----" + '\n' + "----")