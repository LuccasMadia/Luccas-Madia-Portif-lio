import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { PixPage } from './PixPage';

vi.mock('../data/pix.json', () => ({
  default: { 42: { nome: 'Popy', codigo: '00020126...CODIGO...6304ABCD' } },
}));

function renderizarEm(id) {
  return render(
    <MemoryRouter initialEntries={[`/pix/${id}`]}>
      <Routes>
        <Route path="/pix/:id" element={<PixPage />} />
      </Routes>
    </MemoryRouter>,
  );
}

describe('PixPage', () => {
  afterEach(() => {
    delete navigator.share;
  });

  it('mostra o nome e o código quando o id existe', () => {
    renderizarEm('42');
    expect(screen.getByText('Popy')).toBeInTheDocument();
    expect(screen.getByText('00020126...CODIGO...6304ABCD')).toBeInTheDocument();
  });

  it('copia o código ao clicar em Copiar', async () => {
    renderizarEm('42');
    const user = userEvent.setup();
    const escrever = vi.spyOn(navigator.clipboard, 'writeText').mockResolvedValue(undefined);
    await user.click(screen.getByRole('button', { name: 'Copiar' }));
    expect(escrever).toHaveBeenCalledWith('00020126...CODIGO...6304ABCD');
  });

  it('mostra mensagem de não encontrado quando o id não existe', () => {
    renderizarEm('999');
    expect(screen.getByText('Código Pix não encontrado.')).toBeInTheDocument();
  });

  it('sem suporte a Web Share, não mostra o botão Pagar com Pix', () => {
    renderizarEm('42');
    expect(screen.queryByRole('button', { name: 'Pagar com Pix' })).not.toBeInTheDocument();
  });

  it('com suporte a Web Share, copia o código e compartilha ao clicar em Pagar com Pix', async () => {
    navigator.share = vi.fn().mockResolvedValue(undefined);
    renderizarEm('42');
    const user = userEvent.setup();
    const escrever = vi.spyOn(navigator.clipboard, 'writeText').mockResolvedValue(undefined);
    await user.click(screen.getByRole('button', { name: 'Pagar com Pix' }));
    expect(escrever).toHaveBeenCalledWith('00020126...CODIGO...6304ABCD');
    expect(navigator.share).toHaveBeenCalledWith({ text: '00020126...CODIGO...6304ABCD' });
  });

  it('não mostra erro quando o usuário cancela o compartilhamento', async () => {
    const erroAbort = new Error('cancelado');
    erroAbort.name = 'AbortError';
    navigator.share = vi.fn().mockRejectedValue(erroAbort);
    renderizarEm('42');
    const user = userEvent.setup();
    vi.spyOn(navigator.clipboard, 'writeText').mockResolvedValue(undefined);
    await user.click(screen.getByRole('button', { name: 'Pagar com Pix' }));
    expect(screen.queryByText(/Não foi possível abrir o compartilhamento/)).not.toBeInTheDocument();
  });

  it('mostra mensagem de fallback quando o compartilhamento falha por outro motivo', async () => {
    navigator.share = vi.fn().mockRejectedValue(new Error('falhou'));
    renderizarEm('42');
    const user = userEvent.setup();
    vi.spyOn(navigator.clipboard, 'writeText').mockResolvedValue(undefined);
    await user.click(screen.getByRole('button', { name: 'Pagar com Pix' }));
    expect(await screen.findByText(/Não foi possível abrir o compartilhamento/)).toBeInTheDocument();
  });
});
