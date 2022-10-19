const mongoose =require('mongoose')
mongoose.connect(process.env.MONGODB_URL)


// const me= new User({
//     name: 'Pheonix2',
//     email: "ali@mead.io",
//     password: 'password123',
//     age: 2    

// })

// me.save().then(()=>{console.log("donee"+me)}).catch((error)=>{
//     console.log(error)
// })

// const task =mongoose.model('task',{
//     description:{
//         trim:true,
//         required:true,
//         type: String
//     },
//     completed:{
//         default:false,
//         type: Boolean
//     }
// })


// const  task1= new task({
//     description:'   Completing Node js course'
    
// })
// task1.save().then(()=>{
//     console.log(task1)
// }).catch((error)=>{console.log('Erorrrr')})