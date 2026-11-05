# COMIN Black Friday — V07

Pacote HTML estático para GitHub, GitHub Pages ou publicação pela Vercel.

## Estrutura

- `index.html` — página principal e metadados SEO/OG + dados estruturados de organização, página e catálogo.
- `assets/css/style.css` — estilos responsivos.
- `assets/js/main.js` — cards, filtros e links de atendimento.
- `assets/js/animations.js` — GSAP e ScrollTrigger (efeitos não essenciais).
- `assets/img/` — logo e fotografias WebP; ícone WhatsApp SVG.
- `robots.txt` — indexação liberada.

## Como publicar

1. Extraia o ZIP e envie **o conteúdo** para a raiz do repositório (o `index.html` deve ficar na raiz).
2. Configure o telefone oficial em `assets/js/main.js`, variável `WA_PHONE`, usando apenas números com DDI (por exemplo, `5547999999999`). O projeto de origem ainda não tinha telefone definido.
3. Após confirmar o **endereço público final**, acrescente no `<head>` do `index.html` as tags a seguir com os valores reais:

   ```html
   <link rel="canonical" href="https://URL-PUBLICA-DA-PAGINA/">
   <meta property="og:url" content="https://URL-PUBLICA-DA-PAGINA/">
   <meta property="og:image" content="https://URL-PUBLICA-DA-PAGINA/assets/img/hero-comin-black-friday.webp">
   <meta name="twitter:image" content="https://URL-PUBLICA-DA-PAGINA/assets/img/hero-comin-black-friday.webp">
   ```

4. Com a URL publicada, valide o compartilhamento social e confira a indexação no Google Search Console; configure sitemap se essa URL fizer parte de um conjunto de páginas do domínio.
5. Rode o teste real no PageSpeed Insights para mobile e desktop, pois as notas dependem da hospedagem, rede e URL pública.

## Otimizações implementadas

- Title, description, idioma, Open Graph, Twitter Card e `robots` configurados sem inventar URL.
- Dados estruturados `Organization`, `WebPage` e `ItemList`, além de FAQ visível no HTML.
- Imagens de produtos e logo em WebP (o banner da hero já estava em WebP).
- Preload de alta prioridade do banner apenas no desktop; preconnect de fontes e CDN.
- Dimensões explícitas, lazy loading e `decoding="async"` nas imagens dos produtos.
- Animações suavizadas para manter a headline e a logo pintadas no carregamento; suporte a movimento reduzido.

> Não foi medida nem garantida uma nota de PageSpeed. Os ajustes foram realizados no código local; a medição final requer deploy.
