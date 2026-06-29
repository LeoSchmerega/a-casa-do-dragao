const dadosFaccoes = {
    negros: [
        { nome: "Rhaenyra Targaryen", imagem: "MENU/RHAENYRA.png" },
        { nome: "Daemon Targaryen", imagem: "MENU/DAEMON.png" },
        { nome: "Rhaenys Targaryen", imagem: "MENU/RHAENYS.png" },
        { nome: "Jacaerys Velaryon", imagem: "MENU/JACAERYS.png" },
        { nome: "Baela Targaryen", imagem: "MENU/BAELA.png" }
    ],
    verdes: [
        { nome: "Alicent Hightower", imagem: "MENU/alicent.png" },
        { nome: "Aegon II Targaryen", imagem: "MENU/aegon.png" },
        { nome: "Aemond Targaryen", imagem: "MENU/aemond.png" }, 
        { nome: "Helaena Targaryen", imagem: "MENU/helaena.png" },
        { nome: "Criston Cole", imagem: "MENU/criston.png" }
    ]
};

// Caminho global da imagem de fundo padrão do menu
const IMAGEM_PADRAO = "MENU/TRONO.webp"; 

document.addEventListener('DOMContentLoaded', () => {
    const menuOverlay = document.getElementById('menu-overlay');
    const openBtn = document.getElementById('menu-open-btn');
    const closeBtn = document.getElementById('menu-close-btn');
    const abaBotoes = document.querySelectorAll('.botao-aba');
    const listaPersonagens = document.querySelector('.lista-personagens');
    const imagemPrevia = document.getElementById('imagem-previa-personagem');

    function toggleMenu() {
        const ativo = menuOverlay.classList.toggle('ativo');
        openBtn.setAttribute('aria-expanded', ativo);
        
        if (ativo) {
            // Quando abre, começa na facção dos negros, mas exibe a imagem padrão HBO
            switchFaction('negros', true); 
            
            // Calcula o tamanho da scrollbar e trava o body sem dar trancos laterais
            const scrollBarWidth = window.innerWidth - document.documentElement.clientWidth;
            document.body.classList.add('menu-aberto');
            document.body.style.paddingRight = `${scrollBarWidth}px`;
        } else {
            // Ao fechar, reseta para a imagem padrão imediatamente
            imagemPrevia.src = IMAGEM_PADRAO;
            
            // --- SUAVIZAÇÃO DO FECHAMENTO ---
            // Mantém a estrutura travada até o fadeout do CSS (0.6s) terminar
            setTimeout(() => {
                document.body.classList.remove('menu-aberto');
                document.body.style.paddingRight = '';
            }, 1000); 
        }
    }

    openBtn.addEventListener('click', toggleMenu);
    closeBtn.addEventListener('click', toggleMenu);

    abaBotoes.forEach(botao => {
        botao.addEventListener('click', (e) => {
            const faccao = e.target.getAttribute('data-faction');
            // Ao trocar de facção pelas abas, mantemos a imagem padrão até o hover
            switchFaction(faccao, true);
        });
    });

    // EVENTO: Quando o mouse sai da área de nomes, retorna suavemente para a imagem padrão
    if (listaPersonagens) {
        listaPersonagens.addEventListener('mouseleave', () => {
            atualizarImagem(imagemPrevia, IMAGEM_PADRAO, "House of the Dragon Wallpaper");
            
            // Remove o destaque visual dourado de qualquer nome que estava ativo
            document.querySelectorAll('.lista-personagens li').forEach(li => {
                li.classList.remove('selecionado');
            });
        });
    }
});

// Função responsável por montar a lista de personagens na tela
function switchFaction(faccao, abrirComPadrao = false) {
    const listaUl = document.getElementById('lista-personagens');
    const imagemPreview = document.getElementById('imagem-previa-personagem');
    const botoesAbas = document.querySelectorAll('.botao-aba');

    if (!listaUl || !imagemPreview) return;

    // Atualiza o estado visual ativo/inativo das abas superiores
    botoesAbas.forEach(b => b.classList.toggle('ativo', b.getAttribute('data-faction') === faccao));

    listaUl.innerHTML = '';
    const personagens = dadosFaccoes[faccao];

    // Controla se o menu deve iniciar com o wallpaper padrão ou com a foto do primeiro personagem
    if (personagens && personagens.length > 0 && !abrirComPadrao) {
        atualizarImagem(imagemPreview, personagens[0].imagem, personagens[0].nome);
    } else if (abrirComPadrao) {
        atualizarImagem(imagemPreview, IMAGEM_PADRAO, "House of the Dragon Wallpaper");
    }

    // Renderiza dinamicamente os nomes dos personagens
    personagens.forEach((personagem) => {
        const itemLista = document.createElement('li');
        itemLista.textContent = personagem.nome.toUpperCase(); 

        // EVENTO: Quando passa o mouse em cima de um personagem específico
        itemLista.addEventListener('mouseenter', () => {
            // Remove o efeito dos outros e foca no atual
            document.querySelectorAll('.lista-personagens li').forEach(li => li.classList.remove('selecionado'));
            itemLista.classList.add('selecionado');
            
            // Troca para a foto do personagem alvo
            atualizarImagem(imagemPreview, personagem.imagem, personagem.nome);
        });

        listaUl.appendChild(itemLista);
    });
}

