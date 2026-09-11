'use client'
import { useState } from 'react'

// Lista de países pensada para el público de la app (España + Latinoamérica,
// que es de donde nos llegan casi todos los negocios y clientes), con
// "Otro país" al final por si acaso — así nadie se queda fuera aunque no
// esté en la lista. El prefijo +1 lo comparten varios países (México no,
// pero Rep. Dominicana y EE.UU. sí) — no pasa nada, cada uno es una opción
// aparte en el desplegable, solo comparten el mismo prefijo real.
export const PAISES_TELEFONO: { codigo: string; nombre: string; prefijo: string }[] = [
  { codigo: 'ES', nombre: 'España', prefijo: '+34' },
  { codigo: 'MX', nombre: 'México', prefijo: '+52' },
  { codigo: 'CO', nombre: 'Colombia', prefijo: '+57' },
  { codigo: 'AR', nombre: 'Argentina', prefijo: '+54' },
  { codigo: 'PE', nombre: 'Perú', prefijo: '+51' },
  { codigo: 'CL', nombre: 'Chile', prefijo: '+56' },
  { codigo: 'EC', nombre: 'Ecuador', prefijo: '+593' },
  { codigo: 'BO', nombre: 'Bolivia', prefijo: '+591' },
  { codigo: 'VE', nombre: 'Venezuela', prefijo: '+58' },
  { codigo: 'UY', nombre: 'Uruguay', prefijo: '+598' },
  { codigo: 'PY', nombre: 'Paraguay', prefijo: '+595' },
  { codigo: 'CR', nombre: 'Costa Rica', prefijo: '+506' },
  { codigo: 'PA', nombre: 'Panamá', prefijo: '+507' },
  { codigo: 'GT', nombre: 'Guatemala', prefijo: '+502' },
  { codigo: 'HN', nombre: 'Honduras', prefijo: '+504' },
  { codigo: 'SV', nombre: 'El Salvador', prefijo: '+503' },
  { codigo: 'NI', nombre: 'Nicaragua', prefijo: '+505' },
  { codigo: 'DO', nombre: 'Rep. Dominicana', prefijo: '+1' },
  { codigo: 'US', nombre: 'Estados Unidos', prefijo: '+1' },
  { codigo: 'CU', nombre: 'Cuba', prefijo: '+53' },
]

// Prefijos reales (sin duplicados), ordenados de más largo a más corto —
// así al leer un número ya guardado probamos primero "+593" antes que
// "+5" y no lo cortamos mal.
const PREFIJOS_UNICOS = Array.from(new Set(PAISES_TELEFONO.map((p) => p.prefijo))).sort(
  (a, b) => b.length - a.length
)

function paisPorPrefijo(prefijo: string) {
  return PAISES_TELEFONO.find((p) => p.prefijo === prefijo)
}

// Separa un número ya guardado (ej. "+593987654321") en país + resto de
// dígitos, para poder mostrarlo en el desplegable + campo de siempre. Si no
// reconocemos el prefijo, lo dejamos en "Otro país" con el prefijo tal cual
// venía, en vez de perder esos dígitos.
function separar(valor: string): { codigo: string; prefijoLibre: string; numero: string } {
  const limpio = (valor || '').trim()
  if (!limpio) return { codigo: 'ES', prefijoLibre: '', numero: '' }
  if (!limpio.startsWith('+')) return { codigo: 'ES', prefijoLibre: '', numero: limpio.replace(/\D/g, '') }
  const prefijo = PREFIJOS_UNICOS.find((p) => limpio.startsWith(p))
  if (!prefijo) {
    const coincidencia = limpio.match(/^\+\d{1,4}/)
    return { codigo: 'OTRO', prefijoLibre: coincidencia ? coincidencia[0] : '+', numero: limpio.replace(/^\+\d{1,4}/, '').replace(/\D/g, '') }
  }
  const pais = paisPorPrefijo(prefijo)
  return { codigo: pais?.codigo || 'OTRO', prefijoLibre: prefijo, numero: limpio.slice(prefijo.length).replace(/\D/g, '') }
}

// Campo de teléfono con selector de país — antes era un único campo de texto
// donde había que escribir el prefijo a mano ("+593...") si no eras de
// España, y muchos ni sabían que se podía. Ahora se elige el país en un
// desplegable (España por defecto) y solo se escriben los dígitos del móvil;
// por dentro se sigue guardando todo junto en un único texto ("+593...")
// exactamente igual que antes, así que no hace falta tocar la base de datos
// ni ningún otro sitio que ya use ese número.
export default function CampoTelefono({
  value,
  onChange,
  required,
  placeholderNumero = '600 123 456',
}: {
  value: string
  onChange: (valorCompleto: string) => void
  required?: boolean
  placeholderNumero?: string
}) {
  const inicial = separar(value)
  const [codigo, setCodigo] = useState(inicial.codigo)
  const [prefijoLibre, setPrefijoLibre] = useState(inicial.prefijoLibre || '+')
  const [numero, setNumero] = useState(inicial.numero)

  function emitir(nuevoCodigo: string, nuevoPrefijoLibre: string, nuevoNumero: string) {
    const prefijo =
      nuevoCodigo === 'OTRO'
        ? nuevoPrefijoLibre
        : PAISES_TELEFONO.find((p) => p.codigo === nuevoCodigo)?.prefijo || ''
    onChange(`${prefijo}${nuevoNumero}`)
  }

  return (
    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
      <select
        value={codigo}
        onChange={(e) => {
          setCodigo(e.target.value)
          emitir(e.target.value, prefijoLibre, numero)
        }}
        aria-label="País"
        style={{ flex: '0 0 auto', minWidth: 150 }}
      >
        {PAISES_TELEFONO.map((p) => (
          <option key={p.codigo} value={p.codigo}>
            {p.prefijo} {p.nombre}
          </option>
        ))}
        <option value="OTRO">Otro país…</option>
      </select>

      {codigo === 'OTRO' && (
        <input
          type="text"
          inputMode="tel"
          value={prefijoLibre}
          onChange={(e) => {
            let v = e.target.value.replace(/[^\d+]/g, '')
            if (!v.startsWith('+')) v = '+' + v.replace(/\+/g, '')
            else v = '+' + v.slice(1).replace(/\+/g, '')
            setPrefijoLibre(v)
            emitir(codigo, v, numero)
          }}
          placeholder="+000"
          aria-label="Prefijo del país"
          style={{ flex: '0 0 76px' }}
        />
      )}

      <input
        type="tel"
        inputMode="tel"
        value={numero}
        onChange={(e) => {
          const v = e.target.value.replace(/\D/g, '')
          setNumero(v)
          emitir(codigo, prefijoLibre, v)
        }}
        placeholder={placeholderNumero}
        maxLength={14}
        required={required}
        style={{ flex: '1 1 140px' }}
      />
    </div>
  )
}
