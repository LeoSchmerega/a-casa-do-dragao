// --------------------------------------------------------------------------
// 1. CONFIGURAÇÃO INICIAL E REGISTRO DE PLUGINS
// --------------------------------------------------------------------------
gsap.registerPlugin(ScrollTrigger, ScrollSmoother, SplitText);

ScrollTrigger.config({
    ignoreMobileResize: true,
    smooth: 2
});

// Instância principal do matchMedia do GSAP
const mm = gsap.matchMedia();

// --------------------------------------------------------------------------
// 2. PRE-LOADER (Global)
// --------------------------------------------------------------------------
const tlPreloader = gsap.timeline({
    onComplete() {
        const ready = (document.fonts && document.fonts.ready)
            ? document.fonts.ready
            : Promise.resolve();

        ready.then(() => {
            configurarAplicacao();

            gsap.to("#pre-loader", {
                opacity: 0,
                display: "none",
                duration: 0.5,
                onComplete: () => ScrollTrigger.refresh() // Restaurado para recalcular pins/scrolls
            });
        });
    }
});

tlPreloader.to("#pre-loader path", { duration: 1, strokeDashoffset: 0 });
tlPreloader.to("#pre-loader path", { duration: 1, strokeDashoffset: 2450 });
tlPreloader.to("#pre-loader path", { stroke: "#d4af37cb", duration: 0.2, strokeDashoffset: 0 });

// --------------------------------------------------------------------------
// 3. ESTRUTURA RESPONSIVA PRINCIPAL
// --------------------------------------------------------------------------
function configurarAplicacao() {

    // ======================================================================
    // MODO DESKTOP (> 1100px)
    // ======================================================================
    mm.add("(min-width: 1101px)", () => {
        let smoother = null;
        const splitInstances = [];
        const eventCleanupCallbacks = [];

        if (!ScrollTrigger.isTouch) {
            ScrollTrigger.normalizeScroll(true);

            smoother = ScrollSmoother.create({
                wrapper: "#smooth-wrapper",
                content: "#smooth-content",
                smooth: 2,
                effects: true
            });
        }

        // --- Hero / Main (Desktop) ---
        gsap.from(".main-fundo", { opacity: 0, y: -150, duration: 2, ease: "power3.out" });
        gsap.from(".main-personagens img", { opacity: 0, y: 100, duration: 2, ease: "power2.out" });
        gsap.from(".main-centro", { opacity: 0, y: 100, duration: 2, ease: "power2.out" });

        gsap.fromTo(".main",
            { opacity: 1 },
            {
                opacity: 0,
                filter: "blur(10px)",
                scrollTrigger: { trigger: ".main", scrub: true, start: "20% 0%", end: "80% 0%" }
            }
        );

        // --- Módulos Interativos Desktop ---
        inicializarVideoLealdadeDesktop(splitInstances);
        inicializarPersonagensDesktop(splitInstances);
        inicializarParallaxCardsDesktop(eventCleanupCallbacks);
        inicializarFooterDesktop();
        inicializarSplitTextGeralDesktop(splitInstances);
        inicializarSecoesAnimadasDesktop();

        // CLEANUP DESKTOP
        return () => {
            if (smoother) smoother.kill();
            ScrollTrigger.normalizeScroll(false);

            splitInstances.forEach(instance => instance && instance.revert && instance.revert());
            eventCleanupCallbacks.forEach(cleanup => cleanup());
        };
    });

    // ======================================================================
    // MODO MOBILE / TABLET (<= 1100px)
    // ======================================================================
    mm.add("(max-width: 1100px)", () => {
        ScrollTrigger.normalizeScroll(false);

        const video = document.getElementById("video-lealdade");
        const fallbackImg = document.getElementById("canvas-fallback");

        if (video) {
            gsap.set(video, { display: "none" });
        }
        
        if (fallbackImg) {
            gsap.set(fallbackImg, {
                display: "block",
                opacity: 1,
                visibility: "visible"
            });
        }

        const secoesGerais = gsap.utils.toArray(".secao-animada").filter(secao =>
            !secao.classList.contains("lealdade-sessao") &&
            !secao.classList.contains("faccao-personagens") &&
            !secao.classList.contains("sessao-personagem") &&
            !secao.className.includes("-sessao")
        );

        secoesGerais.forEach((secao) => {
            gsap.fromTo(secao,
                { opacity: 0, y: 30 },
                {
                    opacity: 1,
                    y: 0,
                    duration: 0.6,
                    scrollTrigger: {
                        trigger: secao,
                        start: "top 85%",
                        toggleActions: "play none none reverse"
                    }
                }
            );
        });
    });
}

