import 'dotenv/config'

import cors from 'cors'
import morgan from 'morgan'
import express from 'express'
import cookieParser from 'cookie-parser'
import mongoose from 'mongoose'

import connectDB from './config/db.js'
import startOverdueCron from './cron/overdueCron.js'

import authRoutes from './routes/auth.route.js'
import bookRoutes from './routes/books.route.js'
import issueRoutes from './routes/issue.route.js'

const app = express()

app.use(cors({
    origin: [process.env.FRONTEND_URL, "http://localhost:5173"],
    credentials: true,
}))

app.use(morgan('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())

connectDB()

mongoose.connection.once('open', () => {
    startOverdueCron()
})

app.use('/auth', authRoutes)
app.use('/books', bookRoutes)
app.use('/issues', issueRoutes)

export default app