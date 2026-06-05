operands=("+", "-", "*","/","^","(",")")
precedence = {
    "+": 1,
    "-": 1,
    "*": 2,
    "/": 2,
    "^": 3
}
def checkPrecedence(stack, exp, output):
    print(f"Pushing {exp} into stack")
    while stack:
        top = stack[-1]
        if top == '(':
            break
        top_prec = precedence.get(top)
        cur_prec = precedence.get(exp)
        if exp == '^':
            if top_prec is not None and top_prec > cur_prec:
                print(f"Precedence of top element ({top}) is more than {exp}. Popping {top} and pushing it to output")
                output += stack.pop()
                continue
            break
        else:
            if top_prec is not None and top_prec >= cur_prec:
                print(f"Precedence of top element ({top}) is more than {exp}. Popping {top} and pushing it to output")
                output += stack.pop()
                continue
            break
    stack.append(exp)
    print(f"Stack is {stack} \noutput is {output}")
    return output
def infix_to_postfix():
        expression=input("Enter the infix expression : ").split()
        stack=[]
        output=""
        for exp in expression:
            if exp not in operands:
                output+=exp
                print(f"For char {exp}, output is {output}")
            else:
                if exp == ")":
                    print("Close Bracket Found, start Popping from stack ")
                    while stack:
                        op = stack.pop()
                        print("Popped : ", op)
                        if op == "(":
                            print("'(' Found. Breaking Loop")
                            break
                        output += op
                        print(f"Pushed {op} in result, output = {output}")
                elif exp=="(":
                    print(f"Pushing {exp} into stack")
                    stack.append(exp)
                    print(f"Stack is {stack} \noutput is {output}")
                elif exp=="^" or exp=="/" or exp=="*" or exp=="+" or exp=="-":
                    output = checkPrecedence(stack, exp, output)
                else:
                    print("Invalid Character in the expression.",exp)
        while stack:
            op = stack.pop()
            if op == '(' or op == ')':
                continue
            output += op
        print("The output is : ",output)       
        
infix_to_postfix();        