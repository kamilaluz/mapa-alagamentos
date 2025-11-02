const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static('public'));

// Caminhos para os arquivos de "banco de dados"
const ocorrenciasFile = path.join(__dirname, 'data', 'ocorrencias.json');
const statusFile = path.join(__dirname, 'data', 'statusBairros.json');

// Inicializar arquivos se não existirem
if (!fs.existsSync(ocorrenciasFile)) fs.writeFileSync(ocorrenciasFile, '[]');
if (!fs.existsSync(statusFile)) {
    const statusInicial = {
        "Centro":"normal","Jardins":"normal","Vila Nova":"normal","Industrial":"alagado-medio",
        "Residencial":"normal","Comercial":"normal","Zona Norte":"normal","Zona Sul":"alagado-severo",
        "Vila Rica":"normal","Boa Vista":"normal","Liberdade":"alagado-leve","Saúde":"normal",
        "Lapa":"normal","Pinheiros":"normal","Vila Madalena":"normal","Santana":"alagado-medio",
        "Tatuapé":"normal","Penha":"normal","Ipiranga":"normal","Morumbi":"normal",
        "Bela Vista":"bloqueado","Tucuruvi":"normal","Campo Limpo":"normal","Jaçanã":"normal"
    };
    fs.writeFileSync(statusFile, JSON.stringify(statusInicial, null, 2));
}

// Rotas API
app.get('/api/ocorrencias', (req, res) => {
    let ocorrencias = [];
    if (fs.existsSync(ocorrenciasFile)) {
        ocorrencias = JSON.parse(fs.readFileSync(ocorrenciasFile));
    }
    res.json(ocorrencias);
});


app.post('/api/ocorrencias', (req, res) => {
    const novaOcorrencia = req.body;
    novaOcorrencia.id = Date.now();

    let ocorrencias = [];
    if (fs.existsSync(ocorrenciasFile)) {
        ocorrencias = JSON.parse(fs.readFileSync(ocorrenciasFile));
    }

    ocorrencias.unshift(novaOcorrencia);

    fs.writeFileSync(ocorrenciasFile, JSON.stringify(ocorrencias, null, 2));

    let statusBairros = {};
    if (fs.existsSync(statusFile)) {
        statusBairros = JSON.parse(fs.readFileSync(statusFile));
    }

    const bairro = novaOcorrencia.localizacao;
    switch (novaOcorrencia.tipo) {
        case 'leve': statusBairros[bairro] = 'alagado-leve'; break;
        case 'medio': statusBairros[bairro] = 'alagado-medio'; break;
        case 'severo': statusBairros[bairro] = 'alagado-severo'; break;
        case 'bloqueado': statusBairros[bairro] = 'bloqueado'; break;
        default: statusBairros[bairro] = 'normal';
    }

    fs.writeFileSync(statusFile, JSON.stringify(statusBairros, null, 2));

    res.json({ message: 'Ocorrência registrada e status atualizado!' });
});


app.get('/api/statusBairros', (req, res) => {
    const status = JSON.parse(fs.readFileSync(statusFile));
    res.json(status);
});

app.post('/api/statusBairros', (req, res) => {
    const status = req.body;
    fs.writeFileSync(statusFile, JSON.stringify(status, null, 2));
    res.json({ success: true });
});

app.listen(PORT, () => console.log(`Servidor rodando em http://localhost:${PORT}`));
