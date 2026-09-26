import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Horloge } from '../types/types';
import { CardCircle } from './CardCircle';

const horloge = (surcharges: Partial<Horloge> = {}): Horloge => ({
    id: 'abc123',
    timerSet: '0:1:0',
    timerRemaining: 30,
    running: true,
    interval: 0,
    stop: false,
    ...surcharges,
});

describe('CardCircle', () => {
    it('affiche le temps restant et la durée initiale', () => {
        render(<CardCircle horloge={horloge()} />);

        expect(screen.getByRole('progressbar')).toHaveTextContent('30');
        expect(screen.getByText('01m 00s')).toBeInTheDocument();
    });

    it('reflète la progression dans aria-valuenow', () => {
        render(<CardCircle horloge={horloge()} />);

        expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '50');
    });

    it('masque le bouton pause quand le minuteur est terminé', () => {
        const { rerender } = render(<CardCircle horloge={horloge()} />);
        expect(screen.getByRole('button', { name: 'Mettre en pause' })).toBeInTheDocument();

        rerender(<CardCircle horloge={horloge({ timerRemaining: 0, stop: true })} />);
        expect(screen.queryByRole('button', { name: 'Mettre en pause' })).not.toBeInTheDocument();
    });

    it('suit l\'état du store même quand la pause vient d\'ailleurs', () => {
        // Simule « Pause Timers » : running change sans clic sur la carte
        const { rerender } = render(<CardCircle horloge={horloge({ running: true })} />);
        const bouton = screen.getByRole('button', { name: 'Mettre en pause' });
        expect(bouton).not.toHaveClass('swap-active');

        rerender(<CardCircle horloge={horloge({ running: false })} />);
        expect(screen.getByRole('button', { name: 'Reprendre' })).toHaveClass('swap-active');
    });
});
