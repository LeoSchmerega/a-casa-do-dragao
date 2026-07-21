// --------------------------------------------------------------------------
// 1. CONFIGURAÇÃO INICIAL E REGISTRO DE PLUGINS
// --------------------------------------------------------------------------

gsap.registerPlugin(ScrollTrigger, ScrollSmoother, SplitText);

const smoother = ScrollSmoother.create({
    wrapper: "#smooth-wrapper",   
    content: "#smooth-content",  
    smooth: 1.8,                 
    effects: true,                
    normalizeScroll: true         
});

// --------------------------------------------------------------------------
// ANIMAÇÃO MAIN (Hero) — inalterado, fora do escopo do bug reportado
// --------------------------------------------------------------------------
function animarPagina() {

    gsap.from(".main-fundo", { opacity: 0, y: -150, duration: 1, ease: "power3.out" });

    gsap.from(".main-personagens img", { opacity: 0, y: 100, duration: 1, ease: "power2.out" });

    gsap.from(".main-centro", { opacity: 0, y: 100, duration: 1, ease: "power2.out" });

    gsap.fromTo(".main",
        { opacity: 1 },
        {
            opacity: 0,
            filter: "blur(10px)",
            scrollTrigger: { trigger: ".main", scrub: true, start: "20% 0%", end: "80% 0%" }
        });

    inicializarVideoLealdade();
    inicializarSecoesAnimadas();
}

// --------------------------------------------------------------------------
// SEÇÃO LEALDADE (vídeo em canvas) — inalterado, fora do escopo do bug
// --------------------------------------------------------------------------
function inicializarVideoLealdade() {

    const canvas = document.getElementById("video-canvas");
    const fallbackImg = document.getElementById("canvas-fallback");

    if (!canvas) return;

    const context = canvas.getContext("2d");

    canvas.width = 1920;
    canvas.height = 1080;

    const totalFrames = 144;     
    const imagens = [];          
    const sequencia = { frame: 0 }; 

    const obterCaminhoFrame = (index) => {
        const numeroFormatado = (index + 1).toString().padStart(3, '0');
        return `LEALDADE_-_VIDEO_frames/frame_${numeroFormatado}.jpg`;
    };

    function desenharFrame() {
        const index = Math.floor(sequencia.frame);
        const img = imagens[index];

        if (!img || !img.complete) return;

        context.clearRect(0, 0, canvas.width, canvas.height);

        const imgRatio = img.width / img.height;
        const canvasRatio = canvas.width / canvas.height;
        let dWidth, dHeight, dx, dy;

        if (imgRatio > canvasRatio) {
            dHeight = canvas.height;
            dWidth = canvas.height * imgRatio;
            dx = (canvas.width - dWidth) / 2;
            dy = 0;
        } else {
            dWidth = canvas.width;
            dHeight = canvas.width / imgRatio;
            dx = 0;
            dy = (canvas.height - dHeight) / 2;
        }

        context.drawImage(img, dx, dy, dWidth, dHeight);
    }

    let framesCarregados = 0;

    function precarregarImagens() {
        for (let i = 0; i < totalFrames; i++) {
            const img = new Image();

            img.onload = () => {
                framesCarregados++;

                if (i === 0) desenharFrame();
                if (framesCarregados === totalFrames) esconderFallbackECriarScroll();
            };

            img.onerror = () => {
                console.error(`ERRO CRÍTICO: Não foi possível carregar o frame: ${img.src}`);
            };

            img.src = obterCaminhoFrame(i);
            imagens[i] = img;
        }
    }

    function esconderFallbackECriarScroll() {
        if (fallbackImg) {
            gsap.to(fallbackImg, {
                opacity: 0,
                duration: 0.6,
                ease: "power2.out",
                onComplete: () => { fallbackImg.style.display = "none"; }
            });
        }
        criarAnimacaoScroll();
    }

    function criarAnimacaoScroll() {

        desenharFrame();

        const splitTitulo = new SplitText(".lealdade-conteudo h1", { type: "words,chars" });
        const splitTexto = new SplitText(".lealdade-conteudo p", { type: "words" });
        const splitSubtitulo = new SplitText(".lealdade-conteudo h2", { type: "words,chars" });

        const tlLealdade = gsap.timeline({
            scrollTrigger: {
                trigger: ".lealdade-sessao",
                start: "top top",
                end: "+=500%",
                scrub: true,
                pin: true,
                anticipatePin: 1,          
                invalidateOnRefresh: true, 
                onRefresh: desenharFrame   
            }
        });

        tlLealdade.fromTo(".lealdade-wrapper",
            { opacity: 0, scale: 0.93, filter: "blur(5px)" },
            { opacity: 1, scale: 1, filter: "blur(0px)", duration: 0.4, ease: "power2.out" },
            0
        );

        tlLealdade.to(sequencia, {
            frame: totalFrames - 1,
            ease: "none",          
            duration: 1.5,          
            onUpdate: desenharFrame 
        }, 0);

        tlLealdade.from(splitTitulo.chars, {
            opacity: 0, y: -30, filter: "blur(5px)", stagger: 0.03, duration: 0.8, ease: "power2.out"
        }, 1.0);

        tlLealdade.from(splitTexto.words, {
            opacity: 0, y: -30, filter: "blur(5px)", stagger: 0.02, duration: 1, ease: "power1.out"
        }, 1.5);

        tlLealdade.from(splitSubtitulo.chars, {
            opacity: 0, y: -30, filter: "blur(5px)", stagger: 0.03, duration: 0.8, ease: "power2.out"
        }, 3.0);

        tlLealdade.from(".lealdade-botao .lado", {
            opacity: 0, y: -30, filter: "blur(5px)", stagger: 0.2, duration: 0.8, ease: "power2.out"
        }, 2.5);

        tlLealdade.to(".lealdade-wrapper", {
            opacity: 0, filter: "blur(15px)", scale: 0.95, y: -80, duration: 1.2, ease: "power2.inOut"
        }, 3.5);

        tlLealdade.to(".lealdade-sessao", {
            opacity: 0, duration: 1.2, ease: "power2.inOut"
        }, 3.5);

        ScrollTrigger.refresh();
    }

    precarregarImagens();
}

