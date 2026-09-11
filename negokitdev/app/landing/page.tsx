import type { Metadata } from 'next'
import QRCode from 'qrcode'
import LogoServix from '@/components/LogoServix'
import { PLAN_PRECIO } from '@/lib/config'
import FaqAcordeon from './FaqAcordeon'
import estilos from './landing.module.css'

export const metadata: Metadata = {
  title: 'Emprenia — Comparte tu página, que te escriban por WhatsApp',
  description:
    'Tu propia página, con tus fotos y tus servicios. La compartes con tu enlace o tu QR, y quien la vea te escribe directo por WhatsApp. Sin páginas complicadas ni nada que aprender.',
}

const DOMINIO_DEMO = 'https://emprenia.com'

/* ---------------------------------------------------------------- */
/* Iconos (trazo simple, mismo estilo en toda la página)             */
/* ---------------------------------------------------------------- */

function IconoWhatsapp(props: { width?: number; height?: number }) {
  return (
    <svg width={props.width ?? 16} height={props.height ?? 16} viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413" />
    </svg>
  )
}

function IconoFlecha() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </svg>
  )
}

function IconoFoto() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <circle cx="9" cy="11" r="2" />
      <path d="M21 16l-4.5-4.5a1.5 1.5 0 0 0-2.1 0L7 19" />
    </svg>
  )
}

function IconoQr() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
      <path d="M14 14h3v3M20 14v.01M14 20h3M20 20v.01" />
    </svg>
  )
}

function IconoChat() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
    </svg>
  )
}

function IconoRayo() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  )
}

function IconoSubir() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="17 8 12 3 7 8" />
      <line x1="12" y1="3" x2="12" y2="15" />
    </svg>
  )
}

function IconoCompartir() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="18" cy="5" r="3" />
      <circle cx="6" cy="12" r="3" />
      <circle cx="18" cy="19" r="3" />
      <line x1="8.6" y1="10.5" x2="15.4" y2="6.5" />
      <line x1="8.6" y1="13.5" x2="15.4" y2="17.5" />
    </svg>
  )
}

function IconoCheck() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  )
}

function IconoEstetica() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3v3M12 18v3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M3 12h3M18 12h3M5.6 18.4l2.1-2.1M16.3 7.7l2.1-2.1" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  )
}

function IconoReformas() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.4-3.4a4 4 0 0 1-4.8 4.8L7 19l-3-3 8.3-8.3a4 4 0 0 1 4.8-4.8l-3.4 3.4z" />
    </svg>
  )
}

function IconoJardineria() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22V13" />
      <path d="M12 13C12 8 8 6 4 6c0 4.5 3 7 8 7z" />
      <path d="M12 13c0-3.5 2.5-5.5 6-5.5 0 3.6-2.4 5.5-6 5.5z" />
    </svg>
  )
}

function IconoFotografia() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 7h3l1.5-2h7L17 7h3a1 1 0 0 1 1 1v11a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V8a1 1 0 0 1 1-1z" />
      <circle cx="12" cy="13" r="3.5" />
    </svg>
  )
}

function IconoLimpieza() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 2v4M9 6l-3 3v11a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V9l-3-3" />
      <path d="M6 13h6" />
    </svg>
  )
}

function IconoPeluqueria() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="6" cy="6" r="3" />
      <circle cx="6" cy="18" r="3" />
      <line x1="20" y1="4" x2="8.1" y2="15.9" />
      <line x1="14.5" y1="14.5" x2="20" y2="20" />
      <line x1="8.1" y1="8.1" x2="10" y2="10" />
    </svg>
  )
}

function IconoEntrenador() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6.5 6.5l11 11M4 8l4-4 2 2-4 4-2-2zM14 18l4-4 2 2-4 4-2-2zM2 12l2-2M20 22l2-2" />
    </svg>
  )
}

function IconoMas2() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  )
}

