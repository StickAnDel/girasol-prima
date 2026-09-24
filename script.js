/* =========================================================
   VARIABLES FÁCILES DE EDITAR
   ========================================================= */
const FOTO_ELLA = "img/ella.jpg"; // Foto real de ella
const MI_PERSONAJE = "img/mi-personaje.png"; // Tu dibujo anime
const GIF_PIXEL = "img/ella.gif"; // GIF decorativo en móvil

const TITULO_TEXTO = "Feliz Día de las Flores Amarillas";
const VELOCIDAD_TIPEO = 55; // ms entre cada letra del título

/* =========================================================
   DETECCIÓN AUTOMÁTICA DE MÓVIL
   ========================================================= */
function esMovil() {
  return window.matchMedia("(max-width: 768px)").matches;
}

const NUM_GIRASOLES_CORAZON = esMovil() ? 500 : 1400;
const NUM_PARTICULAS = esMovil() ? 30 : 60;
const RETRASO_ENTRE_GIRASOLES = esMovil() ? 4 : 3;
const DURACION_VUELO_MS = esMovil() ? 1400 : 1700;

/* =========================================================
   REFERENCIAS AL DOM
   ========================================================= */
const canvasParticulas = document.getElementById("particulas");

const zonaTexto = document.getElementById("zona-texto");
const titulo = document.getElementById("titulo");
const lineasMensaje = document.querySelectorAll("#mensaje .linea");
const filaFotoPersonaje = document.getElementById("fila-foto-personaje");
const fotoElla = document.getElementById("foto-ella");
const fotoPersonaje = document.getElementById("foto-personaje");
const marcoElla = document.getElementById("marco-ella");
const contenedorPersonaje = document.getElementById("personaje");

const escenaInicial = document.getElementById("escena-inicial");
const girasolInicial = document.getElementById("girasol-inicial");
const textoClic = document.getElementById("texto-clic");

const arbolSvg = document.getElementById("arbol-svg");
const tallo = document.getElementById("tallo");
const ramas = document.querySelectorAll(".rama");
const floresArbol = document.getElementById("flores-arbol");

const corazonGirasoles = document.getElementById("corazon-girasoles");

fotoElla.src = FOTO_ELLA;
fotoPersonaje.src = MI_PERSONAJE;

let secuenciaIniciada = false;

const PUNTAS_RAMAS = [
  { left: 35, top: 80 },
  { left: 65, top: 70 },
  { left: 32, top: 54 },
  { left: 68, top: 44 },
];
const PUNTO_GIRASOL_TOPE = { left: 50, top: 40 };

/* =========================================================
   GIRASOL — construcción 100% inline (SIN <use>/xlink)
   ========================================================= */
const NS_SVG = "http://www.w3.org/2000/svg";

function trazarPetalo(largo, ancho) {
  const puntaY = 12 - largo;
  const curvaY = 12 - largo * 0.82;
  return (
    `M12,12 C${12 - ancho},${12 - largo * 0.3} ${12 - ancho * 0.5},${curvaY} 12,${puntaY} ` +
    `C${12 + ancho * 0.5},${curvaY} ${12 + ancho},${12 - largo * 0.3} 12,12 Z`
  );
}

function agregarPetalos(grupo, cantidad, anguloBase, largo, ancho, color) {
  for (let i = 0; i < cantidad; i++) {
    const angulo = anguloBase + i * (360 / cantidad);
    const petalo = document.createElementNS(NS_SVG, "path");
    petalo.setAttribute("d", trazarPetalo(largo, ancho));
    petalo.setAttribute("fill", color);
    petalo.setAttribute("transform", `rotate(${angulo} 12 12)`);
    grupo.appendChild(petalo);
  }
}

