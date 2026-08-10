def toh(n,src,dst,tmp):
    if(n==1):
        print(f"move disk {n} from {src} to {dst}")
    else:
        toh(n-1,src,tmp,dst)
        print(f"move disk {n} from {src} to {dst}")
        toh(n-1,tmp,dst,src)

n= int(input("Enter a number "))
src= input("Enter src")
dst= input("Enter dst  ")
tmp=input("Enter tmp  ")
toh(n,src,dst,tmp)

    