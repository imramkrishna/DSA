#include <stdio.h>
#include <stdlib.h>
#define MAX 5

void push(int element);
void pop();
int isEmpty();
int isFull();

struct Stack
{
    int top;
    int arr[MAX];
};

struct Stack s = {-1};

int isEmpty()
{
    return (s.top == -1);
}

int isFull()
{
    return (s.top == MAX - 1);
}

void push(int el)
{
    if (isFull())
    {
        printf("Stack Overflow\n");
        return;
    }
    s.top++;
    s.arr[s.top] = el;
    printf("The element was pushed: %d\n", el);
}

void pop()
{
    if (isEmpty())
    {
        printf("Stack Underflow\n");
        return;
    }
    int popped = s.arr[s.top];
    s.top--;
    printf("The element was popped: %d\n", popped);
}

int main()
{
    int input;
    int element;
    while (1)
    {
        printf("Enter the operation you want to perform:\n1. PUSH\n2. POP\n3. EXIT\nChoice: ");
        scanf("%d", &input);
        switch (input)
        {
        case 1:
            printf("Enter the element you want to push: ");
            scanf("%d", &element);
            push(element);
            break;
        case 2:
            pop();
            break;
        case 3:
            printf("Exiting.\n");
            return 0;
        default:
            printf("Invalid choice. Try again.\n");
            break;
        }
    }
    return 0;
}
