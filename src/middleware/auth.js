const jwt = require('jsonwebtoken')
const User = require('../models/user.model')

const auth  = async (req, res, next) => {
    try{
        const token =  req.header("Autherization").replace("Bearer")
        const decoded = jwt.verify(token,process.anv.JWT_SECRET)
        const user = await User.findOne({_id: decoded._id, 'tokens.token':token})

        if(!user){
            throw new Error()
        }
        req.token = token
        req.user = user
        next()
    }catch(e){
        res.status(401).send({error: "Please authenticate!"})
    }
}

module.exports = auth