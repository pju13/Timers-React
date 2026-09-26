import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { useHorlogeStore } from './useHorlogeStore';
import { Horloge } from '../types/types';

const horloge = (surcharges: Partial<Horloge> = {}): Horloge => ({
    id: 'abc123',
    timerSet: '0:1:0',
    timerRemaining: 30,
    running: true,
    interval: 42,
    stop: false,
    ...surcharges,
});

// Injecte des horloges sans passer par addHorloge, pour ne pas lancer de vrai setInterval
const initialiserStore = (horloges: Horloge[]) => useHorlogeStore.setState({ horloges });
const horlogesDuStore = () => useHorlogeStore.getState().horloges;

describe('useHorlogeStore : immutabilité', () => {
    beforeEach(() => initialiserStore([]));
    afterEach(() => vi.restoreAllMocks());

    it('pauseAllHorloges ne modifie pas les horloges existantes', () => {
        const avant = horloge({ running: true });
        initialiserStore([avant]);

        useHorlogeStore.getState().pauseAllHorloges();

        // L'ancien objet est intact et le store en contient une nouvelle version
        expect(avant.running).toBe(true);
        expect(horlogesDuStore()[0]).not.toBe(avant);
        expect(horlogesDuStore()[0].running).toBe(false);
    });

    it('pauseAllHorloges ne touche pas aux horloges terminées', () => {
        const terminee = horloge({ id: 'fini', timerRemaining: 0, stop: true, running: true });
        initialiserStore([terminee]);

        useHorlogeStore.getState().pauseAllHorloges();

        // Référence conservée : rien n'a changé, rien à re-rendre
        expect(horlogesDuStore()[0]).toBe(terminee);
    });

    it('stopHorloge ne modifie pas l\'horloge existante et coupe son intervalle', () => {
        const clearIntervalEspion = vi.spyOn(globalThis, 'clearInterval');
        const avant = horloge();
        const autre = horloge({ id: 'autre' });
        initialiserStore([avant, autre]);

        useHorlogeStore.getState().stopHorloge('abc123');

        expect(avant.stop).toBe(false);
        expect(horlogesDuStore()[0]).not.toBe(avant);
        expect(horlogesDuStore()[0].stop).toBe(true);
        expect(horlogesDuStore()[1]).toBe(autre);
        expect(clearIntervalEspion).toHaveBeenCalledWith(42);
    });
});

// Aucun composant n'est monté ici : le store doit gérer seul la fin d'un minuteur
describe('useHorlogeStore : compte à rebours', () => {
    beforeEach(() => {
        vi.useFakeTimers();
        initialiserStore([]);
    });
    afterEach(() => {
        useHorlogeStore.getState().removeAll();
        vi.useRealTimers();
        vi.restoreAllMocks();
    });

    it('décompte une seconde à chaque tick', () => {
        useHorlogeStore.getState().addHorloge('0:0:20');

        vi.advanceTimersByTime(3000);

        expect(horlogesDuStore()[0].timerRemaining).toBe(17);
    });

    it('s\'arrête à 0 et coupe son intervalle', () => {
        const clearIntervalEspion = vi.spyOn(globalThis, 'clearInterval');
        useHorlogeStore.getState().addHorloge('0:0:15');
        const interval = horlogesDuStore()[0].interval;

        vi.advanceTimersByTime(15000);

        expect(horlogesDuStore()[0].timerRemaining).toBe(0);
        expect(horlogesDuStore()[0].stop).toBe(true);
        expect(clearIntervalEspion).toHaveBeenCalledWith(interval);
    });

    it('ne passe jamais en négatif', () => {
        useHorlogeStore.getState().addHorloge('0:0:15');

        vi.advanceTimersByTime(20000);

        expect(horlogesDuStore()[0].timerRemaining).toBe(0);
        expect(vi.getTimerCount()).toBe(0);
    });

    it('ne décompte pas pendant la pause', () => {
        useHorlogeStore.getState().addHorloge('0:0:20');
        useHorlogeStore.getState().pauseHorloge(horlogesDuStore()[0].id);

        vi.advanceTimersByTime(5000);

        expect(horlogesDuStore()[0].timerRemaining).toBe(20);
    });
});
