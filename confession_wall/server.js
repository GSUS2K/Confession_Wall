import 'dotenv/config'
import express from 'express'
import session from 'express-session'
import mongoose from 'mongoose'
import MongoStore from 'connect-mongo'
import passport from 'passport'
import path from 'path'
import { fileURLToPath } from 'url'
import authRoutes from './routes/auth.js'
import confessionRoutes from './routes/confessions.js'
import './config/passport.js'

// process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

// config()

const __filename = fileURLToPath(import.meta.url)

const __dirname = path.dirname(__filename)

const app = express()

const PORT = process.env.PORT || 3000;

mongoose.connect(process.env.MONGO_URI)
.then(()=> console.log("MongoDB connected!"))
.catch((err)=>console.log("Failed to connect to MongoDB: ", err))

app.use(express.json())
app.use(express.urlencoded({extended: false}))
app.use(express.static(path.join(__dirname, 'public')))

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
        mongoUrl: process.env.MONGO_URI
    }),
    cookie: {
        maxAge: 7*24*60*60*1000
    }
}))

app.use(passport.initialize())
app.use(passport.session())

app.use('/auth', authRoutes)
app.use('/confessions', confessionRoutes)

app.get('/{*path}', (req,res)=> {
    res.sendFile(path.join(__dirname,'public','index.html'))
})

app.listen(PORT, ()=>
{
    console.log(`Server running at ${process.env.SERVER_URL}`)
})
