import express from 'express'
import Confession from '../models/Confession.js'
import requireAuth from '../middleware/auth.js'

const router = express.Router()

// router.get('/', async (req,res)=>{
//     try{
//         const confessions = await Confession.find()
//         .sort({createdAt: -1})
//         .select('-secretCode -userId')
//         res.json({success: true, data: confessions})
//     }
//     catch (err){
//         res.status(500).json({error: "Failed to fetch confessions!"})
//     }
// })

router.get('/', async (req, res) => {
  try {
    const confessions = await Confession.find()
      .sort({ createdAt: -1 })
      .select('-secretCode');

    const data = confessions.map(c => {
      const obj = c.toObject();
      obj.isOwner = req.isAuthenticated() && req.user.googleId === c.userId;
      delete obj.userId;
      return obj;
    });

    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch confessions.' });
  }
});

router.post('/', requireAuth, async (req,res)=>{
    // console.log('user:', req.user);
    // console.log('body:', req.body);
    try{
        const { text, secretCode } = req.body

        if(!text || text.trim().length<5 ){
            return res.status(400).json({error: "Confession must be atleast 5 characters long!"})
        }
        if(!secretCode || secretCode.trim().length<4 ){
            return res.status(400).json({error: "Confession must be atleast 4 characters long!"})
        }

        const confession = await Confession.create({
            text: text.trim(),
            secretCode,
            userId: req.user.googleId
        })

        const saved = confession.toObject()
        delete saved.secretCode;
        delete saved.userId

        res.status(201).json({success: true, data: saved})
    }
    catch(err){
        console.log('error:', err);
        res.status(500).json({error: 'Confession failed to post!'})
    }
})

router.put('/:id', requireAuth, async (req,res)=>{
    try{
        const {text,secretCode} = req.body;

        if(!text || text.trim().length<5 ){
            return res.status(400).json({error: "Confession must be atleast 5 characters long!"})
        }
        if(!secretCode){
            return res.status(400).json({error: "Secret code is required to edit confession!"})
        }

        const confession = await Confession.findById(req.params.id)
        if(!confession) {
            return res.status(404).json({error: "Confession not found"})
        }

        const isValid = await confession.verifyCode(secretCode)
        if(!isValid){
            return res.status(403).json({error: "Incorrect secret code!"})
        }

        confession.text = text.trim()
        confession.updatedAt = new Date()
        await confession.save()

        const updated = confession.toObject()
        delete updated.secretCode
        delete updated.userId

        res.json({success: true, data: updated})
    }
    catch(err){
        res.status(500).json({error: "Failed to update confession!"})
    }
})

router.delete('/:id', requireAuth, async (req,res)=>{
    try{
        const {secretCode} = req.body;

        if(!secretCode){
            return res.status(400).json({error: "Secret code is required to delete confession!"})
        }

        const confession = await Confession.findById(req.params.id)
        if(!confession) {
            return res.status(404).json({error: "Confession not found"})
        }

        const isValid = await confession.verifyCode(secretCode)
        if(!isValid){
            return res.status(403).json({error: "Incorrect secret code!"})
        }

        await confession.deleteOne()
        res.json({success: true, message: "Confession is deleted!"})
    }
    catch(err){
        res.status(500).json({error: "Failed to delete confession!"})
    }
})

router.post('/:id/react', async (req,res)=>{
    // console.log('react body:', req.body);
    try{
        const {type}=req.body

        const validTypes = ['like', 'love', 'laugh', 'cry']

        if(!validTypes.includes(type)){
            return res.status(400).json({error: "Invalid reaction type!"})
        }

        // const confession = await Confession.findById(req.params.id,
        //     { $inc: { [`reactions.${type}`]: 1}},
        //     { new: true}
        // )

        // if(!confession){
        //     return res.status(404).json({error: "Confession not found!"})
        // }

        const confession = await Confession.findById(req.params.id);

        if(!confession){
            return res.status(404).json({error: "Confession not found!"})
        }

        confession.reactions[type]+=1;
        await confession.save()

        res.json({success: true, reactions: confession.reactions})
    }
    catch(err){
        // console.log('react error:', err);
        res.status(500).json({error: "Faile to react!"})
    }
})

export default router;
