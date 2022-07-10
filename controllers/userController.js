const User = require('../models/userModel')
const Token = require('../models/tokenModel')
const crypto = require('crypto')
const sendEmail = require('../utils/sendEmail')


exports.addUser = async (req,res) => {
    let user = await User.findOne({email: req.body.email})
    if(!user){
        let user = new User({
            username: req.body.username,
            email: req.body.email,
            password: req.body.password
        })

        let token = new Token({
            token: crypto.randomBytes(16).toString('hex'),
            user: user._id
        })
        if(!token){
            return res.status(400).json({error:"failed to create token"})
        }

        const url = `http://localhost:5000/api/emailconfirmation/${token.token}`
        sendEmail({
            from: "noreply@something.com",
            to: user.email,
            subject: "Verification email",
            text: `Welcome! ${user.username}. Please click on the following link to verify your email. ${url}`,
            html: `<a href='${url}'><button>Verify Email</button></a>`
        })

        user = await user.save()
        if(!user){
            return res.status(400).json({error: "something went wrong"})
        }
        res.send(user)

    }
    else{
        return res.status(400).json({error:"Email already exists."})
    }
}

// email confirmation
exports.confirmEmail = async (req, res) => {
    let token = await Token.findOne({
        token: req.params.token
    })
    if(!token){
        return res.status(400).json({error:"Token not found or may have expired"})
    }
    let user = await User.findById(token.user)
    if(!user){
        return res.status(400).json({error:"User not found or invalid token"})
    }
    if(user.isVerified){
        return res.status(400).json({error:"User already verified. Login to continue"})
    }
    user.isVerified = true
    user = await user.save()
    if(!user){
        return res.status(400).json({error: "Failed to verify. Please try again"})
    }
    res.status(200).json({message: "User verified Successfully"})
}
