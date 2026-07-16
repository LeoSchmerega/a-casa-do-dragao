/* ==========================================================================
   HOUSE OF THE DRAGON — PORTFÓLIO
   Motor de animação cinematográfico otimizado (GSAP + ScrollTrigger + SplitText)
   Versão: Transição Suave e Homogênea em Preto Absoluto para Todas as Seções
   ========================================================================== */

// 1. CONFIGURAÇÃO INICIAL E REGISTRO DE PLUGINS
gsap.registerPlugin(ScrollTrigger, ScrollSmoother, SplitText);

const smoother = ScrollSmoother.create({
    wrapper: "#smooth-wrapper",
    content: "#smooth-content",
    smooth: 1.8,
    effects: true,
    normalizeScroll: true
});

// =========================================================================
// ANIMAÇÃO MAIN
// =========================================================================

function animarPagina() {  
    // Animação de entrada da seção "Main" (Hero Section) ao carregar a página
    gsap.from(".main-fundo", {
        opacity: 0,
        y: -150,
        duration: 1,
        ease: "power3.out"
    });

    gsap.from(".main-personagens img", {
        opacity: 0,
        y: 100,
        duration: 1,
        ease: "power2.out"
    });

    gsap.from(".main-centro", {
        opacity: 0,
        y: 100,
        duration: 1,
        ease: "power2.out"
    });

    gsap.fromTo(".main", 
        { opacity: 1 }, 
        {
            opacity: 0, 
            filter: "blur(10px)",
            scrollTrigger: {
                trigger: ".main",
                scrub: true,
                start: "20% 0%", 
                end: "80% 0%"  
            }
    });

    // Sincroniza a inicialização dos módulos mais pesados
    inicializarVideoLealdade();
    inicializarSecoesAnimadas();
}

// =========================================================================
// SEÇÃO LEALDADE (VÍDEO DRAGÃO + SAÍDA SUAVE PARA O PRETO)
// =========================================================================
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
        console.log(`Iniciando carregamento de ${totalFrames} imagens...`);

        for (let i = 0; i < totalFrames; i++) {
            const img = new Image();
            
            img.onload = () => {
                framesCarregados++;
                
                console.log(`Carregado: ${framesCarregados}/${totalFrames}`);

                if (i === 0) {
                    desenharFrame();
                }

                if (framesCarregados === totalFrames) {
                    console.log("Todas as imagens carregadas com sucesso! Ativando Scroll...");
                    esconderFallbackECriarScroll();
                }
            };

            img.onerror = () => {
                console.error(`ERRO CRÍTICO: Não foi possível carregar o frame no caminho: ${img.src}`);
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
                onComplete: () => {
                    fallbackImg.style.display = "none";
                }
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
            {
                opacity: 0,
                scale: 0.93, 
                filter: "blur(5px)" 
            },
            {
                opacity: 1,
                scale: 1,
                filter: "blur(0px)",
                duration: 0.4, 
                ease: "power2.out"
            }, 
            0
        );

        tlLealdade.to(sequencia, {
            frame: totalFrames - 1,
            ease: "none",
            duration: 1.5,
            onUpdate: desenharFrame 
        }, 0);

        // Entrada dos textos
        tlLealdade.from(splitTitulo.chars, {
            opacity: 0,
            y: -30,
            filter: "blur(1px)",
            stagger: 0.03,
            duration: 0.8,
            ease: "power2.out"
        }, 1.0);

        tlLealdade.from(splitTexto.words, {
            opacity: 0,
            y: -20,
            filter: "blur(1px)",
            stagger: 0.02,
            duration: 1,
            ease: "power1.out"
        }, 1.5);

        tlLealdade.from(splitSubtitulo.chars, {
            opacity: 0,
            y: -30,
            filter: "blur(1px)",
            stagger: 0.03,
            duration: 0.8,
            ease: "power2.out"
        }, 3.0);

        tlLealdade.from(".lealdade-botao .lado", {
            opacity: 0,
            y: -30,
            filter: "blur(10px)",
            stagger: 0.2,
            duration: 0.8,
            ease: "power2.out"
        }, 2.5);

        // Saída limpa esmaecendo completamente para o preto absoluto antes da próxima seção
        tlLealdade.to(".lealdade-wrapper", {
            opacity: 0,
            filter: "blur(15px)",
            scale: 0.95,
            y: -80,
            duration: 1.2,
            ease: "power2.inOut"
        }, 3.5);

        tlLealdade.to(".lealdade-sessao", {
            opacity: 0,
            duration: 1.2,
            ease: "power2.inOut"
        }, 3.5);

        ScrollTrigger.refresh();
    }

    precarregarImagens();
}

