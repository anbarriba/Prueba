# DESIGN.md

Guía de diseño del portfolio de Ángel Barreiro. Léela entera antes de crear o modificar cualquier estilo, componente visual o animación. Si algo de esta guía choca con una petición, pregunta antes de cambiarlo. Si algo no está cubierto aquí, pregunta en vez de inventarlo.

Comportamiento y contenido: ver `SPEC.md`. Este archivo solo define cómo se ve y cómo se mueve.

---

## 1. Principios

1. Pantalla plana y vacía. Fondo de un solo color; nada de degradados, sombras, texturas, bordes redondeados ni tarjetas.
2. Pocas cosas en pantalla y muy ordenadas: un marco fijo (migas, cronómetro, ayuda), una zona central gráfica y un selector.
3. La jerarquía se marca con **blanco frente a blanco atenuado**, no con colores de acento ni negritas.
4. Todo lo gráfico se dibuja con **puntos, letras o líneas finas** (SVG o Canvas). No hay ilustraciones ni iconos de librerías.
5. Menús siempre en **minúscula**.

## 2. Color

Define estos valores como variables CSS en `:root` y usa solo variables en el resto del CSS. No añadas colores nuevos sin preguntar.

| Variable | Hex | Uso |
|---|---|---|
| `--bg` | `#9DB4AC` | Fondo de todas las pantallas (medido en las capturas de referencia). |
| `--text` | `#FFFFFF` | Opción activa de menús y listas, última miga, cronómetro, títulos, líneas de la serpiente y puntos de los recorridos. |
| `--text-dim` | `#D3DDDA` | Opciones inactivas, migas anteriores, línea de ayuda, etiquetas de fichas. Equivale a blanco al 55 % sobre `--bg`. |
| `--line` | `rgba(255,255,255,0.6)` | Separadores de listas, barras verticales del carrusel, líneas guía de la pantalla de reglaje, casillas. |
| `--ink` | `#1F3A33` | Texto largo (párrafos del case study, más de una línea). Contraste ≈ 5,6:1 sobre `--bg` y ≈ 10:1 sobre `--panel`. |
| `--panel` | `#E7EBC6` | Caja amarilla pálida de detalle en la pantalla de reglaje (medido en la referencia). |
| `--box` | `#CED7DE` | Caja del número grande en la pantalla de reglaje (medido en la referencia). |
| `--start` | `#3FBF5F` | Punto de salida de los recorridos de trayectoria. |
| `--finish` | `#D9433A` | Punto de llegada de los recorridos de trayectoria. |

Reglas:
- No hay modo oscuro ni claro: la web tiene un único tema. Declara `color-scheme: light`.
- El texto blanco (`--text` / `--text-dim`) solo se usa en tamaños de 18 px o más, o en textos de una línea (migas, etiquetas, ayuda). Cualquier párrafo de más de una línea va en `--ink`.
- El número grande va en `--text` sobre `--box`, como en la referencia. Es decorativo-informativo: repite su valor en texto accesible (`aria-label` o texto oculto visualmente).
- `--start` y `--finish` solo en esos dos puntos. Ningún otro elemento usa color.

## 3. Tipografía

Dos familias de Google Fonts, **autoalojadas** en `assets/fonts/` en formato woff2 (no cargar desde `fonts.googleapis.com`, para no enviar datos de visitantes a terceros).

| Familia | Pesos a incluir | Uso |
|---|---|---|
| **Inter** | 300, 400, 600 | Todo el texto salvo cifras de tiempo y número grande. |
| **Doto** | 500, 700 | Cronómetro y número grande de la pantalla de reglaje. |

Pila de fuentes:
```css
--font-sans: "Inter", "Helvetica Neue", Helvetica, Arial, sans-serif;
--font-dots: "Doto", "Inter", monospace;
```

Escala (usa exactamente estos valores):

