import random
import time
def generate_array(length):
    arr=random.choices(range(0,100000),k=length)
    return arr
def swap(arr, index1, index2):
    temp = arr[index1]
    arr[index1] = arr[index2]
    arr[index2] = temp
    
def elegant_swap(arr,index1,index2):
    arr[index1],arr[index2]=arr[index2],arr[index1]

def bubble_sort(A):
    for i in range(len(A)):
        for j in range(len(A)-i-1):
            if A[j]>A[j+1]:
                elegant_swap(A,j,i)
    return A

def selection_sort(A):
    for i in range(len(A)):
        least=A[i]
        pos=i
        for j in range(i+1,len(A)):
            if A[j]<least:
                least=A[j]
                pos=j
        if i!=pos:
            elegant_swap(A,i,pos)
    return A

def insertion_sort(A):
    for i in range(1,len(A)):
        key=A[i]
        j=i-1
        while (j>=0 and A[j]>key):
            A[j+1]=A[j]
            j=j-1
        A[j+1]=key
        return A
insertion_sort_time={}

def main():
    len=int(input("Enter length of array : "))
    if(len==-1):
        print(insertion_sort_time)
        return insertion_sort_time
    array=generate_array(len)
    start_time=time.perf_counter()
    selection_sort(array)
    end_time=time.perf_counter()
    insertion_sort_time[len]=end_time-start_time
    print(insertion_sort_time)
    main()
main()