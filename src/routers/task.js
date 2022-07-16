const express = require('express')
const router = new express.Router()
const Task = require('../models/task.model')
const auth = require('../middleware/auth')

router.post('/tasks',auth, async(req, res)=>{
    // const task = new Task(req.body)
    const task = new Task({
        ...req.body,
        owner: req.user._id
    })

    try {
        await task.save()
        res.status(201).send(task)
    } catch (e) {
        res.status(400).send(e)
    }
    // task.save().then(()=>{
    //     res.status(201).send(task)
    // }).catch((e) => {
    //     res.status(400).send(e.message)
    // })
})

router.get('/tasks', auth, async (req, res) => {
    const match = {}
    const sort = {}

    if (req.query.complete) {
        match.complete = req.query.complete === 'true'
    }

    if (req.query.sortBy) {
        const parts = req.query.sortBy.split(':')
        sort[parts[0]] = parts[1] === 'desc' ? -1 : 1
    }

    try {
        await req.user.populate({
            path: 'tasks',
            match,
            options: {
                limit: parseInt(req.query.limit),
                skip: parseInt(req.query.skip),
                sort
            }
        })
        res.send(req.user.tasks)
    } catch (e) {
        res.status(500).send(e.message)
    }
})

router.get('/tasks/:id',auth,  async(req, res)=>{
    const _id =  req.params.id

    try {
        const task = await Task.findById({_id, owner:req.user._id})
        if(!task){
            return res.status(400).send()
        }
        res.send(task)
    } catch (e) {
        res.status(500).send()
    }

    // Task.findById(_id).then((task)=>{
    //     if(!task){
    //         return res.status(400).send()
    //     }
    //     res.send(task)
    // }).catch((e)=>{
    //     res.status(500).send()
    // })
})

router.patch('/tasks/:id',auth, async(req, res) => {
    const updates = Object.keys(req.body)
    const allowupdates = ['description','complete']
    const isValidOperation = updates.every((update) => allowupdates.includes(update))

    if (!isValidOperation){
        return res.status(400).send({error: "Invalid Updates"})
    }
    try{
        // const task =  await Task.findByIdAndUpdate(req.params.id, req.body, {new: true, runValidator: true})
        const task = await Task.findOne({_id:req.params.id, owner:req.user._id})
        if(!task){
            return res.status(404).send()
        }
        updates.forEach((update) => task[update] = req.body[update])
        await task.save()

        
        res.send(task)
    }catch (e){
        res.status(500).send(e.message)
    }
})

router.delete('/tasks/:id',auth,  async (req, res) => {
    try{
        // const task = await Task.findByIdAndDelete(req.params.id)
        const task = await Task.findOneAndDelete({_id: req.params.id, owner:req.user._id})
        if(!task){
            return res.status(400).send()
        }
        res.send(task)
    }catch(e){
        res.status(500).send(e.message)
    }
})

module.exports = router