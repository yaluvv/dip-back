import PostModel from "../models/Post.js";
import { validationResult } from 'express-validator';

export const create = async (req, res) => {
    try {
        const errors = validationResult(req)

        if (!errors.isEmpty()) {
            return res.status(400).json(errors.array())
        }

        const doc = new PostModel({
            title: req.body.title,
            text: req.body.text,
            imageUrl: req.body.imageUrl,
            tags: req.body.tags,
            user: req.userId,
        })

        const post = await doc.save()
        res.json(post)

    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Не удалось создать статью'
        })
    }
}

export const getOne = async (req, res) => {
    try {
        const postId = req.params.id

        const post = await PostModel.findOneAndUpdate(
            {
                _id: postId
            },
            {
                $inc: { viewsCount: 1 }
            },
            {
                returnDocument: 'after'
            },
        ).populate('user').exec()
        res.json(post)

    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Не удалось получить статью'
        })
    }
}

export const remove = async (req, res) => {
    try {
        const postId = req.params.id
        const post = await PostModel.findByIdAndDelete(postId)
        console.log(post);
        if (!post) {
            res.status(404).json({ message: 'Не удалось найти данную статью' })
        }
        res.json({ success: true, postId })
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Не удалось удалить статью'
        })
    }
}

export const getAll = async (req, res) => {
    try {
        let sortName = {}
        let limitCount = req.query?.limit || 4

        const countPosts = await PostModel.find().count()

        switch (req.query?.sort) {
            case 'popular': {
                sortName = { viewsCount: -1 }
                break
            }
            case 'new': {
                sortName = { createdAt: -1 }
                break
            }
            default: break
        }


        const items = await PostModel.find().sort(sortName).limit(limitCount).populate('user').exec()
        res.json({
            items,
            countPosts,
        })


    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Не удалось получить все статьи'
        })
    }
}

export const getMorePosts = async (req, res) => {
    try {
        let sortName = {}

        switch (req.query?.sort) {
            case 'popular': {
                sortName = { viewsCount: -1 }
                break
            }
            case 'new': {
                sortName = { createdAt: -1 }
                break
            }
            default: break
        }

        const data = await PostModel.find().sort(sortName).populate('user').exec()
        const items = data.splice(req.query.skip ? req.query.skip : 0, req.query.limit)

        res.json(items)

    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Не удалось получить все статьи'
        })
    }
}

export const getUserPosts = async (req, res) => {

    try {
        console.log(req.userId);
        const userPosts = await PostModel.find({ user: req.userId })
        console.log(userPosts);

        res.json(userPosts)
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Не удалось получить все статьи'
        })
    }
}
export const update = async (req, res) => {
    try {
        const postId = req.params.id

        const errors = validationResult(req)

        if (!errors.isEmpty()) {
            return res.status(400).json(errors.array())
        }

        await PostModel.updateOne({
            _id: postId
        }, {
            title: req.body.title,
            text: req.body.text,
            imageUrl: req.body.imageUrl,
            user: req.userId,
            tags: req.body.tags
        })

        res.json({
            success: true
        })

    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Не удалось обновить статью'
        })
    }
}
export const getAllTags = async (req, res) => {
    try {
        const posts = await PostModel.find().limit(5).exec()

        const tags = posts.map(obj => obj.tags).flat().slice(0, 5)

        res.json(tags)
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Не удалось получить все теги'
        })
    }
}