'use client'

import { useState } from 'react'
import estilos from './landing.module.css'

export const PREGUNTAS = [
  {
    pregunta: 'No tengo tiempo para esto.',
    respuesta:
      'Lo pensamos justo para eso: subes 2 o 3 fotos, escribes qué ofreces, y tu página está lista en minutos. La gestionas tú, cuando puedas, sin depender de nadie más.',
  },
  {
    pregunta: 'No entiendo de tecnología.',
    respuesta:
      'Emprenia está pensada exactamente para ti: si sabes escribir por WhatsApp, ya sabes usar Emprenia. Nada técnico, nada que aprender de más.',
  },
  {
    pregunta: 'Ya tengo Instagram, ¿para qué quiero esto?',
    respuesta:
      'Tu Instagram es para que te descubran. Emprenia es tu espacio propio: decides qué mostrar y qué preguntarle a cada cliente, y te escriben directo por WhatsApp con lo que necesitas saber — sin que se pierdan entre publicaciones.',
  },
  {
    pregunta: '¿Esto es lo mismo que tener una página web?',
    respuesta:
      'Parecido, pero con una diferencia importante: una web muestra información. Con Emprenia además editas tú mismo tus servicios, fotos y precios cuando quieras, decides qué preguntarle a cada cliente, y cada solicitud te llega ya organizada — sin depender de un programador para cambiar nada.',
  },
  {
    pregunta: '¿Y si no me funciona?',
    respuesta: 'Por eso tienes 7 días de prueba gratis, sin compromiso. Lo pruebas con calma y, si no es para ti, lo dejas sin más.',
  },
  {
    pregunta: 'No tengo tarjeta.',
    respuesta: 'No hace falta — también puedes pagar por transferencia o domiciliación bancaria, sin necesidad de tarjeta.',
  },
  {
    pregunta: '¿Puedo cancelar cuando quiera?',
    respuesta: 'Sí. Sin permanencia ni letra pequeña: cancelas desde tu propio panel cuando quieras y dejas de pagar en ese momento.',
  },
  {
    pregunta: '¿Esto me va a conseguir clientes?',
    respuesta:
      'Eso siempre depende de ti — no te lo prometemos. Lo que hace Emprenia es ponértelo fácil: que te encuentren, que sepan qué ofreces, y que lleguen a ti ya con la información que necesitas para poder atenderlos.',
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
