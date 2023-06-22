import express from 'express'
import mongoose from 'mongoose'
import multer from 'multer'
import cors from 'cors'

import { loginValidator, registerValidator } from './validations/auth.js'
import checkAuth from './utils/checkAuth.js'
import * as UserController from './controllers/UserController.js'
import * as PostController from './controllers/PostController.js'
import { postCreateValidator } from './validations/post.js'

mongoose
    .connect('mongodb+srv://admin:sanders025@cluster0.sjzrysu.mongodb.net/blog?retryWrites=true&w=majority')
    .then(() => console.log('SERVER OK'))
    .catch((err) => console.log('SERVER NOT OK', err))

const app = express()
app.use(cors())

const storage = multer.diskStorage({
    destination: (_, __, cb) => {
        cb(null, 'uploads')
    },
    filename: (_, file, cb) => {
        cb(null, file.originalname)
    }
})

const upload = multer({ storage })

app.use(express.json())
app.use('/uploads', express.static('uploads'))

app.get('/auth/me', checkAuth, UserController.getMe)
app.post('/auth/register', registerValidator, UserController.register)
app.post('/auth/login', loginValidator, UserController.login)

app.post('/upload', checkAuth, upload.single('image'), (req, res) => {
    console.log(res);
    res.json({
        url: `/uploads/${req.file.originalname}`
    })
})
app.post('/avatar', upload.single('image'), (req, res) => {
    console.log(req);
    res.json({
        url: `/uploads/${req.file.originalname}`
    })
})
app.get('/me/posts', checkAuth, PostController.getUserPosts)
app.get('/load-more', PostController.getMorePosts)
app.get('/posts/:id', PostController.getOne)
app.delete('/posts/:id', checkAuth, PostController.remove)
app.patch('/posts/:id', checkAuth, postCreateValidator, PostController.update)
app.get('/posts', PostController.getAll)
app.post('/posts', checkAuth, postCreateValidator, PostController.create)
app.get('/tags', PostController.getAllTags)

app.listen(4444, (err) => {
    if (err) {
        console.log('Server Error!');
    }
    console.log('Hello World!');
})