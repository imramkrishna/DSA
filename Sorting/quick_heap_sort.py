import time
import random

def generate_array(length):
    arr=random.choices(range(0,100000),k=length)
    return arr

def partition(A,low,high):
    pivot_index=random.randint(low,high)
    A[pivot_index],A[high]=A[high],A[pivot_index]
    pivot=A[high]
    i=low-1
    for j in range(low,high):
        if A[j]<=pivot:
            i+=1
            A[i],A[j]=A[j],A[i]
    A[i+1],A[high]=A[high],A[i+1]
    return i+1

def quick_sort(A,low=0,high=None):
    if high is None:
        high=len(A)-1
    if low<high:
        p=partition(A,low,high)
        quick_sort(A,low,p-1)
        quick_sort(A,p+1,high)
    return A

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

quick_sort_time={}
heap_sort_time={}

def main():
    length=int(input("Enter length of array : "))
    if(length==-1):
        print("quick_sort =",quick_sort_time)
        print("heap_sort =",heap_sort_time)
        return
    array=generate_array(length)

    quick_array=array[:]
    start_time=time.perf_counter()
    quick_sort(quick_array)
    end_time=time.perf_counter()
    quick_sort_time[length]=end_time-start_time

    heap_array=array[:]
    start_time=time.perf_counter()
    heap_sort(heap_array)
    end_time=time.perf_counter()
    heap_sort_time[length]=end_time-start_time
    print("quick_sort =",quick_sort_time)
    print("heap_sort =",heap_sort_time)
    main()
main()
