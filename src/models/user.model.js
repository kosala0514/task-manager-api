const mongoose = require('mongoose')
const validator = require("validator")
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const userSchema = new mongoose.Schema(
    {
        name:{
            type:String ,
            required:true,
            trim:true
        },
        email:{
            type:String,
            unique:true,
            required:true,
            validate(value){
                if(!validator.isEmail(value)){
                    throw new Error("E-mail is not valid!")
                }
            },
            trim:true, //for remove space
            lowercase:true
        },
        password:{
            type: String,
            required: true,
            minlength: 7,
            validate(value){
                if (value.toLowerCase().includes("password")){
                    throw new Error("Password must not containn 'password'")
                }
            },
            trim:true,
    
        },
        age:{
            type:Number,
            default: 0,
            validate(value){
                if(value < 0){
                    throw new Error("Age must be a positive number!")
                }
            }
        },
        tokens:[{
            token:{
                type:String,
                required:true,
            }
        }],
        avatar: {
            type:Buffer
        }
    },{
        timestamps:true
    })

userSchema.pre('save', async function(next){
    const user = this
    if(user.isModified('password')){
        user.password = await bcrypt.hash(user.password, 8)
    }
    next()
})

userSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({email})
    if(!user){
        throw new Error("Unable to login!")
    }
    const isMatch = await bcrypt.compare(password, user.password)
    if(!isMatch){
        throw new Error("Unable to login!")
    }
    return user
}

userSchema.methods.generateAuthToken = async function(){
    const user = this
    const token = jwt.sign({_id: user._id.toString()}, process.env.JWT_SECRET)
    return token
}

userSchema.method.toJSON = function () {
    const user = this
    const userObj = user.toObject()
    delete userObj.password
    delete userObj.token
    delete userObj.avatar

    return userObj
}

userSchema.virtual('tasks',{
    ref: 'Task',
    localField: '_id',
    foreignField:'owner'
})

userSchema.pre('remove', async function(next){
    const user = this
    await Task.deleteMany({owner:user._id})
    next()
})

const User = mongoose.model('User',userSchema)

module.exports = User