// --------------------------------------------------------------------------
// ANIMAÇÃO PERSONAGENS
// --------------------------------------------------------------------------

// DECLARAR A SESSAO QUE SAO OS PERSONAGENS
const todosPersonagens = document.querySelectorAll("[class$='-sessao']");

// LOOPING PARA ANIMAR TODOS OS PERSONAGENS
todosPersonagens.forEach(secaoAtual => {
    // MAPEAMENTO DOS ELEMENTOS
    const sessao = secaoAtual;
    const fundo = secaoAtual.querySelector("[class$='-fundo']");
    const overlay = secaoAtual.querySelector("[class$='-overlay']");
    const card = secaoAtual.querySelector("[class$='-card']");
    const cardFundo = secaoAtual.querySelector("[class$='-card-fundo']");
    const cardGlass = secaoAtual.querySelector("[class$='-card-glass']");
    const imagem = secaoAtual.querySelector("[class$='-imagem']");
    const nevoa = secaoAtual.querySelector(".nevoa");
    const faisca = secaoAtual.querySelector(".faisca");
    const conteudo = secaoAtual.querySelector("[class$='-conteudo']");
    const titulo = secaoAtual.querySelector("[class$='-titulo']");
    const citacao = secaoAtual.querySelector("[class$='-citação']");
    const citacaoFinal = secaoAtual.querySelector("[class$='-citação-final']");
    const targaryen = secaoAtual.querySelector(".logo-targaryen");
    const targaryenVerde = secaoAtual.querySelector(".logo-verde-targaryen");


    // PRE-DEFINIÇÃO DE TODOS OS ELEMENTOS PARA A OPACIDADE:0 PARA DAR ANIMAÇÃO DE SURGINDO
    gsap.set([
        fundo, overlay, card, cardFundo, cardGlass, imagem, nevoa, faisca, 
        conteudo, titulo, citacao, citacaoFinal, targaryen
    ], { opacity: 0 }); 

    // SE FUNDO EXISTIR = ANIMAR
    if (fundo) {

        const textosParaSplitar = conteudo.querySelectorAll("h1, p, h2");
        const split = SplitText.create(textosParaSplitar, { type: "words, chars" });

        // CONFIGURAÇÕES PARA A ANIMAR OS TEXTOS
        gsap.set(split.chars, { autoAlpha: 0 });
        gsap.set(textosParaSplitar, { opacity: 1});

    // TL PARA ANIMAR OS PERSONAGENS 
        const tlPersonagens = gsap.timeline({
            defaults: {immediateRender: false},
            scrollTrigger: {
                trigger: secaoAtual,
                start: "top top",
                end: "+=2000",
                pin: true,
                scrub: 2,
                invalidateOnRefresh: true,
                markers: true
            }
        });

// ANIMAÇÕES DOS ELEMENTOS DE .FROM PARA .TO
tlPersonagens
    // ==========================================
    // ETAPA 1: FUNDO E OVERLAY (Mais suaves e dramáticos)
    // ==========================================
    .from(fundo, { z: 400, scale: 0.6, duration: 3, ease: "power3.out" })
    .to(fundo, { autoAlpha: 1, duration: 3, ease: "power3.out" }, "<") 

    // O overlay fecha um pouquinho depois para assentar a cena
    .from(overlay, { scale: 0.7, duration: 3, ease: "power3.out" }, "<")
    .to(overlay, { autoAlpha: 1, duration: 2.5, ease: "power3.out" }, "<0.2") 

    // ==========================================
    // ETAPA 2: O CARD (Efeito de vidro em camadas)
    // ==========================================
    // Iniciamos o card ligeiramente antes do fundo terminar de assentar (-=0.8)
    .from(card, { scale: 0.85, rotationX: 5, duration: 2, ease: "power4.out" }, "-=0.8")
    .to(card, { autoAlpha: 1, duration: 2, ease: "power4.out" }, "<") 

    // O fundo do card vem 150ms depois do container principal
    .from(cardFundo, { scale: 0.9, duration: 2, ease: "power4.out" }, "<0.15")
    .to(cardFundo, { autoAlpha: 1, duration: 2, ease: "power4.out" }, "<") 

    // O vidro (reflexo) vem por último para dar o acabamento de profundidade
    .from(cardGlass, { scale: 0.95, duration: 2, ease: "power4.out" }, "<0.1")
    .to(cardGlass, { autoAlpha: 1, duration: 2, ease: "power4.out" }, "<") 

    // ==========================================
    // ETAPA 3: IMAGEM, FAÍSCA e NEVOA (Entrada orgânica)
    // ==========================================
    // A imagem começa a deslizar enquanto o vidro do card ainda está assentando
    .from(imagem, { x: -45, z: -50, rotationY: 3, duration: 2, ease: "power3.out" }, "-=0.5")
    .to(imagem, { autoAlpha: 1, duration: 2, ease: "power3.out" }, "<") 

    .from(faisca, { scale: 0.7, duration: 2, ease: "power3.out" }, "<0.2")
    .to(faisca, { autoAlpha: 1, duration: 1.8, ease: "power3.out" }, "<") 

    .from(nevoa, { scale: 0.7, duration: 2, ease: "power3.out" }, "<0.2")
    .to(nevoa, { autoAlpha: 1, duration: 1.8, ease: "power3.out" }, "<") 
    
    // ==========================================
    // SPLIT TEXT DO CONTEUDO DOS PERSONAGENS
    // ==========================================
    .to(conteudo, { autoAlpha: 1, duration: 0.2 }, "-=0.2")

    .fromTo(split.chars, 
        { y: 30, autoAlpha: 0 }, 
        {y: 0, autoAlpha: 1, duration: 0.8, stagger: 0.02, ease: "power3.out"}, "<")

    // ==========================================
    // SELO TARGARYEN
    // ==========================================
    if (targaryenVerde) {
        tlPersonagens
            .from(targaryenVerde, { scale: 0.7, z: -100, duration: 1.5, ease: "power4.out" }, "-=0.5")
            .to(targaryenVerde, { autoAlpha: 1, duration: 1.5, ease: "power4.out" }, "<");
    } 
    // Se não for a Alicent, roda o logo padrão dos Pretos
    else if (targaryen) {
        tlPersonagens
            .from(targaryen, { scale: 0.7, z: -100, duration: 1.5, ease: "power4.out" }, "-=0.5")
            .to(targaryen, { autoAlpha: 1, duration: 1.5, ease: "power4.out" }, "<");
    }

    }
}); 