// =========================================================================
// ANIMAÇÃO INDEPENDENTE DE TEXTOS SPLIT GERAL
// =========================================================================
const textoSplitAll = document.querySelectorAll(".textoSplit");

textoSplitAll.forEach(textoUnicoSplit => {
    const split = SplitText.create(textoUnicoSplit, {
        type: "words, chars",
        mask: "lines"
    });

    gsap.from(split.chars, {
        y: 50,
        opacity: 0,
        duration: .8,
        stagger: .03,
        scrollTrigger: {
            trigger: textoUnicoSplit,
            start: "80% 80%",
            end: "100% 0%",
            toggleActions: "play none play reset"
        }
    });
});

// =========================================================================
// ANIMAÇÃO E TRANSIÇÃO DAS SEÇÕES DOS PERSONAGENS (FACÇÕES)
// =========================================================================

const REDUCE_MOTION = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const SCRUB_SMOOTHING = 0.5;

gsap.defaults({ ease: 'power2.out' });

function initAllCharacterSections() {
    const sections = document.querySelectorAll('.faccao-personagens');

    sections.forEach((section) => {
        const els = queryCharacterElements(section);
        if (!els.personagemImg || !els.conteudo) return; 

        setInitialStates(els);

        if (REDUCE_MOTION) {
            revealInstantly(els);
            return;
        }

        buildEntranceAndExitTimeline(els);
        setupCardHover(els);      
        setupCharacterHover(els);  
        setupLogoHover(els);      
    });

    ScrollTrigger.refresh();
}

function queryCharacterElements(section) {
    const fundoWrap = section.querySelector(':scope > [class*="-fundo"]');
    const cardFundoWrap = section.querySelector('[class*="-card-fundo"]');
    const glass = section.querySelector('[class*="-card-glass"]');
    const overlay = section.querySelector('[class*="-overlay"]');
    const personagemWrap = section.querySelector('[class*="-imagem"], .personagem-imagem');
    const particlesContainer = section.querySelector('.faisca, .neblina');
    const particles = section.querySelectorAll('.spark-item, .mist-item');

    let particleType = null;
    if (section.querySelector('.faisca')) particleType = 'fogo';
    else if (section.querySelector('.neblina')) particleType = 'neblina';

    const card = section.querySelector('.caracteristica-card');
    const logoImg = card ? card.querySelector('.card-logo-selo, [class*="logo-selo"], .logo-targaryen-canto') : null;

    return {
        section,
        card,
        fundoWrap,
        fundoImg: fundoWrap ? fundoWrap.querySelector('img') : null,
        overlay,
        cardFundoWrap,
        cardFundoImg: cardFundoWrap ? cardFundoWrap.querySelector('img') : null,
        glass,
        personagemWrap,
        personagemImg: personagemWrap ? personagemWrap.querySelector('img') : null,
        particlesContainer,
        particles,
        particleType,
        logoImg,
        conteudo: section.querySelector('[class*="-conteudo"]'),
    };
}

function getContentChildren(conteudo) {
    const c = Array.from(conteudo.children);
    return {
        titulo: c[0] || null,
        subtitulo: c[1] || null,
        descricao: c[2] || null,
        nomeDragao: c[3] || null,
        tituloDragao: c[4] || null,
        citacaoFinal: c[5] || null,
    };
}

