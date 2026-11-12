# Portfolio de Ángel Barreiro — Especificación v1

Web personal de Ángel Barreiro, product designer. Estética inspirada en los menús de un videojuego de rally del año 2000: fondo plano verde salvia, tipografía fina en minúscula, carrusel horizontal infinito, gráficos hechos con puntos y letras, cronómetro en pantalla.

Idioma de la web: **inglés** (un selector de idioma queda para una versión futura).

> Importante: es un homenaje de estilo. No usar logos, nombres, imágenes, sonidos ni otros recursos del juego original. Todo el contenido gráfico se genera en código (SVG/Canvas) o son imágenes del propio Ángel.

---

## 1. Técnica y despliegue

- Web estática: **HTML + CSS + JavaScript sin framework ni paso de build**.
- Debe funcionar igual en **GitHub Pages** (primero, bajo `/<nombre-repo>/`) y en **cdmon** (después, subida por FTP a la raíz del dominio). Por eso:
  - Todas las rutas a archivos son **relativas** (nada que empiece por `/`).
  - Navegación entre pantallas con **hash** (`#home`, `#career`, `#career/pccomponentes`, `#contact`), sin configuración de servidor.
- Todo el contenido editable vive en un único archivo de datos (`data/content.js` o `content.json`) para que Ángel pueda cambiar textos sin tocar la lógica.
- Fuentes **alojadas en el propio repositorio** (ver `DESIGN.md`).
- Estructura sugerida:

```
/index.html
/css/styles.css
/js/main.js          (router, carrusel, cronómetro, teclado/gestos)
/js/snake.js         (serpiente de letras, formas y easter egg)
/js/stages.js        (recorridos de puntos de la trayectoria)
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
- Carrusel: `career | contact`.

### 4.2 Trayectoria (`#career`) — selección de tramo
- Migas: `career | stage select`.
- Carrusel con las etapas (en orden cronológico inverso): `idrica | leemons | pccomponentes | inditex`.
- Izquierda: **recorrido dibujado con puntos blancos**, distinto para cada empresa (generado en código con una semilla fija para que siempre salga igual), con punto verde de salida y rojo de llegada. Al cambiar de empresa, el recorrido se redibuja punto a punto.
- Derecha, ficha de la etapa:
  - Imagen pequeña de cabecera (hueco provisional).
  - `years:` años.
  - `role:` rol.
  - `surfaces:` áreas de trabajo (ej. `research, flows, ui`).
- Enter / tocar → entra en la pantalla de reglaje de esa empresa.

### 4.3 Reglaje de empresa (`#career/<empresa>` y `#career/<empresa>/<proyecto>`) — el case study
Inspirada en la pantalla de reglaje del coche.

- **Pestañas arriba a la izquierda**: un proyecto por pestaña dentro de la empresa (ej. en PcComponentes: `logistics | checkout`), más `back`. La activa en blanco.
- **Arriba a la derecha**: datos de la empresa/proyecto: rol, años, equipo, plataformas (`mobile, desktop`).
- **Lista de secciones a la derecha** (lista vertical con casilla a la derecha de cada opción). Secciones iniciales, editables por proyecto: `context, research, flows, ui, design qa, results`. Al visitar una sección, su casilla queda marcada (guardar en `sessionStorage`, con try/catch).
- **Imagen principal arriba a la izquierda**: una pantalla clave del proyecto. Desde ella salen **líneas guía** finas (como las que señalan las ruedas del coche) hacia el punto de la interfaz relacionado con la sección activa. Coordenadas del punto definidas en los datos de cada sección (en %).
- **Caja amarilla pálida**: imagen de detalle de la sección (wireframe, flujo, foto de research…).
- **Caja del número grande**: un dato clave de la sección con su etiqueta encima (ej. `interviews` → `12`, `duration` → `06:00`).
- **Barra de escala**: escala de fidelidad `low-fi` ↔ `hi-fi` con un marcador que indica en qué punto está la imagen de esa sección.
- **Texto inferior**: explicación breve de la sección (2–4 líneas).

### 4.4 Contacto (`#contact`)
- Migas: `angel barreiro | contact`.
- Lista vertical: `email`, `linkedin`. Sin CV.
  - email → `mailto:angelbarreiroribadulla@gmail.com`
  - linkedin → https://www.linkedin.com/in/angelbarreiro (pestaña nueva)

## 5. La serpiente de letras

- Una línea de letras pequeñas que repite el texto `angelbarreiro` (con un espacio entre repeticiones) sobre una forma. En `career` la forma es un **tramo de rally abierto** (en móvil, el mismo tramo girado) y las letras están quietas; un **punto blanco recorre el tramo de abajo (cerca) hacia arriba (lejos)** en 14 s e ilumina las letras por las que pasa (hace de progreso de la trayectoria profesional). Al llegar al final espera 1,5 s, las letras se apagan y vuelve a empezar. En `contact`, el sobre: las letras circulan por él.
- Las letras siguen la curva (rotadas según la tangente) y tienen algo de perspectiva/profundidad: más pequeñas y apretadas al alejarse.
- **Cambia de forma según la opción seleccionada en el carrusel de inicio**, interpolando la posición de las letras de una forma a otra:
  - `career` → una carretera con curvas.
  - `contact` → el contorno de un sobre.
- Implementación sugerida: cada forma es un trazado SVG; se muestrea en N puntos y las letras se interpolan entre los puntos de la forma anterior y la nueva.

### Easter egg
- Solo con `career` seleccionado (no con `contact`). Se activa cuando el visitante **toca el punto** con el puntero (o con el dedo). No hay activación por inactividad.
- Las letras pasan a repetir `if in doubt, flat out (colin mcrae)` y **se mueven a lo largo del tramo** mientras dura.
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

Textos de referencia (del portfolio actual, angelbarreiro.framer.website):
- Leemons: wireframes a prototipos de alta fidelidad, user flows y stories, colaboración con back, front y UI, design QA tras la implementación.
- PcComponentes: rediseño visual y de flujos de las apps de logística (móvil y escritorio), research con entrevistas y seguimiento a empleados, apoyo en la experiencia de pago.
- Inditex: diseño de un software WMS: mapeos, arquitectura de información, wireframes, prototipos e interfaz en móvil y escritorio; colaboración en un design system.

## 8. Pendiente (usar huecos provisionales marcados mientras tanto)

- [ ] Dirección de email de contacto.
- [ ] Proyectos de Idrica y Leemons (los prepara Ángel).
- [ ] Lista definitiva de secciones del case study y su contenido.
- [ ] Imágenes: pantalla principal y detalles de cada proyecto.

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
