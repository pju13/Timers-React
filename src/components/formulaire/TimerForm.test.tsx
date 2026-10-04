import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useHorlogeStore } from '../../store/useHorlogeStore';
import { TimerForm } from './TimerForm';

describe('TimerForm', () => {
    beforeEach(() => useHorlogeStore.setState({ horloges: [] }));
    // Les minuteurs lancés ont un vrai setInterval : on les coupe pour ne pas fuir entre les tests
    afterEach(() => useHorlogeStore.getState().removeAll());

    it('remplit les champs avec une durée courante puis lance le minuteur', async () => {
        const user = userEvent.setup();
        render(<TimerForm />);

        await user.click(screen.getByRole('button', { name: '5 min' }));
        expect(screen.getByRole('textbox', { name: 'Minutes' })).toHaveValue('05');

        await user.click(screen.getByRole('button', { name: 'Lancer le minuteur' }));
        expect(useHorlogeStore.getState().horloges.map((horloge) => horloge.timerSet)).toEqual(['0:5:0']);
    });

    it('refuse une durée de moins de 15 s avec un message dans le formulaire', async () => {
        const user = userEvent.setup();
        render(<TimerForm />);

        await user.clear(screen.getByRole('textbox', { name: 'Minutes' }));
        await user.type(screen.getByRole('textbox', { name: 'Secondes' }), '0');
        await user.click(screen.getByRole('button', { name: 'Lancer le minuteur' }));

        expect(await screen.findByText('Un minuteur dure au moins 15 s.')).toBeInTheDocument();
        expect(useHorlogeStore.getState().horloges).toHaveLength(0);
    });
});
