import express from 'express';
var router = express.Router();

import postRouter from './controllers/posts.js'
import userRouter from './controllers/users.js'

router.use('/users', userRouter)
router.use('/posts', postRouter)

export default router;