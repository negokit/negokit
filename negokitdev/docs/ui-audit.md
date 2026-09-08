# Auditoría de interfaz — Emprenia

Fecha: revisión completa del código fuente actual (Next.js 16 / App Router, CSS propio sobre Tailwind sin usar).
Alcance: `app/`, `components/`, `lib/` — 24 archivos de interfaz, `app/globals.css` (1484 líneas).

No se ha tocado ningún archivo de código en esta fase. Este documento es solo diagnóstico.

## 1. Resumen ejecutivo

El producto funciona y la lógica de negocio (reservas, leads, WhatsApp, Stripe, autenticación) está bien resuelta. El problema no es funcional, es que **el sistema visual se ha ido construyendo componente a componente, sin una capa de decisiones compartida por debajo**. Cada pantalla define sus propios tamaños de letra, colores, radios y sombras "a ojo". El resultado es una app que funciona pero no se lee como un producto único y maduro — cada pantalla parece diseñada un día distinto, porque literalmente fue así.

Esto es exactamente lo esperable en un producto que ha crecido a base de peticiones puntuales ("cambia este botón", "pon esto en negrita") sin una fase de sistema. No es un fallo de ejecución, es la ausencia de un design system.

## 2. Lo que sí funciona hoy (no se toca sin necesidad)

- Estructura de datos y flujos: reservas, servicios, leads, suscripción — sólidos.
- El patrón "todo por WhatsApp" está bien resuelto técnicamente (`wa.me`, mensajes pre-rellenados, `location.href` en vez de `_blank` para no romper el botón atrás dentro de apps embebidas).
- Validaciones de formularios ya centralizadas en `lib/validaciones.ts` — es exactamente el sitio correcto, solo hay que ampliar el criterio de qué se valida, no moverlo de sitio.
- El límite de 16px en inputs para evitar el zoom automático de Safari en iPhone ya está aplicado — un detalle que mucha gente se salta.
- Mobile-first como enfoque de base: la mayoría de pantallas ya parten de una columna de 480px máximo, lo cual es razonable para un panel usado sobre todo desde el móvil.

## 3. Inventario de páginas y componentes

| Área | Archivos | Estado |
|---|---|---|
| Landing pública | `app/landing/page.tsx` | Rediseñada parcialmente esta semana (hero, CTA) |
| Auth | `app/login`, `app/registro`, `components/AuthLayout.tsx` | Comparten `AuthLayout`, consistentes entre sí |
| Panel privado | `app/panel/page.tsx` (429 líneas), `clientes`, `editar`, `suscripcion` | Cada uno define secciones propias, sin componentes de tarjeta/lista reutilizados de forma estricta |
| Navegación | `app/panel/MenuPanel.tsx` | Un único patrón: drawer + botón hamburguesa, igual en móvil que en escritorio |
| Página pública del negocio | `app/[slug]/PaginaPublicaClient.tsx` + `pagina-publica.module.css` | Rediseñada dos veces esta semana; ver sección 9 |
| Legales | `cookies`, `privacidad`, `terminos` | Texto plano sobre `.contenedor`, sin problemas relevantes |
| Componentes compartidos | `AvatarNegocio`, `LogoServix`, `AvisoCookies` | Usados de forma consistente, sin duplicados |

## 4. Color: exceso de tokens ad-hoc y bajo contraste

`:root` define solo 7 variables de color. El resto del archivo usa **10 colores hexadecimales sueltos** fuera de esas variables (`#25D366`, `#FFFFFF`, `#B3261E`, `#5B6472`, `#2F5FD6`, etc.), algunos duplicando lo que ya existe como variable. Esto significa que cambiar "el azul de marca" hoy requiere buscar y sustituir a mano, con riesgo real de dejar restos del color antiguo — es justo lo que ha costado tiempo esta misma semana.

**Problema medido de accesibilidad**: `--muted: #8a8a99` (el gris usado en subtítulos, descripciones, metadatos — probablemente el color de texto más usado del sitio después del principal) da un contraste de **3.25:1 sobre el fondo y 3.40:1 sobre las tarjetas blancas**. El mínimo exigido por WCAG AA para texto normal es 4.5:1. Ahora mismo, buena parte del texto secundario de la app no cumple el estándar mínimo de accesibilidad — no es un matiz de gusto, es un número que falla.

**Problema de intensidad**: el azul de marca (`--accent`) se ha usado esta semana como fondo sólido de bloques grandes (tarjeta de cierre, avatar, insignias, botones de acción, barra de contacto). Un color de acento funciona como acento cuando aparece en pocos sitios con intención — en cuanto cubre media pantalla dos veces distintas dentro del mismo scroll, deja de leerse como "marca" y empieza a leerse como "ruido".

## 5. Tipografía: una sola familia sin escala