function setInitialStates(els) {
    const content = getContentChildren(els.conteudo);
    els.content = content; 

    // Garante que a seção tenha fundo preto absoluto para suavidade nas transições
    gsap.set(els.section, { backgroundColor: '#000000' });

    if (els.fundoImg) {
        gsap.set(els.fundoImg, {
            opacity: 0,
            scale: 1.12,
            filter: 'blur(15px)',
            transformOrigin: '50% 50%',
        });
    }

    if (els.overlay) {
        gsap.set(els.overlay, { opacity: 0 });
    }

    if (els.cardFundoImg) {
        gsap.set(els.cardFundoImg, {
            opacity: 0,
            scale: 1.08,
            transformOrigin: '50% 50%',
        });
    }

    if (els.glass) {
        gsap.set(els.glass, { opacity: 0, filter: 'blur(6px)' });
    }

    if (els.personagemImg) {
        gsap.set(els.personagemImg, {
            opacity: 0,
            scale: 1.05,
            rotation: -2,
            filter: 'blur(10px)',
            clipPath: 'inset(8% 0% 0% 0%)',
            transformOrigin: '50% 100%',
        });
    }

    if (els.particles && els.particles.length) {
        gsap.set(els.particles, { opacity: 0, scale: 0.6, y: 15 });
    }

    if (els.logoImg) {
        gsap.set(els.logoImg, { opacity: 0, scale: 0.7, filter: 'brightness(0.8)' });
    }

    if (content.titulo) {
        els.titleSplit = new SplitText(content.titulo, {
            type: 'chars',
            charsClass: 'char',
        });
        gsap.set(els.titleSplit.chars, {
            opacity: 0,
            y: 18,
            rotateX: -30,
            filter: 'blur(4px)',
            transformOrigin: '50% 100%',
        });
    }

    [content.subtitulo, content.descricao, content.tituloDragao, content.citacaoFinal].forEach((el) => {
        if (el) gsap.set(el, { opacity: 0, y: 12 });
    });

    if (content.nomeDragao) {
        gsap.set(content.nomeDragao, { opacity: 0, y: 8, scale: 0.9, filter: 'brightness(1)' });
    }
}

function revealInstantly(els) {
    const all = [
        els.fundoImg, els.overlay, els.cardFundoImg, els.glass,
        els.personagemImg, els.logoImg,
    ].filter(Boolean);
    gsap.set(all, { opacity: 1, scale: 1, rotation: 0, filter: 'none', clipPath: 'none' });

    if (els.particles && els.particles.length) {
        gsap.set(els.particles, { opacity: 0.7, scale: 1, y: 0 });
    }

    if (els.content.titulo) els.content.titulo.style.opacity = 1;
    Object.values(els.content).forEach((el) => {
        if (el) gsap.set(el, { opacity: 1, y: 0, scale: 1 });
    });
}

/* ==========================================================================
   CONFIGURAÇÃO PERSONALIZADA: RHAENYRA (TRANSIÇÃO ULTRA CINEMATOGRÁFICA)
   ========================================================================== */