// --------------------------------------------------------------------------
// ANIMAÇÃO INDEPENDENTE DE TEXTOS SPLIT PARA OS NEGROS E OS VERDES
// --------------------------------------------------------------------------
const textoSplitAll = document.querySelectorAll(".textoSplit");

textoSplitAll.forEach(textoUnicoSplit => {

    const split = SplitText.create(textoUnicoSplit, { type: "words, chars", mask: "lines" });

    gsap.from(split.chars, {
        y: 30,
        opacity: 0,
        duration: .8,
        stagger: .03,
        scrollTrigger: {
            trigger: textoUnicoSplit,
            start: "70% 80%",
            end: "100% 60%",
            scrub: true
        }
    });
});

// --------------------------------------------------------------------------
// ANIMAÇÃO DE OUTRAS SEÇÕES GERAIS DO PROJETO 
// --------------------------------------------------------------------------
function inicializarSecoesAnimadas() {
    const secoes = gsap.utils.toArray(".secao-animada").filter(secao =>
        !secao.classList.contains("lealdade-sessao") &&
        !secao.classList.contains("faccao-personagens") &&
        !secao.classList.contains("sessao-personagem")
    );

    secoes.forEach((secao) => {
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: secao,
                scrub: true,
                start: "top 80%",   
                end: "bottom 20%",  
                invalidateOnRefresh: true
            }
        });

        tl.fromTo(secao,
            { opacity: 0, filter: "blur(15px)", y: 80 },
            { opacity: 1, filter: "blur(0px)", y: 0, duration: 1 }
        );

        tl.to(secao, { opacity: 0, filter: "blur(15px)", y: -80, duration: 1 }, "+=0.5");
    });
}

