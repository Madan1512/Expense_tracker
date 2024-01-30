const mongoose = require('mongoose');

const expensesSchema = new mongoose.Schema({
    amount: Number,
    desc: String,
    title: String,
});

const expSchema = mongoose.model('expenses', expensesSchema );

module.exports = expSchema;