# 🌻 Feliz Día de las Flores Amarillas

Página web animada, un solo proyecto estático (HTML + CSS + JavaScript puro, sin frameworks, sin backend, sin música), lista para publicar en **GitHub Pages**.

## Estructura

```
├── index.html
├── style.css
├── script.js
└── img/
    ├── ella.jpg
    └── mi-personaje.png
```

Tus dos imágenes ya están incluidas en `img/` con los nombres correctos.

## Secuencia de la animación

1. Pantalla blanca elegante con un único girasol grande en el centro y "🌻 DA CLIC AQUÍ 🌻" debajo. Nada más es visible todavía.
2. Al hacer clic: el girasol se mueve hacia arriba, crece un tallo verde desde abajo, luego aparecen las ramas — cada una con su propio girasol — formando un pequeño árbol temporal.
3. Los girasoles del árbol se desvanecen y, desde ese mismo punto, ~210 girasoles se separan y vuelan lentamente hasta acomodarse y formar un corazón gigante (sin explosión, sin forma de estrella ni de sol).
4. Al completarse el corazón, aparece a la izquierda el título escrito letra por letra.
5. Debajo, el mensaje aparece línea por línea.
6. Después aparecen juntas la foto real (`ella.jpg`, con marco elegante) y tu personaje (`mi-personaje.png`), uno al lado del otro.
7. El corazón sigue latiendo suavemente para siempre. Si haces clic en cualquier girasol del corazón, caen 3 girasoles pequeños como pétalos suaves desde ese punto.
8. El diseño final queda en dos columnas sin espacios vacíos: texto + foto + personaje a un lado, corazón de girasoles al otro (se apilan verticalmente en pantallas de celular).

## Cómo editar

Abre `script.js` y ajusta las variables del principio del archivo:

```js
const FOTO_ELLA    = "img/ella.jpg";
const MI_PERSONAJE = "img/mi-personaje.png";

const NUM_GIRASOLES_CORAZON   = 210;  // cuántos girasoles forman el corazón
const RETRASO_ENTRE_GIRASOLES = 16;   // qué tan escalonado es el vuelo (más alto = más lento)
```

## Publicar en GitHub Pages

1. Crea un repositorio nuevo en GitHub.
2. Sube estos archivos y carpetas tal cual (manteniendo la estructura de arriba).
3. En el repositorio, ve a **Settings → Pages**.
4. En "Source", elige la rama `main` (o `master`) y la carpeta `/ (root)`.
5. Guarda. GitHub te dará una URL como `https://tu-usuario.github.io/tu-repositorio/`.

## Notas técnicas

- Todo es HTML, CSS y JavaScript puro: no requiere `npm`, backend ni build.
- Sin música ni botón de audio.
- Responsive: se adapta a celular y a pantallas grandes.
- Respeta la preferencia de "reducir movimiento" del sistema operativo, por accesibilidad.
