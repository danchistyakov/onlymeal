export const mainKeyboard = JSON.stringify({
  resize_keyboard: true,
  keyboard: [
    ['Блюдо прямо сейчас! 😋'],
    ['Расписание ⏰', 'Рацион'],
  ]
});

export const rationKeyboard = JSON.stringify({
  inline_keyboard: [
    [{text: 'Поехали!', callback_data: 'setRation'}]
  ]
});

export const geoKeyboard = JSON.stringify({
  resize_keyboard: true,
  one_time_keyboard: true,
  keyboard: [
    [{text: '🗺 Геопозиция', request_location: true}],
    ['❌ Пропустить'],
  ]
});

export const UTCKeyboard = JSON.stringify({
  inline_keyboard: [
    [{text: 'Далее ➡️', callback_data: 'intervalNext'}]
  ]
});
