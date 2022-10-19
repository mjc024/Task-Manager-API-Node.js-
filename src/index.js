const express =require('express')
require('./db/mongoose')


const userRouter = require('./routers/user')
const taskRouter = require('./routers/task')

const app=express()
const port= process.env.PORT    



app.use(express.json())
app.use(userRouter) 
app.use(taskRouter)


app.listen(port, ()=>{  
    console.log("Server is up on "+port)
})


// app.use((req,res,next)=>{
//     if(req.method=='GET'){
//         res.send("GET REQUESTS ARE DISABLED")
//     }
//     else{
//         next()
//     }
// })

// app.use((req,res,next)=>{
//     if(req.method){
//         res.status(503).send("Site unavailabe due to mantainance")
//     }
// })



// without midddleware: new rquest -> run route handler

// with midddleware: new rquest -> do something -> run route handler
// const Task = require('./models/task')
// // const User = require('./models/user')
// const User = require('./models/user')
// const main = async()=>{
//     // const task = await Task.findById('634959ad44f4b8571d61f67c')
//     // await task.populate('owner')
//     // console.log(task.owner)
//     const user = await User.findById('63494d3e296a84b3ff2d290d')
//     await user.populate('tasks')
//     console.log(user.tasks)

// }
// main()