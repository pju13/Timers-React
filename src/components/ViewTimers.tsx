import { useHorlogeStore } from "../store/useHorlogeStore";
import { etatHorloge } from "../utils/etat";

// Résumé des minuteurs et actions globales ; le détail de chacun est sur son cadran
export function ViewTimers() {
    const horloges = useHorlogeStore((state) => state.horloges);
    const removeAll = useHorlogeStore((state) => state.removeAll);
    const removeOnlyStop = useHorlogeStore((state) => state.removeOnlyStop);
    const pauseAllHorloges = useHorlogeStore((state) => state.pauseAllHorloges);

    if (horloges.length === 0) return null;

    const etats = horloges.map(etatHorloge);
    const enCours = etats.filter((etat) => etat === 'en-cours').length;
    const enPause = etats.filter((etat) => etat === 'en-pause').length;
    const termines = etats.filter((etat) => etat === 'termine').length;

    const details = [
        enCours > 0 ? `${enCours} en cours` : null,
        enPause > 0 ? `${enPause} en pause` : null,
        termines > 0 ? `${termines} ${termines > 1 ? 'terminés' : 'terminé'}` : null,
    ].filter(Boolean).join(', ');

    return (
        <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2 border-t border-graphite/15 pt-4">
            <p aria-live="polite">
                <span className="font-semibold">{horloges.length} {horloges.length > 1 ? 'minuteurs' : 'minuteur'}</span>
                <span className="text-encre-douce"> : {details}</span>
            </p>

            <div className="flex flex-wrap gap-1 -mx-2.5">
                <button type="button" className="bouton-discret" disabled={enCours === 0} onClick={() => pauseAllHorloges()}>
                    Tout mettre en pause
                </button>
                <button type="button" className="bouton-discret" disabled={termines === 0} onClick={() => removeOnlyStop()}>
                    Retirer les terminés
                </button>
                <button type="button" className="bouton-discret" onClick={() => removeAll()}>
                    Tout retirer
                </button>
            </div>
        </div>
    );
}
