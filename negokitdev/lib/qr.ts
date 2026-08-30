import QRCode from 'qrcode'

// El QR siempre apunta a /e/{id} (nunca al slug) para que sobreviva
// aunque el emprendedor cambie el enlace de su página más adelante.
export async function generarQrDataUrl(emprendedorId: string) {
  const url = `${window.location.origin}/e/${emprendedorId}`
  return QRCode.toDataURL(url, { width: 400, margin: 2 })
}
