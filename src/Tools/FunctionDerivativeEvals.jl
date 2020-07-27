"""
PrepareDerivative(ItRules,x,xm,fc,fm)
"""
function PrepareDerivative(ItRules,x,xm,fc,fm)
newjac=0
newfun=0
fp=ItRules.fp
f=ItRules.f
h=ItRules.h
solver=ItRules.solver
if solver == "secant"
   df = (fc - fm) / (x - xm)
   newfun=newfun+1
else
   df = fpeval_newton(x, f, fc, fp, h)
   newjac=newjac+1
end
return df
end
