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