import { useParams } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import pixData from '../data/pix.json';
import './PixPage.css';

export function PixPage() {
  const { id } = useParams();
  const entrada = pixData[id];

  if (!entrada) {
    return (
      <main className="pix-page pix-page--vazia">
        <p>Código Pix não encontrado.</p>
      </main>
    );
  }

  async function copiar() {
    await navigator.clipboard.writeText(entrada.codigo);
  }

  return (
    <main className="pix-page">
      <h1>{entrada.nome}</h1>
      <p className="pix-page__instrucao">Abra o Pix no app do seu banco e escaneie o QR ou cole o código.</p>
      <div className="pix-page__qr">
        <QRCodeSVG value={entrada.codigo} size={240} />
      </div>
      <code className="pix-page__codigo">{entrada.codigo}</code>
      <button type="button" className="btn btn--primary" onClick={copiar}>Copiar</button>
    </main>
  );
}
