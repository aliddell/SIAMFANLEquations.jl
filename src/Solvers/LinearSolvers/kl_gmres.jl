"""
kl_gmres(x0, b, atv, V, eta, ptv=klnopc; 
            orth = "cgs2", side="left", pdata=nothing)

Gmres linear solver. Handles preconditioning and (coming soon) restarts. 
Uses gmres_base which is completely oblivious to these things.

The deal is

Input:
x0 = initial iterate, this is usually zero for nonlinear solvers

b = right hand side (duh!)

atv = matrix-vector product which depends on precomputed data pdta
      I expect you to use pdata most or all of the time, so it is not
      a keyword argument (at least for now). If your mat-vec is just
      A*v, you have to write a function where A is the precomputed data.

V = Preallocated n x K array for the Krylov vectors. I store the initial
    normalized residual in column 1, so  you have at most K-1 iterations
    before gmres_base returns a failure. kl_gmres will handle the restarts.

eta = Termination happens when ||b - Ax|| <= eta || b ||

ptv = preconditioner-vector product, which will also use pdata. The
      default is klnopc, which is no preconditioning at all.

Keyword arguments

pdata = precomputed data. The default is nothing, but that ain't gonna
        work well for nonlinear equations.

orth = your choice of the wise default, classical Gram-Schmidt twice,
       or something slow and less stable. Those are classical onece (really
       bad) or a couple variants of modified Gram-Schmidt. mgs2 is what I
       used in my old matlab codes. Not terrible, but far from great.

side = left or right preconditioning. The default is "left".

Other parameters on the way.
"""
function kl_gmres(x0, b, atv, V, eta, ptv=klnopc; 
            orth = "cgs2", side="left", pdata=nothing)
#
# Build some precomputed data to inform KL_atv about preconditioning ...
#
    if side == "right" || ptv == klnopc
       rhs = b
    else
       rhs=ptv(b,pdata)
    end
    Kpdata=(pdata=pdata, side=side, ptv=ptv, atv=atv)
    gout = gmres_base(x0, rhs, Katv, V, eta, Kpdata; orth = orth)
#
# Fixup the solution if preconditioning from the right.
#
    if side == "left" || ptv == klnopc
    return gout
    else
    sol=ptv(gout.sol,pdata)
    return (sol = sol, reshist = gout.reshist, lits=gout.lits)
    end
end

"""
Katv(x,Kpdata)

Builds a matrix-vector product to hand to gmres_base. Puts the preconditioner
in there on the correct side.
"""
function Katv(x,Kpdata)
pdata=Kpdata.pdata
ptv=Kpdata.ptv
atv=Kpdata.atv
side=Kpdata.side
if ptv == klnopc
   y=atv(x,pdata)
   return y
elseif side == "left"
   y=atv(x,pdata)
   return ptv(y,pdata)
elseif side == "right"
   y=ptv(x,pdata)
   return atv(y,pdata)
else
   println("Bad preconditioner side in Katv, side = ",side)
   println(side)
   error("not ready yet")
end
end

"""
gmres_base(x0, b, atv, V, eta, pdata; orth="mgs1")

Base GMRES solver. This is GMRES(m) with no restarts and no preconditioning.
The idea for the future is that it'll be called by kl_gmres (linear
solver) which
is the backend of klgmres.
"""
function gmres_base(x0, b, atv, V, eta, pdata; orth = "mgs1")
    (n, m) = size(V)
    #
    # Allocate for Givens
    #
    kmax = m - 1
#    x = copy(x0)
    r = copy(b)
    h = zeros(kmax + 1, kmax + 1)
    c = zeros(kmax + 1)
    s = zeros(kmax + 1)
    if norm(x0) > 0
#        q = b - atv(x0, pdata)
#        r .= q
#         r .= b
         r .-= atv(x0, pdata)
    end
    rho = norm(r)
    g = zeros(size(c))
    g[1] = rho
    errtol = eta * rho
    reshist = []
    #
    # Terminate on entry?
    #
    push!(reshist, rho)
    total_iters = 0
    k = 0
    if rho < errtol
        println("Terminating on entry")
        println("rho= ", rho, " errtol= ", errtol)
        return (sol = x, reshist = reshist, lits = k)
        return
    end
    #
    # Showtime!
    #
    @views V[:, 1] = r / rho
    beta = rho
    while (rho > errtol) && (k < kmax)
        k += 1
        @views V[:, k+1] .= atv(V[:, k], pdata)
        @views vv = vec(V[:, k+1])
        @views hv = vec(h[1:k+1, k])
        @views Vkm = V[:, 1:k]
        #
        # Don't mourn. Orthogonalize!
        #
        Orthogonalize!(Vkm, hv, vv, orth)
        #
        # Build information for new Givens rotations.
        #   
        if k > 1
            hv = @view h[1:k, k]
            giveapp!(c[1:k-1], s[1:k-1], hv, k - 1)
        end
        nu = norm(h[k:k+1, k])
        if nu != 0
            c[k] = conj(h[k, k] / nu)
            s[k] = -h[k+1, k] / nu
            h[k, k] = c[k] * h[k, k] - s[k] * h[k+1, k]
            h[k+1, k] = 0.0
            gv = @view g[k:k+1]
            giveapp!(c[k], s[k], gv, 1)
        end
        #
        # Update the residual norm.
        #
        rho = abs(g[k+1])
        push!(reshist, rho)
    end
    #
    # At this point either k = kmax or rho < errtol.
    # It's time to compute x and check out.
    #
    y = h[1:k, 1:k] \ g[1:k]
    qmf = view(V, 1:n, 1:k)
#    mul!(r, qmf, y)
#    r .= qmf*y    
#    x .+= r
    r.=x0
    mul!(r, qmf, y, 1.0, 1.0)
#    @views x .+= (V[1:n, 1:k] * y)
    return (sol = r, reshist = Float64.(reshist), lits = k)
end

function giveapp!(c, s, vin, k)
    nv = length(vin)
    for i = 1:k
        w1 = c[i] * vin[i] - s[i] * vin[i+1]
        w2 = s[i] * vin[i] + c[i] * vin[i+1]
        vin[i:i+1] .= [w1, w2]
    end
    return vin
end

#function klnopc(x,pdata)
#return x
#end