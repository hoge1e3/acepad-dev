#!python
from math import log
log_2 = log(2)

def summation(s,b):
    r=0
    p=r
    for i in range(b,b+100):
        r+=s(i)
        if r==p:break
    return r
series = lambda n: 1 / (n**2 * 2**(2*n - 1))
expression = summation(series, 1) + (log_2)**2
print(expression)