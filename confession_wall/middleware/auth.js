const requireAuth = (req, res, next)=>{
    if(req.isAuthenticated()) return next()
        return res.status(401).json({ error: "Login if you want to confess!"})
}

export default requireAuth
