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
- El texto blanco (`--text` / `--text-dim`) solo se usa en tamaños de 18 px o más, o en textos de una línea (migas, etiquetas, ayuda). Cualquier párrafo de más de una línea va en `--ink`. Única excepción: la frase de presentación de About (tamaño de 24 px o más) puede ocupar varias líneas en `--text`.
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
| Frase breve (inicio, contacto) | Inter 400 | `1rem` | `--text`, minúscula, una línea |
| Frase de presentación (About) | Inter 300 | `clamp(1.5rem, 3vw, 2.5rem)` | `--text`, `line-height: 1.2`, `max-width: 24ch`, minúscula |
| Bio (About) y descripción / resultado (ficha) | Inter 400 | `1rem` | igual que el párrafo de case study: `line-height: 1.5`, `max-width: 60ch`, `--ink` |
| Fila de la tabla de tiempos (`all stages`) | Inter 400 | `1rem` | `font-variant-numeric: tabular-nums`; número y años en `--text-dim`, empresa y rol en `--text` si la fila está activa |
| Línea de créditos (About) | Inter 400 | `0.8125rem` | `--text-dim`; el enlace en `--text` |

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
| Menú principal en carrusel horizontal | Carrusel `about \| career \| contact` | Inicio |
| Línea de letras animada que cambia de forma | Serpiente de letras con `angelbarreiro`; forma según la opción activa | Inicio |
| Selección de tramo: recorrido de puntos + ficha | Selección de etapa profesional: recorrido de puntos por empresa + ficha | Trayectoria |
| Carrusel de tramos `one \| two \| three…` | Carrusel `all stages \| idrica \| leemons \| pccomponentes \| inditex` | Trayectoria |
| Tabla de tiempos | `all stages`: lista de toda la experiencia, una fila por empresa | Trayectoria |
| Ficha del tramo | Ficha de empresa: cargos, descripción y resultado destacado | Ficha |
| Pantalla de jugador con figura de puntos | About: silueta de puntos dibujada desde cero | About |
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
- Letras sueltas en `--text` dispuestas a lo largo de un trazado, rotadas según la tangente (en el tramo de rally, los tramos hacia la izquierda se dibujan con las letras en pie y el orden invertido, y el texto se refleja en cada curva cerrada, con un fundido), con una cabeza de punto blanco de 6 px. En `career` el trazado es un tramo abierto y las letras circulan por él en el sentido de lectura (como en el sobre) a 5 letras por segundo: el punto lo recorre y las letras de la zona que aún no ha recorrido están atenuadas (opacidad 0,4).
- Simula profundidad: letras más pequeñas y opacidad 0,6 en los tramos "lejanos"; 14 px y opacidad 1 en los cercanos.
- Formas: `career` → tramo de rally abierto con curvas (girado en pantallas más altas que anchas); `contact` → contorno de un sobre; `about` → contorno de la silueta de About. Las letras aparecen y desaparecen con un fundido en el 5 % inicial y final del tramo abierto. Con `about` y `contact` no hay punto recorriendo.
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
- Frase breve (5.7) encima de una lista vertical (5.2) con `email` y `linkedin`, alineada con el margen izquierdo del bloque central, el conjunto verticalmente centrado.
- Sin ilustración: ni sobre ni serpiente en esta pantalla. No añadas formularios.

### 5.7 Frase breve (inicio y contacto)
- Una línea, Inter 400 `1rem`, `--text`, minúscula, texto provisional.
- Inicio: justo encima del carrusel, con su inicio alineado con la palabra activa (a un tercio del ancho). Contacto: encima de la lista, alineada con su margen izquierdo.
- En móvil puede ocupar dos líneas; no se recorta.

### 5.8 About
- Dos columnas en escritorio: izquierda 55 % (frase de presentación; debajo, bio; debajo, formación), derecha 45 % (figura de puntos). Línea de créditos al final, a todo el ancho del bloque.
- Frase de presentación y bio: ver escala de §3. Todo el contenido salvo la figura es provisional y se muestra como hueco marcado (`pending`).
- Formación: filas separadas por líneas finas de 1 px en `--line` (como 5.2, sin icono): `título · centro` a la izquierda y años a la derecha en `--text-dim`.
- Figura: silueta de persona hecha con puntos, con las medidas de los recorridos (5.4): puntos blancos de 4 px (`--text`), separados 6 px, sin puntos de color. Sin marco. Decorativa (`aria-hidden="true"`). Dibujada desde cero, no extraída del juego.
- Línea de créditos: una línea en `--text-dim` de `0.8125rem` con el nombre del juego como texto plano y el enlace (en `--text`). Mientras el enlace esté pendiente, se muestra el texto sin enlace.

### 5.9 Todas las etapas (tabla de tiempos)
- Lista vertical (5.2) con columnas: número (`01`…), empresa, rol y años. Ancho máximo `40rem`. Filas de la más reciente a la más antigua; el empleo actual lleva `now` como años finales.
- Ocupa la zona central en lugar del recorrido y la tarjeta. Fila activa en `--text`; las demás en `--text-dim`. ↑ ↓ cambia de fila (cambio inmediato de color), Enter o toque abre la ficha.
- Sin Doto: la fuente de puntos queda reservada al cronómetro y al número grande.