| Elemento | Familia / peso | Tamaño | Otros |
|---|---|---|---|
| Palabras del carrusel | Inter 300 | `clamp(2.25rem, 6vw, 4.5rem)` | minúscula, `letter-spacing: -0.02em`, `line-height: 1` |
| Opciones de lista vertical | Inter 400 | `1rem` (móvil `1.0625rem`) | minúscula |
| Migas | Inter 600 | `0.875rem` | la última en `--text`, las demás en `--text-dim` |
| Cronómetro: etiqueta `time` | Inter 600 | `0.875rem` | `--text` |
| Cronómetro: cifras | Doto 700 | `1rem` | `--text-dim`, `font-variant-numeric: tabular-nums` |
| Línea de ayuda | Inter 600 | `0.8125rem` | `--text-dim` |
| Texto de build (abajo izq.) | Inter 400 | `0.6875rem` | `--text-dim` |
| Nombre de empresa / proyecto en fichas | Inter 600 | `1.125rem` | `--text` |
| Etiquetas y datos de ficha | Inter 400 | `0.875rem` | etiqueta en `--text-dim`, valor en `--text` |
| Párrafo de case study | Inter 400 | `1rem` | `line-height: 1.5`, `max-width: 60ch`, color `--ink` |
| Número grande | Doto 700 | `clamp(3rem, 7vw, 4.5rem)` | `--text` sobre `--box` |
| Etiqueta del número grande | Inter 400 | `0.875rem` | `--ink` |
| Letras de la serpiente | Inter 400 | `10–14px`, variable por profundidad | `--text` |

Reglas:
- Nada de mayúsculas sostenidas, cursivas ni subrayados (salvo foco de teclado).
- Solo los pesos indicados. No uses 700 de Inter.

## 4. Marco fijo (todas las pantallas)

```
┌──────────────────────────────────────────────────────────┐
│ migas | migas | actual                  time 00:00.00    │
│                                                          │
│                  zona central gráfica                    │
│                                                          │
│ palabra | palabra | ACTIVA | palabra | palabra | pala…   │
│      use the arrow keys to choose, press enter to confirm. │
│ ab portfolio build 1 (nov 2026)                          │
└──────────────────────────────────────────────────────────┘
```

- Márgenes laterales: `clamp(1rem, 3vw, 2.5rem)`. Margen superior: `clamp(1rem, 3vh, 2rem)` + zona segura.
- Migas: arriba a la izquierda, separadas por una barra vertical de 1 px en `--line` con `0.5rem` de espacio a cada lado.
- Cronómetro: arriba a la derecha, formato `mm:ss.cc`. Se reinicia a `00:00.00` al entrar en cada pantalla y corre siempre.
- Línea de ayuda: centrada horizontalmente con el bloque de contenido, justo bajo el carrusel o la lista.
- Texto de build: abajo a la izquierda, muy pequeño.

## 5. Traducción de cada elemento del juego

| En el juego | En la web | Pantalla |
|---|---|---|
| Menú principal en carrusel horizontal | Carrusel `career \| contact` | Inicio |
| Línea de letras animada que cambia de forma | Serpiente de letras con `angelbarreiro`; forma según la opción activa | Inicio |
| Selección de tramo: recorrido de puntos + ficha | Selección de etapa profesional: recorrido de puntos por empresa + ficha | Trayectoria |
| Carrusel de tramos `one \| two \| three…` | Carrusel de empresas `idrica \| leemons \| pccomponentes \| inditex` | Trayectoria |
| Pantalla de reglaje del coche | Case study de cada empresa/proyecto | Reglaje |
| Pestañas `information \| set up \| repair…` | Un proyecto por pestaña + `back` | Reglaje |
| Coche con líneas que señalan las piezas | Pantalla clave del proyecto con líneas guía al punto de la sección activa | Reglaje |
| Lista de reglajes con casillas | Lista de secciones del case study; la casilla se marca al visitarla | Reglaje |
| Caja amarilla con dibujo de la pieza | Caja `--panel` con imagen de detalle de la sección | Reglaje |
| `adjustment time` + número grande | Etiqueta + dato clave de la sección | Reglaje |
| Barra `soft` ↔ `hard` | Barra `low-fi` ↔ `hi-fi` con marcador | Reglaje |
| Lista vertical de submenú (icono de flecha en caja) | Lista `email \| linkedin` | Contacto |
| Migas, `time`, línea de ayuda | Igual, con textos propios | Todas |

