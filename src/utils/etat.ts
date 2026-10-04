import { Horloge } from "../types/types";

export type EtatHorloge = 'en-cours' | 'en-pause' | 'termine';

// Un seul endroit décide de l'état affiché : le cadran et la barre de résumé restent d'accord
export function etatHorloge(horloge: Horloge): EtatHorloge {
    if (horloge.timerRemaining === 0) return 'termine';
    return horloge.running ? 'en-cours' : 'en-pause';
}
