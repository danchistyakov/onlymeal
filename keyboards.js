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
        one_time_keyboard: true,
        keyboard: [
            [{ text: '🗺 Геопозиция', request_location: true }],
            ['❌ Пропустить'],
        ]
    }),

    UTCKeyboard: JSON.stringify({
        inline_keyboard: [
            [{ text: 'Далее ➡️', callback_data: 'intervalNext' }]
        ]
    }),
}