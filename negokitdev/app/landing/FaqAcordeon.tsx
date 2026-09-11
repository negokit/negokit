'use client'

import { useState } from 'react'
import estilos from './landing.module.css'

const PREGUNTAS = [
  {
    pregunta: 'No tengo tiempo para esto.',
    respuesta: 'No hace falta tiempo: subes 2-3 fotos y escribes qué ofreces. En minutos tu página está lista.',
  },
  {
    pregunta: 'No entiendo de tecnología.',
    respuesta: 'No hace falta que entiendas nada. Si sabes escribir por WhatsApp, ya sabes usar Emprenia.',
  },
  {
    pregunta: 'Ya tengo Instagram, ¿para qué quiero esto?',
    respuesta:
      'Tu Instagram es para que te vean. Emprenia es para que, cuando compartas tu enlace, te escriban directo a tu WhatsApp con un toque, sin que tengan que buscarte entre publicaciones.',
  },
  {
    pregunta: '¿Y si no me funciona?',
    respuesta: 'Por eso hay 7 días de prueba gratis, sin compromiso. Si no te aporta nada, lo dejas y no pasa nada.',
  },
  {
    pregunta: 'No tengo tarjeta.',
    respuesta: 'No pasa nada — también puedes pagar con tu cuenta bancaria (domiciliación), sin necesidad de tarjeta.',
  },
  {
    pregunta: '¿Puedo cancelar cuando quiera?',
    respuesta: 'Sí, sin permanencia ni letra pequeña. Cancelas desde tu panel cuando quieras y dejas de pagar.',
  },
]

function IconoMas({ abierto }: { abierto: boolean }) {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.4"
      strokeLinecap="round"
      style={{ transform: abierto ? 'rotate(45deg)' : 'none', transition: 'transform 0.2s ease', flexShrink: 0 }}
    >
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  )
}

export default function FaqAcordeon() {
  const [abierta, setAbierta] = useState<number | null>(0)

  return (
    <div className={estilos.faqLista}>
      {PREGUNTAS.map((item, i) => {
        const abierto = abierta === i
        return (
          <div key={item.pregunta} className={`${estilos.faqItem} ${abierto ? estilos.faqItemAbierto : ''}`}>
            <button
              type="button"
              className={estilos.faqPregunta}
              onClick={() => setAbierta(abierto ? null : i)}
              aria-expanded={abierto}
            >
              <span>{item.pregunta}</span>
              <span className={estilos.faqIconoToggle}>
                <IconoMas abierto={abierto} />
              </span>
            </button>
            <div className={`${estilos.faqRespuestaFila} ${abierto ? estilos.faqRespuestaFilaAbierta : ''}`}>
              <div className={estilos.faqRespuestaInner}>
                <p className={estilos.faqRespuesta}>{item.respuesta}</p>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
