import copy
import math
import random
import sys
import timeit


def Linear_Search(arr, n: int, key: int):
    flag = False
    for i in range(n):
        if arr[i] == key:
            flag = True
            print(f"Element flag at index {i}")
            # not break here so that we can find duplicates
    if flag == False:
        print("Element not flag! ")


def Binary_Search(arr, l, r, key):
    arr.sort()
    flag = False
    while l <= r:
        m = math.floor(l + (r - l) / 2)

        print(arr[m])
        if arr[m] == key:
            flag = True
            print(f"Element found at index {m}")
        if arr[m] < key:
            l = m + 1
        else:
            r = m - 1
    if flag == False:
        print("Element not Found")


def R_Binary_Search(arr, l, r, key):
    arr.sort()
    array_of_found = []

    m = -1

    while l <= r:
        m = l + (r - l) // 2
        if arr[m] == key:
            array_of_found.append(m)
            break
        elif arr[m] < key:
            l = m + 1
        else:
            r = m - 1

    if m != -1:
        # Collect to the left
        i = m
        while i >= 0 and arr[i] == key:
            array_of_found.append(i)
            i -= 1

        # Collect to the right
        j = m + 1
        while j < len(arr) and arr[j] == key:
            array_of_found.append(j)
            j += 1

    return array_of_found


# for i in range(n):
#     user_input = int(input(f"Enter element {i} for the array :"))
#     list1.append(user_input)

n = int(sys.argv[1])
key = int(sys.argv[2])
list1 = []

for _ in range(n):
    numbers_list = random.randint(1, 100001)
    list1.append(numbers_list)


# list2 = copy.deepcopy(list1)

t1 = timeit.default_timer()
R_Binary_Search(list1, 0, n - 1, key)
t2 = timeit.default_timer()

print(f"Time taken by Binary Search is {t2-t1} seconds")