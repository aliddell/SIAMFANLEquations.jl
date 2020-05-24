"""
ptcsc_test

Make sure ptcsc finds the stable steady state sqrt(2)/2

f(u) = u^3 - lambda u = 0 with lambda = 1/2

The answer(s!!) are u=0, -sqrt(2)/2, and sqrt(2)/2.

The initial iterate is u0=.1, so the correct answer is sqrt(2)/2.

I'm testing for correctness and a match of the iterations statistics

"""
function ptcsc_test()
u0=.1
ustable=.5*sqrt(2.0)
uunstable=0.0
#
# Convergence to the right solution
#
ptcdata1=ptcsc(sptest,u0; dt0=1.0, rtol=1.e-12, fp=sptestp)
ptcdata2=ptcsc(sptest,u0; dt0=1.0, rtol=1.e-12, keepsolhist=false)
dh=ptcdata1.history-ptcdata2.history
ndh=norm(dh[:,2],Inf)
fdok=(ndh < 1.e-7)
ptcerr=ptcdata1.solhist.-ustable
ptcfun=ptcdata1.history[:,2]
ptcdt=ptcdata1.history[:,3]
pival=ptcdata1.history[:,1]
solok=(abs(ptcdata1.solution-ustable) < 1.e-10)
funok=(abs(ptcdata1.functionval) < 1.e-12)
histok=(length(pival)==18)
ptcdataf=ptcsc(sptest,u0; dt0=.1, rtol=1.e-12)
failok=~ptcdataf.idid
ptcok=fdok && solok && funok && histok && failok
if ptcok
   println("Scalar PTC does the job")
else
   println(ptcdata1)
end
return ptcok
end
