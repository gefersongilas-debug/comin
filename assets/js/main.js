
const WA_PHONE = ""; /* número da central 5001, só dígitos com DDI, ex.: 5547999999999 */

/* Menu responsivo do cabeçalho fixo. */
const menuButton = document.querySelector('.menu-toggle');
const topBar = document.querySelector('.top');
if (menuButton && topBar) {
  const closeMenu = () => {
    topBar.classList.remove('menu-open');
    menuButton.setAttribute('aria-expanded', 'false');
    menuButton.setAttribute('aria-label', 'Abrir menu');
  };
  menuButton.addEventListener('click', () => {
    const open = topBar.classList.toggle('menu-open');
    menuButton.setAttribute('aria-expanded', String(open));
    menuButton.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
  });
  topBar.querySelectorAll('.site-nav a').forEach(link => link.addEventListener('click', closeMenu));
  document.addEventListener('keydown', event => { if (event.key === 'Escape') closeMenu(); });
  document.addEventListener('click', event => { if (!topBar.contains(event.target)) closeMenu(); });
}
const IMG = {"bp05": "assets/img/bp05.webp", "cli390": "assets/img/cli390.webp", "fitlite": "assets/img/fitlite.webp", "fc35d": "assets/img/fc35d.webp", "fle950": "assets/img/fle950.webp", "flg800": "assets/img/flg800.webp", "frce05": "assets/img/frce05.webp", "frce10": "assets/img/frce10.webp", "prcop504": "assets/img/prcop504.webp", "ecomax503": "assets/img/ecomax503.webp"};
/* status: "ok" | "low" (últimas unidades) | "out" (esgotado). Troque conforme o estoque. */
const PRODUTOS = [
 {id:"ecomax503",marca:"Hobart",nome:"ECOMAX 503",cat:"Lavadoras",tag:"Sua equipe de volta para o salão. Enxágue a 80 °C.",specs:["1.080 pratos/h","60 s por ciclo","380 V trifásica"],tabela:26950,cartao:22900,parcela:2290,avista:21755,status:"ok"},
 {id:"prcop504",marca:"Prática",nome:"PRCOP 504",cat:"Lavadoras",tag:"Louça pronta em um minuto.",specs:["1.080 pratos/h","2,4 L por ciclo","Cesto 60×60 cm"],tabela:26535,cartao:22100,parcela:2210,avista:20995,status:"ok"},
 {id:"fitlite",marca:"Prática",nome:"FIT LITE",cat:"Fornos",tag:"A mesa certa para começar a servir rápido.",specs:["Micro-ondas + ar impingido","Sem coifa","Câmara 13 L"],tabela:30100,cartao:25550,parcela:2555,avista:24272.5,status:"ok"},
 {id:"fc35d",marca:"Gastromaq",nome:"FC-35D Digital",cat:"Fornos",tag:"Assa e finaliza a todo momento.",specs:["Até 250 °C","4 assadeiras 35×35","66 L"],tabela:5065,cartao:4300,parcela:430,avista:4085,status:"ok"},
 {id:"fle950",marca:"Gastromaq",nome:"FLE 950",cat:"Fornos",tag:"Câmara de 95×95 cm em pedra refratária.",specs:["Até 320 °C","6,4 kW","220 V"],tabela:5470,cartao:4640,parcela:464,avista:4408,status:"ok"},
 {id:"flg800",marca:"Gastromaq",nome:"FLG 800",cat:"Fornos",tag:"Pedra refratária para assar por igual.",specs:["Câmara 80,5×60,5 cm","A gás","Kit gás não incluso"],tabela:3355,cartao:2850,parcela:285,avista:2707.5,status:"ok"},
 {id:"bp05",marca:"G.Paniz",nome:"BP 05 Bambina",cat:"Panificação",tag:"Batedeira planetária. Sua assistente na confeitaria.",specs:["Cuba inox 5 L","10 velocidades","Painel digital"],tabela:4385,cartao:3720,parcela:372,avista:3534,status:"ok"},
 {id:"cli390",marca:"Gastromaq",nome:"CLI 390",cat:"Panificação",tag:"Lamina massa de pastel, pizza, lasanha.",specs:["Até 4 kg de massa","Motor 1/2 cv","Bivolt"],tabela:6730,cartao:5720,parcela:572,avista:5434,status:"ok"},
 {id:"frce05",marca:"Metalcubas",nome:"FRCE 05",cat:"Fritadeiras",tag:"Fritadeira de bancada em aço inox.",specs:["Óleo até 6,5 L","4.000 W","Termostato de segurança"],tabela:1195,cartao:1010,parcela:101,avista:959.5,status:"ok"},
 {id:"frce10",marca:"Metalcubas",nome:"FRCE 10",cat:"Fritadeiras",tag:"Duas cubas, dois preparos ao mesmo tempo.",specs:["2 cubas independentes","2×4.000 W","Disjuntor 50 A"],tabela:2255,cartao:1910,parcela:191,avista:1814.5,status:"ok"}
];
const brl=(n)=>n.toLocaleString("pt-BR",{minimumFractionDigits:Number.isInteger(n)?0:2,maximumFractionDigits:2});
const waHref=(t)=>"https://wa.me/"+WA_PHONE+"?text="+encodeURIComponent(t);
document.querySelectorAll("[data-wa]").forEach(a=>{a.href=waHref(a.dataset.wa);a.target="_blank";a.rel="noopener"});

