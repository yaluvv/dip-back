import mongoose from "mongoose";

// Создаем схему юзера
const UserSchema = new mongoose.Schema({
    // Создаем данные для юзера
    fullName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    passwordHash: {
        type: String,
        required: true
    },
    role: {
        type: String
    },
    avatarUrl: String,

}, {
    timestamps: true,

})

export default mongoose.model('User', UserSchema)