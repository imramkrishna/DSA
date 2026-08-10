#include <stdio.h>
#include <stdlib.h>

struct BST {
    int data;
    struct BST *left;
    struct BST *right;
    struct BST *parent;
};

void preorder(struct BST *root) {
    if (root != NULL) {
        printf("%d ", root->data);
        preorder(root->left);
        preorder(root->right);
    }
}

void inorder(struct BST *root) {
    if (root != NULL) {
        inorder(root->left);
        printf("%d ", root->data);
        inorder(root->right);
    }
}

void postorder(struct BST *root) {
    if (root != NULL) {
        postorder(root->left);
        postorder(root->right);
        printf("%d ", root->data);
    }
}
struct BST* insert(struct BST *root, int element) {
    if (root == NULL) {
        struct BST *newnode = (struct BST *)malloc(sizeof(struct BST));
        newnode->data = element;
        newnode->left = NULL;
        newnode->right = NULL;
        newnode->parent = NULL;
        return newnode;
    }

    if (element <= root->data) {
        root->left = insert(root->left, element);
        root->left->parent = root;
    } else {
        root->right = insert(root->right, element);
        root->right->parent = root;
    }

    return root;
}
struct BST* find_maximum(struct BST *root) {
    if (root == NULL) return NULL;
    while (root->right != NULL) {
        root = root->right;
    }
    return root;
}
struct BST* find_minimum(struct BST *root) {
    if (root == NULL) return NULL;
    while (root->left != NULL) {
        root = root->left;
    }
    return root;
}

struct BST* Search(struct BST *root, int key) {
    if (root == NULL || root->data == key) {
        return root;
    } else if (key < root->data) {
        return Search(root->left, key);
    } else {
        return Search(root->right, key);
    }
}
struct BST* delete_node(struct BST *root, int key) {
    if (root == NULL) return NULL;

    if (key < root->data) {
        root->left = delete_node(root->left, key);
        if (root->left) root->left->parent = root;
    } else if (key > root->data) {
        root->right = delete_node(root->right, key);
        if (root->right) root->right->parent = root;
    } else {
        if (root->left == NULL) {
            struct BST *temp = root->right;
            if (temp != NULL) temp->parent = root->parent;
            free(root);
            return temp;
        } else if (root->right == NULL) {
            struct BST *temp = root->left;
            if (temp != NULL) temp->parent = root->parent;
            free(root);
            return temp;
        }
        struct BST *temp = find_minimum(root->right);
        root->data = temp->data;
        root->right = delete_node(root->right, temp->data);
        if (root->right) root->right->parent = root;
    }
    return root;
}

void inorder_height(struct BST *root,int *max,int height ) {
    if (root != NULL) {
        inorder_height(root->left,max,height + 1);
        inorder_height(root->right,max,height+1);
        
    }
    printf("%d",height);

    if(height > max){
        *max = height;
    }

}
int bst_height(struct BST * root){
    
}

int main() {
    int choice, element,max=0;
    int *max_ptr= &max;
    struct BST *root = NULL;
    struct BST *temp;

    do {
        printf("\n0.CREATE\n1.INSERT\n2.DELETE\n3.SEARCH\n");
        printf("4.MAXIMUM\n5.MINIMUM\n6.TRAVERSAL\n7.EXIT\n8.HEIGHT");
        printf("Choice? ");
        scanf("%d", &choice);

        switch (choice) {
            case 0:
                int A[]={70,40,75,77,65,30,28,72};
                for(int i=0;i<8;i++){
                    root=insert(root,A[i]);
                }
                break;
            case 1:
                printf("Element? ");
                scanf("%d", &element);
                root = insert(root, element);
                break;

            case 2:
                printf("Element to delete? ");
                scanf("%d", &element);
                if (Search(root, element) != NULL) {
                    root = delete_node(root, element);
                    printf("Element deleted.\n");
                } else {
                    printf("Element not found in tree.\n");
                }
                break;

            case 3:
                printf("Key? ");
                scanf("%d", &element);
                temp = Search(root, element);
                if (temp) {
                    printf("Search successful. Element = %d\n", temp->data);
                } else {
                    printf("Element not found.\n");
                }
                break;

            case 4:
                temp = find_maximum(root);
                if (temp)
                    printf("Max is %d\n", temp->data);
                else
                    printf("Tree is empty.\n");
                break;

            case 5:
                temp = find_minimum(root);
                if (temp)
                    printf("Min is %d\n", temp->data);
                else
                    printf("Tree is empty.\n");
                break;

            case 6:
                if (root == NULL) {
                    printf("Tree is empty.\n");
                    break;
                }
                printf("PREORDER: ");
                preorder(root);
                printf("\nINORDER: ");
                inorder(root);
                printf("\nPOSTORDER: ");
                postorder(root);
                printf("\n");
                break;

            case 7:
                printf("BYE!\n");
                break;
            case 8:
                inorder_height(root,*max_ptr,0);
                break;
            default:
                printf("Invalid choice!\n");
                break;
        }
    } while (choice != 7);

    return 0;
}