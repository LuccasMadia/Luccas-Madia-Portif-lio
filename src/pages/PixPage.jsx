import { useState } from 'react';
import { useParams } from 'react-router-dom';
import pixData from '../data/pix.json';
import './PixPage.css';

export function PixPage() {
  const { id } = useParams();
  const entrada = pixData[id];
  const [erroCompartilhar, setErroCompartilhar] = useState(false);
  const podeCompartilhar = typeof navigator.share === 'function';

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

  async function pagar() {
    setErroCompartilhar(false);
    try {
      await navigator.clipboard.writeText(entrada.codigo);
    } catch {
      // clipboard pode não estar disponível; segue tentando compartilhar
    }
    try {
      await navigator.share({ text: entrada.codigo });
    } catch (erro) {
      if (erro?.name !== 'AbortError') {
        setErroCompartilhar(true);
      }
    }
  }

  return (
    <main className="pix-page">
      <h1>{entrada.nome}</h1>
      {podeCompartilhar && (
        <button type="button" className="btn btn--primary" onClick={pagar}>Pagar com Pix</button>
      )}
      {erroCompartilhar && (
        <p className="pix-page__erro">
          Não foi possível abrir o compartilhamento. O código já foi copiado — abra seu banco e cole.
        </p>
      )}
      <p className="pix-page__instrucao">
        {podeCompartilhar
          ? 'Se seu banco não detectar automaticamente, cole o código na opção "Pix Copia e Cola".'
          : 'Abra o Pix no app do seu banco e cole o código na opção "Pix Copia e Cola".'}
      </p>
      <code className="pix-page__codigo">{entrada.codigo}</code>
      <button type="button" className="btn btn--outline" onClick={copiar}>Copiar</button>
    </main>
  );
}
