# Dirección visual — Emprenia

Basado en los hallazgos de `docs/ui-audit.md`. Esto es una propuesta para aprobar, no código implementado. Nada de lo de aquí toca lógica de negocio, APIs, base de datos ni autenticación.

## Principio rector

**Simplicidad > decoración.** Emprenia lo usa gente que tiene un negocio que atender, no tiempo para aprender software. Cada pantalla debe leerse de un vistazo. El color, la sombra y el radio no son decoración — son las tres herramientas para decir "esto es importante" o "esto es secundario", y solo funcionan si se usan con esa disciplina. Ahora mismo se usan como decoración (ver auditoría, sección 4), y por eso el resultado se siente "cargado" aunque cada elemento por separado esté bien hecho.

Consecuencia directa: el color de marca a partir de ahora se reserva para **una sola cosa a la vez en pantalla** — la acción principal. No fondos de tarjeta, no bloques grandes, no dos elementos coloreados compitiendo por la misma atención.

## Por qué no partir del azul actual sin revisarlo

El azul (`#2F5FD6`) no es un color "malo" — de hecho es el mismo territorio que usan Stripe, Linear o Vercel. El problema real que has señalado no es el tono, es que **se ha aplicado en bloques grandes** (tarjeta de cierre entera, fondo de avatar, fondo de insignias, barra de acciones) en vez de en puntos concretos. Aun así, hay una razón real para ajustar el tono, no solo la forma de usarlo: el azul actual tira ligeramente a "corporativo genérico" (es un azul muy cercano al de banca/seguros, justo una de las cosas que pediste evitar). Un azul con un pelín más de violeta —un "índigo"— cae en el mismo territorio de confianza pero se lee más como producto tecnológico que como entidad financiera, que es exactamente la referencia que has dado (Stripe, Linear, Vercel usan esa familia, no el azul de banca).

## 1–2. Color de marca y color de acción

| Token | Valor | Uso | Contraste |
|---|---|---|---|
| `--brand` | `#4338CA` (índigo profundo) | Solo identidad: el punto/isotipo del logo, favicon. Nunca como fondo de componentes de interfaz. | — |
| `--action` | `#4F46E5` (índigo vivo) | Botón primario, enlaces, anillo de foco, estado activo de navegación. Un único uso a la vez por pantalla. | Texto blanco sobre `--action`: **6.29:1** (AA ✓, incluso AAA) |

Son dos tonos del mismo índigo (marca ligeramente más oscura que acción) para que el logo y los botones se sientan de la misma familia sin ser literalmente el mismo pixel — un matiz que usan casi todos los productos de la lista de referencia.

## 3–4. Fondo y superficies

| Token | Valor | Uso |
|---|---|---|
| `--bg` | `#F7F8FA` (gris frío muy claro) | Fondo de página |
| `--surface` | `#FFFFFF` | Tarjetas, formularios, modales |

Antes el fondo (`#FAFAF7`) tenía un matiz cálido/crema — es justo lo que has notado que "se sentía a estética/boutique". Un gris frío en vez de un blanco roto cálido resuelve eso sin pasar a un blanco puro y plano en toda la pantalla (que aplana la jerarquía entre página y tarjeta).

## 5–6. Texto primario y secundario

| Token | Valor | Uso | Contraste |
|---|---|---|---|
| `--ink` | `#14151F` | Texto principal, títulos | 18.1:1 sobre blanco (AAA) |
| `--ink-muted` | `#6B7280` | Subtítulos, descripciones, metadatos | 4.83:1 sobre blanco / 4.55:1 sobre `--bg` (AA ✓) |

El gris secundario actual (`#8a8a99`) falla el mínimo de accesibilidad (3.25–3.40:1, ver auditoría). `#6B7280` es la corrección directa: mismo papel, pasa AA con margen en los dos fondos donde se usa.

## 7. Bordes

| Token | Valor |
|---|---|
| `--border` | `#E3E5EA` |

Gris frío neutro, coherente con el nuevo fondo (el actual `#E4DFD4` tenía el mismo matiz cálido que el fondo antiguo).

## 8. Estados semánticos

Hoy solo existe color de error. Faltan success/warning/info — necesarios en cuanto haya confirmaciones, avisos de límite de prueba, etc.

| Token | Valor | Contraste sobre blanco |
|---|---|---|
| `--success` | `#166534` (texto) / `#DCFCE7` (fondo suave) | 7.13:1 |
| `--warning` | `#92400E` (texto) / `#FEF3C7` (fondo suave) | 7.09:1 |
| `--danger` | `#B3261E` (se mantiene, ya funciona) / `#FDECEA` (fondo suave) | 6.54:1 |
| `--info` | reutiliza `--action` / `#EEF2FF` (fondo suave) | 6.29:1 |

Cada uno con su "fondo suave" a juego (para chips/alertas), igual que ya existe `--accent-suave` hoy — ese patrón sí es correcto y se mantiene.

## 9. Hover / focus / disabled

- **Hover**: `opacity: 0.9` en superficies de color; en superficies neutras, cambio a `--border` más oscuro. Sin transformaciones de escala/elevación innecesarias — un hover debe notarse, no "bailar".
- **Focus**: anillo visible de 2px en `--action` con 2px de separación (`box-shadow: 0 0 0 2px #fff, 0 0 0 4px var(--action)`), no solo un cambio de borde de 1px. Se aplica a inputs, botones y enlaces por igual — hoy solo existe (débil) en inputs.
- **Disabled**: opacidad 0.5 + `cursor: not-allowed`, sin color de marca (para que nunca se confunda un botón inactivo con uno activo).

