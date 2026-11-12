# Portfolio de Ángel Barreiro — Especificación v1.1

Web personal de Ángel Barreiro, product designer. Estética inspirada en los menús de un videojuego de rally del año 2000: fondo plano verde salvia, tipografía fina en minúscula, carrusel horizontal infinito, gráficos hechos con puntos y letras, cronómetro en pantalla.

Idioma de la web: **inglés** (un selector de idioma queda para una versión futura).

> Importante: es un homenaje de estilo. No usar logos, nombres, imágenes, sonidos ni otros recursos del juego original. Todo el contenido gráfico se genera en código (SVG/Canvas) o son imágenes del propio Ángel. Única excepción: la línea de créditos de About, que nombra el juego como texto plano con un enlace (ver 4.2 y `DESIGN.md` §9).

---

## 1. Técnica y despliegue

- Web estática: **HTML + CSS + JavaScript sin framework ni paso de build**.
- Debe funcionar igual en **GitHub Pages** (primero, bajo `/<nombre-repo>/`) y en **cdmon** (después, subida por FTP a la raíz del dominio). Por eso:
  - Todas las rutas a archivos son **relativas** (nada que empiece por `/`).
  - Navegación entre pantallas con **hash** (`#home`, `#about`, `#career`, `#career/pccomponentes`, `#career/pccomponentes/checkout`, `#contact`), sin configuración de servidor.
- Todo el contenido editable vive en un único archivo de datos (`data/content.js` o `content.json`) para que Ángel pueda cambiar textos sin tocar la lógica.
- Fuentes **alojadas en el propio repositorio** (ver `DESIGN.md`).
- Estructura sugerida:

```
/index.html
/css/styles.css
/js/main.js          (router, carrusel, cronómetro, teclado/gestos)
/js/snake.js         (serpiente de letras, formas y easter egg)
/js/stages.js        (recorridos de puntos de la trayectoria)
/js/figure.js        (silueta de puntos de About y su contorno para la serpiente)
/data/content.js     (todo el contenido)
/assets/img/...      (capturas de proyectos)
/assets/fonts/...      (Inter y Doto, woff2)
```

## 2. Estilo visual

Todo lo visual (color, tipografía, medidas, animaciones, móvil y límites) está en **`DESIGN.md`**. Léelo antes de tocar cualquier estilo. Si este archivo y `DESIGN.md` se contradicen en algo visual, manda `DESIGN.md`.

## 3. Componentes comunes

### Carrusel horizontal infinito
- Palabras grandes en minúscula separadas por barras verticales finas.
- Se repiten en bucle a ambos lados y se cortan en los bordes de la pantalla.
- La opción activa en blanco; el resto, atenuadas.
- Control: flechas ← → para elegir, Enter para confirmar, Esc para volver. En móvil, deslizar para elegir y tocar para confirmar. Con ratón, clic en una palabra la selecciona; clic en la activa la confirma.

### Lista vertical (submenús)
- Opciones separadas por líneas finas horizontales; a la izquierda de cada una, un pequeño icono de flecha dentro de una caja.
- Activa en blanco; resto, atenuadas. Flechas ↑ ↓, Enter, Esc; en móvil, tocar.

## 4. Pantallas

### 4.1 Inicio (`#home`)
- Migas: `angel barreiro | product designer` (texto en `data/content.js`).
- Centro: **la serpiente de letras** (ver sección 5).
- **Frase de presentación breve**, una línea, justo encima del carrusel y alineada con la palabra activa. Texto provisional (lo reescribe Ángel), en `data/content.js`.
- Carrusel: `about | career | contact`. Orden fijo. Al cargar la página queda seleccionada `career` (la opción central); al volver a inicio, la última opción visitada.

### 4.2 About (`#about`)
- Migas: `angel barreiro | about`.
- **Sin skills ni tools.** Todo el contenido, salvo la figura, es provisional y debe verse como hueco marcado (`pending`) hasta que Ángel lo escriba. Va en `data/content.js`.
- Columna izquierda, de arriba abajo:
  - **Frase de presentación**, al estilo de un portfolio minimalista (una o dos líneas, grande).
  - **Bio breve** (un párrafo).
  - **Formación**: lista de filas `título · centro · años` (contenido pendiente).
- Columna derecha: **figura de puntos** (silueta de persona, generada en código), a la manera de la pantalla de jugador del juego. Aparece punto a punto.
- Al final, **línea de créditos**: indica que el diseño se inspira en Colin McRae Rally 2.0 y enlaza a una referencia para quien no conozca el juego. El enlace está pendiente (hueco visible, sin href real).
- Esc → `#home`. No hay carrusel en esta pantalla.

