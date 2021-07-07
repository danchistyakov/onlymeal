const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const PreferencesSchema = mongoose.Schema({
    chatId: {
        type: Number,
        required: true,
        unique: true,
        default: null
    },

    hate: {
        milk: { type: Boolean, required: true, default: false },
        fruits: { type: Boolean, required: true, default: false },
        vegetables: { type: Boolean, required: true, default: false },
        fish: { type: Boolean, required: true, default: false },
        sweet: { type: Boolean, required: true, default: false },
        salt: { type: Boolean, required: true, default: false }
    },

    meat: {
        pork: { type: Boolean, required: true, default: false },
        beef: { type: Boolean, required: true, default: false },
        chicken: { type: Boolean, required: true, default: false },
        mutton: { type: Boolean, required: true, default: false }
    },

    junk: { type: Boolean },
    interval: { type: String },
})

PreferencesSchema.plugin(uniqueValidator);
mongoose.model('preferences', PreferencesSchema)