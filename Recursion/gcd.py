def gcd(a,b):
    if (b==0):
        return a
    else:
        return gcd(b,a%b)
    

a= int(input("Enter a number "))
b= int(input("Enter a number "))
result=gcd(a,b)      
print(f"The gcd of {a}  and {b} is {result}") 
    