// --------------------------------------------------------------------------
// PRE-LOADER 
// --------------------------------------------------------------------------
const tlPreloader = gsap.timeline({
    onComplete() {
        const ready = (document.fonts && document.fonts.ready)
            ? document.fonts.ready
            : Promise.resolve();

        ready.then(() => {
            animarPagina();

            gsap.to("#pre-loader", {
                opacity: 0,
                display: "none",
                duration: 0.5,
                onComplete: () => ScrollTrigger.refresh()
            });
        });
    }
});

tlPreloader.to("#pre-loader path", { duration: 1, strokeDashoffset: 0 });
tlPreloader.to("#pre-loader path", { duration: 1, strokeDashoffset: 2450 });
tlPreloader.to("#pre-loader path", { stroke: "#d4af37cb", duration: 0.2, strokeDashoffset: 0 });

/* ==========================================================================
   OBSERVAÇÃO IMPORTANTE SOBRE O CSS (não é código JS, é um lembrete):

   A propriedade "perspective" que faz o efeito de profundidade (translateZ)
   funcionar direito hoje só está declarada em ".rhaenyra-sessao" (no
   rhaenyra.css que te mandei). Como o motor agora aplica o MESMO
   translateZ pra QUALQUER personagem, toda seção ".faccao-personagens"
   precisa dessa mesma propriedade — senão o efeito de profundidade fica
   mais "achatado" nas seções que não tiverem "perspective" no CSS (ex.:
   ".helaena-sessao" hoje não tem).

   Solução: mover a regra "perspective: 1600px;" para a classe
   compartilhada ".faccao-personagens" (a que já existe em todas as
   seções) em vez de deixá-la só em ".rhaenyra-sessao". Não fiz essa
   mudança aqui porque não tenho o arquivo CSS completo da Helaena (só
   recebi o trecho específico dela no chat) — se você me mandar o
   arquivo CSS compartilhado entre os personagens, eu já ajusto direto
   nele.
   ========================================================================== */

// HEADER - esconder quando abrir o trailer
const header = document.querySelector("header");
const abrirTrailer = document.querySelector(".abrir-trailer");
const fecharTrailer = document.querySelector(".fechar-trailer");

function esconderHeader() {
    header.classList.add("header--hidden")
}
function mostrarHeader() {
    header.classList.remove("header--hidden")
}
if (header && abrirTrailer && fecharTrailer) {
    abrirTrailer.addEventListener('click', esconderHeader);
    fecharTrailer.addEventListener('click', mostrarHeader);
}

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

const imagemPadrao = "MENU/TRONO.webp"; 

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
            imagemPrevia.src = imagemPadrao;
            
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
            atualizarImagem(imagemPrevia, imagemPadrao, "House of the Dragon Wallpaper");
            
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
        atualizarImagem(imagemPreview, imagemPadrao, "House of the Dragon Wallpaper");
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