function setInitialStates(els) {
    const content = getContentChildren(els.conteudo);
    els.content = content; 

    // Força a seção a iniciar visível sobre o fundo preto
    gsap.set(els.section, { opacity: 1, backgroundColor: '#000000' });

    // Detecta qual personagem é o desta seção
    const isRhaenyra = els.section.classList.contains('secao-rhaenyra') || els.section.id === 'rhaenyra';
    const isHelaena = els.section.classList.contains('secao-helaena') || els.section.id === 'helaena';

    // ==========================================
    // ESTADO INICIAL: TUDO INVISÍVEL (OPACIDADE 0)
    // ==========================================
    
    // Planos de Fundo e Overlays
    if (els.fundoWrap) gsap.set(els.fundoWrap, { opacity: 0 });
    if (els.fundoImg) {
        gsap.set(els.fundoImg, {
            opacity: 0,
            scale: 1.15,
            filter: 'blur(15px)',
            transformOrigin: '50% 50%',
            y: isRhaenyra ? -200 : 0
        });
    }
    if (els.overlay) gsap.set(els.overlay, { opacity: 0 });

    // O Card (Invisível e encolhido a 0.8 para dar efeito de Zoom-In ao entrar)
    if (els.card) {
        gsap.set(els.card, {
            opacity: 0,
            scale: 0.8, 
            transformOrigin: '50% 50%',
            transformPerspective: 1000
        });
    }
    if (els.cardFundoWrap) gsap.set(els.cardFundoWrap, { opacity: 0, scale: 0.8 });
    if (els.cardFundoImg) gsap.set(els.cardFundoImg, { opacity: 0, scale: 0.8 });
    if (els.glass) gsap.set(els.glass, { opacity: 0, scale: 0.8, filter: 'blur(10px)' });

    // Personagens
    if (els.personagemWrap) gsap.set(els.personagemWrap, { opacity: 0 });
    if (els.personagemImg) {
        if (isRhaenyra) {
            gsap.set(els.personagemImg, {
                opacity: 0,
                x: -150,
                scale: 0.95,
                filter: 'blur(8px)',
                transformOrigin: '50% 100%'
            });
        } else {
            gsap.set(els.personagemImg, {
                opacity: 0,
                scale: 1.05,
                rotation: isHelaena ? 0 : -2,
                filter: 'blur(10px)',
                clipPath: 'inset(8% 0% 0% 0%)',
                transformOrigin: '50% 100%',
            });
        }
    }

    // Faíscas, Logos e Textos
    if (els.particles && els.particles.length) {
        gsap.set(els.particles, { opacity: 0, scale: 0.6, y: 15 });
    }

    if (els.logoImg) {
        gsap.set(els.logoImg, { opacity: 0, scale: 0.7, filter: 'brightness(0.8)' });
    }

    if (content.titulo) {
        els.titleSplit = new SplitText(content.titulo, {
            type: 'chars',
            charsClass: 'char',
        });
        gsap.set(els.titleSplit.chars, {
            opacity: 0,
            y: 18,
            rotateX: -30,
            filter: 'blur(4px)',
            transformOrigin: '50% 100%',
        });
    }

    [content.subtitulo, content.descricao, content.tituloDragao, content.citacaoFinal].forEach((el) => {
        if (el) gsap.set(el, { opacity: 0, y: 15 });
    });

    if (content.nomeDragao) {
        gsap.set(content.nomeDragao, { opacity: 0, y: 8, scale: 0.9 });
    }
}