### 5.1 Carrusel horizontal
- Una sola fila. Palabras separadas por una barra vertical de 1 px en `--line`, alto igual al de la x de las palabras ×1,4, con `0.6em` de espacio a cada lado.
- La lista se repite para llenar todo el ancho y se corta en los bordes de la pantalla, sin máscaras ni desvanecidos.
- La palabra activa se coloca alineada a un tercio del ancho desde la izquierda, en `--text`. Las demás, en `--text-dim`.
- Sin subrayado, sin fondo, sin cambio de tamaño en la activa.

### 5.2 Lista vertical
- Ancho máximo `28rem`. Cada fila: `padding: 0.75rem 0`, línea superior e inferior de 1 px en `--line` (las filas comparten línea).
- A la izquierda de cada opción, icono de `0.75rem`: un cuadrado de borde 1 px con un triángulo apuntando a la derecha, dibujado en SVG inline. En `--text` si la fila está activa, `--text-dim` si no.
- En la pantalla de reglaje, casilla de `0.75rem` a la derecha (cuadrado de borde 1 px). Visitada: el mismo cuadrado con una marca de verificación de 1,5 px.

### 5.3 Serpiente de letras (inicio)
- Letras sueltas en `--text` dispuestas a lo largo de un trazado, rotadas según la tangente, con una cabeza de punto blanco de 6 px. En `career` el trazado es un tramo abierto y las letras no se mueven: el punto lo recorre y las letras por delante están atenuadas (opacidad 0,4) hasta que pasa.
- Simula profundidad: letras más pequeñas y opacidad 0,6 en los tramos "lejanos"; 14 px y opacidad 1 en los cercanos.
- Formas: `career` → tramo de rally abierto con curvas (girado en pantallas más altas que anchas); `contact` → contorno de un sobre. Las letras aparecen y desaparecen con un fundido en el 5 % inicial y final del tramo.
- Ocupa la zona central, con un ancho máximo del 80 % de la pantalla.

### 5.4 Recorridos de trayectoria
- Puntos blancos de 4 px (`--text`) separados entre sí 6 px a lo largo del trazado. Primer punto en `--start` y último en `--finish`, ambos de 6 px.
- Cada empresa tiene un trazado distinto, generado con una semilla fija por empresa para que siempre sea el mismo.
- Ficha a la derecha: imagen de cabecera de 160 × 40 px (hueco con borde 1 px en `--line` mientras no haya imagen), y debajo filas `etiqueta: valor`.

### 5.5 Pantalla de reglaje
- Dos columnas en escritorio: izquierda 55 % (imagen principal arriba; debajo, fila con caja `--panel` y caja `--box` lado a lado; debajo, barra de escala; debajo, párrafo). Derecha 45 % (datos del proyecto arriba; lista de secciones debajo).
- Imagen principal: altura máxima `14rem`, sin marco.
- Líneas guía: 1 px en `--line`, solo tramos rectos horizontales y verticales (en ángulo de 90°), desde el punto de la sección en la imagen hasta el borde inferior de la imagen. Terminan en un punto blanco de 5 px sobre la imagen.
- Caja `--panel`: proporción 16:10, la imagen de detalle va centrada y contenida dentro.
- Caja `--box`: misma altura que la caja `--panel`; etiqueta arriba, número centrado.
- Barra de escala: alto 12 px, fondo `--box`, marcador de 24 × 12 px en `--ink`. Etiquetas `low-fi` y `hi-fi` en los extremos, debajo.

### 5.6 Contacto
- Lista vertical (5.2) con `email` y `linkedin`, alineada con el margen izquierdo del bloque central, verticalmente centrada.
- Zona central vacía o con la serpiente en forma de sobre, quieta. No añadas formularios.

## 6. Animación y transiciones

Sí:
- **Carrusel**: desplazamiento horizontal de 250 ms, `cubic-bezier(0.2, 0.8, 0.2, 1)`, al cambiar de opción.
- **Serpiente**: el punto recorre el tramo de abajo hacia arriba en 14 s, espera 1,5 s al final y las letras iluminadas se apagan en 0,6 s antes de repetir. En el sobre, las letras circulan. Al cambiar de opción, interpolación de las letras a la nueva forma en 600 ms.
- **Recorridos**: al cambiar de empresa, el nuevo recorrido se dibuja punto a punto en 500 ms en total.
- **Cronómetro**: actualización continua con `requestAnimationFrame`.
- **Cambio de pantalla**: corte seco, o fundido de opacidad de 120 ms como máximo.
- **Selección en listas**: cambio inmediato de color, sin transición.
- **Casilla visitada**: aparece la marca sin animación.

