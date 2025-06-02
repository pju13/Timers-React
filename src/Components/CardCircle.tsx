import React from "react";
import { useStore } from "./Store/useStore";
import { convertirSecondesEnHrMinSec, convertirHMNenSecondes, convertirSecondesEnPourcentage } from "../assets/Utils/Utils";
import './CardCircle.css';
import { Horloge } from "../Types/types";

export const CardCircle: React.FC<{ horlogeProps: Horloge }> = ({ horlogeProps }) => {
    const pauseHorloge = useStore((state) => state.pauseHorloge);
    const removeHorloge = useStore((state) => state.removeHorloge);

    const timerSet: string = convertirSecondesEnHrMinSec(convertirHMNenSecondes(horlogeProps.timerSet), true);
    const isFinish: boolean = horlogeProps.timerRemaining === 0 ? true : false;
    const isRunning: boolean = horlogeProps.running;

    const colorBg = isFinish === true ? 'bg-orange-600' : 'transparent';
    const gradientClass = isFinish === true ? 'finish-box' : isRunning === true ? 'gradient-box' : 'finish-box';

    return (
        <div className={`card group relative ${gradientClass}`}>
            <button 
                className="btn btn-circle w-[15px] h-[15px] absolute top-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                onClick={() => removeHorloge(horlogeProps.id)}>
                    X
            </button>

            <div className={`radial-progress ${colorBg} m-auto`} 
                style={{ "--value": convertirSecondesEnPourcentage(horlogeProps), "--size": "11rem", "--thickness": "8px" } /* as React.CSSProperties */ } 
                aria-valuenow={convertirSecondesEnPourcentage(horlogeProps)} role="progressbar">{convertirSecondesEnHrMinSec(horlogeProps.timerRemaining)}
            </div>
            <div className="absolute top-12">
                <p className="m-auto text-base">{timerSet}</p>
            </div>
            <div className="absolute bottom-7">
                <div className="card-body">
                    <div className="card-actions justify-center">
                    {isFinish === false ?
                        <div className="tooltip tooltip-bottom tooltip-warning opacity-0 transition-opacity duration-300 group-hover:opacity-100" data-tip={ horlogeProps.running === true ? "Pause" : "Lecture" }>
                            <label className="swap">
                                <input type="checkbox" onClick={() => pauseHorloge(horlogeProps.id)} />
                                <div className="swap-on">▶</div>
                                <div className="swap-off">⏸</div>
                            </label>
                        </div>
                        : null
                    }
                    </div>
                </div>
            </div>
        </div>
    );
}