const grid=document.getElementById("grid"),filters=document.getElementById("filters");
const cats=["Todos",...new Set(PRODUTOS.map(p=>p.cat))];
let cur="Todos";
function render(){
  filters.innerHTML=cats.map(c=>`<button class="chip" type="button" aria-pressed="${c===cur}" data-c="${c}">${c}</button>`).join("");
  grid.innerHTML=PRODUTOS.filter(p=>cur==="Todos"||p.cat===cur).map(p=>{
    const msg=`Olá! Vi a Black Friday da Comin e quero saber mais sobre o ${p.marca} ${p.nome}.`;
    const eco=p.tabela-p.cartao, pct=Math.round(eco/p.tabela*100);
    const st=p.status==="low"?'<span class="st low">Últimas unidades</span>':p.status==="out"?'<span class="st">Esgotado</span>':"";
    return `<article class="card ${p.status==="out"?"out":""}">
      <div class="photo"><img src="${IMG[p.id]}" alt="${p.marca} ${p.nome}" width="420" height="420" loading="lazy" decoding="async"><span class="off">−${pct}% Black</span>${st}</div>
      <div class="body">
        <div class="brand">${p.marca} · ${p.cat}</div>
        <h3>${p.nome}</h3>
        <p class="tag">${p.tag}</p>
        <ul class="specs">${p.specs.map(s=>`<li>${s}</li>`).join("")}</ul>
        <div class="price">
          <div class="de">De <s>R$ ${brl(p.tabela)}</s></div>
          <div class="por"><small>Preço da campanha no cartão</small><span class="rs">R$</span><span class="v">${brl(p.cartao)}</span></div>
          <div class="parc">em <b>10x de R$ ${brl(p.parcela)}</b> sem juros</div>
          <div class="vista"><span>À vista<br>+5% off</span><strong>R$ ${brl(p.avista)}</strong></div>
          <div class="eco">Você economiza até <b>R$ ${brl(p.tabela-p.avista)}</b> pagando à vista</div>
        </div>
        <a class="btn" href="${waHref(msg)}" target="_blank" rel="noopener">${p.status==="out"?"Esgotado":"Quero este no WhatsApp"}</a>
      </div></article>`;
  }).join("");
  // Recria as entradas dos cards quando o usuário altera a categoria.
  window.dispatchEvent(new CustomEvent("comin:cards-rendered"));
}
filters.addEventListener("click",e=>{const b=e.target.closest(".chip");if(b){cur=b.dataset.c;render()}});
render();
