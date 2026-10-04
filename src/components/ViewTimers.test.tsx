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

describe('ViewTimers', () => {
    beforeEach(() => useHorlogeStore.setState({ horloges: [] }));

    it('ne s\'affiche pas sans minuteur', () => {
        const { container } = render(<ViewTimers />);

        expect(container).toBeEmptyDOMElement();
    });

    it('résume le nombre de minuteurs par état', () => {
        useHorlogeStore.setState({ horloges: [
            horloge({ id: 'a' }),
            horloge({ id: 'b', running: false }),
            horloge({ id: 'c', timerRemaining: 0, stop: true }),
            horloge({ id: 'd', timerRemaining: 0, stop: true }),
        ] });
        render(<ViewTimers />);

        expect(screen.getByText('4 minuteurs')).toBeInTheDocument();
        expect(screen.getByText(': 1 en cours, 1 en pause, 2 terminés')).toBeInTheDocument();
    });

    it('désactive les actions qui n\'ont rien à faire', () => {
        useHorlogeStore.setState({ horloges: [horloge({ running: false })] });
        render(<ViewTimers />);

        expect(screen.getByRole('button', { name: 'Tout mettre en pause' })).toBeDisabled();
        expect(screen.getByRole('button', { name: 'Retirer les terminés' })).toBeDisabled();
        expect(screen.getByRole('button', { name: 'Tout retirer' })).toBeEnabled();
    });
});
