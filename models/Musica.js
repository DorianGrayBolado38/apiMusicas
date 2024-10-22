const mongoose = require('mongoose');

const generoSchema = new mongoose.Schema({
    nomeGenero: { type: String, required: true },
});

module.exports = mongoose.model('Genero', generoSchema);