function dibujarGirasolDetalladoDentroDe(svgDestino) {
  const capaTrasera = document.createElementNS(NS_SVG, "g");
  agregarPetalos(capaTrasera, 12, 15, 9.2, 2.7, "#E4A90C");
  svgDestino.appendChild(capaTrasera);

  const capaFrontal = document.createElementNS(NS_SVG, "g");
  agregarPetalos(capaFrontal, 12, 0, 11.4, 3.2, "#F8CB3C");
  svgDestino.appendChild(capaFrontal);

  const capaBrillo = document.createElementNS(NS_SVG, "g");
  agregarPetalos(capaBrillo, 12, 0, 6.4, 1.1, "#FFE38A");
  svgDestino.appendChild(capaBrillo);

  const anillos = [
    { r: 5.4, color: "#8A5A2C" },
    { r: 4.5, color: "#6B4423" },
    { r: 3.3, color: "#4A2E14" },
  ];
  anillos.forEach(({ r, color }) => {
    const circulo = document.createElementNS(NS_SVG, "circle");
    circulo.setAttribute("cx", 12);
    circulo.setAttribute("cy", 12);
    circulo.setAttribute("r", r);
    circulo.setAttribute("fill", color);
    svgDestino.appendChild(circulo);
  });

  const grupoSemillas = document.createElementNS(NS_SVG, "g");
  for (let i = 0; i < 14; i++) {
    const angulo = (i / 14) * Math.PI * 2;
    const radio = 1.4 + (i % 3) * 0.7;
    const semilla = document.createElementNS(NS_SVG, "circle");
    semilla.setAttribute("cx", 12 + Math.cos(angulo) * radio);
    semilla.setAttribute("cy", 12 + Math.sin(angulo) * radio);
    semilla.setAttribute("r", 0.35);
    semilla.setAttribute("fill", i % 2 === 0 ? "#3A2410" : "#7A4F22");
    grupoSemillas.appendChild(semilla);
  }
  svgDestino.appendChild(grupoSemillas);
}

function crearGirasolDetallado(clase) {
  const svg = document.createElementNS(NS_SVG, "svg");
  svg.setAttribute("viewBox", "-8 -8 40 40");
  svg.setAttribute("aria-hidden", "true");
  if (clase) svg.classList.add(clase);
  dibujarGirasolDetalladoDentroDe(svg);
  return svg;
}

function crearGirasolSimple(clase) {
  const svg = document.createElementNS(NS_SVG, "svg");
  svg.setAttribute("viewBox", "-8 -8 40 40");
  svg.setAttribute("aria-hidden", "true");
  if (clase) svg.classList.add(clase);

  const grupoPetalos = document.createElementNS(NS_SVG, "g");
  agregarPetalos(grupoPetalos, 8, 0, 10.6, 3.4, "#F6C21E");
  svg.appendChild(grupoPetalos);

  const centro = document.createElementNS(NS_SVG, "circle");
  centro.setAttribute("cx", 12);
  centro.setAttribute("cy", 12);
  centro.setAttribute("r", 4.5);
  centro.setAttribute("fill", "#6B4423");
  svg.appendChild(centro);

  return svg;
}

/* =========================================================
   PARTÍCULAS DORADAS
   ========================================================= */
