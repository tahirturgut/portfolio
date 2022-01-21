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


def heuristicFunction(matrix):       # function to estimate hammer distance to goal state
    cost = 0
    for tube in matrix:
        if len(tube) > 0:
            base = tube[0]      # ball at the very bottom
            j = 1
            while j < len(tube) and tube[j] == tube[j-1]:
                j += 1                      # skip the balls that has the same color with the ball at the very bottom
            while j < len(tube):
                cost += (len(tube)-j)       # remaining balls has to be transferred to another bottle
                j += 1
            cost += (4-len(tube))           # this many balls has to be retrieved from other bottles
    return cost


def solveBallMatrix(matrix):
    frontier = PriorityQueue()
    closed = set()
    frontierSet = set()         # hashset to check whether a state is already in frontier FASTER
    heuristicCost = {matrixToString(matrix): heuristicFunction(matrix)}     # hashmap to retrieve heuristic costs FASTER
    realCost = {matrixToString(matrix): 0}          # hashmap to retrieve real costs FASTER

    cost = heuristicCost[matrixToString(matrix)] + realCost[matrixToString(matrix)]
    frontier.insert(matrix, cost)

    while not frontier.is_empty():
        curr_state = frontier.remove()           # take the state with less total cost

        # this is the expansion part, every possible moves will be implemented and added to frontier, if they are new
        for i in range(len(curr_state)):
            tubeA = curr_state[i]
            for j in range(len(curr_state)):
                if i != j:
                    tubeB = curr_state[j]
                    # it is not necessary to move a full bottle to another empty bottle, check is added
                    if isMoveValid(tubeA, tubeB) and tubeA.count(tubeA[0]) != 4:
                        possible_state = copy.deepcopy(curr_state)
                        possible_state[j].append(possible_state[i].pop())           # move ball to i'th bottle to j'th bottle
                        if goalTest(possible_state):
                            print("Last state of balls:")
                            print(possible_state)
                            return realCost[matrixToString(curr_state)] + 1

                        # if the state is already processed check its cost is reduced or not, else add them into hashmaps
                        if matrixToString(possible_state) in closed:
                            realCost[matrixToString(possible_state)] = min(realCost[matrixToString(possible_state)],
                                                                           (realCost[matrixToString(curr_state)] + 1))
                            heuristicCost[matrixToString(possible_state)] = heuristicFunction(possible_state)
                            continue
                        else:
                            realCost[matrixToString(possible_state)] = realCost[matrixToString(curr_state)] + 1
                            heuristicCost[matrixToString(possible_state)] = heuristicFunction(possible_state)

                        totalCost = heuristicCost[matrixToString(possible_state)] + realCost[matrixToString(possible_state)]

                        # if the state is not in closed nor frontier, it is newly explored. add it to frontier
                        if not (matrixToString(possible_state) in closed or matrixToString(possible_state) in frontierSet):
                            frontier.insert(possible_state, totalCost)

    # no solution case (not enough space to move balls around maybe)
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

        tracemalloc.start()                 # memory trace
        startTime = time.time()             # time trace
        stepCount = solveBallMatrix(inputState)
        endTime = time.time()
        print(tracemalloc.get_traced_memory())
        tracemalloc.stop()

        if stepCount < 0:
            print("No solution")
        else:
            print("Solved in " + str(stepCount) + " moves")
        print("Test", str(i), "takes", endTime - startTime, "seconds with A* search.")
        print("----" + '\n' + "----")