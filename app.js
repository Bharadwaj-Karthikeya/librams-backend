import dotenv from 'dotenv'
dotenv.config()

import cors from 'cors'
import morgan from 'morgan'
import express from 'express'
import cookieParser from 'cookie-parser'

import bookRoutes from './routes/bookRoutes.js'
import userRoutes from './routes/userRoutes.js'
import issueRoutes from './routes/issueRoutes.js'

const app = express()

app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
}))

app.use(morgan('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())

app.use('/books', bookRoutes)
app.use('/users', userRoutes)
app.use('/issues', issueRoutes)

export default app