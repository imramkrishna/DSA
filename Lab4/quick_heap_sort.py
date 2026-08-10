import time
import random

def generate_array(length):
    arr=random.choices(range(0,100000),k=length)
    return arr

def partition(arr, low, high):
    pivot = arr[high]
    i = low - 1
    for j in range(low, high):
        if arr[j] <= pivot:
            i += 1
            arr[i], arr[j] = arr[j], arr[i]
    arr[i + 1], arr[high] = arr[high], arr[i + 1]
    return i + 1

def quick_sort(arr, low=0, high=None):
    if high is None:
        high = len(arr) - 1
    if low < high:
        p = partition(arr, low, high)
        quick_sort(arr, low, p - 1)
        quick_sort(arr, p + 1, high)
    return arr

def max_heapify(A,heap_size,i):
    left=2*i+1
    right=2*i+2
    largest=i
    if left<heap_size and A[left]>A[largest]:
        largest=left
    if right<heap_size and A[right]>A[largest]:
        largest=right
    if largest!=i:
        A[i],A[largest]=A[largest],A[i]
        max_heapify(A,heap_size,largest)

def build_max_heap(A):
    for i in range(len(A)//2-1,-1,-1):
        max_heapify(A,len(A),i)

def heap_sort(A):
    build_max_heap(A)
    for i in range(len(A)-1,0,-1):
        A[0],A[i]=A[i],A[0]
        max_heapify(A,i,0)
    return A

heap_sort_time={}

def main():
    arr=[22,18,9,21,19,14,39,29,63,8]
    