function buildEntranceAndExitTimeline(els) {
    const content = els.content;
    const split = els.titleSplit;
    
    // Identificadores de personagem
    const isRhaenyra = els.section.classList.contains('secao-rhaenyra') || els.section.id === 'rhaenyra';
    const isHelaena = els.section.classList.contains('secao-helaena') || els.section.id === 'helaena';

    const masterTl = gsap.timeline({
        scrollTrigger: {
            trigger: els.section,
            start: 'top top',    
            end: '+=400%',       
            scrub: SCRUB_SMOOTHING,
            pin: true,           
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onEnter: () => startIdleLoops(els),
            onEnterBack: () => startIdleLoops(els),
            onLeave: () => pauseIdleLoops(els),
            onLeaveBack: () => pauseIdleLoops(els),
        },
        defaults: { ease: 'power2.out' }
    });

    const entranceTl = gsap.timeline();
    entranceTl.addLabel('start');

    // ==========================================
    // 1. REVELAÇÃO DO FUNDO (DO PRETO PARA A IMAGEM)
    // ==========================================
    if (els.fundoWrap) entranceTl.to(els.fundoWrap, { opacity: 1, duration: 1.2 }, 'start');
    if (els.overlay) entranceTl.to(els.overlay, { opacity: 1, duration: 1.2 }, 'start');
    
    if (els.fundoImg) {
        if (isRhaenyra) {
            entranceTl.to(els.fundoImg, { opacity: 1, y: 0, scale: 1, duration: 1.5 }, 'start');
        } else {
            entranceTl.to(els.fundoImg, { opacity: 1, scale: 1, filter: 'blur(0px)', duration: 1.4 }, 'start');
        }
    }

    // Intervalo sutil para o fundo fixar antes do card surgir
    entranceTl.to({}, { duration: 0.5 });

    // ==========================================
    // 2. ENTRADA DO CARD (ZOOM-IN DE 0.8 PARA 1)
    // ==========================================
    entranceTl.addLabel('card_revelado');
    if (els.card) {
        entranceTl.to(els.card, { 
            opacity: 1, 
            scale: 1, 
            duration: 1.4, 
            ease: isRhaenyra ? 'back.out(1.2)' : 'power2.out' 
        }, 'card_revelado');
    }
    if (els.cardFundoWrap) entranceTl.to(els.cardFundoWrap, { opacity: 1, scale: 1, duration: 1.4 }, 'card_revelado');
    if (els.cardFundoImg) entranceTl.to(els.cardFundoImg, { opacity: 1, scale: 1, duration: 1.2 }, 'card_revelado');
    if (els.glass) entranceTl.to(els.glass, { opacity: 1, scale: 1, filter: 'blur(0px)', duration: 1.2 }, 'card_revelado+=0.2');

    // ==========================================
    // 3. ENTRADA DO PERSONAGEM
    // ==========================================
    entranceTl.addLabel('personagem_revelado', '>-0.2');
    if (els.personagemWrap) entranceTl.to(els.personagemWrap, { opacity: 1, duration: 0.5 }, 'personagem_revelado');
    
    if (els.personagemImg) {
        if (isRhaenyra) {
            entranceTl.to(els.personagemImg, {
                opacity: 1,
                x: 0,
                scale: 1,
                filter: 'blur(0px)',
                duration: 1.5,
                ease: 'power3.out'
            }, 'personagem_revelado');
        } else {
            entranceTl.to(els.personagemImg, {
                opacity: 1,
                scale: 1,
                rotation: 0,
                filter: 'blur(0px)',
                clipPath: 'inset(0% 0% 0% 0%)',
                duration: 1.3,
                ease: 'power2.out'
            }, 'personagem_revelado');
        }
    }

    // ==========================================
    // 4. ENTRADA DOS TEXTOS E LOGO
    // ==========================================
    entranceTl.addLabel('textos', '>-0.3');
    if (split && split.chars.length) {
        entranceTl.to(split.chars, {
            opacity: 1,
            y: 0,
            rotateX: 0,
            filter: 'blur(0px)',
            duration: 0.9,
            stagger: 0.03,
        }, 'textos');
    }
    if (content.subtitulo) entranceTl.to(content.subtitulo, { opacity: 1, y: 0, duration: 0.7 }, '>-0.2');
    if (content.descricao) entranceTl.to(content.descricao, { opacity: 1, y: 0, duration: 0.8 }, '>-0.3');
    if (content.nomeDragao) entranceTl.to(content.nomeDragao, { opacity: 1, y: 0, scale: 1, duration: 0.7, ease: 'back.out(1.2)' }, '>-0.3');
    if (content.tituloDragao) entranceTl.to(content.tituloDragao, { opacity: 1, y: 0, duration: 0.6 }, '<+0.1');
    if (content.citacaoFinal) entranceTl.to(content.citacaoFinal, { opacity: 1, y: 0, duration: 0.9 }, '>-0.2');
    if (els.logoImg) entranceTl.to(els.logoImg, { opacity: 1, scale: 1, duration: 0.8, ease: 'back.out(1.5)' }, '<+0.2');

    // Partículas/Faíscas surgindo
    if (els.particles && els.particles.length) {
        entranceTl.to(els.particles, { opacity: 0.85, scale: 1, y: 0, duration: 0.8, stagger: { each: 0.05, from: 'random' } }, '>-0.5');
    }

    masterTl.add(entranceTl);

    // Tempo de parada e leitura no centro do scroll
    masterTl.to({}, { duration: 1.8 }); 

    // ==========================================
    // 5. SAÍDA DE ZOOM OUT UNIFICADA (EFEITO HELAENA)
    // ==========================================
    const exitTl = gsap.timeline();
    exitTl.addLabel('exitStart');

    // O Card encolhe suavemente para trás (scale 0.8) e desfoca no preto
    if (els.card) {
        exitTl.to(els.card, {
            scale: 0.8,               
            opacity: 0,               
            filter: 'blur(15px)',     
            duration: 1.2,
            ease: 'power2.inOut'
        }, 'exitStart');
    }

    // Textos, logo e personagem reduzem de escala proporcionalmente ao card
    const innerElements = [
        els.personagemImg,
        els.personagemWrap,
        els.particlesContainer,
        els.logoImg,
        content.titulo,
        content.subtitulo,
        content.descricao,
        content.nomeDragao,
        content.citacaoFinal
    ].filter(Boolean);

    if (innerElements.length) {
        exitTl.to(innerElements, {
            opacity: 0,
            scale: 0.85,
            duration: 1.0,
            stagger: 0.01,
            ease: 'power2.in'
        }, 'exitStart');
    }

    // O fundo se dissipa por último para garantir a transição em preto absoluto
    const bgElements = [els.fundoImg, els.overlay, els.fundoWrap].filter(Boolean);
    if (bgElements.length) {
        exitTl.to(bgElements, {
            opacity: 0,
            duration: 1.1,
            ease: 'power1.in'
        }, 'exitStart+=0.1');
    }

    // Pequena margem de tela preta antes da próxima seção fixar
    exitTl.to({}, { duration: 0.4 }); 

    masterTl.add(exitTl);

    return masterTl;
}