### 4.3 Trayectoria (`#career`) — selección de tramo
- Migas: `career | stage select`.
- Carrusel: `all stages | idrica | leemons | pccomponentes | inditex` (las empresas, en orden cronológico inverso). La primera opción es `all stages`.
- **`all stages`**: vista de lista con toda la experiencia de un vistazo, con estética de tabla de tiempos. Una fila por empresa, de la más reciente a la más antigua: `número | empresa | rol | años` (el empleo actual marcado con `now`). Flechas ↑ ↓ para elegir fila, Enter / tocar → abre la ficha de esa empresa. Sustituye al recorrido y a la tarjeta de la pantalla.
- **Una empresa seleccionada en el carrusel**: igual que antes.
  - Izquierda: **recorrido dibujado con puntos blancos**, distinto para cada empresa (generado en código con una semilla fija para que siempre salga igual), con punto verde de salida y rojo de llegada. Al cambiar de empresa, el recorrido se redibuja punto a punto.
  - Derecha, tarjeta resumen: imagen pequeña de cabecera (hueco provisional), `years:`, `role:`, `surfaces:` (ej. `research, flows, ui`).
  - Enter / tocar → abre la **ficha** de esa empresa (ya no entra directo al case study).

### 4.4 Ficha de empresa (`#career/<empresa>`)
- Migas: `career | <empresa>`.
- Contenido, más completo que la tarjeta de la selección de tramo:
  - Nombre de la empresa.
  - **Evolución de cargos**: lista de `cargo · años`, del más reciente al más antiguo (si hubo un solo cargo, una fila).
  - **Descripción corta** (2–3 líneas).
  - **Resultado destacado**: etiqueta `highlight` y una frase con un resultado concreto.
  - **Lista de case studies**: una fila por proyecto de la empresa (ej. en PcComponentes: `logistics`, `checkout`) más `back`. Enter / tocar → entra en el case study. Si la empresa aún no tiene proyectos, una fila `case study: coming soon` no accionable.
- Contenido pendiente salvo los cargos y años de la sección 7: huecos marcados `pending`.
- Esc → `#career`.

### 4.5 Reglaje de empresa (`#career/<empresa>/<proyecto>`) — el case study
Inspirada en la pantalla de reglaje del coche.

- **Pestañas arriba a la izquierda**: un proyecto por pestaña dentro de la empresa (ej. en PcComponentes: `logistics | checkout`), más `back` (vuelve a la ficha). La activa en blanco.
- **Arriba a la derecha**: datos de la empresa/proyecto: rol, años, equipo, plataformas (`mobile, desktop`).
- **Lista de secciones a la derecha** (lista vertical con casilla a la derecha de cada opción). Secciones iniciales, editables por proyecto: `context, research, flows, ui, design qa, results`. Al visitar una sección, su casilla queda marcada (guardar en `sessionStorage`, con try/catch).
- **Imagen principal arriba a la izquierda**: una pantalla clave del proyecto. Desde ella salen **líneas guía** finas (como las que señalan las ruedas del coche) hacia el punto de la interfaz relacionado con la sección activa. Coordenadas del punto definidas en los datos de cada sección (en %).
- **Caja amarilla pálida**: imagen de detalle de la sección (wireframe, flujo, foto de research…).
- **Caja del número grande**: un dato clave de la sección con su etiqueta encima (ej. `interviews` → `12`, `duration` → `06:00`).
- **Barra de escala**: escala de fidelidad `low-fi` ↔ `hi-fi` con un marcador que indica en qué punto está la imagen de esa sección.
- **Texto inferior**: explicación breve de la sección (2–4 líneas).
- Esc → ficha de la empresa.

### 4.6 Contacto (`#contact`)
- Migas: `angel barreiro | contact`.
- **Frase breve** encima de la lista, una línea. Texto provisional (lo reescribe Ángel), en `data/content.js`.
- Lista vertical: `email`, `linkedin`. Sin CV.
  - email → `mailto:angelbarreiroribadulla@gmail.com`
  - linkedin → https://www.linkedin.com/in/angelbarreiro (pestaña nueva)
- **Sin ilustración**: la pantalla queda limpia, solo frase y lista.

## 5. La serpiente de letras

- Una línea de letras pequeñas que repite el texto `angelbarreiro` (con un espacio entre repeticiones) sobre una forma. En `career` la forma es un **tramo de rally abierto** (en móvil, el mismo tramo girado) y las letras **circulan por él en el sentido de lectura, como en el sobre, a 5 letras por segundo**; un **punto blanco recorre el tramo de abajo (cerca) hacia arriba (lejos)** en 14 s e ilumina las letras que están en la zona por la que ya ha pasado (hace de progreso de la trayectoria profesional). Al llegar al final espera 1,5 s, las letras se apagan y vuelve a empezar. En `contact`, el sobre, y en `about`, la silueta: las letras circulan por ellos.
- Las letras siguen la curva (rotadas según la tangente; en los tramos hacia la izquierda del tramo de rally se dibujan en pie y con el orden invertido, para que el nombre se lea bien en todo el recorrido) y tienen algo de perspectiva/profundidad: más pequeñas y apretadas al alejarse.
- **Cambia de forma según la opción seleccionada en el carrusel de inicio**, interpolando la posición de las letras de una forma a otra:
  - `career` → una carretera con curvas.
  - `contact` → el contorno de un sobre.
  - `about` → el contorno de la silueta de la figura de About (las letras se interpolan hacia él).
  - La forma del sobre y el contorno de la silueta son bucles cerrados; el tramo de `career` es abierto. Con `about` y `contact` seleccionados no hay punto recorriendo ni easter egg.
