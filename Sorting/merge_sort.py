import time
import random
def generate_array(length):
    arr=random.choices(range(0,100000),k=length)
    return arr
def merge_sort(arr):
    if len(arr) <= 1:
        return arr

    mid = len(arr) // 2
    left = merge_sort(arr[:mid])    
    right = merge_sort(arr[mid:]) 
    return merge(left, right)


def merge(left, right):
    result = []
    i = j = 0
    while i < len(left) and j < len(right):
        if left[i] <= right[j]:
            result.append(left[i])
            i += 1
        else:
            result.append(right[j])
            j += 1
    result.extend(left[i:])
    result.extend(right[j:])
    return result


sort_time={}

def main():
    len=int(input("Enter length of array : "))
    if(len==-1):
        print(sort_time)
        return sort_time
    array=generate_array(len)
    start_time=time.perf_counter()
    merge_sort(array)
    end_time=time.perf_counter()
    sort_time[len]=end_time-start_time
    print(sort_time)
    main()
main()