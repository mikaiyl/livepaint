const mongoose = require('mongoose')

const Update = mongoose.model( 'Updates', {
    row: Number,
    col: Number,
    color: String,
    time: Date,
    tool: String,
} )

module.exports = Update
