#include <stdio.h>
#include <stdlib.h>
struct SLL
{
    int data;
    struct SLL *next;
};
struct SLL *first, *last = NULL;
struct SLL *create_node(int element)
{
    struct SLL *NewNode = (struct SLL *)malloc(sizeof(struct SLL));
    if (NewNode != NULL)
    {
        NewNode->data = element;
        NewNode->next = NULL;
    }
    return NewNode;
}
void insert_at_beginning(int element)
{
    struct SLL *NewNode = create_node(element);
    if (NewNode != NULL)
    {
        if (first == NULL) // i.e. LIST IS EMPTY
            first = last = NewNode;
        else // i.e. LIST HAS ONE OR MORE ELEMENTS
        {
            NewNode->next = first;
            first = NewNode;
        }
        printf("%d INSERTED AT BEGINNING\n", first->data);
    }
}
void insert_at_end(int element)
{
    struct SLL *NewNode = create_node(element);
    if (NewNode != NULL)
    {
        if (first == NULL) // i.e. LIST IS EMPTY
            first = last = NewNode;
        else // i.e. LIST HAS ONE OR MORE ELEMENTS
        {
            last->next = NewNode;
            last = NewNode;
        }
        printf("%d INSERTED AT END\n", last->data);
    }
}
void traversal()
{
    struct SLL *temp = first;
    if (first == NULL)
        printf("LIST IS EMPTY\n");
    else
    {
        while (temp != NULL)
        {
            printf("%d -> ", temp->data);
            temp = temp->next;
        }
        printf("NULL\n");
    }
}
void insert_at_pos(int element, int pos)
{
    struct SLL *NewNode = create_node(element);
    if (NewNode != NULL)
    {
        if (pos == 1)
            insert_at_beginning(element);
        else
        {
            int i;
            struct SLL *temp = first;
            for (i = 1; i < pos - 1 && temp->next != NULL; i++)
            {
                temp = temp->next;
            }
            if (temp->next == NULL)
                insert_at_end(element);
            else
            {
                NewNode->next = temp->next;
                temp->next = NewNode;
                printf("%d INSERTED AT POSITION %d\n", element, pos);
            }
        }
    }
}
void delete_from_beginning()
{
    struct SLL *temp;
    if (first == NULL)
        printf("EMPTY LIST\n");
    else if (first->next == NULL)
    {
        temp = first;
        first = last = NULL;
    }
    else
    {
        temp = first;
        first = first->next;
    }
    printf("%d DELETED FROM BEGINNING\n", temp->data);
    free(temp);
}
void delete_from_end()
{
    struct SLL *temp;
    if (first == NULL)
        printf("EMPTY LIST\n");
    else if (first->next == NULL)
    {
        temp = first;
        first = last = NULL;
    }
    else
    {
        temp = first;
        while (temp->next != last)
            temp = temp->next;
        last = temp;
        temp = last->next;
        last->next = NULL;
    }
    printf("%d DELETED FROM END\n", temp->data);
    free(temp);
}

void delete_from_pos(int pos)
{
    struct SLL *temp;
    if (first == NULL)
    {
        printf("EMPTY LIST\n");
        return;
    }
    
    if (pos == 1)
    {
        delete_from_beginning();
    }
    else
    {
        temp = first;
        for (int i = 1; i < pos - 1 && temp->next != NULL; i++)
        {
            temp = temp->next;
        }
        
        if (temp->next == NULL)
        {
            printf("POSITION OUT OF BOUNDS\n");
            return;
        }
        
        struct SLL *target = temp->next;
        temp->next = target->next;
        
        if (target == last)
        {
            last = temp;
        }
        
        printf("%d DELETED FROM POSITION %d\n", target->data, pos);
        free(target);
    }
}
void search(int key)
{
    struct SLL *temp;
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
    traversal();
    insert_at_beginning(200);
    traversal();
    insert_at_beginning(300);
    traversal();
    insert_at_end(400);
    traversal();
    insert_at_end(500);
    traversal();
    insert_at_end(600);
    traversal();
    delete_from_pos(4);
    traversal();
    search(600);
    search(123);
    return 0;
}