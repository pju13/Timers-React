import React from "react";
import { convertirSecondesEnHrMinSec, convertirHMNenSecondes, convertirSecondesEnPourcentage } from "../utils/temps";
import './CardCircle.css';
import { Horloge } from "../types/types";
import { useHorlogeStore } from "../store/useHorlogeStore";

type CardCircleProps = { horloge: Horloge };

export function CardCircle({ horloge }: CardCircleProps) {    
    const pauseHorloge = useHorlogeStore((state) => state.pauseHorloge);
    const removeHorloge = useHorlogeStore((state) => state.removeHorloge);

    const timerSet: string = convertirSecondesEnHrMinSec(convertirHMNenSecondes(horloge.timerSet), true);
    const isFinish: boolean = horloge.timerRemaining === 0 ? true : false;
    const isRunning: boolean = horloge.running;

    const colorBg = isFinish === true ? 'bg-orange-600' : 'transparent';
    const gradientClass = isFinish === true ? 'finish-box' : isRunning === true ? 'gradient-box' : 'finish-box';

    return (
        <div className={`card group relative ${gradientClass}`}>
            <button 
                className="btn btn-circle w-[15px] h-[15px] absolute top-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                onClick={() => removeHorloge(horloge.id)}>
                    X
            </button>

            <div className={`radial-progress ${colorBg} m-auto`} 
                style={{ "--value": convertirSecondesEnPourcentage(horloge), "--size": "11rem", "--thickness": "8px" } as React.CSSProperties}
                aria-valuenow={convertirSecondesEnPourcentage(horloge)} role="progressbar">{convertirSecondesEnHrMinSec(horloge.timerRemaining)}
            </div>
            <div className="absolute top-12">
                <p className="m-auto text-base">{timerSet}</p>
            </div>
            <div className="absolute bottom-7">
                <div className="card-body">
                    <div className="card-actions justify-center">
                    {isFinish === false ?
                        <div className="tooltip tooltip-bottom tooltip-warning opacity-0 transition-opacity duration-300 group-hover:opacity-100" data-tip={ horloge.running === true ? "Pause" : "Lecture" }>
                            {/* L'icône est pilotée par le store via swap-active : aucune source de vérité côté DOM */}
                            <button
                                type="button"
                                className={`swap ${horloge.running ? '' : 'swap-active'}`}
                                onClick={() => pauseHorloge(horloge.id)}
                                aria-label={horloge.running ? 'Mettre en pause' : 'Reprendre'}>
                                <span className="swap-on">▶</span>
                                <span className="swap-off">⏸</span>
                            </button>
                        </div>
                        : null
                    }
                    </div>
                </div>
            </div>
        </div>
    );
}
