import time

def BellmanFort(vertices, edges, source):
    distlist = [float("Inf")] * len(vertices)
    distlist[source] = 0
    parents = [-1] * len(vertices)

    for _ in range(len(vertices) - 1):
        for u, v, w in edges:
            if distlist[u] + w < distlist[v]:
                distlist[v] = distlist[u] + w
                parents[v] = u

    return distlist, parents


def main():
    citiesBus = [ "Harem", "Ankara", "Adana", "Eskisehir" ]
    citiesTrain = [ "Istanbul-YHT", "Ankara-YHT", "Adana-YHT", "Eskisehir-YHT" ]

    busRoads = [ ["Harem", "Ankara", 8], ["Adana", "Ankara", 14],["Harem", "Eskisehir", 48] ]

    trainRoads = [["Istanbul-YHT", "Ankara-YHT", 100], ["Istanbul-YHT", "Adana-YHT", 2],
                  ["Adana-YHT", "Ankara-YHT", 4], ["Adana-YHT", "Eskisehir-YHT", 40] ]
    internalRoads = [ ["Harem","Istanbul-YHT", 1], ["Ankara","Ankara-YHT", 1],
                      ["Adana","Adana-YHT", 1],["Eskisehir","Eskisehir-YHT", 1]]

    verticesNum = {}
    verticesName = {}
    i = 0
    for node in citiesBus:
        verticesNum[node] = i
        verticesName[i] = node
        i += 1
    for node in citiesTrain:
        verticesNum[node] = i
        verticesName[i] = node
        i += 1

    edges = []
    for road in busRoads:
        edges.append([verticesNum[road[0]], verticesNum[road[1]], road[2]])
        edges.append([verticesNum[road[1]], verticesNum[road[0]], road[2]])
    for road in trainRoads:
        edges.append([verticesNum[road[0]], verticesNum[road[1]], road[2]])
        edges.append([verticesNum[road[1]], verticesNum[road[0]], road[2]])
    for road in internalRoads:
        edges.append([verticesNum[road[0]], verticesNum[road[1]], road[2]])
        edges.append([verticesNum[road[1]], verticesNum[road[0]], road[2]])

    start = time.perf_counter()
    distlist, parents = BellmanFort(verticesName.keys(), edges, 0)
    end = time.perf_counter()
    print(f"Runtime of the program is {end - start}")

    routeTo = {}
    for i in range(1, len(verticesName)):
        temp = i
        destination = [temp]
        while parents[temp] != 0:
            temp = parents[temp]
            destination += [temp]
        routeTo[i] = [0] + destination[::-1]

    for i in range(1, len(verticesName)):
        if distlist[i] == float("inf"):
            print("There is no way to", verticesName[i])
        else:
            print("In", distlist[i], "hours, road to", verticesName[i] + ":")
            for elm in routeTo[i]:
                print(verticesName[elm], end="-->")
            print("")

    if len(verticesName) < 2:
        print("There is no enough city or station!")


if __name__ == "__main__":
    main()
