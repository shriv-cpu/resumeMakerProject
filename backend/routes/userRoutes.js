import express from 'express'
import { registerUser, loginUser, getUserProfile } from '../controllers/userController.js'
import { protect } from '../middleware/authMiddleware.js'

const userRouter = express.Router()

// Public routes
userRouter.post('/register', registerUser)
userRouter.post('/login', loginUser)

// Protected route
userRouter.get('/profile', protect, getUserProfile)

export default userRouter
