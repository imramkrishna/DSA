from timeit import default_timer
def fibo(n):
    table={}
    if n==1 or n==2:
        return 1
    if n not in table:
        table[n]=fibo(n-1)+fibo(n-2)
    return table[n]
n = int(input("Enter a number "))
start = default_timer()
result = fibo(n)
end = default_timer()
print(f"The {n}th fibonacci term is {result}")
print(f"The time taken is  {(end-start)} seconds")