// --------------------------------------------------------------------------
// 4. FUNÇÕES DE SUPORTE (DESKTOP)
// --------------------------------------------------------------------------

function inicializarVideoLealdadeDesktop(splitInstances) {
    const video = document.getElementById("video-lealdade");
    const fallbackImg = document.getElementById("canvas-fallback");

    if (!video) return;

    video.muted = true;
    video.playsInline = true;

    const setupTimeline = () => {
        if (isNaN(video.duration) || !isFinite(video.duration)) return;

        // Força exibição do vídeo em redimensionamentos de mobile para desktop
        gsap.set(video, { display: "block", opacity: 0 });

        if (fallbackImg) {
            gsap.to(fallbackImg, {
                opacity: 0,
                duration: 0.6,
                ease: "power2.out",
                onComplete: () => { gsap.set(fallbackImg, { display: "none" }); }
            });
        }

        gsap.to(video, { opacity: 1, duration: 0.6 });

        const splitTitulo = new SplitText(".lealdade-conteudo h1", { type: "words,chars" });
        const splitTexto = new SplitText(".lealdade-conteudo p", { type: "words" });
        const splitSubtitulo = new SplitText(".lealdade-conteudo h2", { type: "words,chars" });

        splitInstances.push(splitTitulo, splitTexto, splitSubtitulo);

        const tlLealdade = gsap.timeline({
            scrollTrigger: {
                trigger: ".lealdade-sessao",
                start: "top top",
                end: "+=300%",
                scrub: 1,
                pin: true,
                anticipatePin: 1,
                invalidateOnRefresh: true
            }
        });

        tlLealdade
            .fromTo(".lealdade-wrapper",
                { autoAlpha: 0, scale: 0.93, filter: "blur(5px)" },
                { autoAlpha: 1, scale: 1, filter: "blur(0px)", duration: 1, ease: "power2.out" }, 0
            )
            .to(video, {
                currentTime: () => video.duration - 0.05,
                ease: "none",
                duration: 6
            }, 0)
            .fromTo(splitTitulo.chars,
                { autoAlpha: 0, y: -30, filter: "blur(5px)" },
                { autoAlpha: 1, y: 0, filter: "blur(0px)", stagger: 0.03, duration: 0.8, ease: "power2.out" }, 0.8
            )
            .fromTo(splitTexto.words,
                { autoAlpha: 0, y: -30, filter: "blur(5px)" },
                { autoAlpha: 1, y: 0, filter: "blur(0px)", stagger: 0.02, duration: 0.8, ease: "power1.out" }, 1.4
            )
            .fromTo(splitSubtitulo.chars,
                { autoAlpha: 0, y: -30, filter: "blur(5px)" },
                { autoAlpha: 1, y: 0, filter: "blur(0px)", stagger: 0.03, duration: 0.8, ease: "power2.out" }, 2.0
            )
            .fromTo(".lealdade-botao .lado",
                { autoAlpha: 0, y: -30, filter: "blur(5px)" },
                { autoAlpha: 1, y: 0, filter: "blur(0px)", stagger: 0.2, duration: 0.8, ease: "power2.out" }, 2.6
            )
            .to(".lealdade-wrapper", {
                autoAlpha: 0,
                filter: "blur(15px)",
                scale: 0.95,
                y: -80,
                duration: 1,
                ease: "power2.inOut"
            })
            .to(".lealdade-sessao", {
                autoAlpha: 0,
                duration: 1,
                ease: "power2.inOut"
            }, "<");
    };

    const forcarInicio = () => {
        video.currentTime = 0.01;
        setupTimeline();
    };

    if (video.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) {
        forcarInicio();
    } else {
        video.addEventListener("loadeddata", forcarInicio, { once: true });
    }
}

