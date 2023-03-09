import express from 'express';
var router = express.Router();

import postRouter from './controllers/posts.js'
import userRouter from './controllers/users.js'
import saveRouter from './controllers/save.js'

router.use('/users', userRouter)
router.use('/posts', postRouter)
router.use('/save', saveRouter)

export default router;