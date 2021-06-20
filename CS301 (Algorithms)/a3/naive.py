import copy
import time

graph = {

}


def shortestPath(visited, source, target, graph, path):
    if source == target:
        return [path + [target], 0]

    unvisited = graph[source].keys() - visited
    if len(unvisited) == 0:
        return [path, float("inf")]

    results = []
    paths = []
    for vertex in unvisited:
        temp_visited = copy.deepcopy(visited)
        temp_visited.append(vertex)
        answers = shortestPath(temp_visited, vertex, target, graph, path)
        results.append(graph[source][vertex] + answers[1])
        paths.append(answers[0])

    return [paths[results.index(min(results))] + [source], min(results)]

    citiesBus = [ "Harem", "Ankara", "Adana", "Eskisehir" ]
    citiesTrain = [ "Istanbul-YHT", "Ankara-YHT", "Adana-YHT", "Eskisehir-YHT" ]

    busRoads = [ ["Harem", "Ankara", 8], ["Adana", "Ankara", 14],["Harem", "Eskisehir", 48] ]

    trainRoads = [["Istanbul-YHT", "Ankara-YHT", 100], ["Istanbul-YHT", "Adana-YHT", 2],
                  ["Adana-YHT", "Ankara-YHT", 4], ["Adana-YHT", "Eskisehir-YHT", 40] ]
    internalRoads = [ ["Harem","Istanbul-YHT", 1], ["Ankara","Ankara-YHT", 1],
                      ["Adana","Adana-YHT", 1],["Eskisehir","Eskisehir-YHT", 1]]

def main():
    vertices = [ "Harem", "Ankara", "Adana", "Eskisehir", "Istanbul-YHT", "Ankara-YHT", "Adana-YHT", "Eskisehir-YHT" ]
    for vertex in vertices:
        graph[vertex] = {}


    edges = [ ["Harem", "Ankara", 8], ["Adana", "Ankara", 14],["Harem", "Eskisehir", 48],
              ["Istanbul-YHT", "Ankara-YHT", 100], ["Istanbul-YHT", "Adana-YHT", 2], ["Adana-YHT", "Ankara-YHT", 4],
              ["Adana-YHT", "Eskisehir-YHT", 40], ["Harem","Istanbul-YHT", 1], ["Ankara","Ankara-YHT", 1],
              ["Adana","Adana-YHT", 1],["Eskisehir","Eskisehir-YHT", 1] ]

    for edge in edges:
        graph[edge[0]][edge[1]] = edge[2]
        graph[edge[1]][edge[0]] = edge[2]

    distlist = []

    start = time.perf_counter()

    for vertex in graph.keys():
        parents = ["Harem"]
        distlist.append(shortestPath(parents, "Harem", vertex, graph, []))

    end = time.perf_counter()
    print(f"Runtime of the program is {end - start}")

    if len(vertices) < 2:
        print("There is no enough city or station!")
    for i in range(1, len(vertices)):
        if distlist[i][1] == float("inf"):
            print("There is no way to", vertices[i])
        else:
            print("In", distlist[i][1], "hours, road to", vertices[i] + ":", distlist[i][0][::-1])


if __name__ == "__main__":
    main()
