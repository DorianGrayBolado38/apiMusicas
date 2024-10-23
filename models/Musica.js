const mongoose = require('mongoose');

const MusicaSchema = new mongoose.Schema({
    tituloMusica: { type: String, required: true },
    artista: { type: String, required: true },
    album: { type: String, required: true },
    duracao: { type: String, required: true },
    genero: { type: mongoose.Schema.Types.ObjectId, ref: 'Genero' } // Referência para o modelo de Gênero
});

module.exports = mongoose.model('Musica', MusicaSchema);
