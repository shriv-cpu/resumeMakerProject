import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import { connectDB } from './config/db.js'
import userRouter from './routes/userRoutes.js'

const app = express()
const PORT = process.env.PORT || 4000

// connect db
connectDB()

// middleware
app.use(cors())
app.use(express.json())

// routes
app.use('/api/auth', userRouter)

app.get('/', (req, res) => {
  res.send('API WORKING')
})

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
