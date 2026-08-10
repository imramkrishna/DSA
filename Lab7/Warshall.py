import numpy as np

input_matrix = []

n = int(input("Enter number of rows : "))

for i in range(n):
    row  = list(map(int,input(f"Enter the row {i+1} of the matrix : ").split()))
    input_matrix.append(row)

input_matrix = np.array(input_matrix)
print(f"The input matrix is : \n{input_matrix}")


def warshal(input_matrix):
    w = input_matrix

    for k in range(n):
        for i in range(n):
            for j in range(n):
                w[i][j] = w[i][j] or (w[i][k] and w[k][j])

    return w

w = []
w = warshal(input_matrix)
print(f"The output is : \n{w}")