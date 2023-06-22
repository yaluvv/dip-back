import { body } from "express-validator";

export const postCreateValidator = [
    body('title', 'Введите заголовок статьи. Минимум 3 символа.').isLength({ min: 3 }).isString(),
    body('text', 'Введите текст статьи. Минимум 5 символов.').isLength({ min: 5 }).isString(),
    body('category', 'Неверный формат тегов. Укажите массив.').optional().isString(),
    body('imageUrl', 'Неверная ссылка на изображение').optional().isString(),
]