function iniciarParticulas() {
  const ctx = canvasParticulas.getContext("2d");
  let ancho,
    alto,
    particulas = [];

  function redimensionar() {
    ancho = canvasParticulas.width = window.innerWidth;
    alto = canvasParticulas.height = window.innerHeight;
  }
  redimensionar();
  window.addEventListener("resize", redimensionar);

  for (let i = 0; i < NUM_PARTICULAS; i++) {
    particulas.push({
      x: Math.random() * ancho,
      y: Math.random() * alto,
      r: 0.6 + Math.random() * 1.7,
      velY: 0.06 + Math.random() * 0.15,
      velX: (Math.random() - 0.5) * 0.12,
      fase: Math.random() * Math.PI * 2,
      opacidadBase: 0.2 + Math.random() * 0.38,
    });
  }

  function dibujar() {
    ctx.clearRect(0, 0, ancho, alto);
    const ahora = Date.now() / 1000;
    particulas.forEach((p) => {
      const centelleo = 0.5 + 0.5 * Math.sin(ahora * 1.4 + p.fase);
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(201,162,39,${(p.opacidadBase * centelleo).toFixed(3)})`;
      ctx.fill();
      p.y -= p.velY;
      p.x += p.velX;
      if (p.y < -10) {
        p.y = alto + 10;
        p.x = Math.random() * ancho;
      }
      if (p.x < -10) p.x = ancho + 10;
      if (p.x > ancho + 10) p.x = -10;
    });
    requestAnimationFrame(dibujar);
  }
  dibujar();
}

/* =========================================================
   PASO 1 -> PASO 2
   ========================================================= */
function crearFlorDeArbol(posicion, retraso) {
  const flor = crearGirasolDetallado("flor-arbol");
  flor.style.left = posicion.left + "%";
  flor.style.top = posicion.top + "%";
  flor.style.scale = "2.5";
  floresArbol.appendChild(flor);

  setTimeout(() => flor.classList.add("mostrar"), retraso);
  return flor;
}

function iniciarSecuencia() {
  if (secuenciaIniciada) return;
  secuenciaIniciada = true;

  textoClic.classList.add("oculto");
  girasolInicial.classList.add("moviendo");

  setTimeout(() => {
    tallo.classList.add("crecer");
  }, 900);

  const floresRamas = [];
  setTimeout(() => {
    ramas.forEach((rama, indice) => {
      const retraso = indice * 340;
      setTimeout(() => rama.classList.add("crecer"), retraso);
      floresRamas.push(crearFlorDeArbol(PUNTAS_RAMAS[indice], retraso + 260));
    });
  }, 2300);

  const tiempoArbolCompleto = 2300 + ramas.length * 340 + 700;
  setTimeout(() => {
    arbolSvg.classList.add("desaparecer");
    girasolInicial.classList.add("desvanecer");
    floresRamas.forEach((flor) => flor.classList.add("desaparecer"));
    escenaInicial.classList.add("oculto");
  }, tiempoArbolCompleto);

  setTimeout(() => {
    escenaInicial.style.display = "none";
  }, tiempoArbolCompleto + 700);

  setTimeout(formarCorazon, tiempoArbolCompleto + 500);
}

function manejarActivacionGirasol(evento) {
  evento.preventDefault();
  iniciarSecuencia();
}
girasolInicial.addEventListener("click", manejarActivacionGirasol);
girasolInicial.addEventListener("touchend", manejarActivacionGirasol, {
  passive: false,
});
girasolInicial.addEventListener("keydown", (evento) => {
  if (evento.key === "Enter" || evento.key === " ") {
    evento.preventDefault();
    iniciarSecuencia();
  }
});
escenaInicial.addEventListener("click", (evento) => {
  if (evento.target === escenaInicial) iniciarSecuencia();
});

/* =========================================================
   PUNTOS DEL CORAZÓN — RELLENO COMPACTO
   ========================================================= */
function generarPuntosCorazon(cantidad) {
  const puntos = [];

  const muestras = 720;
  const borde = [];

  for (let i = 0; i < muestras; i++) {
    const t = (i / muestras) * Math.PI * 2;

    const x = 16 * Math.pow(Math.sin(t), 3);

    const y = -(
      13 * Math.cos(t) -
      5 * Math.cos(2 * t) -
      2 * Math.cos(3 * t) -
      Math.cos(4 * t)
    );

    borde.push({ x, y });
  }

  let minX = Infinity;
  let maxX = -Infinity;
  let minY = Infinity;
  let maxY = -Infinity;

  for (const p of borde) {
    if (p.x < minX) minX = p.x;
    if (p.x > maxX) maxX = p.x;
    if (p.y < minY) minY = p.y;
    if (p.y > maxY) maxY = p.y;
  }

  function puntoDentro(x, y) {
    let dentro = false;

    for (let i = 0, j = borde.length - 1; i < borde.length; j = i++) {
      const xi = borde[i].x;
      const yi = borde[i].y;
      const xj = borde[j].x;
      const yj = borde[j].y;

      const cruza =
        yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi;

      if (cruza) dentro = !dentro;
    }

    return dentro;
  }

  const margen = 0.98;

  const areaX = minX * margen;
  const areaXMax = maxX * margen;
  const areaY = minY * margen;
  const areaYMax = maxY * margen;

  const distanciaMinima = 0.14;
  const distanciaMinimaCuadrado = distanciaMinima * distanciaMinima;

  let intentos = 0;
  const maxIntentos = cantidad * 30;

  while (puntos.length < cantidad && intentos < maxIntentos) {
    intentos++;

    const x = areaX + Math.random() * (areaXMax - areaX);

    const y = areaY + Math.random() * (areaYMax - areaY);

    if (!puntoDentro(x, y)) continue;

    let demasiadoCerca = false;

    const revisarDesde = Math.max(0, puntos.length - 80);

    for (let i = revisarDesde; i < puntos.length; i++) {
      const dx = puntos[i].x - x;
      const dy = puntos[i].y - y;

      if (dx * dx + dy * dy < distanciaMinimaCuadrado) {
        demasiadoCerca = true;
        break;
      }
    }

    if (demasiadoCerca) continue;

    const variacionX = (Math.random() - 0.5) * 0.15;
    const variacionY = (Math.random() - 0.5) * 0.15;

    puntos.push({
      x: x + variacionX,
      y: y + variacionY,
      radio: Math.random(),
    });
  }

  while (puntos.length < cantidad) {
    const x = areaX + Math.random() * (areaXMax - areaX);

    const y = areaY + Math.random() * (areaYMax - areaY);

    if (!puntoDentro(x, y)) continue;

    puntos.push({
      x: x + (Math.random() - 0.5) * 0.15,
      y: y + (Math.random() - 0.5) * 0.15,
      radio: Math.random(),
    });
  }

  for (let i = puntos.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [puntos[i], puntos[j]] = [puntos[j], puntos[i]];
  }

  return puntos;
}

/* =========================================================
   PASO 3: formar el corazón
   ========================================================= */
function formarCorazon() {
  Array.from(corazonGirasoles.childNodes).forEach((nodo) => {
    if (nodo.nodeType === 3) corazonGirasoles.removeChild(nodo);
  });

  const puntos = generarPuntosCorazon(NUM_GIRASOLES_CORAZON);
  const maxX = 18,
    maxY = 15.5;
  const cajaCorazon = corazonGirasoles.getBoundingClientRect();

  puntos.forEach((p, indice) => {
    const leftFinal = 50 + (p.x / maxX) * 42;
    const topFinal = 50 + (p.y / maxY) * 42;

    const girasol = crearGirasolSimple("girasol-corazon");

    const tipoTamano = Math.random();
    let escalaAleatoria;

    if (tipoTamano < 0.2) {
      escalaAleatoria = 0.7 + Math.random() * 0.2;
    } else if (tipoTamano < 0.7) {
      escalaAleatoria = 1.0 + Math.random() * 0.3;
    } else {
      escalaAleatoria = 1.4 + Math.random() * 0.4;
    }

    const tamano = 26 * escalaAleatoria;
    girasol.style.width = tamano + "px";
    girasol.style.height = tamano + "px";

    girasol.style.left = leftFinal + "%";
    girasol.style.top = topFinal + "%";

    const origenXPct = 50 + (Math.random() - 0.5) * 5;
    const origenYPct = 55 + (Math.random() - 0.5) * 5;
    const dx = ((origenXPct - leftFinal) / 100) * cajaCorazon.width;
    const dy = ((origenYPct - topFinal) / 100) * cajaCorazon.height;
    girasol.style.transform = `translate3d(${dx}px, ${dy}px, 0) scale(0.2)`;

    /* === NUEVO === Evita que el SVG sea "seleccionable" al tocar
       en Android/Samsung/Edge. No cambia el diseño. */
    girasol.style.webkitTapHighlightColor = "transparent";
    girasol.style.webkitUserSelect = "none";
    girasol.style.userSelect = "none";
    /* === FIN NUEVO === */

    corazonGirasoles.appendChild(girasol);

    girasol.addEventListener("click", manejarClicEnFlorDelCorazon);

    setTimeout(() => {
      girasol.classList.add("visible");
      girasol.style.transform = "translate3d(0, 0, 0) scale(1)";
    }, indice * RETRASO_ENTRE_GIRASOLES);
  });

  const tiempoTotal =
    puntos.length * RETRASO_ENTRE_GIRASOLES + DURACION_VUELO_MS;

  setTimeout(() => {
    corazonGirasoles.classList.add("latir");
    revelarZonaTexto();
    iniciarCaidaAutomatica();
  }, tiempoTotal);
}

/* =========================================================
   PASO 4: revelar texto, título letra por letra
   ========================================================= */
function revelarZonaTexto() {
  zonaTexto.classList.add("mostrar");
  setTimeout(escribirTitulo, 500);
}

function escribirTitulo() {
  let i = 0;
  function siguienteLetra() {
    if (i <= TITULO_TEXTO.length) {
      titulo.textContent = TITULO_TEXTO.slice(0, i);
      i++;
      setTimeout(siguienteLetra, VELOCIDAD_TIPEO);
    } else {
      titulo.classList.add("terminado");
      mostrarLineasMensaje();
    }
  }
  siguienteLetra();
}

function mostrarLineasMensaje() {
  lineasMensaje.forEach((linea, indice) => {
    setTimeout(() => {
      linea.classList.add("mostrar");
      if (indice === lineasMensaje.length - 1) {
        setTimeout(() => {
          filaFotoPersonaje.classList.add("mostrar");
          iniciarAnimacionPersonaje();
        }, 500);
      }
    }, indice * 550);
  });
}

/* =========================================================
   Personaje: respira/se balancea siempre (CSS) y parpadea
   ========================================================= */
function iniciarAnimacionPersonaje() {
  function parpadearAlAzar() {
    fotoPersonaje.classList.remove("parpadeo");
    void fotoPersonaje.offsetWidth;
    fotoPersonaje.classList.add("parpadeo");
    setTimeout(parpadearAlAzar, 2600 + Math.random() * 3200);
  }
  parpadearAlAzar();
}

/* =========================================================
   PASO 7: clic en un girasol del corazón → lluvia de girasolitos
   ========================================================= */
function manejarClicEnFlorDelCorazon(evento) {
  evento.stopPropagation();
  const origen = evento.currentTarget.getBoundingClientRect();
  dispararGirasolitos(origen, 14);
}

corazonGirasoles.addEventListener("click", (evento) => {
  if (evento.target.closest(".girasol-corazon")) return;
  const origen = { left: evento.clientX, top: evento.clientY };
  dispararGirasolitos(origen, 22);
});

function dispararGirasolitos(origenRect, cantidad) {
  for (let i = 0; i < cantidad; i++) {
    setTimeout(() => crearGirasolQueCae(origenRect), i * 40);
  }
}

function crearGirasolQueCae(origenRect) {
  const girasol = crearGirasolSimple("girasol-cae");

  const tipoTamano = Math.random();
  let tamano;

  if (tipoTamano < 0.35) {
    tamano = 10 + Math.random() * 6;
  } else if (tipoTamano < 0.75) {
    tamano = 16 + Math.random() * 8;
  } else {
    tamano = 24 + Math.random() * 10;
  }

  girasol.style.width = tamano + "px";
  girasol.style.height = tamano + "px";
  girasol.style.left = origenRect.left + (Math.random() - 0.5) * 40 + "px";
  girasol.style.top = origenRect.top + "px";
  girasol.style.setProperty("--giro-final", 140 + Math.random() * 220 + "deg");
  girasol.style.setProperty("--deriva-x", (Math.random() - 0.5) * 60 + "px");

  const duracion = 1.6 + Math.random() * 1.1;
  girasol.style.animationDuration = duracion + "s";

  document.body.appendChild(girasol);

  setTimeout(() => girasol.remove(), duracion * 1000 + 100);
}

/* =========================================================
   PASO 6: girasolitos cayendo solos, uno por uno
   ========================================================= */
let temporizadorCaidaAutomatica = null;
function iniciarCaidaAutomatica() {
  if (temporizadorCaidaAutomatica) return;

  function siguienteCaida() {
    const rect = corazonGirasoles.getBoundingClientRect();
    const origen = {
      left: rect.left + rect.width * (0.22 + Math.random() * 0.56),
      top: rect.top + rect.height * (0.22 + Math.random() * 0.4),
    };
    crearGirasolQueCae(origen);
    temporizadorCaidaAutomatica = setTimeout(
      siguienteCaida,
      750 + Math.random() * 900,
    );
  }
  temporizadorCaidaAutomatica = setTimeout(siguienteCaida, 600);
}

/* =========================================================
   MODALES
   ========================================================= */
function abrirModal(idModal) {
  const modal = document.getElementById(idModal);
  if (!modal) return;
  modal.classList.add("abierto");
  modal.setAttribute("aria-hidden", "false");
}

function cerrarModal(idModal) {
  const modal = document.getElementById(idModal);
  if (!modal) return;
  modal.classList.remove("abierto");
  modal.setAttribute("aria-hidden", "true");
}

function cerrarTodosLosModales() {
  document.querySelectorAll(".modal-overlay.abierto").forEach((m) => {
    m.classList.remove("abierto");
    m.setAttribute("aria-hidden", "true");
  });
}

document.addEventListener("click", (evento) => {
  const botonCerrar = evento.target.closest("[data-cerrar]");
  if (botonCerrar) {
    evento.preventDefault();
    cerrarModal(botonCerrar.getAttribute("data-cerrar"));
  }
});

document.querySelectorAll(".modal-overlay").forEach((overlay) => {
  overlay.addEventListener("click", (evento) => {
    if (evento.target === overlay) {
      overlay.classList.remove("abierto");
      overlay.setAttribute("aria-hidden", "true");
    }
  });
});

document.addEventListener("keydown", (evento) => {
  if (evento.key === "Escape") cerrarTodosLosModales();
});

function abrirModalFoto() {
  const modal = document.getElementById("modal-foto");
  const img = document.getElementById("modal-foto-img");
  const link = document.getElementById("modal-foto-descargar");

  const srcReal = fotoElla.src || FOTO_ELLA;
  img.src = srcReal;
  link.href = srcReal;
  link.setAttribute("download", "foto-ella.jpg");

  abrirModal("modal-foto");
}

marcoElla.addEventListener("click", abrirModalFoto);
fotoElla.addEventListener("click", abrirModalFoto);

function abrirModalPersonaje() {
  const modal = document.getElementById("modal-personaje");
  const img = document.getElementById("modal-personaje-img");
  const link = document.getElementById("modal-personaje-descargar");

  const srcReal = fotoPersonaje.src || MI_PERSONAJE;
  img.src = srcReal;
  link.href = srcReal;
  link.setAttribute("download", "mi-personaje.png");

  abrirModal("modal-personaje");
}

function abrirModalPixel() {
  const modal = document.getElementById("modal-pixel");
  const img   = document.getElementById("modal-pixel-img");
  const link  = document.getElementById("modal-pixel-descargar");
  if (!modal) return;

  img.src = GIF_PIXEL;
  link.href = GIF_PIXEL;
  link.setAttribute("download", "ella.gif");

  abrirModal("modal-pixel");
}

if (document.getElementById("pixel-personaje")) {
  document.getElementById("pixel-personaje").addEventListener("click", (e) => {
    if (e.target.tagName !== "IMG") abrirModalPixel();
  });
}

contenedorPersonaje.addEventListener("click", abrirModalPersonaje);
fotoPersonaje.addEventListener("click", abrirModalPersonaje);

/* =========================================================
   PERSONAJE DECORATIVO
   ========================================================= */
function iniciarPersonajePixelArt() {
  let contenedor = document.getElementById("pixel-personaje");
  if (!contenedor) {
    const fila = document.getElementById("fila-foto-personaje");
    if (!fila) return;
    contenedor = document.createElement("div");
    contenedor.id = "pixel-personaje";
    contenedor.setAttribute("aria-hidden", "true");
    fila.parentNode.insertBefore(contenedor, fila.nextSibling);
  }

  contenedor.innerHTML = "";

  const gif = document.createElement("img");
  gif.src = GIF_PIXEL;
  gif.alt = "";
  gif.setAttribute("aria-hidden", "false");

  gif.addEventListener("click", (e) => {
    e.stopPropagation();
    abrirModalPixel();
  });

  gif.onerror = () => {
    contenedor.innerHTML = "";
  };

  contenedor.appendChild(gif);
}

/* =========================================================
   INICIO
   ========================================================= */
window.addEventListener("DOMContentLoaded", () => {
  iniciarParticulas();
  dibujarGirasolDetalladoDentroDe(girasolInicial);
  iniciarPersonajePixelArt();
});

let ultimoModoMovil = esMovil();
window.addEventListener("resize", () => {
  const actual = esMovil();
  if (actual !== ultimoModoMovil) {
    ultimoModoMovil = actual;
    iniciarPersonajePixelArt();
  }
});
