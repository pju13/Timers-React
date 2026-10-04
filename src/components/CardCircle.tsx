import React from "react";
import { convertirSecondesEnHrMinSec, convertirHMNenSecondes, convertirSecondesEnPourcentage, formaterDuree } from "../utils/temps";
import { etatHorloge } from "../utils/etat";
import './CardCircle.css';
import { Horloge } from "../types/types";
import { useHorlogeStore } from "../store/useHorlogeStore";

type CardCircleProps = { horloge: Horloge };

// 60 graduations comme sur un cadran de minuteur, une plus longue toutes les 5
const GRADUATIONS = Array.from({ length: 60 }, (_, i) => (
    <line key={i}
        className={i % 5 === 0 ? 'majeure' : undefined}
        x1="100" y1="7" x2="100" y2={i % 5 === 0 ? 19 : 13}
        transform={`rotate(${i * 6} 100 100)`} />
));

export function CardCircle({ horloge }: CardCircleProps) {
    const pauseHorloge = useHorlogeStore((state) => state.pauseHorloge);
    const removeHorloge = useHorlogeStore((state) => state.removeHorloge);

    const duree = formaterDuree(convertirHMNenSecondes(horloge.timerSet));
    const etat = etatHorloge(horloge);
    const pourcentage = convertirSecondesEnPourcentage(horloge);
    const chiffres = convertirSecondesEnHrMinSec(horloge.timerRemaining);

    return (
        <article className="carte-minuteur" data-etat={etat} aria-label={`Minuteur de ${duree}`}>
            {/* --reste pilote la taille du disque : il rétrécit à mesure que le temps passe */}
            <div className="cadran"
                role="progressbar"
                aria-label="Temps restant"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={Math.round(pourcentage)}
                aria-valuetext={etat === 'termine' ? 'Terminé' : `Il reste ${formaterDuree(horloge.timerRemaining)}`}
                style={{ "--reste": pourcentage } as React.CSSProperties}>
                <svg className="cadran-graduations" viewBox="0 0 200 200" aria-hidden="true">{GRADUATIONS}</svg>
                <div className="cadran-disque" />
                <div className="cadran-moyeu">
                    {etat === 'termine'
                        ? <span className="cadran-termine">Terminé</span>
                        : <span className={`cadran-chiffres ${chiffres.length > 5 ? 'cadran-chiffres--long' : ''}`}>{chiffres}</span>
                    }
                    {etat === 'en-pause' ? <span className="cadran-etat">En pause</span> : null}
                </div>
            </div>

            <p className="text-encre-douce">sur {duree}</p>

            <div className="flex gap-2">
                {etat !== 'termine' ?
                    <button type="button" className="touche" onClick={() => pauseHorloge(horloge.id)}>
                        {horloge.running ? 'Pause' : 'Reprendre'}
                    </button>
                    : null
                }
                <button type="button" className="bouton-discret" onClick={() => removeHorloge(horloge.id)}>
                    Retirer
                </button>
            </div>
        </article>
    );
}
