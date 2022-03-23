# 1.
```
  npm start FORK or npm start // to run in fork mode

  npm start CLUSTER // to run in cluster mode
```

# 2. Artillery

Summary in FORK 
```
 [Summary]:
   ticks  total  nonlib   name
    276    1.0%   98.2%  JavaScript
      0    0.0%    0.0%  C++
    112    0.4%   39.9%  GC
  28539   99.0%          Shared libraries
      5    0.0%          Unaccounted

```

Summary in CLUSTER 
```
[Summary]:
   ticks  total  nonlib   name
    131    0.1%   98.5%  JavaScript
      0    0.0%    0.0%  C++
     60    0.1%   45.1%  GC
  95921   99.9%          Shared libraries
      2    0.0%          Unaccounted

```

Se puede observer que en modo cluster hay una reduccion en un 50% de los ticks.

