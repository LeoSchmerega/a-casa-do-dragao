// FUNÇÃO PARA ANIMAR A TRANSIÇÃO DE SECOES
function inicializarSecoesAnimadas() {
    const secoes = gsap.utils.toArray(".secao-animada");

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

//ANIMAÇÃO DA SECAO LEALDADE
function inicializarVideoLealdade() {
    const video = document.getElementById("video-midia-bg");
    if (!video) return;

    const videoDuracao = 6;

    gsap.to(video, {
        backgroundColor: "black",
        currentTime: videoDuracao,
        ease: "none",
        scrollTrigger: {
            markers: true,
            trigger: "#video-midia-bg",
            start: "0% 90%",
            end: "30% 10%",
            scrub: 0.1, // Reduzido de 1 para 0.1 para resposta instantânea ao scroll físico
            onUpdate: (self) => {
                // Força o renderizador do navegador a atualizar o frame de forma síncrona
                if (video.paused) {
                    video.play().then(() => video.pause());
                }
            }
        }
    });
}
