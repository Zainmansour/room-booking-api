const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const Room = new Schema(
    {
        roomNum: {
            type: Number,
        },
        roomRate: {
            type: Number,
        },
        roomCost: {
            type: Number,
        },
        roomCapacity: {
            type: Number,
        },
        expBookDate: {
            type: Date,
        },
    }
)

module.exports = mongoose.model("rooms", Room)