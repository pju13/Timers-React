import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { useHorlogeStore } from '../store/useHorlogeStore';
import { Horloge } from '../types/types';
import { ViewTimers } from './ViewTimers';

const horloge = (surcharges: Partial<Horloge> = {}): Horloge => ({
    id: 'abc123',
    timerSet: '0:1:0',
    timerRemaining: 30,
    running: true,
    interval: 0,
    stop: false,
    ...surcharges,
});

// La ligne <tr> qui contient la durée initiale de l'horloge
const ligneDe = (timerSet: string) => screen.getByText(timerSet).closest('tr');

describe('ViewTimers', () => {
    beforeEach(() => useHorlogeStore.setState({ horloges: [] }));

    it('applique la taille de texte et la couleur « en cours » à la ligne', () => {
        useHorlogeStore.setState({ horloges: [horloge()] });
        render(<ViewTimers />);

        expect(ligneDe('0:1:0')).toHaveClass('text-[12px]', 'bg-green-600');
    });

    it('colore en orange un minuteur terminé', () => {
        useHorlogeStore.setState({ horloges: [horloge({ timerRemaining: 0, stop: true })] });
        render(<ViewTimers />);

        expect(ligneDe('0:1:0')).toHaveClass('text-[12px]', 'bg-orange-600');
    });
});
