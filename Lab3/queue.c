#include <stdio.h>
#include <stdlib.h>
#define MAX 5

void enqueue(int element);
void dequeue();
void display();
int isEmpty();
int isFull();

struct Queue
{
    int front;
    int rear;
    int arr[MAX];
};

struct Queue q = {-1, -1};

int isEmpty()
{
    return (q.front == -1);
}

int isFull()
{
    return ((q.rear + 1) % MAX == q.front);
}

void enqueue(int el)
{
    if (isFull())
    {
        printf("Queue Overflow\n");
        return;
    }
    if (isEmpty())
        q.front = q.rear = 0;
    else
        q.rear = (q.rear + 1) % MAX;
    q.arr[q.rear] = el;
    printf("The element was enqueued: %d\n", el);
}

void dequeue()
{
    if (isEmpty())
    {
        printf("Queue Underflow\n");
        return;
    }
    int dequeued = q.arr[q.front];
    if (q.front == q.rear) 
        q.front = q.rear = -1;
    else
        q.front = (q.front + 1) % MAX;
    printf("The element was dequeued: %d\n", dequeued);
}

void display()
{
    if (isEmpty())
    {
        printf("Queue is Empty\n");
        return;
    }
    printf("FRONT -> ");
    int i = q.front;
    while (1)
    {
        printf("%d ", q.arr[i]);
        if (i == q.rear)
            break;
        i = (i + 1) % MAX;
    }
    printf("<- REAR\n");
}

int main()
{
    int input;
    int element;
    while (1)
    {
        printf("Enter the operation you want to perform:\n1. ENQUEUE\n2. DEQUEUE\n3. DISPLAY\n4. EXIT\nChoice: ");
        scanf("%d", &input);
        switch (input)
        {
        case 1:
            printf("Enter the element you want to enqueue: ");
            scanf("%d", &element);
            enqueue(element);
            break;
        case 2:
            dequeue();
            break;
        case 3:
            display();
            break;
        case 4:
            printf("Exiting.\n");
            return 0;
        default:
            printf("Invalid choice. Try again.\n");
            break;
        }
    }
    return 0;
}