## 10. Dark mode

**No se recomienda por ahora.** El público de Emprenia (autónomos revisando su negocio desde el móvil, a menudo en exteriores/con luz de sol) se beneficia más de un modo claro con buen contraste que de un modo oscuro — y añadir un segundo tema completo antes de tener el sistema claro consolidado multiplicaría el trabajo de mantenimiento sin una necesidad clara del usuario real. Se puede revisar más adelante si aparece demanda.

## Tipografía

Se mantiene **Inter** — es una elección correcta ya hecha, sin motivo para cambiarla. Lo que falta es la escala. Propuesta (line-height incluido):

| Rol | Tamaño | Peso | Line-height | Uso |
|---|---|---|---|---|
| Display | 1.75rem (28px) | 700 | 1.25 | Título de página (raro, 1 por pantalla) |
| Título | 1.25rem (20px) | 700 | 1.3 | Encabezado de sección, nombre de negocio |
| Subtítulo | 1rem (16px) | 600 | 1.4 | Subsecciones |
| Body | 0.9375rem (15px) | 400 | 1.55 | Texto de lectura general |
| Body pequeño | 0.8125rem (13px) | 400 | 1.5 | Descripciones secundarias, metadatos |
| Label | 0.75rem (12px) | 600, mayúsculas, +0.04em | 1.3 | Etiquetas de sección, campos de formulario |
| Botón | 0.875rem (14px) | 600 | 1 | Texto de botones |
| Caption | 0.6875rem (11px) | 500 | 1.3 | Notas al pie, ayuda de campo |
| Precio/número | 0.9375rem (15px) | 700, tabular-nums | 1.2 | Cifras — números siempre alineados en tablas |

8 tamaños en total (frente a los 26 actuales). Cualquier necesidad nueva se resuelve eligiendo uno de estos ocho, no inventando un noveno.

## Espaciado, radio y sombra

**Escala de espaciado** (múltiplos de 4px, la base casi universal en sistemas de diseño de producto):
`4 · 8 · 12 · 16 · 24 · 32 · 48 · 64px`

**Radio**: dos valores, no ocho.
- `--radius-sm: 8px` — botones, inputs, chips.
- `--radius-md: 12px` — tarjetas, modales.
(Los círculos de icono/avatar siguen usando `50%`, eso no es un "radio" en el mismo sentido y no necesita escala.)

**Sombra**: un único par, para no volver a acumular variantes.
- `--shadow-sm: 0 1px 2px rgba(20, 22, 30, 0.04)` — reposo de tarjeta.
- `--shadow-md: 0 4px 12px rgba(20, 22, 30, 0.08)` — elevado (modal, dropdown, hover de tarjeta clicable).

**Contenedor**: se mantiene `max-width: 480px` para el panel (es coherente con un producto de uso mayoritariamente móvil), pero se documenta como decisión consciente, no como límite heredado sin revisar — ver siguiente sección para dónde sí cambia.

## Breakpoints

`480 · 640 · 900 · 1200px` — los tres ya en uso (640/900/960 → se unifica 960 a 900) más uno nuevo en 1200px para pantallas de escritorio grandes, donde tendría sentido que el panel deje de comportarse como una columna móvil ensanchada y aproveche el espacio lateral (ver siguiente punto).

## Componentes: qué cambia primero

Por prioridad de impacto/esfuerzo, para cuando se apruebe la fase de implementación:

1. **Tokens globales** (`:root` en `globals.css`) — un solo sitio, desbloquea todo lo demás.
2. **Tipografía** — aplicar la escala de 8 tamaños sobre las clases existentes.
3. **Botones** — consolidar a 4: Primary (relleno `--action`), Secondary (borde, sin relleno), Ghost (sin borde, para acciones terciarias como "cancelar"), Danger (relleno `--danger`, solo para acciones destructivas). Las 4 variantes "pill" actuales se mapean a estas 4, sin renombrar lo que ya usan las páginas — solo cambia el estilo detrás de cada clase.
4. **Formularios** — foco visible nuevo, mismos campos.
5. **Tarjetas** — radio y sombra unificados.
6. **Navegación** — mantener el drawer para móvil; evaluar (fase de implementación, con tu aprobación explícita antes de tocarlo) una barra lateral fija a partir de 900px, ya que es donde más se nota hoy que la app "no se siente de escritorio".
7. **Portfolio público** — aplicar el mismo sistema de tokens (sin paleta propia), dejando que la personalidad venga solo de foto/logo/contenido del negocio, como se documenta en la auditoría.
8. **Resto del panel** (`clientes`, `suscripcion`, `editar`) — última fase, mismo sistema ya validado en las pantallas anteriores.

## Criterio de "terminado"

Una pantalla está lista cuando, mirándola, la respuesta a "¿esto podría ser una empresa de software seria con miles de clientes?" es sí — y cuando esa respuesta viene de la claridad y la consistencia, no de un elemento decorativo puntual. Si una pantalla necesita un color más para verse "acabada", es una señal de que falta jerarquía, no de que falte color.

## Qué se pide aprobar

- La paleta de la sección 1–8 (colores exactos).
- La escala tipográfica de 8 tamaños.
- La escala de espaciado de 4px y los dos radios.
- El orden de implementación de la sección "Componentes: qué cambia primero".

Con eso aprobado, el siguiente documento (`docs/design-system.md`) traduce todo esto a tokens de CSS listos para implementar, y solo entonces se empieza a tocar código.
