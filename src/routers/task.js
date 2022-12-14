const express = require('express')
const Task = require('../models/task')
const auth = require('../middleware/auth')
// const User =  require('../models/user')

const router = new express.Router()
 
router.post('/tasks', auth,async (req,res)=>{
  
    const task = new Task({
        ...req.body,
        //.. copies it to Task object
        owner: req.user._id
    })
    try{
        await task.save()
        res.status(201).send(task)
    }catch(e){
        res.status(400).send(e)
    }
    

})

//PAgination limit skip
//GET/tasks?limit=10&skip=10 =>second page
//GET/tasks?sortBy=createdAt_desc asc=1 desc =-1
router.get('/tasks',auth,async(req,res)=>{
    const match = {}
    const sort ={}
    if(req.query.completed){
        match.completed= req.query.completed === 'true'
    }
    if(req.query.sortBy){
        const parts = req.query.sortBy.split(':')
        sort[parts[0]] = parts[1] === 'desc'? -1 : 1
    }
    try{
    //    const task= await Task.find({owner:req.user._id})
                  ///OR///////       
      await req.user.populate({
        path:'tasks', 
        match,
        options:{
            limit: parseInt(req.query.limit),
            skip:parseInt(req.query.skip),
            sort
        }
     }) 
          
      res.send(req.user.tasks)
    }catch(e){
        res.status(500).send(e)
    }

})


router.get('/tasks/:id', auth, async(req,res)=>{
    const _id= req.params.id
    try{
    //    const task=await Task.findById(_id)
    const task = await Task.findOne({_id, owner:req.user._id})
       if(!task){
        return res.status(404).send()
        }
        res.send(task)
    }catch(e){
        res.status(500).send(e)
    }
    
})
router.patch('/tasks/:id',auth,async(req,res)=>{
    const updates = Object.keys(req.body)
    const allowedUpdates=['description','completed']
    const isAllowed = updates.every((update)=>allowedUpdates.includes(update))
    if(!isAllowed){
        return res.status(400).send("Trying to update an inavlid field")
    }
    try{
        // const task =await Task.findByIdAndUpdate(req.params.id,req.body,{new:true,runValidators:true})
        const task = await Task.findOne({_id:req.params.id,owner:req.user._id})
        
        if(!task){
            res.status(404).send()
        }
        updates.forEach((update)=>task[update]=req.body[update])
        await task.save()
        res.send(task)
    }catch(e){
        res.status(400).send()
    }
    
})

router.delete('/tasks/:id',auth,async(req,res)=>{
    try{
        const task =await Task.findOneAndDelete({_id:req.params.id,owner:req.user._id})
        if(!task){
            res.status(404).send()
        }
        res.send(task)

    }catch(e){
        res.status(400).send()
    }
})
module.exports=router