Easter egg:
- Solo con `career` seleccionado. Se activa tras **4,5 segundos sin interacción** en inicio, o al **tocar el punto** (puntero a menos de 18 px o toque).
- Las letras se interpolan (600 ms) para formar `if in doubt, flat out (colin mcrae)` repetido a lo largo del tramo, sin moverse de su sitio.
- Dura **al menos 7 segundos**, aunque el puntero se aleje. Después, cualquier movimiento de ratón, toque o tecla las devuelve a `angelbarreiro` (600 ms) y reinicia el contador de 4,5 s.

No:
- Entradas de elementos al hacer scroll, aparición escalonada, rebotes, efectos parallax.
- Animaciones de hover que cambien tamaño, posición o sombra. El hover solo puede cambiar `--text-dim` a `--text`.
- Cursores personalizados, partículas, sonidos.
- Transiciones de página de más de 120 ms.

`prefers-reduced-motion: reduce`:
- La serpiente se muestra quieta en su forma, sin desplazarse ni interpolar.
- El carrusel cambia de opción sin desplazamiento.
- Los recorridos aparecen completos de golpe.
- El cronómetro sigue corriendo (es información, no decoración).
- El easter egg se puede activar, pero el cambio de texto es instantáneo.

## 7. Móvil (< 768 px)

- **Carrusel**: se mantiene horizontal. Deslizar a izquierda o derecha mueve una opción; tocar la palabra activa confirma; tocar otra palabra la selecciona. Tamaño mínimo de palabra `2.25rem`.
- **Línea de ayuda**: `swipe to choose, tap to confirm.`
- **Migas**: si no caben, se muestran solo las dos últimas.
- **Trayectoria**: recorrido arriba (alto máximo 40 vh), ficha debajo, carrusel abajo.
- **Reglaje**:
  - Una columna. Orden: pestañas (con scroll horizontal si no caben), datos del proyecto, lista de secciones.
  - Al tocar una sección, se despliega debajo de esa fila su detalle: imagen principal con líneas guía, caja `--panel`, caja `--box`, barra de escala y párrafo, en ese orden. Solo una sección abierta a la vez.
- **Serpiente**: ancho máximo del 90 % de la pantalla; letras de 9–12 px.
- **Zonas táctiles**: mínimo 44 × 44 px en todo lo pulsable (puedes ampliar el área con padding sin cambiar el aspecto).
- **Zonas seguras**: `<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">` y márgenes con `env(safe-area-inset-*)`.
- **Altura**: usa `100dvh`, no `100vh`.

## 8. Accesibilidad mínima

- Foco de teclado visible en todo lo interactivo: contorno de 2 px en `--text` con 3 px de separación.
- El carrusel y las listas deben ser navegables con teclado y anunciados correctamente (`role="listbox"` + `aria-selected`, o botones con `aria-current`).
- La serpiente y los recorridos son decorativos: `aria-hidden="true"`. El texto del easter egg no tiene que ser accesible.
- Todas las imágenes de proyectos llevan `alt` descriptivo.

## 9. Límites

Esta web se **inspira** en el estilo de los menús de Colin McRae Rally 2.0. No reproduce el juego.

Prohibido:
- Logos, nombres comerciales o marcas del juego, de Codemasters o de fabricantes de coches.
- Capturas, fotogramas, texturas, imágenes, iconos o sonidos extraídos del juego.
- Archivos de fuentes extraídos del juego.
- Decoraciones de coches reales, banderas reales usadas como gráficos del juego o fotos de pilotos.
- Copiar literalmente los textos de la interfaz del juego. Los textos de la web son propios (ej. `use the arrow keys to choose, press enter to confirm.`).

Permitido:
- La disposición general de las pantallas, el uso de minúsculas, el carrusel, los gráficos de puntos y letras dibujados desde cero, y la frase `if in doubt, flat out` en el easter egg como homenaje.

Las capturas de referencia que tiene Ángel sirven solo para consultar el estilo. No las añadas al repositorio.
