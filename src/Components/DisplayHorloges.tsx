import React, { useEffect } from "react";
import { useStore } from "./Store/useStore";
//import { Card } from "./Card";
import { CardCircle } from "./CardCircle";

export const DisplayHorloge: React.FC = () => {
    const horloges = useStore((state) => state.horloges);
    const stopHorloge = useStore((state) => state.stopHorloge);
    
    useEffect(() => {
        //console.log('mes horloges :', horloges);
        horloges.map((horloge) => {
            if (horloge.timerRemaining <= 0 && !horloge.stop) {
                stopHorloge(horloge.id);
            } 
        });
    }, [horloges, stopHorloge]);

    return (
        <>
            <div className="w-[1000px] grid grid-cols-4 gap-4">
                {horloges?.map((horloge) => 
                    <CardCircle key={horloge.id} horlogeProps={horloge} />
                )}
            </div>
        </>
    );
}