### 5.10 Ficha de empresa
- Dos columnas en escritorio: izquierda 55 % (nombre de la empresa; evolución de cargos; descripción corta; resultado destacado), derecha 45 % (lista de case studies y `back`, con la lista vertical de 5.2).
- Nombre: estilo de nombre de empresa en fichas (§3). Cargos: filas `cargo` y `años` con el estilo de etiquetas y datos de ficha, separadas por líneas de 1 px en `--line`, del más reciente al más antiguo.
- Descripción y resultado destacado: estilo de párrafo (§3). El resultado lleva encima la etiqueta `highlight` (Inter 400 `0.875rem`, `--text-dim`).
- Móvil: una columna; primero cargos, descripción y resultado; debajo la lista de case studies.

## 6. Animación y transiciones

Sí:
- **Carrusel**: desplazamiento horizontal de 250 ms, `cubic-bezier(0.2, 0.8, 0.2, 1)`, al cambiar de opción.
- **Serpiente**: las letras circulan por el tramo en el sentido de lectura (5 por segundo, igual que en el sobre); el punto recorre el tramo de abajo hacia arriba en 14 s, espera 1,5 s al final y las letras iluminadas se apagan en 0,6 s antes de repetir. En el sobre, las letras circulan. Al cambiar de opción, interpolación de las letras a la nueva forma en 600 ms.
- **Recorridos y figura de About**: al cambiar de empresa, el nuevo recorrido se dibuja punto a punto en 500 ms en total; la silueta de About aparece del mismo modo al entrar en la pantalla.
- **Cronómetro**: actualización continua con `requestAnimationFrame`.
- **Cambio de pantalla**: corte seco, o fundido de opacidad de 120 ms como máximo.
- **Selección en listas**: cambio inmediato de color, sin transición.
- **Casilla visitada**: aparece la marca sin animación.

Easter egg:
- Solo con `career` seleccionado (no con `about` ni `contact`). Se activa al **tocar el punto** (puntero a menos de 18 px o toque). No hay activación por inactividad.
- Las letras se interpolan (600 ms) para formar `if in doubt, flat out (colin mcrae)` repetido a lo largo del tramo, y siguen circulando al mismo ritmo que el nombre. Con `prefers-reduced-motion` no se desplazan.
- Dura **3,5 segundos**, aunque el puntero se aleje. Después vuelve sola a `angelbarreiro` (600 ms). Si el punto llega antes al final del tramo, vuelve en ese momento.

No:
- Entradas de elementos al hacer scroll, aparición escalonada, rebotes, efectos parallax.
- Animaciones de hover que cambien tamaño, posición o sombra. El hover solo puede cambiar `--text-dim` a `--text`.
- Cursores personalizados, partículas, sonidos.
- Transiciones de página de más de 120 ms.

`prefers-reduced-motion: reduce`:
- La serpiente se muestra quieta en su forma, sin desplazarse ni interpolar.
- El carrusel cambia de opción sin desplazamiento.
- Los recorridos y la silueta de About aparecen completos de golpe.
- El cronómetro sigue corriendo (es información, no decoración).
- El easter egg se puede activar, pero el cambio de texto es instantáneo.

## 7. Móvil (< 768 px)

- **Carrusel**: se mantiene horizontal. Deslizar a izquierda o derecha mueve una opción; tocar la palabra activa confirma; tocar otra palabra la selecciona. Tamaño mínimo de palabra `2.25rem`.
- **Línea de ayuda**: `swipe to choose, tap to confirm.`
- **Migas**: si no caben, se muestran solo las dos últimas.
- **Trayectoria**: recorrido arriba (alto máximo 40 vh), ficha debajo, carrusel abajo. `all stages`: la tabla pasa a dos columnas (empresa y años; el rol bajo el nombre de la empresa).
- **About**: una columna: figura de puntos arriba (alto máximo 35 vh), luego frase de presentación, bio, formación y créditos.
- **Frases breves**: sobre el carrusel (inicio) y sobre la lista (contacto), hasta dos líneas.
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
- La serpiente, los recorridos y la silueta de About son decorativos: `aria-hidden="true"`. El texto del easter egg no tiene que ser accesible.
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
- En la línea de créditos de About: el nombre del juego (Colin McRae Rally 2.0) como texto plano con un enlace a una referencia pública, sin logos ni imágenes. También el nombre del piloto entre paréntesis tras la frase del easter egg, como atribución.
- La disposición general de las pantallas, el uso de minúsculas, el carrusel, los gráficos de puntos y letras dibujados desde cero, y la frase `if in doubt, flat out` en el easter egg como homenaje.

Las capturas de referencia que tiene Ángel sirven solo para consultar el estilo. No las añadas al repositorio.
