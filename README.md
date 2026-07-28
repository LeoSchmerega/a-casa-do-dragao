# 🐉 A Casa do Dragão | Landing Page Cinematográfica

> Uma experiência web imersiva inspirada no universo de **House of the Dragon**, desenvolvida com foco em animações cinematográficas, performance e interatividade utilizando **HTML, CSS, JavaScript e GSAP**.

<p align="center">
  <img src="https://skillicons.dev/icons?i=html,css,js,vscode,git,github" alt="Tecnologias utilizadas" />
  <br><br>
  <img src="https://img.shields.io/badge/GSAP-88CE02?style=for-the-badge&logo=greensock&logoColor=white" alt="GSAP"/>
</p>

---

## 🔗 Demonstração

### 🌐 Projeto Online

**https://leoschmerega.github.io/A-Casa-do-Dragao/**

---

## 📑 Índice

* 📖 Sobre o Projeto
* ✨ Funcionalidades
* 🛠️ Stack do Projeto
* 📂 Estrutura do Projeto
* ⚙️ Como Executar
* 🏗️ Arquitetura das Animações
* ⚡ Performance
* 📚 Aprendizados
* 🚀 Melhorias Futuras
* 📄 Licença
* 👨‍💻 Autor

---

# 📖 Sobre o Projeto

Este projeto foi desenvolvido com o objetivo de recriar uma experiência semelhante às páginas promocionais da HBO para a série **House of the Dragon**.

A proposta foi construir uma landing page cinematográfica utilizando animações avançadas com **GSAP**, explorando efeitos de scroll, parallax, tipografia dinâmica, vídeo sincronizado e transições suaves para proporcionar uma navegação imersiva.

Além do apelo visual, o projeto foi desenvolvido com foco em organização de código, responsividade, performance e boas práticas de desenvolvimento front-end, entregando uma experiência completa para desktop e uma versão otimizada para dispositivos móveis.

---

# ✨ Funcionalidades

## 🎬 Preloader Personalizado

* Animação SVG sincronizada com o carregamento da página;
* Espera pelo carregamento das fontes antes de iniciar a experiência;
* Atualização automática do ScrollTrigger após o preload.

---

## 🎥 Hero Section

* Entrada com efeito de Blur;
* Fade de elementos;
* Saída sincronizada com o Scroll;
* Sensação de profundidade utilizando GSAP.

---

## 🎞️ Vídeo Controlado pelo Scroll

A reprodução do vídeo acompanha exatamente a posição da rolagem do usuário, criando uma experiência totalmente interativa.

---

## 👑 Apresentação dos Personagens

Cada personagem possui uma seção exclusiva contendo:

* Pinning durante a navegação;
* Background personalizado;
* Camadas de profundidade;
* Efeitos de névoa e partículas;
* Cards em estilo Glassmorphism;
* Animações independentes.

---

## ✍️ Tipografia Dinâmica

Utilização do plugin **SplitText** para revelar:

* títulos;
* frases;
* citações;

de forma sincronizada com o scroll.

---

## 🖱️ Cards Interativos

Os cards utilizam efeitos como:

* Parallax;
* Rotação 3D;
* Movimento acompanhando o cursor;
* Hover personalizado para cada personagem.

---

## 📱 Responsividade

### Desktop

* ScrollSmoother;
* ScrollTrigger;
* SplitText;
* Vídeo sincronizado com o scroll;
* Pinning completo das seções.

### Mobile e Tablet

* Layout otimizado;
* CSS responsivo;
* Animações simplificadas;
* Melhor desempenho em dispositivos com menor capacidade gráfica.

---

# 🛠️ Stack do Projeto

### Linguagens

* HTML5
* CSS3
* JavaScript (ES6+)

### Biblioteca de Animações

* GSAP

  * ScrollTrigger
  * ScrollSmoother
  * SplitText

### Ferramentas

* Visual Studio Code
* Git
* GitHub

---

# 📂 Estrutura do Projeto

```text
.
├── assets/
│   ├── fonts/
│   ├── images/
│   └── videos/
│
├── index.html
├── style.css
├── javascript.js
└── README.md
```

---

# ⚙️ Como Executar

Clone o repositório:

```bash
git clone https://github.com/leoschmerega/A-Casa-do-Dragao.git
```

Acesse a pasta do projeto:

```bash
cd A-Casa-do-Dragao
```

Execute utilizando um servidor local.

Exemplo com **Live Server** (VS Code) ou:

```bash
npx serve
```

---

# 🏗️ Arquitetura das Animações

A estrutura do projeto foi organizada para facilitar manutenção, escalabilidade e desempenho.

Entre as principais práticas utilizadas estão:

* Organização das animações em timelines independentes;
* Uso de `gsap.matchMedia()` para separar Desktop e Mobile;
* Limpeza automática das animações ao redimensionar a janela;
* Destruição e recriação segura do ScrollSmoother;
* Reversão das instâncias do SplitText;
* Seletores escopados para evitar conflitos entre diferentes seções;
* Tratamento de elementos inexistentes antes da criação das animações.

---

# ⚡ Performance

Durante o desenvolvimento foram aplicadas otimizações para garantir uma experiência fluida:

* Redução de animações em dispositivos móveis;
* Evita múltiplas instâncias de ScrollTrigger;
* Cleanup automático das animações;
* Organização das timelines para reduzir processamento;
* Melhor aproveitamento da GPU apenas quando necessário;
* Separação entre experiência Desktop e Mobile utilizando `gsap.matchMedia()`.

---

# 📚 Aprendizados

Este projeto proporcionou prática em:

* GSAP avançado;
* ScrollTrigger;
* ScrollSmoother;
* SplitText;
* Arquitetura de animações;
* Responsividade;
* Performance Web;
* Organização de código JavaScript;
* UX (Experiência do Usuário);
* Estruturação de projetos front-end.

---

# 🚀 Melhorias Futuras

* [ ] Adicionar suporte a múltiplos idiomas;
* [ ] Melhorar recursos de acessibilidade (A11Y);
* [ ] Criar novas animações específicas para dispositivos móveis;
* [ ] Adicionar trilha sonora opcional;
* [ ] Melhorar otimizações de carregamento;
* [ ] Implementar modo escuro/claro.

---

# 📄 Licença

Este projeto está licenciado sob a **MIT License**.

Sinta-se à vontade para utilizar o código como referência para estudos ou projetos pessoais.

---

# 👨‍💻 Autor

Desenvolvido por **Leonardo Schmerega**.

* GitHub: https://github.com/leoschmerega
* LinkedIn: https://www.linkedin.com/in/leonardo-schmerega-b43253186/
