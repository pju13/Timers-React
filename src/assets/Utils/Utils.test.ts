import { describe, it, expect } from 'vitest';
import {
    convertirSecondesEnHrMinSec,
    convertirHMNenSecondes,
    convertirSecondesEnPourcentage,
} from './Utils';
import { Horloge } from '../../Types/types';

describe('convertirHMNenSecondes', () => {
    it('convertit une chaîne "hr:min:sec" en secondes', () => {
        expect(convertirHMNenSecondes('0:0:45')).toBe(45);
        expect(convertirHMNenSecondes('0:1:30')).toBe(90);
        expect(convertirHMNenSecondes('1:0:0')).toBe(3600);
        expect(convertirHMNenSecondes('2:2:5')).toBe(7325);
    });

    it('accepte les nombres rembourrés de zéros', () => {
        expect(convertirHMNenSecondes('01:01:01')).toBe(3661);
    });
});

describe('convertirSecondesEnHrMinSec', () => {
    it('affiche uniquement les secondes sous une minute', () => {
        expect(convertirSecondesEnHrMinSec(0)).toBe('00');
        expect(convertirSecondesEnHrMinSec(9)).toBe('09');
        expect(convertirSecondesEnHrMinSec(45)).toBe('45');
    });

    it('affiche min:sec sous une heure', () => {
        expect(convertirSecondesEnHrMinSec(60)).toBe('01:00');
        expect(convertirSecondesEnHrMinSec(90)).toBe('01:30');
        expect(convertirSecondesEnHrMinSec(3599)).toBe('59:59');
    });

    it('affiche hr:min:sec à partir d\'une heure', () => {
        expect(convertirSecondesEnHrMinSec(3600)).toBe('01:00:00');
        expect(convertirSecondesEnHrMinSec(3661)).toBe('01:01:01');
        expect(convertirSecondesEnHrMinSec(7325)).toBe('02:02:05');
    });

    it('utilise le format lettré quand withLetters vaut true', () => {
        expect(convertirSecondesEnHrMinSec(45, true)).toBe('45s');
        expect(convertirSecondesEnHrMinSec(90, true)).toBe('01m 30s');
        expect(convertirSecondesEnHrMinSec(3661, true)).toBe('01h 01m 01s');
    });

    it('est l\'inverse de convertirHMNenSecondes', () => {
        expect(convertirSecondesEnHrMinSec(convertirHMNenSecondes('02:02:05'))).toBe('02:02:05');
    });
});

describe('convertirSecondesEnPourcentage', () => {
    const horloge = (timerSet: string, timerRemaining: number): Horloge => ({
        id: 'test',
        timerSet,
        timerRemaining,
        running: true,
        interval: 0,
        stop: false,
    });

    it('rend 100 % au démarrage et 0 % à la fin', () => {
        expect(convertirSecondesEnPourcentage(horloge('0:1:0', 60))).toBe(100);
        expect(convertirSecondesEnPourcentage(horloge('0:1:0', 0))).toBe(0);
    });

    it('rend la proportion du temps restant', () => {
        expect(convertirSecondesEnPourcentage(horloge('0:1:0', 30))).toBe(50);
        expect(convertirSecondesEnPourcentage(horloge('1:0:0', 900))).toBe(25);
    });
});
