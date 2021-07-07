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
    })
}