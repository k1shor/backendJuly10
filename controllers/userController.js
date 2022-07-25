const User = require('../models/userModel')
const Token = require('../models/tokenModel')
const crypto = require('crypto')
const sendEmail = require('../utils/sendEmail')
const jwt = require('jsonwebtoken')
const {expressjwt} = require('express-jwt')


exports.addUser = async (req, res) => {
    let user = await User.findOne({ email: req.body.email })
    if (!user) {
        let user = new User({
            username: req.body.username,
            email: req.body.email,
            password: req.body.password
        })

        let token = new Token({
            token: crypto.randomBytes(16).toString('hex'),
            user: user._id
        })
        token = await token.save()
        if (!token) {
            return res.status(400).json({ error: "failed to create token" })
        }

        // const url = `http://localhost:5000/api/confirmuser/${token.token}`
        const url = `${process.env.FRONTEND_URL}/confirmuser/${token.token}`
        sendEmail({
            from: "noreply@something.com",
            to: user.email,
            subject: "Verification email",
            text: `Welcome! ${user.username}. Please click on the following link to verify your email. ${url}`,
            html: `<a href='${url}'><button>Verify Email</button></a>`
        })

        user = await user.save()
        if (!user) {
            return res.status(400).json({ error: "something went wrong" })
        }
        // res.send(user)
        return res.status(200).json({message: "User Registered Successfully."})

    }
    else {
        return res.status(400).json({ error: "Email already exists." })
    }
}

// email confirmation
exports.confirmEmail = async (req, res) => {
    let token = await Token.findOne({
        token: req.params.token
    })
    if (!token) {
        return res.status(400).json({ error: "Token not found or may have expired" })
    }
    let user = await User.findById(token.user)
    if (!user) {
        return res.status(400).json({ error: "User not found or invalid token" })
    }
    if (user.isVerified) {
        return res.status(400).json({ error: "User already verified. Login to continue" })
    }
    user.isVerified = true
    user = await user.save()
    if (!user) {
        return res.status(400).json({ error: "Failed to verify. Please try again" })
    }
    res.status(200).json({ message: "User verified Successfully" })
}

// to resend confirmation
exports.resendConfirmation = async (req, res) => {
    let user = await User.findOne({ email: req.body.email })
    if (!user) {
        return res.status(400).json({ error: "Email not registered." })
    }
    if (user.isVerified) {
        return res.status(400).json({ error: "Email already verified" })
    }
    let token = new Token({
        token: crypto.randomBytes(16).toString('hex'),
        user: user.id
    })
    token = await token.save()
    if (!token) {
        return res.status(400).json({ error: "Something went wrong" })
    }
    const url = `${process.env.FRONTEND_URL}/confirmuser/${token.token}`
    // const url = `http://localhost:5000/api/confirmuser/${token.token}`
    sendEmail({
        from: "noreply@something.com",
        to: user.email,
        subject: "Verification email",
        text: `Welcome! ${user.username}. Please click on the following link to verify your email. ${url}`,
        html: `<a href='${url}'><button>Verify Email</button></a>`
    })

    return res.status(200).json({ message: "Verification link has been sent to your email." })

}

//forget password
exports.forgetpassword = async (req, res) => {
    let user = await User.findOne({ email: req.body.email })
    if (!user) {
        return res.status(400).json({ error: "Email not registered" })
    }
    let token = new Token({
        token: crypto.randomBytes(16).toString('hex'),
        user: user._id
    })
    token = await token.save()
    const url = `http://localhost:5000/api/resetpassword/${token.token}`
    sendEmail({
        from: "no-reply@something.com",
        to: user.email,
        subject: "Password Reset Link",
        text: `Please click on the link below to reset your password. ${url}`,
        html: `<a href='${url}'><button>Reset Password</button></a>`
    })
    return res.status(200).json({ message: "Password reset link has been sent to your email." })
}


// reset password
exports.resetPassword = async (req, res) => {
    // check token
    let token = await Token.findOne({ token: req.params.token })
    if (!token) {
        return res.status(400).json({ error: "Invalid token or token may have expired." })
    }
    // check user
    let user = await User.findById(token.user)
    if (!user) {
        return res.status(400).json({ error: "User not found" })
    }
    // change password
    user.password = req.body.password
    user = await user.save()
    if (!user) {
        return res.status(400).json({ error: "Failed to change password" })
    }
    return res.status(200).json({ message: "Password changed successfully" })
}

//signin
exports.signIn = async (req, res) => {
    const { email, password } = req.body
    // check email
    let user = await User.findOne({ email: email })
    if (!user) {
        return res.status(400).json({ error: "Email not registered" })
    }
    // check password
    if (!user.authenticate(password)) {
        return res.status(400).json({ error: "Email and password do not match." })
    }
    // check ifVerified
    if (!user.isVerified) {
        return res.status(400).json({ error: "User not verified. Please verify to continue" })
    }
    // generate token and approve signin
    const token = jwt.sign({ _id: user._id, role: user.role }, process.env.JWT_SECRET)

    res.cookie('myCookie', token, Date.now() + 86400)
    const { _id, username, role } = user
    return res.status(200).json({ token, user: { _id, username, role, email } })
}

// to view user list
exports.userList = async (req, res) => {
    let users = await User.find().select('-hashed_password').select('-salt')
    if (!users) {
        return res.status(400).json({ error: "something went wrong" })
    }
    res.send(users)
}
// to view user details
exports.userDetails = async (req, res) => {
    let user = await User.findById(req.params.id).select('-hashed_password').select('-salt')
    if (!user) {
        return res.status(400).json({ error: "Something went wrong" })
    }
    res.send(user)
}
//find user by email
exports.findByEmail = async (req, res) => {
    let user = await User.findOne({
        email: req.body.email
    }).select('-hashed_password').select('-salt')
    if (!user) {
        return res.status(400).json({ error: "User not found" })
    }
    res.send(user)
}

//update user
exports.updateUser = async (req, res) => {
    let user = await User.findByIdAndUpdate(req.params.id, {
        email: req.body.email,
        password: req.body.password,
        role: req.body.role
    }, { new: true })
    if(!user){
        return res.status(400).json({error:"something went wrong"})
    }
    res.send(user)
}

// delete user
exports.deleteUser = async (req, res) => {
    let user = await User.findByIdAndDelete(req.params.id)
    if(!user){
        return res.status(400).json({error:"User not found"})
    }
    return res.status(200).json({message: "User deleted successfully"})
}

// authorization
exports.requireSignin = expressjwt({
    algorithms:['HS256'],
    secret:process.env.JWT_SECRET
})