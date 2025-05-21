import React from "react";
import { useStore } from "./Store/useStore";
import { convertirSecondesEnHrMinSec } from "../assets/Utils/Utils";

export const ViewTimers: React.FC = () => {
    const horloges = useStore((state) => state.horloges);
    const removeAll = useStore((state) => state.removeAll);
    const removeOnlyStop = useStore((state) => state.removeOnlyStop);
    const pauseAllHorloges = useStore((state) => state.pauseAllHorloges);

    const horlogesDisplay = horloges?.map((horloge) => {
        const isFinish: boolean = horloge.timerRemaining === 0 ? true : false;

        let colorBg = isFinish === true ? 'bg-orange-600' : 'bg-green-600';
        colorBg = horloge.running === false ? '' : colorBg;

        const displayPauseIcon = horloge.running === false ? "⏸" : null;

        return <tr className={`className="text-[12px]" ${colorBg}`} key={horloge.id}>
            <td>{displayPauseIcon}</td>
            <td>{horloge.timerSet}</td>
            <td><span className="ml-4 mr-1">{convertirSecondesEnHrMinSec(horloge.timerRemaining)}</span></td>
            </tr>
    });

    return (
        <div className="fixed top-1 left-3 bg-gray-700 text-white border-2 border-solid p-2 rounded-lg">
            <h2 className="text-[14px]">Minuteurs en cours :</h2>

            <table className="table-fixed">
                <thead>
                    <tr>
                        <th>Pause</th>
                        <th>Time</th>
                        <th>Remaining</th>
                    </tr>
                </thead>
                <tbody>
                    {horlogesDisplay}
                </tbody>
            </table>

            {horlogesDisplay.length > 0 ? 
                <>
                <button className="btn btn-dash btn-error block mt-2" onClick={() => pauseAllHorloges()}>⏸ Pause Timers </button>
                <button className="btn btn-dash btn-error block mt-2" onClick={() => removeOnlyStop()}>🗑 Timers only stop</button>
                <button className="btn btn-dash btn-error block mt-2" onClick={() => removeAll()}>🗑 All Timers</button>
                </>
                : '<vide>'}
        </div>
    )
}