function inicializarPersonagensDesktop(splitInstances) {
    const todosPersonagens = document.querySelectorAll("[class$='-sessao']");

    todosPersonagens.forEach(secaoAtual => {
        const fundo = secaoAtual.querySelector("[class$='-fundo']");
        const overlay = secaoAtual.querySelector("[class$='-overlay']");
        const card = secaoAtual.querySelector("[class$='-card']");
        const cardFundo = secaoAtual.querySelector("[class$='-card-fundo']");
        const cardGlass = secaoAtual.querySelector("[class$='-card-glass']");
        const imagem = secaoAtual.querySelector("[class$='-imagem']");
        const nevoa = secaoAtual.querySelector(".nevoa");
        const faisca = secaoAtual.querySelector(".faisca");
        const conteudo = secaoAtual.querySelector("[class$='-conteudo']");
        const targaryen = secaoAtual.querySelector(".logo-targaryen");
        const targaryenVerde = secaoAtual.querySelector(".logo-verde-targaryen");

        const elementosOpcionais = [fundo, overlay, card, cardFundo, cardGlass, imagem, nevoa, faisca,
            conteudo, targaryen, targaryenVerde].filter(Boolean);

        gsap.set(elementosOpcionais, { opacity: 0 });

        if (fundo && conteudo) {
            const textosParaSplitar = conteudo.querySelectorAll("h1, h2, p, [class*='-titulo'], [class*='-citação']");
            const split = new SplitText(textosParaSplitar, { type: "words, chars" });
            splitInstances.push(split);

            gsap.set(split.chars, { autoAlpha: 0 });
            gsap.set(textosParaSplitar, { opacity: 1 });

            const tlPersonagens = gsap.timeline({
                defaults: { immediateRender: false },
                scrollTrigger: {
                    trigger: secaoAtual,
                    start: "top top",
                    end: "+=3800", // Ponto ideal de scroll (3800px)
                    pin: true,
                    scrub: 2,
                    invalidateOnRefresh: true
                }
            });

            tlPersonagens
                .from(fundo, { y: -100, scale: 1.15, duration: 8, ease: "none" })
                .to(fundo, { autoAlpha: 1, duration: 5, ease: "power3.out" }, "<")
                .from(overlay, { scale: 1.3, duration: 5, ease: "power3.out" }, "<")
                .to(overlay, { autoAlpha: 1, duration: 5, ease: "power3.out" }, "<")
                .from(card, { scale: 0.8, duration: 5, ease: "power4.out" }, "-=0.8")
                .to(card, { autoAlpha: 1, duration: 4.5, ease: "power4.out" }, "<")
                .from(cardFundo, { scale: 0.8, duration: 5, ease: "power4.out" }, "<0.15")
                .to(cardFundo, { autoAlpha: 1, duration: 4.5, ease: "power4.out" }, "<")
                .from(cardGlass, { scale: 0.9, duration: 5, ease: "power4.out" }, "<0.1")
                .to(cardGlass, { autoAlpha: 1, duration: 4.5, ease: "power4.out" }, "<")
                .from(imagem, { x: -45, z: -50, duration: 5, ease: "power3.out" }, "-=0.5")
                .to(imagem, { autoAlpha: 1, duration: 4.5, ease: "power3.out" }, "<");

            if (faisca) {
                tlPersonagens
                    .from(faisca, { scale: 0.8, duration: 5, ease: "power3.out" }, "<0.2")
                    .to(faisca, { autoAlpha: 1, duration: 4.5, ease: "power3.out" }, "<");
            }

            if (nevoa) {
                tlPersonagens
                    .from(nevoa, { scale: 0.8, duration: 5, ease: "power3.out" }, "<0.2")
                    .to(nevoa, { autoAlpha: 1, duration: 4.5, ease: "power3.out" }, "<");
            }

            tlPersonagens
                .to(conteudo, { autoAlpha: 1, duration: 0.2 }, "-=0.2")
                .fromTo(split.chars,
                    { y: 30, autoAlpha: 0 },
                    { y: 0, autoAlpha: 1, duration: 0.8, stagger: 0.02, ease: "power3.out" }, "<");

            if (targaryenVerde) {
                tlPersonagens
                    .from(targaryenVerde, { scale: 0.7, z: -100, duration: 1.5, ease: "power4.out" }, "-=0.5")
                    .to(targaryenVerde, { autoAlpha: 1, duration: 1.5, ease: "power4.out" }, "<");
            } else if (targaryen) {
                tlPersonagens
                    .from(targaryen, { scale: 0.7, z: -100, duration: 1.5, ease: "power4.out" }, "-=0.5")
                    .to(targaryen, { autoAlpha: 1, duration: 1.5, ease: "power4.out" }, "<");
            }

            tlPersonagens.to({}, { duration: 3 }); // Pausa mantida em 3 para ritmo equilibrado

            tlPersonagens
                .to([conteudo, ".logo-targaryen", ".logo-verde-targaryen"], {
                    y: -30,
                    autoAlpha: 0,
                    duration: 1,
                    ease: "power2.in"
                })
                .to([card, cardFundo, cardGlass, imagem], {
                    scale: 0.96,
                    y: -15,
                    autoAlpha: 0,
                    duration: 1.2,
                    ease: "power2.in"
                }, "-=0.6")
                .to([fundo, overlay], {
                    scale: 1.08,
                    autoAlpha: 0,
                    duration: 1.5,
                    ease: "power1.inOut"
                }, "-=0.4");
        }
    });
}

