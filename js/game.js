// Elementos da página e dados das salas
const tela = document.querySelector('#screen');
const indicadorProgresso = document.querySelector('#status');
const CHAVE_PROGRESSO = 'senai_escape_v1';

const SALAS = [
    {
        nome: 'Climatização', icone: '❄️',
        descricao: 'Ajuste o painel térmico.', chave: '4',
        resposta: 22,
        mensagemErro: 'Essa configuração não corresponde ao manual. Tente novamente.'
    },
    {
        nome: 'Alvenaria', icone: '🧱',
        descricao: 'Complete a sequência de blocos.', chave: '7',
        resposta: 'B',
        mensagemErro: 'Observe a alternância dos blocos A e B.'
    },
    {
        nome: 'Front-End', icone: '💻',
        descricao: 'Repare a interface.', chave: '2',
        resposta: 'button',
        mensagemErro: 'Para uma ação interativa, prefira o elemento semântico correto.'
    }
];

let salasConcluidas = carregarProgresso();
let salaAtual = 0;

// Mantemos "completed" para ler o progresso salvo pela versão anterior.
function carregarProgresso() {
    try {
        const progresso = JSON.parse(localStorage.getItem(CHAVE_PROGRESSO));
        return progresso?.completed || [];
    } catch {
        return [];
    }
}

function salvarProgresso() {
    const progresso = { completed: salasConcluidas };
    localStorage.setItem(CHAVE_PROGRESSO, JSON.stringify(progresso));
}

// Funções usadas por várias telas
function criarBotao(texto, acao, classe = '', desabilitado = false) {
    return `
        <button class="btn ${classe}" onclick="${acao}" ${desabilitado ? 'disabled' : ''}>
            ${texto}
        </button>
    `;
}

function mostrarPainel(titulo, conteudo) {
    tela.innerHTML = `<div class="panel"><h2>${titulo}</h2>${conteudo}</div>`;
    indicadorProgresso.textContent = `${salasConcluidas.length}/${SALAS.length} chaves coletadas`;
}

function mostrarMensagem(mensagem) {
    const elemento = document.querySelector('#feedback');

    if (elemento) {
        elemento.textContent = mensagem;
        elemento.className = 'feedback';
    }
}

// Menu e navegação
function mostrarInicio() {
    indicadorProgresso.textContent = 'Missão Conhecimento';
    tela.innerHTML = `
        <div class="hero">
            <div class="eyebrow">Escape room educativo • 2D</div>
            <h1>SENAI ESCAPE</h1>
            <p>O sistema S.I.G.M.A. bloqueou os laboratórios. Resolva três desafios e descubra o código para escapar.</p>
            ${criarBotao('Iniciar missão', 'mostrarIntroducao()')}
            ${criarBotao('Continuar', 'mostrarMapa()', 'secondary')}
        </div>
    `;
}

function mostrarIntroducao() {
    mostrarPainel('Alerta do S.I.G.M.A.', `
        <p>Bem-vindo ao centro de formação. Uma falha travou as portas dos laboratórios. Cada desafio solucionado entrega uma chave numérica. Reúna as três chaves, na ordem das salas, para abrir a saída.</p>
        <p>Use o mouse ou toque para interagir com os objetos. Seu progresso é salvo neste navegador.</p>
        ${criarBotao('Abrir mapa', 'mostrarMapa()')}
    `);
}

function mostrarMapa() {
    let cartoes = '';

    for (const [indice, sala] of SALAS.entries()) {
        const concluida = salasConcluidas.includes(indice);
        const bloqueada = indice > 0 && !salasConcluidas.includes(indice - 1);
        let situacao = 'Disponível';
        let textoBotao = 'Entrar';

        if (concluida) {
            situacao = '✓ Chave obtida: ' + sala.chave;
            textoBotao = 'Revisitar';
        } else if (bloqueada) {
            situacao = '🔒 Bloqueada';
            textoBotao = 'Bloqueada';
        }

        cartoes += `
            <div class="room ${bloqueada ? 'locked' : ''}">
                <div class="symbol">${sala.icone}</div>
                <h3>Sala ${indice + 1}: ${sala.nome}</h3>
                <p>${sala.descricao}</p>
                <p>${situacao}</p>
                ${criarBotao(textoBotao, `entrarNaSala(${indice})`, 'secondary', bloqueada)}
            </div>
        `;
    }

    const todasConcluidas = salasConcluidas.length === SALAS.length;
    const porcentagem = salasConcluidas.length / SALAS.length * 100;
    const mensagemSaida = todasConcluidas
        ? 'Todas as chaves foram coletadas.'
        : 'Colete as três chaves para liberar o painel final.';

    mostrarPainel('Mapa dos laboratórios', `
        <p>Conclua as salas na ordem para desbloquear a saída.</p>
        <div class="progress"><span style="width:${porcentagem}%"></span></div>
        <div class="grid">${cartoes}</div>
        <div class="panel">
            <h3>🚪 Saída principal</h3>
            <p>${mensagemSaida}</p>
            ${criarBotao('Acessar painel final', 'mostrarPainelFinal()', todasConcluidas ? '' : 'secondary', !todasConcluidas)}
        </div>
        ${criarBotao('Reiniciar progresso', 'reiniciarJogo()', 'secondary')}
    `);
}

function entrarNaSala(indice) {
    if (indice > 0 && !salasConcluidas.includes(indice - 1)) {
        mostrarMapa();
        return;
    }

    salaAtual = indice;

    if (indice === 0) {
        mostrarClimatizacao();
    } else if (indice === 1) {
        mostrarAlvenaria();
    } else {
        mostrarFrontEnd();
    }
}