Todo el sitio usa Inter (correcto, es una fuente sólida para producto). El problema es que no existe una escala: contando solo `globals.css` aparecen **26 valores distintos de `font-size`** (de 0.68rem a 2.5rem), muchos separados por diferencias de una centésima de rem sin ningún criterio (`0.85rem`, `0.86rem`, `0.88rem`, `0.9rem`, `0.92rem` conviven sin que quede claro por qué cada uno es ese y no el de al lado). Sin una escala nombrada, cada pantalla nueva añade un tamaño más en vez de reutilizar uno que ya existe.

## 6. Espaciado, radios y sombras: mismos síntomas

- **Border-radius**: 8 valores distintos en uso (`2px, 4px, 8px, 12px, 14px, 16px, 20px, 999px`), sin que la elección entre uno u otro responda a una regla (¿por qué una tarjeta es 14px y otra 16px?).
- **Sombras**: 5 combinaciones de color distintas para sombra (`rgba(20,20,30,·)`, `rgba(28,28,39,·)`, `rgba(15,15,22,·)`, `rgba(0,0,0,·)`, más las de foco en blanco), cada una con su propia opacidad y desenfoque ajustados a mano por componente.
- **Padding/márgenes**: 52 líneas con `padding` en `globals.css`, con valores como `1.25rem`, `1.4rem`, `1.5rem`, `1.6rem` usados de forma intercambiable sin que se pueda predecir cuál toca en cada caso.

Ninguno de estos tres puntos es grave por separado. Juntos son la razón técnica exacta de por qué "cada pantalla se siente un poco distinta" aunque a simple vista compartan colores.

## 7. Accesibilidad

- **Contraste**: ver punto 4 — el texto secundario falla AA en todo el sitio.
- **Foco visible**: los campos de formulario quitan el `outline` del navegador y lo sustituyen solo por un cambio de color de borde de 1px (`border-color: var(--accent)`). Es un indicador de foco débil — poca gente que navegue con teclado lo va a detectar con claridad. Los botones, en cambio, sí conservan el foco por defecto del navegador (correcto, no tocar).
- **Tailwind cargado pero sin usar**: `globals.css` importa `@import "tailwindcss"` pero no hay ni una sola clase de utilidad de Tailwind en las 24 páginas/componentes revisados — todo el peso de esa librería viaja al navegador sin aportar nada. Es limpieza técnica, no visual, pero vale la pena resolverlo en la misma pasada.
- **Objetivos táctiles**: los botones circulares de icono (compartir, redes sociales) miden 32-34px — por debajo de los 44px que recomienda Apple/WCAG para un target táctil cómodo. En escritorio no es un problema; en el móvil, que es el uso principal de esta app, sí lo es.

## 8. Navegación y responsive

El panel usa un único patrón — menú de hamburguesa + drawer lateral — **igual en un móvil de 375px que en un monitor de escritorio**. Es una decisión razonable cuando el 90% del uso es móvil (como parece ser el caso aquí), pero significa que en escritorio se desperdicia todo el espacio lateral que un SaaS al estilo de los mencionados (Stripe, Linear, Notion) normalmente ocupa con una barra de navegación fija siempre visible. No es un error, es una limitación a decidir conscientemente: ¿merece la pena una segunda disposición para escritorio, dado quién usa realmente Emprenia y desde dónde?

## 9. El caso concreto de esta semana: la página pública del negocio

Vale la pena documentar esto porque es un ejemplo perfecto del problema de fondo. La página pública (`/[slug]`) se ha rediseñado dos veces en los últimos mensajes:
1. Primero copiando el color y estructura literal de una foto de referencia (crema + naranja) — quedó bonita pero **desconectada de la marca real de Emprenia**, y demasiado atada a una estética "boutique de estética" concreta.
2. Después metiendo el azul de marca a bloques grandes (igual que el resto de la app) — quedó consistente pero **demasiado cargada de color para una plantilla que debe servir igual a un fontanero que a una esteticista**.

La lección, que ya recoge la dirección visual propuesta en el documento siguiente: **el portfolio público no debería tener personalidad visual propia**. La personalidad la pone el negocio (sus fotos, su logo, su texto). El sistema de Emprenia debajo tiene que ser neutro, silencioso y perfectamente intercambiable entre oficios — ni "de estética" ni "de reformas", solo profesional.

## 10. Duplicación de componentes

- Existen tres variantes de botón "pill" en `globals.css` (`.boton-pill`, `.boton-pill-claro`, `.boton-pill-outline`) más una cuarta variante inline solo para el WhatsApp verde (`.boton-pill-whatsapp`) — sin que quede documentado en ningún sitio cuál usar en qué caso. En la práctica, cada pantalla nueva decide por su cuenta.
- Las insignias de confianza (`.etiqueta`) y los badges nuevos de la página pública (`.badge`) son visualmente casi idénticos pero están definidos por separado en dos hojas de estilos distintas.

## Siguiente paso

Todo lo anterior alimenta la propuesta de dirección visual en `docs/design-direction.md`. Nada se implementa hasta que esa dirección esté aprobada.