function inicializarParallaxCardsDesktop(eventCleanupCallbacks) {
    document.querySelectorAll(".caracteristica-card").forEach(card => {
        const imagem = card.querySelector("[class*='-imagem']") || card.querySelector("img");
        if (!imagem) return;

        const onMouseMove = (e) => {
            const rect = card.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width - 0.5;
            const y = (e.clientY - rect.top) / rect.height - 0.5;

            gsap.to(imagem, {
                x: -x * 15,
                y: -y * 15,
                duration: 0.4,
                overwrite: "auto",
                ease: "power2.out"
            });
        };

        const onMouseLeave = () => {
            gsap.to(imagem, {
                x: 0,
                y: 0,
                duration: 0.6,
                overwrite: "auto",
                ease: "power2.out"
            });
        };

        card.addEventListener("mousemove", onMouseMove);
        card.addEventListener("mouseleave", onMouseLeave);

        eventCleanupCallbacks.push(() => {
            card.removeEventListener("mousemove", onMouseMove);
            card.removeEventListener("mouseleave", onMouseLeave);
        });
    });
}

function inicializarFooterDesktop() {
    const tlFooter = gsap.timeline({
        scrollTrigger: {
            trigger: "footer",
            start: "60% 85%",
            toggleActions: "play reverse play reverse"
        }
    });

    tlFooter
        .fromTo("footer", { y: 60, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.7, ease: "power2.out" })
        .fromTo(".footer-logo img", { x: -80, filter: "blur(8px)", autoAlpha: 0 }, { x: 0, filter: "blur(0px)", autoAlpha: 1, duration: 0.7, ease: "back.out(1.4)" }, "-=0.3")
        .fromTo(".redes-sociais h3", { x: -60, filter: "blur(5px)", autoAlpha: 0 }, { x: 0, filter: "blur(0px)", autoAlpha: 1, duration: 1, ease: "power2.out" }, "-=0.3")
        .fromTo(".redes-sociais ul li", { x: -40, scale: 0.8, filter: "blur(5px)", autoAlpha: 0 }, { x: 0, scale: 1, filter: "blur(0px)", autoAlpha: 1, duration: 0.7, stagger: 0.06, ease: "back.out(1.4)" }, "-=0.2")
        .fromTo(".footer-span p", { x: -50, autoAlpha: 0 }, { x: 0, autoAlpha: 1, duration: 0.7, ease: "power1.out" }, "-=0.2");
}

function inicializarSplitTextGeralDesktop(splitInstances) {
    const textoSplitAll = document.querySelectorAll(".textoSplit");

    textoSplitAll.forEach(textoUnicoSplit => {
        const split = new SplitText(textoUnicoSplit, { type: "words, chars", mask: "lines" });
        splitInstances.push(split);

        gsap.from(split.chars, {
            x: 30,
            opacity: 0,
            duration: 0.9,
            stagger: 0.03,
            invalidateOnRefresh: false,
            scrollTrigger: {
                trigger: textoUnicoSplit,
                start: "top bottom",
                end: "+=500",
                scrub: true
            }
        });
    });
}