// Desafios
function mostrarClimatizacao() {
    const alternativas = [16, 22, 30, 35].map(temperatura => `
        <button class="choice" onclick="verificarResposta(${temperatura})">${temperatura} °C</button>
    `).join('');

    mostrarPainel('Sala 1 — Climatização', `
        <p>O laboratório está superaquecendo. O aviso técnico informa: <strong>“Para preservar os equipamentos, mantenha o ambiente em 22 °C.”</strong></p>
        <div class="scene">
            <button class="object" onclick="mostrarMensagem('Termômetro: temperatura atual de 30 °C.')" aria-label="Termômetro">🌡️</button>
            <button class="object" onclick="mostrarMensagem('Painel de controle: escolha a temperatura correta abaixo.')" aria-label="Painel">🎛️</button>
            <button class="object" onclick="mostrarMensagem('Manual: a temperatura recomendada é 22 °C.')" aria-label="Manual">📋</button>
        </div>
        <h3>Qual temperatura deve ser configurada?</h3>
        <div class="choices">${alternativas}</div>
        <p id="feedback" class="feedback"></p>
        ${criarBotao('Voltar', 'mostrarMapa()', 'secondary')}
    `);
}

function mostrarAlvenaria() {
    mostrarPainel('Sala 2 — Alvenaria', `
        <p>Os blocos de uma parede seguem um padrão alternado: <strong>A – B – A – B – A – ?</strong>. Selecione o bloco que completa a sequência.</p>
        <div class="scene">
            <span style="font-size:3rem">🧱 A</span>
            <span style="font-size:3rem">🧱 B</span>
            <span style="font-size:3rem">🧱 A</span>
            <span style="font-size:3rem">🧱 B</span>
            <span style="font-size:3rem">🧱 A</span>
            <span style="font-size:3rem">❔</span>
        </div>
        <div class="choices">
            <button class="choice" onclick="verificarResposta('A')">Bloco A</button>
            <button class="choice" onclick="verificarResposta('B')">Bloco B</button>
            <button class="choice" onclick="verificarResposta('C')">Bloco C</button>
        </div>
        <p id="feedback" class="feedback"></p>
        ${criarBotao('Voltar', 'mostrarMapa()', 'secondary')}
    `);
}

function mostrarFrontEnd() {
    mostrarPainel('Sala 3 — Front-End', `
        <p>A página de controle perdeu seu botão principal. Escolha o elemento HTML adequado para uma ação clicável.</p>
        <div class="scene">
            <div class="code">&lt;main&gt;<br>&nbsp;&nbsp;&lt;h1&gt;Abrir saída&lt;/h1&gt;<br>&nbsp;&nbsp;[ ELEMENTO AUSENTE ]<br>&lt;/main&gt;</div>
        </div>
        <div class="choices">
            <button class="choice" onclick="verificarResposta('div')">&lt;div&gt;</button>
            <button class="choice" onclick="verificarResposta('button')">&lt;button&gt;</button>
            <button class="choice" onclick="verificarResposta('span')">&lt;span&gt;</button>
        </div>
        <p id="feedback" class="feedback"></p>
        ${criarBotao('Voltar', 'mostrarMapa()', 'secondary')}
    `);
}

function verificarResposta(resposta) {
    const sala = SALAS[salaAtual];

    if (resposta === sala.resposta) {
        concluirSala();
    } else {
        mostrarMensagem(sala.mensagemErro);
    }
}

function concluirSala() {
    if (!salasConcluidas.includes(salaAtual)) {
        salasConcluidas.push(salaAtual);
        salvarProgresso();
    }

    mostrarPainel('Desafio concluído!', `
        <div class="scene"><span style="font-size:5rem">🔑</span></div>
        <p class="success">Você conquistou a chave digital <strong>${SALAS[salaAtual].chave}</strong>!</p>
        <p>Guarde este número: ele será utilizado no desafio final.</p>
        ${criarBotao('Voltar ao mapa', 'mostrarMapa()')}
    `);
}

// Saída e reinício
function mostrarPainelFinal() {
    if (salasConcluidas.length !== SALAS.length) {
        mostrarMapa();
        return;
    }

    mostrarPainel('Painel final — S.I.G.M.A.', `
        <p>Digite as três chaves digitais na ordem das salas: Climatização → Alvenaria → Front-End.</p>
        <div class="scene">🚪 <span style="font-size:3rem">🔐</span></div>
        <label for="code">Código de saída</label>
        <p><input id="code" maxlength="3" inputmode="numeric" placeholder="000" style="padding:14px;font-size:1.5rem;max-width:160px;border-radius:10px;border:2px solid #6d9cb1;background:#092234;color:white"></p>
        ${criarBotao('Desbloquear', 'verificarCodigoFinal()')}
        <p id="feedback" class="feedback"></p>
        ${criarBotao('Voltar', 'mostrarMapa()', 'secondary')}
    `);
}

function verificarCodigoFinal() {
    const codigoDigitado = document.querySelector('#code').value;
    const codigoCorreto = SALAS.map(sala => sala.chave).join('');

    if (codigoDigitado !== codigoCorreto) {
        mostrarMensagem('Código incorreto. Confira as chaves de cada sala no mapa.');
        return;
    }

    mostrarPainel('Missão concluída!', `
        <div class="scene" style="font-size:5rem">🏆</div>
        <h3 class="success">Você restaurou o S.I.G.M.A. e escapou!</h3>
        <p>Parabéns! Você utilizou raciocínio lógico, interpretação de pistas e fundamentos de Front-end.</p>
        ${criarBotao('Jogar novamente', 'reiniciarJogo()')}
    `);
}

function reiniciarJogo() {
    if (confirm('Deseja apagar o progresso e reiniciar?')) {
        salasConcluidas = [];
        salvarProgresso();
        mostrarInicio();
    }
}

mostrarInicio();
