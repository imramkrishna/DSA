#include<iostream>
#include<stdlib.h>
#include<chrono>
#define MAX 300000
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

void bubbleSort(int A[],int n){
    for (int i=0;i<n;i++){
        for(int j=0;j<n-i-1;j++){
            if(A[j]>A[j+1]){
                swap(&A[j],&A[j+1]);
            }
        }
    }
}

void selectionSort(int A[],int n){
    for(int i=0;i<n-1;i++){
        int least=A[i];
        int pos=i;
        for(int j=i+1;j<n;j++){
            if(A[j]<least){
                least=A[j];
                pos=j;
            }
        }
        if(i!=pos){
            swap(&A[i],&A[pos]);
        }
    } 
}

void insertionSort(int A[],int n){
    for(int i=1;i<n;i++){
        int key=A[i];
        int j=i-1;
        while(j>=0 && A[j]>key){
            A[j+1]=A[j];
            j--;
        }
        A[j+1]=key;
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
    insertionSort(A,n);
    auto end=std::chrono::steady_clock::now();
    auto time_taken=std::chrono::duration_cast<std::chrono::microseconds>(end-start).count();
    display(A,n);
    std::cout<<"Time taken : "<<time_taken<<" microseconds\n";
    main();
}