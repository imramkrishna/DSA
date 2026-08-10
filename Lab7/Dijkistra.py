import math

G = {
        'A' :{'B' : 2,'C' :6 , 'D' : 4},
        'B' :{'A':2,'C':5},
        'C' :{'A':6,'B':5 , 'D' :7 , 'E' :3 },
        'D' :{'A':4,'C':7,'E':8},
        'E' :{'D':8,'C':3},
    }

def initialize(G,start):
    # initialize cost, and prev with empty dict.
    cost = {}
    prev = {}

    # for every vertex we put the cost as infinity and it's prev vertex to None
    for vertex in G.keys():
        cost[vertex] = math.inf
        prev[vertex] = None

    # set the first vertex cost to 0.
    cost[start] = 0
    # return the initialized cost and prev.
    return cost,prev

def relax(u,v,G,cost,prev):
    """
     total cost is the sum of cost of the current vertex and weight between the current vertex and the next vertex
    """     
    total_cost = cost[u] + G[u][v]
    if cost[v] > total_cost:
        cost[v] = total_cost
        prev[v] = u

    return cost,prev


def Dijkstra(G,start):
    cost, prev = initialize(G,start)

    PQ = {}

    for vertex in G.keys():
        PQ[vertex] = cost[vertex]

    visited = set()

    while(PQ):
        # Take min element from the PQ Queue(Dict) and delete it from the Queue
        current = min(PQ,key=PQ.get)
        del PQ[current]

        visited.add(current)
        for neighbor in G[current].keys():
            if neighbor not in visited:
                old_cost = cost[neighbor]
                cost,prev = relax(current,neighbor,G,cost,prev)

                if old_cost > cost[neighbor]:
                    PQ[neighbor] = cost[neighbor]

        # print(f"Current = {current}")
        # print(cost)
        # print(prev)

    return cost,prev

def construct_path(node,prev):
    path = [node]
    while (prev[node] != None):
        path.append(prev[node])
        node = prev[node]
    path.reverse()
    return '->'.join(path)


start = 'A'
cost,prev = Dijkstra(G,'A')

for vertex in G.keys():
    print(f"Shortest path \n{start} to {vertex} : {construct_path(vertex,prev)} ,    Cost{cost[vertex]}")
