// Datos de las preguntas frecuentes, separados de FaqAcordeon.tsx a propósito:
// ese archivo tiene 'use client' (usa useState para abrir/cerrar), y un
// archivo 'use client' convierte TODO lo que exporta en una referencia de
// cliente cuando se importa desde un componente de servidor — así que
// page.tsx (servidor) no podía leer PREGUNTAS como un array real para
// construir el schema de FAQPage ("PREGUNTAS.map is not a function" en el
// build). Al vivir aquí, en un archivo normal sin 'use client', ambos lados
// (el acordeón visual y el schema de datos estructurados) importan el mismo
// array real sin cruzar esa frontera.

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
