# 🎮 SENAI Escape — Missão Conhecimento

Protótipo acadêmico independente de Escape Room 2D para aulas de Front-end.

O jogador precisa resolver três desafios para coletar chaves numéricas e abrir a saída.

## 🚀 Como executar

1. Extraia o arquivo ZIP, se o projeto estiver compactado.
2. Abra `index.html` em um navegador moderno.
3. Clique em **Iniciar missão** e resolva os três desafios.

Não exige instalação, servidor, dependências ou conexão à internet.

## 🎮 Funcionalidades

- Menu, introdução, mapa, três salas e painel final.
- Desafios de Climatização, Alvenaria e Front-End.
- Desbloqueio progressivo das salas.
- Progresso salvo no navegador com `localStorage`.
- Layout responsivo e navegação por clique/toque.
- Código final formado pelas chaves das salas.

## 📁 Organização dos arquivos

| Arquivo | Responsabilidade |
| --- | --- |
| `index.html` | Define a estrutura fixa: cabeçalho, espaço para as telas e rodapé. |
| `css/style.css` | Define cores, tamanhos, espaçamentos e adaptações para telas pequenas. |
| `js/game.js` | Controla as telas, verifica respostas e salva o progresso. |

O JavaScript troca o conteúdo da seção `#screen` para mostrar cada tela. Por isso, o jogo usa apenas um arquivo HTML.

O CSS está dividido por comentários em português. Os nomes das classes foram mantidos para preservar a ligação com o HTML e o JavaScript.

## 🧩 Como o jogo funciona

1. A tela inicial oferece **Iniciar missão** e **Continuar**.
2. **Iniciar missão** mostra a introdução; **Continuar** abre o mapa.
3. A sala de Climatização começa disponível.
4. Cada resposta correta registra a conclusão da sala e entrega uma chave.
5. Concluir uma sala libera a próxima no mapa.
6. Depois das três salas, o painel final fica disponível.
7. As chaves, na ordem das salas, formam o código da saída.

As salas concluídas podem ser revisitadas sem duplicar as chaves.

## 💻 Principais partes do JavaScript

| Dado ou função | O que faz |
| --- | --- |
| `SALAS` | Guarda nome, ícone, descrição, chave, resposta correta e mensagem de erro de cada sala. |
| `salasConcluidas` | Guarda os índices das salas resolvidas. Os índices começam em zero. |
| `salaAtual` | Indica qual sala está sendo jogada. |
| `carregarProgresso()` e `salvarProgresso()` | Leem e gravam o progresso no navegador. |
| `criarBotao()` e `mostrarPainel()` | Montam partes de HTML usadas em várias telas. |
| `mostrarMapa()` e `entrarNaSala()` | Mostram a situação das salas e controlam o acesso. |
| `mostrarClimatizacao()`, `mostrarAlvenaria()` e `mostrarFrontEnd()` | Exibem os três desafios. |
| `verificarResposta()` e `concluirSala()` | Conferem a resposta e registram a conclusão. |
| `mostrarPainelFinal()` e `verificarCodigoFinal()` | Exibem o painel da saída e conferem o código digitado. |
| `reiniciarJogo()` | Pede confirmação antes de apagar o progresso. |

## 💾 Como o progresso é salvo

O `localStorage` guarda texto no navegador. O jogo usa `JSON.stringify()` para transformar os dados em texto e `JSON.parse()` para recuperá-los.

- O progresso é salvo ao concluir uma sala ou confirmar o reinício.
- Ao abrir o jogo novamente no mesmo navegador, **Continuar** permite retomar as salas.
- **Iniciar missão** abre a introdução e preserva o progresso existente.
- **Reiniciar progresso** apaga as conclusões somente após a confirmação.
- O progresso não é enviado a um servidor nem compartilhado entre dispositivos.

A chave de armazenamento é `senai_escape_v1`. O campo `completed` foi mantido para ler os dados salvos pela versão anterior.

## ✅ Conferência manual

1. Em uma partida sem progresso, confira se somente Climatização está liberada.
2. Escolha uma resposta errada e confira se aparece uma mensagem, sem entregar a chave.
3. Responda **22 °C** em Climatização, **Bloco B** em Alvenaria e **`<button>`** em Front-End, conferindo o desbloqueio de cada sala.
4. Atualize a página e clique em **Continuar** para conferir o progresso salvo.
5. Revisite uma sala concluída e confira se o total de chaves permanece igual.
6. No painel final, teste um código errado e depois **472**, que deve concluir a missão.
7. Teste o reinício: cancelar deve preservar o progresso; confirmar deve apagar as conclusões.
8. Confira a disposição dos elementos em uma janela larga e em outra com largura de até 600 pixels.

## 🎤 Sugestão para a apresentação

Expliquem primeiro o objetivo do jogo. Depois, mostrem como HTML, CSS e JavaScript trabalham juntos.

No código, acompanhem este caminho: clique em uma alternativa → `verificarResposta()` → `concluirSala()` → `salvarProgresso()`. Esse exemplo mostra a interação, a decisão e o armazenamento dos dados.

## 🔮 Próximas melhorias

Criar artes originais 2D, inventário, dicas, cronômetro, pontuação, sons, acessibilidade ampliada e salas de Pintura, Back-End e UI/UX.

## 📌 Aviso

Projeto demonstrativo não oficial, sem vínculo ou endosso da Firjan SENAI. Validar autorização antes de utilizar marcas institucionais em divulgação pública.
