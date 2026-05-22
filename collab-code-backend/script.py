num = 29

if num > 1:
    for i in range(2, num // 2):
        if num % i == 0:
            print("Not")
            break
    else:
        print("Prime")