import { describe, it, expect, vi } from 'vitest';
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
  it('mostra o nome, o QR e o código quando o id existe', () => {
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
});
