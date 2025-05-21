import { Horloge } from "../../Types/types";

export function convertirSecondesEnHrMinSec(secondes: number, withLetters: boolean = false) {
    // Calculer les heures (HH) : Divise le nombre total de secondes par 3600 (le nombre de secondes dans une heure). 
    // Le quotient entier sera le nombre d'heures.
    let heure = Math.trunc(secondes / 3600).toString();    
    heure = heure.padStart(2, "0");

    // Calculer les minutes (MM) : Prends le reste des secondes après avoir calculé les heures (c'est-à-dire secondes mod3600) 
    // et divise-le par 60 (le nombre de secondes dans une minute). Le quotient entier sera le nombre de minutes.
    let minute = (Math.trunc((secondes % 3600) / 60)).toString();
    minute = minute.padStart(2, "0");

    // Calculer les secondes restantes (SS) : Le reste des secondes après avoir calculé les minutes sera le nombre de secondes restantes.
    let seconde = Math.trunc(secondes % 60).toString();
    seconde = seconde.padStart(2, "0");

    if (heure === "00" && minute !== "00") {
        return withLetters ? `${minute}m ${seconde}s` : `${minute}:${seconde}`;
    } 
    if (heure === "00" && minute === "00") {
        return withLetters ? `${seconde}s` : `${seconde}`;
    }

    return withLetters ? `${heure}h ${minute}m ${seconde}s` : `${heure}:${minute}:${seconde}`;
}

export function convertirHMNenSecondes(timer: string) {
    const [heure, minute, seconde] = timer.split(':').map(Number);
    return heure*3600 + minute*60 + seconde;
}

export function convertirSecondesEnPourcentage(horlogeProps: Horloge) {
    const sec = convertirHMNenSecondes(horlogeProps.timerSet);
    return (horlogeProps.timerRemaining / sec) * 100;
}