function IconoHojaMini() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="#fff">
      <path d="M20 4C10 4 4 10 4 18c0 1.1.9 2 2 2 8 0 14-6 14-16 0-.5-.4-1-1-1zM6 20c2-6 6-9 12-11-2 7-6 11-12 11z" />
    </svg>
  )
}

function IconoGotaMini() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="#fff">
      <path d="M12 2s7 8.5 7 13a7 7 0 0 1-14 0c0-4.5 7-13 7-13z" />
    </svg>
  )
}

function IconoTijeraMini() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="6" cy="6" r="2.4" />
      <circle cx="6" cy="18" r="2.4" />
      <line x1="19" y1="4" x2="8" y2="15" />
      <line x1="13.5" y1="13.5" x2="19" y2="19" />
      <line x1="8" y1="9" x2="9.5" y2="10.5" />
    </svg>
  )
}

/* ---------------------------------------------------------------- */

const CARACTERISTICAS = [
  { titulo: 'Tu página, con tus fotos y servicios', Icono: IconoFoto },
  { titulo: 'Código QR permanente', Icono: IconoQr },
  { titulo: 'Contacto directo por WhatsApp', Icono: IconoChat },
  { titulo: 'Cero cosas técnicas que aprender', Icono: IconoRayo },
]

const PASOS = [
  {
    titulo: 'Subes tus fotos y tus servicios',
    texto: 'Tú mismo, en un par de minutos, desde el móvil o el ordenador. No hace falta que sepas nada de webs.',
    Icono: IconoSubir,
  },
  {
    titulo: 'La compartes',
    texto: 'Con tu enlace o tu código QR: en tarjetas, tu furgoneta, tu escaparate, donde quieras.',
    Icono: IconoCompartir,
  },
  {
    titulo: 'Te escriben por WhatsApp',
    texto: 'Quien la vea puede escribirte con un toque, sin buscarte entre publicaciones ni rellenar formularios raros.',
    Icono: IconoWhatsapp,
  },
]

const RUBROS = [
  {
    nombre: 'Estética',
    Icono: IconoEstetica,
    foto: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=240&q=85',
  },
  {
    nombre: 'Reformas',
    Icono: IconoReformas,
    foto: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=240&q=85',
  },
  {
    nombre: 'Jardinería',
    Icono: IconoJardineria,
    foto: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&w=240&q=85',
  },
  {
    nombre: 'Fotografía',
    Icono: IconoFotografia,
    foto: 'https://images.unsplash.com/photo-1452780212940-6f5c0d14d848?auto=format&fit=crop&w=240&q=85',
  },
  {
    nombre: 'Limpieza',
    Icono: IconoLimpieza,
    foto: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=240&q=85',
  },
  {
    nombre: 'Peluquería',
    Icono: IconoPeluqueria,
    foto: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=240&q=85',
  },
  {
    nombre: 'Entrenador',
    Icono: IconoEntrenador,
    foto: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=240&q=85',
  },
  {
    nombre: 'Y más…',
    Icono: IconoMas2,
    foto: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=240&q=85',
  },
]

const SERVICIOS_DEMO = [
  {
    nombre: 'Diseño de jardines',
    corto: 'Diseño de jardines',
    foto: 'https://images.unsplash.com/photo-1558904541-efa843a96f01?auto=format&fit=crop&w=280&q=85',
    Icono: IconoHojaMini,
  },
  {
    nombre: 'Mantenimiento mensual',
    corto: 'Mantenimiento',
    foto: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&w=280&q=85',
    Icono: IconoGotaMini,
  },
  {
    nombre: 'Poda y riego',
    corto: 'Poda y riego',
    foto: 'https://images.unsplash.com/photo-1599685315640-9ceab2f581ca?auto=format&fit=crop&w=280&q=85',
    Icono: IconoTijeraMini,
  },
]

