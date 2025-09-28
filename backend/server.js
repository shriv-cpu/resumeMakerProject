import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import { connectDB } from './config/db.js'
import userRouter from './routes/userRoutes.js'

import path from 'path'
import { fileURLToPath } from 'url';
import resumeRouter from './routes/resumeRoutes.js'

const _filename = fileURLToPath(import.meta.url);
const _dirname = path.dirname(_filename);

const app = express()
const PORT = process.env.PORT || 4000

// connect db
connectDB()

// middleware
app.use(cors())
app.use(express.json())

// routes
app.use('/api/auth', userRouter)
app.use('/api/resume',resumeRouter)

app.use(
  '/uploads',
  express.static(path.join(_dirname, 'uploads'), {
    setHeaders: (res, _path) => {
      res.set('Access-Control-Allow-Origin','http://localhost:5173/')
    }
  })
)

app.get('/', (req, res) => {
  res.send('API WORKING')
})

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
