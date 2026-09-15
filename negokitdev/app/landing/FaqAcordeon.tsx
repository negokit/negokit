'use client'

import { useState } from 'react'
import estilos from './landing.module.css'
import { PREGUNTAS } from './faqData'

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
