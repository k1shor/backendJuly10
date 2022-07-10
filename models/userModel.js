const mongoose = require('mongoose')
const uuidv1 = require('uuidv1')
const crypto = require('crypto')

const userSchema = mongoose.Schema({
    username:{
        type: String,
        required: true,
        trim: true
    }, 
    email: {
        type: String,
        required: true
    },
    hashed_password:{
        type: String,
        required: true
    },
    role:{
        type: Number,
        required: true,
        default: 0              // 0 - normal user, 1 - admin user
    },
    isVerified:{
        type: Boolean,
        default: false
    },
    salt: String
},{timestamps:true})

// virtual field
userSchema.virtual('password')
.set(
    function(password){
        this._password = password
        this.salt = uuidv1()
        this.hashed_password = this.encryptPassword(this._password)
    }
)
.get(
    function(){
        return  this._password
    }
)

//methods
userSchema.methods ={
    encryptPassword: function(password){
        if(password == null){
            return ''
        }
        try{
            return crypto.createHmac('sha256',this.salt).update(password).digest('hex')
        }
        catch{
            return ''
        }
    }
}

module.exports = mongoose.model("User",userSchema)