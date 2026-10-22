def something(n):
    for i in range (2, n):
        nt = True
        for j in range(2, i//2+1):
            if i%j == 0:
                nt=False
                break
        if nt:
            print(i)
# something(10)



bmt = []



a = [1,2,3,4,5]

for i in range(1,len(a)):
    print(a[i])


