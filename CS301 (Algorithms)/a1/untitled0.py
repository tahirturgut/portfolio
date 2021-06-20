def lcs(X,Y,i,j):
    if (i == 0 or j == 0):
        return 0
    elif X[i-1] == Y[j-1]:
        return 1 + lcs(X,Y,i-1,j-1)
    else:
        return max(lcs(X,Y,i,j-1),lcs(X,Y,i-1,j))

# def lcs(X,Y,i,j):
#     if c[i][j] >= 0:
#         return c[i][j]
#     if (i == 0 or j == 0):
#         c[i][j] = 0
#     elif X[i-1] == Y[j-1]:
#         c[i][j] = 1 + lcs(X,Y,i-1,j-1)
#     else:
#         c[i][j] = max(lcs(X,Y,i,j-1),lcs(X,Y,i-1,j))
#     return c[i][j]

# from timeit import default_timer as timer
#
# start_time = timer()
# X = 'aaaaaaaaaaaaaaa'
# Y = 'bbbbbbbbbbbbbbb'
#
# lX = len(X)
# lY = len(Y)
# #uncomment the next line to initialize c (for memoization)
# #c = [[-1 for k in range(lY+1)] for l in range(lX+1)]
# print(lX, lY)
# print ("Length of LCS is ", lcs(X,Y,lX,lY))
# end_time: float = timer()
# print("--- %s seconds ---" % (end_time - start_time))

from timeit import default_timer as timer

arr = []
with open('input.txt') as f:
  lines = f.readlines()
  i, j = 3, 6
  while i < 181:
    X = lines[i].strip()
    Y = lines[j].strip()

    print(X, Y)

    start_time = timer()
    lX = len(X)
    lY = len(Y)

    print(lX, lY)
    print ("Length of LCS is ", lcs(X,Y,lX,lY))
    end_time: float = timer()
    arr.append(end_time - start_time)

    i += 6
    j += 6



import statistics

print(len(arr))
print("mean of the experiment:", sum(arr)/30)
print("std. deviation:", statistics.stdev(arr))