function animarRhaenyra() {
    // 1. Seleciona a seção e os elementos exclusivos da Rhaenyra
    const secao = document.querySelector('#rhaenyra');
    if (!secao) return; // Se não achar a seção, não faz nada

    const fundoTodaTela = secao.querySelector('.syrax-fundo');
    const overlay = secao.querySelector('.syrax-overlay');
    const card = secao.querySelector('.rhaenyra-card');
    const cardFundo = secao.querySelector('.syrax-card-fundo');
    const glass = secao.querySelector('.syrax-card-glass');
    const personagemImg = secao.querySelector('.rhaenyra-imagem');
    const conteudo = secao.querySelector('.rhaenyra-conteudo');
    const logo = secao.querySelector('.logo-targaryen');
    const faiscas = secao.querySelectorAll('.faisca .spark-item');

    // 2. Cria a Linha do Tempo Mestra (ScrollTrigger)
    const masterTl = gsap.timeline({
        scrollTrigger: {
            trigger: secao,
            start: 'top top',
            end: '+=400%', // Duração do scroll para dar tempo de animar, pausar e sair
            scrub: 1,      // Deixa a animação suave acompanhando o mouse
            pin: true,     // Fixa a tela enquanto acontece a animação
            anticipatePin: 1
        }
    });

    // =====================================
    // FASE 1: ENTRADA (ZOOM IN SUAVE)
    // =====================================
    const entradaTl = gsap.timeline();

    // O fundo preto absoluto clareia revelando a imagem de fundo e o overlay
    if (fundoTodaTela) entradaTl.fromTo(fundoTodaTela, { opacity: 0 }, { opacity: 1, duration: 1.5 }, "inicio");
    if (overlay) entradaTl.fromTo(overlay, { opacity: 0 }, { opacity: 1, duration: 1.5 }, "inicio");

    // O CARD surge com Zoom In (Escala 0.8 -> 1)
    if (card) {
        entradaTl.fromTo(card,
            { opacity: 0, scale: 0.8 }, // Começa menor e invisível
            { opacity: 1, scale: 1, duration: 1.5, ease: "power2.out" },
            "inicio+=0.2"
        );
    }

    // Imagem do fundo do card e o Glass acompanham o zoom
    if (cardFundo) entradaTl.fromTo(cardFundo, { opacity: 0, scale: 0.9 }, { opacity: 1, scale: 1, duration: 1.5, ease: "power2.out" }, "inicio+=0.2");
    if (glass) entradaTl.fromTo(glass, { opacity: 0 }, { opacity: 1, duration: 1.2 }, "inicio+=0.4");

    // A Rhaenyra e os textos aparecem
    if (personagemImg) entradaTl.fromTo(personagemImg, { opacity: 0, scale: 0.95 }, { opacity: 1, scale: 1, duration: 1.2, ease: "power2.out" }, "inicio+=0.5");
    if (conteudo) entradaTl.fromTo(conteudo, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 1 }, "inicio+=0.6");
    if (logo) entradaTl.fromTo(logo, { opacity: 0, scale: 0.5 }, { opacity: 1, scale: 1, duration: 1, ease: "back.out(1.5)" }, "inicio+=0.7");
    
    // Faíscas
    if (faiscas.length) entradaTl.fromTo(faiscas, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 1, stagger: 0.2 }, "inicio+=0.8");

    masterTl.add(entradaTl);

    // =====================================
    // FASE 2: TEMPO DE LEITURA
    // =====================================
    // Cria um espaço estático na timeline para o usuário conseguir ler o card tranquilamente
    masterTl.to({}, { duration: 2 }); 

    // =====================================
    // FASE 3: SAÍDA (ZOOM OUT ESTILO HELAENA)
    // =====================================
    const saidaTl = gsap.timeline();

    // Tudo dentro do card "encolhe" de volta para 0.8 e ganha um blur leve para sumir no escuro
    saidaTl.to([card, personagemImg, conteudo, logo, faiscas], {
        scale: 0.8,
        opacity: 0,
        filter: "blur(10px)",
        duration: 1.5,
        ease: "power2.inOut"
    }, "saida");

    // O fundo geral desaparece logo em seguida, voltando para o preto total
    saidaTl.to([fundoTodaTela, overlay], {
        opacity: 0,
        duration: 1.5,
        ease: "power2.inOut"
    }, "saida+=0.2");

    masterTl.add(saidaTl);
}

