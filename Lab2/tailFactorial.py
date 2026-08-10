def tail_fact(n, a):
    if n == 0 or n == 1:
        return a
    else:
        return tail_fact(n-1, n*a)
    
n = int(input("Enter a number "))
result = tail_fact(n, 1)
print(f"The factorial of {n} is {result}")