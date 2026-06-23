# Objetivo Marketing — site imersivo

Uma experiência web de alto nível para a agência **Objetivo Marketing**, construída
do zero com foco em micro-animações, interatividade e uma identidade visual forte —
estilo *Awwwards* — sem abrir mão de UX, acessibilidade e performance.

Conceito: **"Transforme cliques em lucro"** — agência de **tráfego pago** (Google Ads,
Meta Ads, TikTok Ads e consultoria). A marca é **preto + verde-limão `#C6F94D`**, e o
nome *Objetivo* vira o fio condutor visual: mira, precisão, anéis concêntricos de um alvo.

## ✨ Destaques

- **WebGL (Three.js)** — fundo gerativo em shader (ruído simplex + anéis de "alvo")
  que reage ao mouse e ao scroll. Degrada com elegância (fallback em CSS) quando não há WebGL.
- **GSAP + ScrollTrigger** — preloader animado, revelações de texto por linha/palavra,
  contadores, parallax, lista de serviços interativa e timeline do menu.
- **Lenis** — scroll suave sincronizado a um único *ticker* compartilhado com o GSAP.
- **Cursor customizado** magnético, **botões magnéticos** e **text-scramble** no hover.
- **Marquees** que reagem à velocidade e direção do scroll.
- **Cases com tilt 3D**, depoimentos em rotação e wordmark gigante no rodapé.
- **Acessível e resiliente**: respeita `prefers-reduced-motion`, navegação por teclado,
  `skip-link`, foco visível, HTML semântico e fallback completo sem JavaScript.
- **Responsivo** de verdade, com menu fullscreen no mobile.

## 🧱 Stack

| Camada            | Tecnologia                    |
| ----------------- | ----------------------------- |
| Build / dev       | [Vite](https://vitejs.dev)    |
| 3D / shaders      | [Three.js](https://threejs.org) |
| Animação          | [GSAP](https://gsap.com) + ScrollTrigger |
| Scroll suave      | [Lenis](https://lenis.darkroom.engineering) |
| Split de texto    | [SplitType](https://github.com/lukePeavey/SplitType) |
| Tipografia        | Hanken Grotesk ([Google Fonts](https://fonts.google.com)) |

## 🚀 Como rodar

```bash
npm install      # instala as dependências
npm run dev      # ambiente de desenvolvimento (http://localhost:5173)
npm run build    # build de produção em /dist
npm run preview  # serve o build localmente
```

## 🗂 Estrutura

```
index.html               # marcação semântica + conteúdo
public/                  # favicon + imagem de compartilhamento (og.png)
src/
  main.js                # orquestra tudo (boot, ticker, intro)
  styles/                # base/tokens · ui · sections
  webgl/                 # HeroScene + shaders GLSL
  modules/               # preloader, cursor, nav, reveals, marquee, etc.
vercel.json              # deploy estático (framework Vite)
```

## 🎨 Personalização rápida

- **Cores**: variáveis CSS em `src/styles/base.css` (`--ink`, `--bone`, `--flare`…).
  As cores do shader também aceitam ajuste em `src/webgl/HeroScene.js` (uniforms).
- **Conteúdo**: textos, serviços, cases e depoimentos estão direto no `index.html`.
- Adicione `?debug` à URL para expor o `gsap` no `window` durante a depuração.

## 📝 Observação sobre o conteúdo

Conteúdo, serviços, planos, FAQ e contato foram extraídos do site atual da Objetivo
Marketing (Google Ads / Meta Ads / TikTok Ads, planos Prata/Ouro/Diamante, WhatsApp
(48) 99831-3601 e contato@objetivomarketing.com.br). Falta apenas preencher os links
reais de Instagram/YouTube e a imagem real do vídeo do hero, se desejar.

## ☁️ Deploy

Projeto 100% estático. Basta apontar a Vercel (ou qualquer host estático) para o
repositório — o `vercel.json` já define `framework: vite`, build `npm run build`
e saída em `dist/`.
