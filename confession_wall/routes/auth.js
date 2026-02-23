import express from 'express'
import passport from 'passport'

const router = express.Router()

router.get('/google', passport.authenticate('google', {
    scope: ['profile', 'email']
}))

router.get('/google/callback', passport.authenticate('google',{failureRedirect: '/?error=auth_failed'}),
    (req,res)=>{
        // console.log('SERVER_URL:', process.env.SERVER_URL);
        res.redirect(process.env.SERVER_URL)
    }
)

router.post('/logout', (req,res)=>{
    req.logout((err)=>{
        if (err) return res.status(500).json({error: "Failed to logout!"});
        req.session.destroy(()=>
        {
            res.json({success: true})
        })
    })
})

router.get('/me', (req,res)=>{
    if(req.isAuthenticated()) {
        return res.json({
            loggedIn: true,
            user: {
                id: req.user._id,
                displayName: req.user.displayName,
                email: req.user.email,
                avatar: req.user.avatar
            }
        })
    }
    res.json({loggedIn: false, user: null})
})

export default router;
