# Breadth First Search 
def BFS(graph, start_vertex):
    visited = []
    stack = []

    stack.append(start_vertex)

    while len(stack) >0:
        current_vertex = stack.pop(0)

        visited.append(current_vertex)

        for neighbor in graph[current_vertex]:
            if neighbor not in stack and neighbor not in visited:
                stack.append(neighbor)

    return visited

    

graph = {
    'a': ['b', 'm'],
    'b': ['z', 't'],
    'm': ['q', 'c'],
    'z': [],
    't': [],
    'q': [],
    'c': []
}

print("DFS Traversal sequence is : ",DFS(graph,'a'))