- Implementación sugerida: cada forma es un trazado SVG; se muestrea en N puntos y las letras se interpolan entre los puntos de la forma anterior y la nueva.

### Easter egg
- Solo con `career` seleccionado (no con `about` ni `contact`). Se activa cuando el visitante **toca el punto** con el puntero (o con el dedo). No hay activación por inactividad.
- Las letras pasan a repetir `if in doubt, flat out (colin mcrae)` y siguen circulando al mismo ritmo que el nombre.
- Dura **3,5 segundos**, aunque el puntero se aleje, y vuelve solo a `angelbarreiro`. Si el punto llega antes al final del tramo, vuelve en ese momento.

## 6. Responsive

- Funcionar igual de bien en móvil y ordenador.
- Móvil: el carrusel sigue siendo horizontal y se controla deslizando. En la pantalla de reglaje, primero la lista de secciones; al tocar una, se abre su detalle debajo (imagen principal, caja amarilla, número, escala y texto).
- Respetar las zonas seguras de iPhone (`viewport-fit=cover` + `env(safe-area-inset-*)`).
- Foco de teclado visible en todos los elementos interactivos.

## 7. Contenido inicial

| Empresa | Años | Rol | Proyectos (pestañas) |
|---|---|---|---|
| Idrica | 2024 – now | Product Designer | pendiente |
| Leemons | 2023 – 2024 | Product Designer | pendiente |
| PcComponentes | 2021 – 2023 | Product Designer | logistics, checkout |
| Inditex Logística | 2019 – 2021 | Junior Product Designer | wms |

Estos datos son también la evolución de cargos de la ficha (un cargo por empresa). Si hubo cambios de cargo dentro de una empresa, se añaden como filas nuevas (pendiente).

Textos de referencia (del portfolio actual, angelbarreiro.framer.website):
- Leemons: wireframes a prototipos de alta fidelidad, user flows y stories, colaboración con back, front y UI, design QA tras la implementación.
- PcComponentes: rediseño visual y de flujos de las apps de logística (móvil y escritorio), research con entrevistas y seguimiento a empleados, apoyo en la experiencia de pago.
- Inditex: diseño de un software WMS: mapeos, arquitectura de información, wireframes, prototipos e interfaz en móvil y escritorio; colaboración en un design system.

## 8. Pendiente (usar huecos provisionales marcados mientras tanto)

- [x] Dirección de email de contacto.
- [ ] Proyectos de Idrica y Leemons (los prepara Ángel).
- [ ] Lista definitiva de secciones del case study y su contenido.
- [ ] Imágenes: pantalla principal y detalles de cada proyecto.
- [ ] Frase de presentación de inicio y frase breve de contacto (hay texto provisional).
- [ ] About: frase de presentación, bio y formación.
- [ ] About: enlace de la línea de créditos a la referencia del juego.
- [ ] Ficha de cada empresa: descripción corta, resultado destacado y cargos si hubo más de uno.

## Fuera de esta versión

- Parksharing: probablemente se quita.
- Posible sección futura de proyectos personales (con FuelHoy y, si se mantiene, Parksharing). Se añadiría como una opción más del carrusel de inicio.
- Selector de idioma.

## 9. Orden de trabajo sugerido para Claude Code

1. Esqueleto: marco fijo (migas, cronómetro, línea de ayuda), router por hash y archivo de datos.
2. Carrusel infinito con teclado, ratón y gestos táctiles.
3. Inicio con la serpiente, sus formas y el easter egg.
4. Trayectoria: selección de tramo con recorridos de puntos y ficha.
5. Pantalla de reglaje con pestañas, lista, líneas guía y detalle.
6. Contacto.
7. Repaso responsive, accesibilidad y `prefers-reduced-motion`.
8. Publicar en GitHub Pages (rama `main`, carpeta raíz) y comprobar que todo funciona bajo `/<nombre-repo>/`.

### Ampliación v1.1 (about, ficha de empresa y tabla de tiempos)

9. Inicio: carrusel `about | career | contact` y frase de presentación.
10. About: pantalla, figura de puntos y su contorno para la serpiente.
11. Career: `all stages` (tabla de tiempos) y ficha de empresa; el case study pasa a `#career/<empresa>/<proyecto>`.
12. Contacto: frase breve y sin ilustración.

Cada paso se revisa antes de pasar al siguiente.