const NAV = [
  { href: '#como-funciona', texto: 'Cómo funciona' },
  { href: '#ejemplos', texto: 'Ejemplos' },
  { href: '#precio', texto: 'Precios' },
  { href: '#faq', texto: 'Preguntas frecuentes' },
]

export default async function LandingPage() {
  const qrDataUrl = await QRCode.toDataURL(DOMINIO_DEMO, { width: 200, margin: 1 })

  return (
    <div className={estilos.pagina}>
      {/* ---- Cabecera ---- */}
      <header className={estilos.cabecera}>
        <div className={estilos.cabeceraFila}>
          <a href="#inicio" className={estilos.cabeceraLogo}>
            <LogoServix tamano={30} />
          </a>
          <nav className={estilos.cabeceraNav}>
            {NAV.map((item) => (
              <a key={item.href} href={item.href}>
                {item.texto}
              </a>
            ))}
          </nav>
          <div className={estilos.cabeceraAcciones}>
            <a href="/login" className={estilos.botonLogin}>
              Iniciar sesión
            </a>
            <a href="/registro" className={estilos.botonHeader}>
              Crear mi página <IconoFlecha />
            </a>
          </div>
        </div>
      </header>

      {/* ---- Hero ---- */}
      <section className={estilos.hero} id="inicio">
        <div className={estilos.ancho}>
          <div className={estilos.heroGrid}>
            <div>
              <p className={estilos.heroEyebrow}>¿CUÁNTOS CLIENTES SE TE HAN IDO A LA COMPETENCIA ESTA SEMANA?</p>
              <h1 className={estilos.heroTitulo}>
                Comparte tu página.
                <strong>Que te escriban al momento.</strong>
              </h1>
              <p className={estilos.heroSubtitulo}>
                Tu propia página, con tus fotos y tus servicios. La compartes con tu enlace o tu código QR — en
                tarjetas, tu furgoneta, tu escaparate — y quien la vea te escribe directo por WhatsApp, sin páginas
                complicadas ni nada que aprender.
              </p>
              <a href="/registro" className={estilos.heroCta}>
                Crear mi página gratis <IconoFlecha />
              </a>
              <p className={estilos.heroNota}>7 días gratis · Sin permanencia · Cancelas cuando quieras</p>
            </div>

            <div className={estilos.heroVisual}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/landing/jardines-mobile.png"
                alt="Ejemplo móvil de Jardines Verdes en Emprenia"
                style={{
                  display: 'block',
                  width: 'min(100%, 360px)',
                  height: 'auto',
                  margin: '0 auto',
                  filter: 'drop-shadow(0 30px 60px rgba(20, 20, 30, 0.20))',
                }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* ---- ¿Te suena? ---- */}
      <section className={estilos.dolor}>
        <div className={estilos.ancho}>
          <div className={estilos.dolorGrid}>
            <div>
              <h2 className={estilos.dolorTitulo}>¿Te suena?</h2>
              <p className={estilos.dolorTexto}>
                &ldquo;Te vieron en Instagram, les gustó, y al final no te escribieron porque no encontraron cómo.&rdquo;
                Con Emprenia eso no pasa: hay un botón para escribirte, siempre a la vista.
              </p>
              <div className={estilos.mensajesGrid}>
                <div className={estilos.mensajeTarjeta}>
                  <p>&ldquo;¿Tienes web o Instagram?&rdquo;</p>
                  <span>Cliente potencial, hace 2 días</span>
                </div>
                <div className={estilos.mensajeTarjeta}>
                  <p>&ldquo;No te encontré, al final llamé a otro.&rdquo;</p>
                  <span>Cliente perdido, la semana pasada</span>
                </div>
                <div className={estilos.mensajeTarjeta}>
                  <p>&ldquo;¿Cuánto cuesta? No vi precios.&rdquo;</p>
                  <span>Duda sin resolver, ayer</span>
                </div>
                <div className={estilos.mensajeTarjeta}>
                  <p>&ldquo;Vi tu perfil pero no sabía si seguías activo.&rdquo;</p>
                  <span>Cliente indeciso, hoy</span>
                </div>
              </div>
            </div>
            <div>
              <div className={estilos.dolorIlustracion}>
                <div className={estilos.burbujasIlustracion}>
                  <IconoChat />
                </div>
              </div>
              <p className={estilos.dolorNota}>Cada duda sin resolver es un cliente que se va a otro.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ---- Franja oscura de características ---- */}
      <section className={estilos.caracteristicas} id="como-funciona">
        <div className={estilos.ancho}>
          <div className={estilos.caracteristicasGrid}>
            <div>
              <p className={estilos.caracteristicasEyebrow}>QUÉ INCLUYE</p>
              <h2 className={estilos.caracteristicasTitulo}>
                Todo lo que necesitas.
                <strong>Nada de más.</strong>
              </h2>
              <p className={estilos.caracteristicasTexto}>
                Una página que se ve profesional desde el primer minuto, aunque nunca hayas tenido una web.
              </p>
            </div>
            <div className={estilos.caracteristicasRejilla}>
              {CARACTERISTICAS.map(({ titulo, Icono }) => (
                <div key={titulo} className={estilos.caracteristicaTarjeta}>
                  <Icono />
                  <p>{titulo}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ---- Showcase ---- */}
      <section className={estilos.showcase} id="ejemplos">
        <div className={estilos.ancho}>
          <div className={estilos.showcaseGrid}>
            <div className={estilos.mockups}>
              <picture style={{ display: 'block', width: '100%' }}>
                <source
                  media="(max-width: 699px)"
                  srcSet="/landing/jardines-mobile.png"
                />
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/landing/jardines-desktop.png"
                  alt="Ejemplo de página profesional de Jardines Verdes creada con Emprenia"
                  style={{
                    display: 'block',
                    width: '100%',
                    height: 'auto',
                    borderRadius: '24px',
                    boxShadow: '0 24px 60px rgba(20, 20, 30, 0.12)',
                  }}
                />
              </picture>
            </div>

            <div className={estilos.rubros}>
              <p className={estilos.rubrosTitulo}>Da igual a qué te dediques</p>
              <div className={estilos.rubrosRejilla}>
                {RUBROS.map(({ nombre, Icono, foto }) => (
                  <div key={nombre} className={estilos.rubro}>
                    <span
                      className={estilos.rubroIcono}
                      style={{ backgroundImage: `url(${foto})` }}
                    >
                      <span className={estilos.rubroIconoBadge}>
                        <Icono />
                      </span>
                    </span>
                    <span>{nombre}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---- 3 pasos ---- */}
      <section className={estilos.pasos}>
        <div className={estilos.ancho}>
          <div className={estilos.pasosCabecera}>
            <h2 className={estilos.pasosTitulo}>Empieza en 3 pasos</h2>
            <div className={estilos.pasosCta}>
              <a href="/registro" className={estilos.heroCta}>
                Crear mi página gratis <IconoFlecha />
              </a>
              <span className={estilos.pasosCtaNota}>7 días gratis, sin tarjeta obligatoria</span>
            </div>
          </div>
          <div className={estilos.pasosRejilla}>
            {PASOS.map(({ titulo, texto, Icono }) => (
              <div key={titulo} className={estilos.pasoItem}>
                <span className={estilos.pasoIcono}>
                  <Icono />
                </span>
                <strong>{titulo}</strong>
                <p>{texto}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---- Precio ---- */}
      <section className={estilos.precio} id="precio">
        <div className={estilos.ancho}>
          <div className={estilos.precioGrid}>
            <div>
              <p className={estilos.heroEyebrow}>SIN SORPRESAS</p>
              <h2 className={estilos.precioTitulo}>Un precio claro, y no cambia.</h2>
              <p className={estilos.precioTexto}>
                Esto es lo que pagas por tu página, y no sube mientras sigas con nosotros. 7 días de prueba gratis.
                Cancela cuando quieras, sin permanencia.
              </p>
            </div>

            <div className={estilos.precioTarjeta}>
              <p className={estilos.precioTarjetaNombre}>Emprenia — Portfolio comercial</p>
              <p className={estilos.precioNumero}>
                <strong>{PLAN_PRECIO.split('/')[0]}</strong>
                <span>/{PLAN_PRECIO.split('/')[1] ?? 'mes'}</span>
              </p>
              <ul className={estilos.precioLista}>
                <li>
                  <IconoCheck /> Tu página con fotos y servicios
                </li>
                <li>
                  <IconoCheck /> Código QR permanente
                </li>
                <li>
                  <IconoCheck /> Contacto directo por WhatsApp
                </li>
                <li>
                  <IconoCheck /> 7 días de prueba gratis
                </li>
                <li>
                  <IconoCheck /> Sin permanencia
                </li>
              </ul>
              <a href="/registro" className={estilos.precioCta}>
                Quiero mi página <IconoFlecha />
              </a>
            </div>

            <div className={estilos.precioBanda}>
              <p>¿Quieres algo a medida — una web propia o flyers para imprimir?</p>
              <a href="/registro" className={estilos.botonLogin} style={{ display: 'inline-flex' }}>
                Hablamos al crear tu cuenta
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ---- FAQ ---- */}
      <section className={estilos.faq} id="faq">
        <div className={estilos.ancho}>
          <div className={estilos.faqGrid}>
            <div>
              <p className={estilos.heroEyebrow}>LAS DUDAS QUE SEGURO TIENES</p>
              <h2 className={estilos.faqTitulo}>Te leemos la mente un momento.</h2>
            </div>
            <FaqAcordeon />
          </div>
        </div>
      </section>

      {/* ---- Footer ---- */}
      <footer className={estilos.pie}>
        <div className={estilos.ancho}>
          <div className={estilos.pieGrid}>
            <div className={estilos.pieMarca}>
              <LogoServix tamano={28} claro />
              <p>Comparte tu enlace o tu QR, y que tus clientes te escriban directo por WhatsApp.</p>
            </div>

            <div className={estilos.pieColumnas}>
              <div className={estilos.pieColumna}>
                <p>Navegación</p>
                <ul>
                  <li>
                    <a href="#inicio">Inicio</a>
                  </li>
                  <li>
                    <a href="#como-funciona">Cómo funciona</a>
                  </li>
                  <li>
                    <a href="#ejemplos">Ejemplos</a>
                  </li>
                  <li>
                    <a href="#precio">Precios</a>
                  </li>
                  <li>
                    <a href="#faq">Preguntas frecuentes</a>
                  </li>
                </ul>
              </div>
              <div className={estilos.pieColumna}>
                <p>Legal</p>
                <ul>
                  <li>
                    <a href="/terminos">Términos y condiciones</a>
                  </li>
                  <li>
                    <a href="/privacidad">Privacidad</a>
                  </li>
                  <li>
                    <a href="/cookies">Cookies</a>
                  </li>
                </ul>
              </div>
            </div>

            <div className={estilos.pieCta}>
              <p className={estilos.pieCtaEyebrow}>¿EMPEZAMOS?</p>
              <h3>Crea tu página hoy</h3>
              <p>7 días gratis, sin permanencia.</p>
              <a href="/registro" className={estilos.pieCtaBoton}>
                Crear mi página <IconoFlecha />
              </a>
            </div>
          </div>

          <div className={estilos.pieAbajo}>
            <span>© {new Date().getFullYear()} Emprenia. Todos los derechos reservados.</span>
            <span>
              ¿Ya tienes tu página?{' '}
              <a href="/login" style={{ color: 'rgba(255,255,255,0.68)' }}>
                Inicia sesión →
              </a>
            </span>
          </div>
        </div>
      </footer>
    </div>
  )
}