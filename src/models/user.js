const mongoose =require('mongoose')
const validator= require('validator')
const Task = require('./task')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
//Middleware is run before and after an event like save update using this
const userSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true,
        trim:true
    },
    email:{
        type:String,
        required:true,
        trim:true,
        unique: true,
        lowercase: true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error('Email is invalid')
            }
        }
        
    },
    password:{
        type: String,
        required: true,
        trim:true,
        minlength:7,
        validate(value){
            if( value.includes('password')){
                throw new Error('Password can not be password')
            }
            // else if(value.length<=6){
            //     throw new Error('Length should be greater than 6')
            // }
        }
    },
    age:{
        type: Number,
        default:0,
        validate(value){
            if(value<0){
                throw new Error('Age should be > 0')
            }
        }
    },
    tokens: [{
        token:{
        type:String,
        required: true
        }
    }],
    avatar:{
        type:Buffer    
    },

   },
   
   {
    timestamps: true})
// A virtual property is not  actual data stored on db, it's a relationship b/w two entities

userSchema.virtual('tasks',{
    ref: 'Task',
    localField: '_id',
    foreignField: 'owner'
})

userSchema.methods.toJSON =  function(){
    const user =this
    const userObject = user.toObject()
    
    delete userObject.password
    delete userObject.tokens
    delete userObject.avatar
    return userObject
}

//Methods are accessible to instance
userSchema.methods.generateAuthToken = async function(){
     const user =this
     const token = jwt.sign({_id:user._id.toString()},process.env.JWT_SECRET)
     user.tokens = user.tokens.concat({token})
     await user.save()
     return token
}

//Static methods are accesible on model
userSchema.statics.findByCredentials = async(email,password)=>{
    const user = await User.findOne({email})
    
    if(!user){
        throw new Error('Unable to login')
    }

    const isMatched = await bcrypt.compare(password,user.password)
    if(!isMatched){
        throw new Error("Unable to login")
    }

    return user
}


//For Hashing the password
userSchema.pre('save',async function(next){
    //this gives us access to individual user being saved
    const user =this
    // console.log("Just Beforee")
    if(user.isModified('password')){
        user.password= await bcrypt.hash(user.password,8)
    }
    //next means to pre operation has been perfomed
    next()
})
//Delete tasks when a user is removed
userSchema.pre('remove',async function(next){
    const user= this    
    await Task.deleteMany({owner:user._id})
    next()

}) 
const User =mongoose.model('User',userSchema)

module.exports=User