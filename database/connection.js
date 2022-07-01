const mongoose = require('mongoose')

// mongoose.connect(process.env.DATABASE,{
    // useNewUrlParser: true,
    // useUnifiedTopology: true
// } ()=>{
    // console.log("Database connected successfully")
// })

mongoose.connect(process.env.DATABASE,{
    useNewUrlParser:true,
    useUnifiedTopology: true
})
.then(()=>console.log("DATABASE CONNECTED"))
.catch(err=>console.log(err))