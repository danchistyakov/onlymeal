exports.handleFavKeyboard = (items) => {
    const keyboard = [
        [{ text: '🍖 Мясо', callback_data: 'likemeat' }],
        [{ text: '🥛 Молоко', callback_data: 'likemilk' }],
        [{ text: '🍍 Фрукты', callback_data: 'likefruits' }],
        [{ text: '🐟 Рыба', callback_data: 'likefish' }],
        [{ text: '➡️ Далее', callback_data: 'likeNext' }],
    ]
    //console.log(typeof items)
    return {
        inline_keyboard: keyboard.map((item, key) => {
            var index = Object.keys(items)[key];
            //console.log(index)
            const bool = items[index];
            if (keyboard.length - key !== 1) {
                return item.map(item => {
                    return bool ? { text: '✅ ' + item?.text, callback_data: 'like' + index } : { text: item?.text, callback_data: 'like' + index }
                })
            } else {
                return [{ text: '➡️ Далее', callback_data: 'likeNext' }]
            }
        })
    }
}

exports.handleHateKeyboard = (items) => {
    const keyboard = [
        [{ text: '🍖 Мясо', callback_data: 'hatemeat' }],
        [{ text: '🥛 Молоко', callback_data: 'hatemilk' }],
        [{ text: '🍍 Фрукты', callback_data: 'hatefruits' }],
        [{ text: '🐟 Рыба', callback_data: 'hatefish' }],
        [{ text: '⬅️ Назад', callback_data: 'hateBack' }],
        [{ text: '➡️ Далее', callback_data: 'hateNext' }],
    ]

    return {
        inline_keyboard: keyboard.map((item, key) => {
            var index = Object.keys(items)[key];
            const bool = items[index];
            if (keyboard.length - key > 2) {
                return item.map(item => {
                    return bool ? { text: '✅ ' + item?.text, callback_data: 'hate' + index } : { text: item?.text, callback_data: 'hate' + index }
                })
            } else {
                return [{ text: item[0]?.text, callback_data: item[0]?.callback_data }]
            }
        })
    }
}

exports.handleIntervalKeyboard = (data) => {
    return {
        inline_keyboard: [
            data === '3td' ? [{ text: '✅ Хочу 3 раза в день', callback_data: '3td' }] : [{ text: 'Хочу 3 раза в день', callback_data: '3td' }],
            data === '1td' ? [{ text: '✅ Раз в день', callback_data: '1td' }] : [{ text: 'Раз в день', callback_data: '1td' }],
            data === '1tw' ? [{ text: '✅ Раз в неделю', callback_data: '1tw' }] : [{ text: 'Раз в неделю', callback_data: '1tw' }],
            data === 'onreq' ? [{ text: '✅ Когда захочу! Дайте кнопку 🔴', callback_data: 'onreq' }] : [{ text: 'Когда захочу! Дайте кнопку 🔴', callback_data: 'onreq' }],
            [{ text: '➡️ Далее', callback_data: 'dishNext' }],
        ]
    }
}