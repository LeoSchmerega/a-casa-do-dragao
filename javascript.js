// GSAP para scrollar
gsap.registerPlugin(ScrollTrigger,ScrollSmoother,SplitText)

const smoother = ScrollSmoother.create({
    wrapper: "#smooth-wrapper",
    content: "#smooth-content",
    smooth: 1.8,
    effects: true,
    normalizeScroll: true
});

// MENU
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

//--NÉVOA--//

document.addEventListener('DOMContentLoaded', () => {
    const containerNevoa = document.querySelector('.nevoa');

    if (!containerNevoa) return;

    window.addEventListener('mousemove', (event) => {
        const { clientX, clientY } = event;
        const { innerWidth, innerHeight } = window;

        const posX = (clientX / innerWidth) - 0.5;
        const posY = (clientY / innerHeight) - 0.5;

        const intensidade = 25; 

        const moverX = (posX * intensidade).toFixed(2);
        const moverY = (posY * intensidade).toFixed(2);

        containerNevoa.style.setProperty('--mx', `${moverX}px`);
        containerNevoa.style.setProperty('--my', `${moverY}px`);
    });
});

//--LEALDADE--//



//--OS VERDES--//


