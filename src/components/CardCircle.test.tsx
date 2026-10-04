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

const carte = () => screen.getByRole('article', { name: 'Minuteur de 1 min' });

describe('CardCircle', () => {
    it('affiche le temps restant et la durée initiale', () => {
        render(<CardCircle horloge={horloge()} />);

        expect(screen.getByRole('progressbar')).toHaveTextContent('30');
        expect(screen.getByText('sur 1 min')).toBeInTheDocument();
    });

    it('reflète la progression dans aria-valuenow', () => {
        render(<CardCircle horloge={horloge()} />);

        expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '50');
        expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuetext', 'Il reste 30 s');
    });

    it('affiche « Terminé » et masque le bouton pause quand le minuteur est terminé', () => {
        const { rerender } = render(<CardCircle horloge={horloge()} />);
        expect(screen.getByRole('button', { name: 'Pause' })).toBeInTheDocument();

        rerender(<CardCircle horloge={horloge({ timerRemaining: 0, stop: true })} />);
        expect(screen.queryByRole('button', { name: 'Pause' })).not.toBeInTheDocument();
        expect(screen.getByRole('progressbar')).toHaveTextContent('Terminé');
        expect(carte()).toHaveAttribute('data-etat', 'termine');
    });

    it('suit l\'état du store même quand la pause vient d\'ailleurs', () => {
        // Simule « Tout mettre en pause » : running change sans clic sur la carte
        const { rerender } = render(<CardCircle horloge={horloge({ running: true })} />);
        expect(carte()).toHaveAttribute('data-etat', 'en-cours');

        rerender(<CardCircle horloge={horloge({ running: false })} />);
        expect(carte()).toHaveAttribute('data-etat', 'en-pause');
        expect(screen.getByRole('button', { name: 'Reprendre' })).toBeInTheDocument();
        expect(screen.getByText('En pause')).toBeInTheDocument();
    });
});
