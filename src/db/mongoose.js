const mongoose = require('mongoose')
// const validator = require("validator")

mongoose.connect(process.env.MONGOBD_URL)

// const User = mongoose.model('User',{
//     name:{
//        type:String ,
//        required:true,
//        trim:true
//     },
//     email:{
//         type:String,
//         required:true,
//         validate(value){
//             if(!validator.isEmail(value)){
//                 throw new Error("E-mail is not valid!")
//             }
//         },
//         trim:true, //for remove space
//         lowercase:true
//     },
//     password:{
//         type: String,
//         required: true,
//         minlength: 7,
//         validate(value){
//             if (value.toLowerCase().includes("password")){
//                 throw new Error("Password must not containn 'password'")
//             }
//         },
//         trim:true,

//     },
//     age:{
//         type:Number,
//         default: 0,
//         validate(value){
//             if(value < 0){
//                 throw new Error("Age must be a positive number!")
//             }
//         }
//     }
// })


// const me = new User({
//     name:"Cha ru",
//     age: 25,
//     email : "CK@gmail.com ",
//     password: "IIrtf4545"
// })

// me.save().then(()=>{
//     console.log(me)
// }).catch((error)=>{
//     console.log('Error : ', error.message)
// })


//this "Task" - convert into lower case and get it as collection name



// const task = new Task({
//     description:"          Reading a book!",
// })

// //save method is a promise
// task.save().then(()=>{
//     console.log(task)
// }).catch((error)=>{
//     console.log("Task Error : ",error.message)
// })