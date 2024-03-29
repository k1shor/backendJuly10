const express = require('express')
require('dotenv').config()
const db = require('./database/connection')

const bodyParser = require('body-parser')
const morgan = require('morgan')
const cors = require('cors')

const DemoRoute = require('./routes/demoroute')
const CategoryRoute = require('./routes/categoryRoute')
const ProductRoute = require('./routes/productRoute')
const UserRoute = require('./routes/userRoute')
const OrderRoute = require('./routes/orderRoute')


const port = process.env.PORT || 8000
const app = express()

// middleware
app.use(bodyParser.json())
app.use(morgan('dev'))
app.use(cors())


// Routes
app.use(DemoRoute)
app.use('/api',CategoryRoute)
app.use('/api',ProductRoute)
app.use('/api',UserRoute)
app.use('/api',OrderRoute)

app.use('/api/public/uploads', express.static('public/uploads'))


app.get('/',(request,response)=>{
    response.send("Welcome to express js.")
})

app.get('/first', (req,res)=>{
    res.send("Good morning! This is express js.")
})




app.listen(port, ()=>{console.log(`APP started at port ${port}`)})