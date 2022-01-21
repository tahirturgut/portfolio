from constraint import *

n = 7
line = list(range(0, n))

initial_grid = [[0, 3, 0, 2, 0, 0, 3],
                [1, 0, 1, 0, 0, 3, 0],
                [0, 3, 0, 2, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0],
                [4, 0, 2, 0, 0, 0, 2],
                [0, 0, 0, 0, 0, 0, 0],
                [2, 0, 0, 3, 0, 3, 0]]

problem = Problem()

# dictionary to keep track of edges that includes a specific node
node_edge = {}
for i in line:
    start = -1
    end = -1
    for j in line:
        if initial_grid[i][j]:
            if start == -1:
                start = j
            else:
                end = j
                # create a variable of an vertical interval
                problem.addVariable('grid[' + str(i) + '][' + str(start) + '-' + str(end) + ']', [0, 1, 2])

                # add that edge to related nodes in the dict
                if (i, start) in node_edge:
                    node_edge[(i, start)].append('grid[' + str(i) + '][' + str(start) + '-' + str(end) + ']')
                else:
                    node_edge[(i, start)] = ['grid[' + str(i) + '][' + str(start) + '-' + str(end) + ']']
                if (i, end) in node_edge:
                    node_edge[(i, end)].append('grid[' + str(i) + '][' + str(start) + '-' + str(end) + ']')
                else:
                    node_edge[(i, end)] = ['grid[' + str(i) + '][' + str(start) + '-' + str(end) + ']']
                start = end

for i in line:
    start = -1
    end = -1
    for j in line:
        if initial_grid[j][i]:
            if start == -1:
                start = j
            else:
                end = j
                # create a variable of an horizontal interval
                problem.addVariable('grid[' + str(start) + '-' + str(end) + '][' + str(i) + ']', [0, 1, 2])

                # add that edge to related nodes in the dict
                if (start, i) in node_edge:
                    node_edge[(start, i)].append('grid[' + str(start) + '-' + str(end) + '][' + str(i) + ']')
                else:
                    node_edge[(start, i)] = ['grid[' + str(i) + '][' + str(start) + '-' + str(end) + ']']
                if (end, i) in node_edge:
                    node_edge[(end, i)].append('grid[' + str(start) + '-' + str(end) + '][' + str(i) + ']')
                else:
                    node_edge[(end, i)] = ['grid[' + str(i) + '][' + str(start) + '-' + str(end) + ']']
                start = end

for i in line:
    for j in line:
        if initial_grid[i][j] != 0:

            # adding constraint for each of the nodes
            # edges related to them, have to add up to that specific value
            problem.addConstraint(ExactSumConstraint(initial_grid[i][j]),
                                  [edge for edge in node_edge[(i, j)]])

print(node_edge)
print("---------------------------------------------------------")

solution = problem.getSolution()

# print the value of edges -print function will be improved until demo:(
for key, value in solution.items():
    print(key, value)
print("-----------------------------------")
