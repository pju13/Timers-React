import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { CardCircle } from './CardCircle';
import { Horloge } from '../Types/types';

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
        render(<CardCircle horlogeProps={horloge()} />);

        expect(screen.getByRole('progressbar')).toHaveTextContent('30');
        expect(screen.getByText('01m 00s')).toBeInTheDocument();
    });

    it('reflète la progression dans aria-valuenow', () => {
        render(<CardCircle horlogeProps={horloge()} />);

        expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '50');
    });

    it('masque le bouton pause quand le minuteur est terminé', () => {
        const { rerender } = render(<CardCircle horlogeProps={horloge()} />);
        expect(screen.getByRole('checkbox')).toBeInTheDocument();

        rerender(<CardCircle horlogeProps={horloge({ timerRemaining: 0, stop: true })} />);
        expect(screen.queryByRole('checkbox')).not.toBeInTheDocument();
    });
});
