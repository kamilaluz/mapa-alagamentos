// Lista de bairros
const bairros = [
    'Centro', 'Jardins', 'Vila Nova', 'Industrial', 'Residencial', 'Comercial',
    'Zona Norte', 'Zona Sul', 'Vila Rica', 'Boa Vista', 'Liberdade', 'Saúde',
    'Lapa', 'Pinheiros', 'Vila Madalena', 'Santana', 'Tatuapé', 'Penha',
    'Ipiranga', 'Morumbi', 'Bela Vista', 'Tucuruvi', 'Campo Limpo', 'Jaçanã'
];

// ------------------------
// Mapa em tempo real
// ------------------------
async function carregarMapa() {
    const grid = document.getElementById('mapaGrid');
    grid.innerHTML = '';

    try {
        const res = await fetch('/api/statusBairros');
        const status = await res.json();

        bairros.forEach(bairro => {
            const div = document.createElement('div');
            div.className = `map-area ${status[bairro] || 'normal'}`;
            div.textContent = bairro;
            grid.appendChild(div);
        });
    } catch (err) {
        console.error('Erro ao carregar mapa:', err);
    }
}

// ------------------------
// Navegação entre telas
// ------------------------
function mostrarTela(tela, event) {
    document.querySelectorAll('.screen').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.nav-item').forEach(b => b.classList.remove('active'));

    document.getElementById(tela).classList.add('active');
    if(event) event.target.classList.add('active');

    if (tela === 'historico') carregarHistorico();
    if (tela === 'mapa') carregarMapa();
}

// ------------------------
// Registro de ocorrência
// ------------------------
async function enviarOcorrencia(event) {
    event.preventDefault();

    const ocorrencia = {
        localizacao: document.getElementById('localizacao').value,
        tipo: document.getElementById('tipoAlagamento').value,
        descricao: document.getElementById('descricao').value,
        data: new Date().toLocaleString('pt-BR'),
        status: 'Ativo'
    };

    try {
        const res = await fetch('/api/ocorrencias', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(ocorrencia)
        });
        const data = await res.json();

        mostrarNotificacao('Ocorrência registrada!');
        document.getElementById('formRegistro').reset();
        carregarMapa();
    } catch (err) {
        console.error('Erro ao enviar ocorrência:', err);
    }
}

// ------------------------
// Histórico de ocorrências
// ------------------------
async function carregarHistorico() {
    const lista = document.getElementById('listaHistorico');
    lista.innerHTML = '';

    try {
        const res = await fetch('/api/ocorrencias');
        const ocorrencias = await res.json();
        console.log(ocorrencias)
        if (ocorrencias.length === 0) {
            lista.innerHTML = '<p>Nenhuma ocorrência registrada ainda.</p>';
        } else {
            ocorrencias.forEach(oc => {
                const classe = oc.tipo === 'severo' || oc.tipo === 'bloqueado' ? 'alto' :
                               oc.tipo === 'medio' ? 'medio' : '';

                const div = document.createElement('div');
                div.className = `historico-item ${classe}`;
                div.innerHTML = `
                    <div class="data">${oc.data}</div>
                    <strong>${oc.localizacao}</strong>
                    <p>${oc.descricao || 'Sem descrição adicional'}</p>
                    <small>Tipo: ${oc.tipo} • Status: ${oc.status}</small>
                `;
                lista.appendChild(div);
            });
        }

        document.getElementById('totalOcorrencias').textContent = ocorrencias.length;
    } catch (err) {
        console.error('Erro ao carregar histórico:', err);
    }
}

// ------------------------
// Resolver ocorrência
// ------------------------
async function resolverOcorrencia(id) {
    try {
        const res = await fetch('/api/ocorrencias');
        const ocorrencias = await res.json();
        const index = ocorrencias.findIndex(oc => oc.id === id);
        if(index !== -1){
            ocorrencias[index].status = 'Resolvido';
            await fetch('/api/ocorrencias', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(ocorrencias[index])
            });
            carregarHistorico();
            carregarMapa();
        }
    } catch (err) {
        console.error('Erro ao resolver ocorrência:', err);
    }
}

// ------------------------
// Buscar bairro no mapa
// ------------------------
async function buscarBairro() {
    const busca = document.getElementById('buscaLocal').value.toLowerCase();
    const resultado = document.getElementById('resultadoBusca');

    const areas = document.querySelectorAll('.map-area');
    areas.forEach(a => a.classList.remove('destacado'));

    if(busca.length < 3){
        resultado.textContent = '';
        return;
    }

    let encontrado = false;
    areas.forEach(area => {
        if(area.textContent.toLowerCase().includes(busca)){
            area.classList.add('destacado');
            encontrado = true;

            const status = area.className.includes('severo') ? 'Alagamento Severo' :
                           area.className.includes('medio') ? 'Alagamento Médio' :
                           area.className.includes('leve') ? 'Alagamento Leve' :
                           area.className.includes('bloqueado') ? 'Bloqueado' : 'Normal';

            resultado.textContent = `${area.textContent}: ${status}`;
        }
    });

    if(!encontrado) resultado.textContent = 'Bairro não encontrado';
}

// ------------------------
// Notificação
// ------------------------
function mostrarNotificacao(mensagem){
    const notif = document.getElementById('notificacao');
    notif.textContent = mensagem;
    notif.style.display = 'block';
    setTimeout(()=>{ notif.style.display='none'; }, 3000);
}

async function calcularRota() {
    const origem = document.getElementById('origem').value;
    const destino = document.getElementById('destino').value;

    if (!origem || !destino) return;

    // Buscar status dos bairros no backend
    const res = await fetch('/api/statusBairros');
    const statusBairros = await res.json();

    // Aqui você precisaria de um array de bairros da rota
    const rotaBairros = [origem, destino]; // exemplo simplificado

    // Verifica se há bairros com alagamento
    let problemas = 0;
    rotaBairros.forEach(bairro => {
        const status = statusBairros[bairro];
        if (status === 'alagado-severo' || status === 'bloqueado') {
            problemas++;
        }
    });

    const rotaDiv = document.getElementById('rotaResultado');
    rotaDiv.style.display = 'block';
    rotaDiv.querySelector('.rota-info span:first-child').textContent =
        `Tempo estimado: ${15 + problemas * 10} min`;
    rotaDiv.querySelector('.rota-info span:last-child').textContent =
        `Distância: 8.5 km`;
    rotaDiv.querySelector('.alerta').textContent =
        problemas > 0
        ? `⚠ Rota alternativa sugerida evitando ${problemas} área(s) alagada(s)`
        : 'Rota segura';
}


// ------------------------
// Inicialização
// ------------------------
window.onload = function() {
    carregarMapa();
};
