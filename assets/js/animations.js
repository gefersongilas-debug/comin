/* Animações de entrada e interação da landing page COMIN.
   GSAP e ScrollTrigger são complementos visuais: o conteúdo e os controles
   continuam funcionais caso a CDN não carregue ou o usuário reduza movimento. */
(() => {
  "use strict";

  const gsap = window.gsap;
  const ScrollTrigger = window.ScrollTrigger;
  if (!gsap || !ScrollTrigger || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  gsap.registerPlugin(ScrollTrigger);

  // A headline e a logo permanecem pintadas durante a entrada: evita atrasar o LCP.
  gsap.timeline({ defaults: { ease: "power3.out", duration: 0.68 } })
    .from(".top .brand, .top .site-nav a, .top .pill", {
      y: -12, stagger: 0.045, duration: 0.38
    }, 0)
    .from(".hero .pill", { autoAlpha: 0, y: 12, duration: 0.4 }, 0.04)
    .from(".hero h1, .hero .lead", {
      y: 16, stagger: 0.1, duration: 0.52
    }, 0.1)
    .from(".hero .deal > div", {
      autoAlpha: 0, y: 20, stagger: 0.075, duration: 0.5
    }, 0.4)
    .from(".hero .btn, .hero .note", {
      autoAlpha: 0, y: 14, stagger: 0.07, duration: 0.48
    }, 0.64);

  // Entradas progressivas durante a rolagem, com início próximo à área visível.
  const reveal = (selector, options = {}) => {
    gsap.utils.toArray(selector).forEach((element) => {
      if (!element.textContent.trim() && !element.querySelector("img")) return;
      gsap.from(element, {
        autoAlpha: 0,
        y: options.y ?? 23,
        duration: options.duration ?? 0.72,
        ease: "power2.out",
        scrollTrigger: {
          trigger: element,
          start: "top 93%",
          once: true
        }
      });
    });
  };

  reveal(".trust-history, .trust li", { y: 13, duration: 0.48 });
  reveal(".blk .eyebrow, .blk h2, .blk .sub, #ofertas .filters, #ofertas .legal");
  reveal(".cond .it, .steps li", { y: 29 });
  reveal("#duvidas details", { y: 15, duration: 0.52 });
  reveal(".final h2, .final p, .final .btn", { y: 24 });

  // Microparallax na fachada: poucos pixels, ligado ao scroll e sem mudar layout.
  const finalBackground = document.querySelector(".final-bg");
  if (finalBackground) {
    gsap.fromTo(finalBackground,
      { yPercent: -3.5, scale: 1.08 },
      {
        yPercent: 3.5,
        scale: 1.08,
        ease: "none",
        scrollTrigger: {
          trigger: ".final",
          start: "top bottom",
          end: "bottom top",
          scrub: 0.7
        }
      }
    );
  }

  // Os cards são recriados pelo filtro: mata os triggers antigos antes de animar os novos.
  let cardTriggers = [];
  let previousCards = [];
  let photoTweens = [];
  const animateCards = () => {
    cardTriggers.forEach((trigger) => trigger.kill());
    gsap.killTweensOf(previousCards);
    photoTweens.forEach((tween) => {
      if (tween.scrollTrigger) tween.scrollTrigger.kill();
      tween.kill();
    });
    photoTweens = [];

    const cards = gsap.utils.toArray("#grid .card");
    previousCards = cards;
    if (!cards.length) return;

    gsap.set(cards, { autoAlpha: 0, y: 27 });
    const enter = (batch) => {
      gsap.to(batch, {
        autoAlpha: 1,
        y: 0,
        duration: 0.66,
        ease: "power2.out",
        stagger: 0.075,
        overwrite: "auto",
        clearProps: "opacity,visibility,transform"
      });
    };

    cardTriggers = ScrollTrigger.batch(cards, {
      start: "top 94%",
      once: true,
      interval: 0.12,
      batchMax: 3,
      onEnter: enter,
      onEnterBack: enter
    });

    // Movimento de 7% da altura da foto ao longo de toda a travessia na tela.
    // A foto fica um pouco ampliada para não revelar bordas brancas no deslocamento.
    photoTweens = cards.map((card) => {
      const img = card.querySelector(".photo img");
      if (!img) return null;
      return gsap.fromTo(img,
        { yPercent: -3.5, scale: 1.06 },
        {
          yPercent: 3.5,
          scale: 1.06,
          ease: "none",
          scrollTrigger: {
            trigger: card,
            start: "top bottom",
            end: "bottom top",
            scrub: 0.7
          }
        }
      );
    }).filter(Boolean);
    ScrollTrigger.refresh();
  };

  window.addEventListener("comin:cards-rendered", animateCards);
  animateCards();

  // O navegador controla a abertura nativa do <details>, sem bloquear o clique
  // nem animar altura/padding via GSAP. Isso evita o salto no primeiro frame.
  // Atualiza a posição dos ScrollTriggers depois da transição, em tempo ocioso.
  let faqRefreshTimer;
  document.querySelectorAll("#duvidas details").forEach((details) => {
    details.addEventListener("toggle", () => {
      window.clearTimeout(faqRefreshTimer);
      faqRefreshTimer = window.setTimeout(() => {
        if ("requestIdleCallback" in window) {
          window.requestIdleCallback(() => ScrollTrigger.refresh(), { timeout: 900 });
        } else {
          ScrollTrigger.refresh();
        }
      }, 340);
    });
  });

  // Pequeno feedback tátil de clique, inclusive nos chips renderizados dinamicamente.
  let pressed = null;
  document.addEventListener("pointerdown", (event) => {
    if (event.button !== 0) return;
    pressed = event.target.closest(".btn, .chip, .menu-toggle");
    if (!pressed) return;
    gsap.to(pressed, { scale: 0.97, duration: 0.12, ease: "power1.out", overwrite: true });
  });
  const release = () => {
    if (!pressed) return;
    gsap.to(pressed, {
      scale: 1, duration: 0.26, ease: "back.out(2)", overwrite: true,
      clearProps: "scale"
    });
    pressed = null;
  };
  document.addEventListener("pointerup", release);
  document.addEventListener("pointercancel", release);

  // Menu recolhível: links surgem sutilmente após a abertura no mobile.
  const toggle = document.querySelector(".menu-toggle");
  const top = document.querySelector(".top");
  if (toggle && top) {
    toggle.addEventListener("click", () => {
      if (!top.classList.contains("menu-open")) return;
      gsap.fromTo(".site-nav a",
        { autoAlpha: 0, y: -8 },
        { autoAlpha: 1, y: 0, stagger: 0.06, duration: 0.28, ease: "power2.out", clearProps: "opacity,visibility,transform" }
      );
    });
  }
})();
