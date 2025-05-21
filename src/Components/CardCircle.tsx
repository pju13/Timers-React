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
        <div className={`card ${gradientClass}`}>
            <div className={`radial-progress ${colorBg} m-auto`} 
                style={{ "--value": convertirSecondesEnPourcentage(horlogeProps), "--size": "12rem", "--thickness": "10px" } /* as React.CSSProperties */ } 
                aria-valuenow={convertirSecondesEnPourcentage(horlogeProps)} role="progressbar">{convertirSecondesEnHrMinSec(horlogeProps.timerRemaining)}
            </div>
            <div className="absolute top-12">
                <p className="m-auto text-base">{timerSet}</p>
            </div>
            <div className="absolute bottom-7">
                <div className="card-body">
                    <div className="card-actions justify-center">
                    {isFinish === false ?
                        <button className="btn btn-dash " onClick={() => pauseHorloge(horlogeProps.id)}>{ horlogeProps.running === true ? "⏸" : "▶" }</button>
                        : null
                    }
                    <button className="btn btn-dash " onClick={() => removeHorloge(horlogeProps.id)}>🗑</button>
                    </div>
                </div>
            </div>
        </div>
    );
}
