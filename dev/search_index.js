var documenterSearchIndex = {"docs":
[{"location":"functions/nsolsc/#nsolsc:-scalar-equation-solver","page":"nsolsc: scalar equation solver","title":"nsolsc: scalar equation solver","text":"","category":"section"},{"location":"functions/nsolsc/","page":"nsolsc: scalar equation solver","title":"nsolsc: scalar equation solver","text":"nsolsc(x,f)","category":"page"},{"location":"functions/nsolsc/#SIAMFANLEquations.nsolsc-Tuple{Any,Any}","page":"nsolsc: scalar equation solver","title":"SIAMFANLEquations.nsolsc","text":"nsolsc(f,x, fp=difffp; rtol=1.e-6, atol=1.e-12, maxit=10,         solver=\"newton\", sham=1, armmax=10, resdec=.1, dx=1.e-7,         armfix=false,          printerr=true, keepsolhist=true, stagnationok=false)\n\nNewton's method for scalar equations. Has most of the features a code for systems of equations needs.\n\nInput:\n\nf: function\n\nx: initial iterate\n\nfp: derivative. If your derivative function is fp, you give me its name. For example fp=foobar tells me that foobar is your function for the derivative. The default is a forward difference Jacobian that I provide.\n\nKeyword Arguments (kwargs):\n\nrtol, atol: real and absolute error tolerances\n\nmaxit: upper bound on number of nonlinear iterations\n\nsolver:\n\nYour choices are \"newton\"(default), \"secant\", or \"chord\". However,  you have sham at your disposal only if you chose newton. \"chord\" will keep using the initial derivative until the iterate converges, uses the iteration budget, or the line search fails. It is not the same as sham=Inf, which is smarter.\n\nIf you use secant and your initial iterate is poor, you have made a mistake. I will help you by driving the line search with a finite difference derivative.\n\nsham:\n\nThis is the Shamanskii method. If sham=1, you have Newton. The iteration updates the derivative every sham iterations. The convergence rate has local q-order sham+1 if you only count iterations where you update the derivative. You need not provide your own derivative function to use this option. sham=Inf is chord only if chord is converging well.\n\narmmax: upper bound on stepsize reductions in linesearch\n\nresdec: target value for residual reduction. \n\nThe default value is .1. In the old MATLAB codes it was .5. I only turn Shamanskii on if the residuals are decreasing rapidly, at least a factor of resdec, and the line search is quiescent. If you want to eliminate resdec from the method ( you don't ) then set resdec = 1.0 and you will never hear from it again.  \n\ndx:\n\nThis is the increment for forward difference, default = 1.e-7. dx should be roughly the square root of the noise in the function.\n\narmfix:\n\nThe default is a parabolic line search (ie false). Set to true and the stepsize will be fixed at .5. Don't do this unless you are doing experiments for research.\n\nprinterr:\n\nI print a helpful message when the solver fails. To supress that message set printerr to false.\n\nkeepsolhist:\n\nSet this to true to get the history of the iteration in the output tuple. This is on by default for scalar equations and off for systems. Only turn it on if you have use for the data, which can get REALLY LARGE.\n\nstagnationok:\n\nSet this to true if you want to disable the line search and either observe divergence or stagnation. This is only useful for research or writing a book.\n\nOutput:\n\nA tuple (solution, functionval, history, stats, idid, solhist) where history is the vector of residual norms (|f(x)|) for the iteration and stats is a tuple of the history of (ifun, ijac, iarm), the number of functions/derivatives/steplength reductions at each iteration.\n\nI do not count the function values for a finite-difference derivative because they count toward a Jacobian evaluation. I do count them for the secant method model.\n\nidid=true if the iteration succeeded and false if not.\n\nsolhist:\n\nThis is the entire history of the iteration if you've set keepsolhist=true\n\nExamples\n\njulia> nsolout=nsolsc(atan,1.0;maxit=5,atol=1.e-12,rtol=1.e-12);\n\njulia> nsolout.history\n6-element Array{Float64,1}:\n 7.85398e-01\n 5.18669e-01\n 1.16332e-01\n 1.06102e-03\n 7.96200e-10\n 2.79173e-24\n\njulia> fs(x)=x^2-4.0; fsp(x)=2x;\n\njulia> nsolout=nsolsc(fs,1.0,fsp; maxit=5,atol=1.e-9,rtol=1.e-9);\n\njulia> [nsolout.solhist.-2 nsolout.history]\n6×2 Array{Float64,2}:\n -1.00000e+00  3.00000e+00\n  5.00000e-01  2.25000e+00\n  5.00000e-02  2.02500e-01\n  6.09756e-04  2.43940e-03\n  9.29223e-08  3.71689e-07\n  2.22045e-15  8.88178e-15\n\n\n\n\n\n\n","category":"method"},{"location":"functions/ptcsolsc/#ptcsolsc:-pseuto-transient-continuation","page":"ptcsolsc: pseuto-transient continuation","title":"ptcsolsc: pseuto-transient continuation","text":"","category":"section"},{"location":"functions/ptcsolsc/","page":"ptcsolsc: pseuto-transient continuation","title":"ptcsolsc: pseuto-transient continuation","text":"ptcsolsc(x,f)","category":"page"},{"location":"functions/ptcsolsc/#SIAMFANLEquations.ptcsolsc-Tuple{Any,Any}","page":"ptcsolsc: pseuto-transient continuation","title":"SIAMFANLEquations.ptcsolsc","text":"ptcsolsc(f, x, fp=difffp; rtol=1.e-6, atol=1.e-12, fp=difffp,          dt0=1.e-6, maxit=100, keepsolhist=true)\n\nScalar pseudo-transient continuation solver. PTC is designed to find stable steady state solutions of \n\ndx/dt = - f(x)\n\nIt is ABSOLUTELY NOT a general purpose nonlinear solver.\n\nInput:\n\nf: function\n\nx: initial iterate/data\n\nfp: derivative. If your derivative function is fp, you give me its name. For example fp=foobar tells me that foobar is your function for the derivative. The default is a forward difference Jacobian that I provide.\n\nOptions:\n\nrtol, atol: real and absolute error tolerances\n\ndt0: initial time step. The default value of 1.e-3 is a bit conservative  and is one option you really should play with. Look at the example where I set it to 1.0!\n\nmaxit: upper bound on number of nonlinear iterations. This is  coupled to dt0. If your choice of dt0 is too small (conservative) then you'll need many iterations to converge and will need a larger value of maxit.\n\nkeepsolhist: if true you get the history of the iteration in the output  tuple. This is on by default for scalar equations and off for systems. Only turn it on if you have use for the data, which can get REALLY LARGE.\n\nOutput: A tuple (solution, functionval, history, idid, solhist) where history is the array of absolute function values |f(x)| of residual norms and time steps. Unless something has gone badly wrong, dt approx |f(x_0)|/|f(x)|.\n\nidid=true if the iteration succeeded and false if not.\n\nsolhist=entire history of the iteration if keepsolhist=true\n\nIf the iteration fails it's time to play with the tolerances, dt0, and maxit. You are certain to fail if there is no stable solution to the equation.\n\nExamples\n\njulia> ptcout=ptcsolsc(sptest,.2;dt0=2.0,rtol=1.e-3,atol=1.e-3);\n\njulia> [ptcout.solhist ptcout.history]\n7×2 Array{Float64,2}:\n 2.00000e-01  9.20000e-02\n 9.66666e-01  4.19962e-01\n 8.75086e-01  2.32577e-01\n 7.99114e-01  1.10743e-01\n 7.44225e-01  4.00926e-02\n 7.15163e-01  8.19395e-03\n 7.07568e-01  4.61523e-04\n\n\n\n\n\n","category":"method"},{"location":"#SIAMFANLEquations.jl-v0.2.1","page":"Home","title":"SIAMFANLEquations.jl v0.2.1","text":"","category":"section"},{"location":"","page":"Home","title":"Home","text":"C. T. Kelley","category":"page"},{"location":"","page":"Home","title":"Home","text":"SIAMFANLEquations.jl is the package of solvers and test problems for the book","category":"page"},{"location":"","page":"Home","title":"Home","text":"Solving Nonlinear Equations with Iterative Methods: Solvers and Examples in Julia","category":"page"},{"location":"","page":"Home","title":"Home","text":"This documentation is sketchy and designed to get you going, but the real deal is the IJulia notebook","category":"page"},{"location":"","page":"Home","title":"Home","text":"This is version 0.2.1. ","category":"page"},{"location":"","page":"Home","title":"Home","text":"The scalar solvers and the first chapter of the notebook are done as of v0.1.2.","category":"page"},{"location":"","page":"Home","title":"Home","text":"Chapter 2 is under construction and I'll tag this when the solvers are  done. I'll tag v0.2.2 when the notebook is ready.","category":"page"},{"location":"#Scalar-Equations:-Chapter-1","page":"Home","title":"Scalar Equations: Chapter 1","text":"","category":"section"},{"location":"#Algorithms","page":"Home","title":"Algorithms","text":"","category":"section"},{"location":"","page":"Home","title":"Home","text":"The examples in the first chapter are scalar equations that illustrate many of the important ideas in nonlinear solvers. ","category":"page"},{"location":"","page":"Home","title":"Home","text":"infrequent reevaluation of the derivative \nsecant equation approximation of the derivative\nline searches\npseudo-transient continuation","category":"page"},{"location":"#Nonlinear-systems-with-direct-linear-solvers:-Chapter-2","page":"Home","title":"Nonlinear systems with direct linear solvers: Chapter 2","text":"","category":"section"},{"location":"","page":"Home","title":"Home","text":"The ideas from Chapter 1 remain important here. For systems the Newton step is the solution of the linear system","category":"page"},{"location":"","page":"Home","title":"Home","text":"F(x) s = - F(x)","category":"page"},{"location":"","page":"Home","title":"Home","text":"This chapter is about solving the equation for the Newton step with Gaussian elimination. Infrequent reevaluation of Fmeans that we also factor F infrequenly, so the impact of this idea is greater. Even better, there is typically no loss in the nonlinear iteration if we do that factorization in single precision. You an make that happen by giving nsold and ptcsold the single precision storage for the Jacobian. Half precision is also possible, but is a very, very bad idea. ","category":"page"},{"location":"","page":"Home","title":"Home","text":"Bottom line: __single precision can cut the linear algebra cost in half with no loss in the quality of the solution or the number of nonlinear iterations it takes to get there.","category":"page"},{"location":"#Nonlinear-systems-with-iterative-linear-solvers:-Chapter-3","page":"Home","title":"Nonlinear systems with iterative linear solvers: Chapter 3","text":"","category":"section"},{"location":"#Overview-of-the-Codes","page":"Home","title":"Overview of the Codes","text":"","category":"section"},{"location":"#Scalar-Equations:-Chapter-1-2","page":"Home","title":"Scalar Equations: Chapter 1","text":"","category":"section"},{"location":"","page":"Home","title":"Home","text":"There are two codes for the methods in this chapter","category":"page"},{"location":"","page":"Home","title":"Home","text":"nsolsc.jl is all variations of Newton's method except  pseudo transient continuation. The methods are\nNewton's method \nThe Shamanskii method, where the derivative evaluation is done every m iterations. m=1 is Newton and m=infty is chord.\nThe secant method\nYou have the option to do an Armijo line search for all the methods.\nptcsolsc.jl is pseudo-transient continuation. ","category":"page"},{"location":"#Nonlinear-systems-with-direct-linear-solvers:-Chapter-2-2","page":"Home","title":"Nonlinear systems with direct linear solvers: Chapter 2","text":"","category":"section"},{"location":"#Nonlinear-systems-with-iterative-linear-solvers:-Chapter-3-2","page":"Home","title":"Nonlinear systems with iterative linear solvers: Chapter 3","text":"","category":"section"}]
}
