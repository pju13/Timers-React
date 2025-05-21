import React from "react";
import { useStore } from "./Store/useStore";
import { convertirSecondesEnHrMinSec, convertirHMNenSecondes, convertirSecondesEnPourcentage } from "../assets/Utils/Utils";
import { Horloge } from "../Types/types";

export const Card: React.FC<{ horlogeProps: Horloge }> = ({ horlogeProps }) => {
    const pauseHorloge = useStore((state) => state.pauseHorloge);
    const removeHorloge = useStore((state) => state.removeHorloge);

    const timerSet: string = convertirSecondesEnHrMinSec(convertirHMNenSecondes(horlogeProps.timerSet), true);
    const isFinish: boolean = horlogeProps.timerRemaining === 0 ? true : false;

    const colorBg = isFinish === true ? 'bg-orange-600' : 'bg-green-600';
    const colorBorder = isFinish === true ? 'border-orange-600' : 'border-green-600';

    return (
        <div className={`card bg-base-100 w-55 rounded-m border-3 ${colorBorder}`}>
            <div className={`radial-progress ${colorBg} m-auto`} 
                style={{ "--value": convertirSecondesEnPourcentage(horlogeProps), "--size": "10rem", "--thickness": "15px" } /* as React.CSSProperties */ } 
                aria-valuenow={convertirSecondesEnPourcentage(horlogeProps)} role="progressbar">{convertirSecondesEnHrMinSec(horlogeProps.timerRemaining)}
            </div>
            <p className="m-auto mt-1">{timerSet}</p>
            <div className="card-body">
                <div className="card-actions justify-center">
                {isFinish === false ?
                    <button className="btn btn-dash btn-warning" onClick={() => pauseHorloge(horlogeProps.id)}>{ horlogeProps.running === true ? "⏸" : "▶" }</button>
                    : null
                }
                <button className="btn btn-dash btn-error" onClick={() => removeHorloge(horlogeProps.id)}>🗑</button>
                <p>id: {horlogeProps.id}</p>
                </div>
            </div>
        </div>
    )
}
