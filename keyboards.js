module.exports = {

    rationKeyboard: JSON.stringify({
        inline_keyboard: [
            [{ text: 'Настроить рацион', callback_data: 'setRation' }]
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