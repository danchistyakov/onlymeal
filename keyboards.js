module.exports = {

    rationKeyboard: JSON.stringify({
        inline_keyboard: [
            [{ text: 'Поехали!', callback_data: 'setRation' }]
        ]
    }),

    mainKeyboard: JSON.stringify({
        resize_keyboard: true,
        keyboard: [
            ['Блюдо прямо сейчас! 😋'],
            ['Расписание ⏰', 'Рацион'],
        ]
    }),

    geoKeyboard: JSON.stringify({
        resize_keyboard: true,
        keyboard: [
            [{ text: '🗺 Геопозиция', request_location: true }],
            ['❌ Отмена'],
        ]
    })
}