const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Usuario = require("./models/Usuario");
const Genero = require("./models/Genero");
const Musica = require("./models/Musica");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Primeira nota
app.get('/', (req, res) => {
    res.json({ message: 'Bem-vindo ao meu servidor de música!' });
});

// Criar usuário
app.post('/usuario', async (req, res) => {
    const { nome, email, senha } = req.body;

    // Criptografar a senha
    const salt = await bcrypt.genSalt(10);
    const senhaCriptografada = await bcrypt.hash(senha, salt);

    const usuario = { nome, email, senha: senhaCriptografada };

    try {
        await Usuario.create(usuario);
        res.status(201).json({ message: "Usuário inserido no sistema" });
    } catch (error) {
        res.status(500).json({ erro: error.message });
    }
});

// Endpoint de login
app.post('/login', async (req, res) => {
    const { email, senha } = req.body;

    try {
        const usuario = await Usuario.findOne({ email });
        if (!usuario) {
            return res.status(400).json({ message: 'Usuário não encontrado!' });
        }

        const senhaValida = await bcrypt.compare(senha, usuario.senha);
        if (!senhaValida) {
            return res.status(400).json({ message: 'Senha inválida!' });
        }

        const token = jwt.sign({ id: usuario._id }, 'seu_segredo', { expiresIn: '1h' });
        res.status(200).json({ message: 'Login realizado com sucesso!', token });
    } catch (error) {
        res.status(500).json({ erro: error.message });
    }
});

// Criar música
// Criar música
app.post('/musica', async (req, res) => {
    const { tituloMusica, artista, album, duracao, genero } = req.body;

    const musica = {
        tituloMusica,
        artista,
        album,
        duracao,
        genero
    };

    try {
        await Musica.create(musica);
        res.status(201).json({ message: "Música inserida com sucesso" });
    } catch (error) {
        res.status(500).json({ erro: error.message });
    }
});

// Atualizar música
app.patch("/musica/:id", async (req, res) => {
    const id = req.params.id;
    const { tituloMusica, artista, album, duracao, genero } = req.body;

    const musica = { tituloMusica, artista, album, duracao, genero };

    try {
        const updateMusica = await Musica.updateOne({ _id: id }, musica);
        if (updateMusica.matchedCount === 0) {
            return res.status(422).json({ message: "Música não encontrada!" });
        }
        res.status(200).json(musica);
    } catch (error) {
        res.status(500).json({ erro: error.message });
    }
});


// Criar gênero
app.post('/genero', async (req, res) => {
    const { nomeGenero } = req.body;

    const genero = { nomeGenero };

    try {
        await Genero.create(genero);
        res.status(201).json({ message: "Gênero inserido no sistema" });
    } catch (error) {
        res.status(500).json({ erro: error.message });
    }
});

// Ler usuários
app.get("/usuario", async (req, res) => {
    try {
        const usuarios = await Usuario.find();
        res.status(200).json({ usuarios });
    } catch (error) {
        res.status(500).json({ erro: error.message });
    }
});

// Ler músicas
app.get("/musica", async (req, res) => {
    try {
        const musicas = await Musica.find().populate('genero'); // Certifique-se de que 'genero' esteja referenciado corretamente
        res.status(200).json(musicas);
    } catch (error) {
        res.status(500).json({ erro: 'Erro ao ler músicas.' });
    }
});

// Ler gêneros
app.get("/genero", async (req, res) => {
    try {
        const generos = await Genero.find();
        res.status(200).json(generos);
    } catch (error) {
        res.status(500).json({ erro: error.message });
    }
});

// Atualizar usuário
app.patch("/usuario/:id", async (req, res) => {
    const id = req.params.id;
    const { nome, email, senha } = req.body;

    const usuario = { nome, email };

    if (senha) {
        const salt = await bcrypt.genSalt(10);
        usuario.senha = await bcrypt.hash(senha, salt);
    }

    try {
        const updateUsuario = await Usuario.updateOne({ _id: id }, usuario);
        if (updateUsuario.matchedCount === 0) {
            return res.status(422).json({ message: "Usuário não encontrado!" });
        }
        res.status(200).json(usuario);
    } catch (error) {
        res.status(500).json({ erro: error.message });
    }
});

// Atualizar música
app.patch("/musica/:id", async (req, res) => {
    const id = req.params.id;
    const { nomeMusica } = req.body;

    const musica = { nomeMusica };

    try {
        const updateMusica = await Musica.updateOne({ _id: id }, musica);
        if (updateMusica.matchedCount === 0) {
            return res.status(422).json({ message: "Música não encontrada!" });
        }
        res.status(200).json(musica);
    } catch (error) {
        res.status(500).json({ erro: error.message });
    }
});

// Atualizar gênero
app.patch("/genero/:id", async (req, res) => {
    const id = req.params.id;
    const { nomeGenero } = req.body;

    const genero = { nomeGenero };

    try {
        const updateGenero = await Genero.updateOne({ _id: id }, genero);
        if (updateGenero.matchedCount === 0) {
            return res.status(422).json({ message: "Gênero não encontrado!" });
        }
        res.status(200).json(genero);
    } catch (error) {
        res.status(500).json({ erro: error.message });
    }
});

// Deletar usuário
app.delete("/usuario/:id", async (req, res) => {
    const id = req.params.id;

    const usuario = await Usuario.findOne({ _id: id });
    if (!usuario) {
        return res.status(422).json({ message: "Usuário não encontrado!" });
    }

    try {
        await Usuario.deleteOne({ _id: id });
        res.status(200).json({ message: "Usuário removido com sucesso!" });
    } catch (error) {
        res.status(500).json({ erro: error.message });
    }
});

// Deletar música
app.delete("/musica/:id", async (req, res) => {
    const id = req.params.id;

    const musica = await Musica.findOne({ _id: id });
    if (!musica) {
        return res.status(422).json({ message: "Música não encontrada!" });
    }

    try {
        await Musica.deleteOne({ _id: id });
        res.status(200).json({ message: "Música removida com sucesso!" });
    } catch (error) {
        res.status(500).json({ erro: error.message });
    }
});

// Deletar gênero
app.delete("/genero/:id", async (req, res) => {
    const id = req.params.id;

    const genero = await Genero.findOne({ _id: id });
    if (!genero) {
        return res.status(422).json({ message: "Gênero não encontrado!" });
    }

    try {
        await Genero.deleteOne({ _id: id });
        res.status(200).json({ message: "Gênero removido com sucesso!" });
    } catch (error) {
        res.status(500).json({ erro: error.message });
    }
});

// Conectar ao MongoDB e iniciar o servidor
mongoose.connect('mongodb://localhost:27017/appMusica')
    .then(() => {
        console.log('Conectado ao MongoDB!');
        app.listen(3000, () => {
            console.log('Servidor rodando na porta 3000');
        });
    })
    .catch((err) => {
        console.log('Erro ao conectar ao banco de dados: ' + err.message);
    });