// Inicia a animação assim que o script for carregado
animarRhaenyra();

// HOVER NOS PERSONAGENS 
function setupCharacterHover(els) {
    if (!els.personagemWrap || !els.personagemImg) return;

    const wrap = els.personagemWrap;
    const img = els.personagemImg;
    let hoverTween = null;

    wrap.addEventListener('mouseenter', () => {
        if (hoverTween) hoverTween.kill();

        hoverTween = gsap.to(img, {
            scale: 1.06,
            y: -10,
            filter: 'brightness(1.15) contrast(1.05) drop-shadow(0px 15px 30px rgba(0,0,0,0.6))',
            duration: 0.4,
            ease: 'power2.out',
            overwrite: 'auto'
        });
    });

    wrap.addEventListener('mouseleave', () => {
        if (hoverTween) hoverTween.kill();

        hoverTween = gsap.to(img, {
            scale: 1.0,
            y: 0,
            filter: 'brightness(1) contrast(1) drop-shadow(0px 0px 0px rgba(0,0,0,0))',
            duration: 0.5,
            ease: 'power2.out',
            overwrite: 'auto'
        });
    });
}

// HOVER 3D DO CARD (Utiliza transições aceleradas via GPU)
function setupCardHover(els) {
    if (!els.card) return;

    const card = els.card;

    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const xc = (x / rect.width) - 0.5;
        const yc = (y / rect.height) - 0.5;

        const rotateY = xc * 8;   
        const rotateX = -yc * 8;  

        gsap.to(card, {
            rotateY: rotateY,
            rotateX: rotateX,
            scale: 1.015,
            transformPerspective: 1000,
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.45), inset 0 0 15px rgba(255, 255, 255, 0.05)',
            duration: 0.3,
            ease: 'power2.out',
            overwrite: 'auto'
        });
    });

    card.addEventListener('mouseleave', () => {
        gsap.to(card, {
            rotateY: 0,
            rotateX: 0,
            scale: 1.0,
            boxShadow: '0 10px 25px rgba(0, 0, 0, 0.35)',
            duration: 0.5,
            ease: 'power2.out',
            overwrite: 'auto'
        });
    });
}

// HOVER DO LOGO
function setupLogoHover(els) {
    if (!els.logoImg) return;

    const logo = els.logoImg;
    let hoverTween = null;

    logo.addEventListener('mouseenter', () => {
        if (hoverTween) hoverTween.kill();

        hoverTween = gsap.to(logo, {
            scale: 1.18,
            filter: 'brightness(1.5) drop-shadow(0px 0px 10px rgba(76, 175, 80, 0.5))',
            rotation: 12,
            duration: 0.4,
            ease: 'power2.out',
            overwrite: 'auto'
        });
    });

    logo.addEventListener('mouseleave', () => {
        if (hoverTween) hoverTween.kill();

        hoverTween = gsap.to(logo, {
            scale: 1.0,
            filter: 'brightness(0.9) drop-shadow(0px 0px 0px rgba(0,0,0,0))',
            rotation: 0,
            duration: 0.5,
            ease: 'power2.out',
            overwrite: 'auto'
        });
    });
}

