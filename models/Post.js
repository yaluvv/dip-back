import mongoose from "mongoose";

// Создаем схему юзера
const PostSchema = new mongoose.Schema({
    // Создаем данные для юзера
    title: {
        type: String,
        required: true
    },
    text: {
        type: String,
        required: true,
    },
    tags: {
        type: Array,
        required: true
    },
    viewsCount: {
        type: Number,
        default: 0
    },
    imageUrl: String,
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
}, {
    timestamps: true
})

export default mongoose.model('Post', PostSchema)