// Auxiliar com animação fluida casada com o CSS para evitar cortes secos
function atualizarImagem(elementoImg, src, alt) {
    if (!elementoImg || elementoImg.src.includes(src)) return; // Evita reanimar se for a mesma imagem
    
    elementoImg.classList.add('mudando');
    setTimeout(() => {
        elementoImg.src = src;
        elementoImg.alt = `Preview de ${alt}`;
        elementoImg.classList.remove('mudando');
    }, 150); // Casado precisamente com o tempo de opacidade do CSS
}




//TRAILER//

document.addEventListener('DOMContentLoaded', () => {

    const abrirTrailer =
        document.querySelector('.abrir-trailer');

    const fecharTrailer =
        document.querySelector('.fechar-trailer');

    const proximoTrailer =
        document.querySelector('.proximo-trailer');

    const modalTrailer =
        document.querySelector('.trailer');

    const video =
        document.querySelector('.video-trailer');



    const trailers = [

        'PRIMEIRA TELA/A Casa do Dragão - Temporada 3 - Teaser Trailer Dublado - HBO Max.mp4',

        'PRIMEIRA TELA/A Casa do Dragão - Temporada 3 - Teaser Oficial - HBO Max.mp4'

    ];



    let trailerAtual = 0;



    abrirTrailer.addEventListener('click', abrirModal);



    fecharTrailer.addEventListener('click', fecharModal);



    proximoTrailer.addEventListener('click', trocarTrailer);



    function abrirModal() {

        modalTrailer.classList.add('trailer-aberto');

        video.src = trailers[trailerAtual];

        video.play();



        const scrollBarWidth =
            window.innerWidth -
            document.documentElement.clientWidth;

        document.body.style.overflow = 'hidden';

        document.body.style.paddingRight =
            `${scrollBarWidth}px`;
    }



    function fecharModal() {

        modalTrailer.classList.remove('trailer-aberto');

        video.pause();

        video.currentTime = 0;



        document.body.style.overflow = '';

        document.body.style.paddingRight = '';
    }



    function trocarTrailer() {

        trailerAtual++;

        if (trailerAtual >= trailers.length) {

            trailerAtual = 0;
        }



        video.src = trailers[trailerAtual];

        video.play();
    }

});



//vnsdunvu9sn9uvw''

const verdeBtn = document.querySelector('.verde-btn');

const pretoBtn = document.querySelector('.preto-btn');

const sessaoLealdade =
    document.querySelector('.lealdade-sessao');

const resultado =
    document.querySelector('.resultado-lealdade');



verdeBtn.addEventListener('click', () => {

    sessaoLealdade.classList.remove('escolha-preto');

    sessaoLealdade.classList.add('escolha-verde');

    resultado.classList.add('ativo');

    resultado.innerHTML =
        'VOCÊ JUROU LEALDADE AOS VERDES';
});



pretoBtn.addEventListener('click', () => {

    sessaoLealdade.classList.remove('escolha-verde');

    sessaoLealdade.classList.add('escolha-preto');

    resultado.classList.add('ativo');

    resultado.innerHTML =
        'VOCÊ JUROU LEALDADE A RHAENYRA';
});

//--NÉVOA--//
/**
 * Efeito de Paralaxe Dinâmico para a Névoa da Alicent
 * Captura os movimentos do mouse e atualiza as coordenadas CSS em tempo real.
 */
document.addEventListener('DOMContentLoaded', () => {
    const containerNevoa = document.querySelector('.nevoa');

    // Só roda o script se o elemento realmente existir na tela (Evita erros no console)
    if (!containerNevoa) return;

    window.addEventListener('mousemove', (event) => {
        const { clientX, clientY } = event;
        const { innerWidth, innerHeight } = window;

        // Transforma a posição do mouse em uma escala de -0.5 a 0.5 (Centro da tela é 0)
        const posX = (clientX / innerWidth) - 0.5;
        const posY = (clientY / innerHeight) - 0.5;

        // Intensidade máxima do movimento em pixels (Sutil e elegante)
        const intensidade = 25; 

        const moverX = (posX * intensidade).toFixed(2);
        const moverY = (posY * intensidade).toFixed(2);

        // Aplica os valores diretamente nas variáveis do CSS
        containerNevoa.style.setProperty('--mx', `${moverX}px`);
        containerNevoa.style.setProperty('--my', `${moverY}px`);
    });
});

//--LEALDADE--//



//--OS VERDES--//