// AMBIENTAÇÃO INFINITA (IDLE LOOPS)
function startIdleLoops(els) {
    if (els.section._gsapIdleTimeline) {
        els.section._gsapIdleTimeline.play();
        return;
    }

    const idleTl = gsap.timeline({ repeat: -1 });
    els.section._gsapIdleTimeline = idleTl;

    if (els.fundoImg) {
        idleTl.to(els.fundoImg, {
            scale: '+=0.02',
            x: '+=5',
            duration: 10,
            ease: 'sine.inOut',
            yoyo: true,
            repeat: -1,
        }, 0);
    }

    if (els.cardFundoImg) {
        idleTl.to(els.cardFundoImg, {
            scale: '+=0.015',
            duration: 8,
            ease: 'sine.inOut',
            yoyo: true,
            repeat: -1,
        }, 0);
    }

    if (els.glass) {
        idleTl.to(els.glass, {
            opacity: '-=0.04',
            duration: 3.5,
            ease: 'sine.inOut',
            yoyo: true,
            repeat: -1,
        }, 0);
    }

    if (els.logoImg) {
        idleTl.to(els.logoImg, {
            opacity: '-=0.08',
            duration: 2.8,
            ease: 'sine.inOut',
            yoyo: true,
            repeat: -1,
        }, 0);
    }

    if (els.particles && els.particles.length) {
        els.particles.forEach((particle, i) => animateParticleLoop(particle, els.particleType, i));
    }
}

function pauseIdleLoops(els) {
    if (els.section._gsapIdleTimeline) {
        els.section._gsapIdleTimeline.pause();
    }
}

function animateParticleLoop(el, type, index) {
    if (type === 'neblina') {
        gsap.to(el, {
            x: `+=${gsap.utils.random(20, 40)}`,
            y: `+=${gsap.utils.random(-8, 8)}`,
            duration: gsap.utils.random(10, 16),
            ease: 'sine.inOut',
            yoyo: true,
            repeat: -1,
            delay: index * 0.4,
        });
        return;
    }

    const rise = () => {
        gsap.fromTo(el,
            {
                y: 0,
                x: 0,
                opacity: gsap.utils.random(0.35, 0.75),
                scale: gsap.utils.random(0.55, 1),
            },
            {
                y: -gsap.utils.random(60, 120),
                x: `+=${gsap.utils.random(-16, 16)}`,
                opacity: 0,
                scale: gsap.utils.random(0.3, 0.6),
                duration: gsap.utils.random(2.2, 4),
                ease: 'sine.in',
                onComplete: rise,
            }
        );
    };
    gsap.delayedCall(index * gsap.utils.random(0.1, 0.4), rise);
}

// =========================================================================
// ANIMAÇÃO DE OUTRAS SEÇÕES GERAIS DO PROJETO
// =========================================================================
function inicializarSecoesAnimadas() {
    const secoes = gsap.utils.toArray(".secao-animada").filter(secao => 
        !secao.classList.contains("lealdade-sessao") &&
        !secao.classList.contains("faccao-personagens")
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
            {
                opacity: 0,
                filter: "blur(15px)",
                y: 80
            },
            {
                opacity: 1,
                filter: "blur(0px)",
                y: 0,
                duration: 1
            }
        );

        tl.to(secao, {
            opacity: 0,
            filter: "blur(15px)",
            y: -80,
            duration: 1
        }, "+=0.5"); 
    });
}

// =========================================================================
// ANIMAÇÃO E INICIALIZAÇÃO DO PRE-LOADER E FONTES (Sincronizados)
// =========================================================================
const tlPreloader = gsap.timeline({  
    onComplete() {
        // Garante que o DOM e Fontes estejam prontos e estáveis antes de disparar as animações principais
        const ready = (document.fonts && document.fonts.ready) 
            ? document.fonts.ready 
            : Promise.resolve();

        ready.then(() => {
            animarPagina();
            initAllCharacterSections(); // Evita a race condition de cálculo de posições de ScrollTrigger
            
            gsap.to("#pre-loader", {
                opacity: 0,
                display: "none",
                duration: 0.5,
                onComplete: () => ScrollTrigger.refresh() // Recalcula todas as alturas de pins com o DOM estável
            });
        });
    }
});

tlPreloader.to("#pre-loader path", {
    duration: 1,
    strokeDashoffset: 0
});

tlPreloader.to("#pre-loader path", {
    duration: 1,
    strokeDashoffset: 2450
});

tlPreloader.to("#pre-loader path", {
    stroke: "#d4af37cb",
    duration: 0.2,
    strokeDashoffset: 0
});

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
