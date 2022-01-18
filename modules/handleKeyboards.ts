export const handleHateKeyboard = (items) => {
    const keyboard = [
        [{ text: '🥛 Молоко', callback_data: 'hatemilk' }],
        [{ text: '🍍 Фрукты', callback_data: 'hatefruits' }],
        [{ text: '🥒 Овощи', callback_data: 'hatevegetables' }],
        [{ text: '🐟 Рыба', callback_data: 'hatefish' }],
        [{ text: '🍭 Сладкое', callback_data: 'hatesweet' }],
        [{ text: '🥄 Солёное', callback_data: 'hatesalt' }],
        [{ text: 'Далее ➡️', callback_data: 'hateMeat' }],
    ]

    return {
        inline_keyboard: keyboard.map((item, key) => {
            const index = Object.keys(items)[key];
            const bool = items[index];
            if (keyboard.length - key !== 1) {
                return item.map(item => {
                    return bool ? { text: item.text + ' ❌', callback_data: 'hate' + index } : { text: item.text, callback_data: 'hate' + index }
                })
            } else {
                return [{ text: '➡️ Далее', callback_data: 'hateMeat' }]
            }
        })
    }
}

export const handleMeatKeyboard = (items) => {
    const keyboard = [
        [{ text: 'Свинина', callback_data: 'hatepork' }],
        [{ text: 'Говядина', callback_data: 'hatebeef' }],
        [{ text: 'Курица', callback_data: 'hatechicken' }],
        [{ text: 'Баранина', callback_data: 'hatemutton' }],
        [{ text: '⬅️ Назад', callback_data: 'hateBack' }],
        [{ text: 'Далее ➡️', callback_data: 'hateJunk' }],
    ]

    return {
        inline_keyboard: keyboard.map((item, key) => {
            var index = Object.keys(items)[key];
            const bool = items[index];
            if (keyboard.length - key > 2) {
                return item.map(item => {
                    return bool ? { text: item.text + ' ❌', callback_data: 'hate' + index } : { text: item.text, callback_data: 'hate' + index }
                })
            } else {
                return [{ text: item[0].text, callback_data: item[0].callback_data }]
            }
        })
    }
}

export const handleJunkKeyboard = (junk) => {
    return {
        inline_keyboard: [
            junk === 'yes' ? [{ text: 'Да ✅', callback_data: 'junkyes' }] : [{ text: 'Да', callback_data: 'junkyes' }],
            junk === 'no' ? [{ text: 'Нет ❌', callback_data: 'junkno' }] : [{ text: 'Нет', callback_data: 'junkno' }],
            [{ text: '⬅️ Назад', callback_data: 'hateMeat' }],
            [{ text: 'Далее ➡️', callback_data: 'hateNext' }],
        ]
    }

    /*return {
        inline_keyboard: keyboard.map((item, key) => {
            if (keyboard.length - key > 2) {
                return junk === item[0].callback_data ? [{ text: item[0].text + ' ✅', callback_data: 'junk' + item[0].callback_data }] : [{ text: item[0].text, callback_data: 'junk' + item[0].callback_data }]
            } else {
                return [{ text: item[0].text, callback_data: item[0].callback_data }]
            }
        })
    }*/
}

export const handleIntervalKeyboard = (data) => {
    return {
        inline_keyboard: [
            data === '3td' ? [{ text: 'Хочу 3 раза в день ✅', callback_data: '3td' }] : [{ text: 'Хочу 3 раза в день', callback_data: '3td' }],
            data === '1td' ? [{ text: 'Раз в день ✅', callback_data: '1td' }] : [{ text: 'Раз в день', callback_data: '1td' }],
            data === '1tw' ? [{ text: 'Раз в неделю ✅', callback_data: '1tw' }] : [{ text: 'Раз в неделю', callback_data: '1tw' }],
            data === 'button' ? [{ text: 'Когда захочу! Дайте кнопку 🔴 ✅', callback_data: 'button' }] : [{ text: 'Когда захочу! Дайте кнопку 🔴', callback_data: 'button' }],
            [{ text: 'Далее ➡️', callback_data: 'intervalConfirm' }],
        ]
    }
}