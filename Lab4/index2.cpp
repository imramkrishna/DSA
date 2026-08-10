#include<iostream>
#include<stdlib.h>
#include<chrono>
#define MAX 10000000
void swap(int *p, int *q){
    int temp=*p;
    *p=*q;
    *q=temp;
}

void display(int A[],int n){
    for(int i=0;i<n;i++){
        std::cout<<A[i]<<" ";
    }
    std::cout<<"\n";
}
void merge(int arr[],int l,int m,int r){
    int i=l;
    int j=m;
    int k=l;
    int B[20];
    while(i<m && j<=r){
        if(arr[i]<=arr[j]){
            B[k++]=arr[i++];
        }
        else{
            B[k++]=arr[j++];
        }
    }
    for(;i<m;i++,k++){
        B[k]=arr[i];
    }
    for(;j<=r;j++,k++){
        B[k]=arr[j];
    }
    for(k=l;k<=r;k++){
        arr[k]=B[k];
    }
}
void mergeSort(int arr[],int l,int r){
    if(l<r){
        int m=(l+r)/2;
        mergeSort(arr,l,m);
        mergeSort(arr,m+1,r);
        merge(arr,l,m+1,r);
    }
}

int partition(int A[],int l,int r){
    int pivot=A[l];
    int x=l;
    int y=r;
    while(x<y){
        while(A[x]<=pivot && x<=r){
            x++;
        }
        while(A[y]>pivot){
            y--;
        }
        if(x<y){
            swap(&A[x],&A[y]);
        }
    }
    swap(&A[l],&A[y]);
    return y;
}
void quickSort(int A[],int l,int r){
    if(l<r){
        int p=partition(A,l,r);
        quickSort(A,l,p-1);
        quickSort(A,p+1,r);
    }
}
int main(){
    int i,n,A[MAX];
    std::cout<<"Enter n : ";
    std::cin>>n;
    for(int i=0;i<n;i++){
        A[i]=rand()%100000;
    }
    display(A,n);
    auto start=std::chrono::steady_clock::now();
    mergeSort(A,0,7);
    auto end=std::chrono::steady_clock::now();
    auto time_taken=std::chrono::duration_cast<std::chrono::microseconds>(end-start).count();
    display(A,n);
    std::cout<<"Time taken : "<<time_taken<<" microseconds\n";
    main();
}