function inicializarSecoesAnimadasDesktop() {
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
// HEADER - ESCONDER AO ABRIR O TRAILER
// --------------------------------------------------------------------------
const header = document.querySelector("header");
const abrirTrailer = document.querySelector(".abrir-trailer");
const fecharTrailer = document.querySelector(".fechar-trailer");

function esconderHeader() {
    header.classList.add("header--hidden");
}
function mostrarHeader() {
    header.classList.remove("header--hidden");
}
if (header && abrirTrailer && fecharTrailer) {
    abrirTrailer.addEventListener('click', esconderHeader);
    fecharTrailer.addEventListener('click', mostrarHeader);
}

// --------------------------------------------------------------------------
// MENU LATERAL / OVERLAY
// --------------------------------------------------------------------------
const dadosFaccoes = {
    negros: [
        { nome: "Rhaenyra Targaryen", imagem: "MENU/RHAENYRA.webp" },
        { nome: "Daemon Targaryen", imagem: "MENU/DAEMON.webp" },
        { nome: "Rhaenys Targaryen", imagem: "MENU/RHAENYS.webp" },
        { nome: "Jacaerys Velaryon", imagem: "MENU/JACAERYS.webp" },
        { nome: "Baela Targaryen", imagem: "MENU/BAELA.webp" }
    ],
    verdes: [
        { nome: "Alicent Hightower", imagem: "MENU/alicent.webp" },
        { nome: "Aegon II Targaryen", imagem: "MENU/aegon.webp" },
        { nome: "Aemond Targaryen", imagem: "MENU/aemond.webp" }, 
        { nome: "Helaena Targaryen", imagem: "MENU/helaena.webp" },
        { nome: "Criston Cole", imagem: "MENU/criston.webp" }
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
            switchFaction('negros', true); 
            
            const scrollBarWidth = window.innerWidth - document.documentElement.clientWidth;
            document.body.classList.add('menu-aberto');
            document.body.style.paddingRight = `${scrollBarWidth}px`;
        } else {
            imagemPrevia.src = imagemPadrao;
            
            setTimeout(() => {
                document.body.classList.remove('menu-aberto');
                document.body.style.paddingRight = '';
            }, 1000); 
        }
    }

    if (openBtn && closeBtn && menuOverlay) {
        openBtn.addEventListener('click', toggleMenu);
        closeBtn.addEventListener('click', toggleMenu);
    }

    abaBotoes.forEach(botao => {
        botao.addEventListener('click', (e) => {
            const faccao = e.target.getAttribute('data-faction');
            switchFaction(faccao, true);
        });
    });

    if (listaPersonagens) {
        listaPersonagens.addEventListener('mouseleave', () => {
            atualizarImagem(imagemPrevia, imagemPadrao, "House of the Dragon Wallpaper");
            
            document.querySelectorAll('.lista-personagens li').forEach(li => {
                li.classList.remove('selecionado');
            });
        });
    }
});

function switchFaction(faccao, abrirComPadrao = false) {
    const listaUl = document.getElementById('lista-personagens');
    const imagemPreview = document.getElementById('imagem-previa-personagem');
    const botoesAbas = document.querySelectorAll('.botao-aba');

    if (!listaUl || !imagemPreview) return;

    botoesAbas.forEach(b => b.classList.toggle('ativo', b.getAttribute('data-faction') === faccao));

    listaUl.innerHTML = '';
    const personagens = dadosFaccoes[faccao];

    if (personagens && personagens.length > 0 && !abrirComPadrao) {
        atualizarImagem(imagemPreview, personagens[0].imagem, personagens[0].nome);
    } else if (abrirComPadrao) {
        atualizarImagem(imagemPreview, imagemPadrao, "House of the Dragon Wallpaper");
    }

    personagens.forEach((personagem) => {
        const itemLista = document.createElement('li');
        itemLista.textContent = personagem.nome.toUpperCase(); 

        itemLista.addEventListener('mouseenter', () => {
            document.querySelectorAll('.lista-personagens li').forEach(li => li.classList.remove('selecionado'));
            itemLista.classList.add('selecionado');
            atualizarImagem(imagemPreview, personagem.imagem, personagem.nome);
        });

        listaUl.appendChild(itemLista);
    });
}

function atualizarImagem(elementoImg, src, alt) {
    if (!elementoImg || elementoImg.src.includes(src)) return;
    
    elementoImg.classList.add('mudando');
    setTimeout(() => {
        elementoImg.src = src;
        elementoImg.alt = `Preview de ${alt}`;
        elementoImg.classList.remove('mudando');
    }, 150);
}

// --------------------------------------------------------------------------
// MODAL DE TRAILER
// --------------------------------------------------------------------------
document.addEventListener('DOMContentLoaded', () => {

    const abrirTrailer = document.querySelector('.abrir-trailer');
    const fecharTrailer = document.querySelector('.fechar-trailer');
    const proximoTrailer = document.querySelector('.proximo-trailer');
    const modalTrailer = document.querySelector('.trailer');
    const video = document.querySelector('.video-trailer');

    if (!modalTrailer || !video) return;

    const trailers = [
        'PRIMEIRA TELA/A Casa do Dragão - Temporada 3 - Teaser Trailer Dublado - HBO Max.mp4',
        'PRIMEIRA TELA/A Casa do Dragão - Temporada 3 - Teaser Oficial - HBO Max.mp4'
    ];

    let trailerAtual = 0;

    if (abrirTrailer) abrirTrailer.addEventListener('click', abrirModal);
    if (fecharTrailer) fecharTrailer.addEventListener('click', fecharModal);
    if (proximoTrailer) proximoTrailer.addEventListener('click', trocarTrailer);

    function abrirModal() {
        modalTrailer.classList.add('trailer-aberto');
        video.src = trailers[trailerAtual];
        video.play();

        const scrollBarWidth = window.innerWidth - document.documentElement.clientWidth;
        document.body.style.overflow = 'hidden';
        document.body.style.paddingRight = `${scrollBarWidth}px`;
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