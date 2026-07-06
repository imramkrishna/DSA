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
def main():
    print(insertion_sort([5,1,4,2,8]))
main()