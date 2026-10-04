import { useHorlogeStore } from "../store/useHorlogeStore";
import { CardCircle } from "./CardCircle";

export function DisplayHorloge() {
    const horloges = useHorlogeStore((state) => state.horloges);

    if (horloges.length === 0) {
        return <p className="text-encre-douce">Aucun minuteur pour l'instant. Choisis une durée, puis lance le minuteur.</p>;
    }

    return (
        // 2 cadrans par ligne sur mobile, jusqu'à 4 ou 5 sur grand écran
        <div className="grid grid-cols-[repeat(auto-fill,minmax(clamp(9.5rem,22vw,13rem),1fr))] gap-x-6 gap-y-12 pt-2">
            {horloges.map((horloge) =>
                <CardCircle key={horloge.id} horloge={horloge} />
            )}
        </div>
    );
}
