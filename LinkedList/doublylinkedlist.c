#include <stdio.h>
#include <stdlib.h>
struct DLL
{
    int data;
    struct DLL *prev;
    struct DLL *next;
};
struct DLL *first = NULL, *last = NULL;
struct DLL *create_node(int element)
{
    struct DLL *NewNode = (struct DLL *)malloc(sizeof(struct DLL));
    if (NewNode != NULL)
    {
        NewNode->data = element;
        NewNode->prev = NULL;
        NewNode->next = NULL;
    }
    return NewNode;
}
void insert_at_beginning(int element)
{
    struct DLL *NewNode = create_node(element);
    if (NewNode != NULL)
    {
        if (first == NULL) // i.e. LIST IS EMPTY
            first = last = NewNode;
        else // i.e. LIST HAS ONE OR MORE ELEMENTS
        {
            NewNode->next = first;
            first->prev = NewNode;
            first = NewNode;
        }
        printf("%d INSERTED AT BEGINNING\n", first->data);
    }
}
void insert_at_end(int element)
{
    struct DLL *NewNode = create_node(element);
    if (NewNode != NULL)
    {
        if (first == NULL) // i.e. LIST IS EMPTY
            first = last = NewNode;
        else // i.e. LIST HAS ONE OR MORE ELEMENTS
        {
            NewNode->prev = last;
            last->next = NewNode;
            last = NewNode;
        }
        printf("%d INSERTED AT END\n", last->data);
    }
}
void insert_at_pos(int element, int pos)
{
    if (pos == 1 || first == NULL)
        insert_at_beginning(element);
    else
    {
        struct DLL *temp = first;
        for (int i = 1; i < pos - 1 && temp->next != NULL; i++)
        {
            temp = temp->next;
        }
        if (temp->next == NULL)
            insert_at_end(element);
        else
        {
            struct DLL *NewNode = create_node(element);
            if (NewNode != NULL)
            {
                NewNode->next = temp->next;
                NewNode->prev = temp;
                temp->next->prev = NewNode;
                temp->next = NewNode;
                printf("%d INSERTED AT POSITION %d\n", element, pos);
            }
        }
    }
}
void forward_traversal()
{
    struct DLL *temp = first;
    if (first == NULL)
        printf("LIST IS EMPTY\n");
    else
    {
        printf("NULL <-> ");
        while (temp != NULL)
        {
            printf("%d <-> ", temp->data);
            temp = temp->next;
        }
        printf("NULL\n");
    }
}
void backward_traversal()
{
    struct DLL *temp = last;
    if (last == NULL)
        printf("LIST IS EMPTY\n");
    else
    {
        printf("NULL <-> ");
        while (temp != NULL)
        {
            printf("%d <-> ", temp->data);
            temp = temp->prev;
        }
        printf("NULL\n");
    }
}
void delete_from_beginning()
{
    struct DLL *temp;
    if (first == NULL)
    {
        printf("EMPTY LIST\n");
        return;
    }
    temp = first;
    if (first->next == NULL) // i.e. LIST HAS ONLY ONE ELEMENT
        first = last = NULL;
    else
    {
        first = first->next;
        first->prev = NULL;
    }
    printf("%d DELETED FROM BEGINNING\n", temp->data);
    free(temp);
}
void delete_from_end()
{
    struct DLL *temp;
    if (last == NULL)
    {
        printf("EMPTY LIST\n");
        return;
    }
    temp = last;
    if (last->prev == NULL) // i.e. LIST HAS ONLY ONE ELEMENT
        first = last = NULL;
    else
    {
        last = last->prev;
        last->next = NULL;
    }
    printf("%d DELETED FROM END\n", temp->data);
    free(temp);
}
void delete_from_pos(int pos)
{
    if (first == NULL)
    {
        printf("EMPTY LIST\n");
        return;
    }
    if (pos == 1)
    {
        delete_from_beginning();
        return;
    }
    struct DLL *target = first;
    for (int i = 1; i < pos && target != NULL; i++)
    {
        target = target->next;
    }
    if (target == NULL)
    {
        printf("POSITION OUT OF BOUNDS\n");
        return;
    }
    if (target == last)
    {
        delete_from_end();
        return;
    }
    target->prev->next = target->next;
    target->next->prev = target->prev;
    printf("%d DELETED FROM POSITION %d\n", target->data, pos);
    free(target);
}
void search(int key)
{
    struct DLL *temp;
    int flag = 0;
    if (first == NULL)
        printf("EMPTY LIST\n");
    else
    {
        temp = first;
        while (temp != NULL)
        {
            if (temp->data == key)
            {
                printf("ELEMENT FOUND!\n");
                flag = 1;
            }
            temp = temp->next;
        }
        if (flag == 0)
            printf("SEARCH UNSUCESSFUL\n");
    }
}

int main()
{
    insert_at_beginning(100);
    forward_traversal();
    insert_at_beginning(200);
    forward_traversal();
    insert_at_beginning(300);
    forward_traversal();
    insert_at_end(400);
    forward_traversal();
    insert_at_end(500);
    forward_traversal();
    insert_at_pos(250, 2);
    forward_traversal();
    backward_traversal();
    delete_from_pos(4);
    forward_traversal();
    delete_from_beginning();
    forward_traversal();
    delete_from_end();
    forward_traversal();
    backward_traversal();
    search(400);
    search(123);
    return 0;
}
