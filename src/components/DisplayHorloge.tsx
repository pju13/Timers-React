import { useHorlogeStore } from "../store/useHorlogeStore";
import { CardCircle } from "./CardCircle";

export function DisplayHorloge() {
    const horloges = useHorlogeStore((state) => state.horloges);

    return (
        <>
            <div className="w-[1000px] grid grid-cols-4 gap-4">
                {horloges?.map((horloge) => 
                    <CardCircle key={horloge.id} horloge={horloge} />
                )}
            </div>
        </>
    );
}
