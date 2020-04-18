module SIAMFANLEquations

#using PyPlot
#using LaTeXStrings

export nsolsc
export difffp
export fpeval_newton
export ptcsc

include("Tools/difffp.jl")
include("Tools/fpeval_newton.jl")
include("nsolsc.jl")
include("ptcsc.jl")

module TestProblems
using LinearAlgebra

export
#Functions
fcos,
fpatan,
spitchfork,
linatan,
sptestp,
sptest

include("TestProblems/fcos.jl")
include("TestProblems/fpatan.jl")
include("TestProblems/spitchfork.jl")
include("TestProblems/linatan.jl")
end


end # module
