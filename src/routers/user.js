const express = require('express')
const router = new express.Router()
const multer = require('multer')
const sharp = require('sharp')

const User = require('../models/user.model')
const auth = require('../middleware/auth')

const { sendWelcomeEmail, sendCancelEmail } = require('../emails/account')

router.post('/users', async (req, res) =>{
    const user= new User(req.body)
    try {        
        await user.save()
        sendWelcomeEmail(user.email, user.name)
        const token = await user.generateAuthToken()
        res.status(201).send({user, token})
    } catch (e) {
        res.status(400).send(e.message)
    }
    // user.save().then(()=>{
    //     res.send(user)
    // }).catch((e)=>{
    //     res.status(400).send(e.message)
    // })
})

router.post('/users/login', async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthToken()
        user.tokens = user.tokens.concat({token})
        // await user.save()
        res.send({user, token}) // methnadi toJSON methid eka cal wela private data enne na
    } catch (e) {
        res.status(400).send(e.message)
    }
})

router.post('/users/logout', auth,  async (req, res) => {
    try{
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token
        })
        await req.user.save()

        res.send()
    }catch(e){
        res.status(500).send()
    }
})

router.post('/users/logoutAll', auth, async (req, res) => {
    try {
        req.user.tokens = []
        await req.user.save()
        res.send()
    } catch (error) {
        res.status(500).send()
    }
})

// router.get('/users', async (req, res)=>{
//     try {
//         const user = await User.find({})
//         res.send(user)
//     } catch (e) {
//         res.status(500).send(e.message)
//     }
//     // User.find({}).then((users)=>{
//     //     res.send(users)
//     // }).catch((e)=>{
//     //     res.status(500).send(e.meddage) //db connection lost
//     // })
// })

router.get('/users/me',auth, async (req, res)=>{
    res.send(req.user)
    // const _id =  req.params.id

    // try {
    //     const user = await User.findById(_id)
    //     if(!user){
    //         return res.status(400).send()
    //     }
    //     res.send(user)
    // } catch (e) {
    //     res.status(500).send(e.message)
    // }

    // User.findById(_id).then((user)=>{
    //     if(!user){
    //         return res.status(400).send()
    //     }
    //     res.send(user)
    // }).catch((e)=>{
    //     res.status(500).send()
    // })
})

router.patch('/users/me',auth,  async (req, res) =>{
    const updates = Object.keys(req.body)
    const updateAllow = [ 'name', 'email', 'password','age']
    const isValidOperation = updates.every((update)=> updateAllow.includes(update))
    if (!isValidOperation){
        return res.status(400).send({error:'Invalid updates!'})
    }
    try {
        updates.forEach((update) => req.user[update] = req.body[update])
        await req.user.save()
        res.send(req.user)
    } catch (e) {
        res.status(500).send(e.message)
    }
})

router.delete('/users/me',auth,  async (req, res) => {
    try{
        await req.user.remove()
        sendCancelEmail(req.user.email, req.user.name)
        res.send(req.user)
    }catch(e){
        res.status(500).send(e.message)
    }
})

const upload = multer({
    // dest: 'avatars',
    limits: {
        fileSize:1000000
    },
    fileFilter(req, file, cb){
        if(!file.originalname.match(/\.(jpg|jpeg|png)$/)){
            return cb(new Error("Please upload an image!"))
        }
        cb(undefined, true)
    }
})

router.post('/users/me/avatar', auth, upload.single('avatar'), async(req, res) => {
    // req.user.avatar = req.file.buffer   // store file as  it is. no change of file size
    const buffer = await sharp(req.file.buffer).resize({ width : 250, height  :250}).png().toBuffer()
    req.user.avatar = buffer
    await req.user.save()
    res.send()
},(error, req, res, next)=>{
    res.status(404).send({error:error.message})
})

router.delete('/users/me/avatar', auth, async (req, res)=>{
    req.user.avatar = undefined
    await req.user.save()
    res.send()
})

router.get('/users/:id/avatar', async (req, res) => {
    try {
        const user = await User.findById(req.params.id)

        if(!user || !user.avatar){
            throw new Error()
        }

        res.set('Content-Type', 'image/png')
        res.send(user.avatar)
    } catch (error) {
        res.status(404).send()
    }
})


module.exports = router
// router.patch('/user/:id', async (req, res) =>{
//     const updates = Obect.keys(req.body)
//     const updateAllow = [ 'name', 'email', 'password','age']
//     const isValidOperation = updates.every((update)=> updateAllow.includes(update))
//     if (!isValidOperation){
//         return res.status(400).send({error:'Invalid updates!'})
//     }
//     try {
//         // const user =  await User.findByIdAndUpdate(req.params.id, req.body, { new : true, runValidators:true })
//         const user =  await User.findById(req.params.id)
//         updateds.forEach((update) => user[update] = req.body[update])
//         await user.save()
        
//         if(!user){
//             return res.status(400).send()
//         }
//         res.send(user)
//     } catch (e) {
//         res.status(500).send(e.message)
//     }
// })

// router.delete('/users/:id', async (req, res) => {
//     try{
//         const user = await User.findByIdAndDelete(req.params.id)
//         if(!user){
//             return res.status(400).send()
//         }
//         res.send(user)
//     }catch(e){
//         res.status(500).send(e.message)
//     }
// })
