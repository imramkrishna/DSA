operands=("+", "-", "*","/","^","(",")")
precedence = {
    "+": 1,
    "-": 1,
    "*": 2,
    "/": 2,
    "^": 3
}
# A * B + C + D ------>  A B * C + D +
def evaluate():
    expression=input("Enter the infix expression : ").split()
    stack=[]
    output=[]
    for char in expression:
        if char not in operands:
            output.append(char)
        elif char=="(":
            stack.append(char)
        elif char==")":
            while(stack[-1]!="("):
                output.append(stack.pop())
            stack.pop()
        else:
            while stack and stack[-1]!="(" and precedence[stack[-1]]>=precedence[char]:
                output.append(stack.pop())
            stack.append(char)
    while stack:
        output.append(stack.pop())
    print("The postfix expression is: ", " ".join(output))
               
evaluate()
                