
operands=("+", "-", "*", "/","%", "^")
stack=[]
def evaluate():
    expression=input("Enter the postfix expression : ").split()
    for e in expression:
        if e not in operands:
            stack.append(float(e))
        else: 
            val1=stack.pop()
            val2=stack.pop()
            if e=="+":
                stack.append(val2+val1)
            elif e=="-":
                stack.append(val2-val1)
            elif e=="*":
                stack.append(val2*val1)
            elif e=="/":
                stack.append(val2/val1)
            elif e=="%":
                stack.append(val2%val1)
            elif e=="^":
                stack.append(val2^val1)
            else:
                print("Invalid Input")
    print(stack)
evaluate()
        
        