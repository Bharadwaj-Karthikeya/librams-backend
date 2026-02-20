import dotenv from 'dotenv'
dotenv.config()

import cors from 'cors'
import morgan from 'morgan'
import express from 'express'
import cookieParser from 'cookie-parser'

import connectDB from './config/db.js'

import authRoutes from './routes/auth.route.js'
// import bookRoutes from './routes/bookRoutes.js'
// import issueRoutes from './routes/issueRoutes.js'

const app = express()

app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
}))

app.use(morgan('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())

connectDB()

app.use('/auth', authRoutes)
// app.use('/books', bookRoutes)
// app.use('/issues', issueRoutes)

export default app